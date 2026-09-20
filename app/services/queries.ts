import { OpenAnswers, PostAnswers, ProfileData } from "@/model/types";
import { supabase } from "../lib/db/initSupabase";
import { Badge } from "@/model/entities/badge";
import { Answer } from "@/model/entities/question";

/****************************************************************************************
 * 
 * Getters
 * 
 ****************************************************************************************/

export async function getStories() {
    const { data, error } = await supabase
        .from("story")
        .select("id, title, description, source")
        .order("id", { ascending: true });
    
    if (error) {
        throw new Error(`Failed to fetch stories: ${error.message}`);
    }

    return data ?? [];
}

export async function getQuestions() {
    const { data, error } = await supabase
        .from("question")
        .select("id, text, scale, story_id, imagery")
        .order("id", { ascending: true })
        .order("story_id", { ascending: true });
    
    if (error) {
        throw new Error(`Failed to fetch questions: ${error.message}`);
    }

    return data ?? [];
}

export async function getStageDataMap() {
    const [stories, questions] = await Promise.all([
        getStories(),
        getQuestions(),
    ]);

    const questionsByStoryId = questions.reduce<Record<number, typeof questions>>((acc, question) => {
        const storyId = Number(question.story_id);

        if (!acc[storyId]) {
            acc[storyId] = [];
        }

        acc[storyId].push(question);
        return acc;
    }, {});

    const stageDataMap = stories.reduce<Record<number, 
            {
                story: (typeof stories)[number];
                questions: typeof questions;
            }
        >
        >((acc, story) => {
            const storyId = Number(story.id);
            
            acc[storyId] = {
                story,
                questions: questionsByStoryId[storyId] ?? [],
            };

            return acc;
    }, {});

    return stageDataMap;
}

export async function getAnswerOptions() {
    const { data, error } = await supabase
        .from("answer_option")
        .select("id, value, text")
        .order("id", { ascending: true })
    
    if (error) {
        throw new Error(`Failed to fetch answer_option: ${error.message}`);
    }

    return data ?? [];
}

export async function getBadges() {
    const { data, error } = await supabase
        .from("badge")
        .select("id, description, threshold, source")
        .order("id", { ascending: true })
    
    if (error) {
        throw new Error(`Failed to fetch badges: ${error.message}`);
    }

    const badges = data.reduce<
            Record<number, Badge>
        >
        ((acc, badge) => {
            const badgeId = Number(badge.id);

            acc[badgeId] = badge;
            return acc;
    }, {});

    return badges;
}

export async function getQuestionsToUnlockBadges() {
    const { data, error } = await supabase
        .from("badge_questions")
        .select("badge_id, question_id")
        .order("badge_id", { ascending: true })
    
    if (error) {
        throw new Error(`Failed to fetch questions for unlocking badges: ${error.message}`);
    }

    const map = data.reduce<
            Record<number, number[]>
        >
        ((acc, entry) => {
            const badgeId = Number(entry.badge_id);
            const questionId = Number(entry.question_id);

            if (!acc[badgeId]) {
                acc[badgeId] = [];
            }

            acc[badgeId].push(questionId);
            return acc;
    }, {});

    return map;
}

export async function getPostQuestions() {
    const { data, error } = await supabase
        .from("post_question")
        .select("id, text, scale, reverse")
        .order("id", {ascending: true});
    
    if (error) throw new Error(`Failed to fetch questions for post questionnaire: ${error.message}`);

    return data ?? [];
}

export async function getOpenQuestions() {
    const { data, error } = await supabase
        .from("open_question")
        .select("id, text")
        .order("id", {ascending: true});
    
    if (error) throw new Error(`Failed to fetch questions for open questionnaire: ${error.message}`);

    return data ?? [];
}

/****************************************************************************************
 * 
 * Setters
 * 
 ****************************************************************************************/

export async function insertStageAnswers(answers: Answer[]) {
    const rows = answers.map((answer) => {
        return {
            user_id: answer.user_id,
            question_id: answer.question_id,
            answer_option_id: answer.answer_option_id,
        };
    });

    const { error } = await supabase.from("answer").insert(rows);

    if (error) throw new Error(`Failed to insert stage answers: ${error.message}`);
}

export async function insertAnswer(questionId: number, answerOptionId: number, userId: number) {
    const row = {
        user_id: userId, 
        question_id: questionId,
        answer_option_id: answerOptionId
    }
    
    const { error } = await supabase.from("answer").upsert(row, {onConflict: "user_id,question_id"});

    if (error) throw new Error(`Failed to insert answer: ${error.message}`);
}

export async function insertProfileInput(input: ProfileData) {
    const row = {
        gender: input.gender,
        age: input.age,
        education: input.education,
        career_test: input.question_career_test,
        career_chosen: input.question_career_chosen
    };

    const { error } = await supabase.from("user").insert(row);

    if (error) throw new Error(`Failed to insert user: ${error.message}`);
}

export async function insertPostAnswers(userId: number, postAnswers: PostAnswers) {
    const rows = Object.entries(postAnswers).map(([questionId, value]) => ({
        user_id: userId,
        question_id: questionId,
        answer_value: value,
    }));

    const { error } = await supabase.from("post_answer").insert(rows);

    if (error) throw new Error(`Failed to insert post answers: ${error.message}`);
}

export async function insertOpenAnswers(userId: number, openAnswers: OpenAnswers) {
    const rows = Object.entries(openAnswers).map(([questionId, answer]) => ({
        user_id: userId,
        question_id: questionId,
        answer: answer,
    }));

    const { error } = await supabase.from("open_answer").insert(rows);

    if (error) throw new Error(`Failed to insert open answers: ${error.message}`);
}
