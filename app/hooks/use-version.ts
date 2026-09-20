"use client";

import { QuestionnaireVersion } from "@/model/types";
import { useEffect, useState } from "react";

export function useQuestionnaireVersion(version: string | undefined, isRestoringUser: boolean) {
  const [questionnaireVersion, setQuestionnaireVersion] = useState<QuestionnaireVersion | null>(null);
  
  useEffect(() => {
    if (isRestoringUser) return;

    if (version) {
      if (version === "gamified") {
        setQuestionnaireVersion("gamified");
      } else if (version === "non-gamified") {
        setQuestionnaireVersion("non-gamified");
      }
    } else {
        setQuestionnaireVersion(assignRandomQuestionnaireVersion());
    }
  }, [version, isRestoringUser]);

  return questionnaireVersion;
}

function assignRandomQuestionnaireVersion(): QuestionnaireVersion {
  const values = new Uint8Array(1);
  crypto.getRandomValues(values);

  return values[0] < 128 ? "gamified" : "non-gamified";
}
