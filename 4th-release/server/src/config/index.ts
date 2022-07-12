import certs from "./certs";
import matchConfig from "./match";

const ports = {
    http:8000,
    https:8001
};

const security = {
    saltRounds:10,
    secret:"jacareperneta"
};

const sessionConfig = {
    get expiration () : number { return sessionConfig.expirationTime * sessionConfig.minute },
    expirationTime: .5,
    minute: 60*1000
};

const validatorConfig = {
    password:{min:6, max:6},
    username:{min:4, max:8}
};



export { certs, ports, security, sessionConfig, validatorConfig, matchConfig };