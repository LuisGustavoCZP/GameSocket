import * as http from "http";
import * as https from "https";
import { AddressInfo } from "net";
import { certs, ports } from "./config";

class Server 
{
    public httpServer : http.Server;
    public httpsServer : https.Server;

    constructor (routes: any)
    {
        this.httpServer = http.createServer(routes);
        this.httpsServer = https.createServer(certs, routes);
    }

    public listen ()
    {
        this.httpServer.listen(ports.http, () =>
        {
            const a = this.httpServer.address() as AddressInfo;
            console.log(`> Server listening on http://${a.address=="::"?"localhost":a.address}:${ports.http}`);
        });

        this.httpsServer.listen(ports.https, () =>
        {
            const a = this.httpsServer.address() as AddressInfo;
            console.log(`> Server listening on https://${a.address=="::"?"localhost":a.address}:${ports.https}`);
        });
    }
}

export default Server;