import express from "express";

import NotesRouter from "./notes.controller";

const router = express.Router();

router.use("/notes", NotesRouter);

export default router;