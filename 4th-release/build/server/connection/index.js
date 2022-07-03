"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class Connections {
    constructor(listener) {
        this.listeners = {
            http: listener.httpServer,
            https: listener.httpsServer
        };
        this.http = new socket_io_1.Server(listener.httpServer);
        this.https = new socket_io_1.Server(listener.httpsServer);
    }
    on(event, action) {
        this.http.on(event, action);
        this.https.on(event, action);
    }
    onclose(action) {
        this.listeners.http.on('close', action);
        this.listeners.https.on('close', action);
    }
}
exports.default = Connections;
