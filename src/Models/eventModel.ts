import pool from "@app/DB/db";
import { Event } from "@app/Utils/Types/eventType";


//create an event

export const createEvent = async (event: Event) => {
  const result = await pool.query(
    `INSERT INTO events (title, description, start_date, end_date, created_by) 
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [event.title, event.description, event.start_date, event.end_date, event.created_by]
  );
  return result.rows[0];
};

//get all the events
export const getAllEvents = async () => {
  const result = await pool.query(`SELECT * FROM events ORDER BY start_date ASC`);
  return result.rows;
};

//get an event by ID
export const getEventById = async (id: string) => {
  const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);
  return result.rows[0];
};
 
//update an event
export const updateEvent = async (id: string, event: Partial<Event>) => {
  const result = await pool.query(
    `UPDATE events 
     SET title = COALESCE($1, title), 
         description = COALESCE($2, description), 
         start_date = COALESCE($3, start_date), 
         end_date = COALESCE($4, end_date),
         updated_at = NOW()
     WHERE id = $5 
     RETURNING *`,
    [event.title, event.description, event.start_date, event.end_date, id]
  );
  return result.rows[0];
};

//delete an event

export const deleteEvent = async (id: string) => {
  await pool.query(`DELETE FROM events WHERE id = $1`, [id]);
  return { message: "Event deleted successfully" };
};