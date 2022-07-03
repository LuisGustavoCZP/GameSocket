"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const config_1 = require("./config");
class Server {
    constructor(routes) {
        this.httpServer = http.createServer(routes);
        this.httpsServer = https.createServer(config_1.certs, routes);
    }
    listen() {
        this.httpServer.listen(config_1.ports.http, () => {
            const a = this.httpServer.address();
            console.log(`> Server listening on http://${a.address == "::" ? "localhost" : a.address}:${config_1.ports.http}`);
        });
        this.httpsServer.listen(config_1.ports.https, () => {
            const a = this.httpsServer.address();
            console.log(`> Server listening on https://${a.address == "::" ? "localhost" : a.address}:${config_1.ports.https}`);
        });
    }
}
exports.default = Server;
