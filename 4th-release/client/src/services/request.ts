import { APIResponse } from "../models";

class Request 
{
    private async request (url: string, options: any) : Promise<APIResponse>
    {
        return await fetch(url, options)
        .then(resp => { return resp.json()})
        .catch((error : Error) => 
        {
            console.log(error);
            return {data:null, messages:[]};
        });
    }

    public async get (url : string) : Promise<APIResponse>
    {
        return await this.request(url, 
        {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    public async post (url : string, body : any) : Promise<APIResponse>
    {
        return await this.request(url, 
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });
    }
}

export default new Request();