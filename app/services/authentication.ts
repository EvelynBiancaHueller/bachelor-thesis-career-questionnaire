import { supabase } from "@/lib/db/initSupabase";
import { ApplicationUser } from "@/model/entities/user";
import { ProfileData, QuestionnaireVersion } from "@/model/types";

export async function ensureUserRow(profileData: ProfileData, questionnaireVersion: QuestionnaireVersion): Promise<number> {
    const authUser = await ensureAnonymousUser();

    const { data, error } = await supabase
        .from("user")
        .select("id")
        .eq("auth_user_id", authUser.id)
        .limit(1);

    if (error) throw error;
    if (data && data.length > 0) return data[0].id;

    const { data: insertedRow, error: insertError } = await supabase
        .from("user")
        .insert({
            auth_user_id: authUser.id,
            gender: profileData.gender,
            age: profileData.age,
            education: profileData.education,
            career_test: profileData.question_career_test,
            career_chosen: profileData.question_career_chosen,
            questionnaire_version: questionnaireVersion,
        })
        .select("id")
        .single();

    if (insertError) throw insertError;

    return insertedRow.id;
}

export async function restoreUser(): Promise<ApplicationUser | null> {
    const {data: sessionData, error: sessionError} = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!sessionData.session) return null;

    const {data: userData, error: userError} = await supabase.auth.getUser();

    if (!userData.user) return null;

    const {data, error} = await supabase
        .from("user")
        .select("id, gender, age, education, career_test, career_chosen, questionnaire_version")
        .eq("auth_user_id", userData.user.id)
        .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    return data[0];
}

export async function signOut() {
    const {data: sessionData, error: sessionError} = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    if (!sessionData.session) return;

    const {error: signOutError} = await supabase.auth.signOut({scope: "local"});

    if (signOutError) throw signOutError;
}

async function ensureAnonymousUser() {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    if (sessionData.session) {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
            throw userError;
        }

        if (!userData.user) {
            throw new Error("Session exists, but no user was returned.");
        }

        return userData.user;
    }

    const { error: signInError } = await supabase.auth.signInAnonymously();

    if (signInError) throw signInError;

    const { data: newUserData, error: newUserError } = await supabase.auth.getUser();

    if (newUserError) throw newUserError;
    if (!newUserData.user) throw new Error("Anonymous sign-in succeeded, but no user was returned.");

    return newUserData.user;
}
