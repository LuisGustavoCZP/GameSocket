import express, { Router } from 'express';
import { UserController } from '../controllers';
const router : Router = express.Router();

router.post("/login", UserController.login);

router.post("/register", UserController.register);

router.get("/", (req, res) => 
{
    res.send("pipo");
});

export default router;