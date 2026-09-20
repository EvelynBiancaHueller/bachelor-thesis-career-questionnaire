import { ProfileStep } from "@/components/shared/info/info-profile-step";
import { ProfileData, Step } from "@/model/types";

type GetInfoProfileProps = {
    profileData: ProfileData;
    onProfileChange: (field: keyof ProfileData, value: string) => void;
    readOnly?: boolean;
};

export function getNonGamifiedInfoSteps({
    profileData,
    onProfileChange,
    readOnly = false,
}: GetInfoProfileProps): Step[] {
    return [
        {
            id: "about",
            title: "About This Questionnaire",
            body: (
                <>
                    This career interest questionnaire was created as part of a research study.
                    <br />
                    <br />
                    The short profile questions on the next page help us understand how people of different ages, backgrounds and experiences respond to the questionnaire. 
                    Your data and answers are <strong>completely anonymous</strong> and will only be used for research purposes.
                    <br />
                    <br />
                    By continuing you agree that we can process your data for this study.
                    <br />
                    <br />
                    <strong>Note:</strong> The best experience is guranteed on mobile.
                </>
            ),
        },
        {
            id: "profile",
            title: "Profile Questions",
            body: (
                <ProfileStep
                    profileData={profileData}
                    onChange={onProfileChange}
                    readOnly={readOnly}
                />
            )
        },
        {
            id: "explanation",
            title: "Information",
            body: (
                <>
                    Along the way, you’ll encounter 60 short statements for which you’ll choose how much you would enjoy doing it:
                    <br />
                    <br />
                    Try <strong>NOT</strong> to think about:
                    <br />
                    1. Whether you have the skills or training right now
                    <br />
                    2. How much money the job might make
                    <br />
                    <br />
                    <strong>Your task:</strong> Focus only on whether the activity sounds enjoyable to you.
                </>
            )
        },
        {
            id: "last",
            title: "Information",   
            body: (
                <>
                    There are no right or wrong answers - this is about you.
                    <br />
                    <br />
                    Take your time. You can change your answers anytime before finishing the questions.
                    <br />
                    <br />
                    Your data and responses are <strong>completely anonymous</strong> and will only be used to provide your results and, if applicable, for research.
                </>
            )
        },
    ];
}
