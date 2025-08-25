// src/Routes/eventRoutes.ts
import express from "express";
import {createEventHandler,getEventsHandler,getEventHandler,updateEventHandler,deleteEventHandler,} from "@app/Controllers/eventController";


const event = express.Router();


event.post("/", createEventHandler);
event.get("/", getEventsHandler);
event.get("/:id", getEventHandler);
event.put("/:id", updateEventHandler);
event.delete("/:id", deleteEventHandler);


export default event;
