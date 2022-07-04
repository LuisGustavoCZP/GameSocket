import fs from "fs";
import * as https from "https";

const options : https.ServerOptions = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
};

export default options;