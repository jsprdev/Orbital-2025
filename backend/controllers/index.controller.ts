import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";

import NotesRouter from "./notes.controller";
import GalleryRouter from "./gallery.controller";
import AlbumsRouter from "./albums.controller";

const router = Router();

router.use("/notes", verifyToken, NotesRouter);
router.use("/images", verifyToken, GalleryRouter);
router.use("/albums", verifyToken, AlbumsRouter);

export default router;