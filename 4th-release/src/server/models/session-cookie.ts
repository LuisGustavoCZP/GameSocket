import { Response } from "express";
import Session from "./session";

interface SessionCookie {
    res : Response
    session : Session
}

export default SessionCookie;