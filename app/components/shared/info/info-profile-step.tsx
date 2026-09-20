import { ProfileData } from "@/model/types";

type ProfileStepProps = {
    profileData: ProfileData;
    onChange: (field: keyof ProfileData, value: string) => void;
    readOnly?: boolean;
};

export function ProfileStep({ profileData, onChange, readOnly = false }: ProfileStepProps) {
    const fieldClass = `w-full mb-5 rounded-lg text-base border px-3 py-2 transition ${
        readOnly 
            ? "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed opacity-90"
            : "border-gray-100 bg-white text-ink"
    }`;

    const labelClass = `block text-xl ${
        readOnly ? "text-gray-600" : "text-ink"
    }`;

    const age = Number(profileData.age);
    const isAgeValid = 
        profileData.age !== "" &&
        age >= 10 &&
        age <= 100;

    return (
        <div>
            <div className="grid grid-cols-2 items-center gap-4 pr-3">
                <label htmlFor="gender" className={`${labelClass} mb-1`}>
                    Gender
                </label>
                <select 
                    id="gender" 
                    name="gender"
                    value={profileData.gender}
                    onChange={(e) => onChange("gender", e.target.value)}
                    disabled={readOnly} 
                    className={fieldClass}
                >
                    <option value="" disabled>Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="diverse">Diverse</option>
                </select>
            </div>

            <div className="grid grid-cols-2 items-center gap-4 pr-3">
                <label htmlFor="age" className={`${labelClass} mb-5`}>
                    Age
                </label>

                <input
                    id="age"
                    name="age"
                    type="number"
                    min={10}
                    max={100}
                    step={1}
                    value={profileData.age}
                    onChange={(e) => onChange("age", e.target.value)}
                    disabled={readOnly} 
                    className={fieldClass}
                    placeholder="Enter age"
                />

                {profileData.age !== "" && !isAgeValid && !readOnly ? (
                    <p className="col-start-2 -mt-4 mb-3 text-sm text-red-600">
                        Please enter a valid age between 10 and 100.
                    </p>
                ) : null}
            </div>

            <div className="grid grid-cols-2 items-center gap-4 pr-3">
                <label htmlFor="education" className={`${labelClass} mb-5`}>
                    Education Level
                </label>
                <select 
                    id="education" 
                    name="education"
                    value={profileData.education}
                    onChange={(e) => onChange("education", e.target.value)}
                    disabled={readOnly}  
                    className={fieldClass}
                >
                    <option value="" disabled>Select Education</option>
                    <option value="middle-school">Middle School</option>
                    <option value="high-school">High School</option>
                    <option value="vocational">Vocational School</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="master">Master</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="grid grid-cols-2 items-center gap-4 pr-3">
                <label htmlFor="question_career_test" className={`${labelClass} mb-5`}>
                    Have you ever taken a career interest test before?
                </label>
                <select 
                    id="question_career_test" 
                    name="question_career_test" 
                    value={profileData.question_career_test}
                    onChange={(e) => onChange("question_career_test", e.target.value)}
                    disabled={readOnly}  
                    className={fieldClass}
                >
                    <option value="" disabled>Select Answer</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>
            </div>

            <div className="grid grid-cols-2 items-center gap-4 pr-3">
                <label htmlFor="question_career_chosen" className={`${labelClass} mb-5`}>
                    Have you already chosen a career?
                </label>
                <select 
                    id="question_career_chosen" 
                    name="question_career_chosen" 
                    value={profileData.question_career_chosen}
                    onChange={(e) => onChange("question_career_chosen", e.target.value)}
                    disabled={readOnly} 
                    className={fieldClass}
                >
                    <option value="" disabled>Select Answer</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>
            </div>
        </div>
    )
}