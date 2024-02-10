import { Router } from "express";
import { JobController } from "../controllers/index.js";
import { authMiddleware, recruiterMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
const jobController = new JobController();

// --------------------- JOB LISTING --------------------------------
router.get("/", async (req, res) => {
    try {
        res.json(await jobController.getAllJobs(req.query));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const job = await jobController.getJob(req.params.id);
        if (!job) {
            res.status(404).json({ message: "Job not found" });
        }
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", authMiddleware, recruiterMiddleware, async (req, res) => {
    try {
        const job = await jobController.addJob(req.user.id, req.body);
        if (!job) {
            res.status(400).json({ message: "Bad request" });
        }
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        res.json(await jobController.updateJob(req.user.id, req.params.id, req.body));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        res.json(await jobController.deleteJob(req.user.id, req.params.id));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --------------------- JOB APPLICATIONS --------------------------------

router.get("/:id/applications", authMiddleware, async (req, res) => {
    try {
        res.json(await jobController.getJobApplications(req.user.id, req.params.id, req.query));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/:id/applications", authMiddleware, async (req, res) => {
    try {
        const application = await jobController.addJobApplication(req.user.id, req.params.id, req.body);
        if (!application) {
            res.status(400).json({
                message: "Couldnt create this application, try again later"
            })
            return;
        }
        res.status(201).json(application)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch("/:id/applications/:appId", authMiddleware, async (req, res) => {
    try {
        const application = await jobController.updateApplication(req.params.id, req.params.appId, req.body);
        if (!application) {
            res.status(400).json({
                message: "Couldnt update this application, try again later"
            })
            return;
        }
        res.status(200).json(application)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id/applications/:appId", authMiddleware, async (req, res) => {
    try {
        const application = await jobController.deleteApplication(req.params.id, req.user.id, req.params.appId);
        if (!application) {
            res.status(400).json({
                message: "Couldnt delete this application, try again later"
            })
            return;
        }
        res.status(200).json(application)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;