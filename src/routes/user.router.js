import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { UserController, JobController } from "../controllers/index.js";
import { checkSchema, param } from "express-validator";

const router = Router();
const userController = new UserController();
const jobsController = new JobController();
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
        experience: {
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
    authMiddleware, async (req, res) => {
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
    authMiddleware, async (req, res) => {
        try {
            const result = await userController.deleteUserSkill(req.user.id, req.params.id);
            if (!result) return res.status(400).send({ message: "Couldn't delete the resource" });

            return res.status(200).send({ deleted: result });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

// 3. Education

router.get("/me/education", authMiddleware, async (req, res) => {
    try {
        const education = await userController.getUserEducations(req.user.id);
        return res.status(200).send(education);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.post("/me/education",
    authMiddleware, async (req, res) => {
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
    authMiddleware, async (req, res) => {
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
    authMiddleware, async (req, res) => {
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
        const experience = await userController.getUserExperiences(req.user.id);
        return res.status(200).send(experience);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

router.post("/me/experience",
    authMiddleware, async (req, res) => {
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
    authMiddleware, async (req, res) => {
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
    authMiddleware, async (req, res) => {
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
    authMiddleware, async (req, res) => {
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
    authMiddleware, async (req, res) => {
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
    authMiddleware, async (req, res) => {
        try {
            const result = await userController.deleteUserLanguage(req.user.id, req.params.id);
            return res.status(200).send({ deleted: result });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

// 6. Documents

router.get("/me/documents", authMiddleware, async (req, res) => {
    try {
        const documents = await userController.getUserDocuments(req.user.id);
        return res.status(200).send(documents);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.post("/me/documents",
    authMiddleware, async (req, res) => {
        try {
            const result = await userController.addUserDocument(req.user.id, req.body);
            if (!result) return res.status(400).send({ message: "Couldn't create the resource" });
            return res.status(201).send({ message: "Resource created successfully" });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

router.patch("/me/documents/:id",
    authMiddleware, async (req, res) => {
        try {
            const result = await userController.updateUserDocument(req.user.id, req.params.id, req.body);
            if (!result) return res.status(400).send({ message: "Couldn't update the resource" });
            return res.status(200).send({ message: "Resource updated successfully" });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);

router.delete("/me/documents/:id",
    authMiddleware, async (req, res) => {
        try {
            const result = await userController.deleteUserDocument(req.user.id, req.params.id);
            return res.status(200).send({ deleted: result });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
);


// 7. My Jobs

router.get("/me/jobs", authMiddleware, async (req, res) => {
    try {
        const jobs = await jobsController.getUserJobs(req.user.id, req.query);
        return res.status(200).send(jobs);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});


// 8. Referrals
router.get("/me/referrals", authMiddleware, async (req, res) => {
    try {
        const referrals = await userController.getUserReferrals(req.user.id);
        return res.json(referrals);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
})

router.get("/me/referees", authMiddleware, async (req, res) => {
    try {
        const referrals = await userController.getUserReferees(req.user.id);
        return res.json(referrals);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
})

router.post("/me/referrals", authMiddleware, async (req, res) => {
    try {
        const referrals = await userController.addUserReferral(req.user.id, req.body);
        if (!referrals) return res.status(400).send({ message: "Couldn't create the resource" });

        return res.status(201).json(referrals);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.patch("/me/referrals/:id", authMiddleware, async (req, res) => {
    try {
        const referral = await userController.updateReferral(req.user.id, req.params.id, req.body);
        if (!referral) return res.status(404).send({ message: "Resource not found" });
        return res.json(referral);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

// 9. Notifications

router.get("/me/notifications", authMiddleware, async (req, res) => {
    try {
        const notifications = await userController.getUserNotifications(req.user.id);
        return res.json(notifications);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.patch("/me/notifications/:id", authMiddleware, async (req, res) => {
    try {
        const notification = await userController.updateUserNotification(req.user.id, req.params.id, req.body);
        if (!notification) return res.status(404).send({ message: "Resource not found" });
        return res.json(notification);
    } catch (error) {
        console.log(error);

        return res.status(500).send({ message: error.message });
    }
})

export default router;