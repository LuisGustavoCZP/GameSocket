import { Response } from "express";
import { APIResponse } from "../models";

class ResponseWriter
{
    public error (res: Response, error : Error): void
    {
        const [ statusCode, messages ] = error.message.split(": ");
            
        if(Number(statusCode))
        {
            res.status(Number(statusCode)).json({
                data:null,
                messages: messages.replace(/[|]$/, "").split("|")
            } as APIResponse);
        } 
        else
        {
            res.status(500).json({
                data:null,
                messages:["unexpected error occurrence"]
            } as APIResponse);
        }
    }

    public success (res: Response, statusCode: number, response: APIResponse): void
    {
        res.status(statusCode).json(response);
    }
}

export default ResponseWriter;