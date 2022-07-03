import express, { Router } from 'express';
const router : Router = express.Router();

router.get("/", (req, res) => 
{
    res.send("pipo");
});

export default router;