import express, { Router } from 'express';
import { UserController } from '../controllers';
const router : Router = express.Router();

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/register", UserController.register);

router.get("/", UserController.info);

export default router;