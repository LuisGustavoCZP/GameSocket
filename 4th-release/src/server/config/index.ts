import certs from "./certs";

const ports = {
    http:3000,
    https:3001
};

const security = {
    saltRounds:10
}

const sessionConfig = {
    get expiration () : number { return sessionConfig.expirationTime * sessionConfig.minute },
    expirationTime: .5,
    minute: 60*1000
}

export { certs, ports, security, sessionConfig };