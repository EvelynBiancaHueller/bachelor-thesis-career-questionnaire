"use client";

import { Roadmap } from "@/components/gamified-version/roadmap/roadmap";
import { StageOverlay } from "./stage/stage-overlay";
import { BadgeOverlay } from "@/components/gamified-version/badge-collection/badge-overlay";
import { insertOpenAnswers, insertPostAnswers, insertStageAnswers } from "@/services/queries";
import { ResultsOverlay } from "@/components/shared/result/result-overlay";
import { ProfileData } from "@/model/types";
import { useInfo } from "@/hooks/use-info";
import { useResult } from "@/hooks/use-result";
import { useStage } from "@/hooks/use-stage";
import { useBadge } from "@/hooks/use-badge";
import { useGamifiedDataLoader } from "@/hooks/use-data-loader";
import { useCallback, useEffect, useMemo } from "react";
import { useUser, UseUserResult } from "@/hooks/use-user";
import { STAGE_IDS } from "./stage/constants";
import { mapApplicationUserToProfileData } from "@/model/mapper/application-user";
import { getInfoSteps } from "./info/info-steps";
import { InfoOverlay } from "./info/info-overlay";

type GamifiedQuestionnaireProps = {
  user: UseUserResult;
};

export function GamifiedQuestionnaire({user}: GamifiedQuestionnaireProps) {  
  /**********************************************************************************
   * Initial Data Load 
   **********************************************************************************/
  const data = useGamifiedDataLoader();
  const storiesById = useMemo(() => {
    return Object.fromEntries(
      Object.values(data.stageDataMap).map((stageData) => [stageData.story.id, stageData.story])
    );
  }, [data.stageDataMap]);

  const handleDataError = useCallback((message: string) => {
    data.setDataError(message);
  }, [data.setDataError]);

  useEffect(() => {
    const key = "initial-roadmap-scroll-down";

    if (sessionStorage.getItem(key)) return;

    const scrollToBottom = () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
      sessionStorage.setItem(key, "true");
    };

    const id = window.requestAnimationFrame(() => {
      window.setTimeout(scrollToBottom, 500);
    });

    return () => window.cancelAnimationFrame(id);
  }, []);

  /**********************************************************************************
   * Stage Overlay 
  **********************************************************************************/
 const stage = useStage({
   stageDataMap: data.stageDataMap,
   dataLoading: data.dataLoading,
   userId: user.userId,
   onPersistStageAnswers: insertStageAnswers,
   onError: handleDataError,
  });
  
  /**********************************************************************************
   * Badge Overlay 
   **********************************************************************************/
  const badge = useBadge({
    badges: data.badges,
    answerOptions: data.answerOptions,
    questionsToUnlockBadges: data.questionsToUnlockBadges,
    answersByStage: stage.answersByStage,
    completedStages: stage.completedStages
  });

  /**********************************************************************************
   * Info Overlay 
   **********************************************************************************/
  const completeInfo = async (profileData: ProfileData) => {
    try {
      await user.createUser(profileData, "gamified");
      stage.addCompletedStage(0);
      stage.unlockStage(STAGE_IDS[0]);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      badge.openBadge();
    } catch (error) {
      console.error("Failed to create user", error);
      data.setDataError?.("We couldn't save your data right now.");
    }
  }

  const info = useInfo({onComplete: completeInfo});

  const infoSteps = getInfoSteps({
    profileData: info.profileData,
    onProfileChange: info.handleProfileChange,
    readOnly: info.readOnly,
  });

  useEffect(() => {
    if (!user.user) return;
    info.hydrateRestoredProfileData(mapApplicationUserToProfileData(user.user));
  }, [user.user?.id]);

  /**********************************************************************************
   * Result Overlay 
   **********************************************************************************/
  const result = useResult({
    userId: user.userId,
    onSubmitPostAnswers: async (answers) => {
      if (!user.userId) throw new Error("No user found.");
      await insertPostAnswers(user.userId, answers);
    },
    onSubmitOpenAnswers: async (answers) => {
      if (!user.userId) throw new Error("No user found.");
      await insertOpenAnswers(user.userId, answers);
    },
    onError: handleDataError,
  });
  

  return (
    <main>
      {data.dataError ? (<div className="p-4 text-red-600">{data.dataError}</div>) : null}

      <Roadmap 
        unlockedStages={stage.unlockedStages}
        storiesById={storiesById}
        completedStages={stage.completedStages}
        onInfoClick={info.openInfo}
        onStageClick={stage.openStage}
        onBadgeClick={badge.openBadge}
        onResultsClick={result.openResult}
      />

      <InfoOverlay
        readOnly={info.readOnly}
        open={info.open}
        onComplete={info.complete}
        steps={infoSteps}
        stepIndex={info.stepIndex}
        onPrev={info.goToPrevStep}
        onNext={() => info.goToNextStep(infoSteps.length)}
        onClose={info.closeInfo}
        isNextDisabled={infoSteps[info.stepIndex]?.id === "profile" && !info.isProfileComplete}
      />

      <ResultsOverlay
        readOnlyPost={result.readOnlyPost}
        readOnlyOpen={result.readOnlyOpen}
        open={result.open}
        onSubmitPostAnswers={() => result.submitPostAnswers()}
        onSubmitOpenAnswers={() => result.submitOpenAnswers()}
        stepIndex={result.stepIndex}
        onPrev={result.goToPrevStep}
        onNext={result.goToNextStep}
        onClose={result.closeResult}
        onComplete={result.complete}
        answersByStage={stage.answersByStage}
        postQuestions={data.postQuestions}
        postAnswers={result.postAnswers}
        openQuestions={data.openQuestions}
        openAnswers={result.openAnswers}
        onAnswerChange={result.handlePostAnswerChange}
        onOpenAnswerchange={result.handleOpenAnswerChange}
      />

      <StageOverlay
        readOnly={stage.readOnly}
        open={stage.open}
        stageId={stage.activeStage}
        story={stage.story}
        questions={stage.questions}
        answerOptions={data.answerOptions}
        answers={stage.activeStage ? stage.answersByStage[stage.activeStage] ?? {} : {}}
        onAnswerChange={(questionId, answerOptionId) => {
          if (!stage.activeStage) return;
          stage.setStageAnswer(stage.activeStage, questionId, answerOptionId);
        }}
        onClose={stage.closeStage}
        onComplete={stage.completeStage}
      />

      <BadgeOverlay
        open={badge.open}
        onClose={badge.closeBadge}
        collectedBadgeIds={badge.collectedBadgeIds}
        allBadges={data.badges}
      />
    </main>
  );
}


