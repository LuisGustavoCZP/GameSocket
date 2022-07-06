import certs from "./certs";

const ports = {
    http:8000,
    https:8001
};

const security = {
    saltRounds:10,
    secret:"jacareperneta"
}

const sessionConfig = {
    get expiration () : number { return sessionConfig.expirationTime * sessionConfig.minute },
    expirationTime: .5,
    minute: 60*1000
}

export { certs, ports, security, sessionConfig };