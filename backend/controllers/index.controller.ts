import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";

import NotesRouter from "./notes.controller";
import GalleryRouter from "./gallery.controller";
import AlbumRouter from "./album.controller";

const router = Router();

router.use("/notes", verifyToken, NotesRouter);
router.use("/images", verifyToken, GalleryRouter);
router.use("/albums", verifyToken, AlbumRouter);

export default router;