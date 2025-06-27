import { Router } from "express";

import NotesRouter from "./notes.controller";
import PlacesRouter from "./places.controller";
import DateRouteRouter from "./dateRoute.controller";

const router = Router();

router.use("/notes", NotesRouter);
router.use("/places", PlacesRouter);
router.use("/date-route", DateRouteRouter);

export default router;