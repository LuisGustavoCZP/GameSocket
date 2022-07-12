import express, { Router } from 'express';
import userRoute from "./user";
import matchRoute from "./match";

const router : Router = express.Router();

router.use("/user", userRoute);
router.use("/match", matchRoute);

export default router;