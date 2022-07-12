import { Response } from "express";
import Session from "./session";

interface SessionCookie {
    sessionId:string
    userId:string
}

export default SessionCookie;