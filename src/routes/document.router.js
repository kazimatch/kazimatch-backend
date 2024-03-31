import { Router } from "express";
import { Document } from "../models/index.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadMiddleware } from "../middleware/storage.middleware.js";
import { config } from "../config/index.js";
import fs from 'fs';

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const docs = await Document.findAll({
            where: {
                owner: req.user.id
            }
        })
        return res.status(200).json(docs.map(doc => doc.dataValues));
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const doc = await Document.findOne({
            where: {
                id: req.params.id,
            }
        })
        if (!doc) {
            return res.status(404).json({ message: 'File not found' });
        }
        return res.status(200).json(doc.dataValues);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get("/:id/view", async (req, res) => {
    try {
        const doc = await Document.findOne({
            where: {
                id: req.params.id,
            }
        })
        if (!doc) {
            return res.status(404).json({ message: 'File not found' });
        }

        return res.download(doc.path, doc.name, (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post("/", authMiddleware, uploadMiddleware, async (req, res) => {
    try {
        const result = await Document.create({
            name: req.file.originalname,
            path: req.file.path,
            owner: req.user.id,
            type: req.body.type
        })

        if (!result) {
            return res.status(500).json({ message: 'Error while uploading file' });
        }

        const id = result.dataValues.id;

        await result.update({
            url: config.App.baseUrl + '/' + config.VERSION + '/files/' + id + '/view'
        })

        return res.status(201).json(result.dataValues);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const doc = await Document.findOne({
            where: {
                id: req.params.id,
                owner: req.user.id
            }
        })
        if (!doc) {
            return res.status(404).json({ message: 'File not found' });
        }

        await new Promise((resolve, reject) => {
            fs.unlink(`${os.tmpdir()}/${doc.name}`, async (err) => {
                if (err) {
                    reject(err);
                }

                await doc.destroy();
                resolve();
            });
        });

        return res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default router;