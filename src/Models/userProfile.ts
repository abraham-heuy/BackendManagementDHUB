import pool from "@app/DB/db";
import { Profile } from "@app/Utils/Types/profileType";

//create  a profile
export const createProfile = async (profile: {
  user_id: string;
  bio?: string;
  skills?: string[];
  startup_idea?: string;
  stage?: "pre-incubation" | "incubation" | "startup";
}): Promise<Profile> => {
  const result = await pool.query<Profile>(
    `INSERT INTO student_profiles (user_id, bio, skills, startup_idea, stage)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [profile.user_id, profile.bio ?? null, profile.skills ?? [], profile.startup_idea ?? null, profile.stage ?? "pre-incubation"]
  );
  return result.rows[0];
};

//get all the profiles: 
export const getProfileByUserId = async (user_id: string): Promise<Profile | null> => {
  const result = await pool.query<Profile>(
    `SELECT * FROM student_profiles WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0] || null;
};

//update the profile

export const updateProfile = async (
  user_id: string,
  updates: Partial<Omit<Profile, "id" | "user_id" | "created_at" | "updated_at">>
): Promise<Profile | null> => {
  const fields = [];
  const values: any[] = [];
  let index = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${index++}`);
    values.push(value);
  }

  if (fields.length === 0) return getProfileByUserId(user_id);

  values.push(user_id);

  const result = await pool.query<Profile>(
    `UPDATE student_profiles 
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE user_id = $${index}
     RETURNING *`,
    values
  );

  return result.rows[0] || null;
};

//delete the profile
export const deleteProfile = async (user_id: string): Promise<boolean> => {
  const result = await pool.query(
    `DELETE FROM student_profiles WHERE user_id = $1`,
    [user_id]
  );
  return (result.rowCount ?? 0) > 0; // Fallback to 0 if somehow null
};


