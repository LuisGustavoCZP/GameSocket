import express, { Router } from 'express';
import { MatchController } from '../controllers';
const router : Router = express.Router();

router.get("/modes", MatchController.modes);
router.get("/search", MatchController.search);
//router.post("/insert", MatchController.insert);

//router.get("/", UserController.info);

export default router;