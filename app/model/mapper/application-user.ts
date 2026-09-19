import { ApplicationUser } from "../entities/user";
import { ProfileData } from "../types";

export function mapApplicationUserToProfileData(user: ApplicationUser) : ProfileData {
    return {
        gender: user.gender ?? "",
        age: String(user.age ?? ""),
        education: user.education ?? "",
        question_career_test: user.career_test ? "yes" : "no",
        question_career_chosen: user.career_chosen ? "yes" : "no",
    };
}
