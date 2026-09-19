import { supabase } from "@/lib/db/initSupabase";
import { AnswersByStage, OpenAnswers, PostAnswers } from "@/model/types";

export async function getStageAnswers(userId: number): Promise<AnswersByStage> {
    const {data: answerRows, error: answerError} = await supabase
        .from("answer")
        .select("question_id, answer_option_id")
        .eq("user_id", userId);

    if (answerError) throw new Error(`Failed to fetch answers: ${answerError.message}`);

    if (!answerRows || answerRows.length === 0) return {};

    const questionIds = [...new Set(answerRows.map((row) => row.question_id))];

    const {data: questionRows, error: questionError} = await supabase
        .from("question")
        .select("id, story_id")
        .in("id", questionIds);

    if (questionError) throw new Error(`Failed to fetch question di and story_id: ${questionError.message}`);

    const storyIdByQuestionId = Object.fromEntries(
        (questionRows ?? []).map((row) => [row.id, row.story_id])
    );

    const answersByStage: AnswersByStage = {};

    for (const row of answerRows) {
        const storyId = storyIdByQuestionId[row.question_id];

        if (!storyId) continue;

        if (!answersByStage[storyId]) {
            answersByStage[storyId] = {};
        }

        answersByStage[storyId][row.question_id] = row.answer_option_id;
    }

    return answersByStage;
}

export async function getAnswers(userId: number | undefined): Promise<Record<number, number>> {
    const {data: answerRows, error: answerError} = await supabase
        .from("answer")
        .select("question_id, answer_option_id")
        .eq("user_id", userId);

    if (answerError) throw new Error(`Failed to fetch answers: ${answerError.message}`);

    if (!answerRows || answerRows.length === 0) return {};

    return Object.fromEntries(
        answerRows.map((answer) => [
            answer.question_id,
            answer.answer_option_id
        ])
    );
}

export async function getPostAnswers(userId: number): Promise<PostAnswers> {
    const {data, error} = await supabase
        .from("post_answer")
        .select("id, question_id, answer_value")
        .eq("user_id", userId);

    if (error) throw new Error(`Failed to fetch post answers: ${error.message}`);

    const postAnswers: PostAnswers = {};

    for (const row of data ?? []) {
        postAnswers[row.question_id] = row.answer_value;
    }

    return postAnswers;
}

export async function getOpenAnswers(userId: number): Promise<OpenAnswers> {
    const {data, error} = await supabase
        .from("open_answer")
        .select("id, question_id, answer")
        .eq("user_id", userId);

    if (error) throw new Error(`Failed to fetch open answers: ${error.message}`);

    const openAnswers: OpenAnswers = {};

    for (const row of data ?? []) {
        openAnswers[row.question_id] = row.answer;
    }

    return openAnswers;
}
