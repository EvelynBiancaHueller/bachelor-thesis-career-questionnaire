import { ProfileStep } from "../../shared/info/info-profile-step";
import { ProfileData, Step } from "@/model/types";

type GetInfoProfileProps = {
    profileData: ProfileData;
    onProfileChange: (field: keyof ProfileData, value: string) => void;
    readOnly?: boolean;
};

export function getInfoSteps({
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
            id: "welcome",
            title: "Welcome To Your Interest Journey",
            body: (
                <>
                    Get ready to explore - this journey is all about discovering what truly excites you and how those interests connect to the world of work.
                    <br />
                    <br />
                    Think of yourself as an explorer, traveling through different settings. Each stage will challenge you to reflect on activities you might enjoy.
                </>
            )
        },
        {
            id: "explanation",
            body: (
                <>
                    Along the way, you’ll encounter 60 short statements for which you’ll choose how much you would enjoy doing it:
                    <br />
                    <br />
                    <div className="flex flex-col items-center">
                    <img src="/icons/utility/answer-options.svg" width="90%"/>
                    </div>
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
            body: (
                <>
                    There are no right or wrong answers — this is about you.
                    <br />
                    <br />
                    Take your time, explore at your own pace and let your curiosity guide you. You can change your answers anytime before finishing a stage.
                    <br />
                    <br />
                    Your data and responses are <strong>completely anonymous</strong> and will only be used to provide your results and, if applicable, for research.
                    <br />
                    <br />
                    When you’re ready, step into the first stage and start exploring your interests.
                </>
            )
        },
    ];
}
