import { Router } from "express";
import { AdminUserController } from "../controllers/index.js";

const router = Router();
const userController = new AdminUserController();

router.get('/users', async (req, res) => {
    try {
        return res.status(200).json(await userController.allUsers())

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err })
    }
})

export default router;