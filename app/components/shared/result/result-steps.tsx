import { ResultScore } from "../result/result-score";
import { PostQuestionnaire } from "./post-questionnaire/post-questionnaire";
import { LikertValue, OpenAnswers, OpenQuestion, PostAnswers, Step } from "@/model/types";
import { PostQuestion } from "@/model/entities/post-question";
import { RiasecChartItem } from "@/services/results";
import { OpenEndedQuestion } from "./post-questionnaire/open-questions";
import { ForwardingPage } from "./result-forwarding";

type ResultStepsProps = {
    riasecData: RiasecChartItem[];
    topThreeResults: string[];
    postQuestions: PostQuestion[];
    postAnswers: PostAnswers;
    openQuestions: OpenQuestion[];
    openAnswers: OpenAnswers;
    readOnlyPost: boolean;
    readOnlyOpen: boolean;
    onAnswerChange: (questionId: number, value: LikertValue) => void;
    onOpenAnswerChange: (questionId: number, answer: string) => void;
};

export function ResultSteps({
    riasecData,
    topThreeResults,
    postQuestions,
    postAnswers,
    openQuestions,
    openAnswers,
    readOnlyPost = false,
    readOnlyOpen = false,
    onAnswerChange: onAnswerChange,
    onOpenAnswerChange: onOpenAnswerChange,
}: ResultStepsProps): Step[] {
    return [
        {
            id: "post-questionnaire",
            title: "Post Questionnaire",
            body: (
                <PostQuestionnaire
                    questions={postQuestions}
                    answers={postAnswers}
                    onAnswerChange={onAnswerChange}
                    readOnly={readOnlyPost}
                />
            )
        },
        {
            id: "open-questionnaire",
            title: "Open Questions",
            body: (
                <OpenEndedQuestion
                    questions={openQuestions}
                    answers={openAnswers}
                    readOnly={readOnlyOpen}
                    onAnswerChange={onOpenAnswerChange}
                />
            )
        },
        {
            id: "result",
            title: "",
            body: (
                <ResultScore
                    riasecData={riasecData}
                    topThreeResults={topThreeResults}
                />
            )
        },
        {
            id: "forwarding",
            title: "",
            body: (
                <ForwardingPage/>
            )
        },
    ]
}
