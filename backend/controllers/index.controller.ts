import { Router } from "express";

import NotesRouter from "./notes.controller";

const router = Router();

router.use("/notes", NotesRouter);

export default router;