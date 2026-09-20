"use client"

import { ProfileData } from "@/model/types";
import { useState } from "react";

type UseInfoOptions = {
  onComplete?: (profileData: ProfileData) => Promise<void> | void;
};

const INITIAL_PROFILE_DATA: ProfileData = {
    gender: "",
    age: "",
    education: "",
    question_career_test: "",
    question_career_chosen: "",
}

export function useInfo(options: UseInfoOptions) {
    const { onComplete } = options;
    
    const [open, setOpen] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [readOnly, setReadOnly] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>(INITIAL_PROFILE_DATA);

    const age = Number(profileData.age);
    const isAgeValid = 
        profileData.age !== "" &&
        age >= 10 &&
        age <= 100;

    const isProfileComplete = Object.values(profileData).every((value) => value.trim() !== "") && isAgeValid;

    function openInfo() {
        setStepIndex(0);
        setOpen(true);
    }
    
    function closeInfo() {
        setOpen(false);
        setStepIndex(0);
    }

    function goToPrevStep() {
        setStepIndex((i) => Math.max(0, i - 1));
    }
    
    function goToNextStep(totalSteps: number) {
        setStepIndex((i) => Math.min(totalSteps - 1, i + 1));
    }

    function handleProfileChange(field: keyof ProfileData, value: string) {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function hydrateRestoredProfileData(restoredProfileData: ProfileData) {
        setProfileData(restoredProfileData);
        setReadOnly(true);
    }

    async function complete() {
        if (readOnly) {
            closeInfo();
            return;
        }
        
        await onComplete?.(profileData);
        
        setReadOnly(true);
        closeInfo();
    }

    return {
        open,
        stepIndex,
        readOnly,
        profileData,
        isProfileComplete,
        openInfo,
        closeInfo,
        goToPrevStep,
        goToNextStep,
        handleProfileChange,
        hydrateRestoredProfileData,
        complete,
    };
}