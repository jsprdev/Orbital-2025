import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";

import NotesRouter from "./notes.controller";
import GalleryRouter from "./gallery.controller";

const router = Router();

router.use("/notes", verifyToken, NotesRouter);
router.use("/images", verifyToken, GalleryRouter);

export default router;