import { checkSchema } from "express-validator";

const tokenSchema = checkSchema({
    token: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Token is required",
        },
        trim: true,
    },
});

const loginSchema = checkSchema({
    email: {
        in: ["body"],
        isEmail: {
            errorMessage: "Invalid email",
        },
        trim: true,
    },
    password: {
        in: ["body"],
        isLength: {
            errorMessage: "Password should be at least 6 chars long",
            options: { min: 6 },
        },
    },
});

const registerSchema = checkSchema({
    email: {
        in: ["body"],
        isEmail: {
            errorMessage: "Invalid email",
        },
        trim: true,
    },
    fullName: {
        in: ["body"],
        errorMessage: "Fullname is required",
        trim: true,
    },
    password: {
        in: ["body"],
        isLength: {
            errorMessage: "Password should be at least 6 chars long",
            options: { min: 6 },
        },
    },
    confirmPassword: {
        in: ["body"],
        isLength: {
            errorMessage: "Password should be at least 6 chars long",
            options: { min: 6 },
        },
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Password confirmation does not match password");
                }
                return true;
            },
        },
    },
    role: {
        in: ["body"],
        errorMessage: "Role is required",
        trim: true,
        toLowerCase: true,
        custom: {
            options: (value, { req }) => {
                // if (!["applicant", "employer"].includes(value)) {
                //     throw new Error("Invalid role");
                // }
                return true;
            },
        }
    }
});

const resetPasswordSchema = checkSchema({
    password: {
        in: ["body"],
        isLength: {
            errorMessage: "Password should be at least 6 chars long",
            options: { min: 6 },
        },
    },
    confirmPassword: {
        in: ["body"],
        isLength: {
            errorMessage: "Password should be at least 6 chars long",
            options: { min: 6 },
        },
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Password confirmation does not match password");
                }
                return true;
            },
        },
    },
});

export { loginSchema, registerSchema, resetPasswordSchema, tokenSchema };