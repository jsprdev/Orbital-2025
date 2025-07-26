import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";

import NotesRouter from "./notes.controller";
import PlacesRouter from "./places.controller";
import DateRouteRouter from "./dateRoute.controller";
import GalleryRouter from "./gallery.controller";
import AlbumsRouter from "./albums.controller";
import WeatherRouter from "./weather.controller";
import PartnerRouter from "./partner.controller";
import AccountRouter from "./account.controller";
import ExpensesRouter from "./expenses.controller";
import GiftsRouter from "./gifts.controller";

const router = Router();

router.use("/account", AccountRouter);

router.use("/partner", verifyToken, PartnerRouter);
router.use("/notes", verifyToken, NotesRouter);
router.use("/places", verifyToken, PlacesRouter);
router.use("/date-route", verifyToken, DateRouteRouter);
router.use("/notes", verifyToken, NotesRouter);
router.use("/images", verifyToken, GalleryRouter);
router.use("/albums", verifyToken, AlbumsRouter);
router.use("/weather", verifyToken, WeatherRouter);
router.use("/expenses", verifyToken, ExpensesRouter);
router.use("/gifts", verifyToken, GiftsRouter);


export default router;