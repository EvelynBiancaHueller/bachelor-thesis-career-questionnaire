"use client";

import { ApplicationUser } from "@/model/entities/user";
import { ProfileData, QuestionnaireVersion } from "@/model/types";
import { useEffect, useState } from "react";

type UseUserOptions = {
    onCreateUser: (profileData: ProfileData, questionnaireVersion: QuestionnaireVersion) => Promise<number>;
    onRestoreUser: () => Promise<ApplicationUser | null>;
    onError?: (message: string) => void;
};

export type UseUserResult = {
  userId: number | null;
  user: ApplicationUser | null;
  isCreatingUser: boolean;
  isRestoringUser: boolean;
  createUser: (
    profileData: ProfileData,
    questionnaireVersion: QuestionnaireVersion
  ) => Promise<number>;
};

export function useUser({onCreateUser, onRestoreUser, onError}: UseUserOptions): UseUserResult {
    const [userId, setUserId] = useState<number | null>(null);
    const [user, setUser] = useState<ApplicationUser | null>(null);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isRestoringUser, setIsRestoringUser] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function restoreUser() {
            try {
                const restoredUser = await onRestoreUser();

                if (!cancelled && restoredUser) {
                    setUser(restoredUser);
                    setUserId(restoredUser.id ?? null);
                }
            } catch (error) {
                console.error("Failed to restore user", error);
                if (!cancelled) onError?.("We couldn't restore your progress.");
            } finally {
                if (!cancelled) setIsRestoringUser(false);
            }
        }

        void restoreUser();

        return () => {
            cancelled = true;
        };
    }, [onRestoreUser]);

    async function createUser(profileData: ProfileData, questionnaireVersion: QuestionnaireVersion): Promise<number> {
        setIsCreatingUser(true);

        try {
            const nextUserId = await onCreateUser(profileData, questionnaireVersion);
            setUserId(nextUserId);
            return nextUserId;
        } finally {
            setIsCreatingUser(false);
        }
    }

    return {
        userId,
        user,
        isCreatingUser,
        isRestoringUser,
        createUser,
    };
}
