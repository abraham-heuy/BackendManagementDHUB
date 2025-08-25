// src/Models/userModel.ts
import pool from "@app/DB/db";

// ========== FIND OR CREATE USER ==========
export const findOrCreateUserByClerkId = async (
  clerkId: string,
  email: string,
  fullName: string
) => {
  // Check if user exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE clerk_id = $1",
    [clerkId]
  );

  if (existingUser.rows.length > 0) {
    return existingUser.rows[0];
  }

  // Create new user
  const newUser = await pool.query(
    `INSERT INTO users (clerk_id, email, full_name)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [clerkId, email, fullName]
  );

  const user = newUser.rows[0];

  // Assign default role = student
  const studentRole = await pool.query(
    "SELECT id FROM roles WHERE name = $1",
    ["student"]
  );

  if (studentRole.rows.length > 0) {
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)`,
      [user.id, studentRole.rows[0].id]
    );
  }

  return user;
};

// ========== GET USER WITH ROLES & PERMISSIONS ==========
export const getUserWithRoles = async (userId: number) => {
  const result = await pool.query(
    `
    SELECT 
      u.id, u.clerk_id, u.email, u.full_name,
      json_agg(DISTINCT r.name) AS roles,
      json_agg(DISTINCT p.name) AS permissions
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    LEFT JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = $1
    GROUP BY u.id
    `,
    [userId]
  );

  return result.rows[0];
};

// ========== GET ALL USERS ==========
export const getAllUsers = async () => {
  const result = await pool.query("SELECT id, clerk_id, email, full_name FROM users");
  return result.rows;
};

// ========== GET SINGLE USER ==========
export const getUserById = async (id: number) => {
  const result = await pool.query(
    "SELECT id, clerk_id, email, full_name FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

// ========== UPDATE USER ==========
export const updateUser = async (
  id: number,
  fullName: string,
  email: string
) => {
  const result = await pool.query(
    `UPDATE users 
     SET full_name = $1, email = $2
     WHERE id = $3
     RETURNING id, clerk_id, email, full_name`,
    [fullName, email, id]
  );
  return result.rows[0];
};

// ========== DELETE USER ==========
export const deleteUser = async (id: number) => {
  await pool.query("DELETE FROM user_roles WHERE user_id = $1", [id]); // cleanup roles
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return { message: "User deleted successfully" };
};
