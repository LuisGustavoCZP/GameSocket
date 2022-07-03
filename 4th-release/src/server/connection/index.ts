import { Server } from 'socket.io';
import Listener from "../server";

class Connections 
{
    public listeners;
    public http : any;
    public https : any;

    constructor (listener : Listener)
    {
        this.listeners = {
            http:listener.httpServer, 
            https:listener.httpsServer
        };
        this.http = new Server(listener.httpServer);
        this.https = new Server(listener.httpsServer);
    }

    public on (event:string, action : void)
    {
        this.http.on(event, action);
        this.https.on(event, action);
    }

    public onclose (action : void | any)
    {
        this.listeners.http.on('close', action);
        this.listeners.https.on('close', action);
    }
}

export default Connections;