"use client";

import { useCallback, useState } from "react";
import { GamifiedQuestionnaire } from "./components/gamified-version/gamified-questionnaire";
import { NonGamifiedQuestionnaire } from "./components/non-gamified-version/non-gamified-questionnaire";
import { useUser } from "./hooks/use-user";
import { useQuestionnaireVersion } from "./hooks/use-version";
import { ensureUserRow, restoreUser } from "./services/authentication";

export default function Home() {
  const [dataError, setDataError] = useState<string | null>(null);

  const handleDataError = useCallback((message: string) => {
    setDataError(message);
  }, []);

  const user = useUser({
    onCreateUser: ensureUserRow, 
    onRestoreUser: restoreUser,
    onError: handleDataError,
  });
  
  const assignedVersion = useQuestionnaireVersion(user.user?.questionnaire_version);

  if (assignedVersion === null) return <main className="p-6">Loading...</main>;
  
  if (assignedVersion === "non-gamified") return (<NonGamifiedQuestionnaire user={user}/>);

  return (
    <GamifiedQuestionnaire
      user={user}
    />
  );
}
