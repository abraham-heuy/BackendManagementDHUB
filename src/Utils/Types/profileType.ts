export interface Profile{
    id:string;
    user_id:string;
    bio: string | null;
    skills: string[];
    startup_idea: string | null;
    stage: "pre-incubation" | "incubation" | "startup"
    created_at: Date;
    updated_at: Date;
}