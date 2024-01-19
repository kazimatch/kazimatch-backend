import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { UserService } from "../services/user.service.js";
import e from "express";

/**
 * Extracts the token from the request header and verifies it. 
 * If the token is valid, the user is added to the request object.
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 * @returns 
 */
const authMiddleware = async (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) return res.status(401).send({
        message: "Unauthorized"
    });

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await new UserService().getById(decoded.id);

        if (!user.refreshToken) {
            return res.status(401).send({
                message: "Unauthorized - Session Logged Out"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            message: "Unauthorized - Session Expired"
        });
    }
};


/**
 * Ensures that the user has admin privileges.
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 * @returns 
 */
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).send({
        message: "Forbidden"
    });
    next();
}

/**
 * Ensures that the user has recruiter or admin privileges.
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 * @returns 
 */
const recruiterMiddleware = (req, res, next) => {
    const role = req.user.role;
    if (role === 'admin' || role == 'recruiter') {
        next()
        return;
    }

    return res.status(403).send({
        message: "Forbidden",
    });
}



export {
    authMiddleware,
    adminMiddleware,
    recruiterMiddleware
};