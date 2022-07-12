import fs from "fs";
import * as https from "https";

const options : https.ServerOptions = {
    key: fs.readFileSync('./src/security/cert.key'),
    cert: fs.readFileSync('./src/security/cert.pem')
};

export default options;