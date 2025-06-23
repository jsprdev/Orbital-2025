import { Router } from "express";

import NotesRouter from "./notes.controller";
import PlacesRouter from "./places.controller";

const router = Router();

router.use("/notes", NotesRouter);
router.use("/places", PlacesRouter);


export default router;