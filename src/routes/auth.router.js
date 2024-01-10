import { Router } from "express";
import { AuthController } from "../controllers/index.js";
import { authMiddleware, loginSchema, registerSchema, resetPasswordSchema, tokenSchema } from "../middleware/index.js";
import { query, validationResult } from "express-validator";
import e from "express";
import { verifyToken } from "../utils/crypt.js";
import { config } from "../config/config.js";
import chalk from "chalk";

const router = Router();
const authController = new AuthController();


router.post("/login", loginSchema, async (/**@type {e.Request} */req, /**@type {e.Response} */ res) => {
    try {
        const result = validationResult(req);

        if (!result.isEmpty()) return res.status(400).send({ message: result.array()[0].msg });

        authController
            .login(req.body).then((user) => {
                if (!user) return res.status(401).send({ message: "Invalid credentials" });
                return res.status(200).send(user);
            }).catch((err) => {
                return res.status(401).send({ message: err.message });
            });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.post("/register", registerSchema, async (/**@type {e.Request} */req, /**@type {e.Response} */ res) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) return res.status(400).send({ message: result.array()[0].msg });

        const user = await authController.register(req.body);
        return res.status(201).send(user);
    } catch (error) {
        console.log(chalk.red(error));
        return res.status(500).send({ message: error.message });
    }
});

router.post("/logout", authMiddleware, async (/**@type {e.Request} */req, /**@type {e.Response} */ res) => {
    try {
        const result = await authController.logout(req.user.id);
        if (!result) return res.status(400).send({ message: "Couldn't logout" });
        return res.status(200).send({ message: "Logout successfully" });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

router.post("/refresh", tokenSchema, async (/**@type {e.Request} */req, /**@type {e.Response} */ res) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) return res.status(400).send({ message: result.array()[0].msg });

        const user = await authController.refreshToken(req.body.token);
        if (!user) return res.status(400).send({ message: "Invalid token" });
        return res.status(201).send(user);

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

router.get("/forgot-password",
    query("email", "Invalid email")
        .notEmpty()
        .trim()
        .isEmail(),
    async (/**@type {e.Request} */req, /**@type {e.Response} */ res) => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) return res.status(400).send({ message: result.array()[0].msg });

            const state = await authController.forgotPassword(req.query.email);
            if (!state) return res.status(400).send({ message: "Couldn't send email" });

            return res.status(200).send({ message: "Email sent successfully" });
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    });

router.get("/reset-password",
    query('token', 'Invalid token')
        .notEmpty()
        .trim(),
    async (req, res) => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) return res.status(400).send({ message: result.array()[0].msg });
            res.send(`Click this link to reset your password: <a href="${config.App.baseUrl}/api/${config.VERSION}/auth/reset-password?token=${req.query.token}">Reset password</a>`)
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    });

router.post("/reset-password",
    resetPasswordSchema,
    query("token", "Invalid token")
        .notEmpty()
        .trim(),
    async (/**@type {e.Request} */req, /**@type {e.Response} */ res) => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) return res.status(400).send({ message: result.array()[0].msg });

            const response = await authController.resetPassword(req.query.token, req.body.password);
            if (!response) return res.status(400).send({ message: "Couldn't reset password" });

            return res.status(200).send({ message: "Password reset successfully" });
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(500).send({ message: err.message });
        }
    });

router.get("/verify", (/**@type {e.Request} */req, /**@type {e.Response} */ res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).send({ message: "Invalid token" });

        const decoded = verifyToken(token);
        authController.verifyEmail(decoded.id).then((state) => res.send("<b>Success!</b>")).catch((err) => {
            return res.send("<b>Failed!</b>");
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

export default router;