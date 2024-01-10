import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";
import { UserController } from "../controllers/index.js";
import { body, checkSchema, param } from "express-validator";

const router = Router();
const userController = new UserController();

// -------------- Admin User Routes -------------- //

router.get("/", authMiddleware, adminMiddleware, async (_, res) => {
    try {
        const users = await userController.getAllUsers();
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await userController.getUser(parseInt(req.params.id));
        if (!user) return res.status(404).send({ message: "User not found" });
        
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.patch("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const result = await userController.updateUser(req.params.id, req.body);
        if (!result) return res.status(400).send({ message: "Couldn't update the resource" });
        return res.status(200).send({ message: "Resource updated successfully" });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const result = await userController.deleteUser(req.params.id);
        return res.status(200).send({ deleted: result });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});


// -------------- User Routes -------------- //

// 1. Profile

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

// 2. Skills

router.get("/me/skills", authMiddleware, async (req, res) => {
    try {
        const skills = await userController.getUserSkills(req.user.id);
        return res.status(200).send(skills);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.post("/me/skills",
    checkSchema({
        name: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Name is required",
        },
        level: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Level is required",
            toInt: true,
        },
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.addUserSkill(req.user.id, req.body);
            if (!result) return res.status(400).send({ message: "Couldn't create the resource" });
            return res.status(201).send({ message: "Resource created successfully" });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

router.patch("/me/skills/:id",
    checkSchema({
        name: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Name is required",
        },
        level: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Level is required",
            toInt: true,
        },
        id: {
            in: ["params"],
            isString: true,
            exists: true,
            errorMessage: "Id is required",
            custom: {
                options: async (value) => {
                    const skill = await userController.getUserSkill(value);
                    if (!skill) return Promise.reject("Skill not found");
                    return Promise.resolve();
                },
            },
        },
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.updateUserSkill(req.user.id, req.params.id, req.body);
            if (!result) return res.status(400).send({ message: "Couldn't update the resource" });
            return res.status(200).send({ message: "Resource updated successfully" });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

router.delete("/me/skills/:id",
    checkSchema({
        id: {
            in: ["params"],
            isString: true,
            exists: true,
            errorMessage: "Id is required",
            custom: {
                options: async (value) => {
                    const skill = await userController.getUserSkill(value);
                    if (!skill) return Promise.reject("Skill not found");
                    return Promise.resolve();
                },
            },
        },
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.deleteUserSkill(req.user.id, req.params.id);
            return res.status(200).send({ deleted: result });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

// 3. Education

router.get("/me/education", authMiddleware, async (req, res) => {
    try {
        const education = await userController.getUserEducation(req.user.id);
        return res.status(200).send(education);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.post("/me/education",
    checkSchema({
        school: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Institution is required",
        },
        field: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Degree is required",
        },
        start: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Start date is required",
            toDate: true,
        },
        end: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "End date is required",
            toDate: true,
        },
        description: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Description is required",
        }
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.addUserEducation(req.user.id, req.body);
            if (!result) return res.status(400).send({ message: "Couldn't create the resource" });
            return res.status(201).send({ message: "Resource created successfully" });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

router.patch("/me/education/:id",
    checkSchema({
        school: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Institution is required",
        },
        field: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Degree is required",
        },
        start: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Start date is required",
            toDate: true,
        },
        end: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "End date is required",
            toDate: true,
        },
        description: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Description is required",
        },
        id: {
            in: ["params"],
            isString: true,
            exists: true,
            errorMessage: "Id is required",
            custom: {
                options: async (value) => {
                    const education = await userController.getUserEducation(value);
                    if (!education) return Promise.reject("Education not found");
                    return Promise.resolve();
                },
            },
        },
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.updateUserEducation(req.user.id, req.params.id, req.body);
            if (!result) return res.status(400).send({ message: "Couldn't update the resource" });
            return res.status(200).send({ message: "Resource updated successfully" });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

router.delete("/me/education/:id",
    checkSchema({
        id: {
            in: ["params"],
            isString: true,
            exists: true,
            errorMessage: "Id is required",
            custom: {
                options: async (value) => {
                    const education = await userController.getUserEducation(value);
                    if (!education) return Promise.reject("Education not found");
                    return Promise.resolve();
                },
            },
        },
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.deleteUserEducation(req.user.id, req.params.id);
            return res.status(200).send({ deleted: result });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

// 4. Experience

router.get("/me/experience", authMiddleware, async (req, res) => {
    try {
        const experience = await userController.getUserExperience(req.user.id);
        return res.status(200).send(experience);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

router.post("/me/experience",
    checkSchema({
        company: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Company is required",
        },
        position: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Position is required",
        },
        start: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Start date is required",
            toDate: true,
        },
        end: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "End date is required",
            toDate: true,
        },
        description: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Description is required",
        }
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.addUserExperience(req.user.id, req.body);
            if (!result) return res.status(400).send({ message: "Couldn't create the resource" });
            return res.status(201).send({ message: "Resource created successfully" });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

router.patch("/me/experience/:id",
    checkSchema({
        company: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Company is required",
        },
        position: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Position is required",
        },
        start: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Start date is required",
            toDate: true,
        },
        end: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "End date is required",
            toDate: true,
        },
        description: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Description is required",
        },
        id: {
            in: ["params"],
            isString: true,
            exists: true,
            errorMessage: "Id is required",
            custom: {
                options: async (value) => {
                    const experience = await userController.getUserExperience(value);
                    if (!experience) return Promise.reject("Experience not found");
                    return Promise.resolve();
                },
            },
        },
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.updateUserExperience(req.user.id, req.params.id, req.body);
            if (!result) return res.status(400).send({ message: "Couldn't update the resource" });
            return res.status(200).send({ message: "Resource updated successfully" });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

router.delete("/me/experience/:id",
    checkSchema({
        id: {
            in: ["params"],
            isString: true,
            exists: true,
            errorMessage: "Id is required",
            custom: {
                options: async (value) => {
                    const experience = await userController.getUserExperience(value);
                    if (!experience) return Promise.reject("Experience not found");
                    return Promise.resolve();
                },
            },
        },
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.deleteUserExperience(req.user.id, req.params.id);
            return res.status(200).send({ deleted: result });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

// 5. Languages

router.get("/me/languages", authMiddleware, async (req, res) => {
    try {
        const languages = await userController.getUserLanguages(req.user.id);
        return res.status(200).send(languages);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.post("/me/languages",
    checkSchema({
        name: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Name is required",
        },
        level: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Level is required",
            toInt: true,
        },
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.addUserLanguage(req.user.id, req.body);
            if (!result) return res.status(400).send({ message: "Couldn't create the resource" });
            return res.status(201).send({ message: "Resource created successfully" });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

router.patch("/me/languages/:id",
    checkSchema({
        name: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Name is required",
        },
        level: {
            in: ["body"],
            isString: true,
            exists: true,
            errorMessage: "Level is required",
            toInt: true,
        },
        id: {
            in: ["params"],
            isString: true,
            exists: true,
            errorMessage: "Id is required",
            custom: {
                options: async (value) => {
                    const language = await userController.getUserLanguage(value);
                    if (!language) return Promise.reject("Language not found");
                    return Promise.resolve();
                },
            },
        },
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.updateUserLanguage(req.user.id, req.params.id, req.body);
            if (!result) return res.status(400).send({ message: "Couldn't update the resource" });
            return res.status(200).send({ message: "Resource updated successfully" });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

router.delete("/me/languages/:id",
    checkSchema({
        id: {
            in: ["params"],
            isString: true,
            exists: true,
            errorMessage: "Id is required",
            custom: {
                options: async (value) => {
                    const language = await userController.getUserLanguage(value);
                    if (!language) return Promise.reject("Language not found");
                    return Promise.resolve();
                },
            },
        },
    })
    , authMiddleware, async (req, res) => {
        try {
            const result = await userController.deleteUserLanguage(req.user.id, req.params.id);
            return res.status(200).send({ deleted: result });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

export default router;