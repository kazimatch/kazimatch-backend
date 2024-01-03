import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";
import { UserController } from "../controllers/index.js";

const router = Router();
const userController = new UserController();

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await userController.getAllUsers();
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await userController.getUser(req.user.id);
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.patch("/me", authMiddleware, async (req, res) => {
    try {
        const result = await userController.updateUser(req.user.id, req.body);
        if (!result) return res.status(400).send({ message: "Couldn't update the resource" });
        return res.status(200).send({ message: "Resource updated successfully" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});
router.delete("/me", authMiddleware, async (req, res) => {
    try {
        const result = await userController.deleteUser(req.user.id);
        return res.status(200).send({ deleted: result });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});



export default router;