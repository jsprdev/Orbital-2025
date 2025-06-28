import { Request, Response, Router } from 'express';
import { AlbumsService } from '../services/album.service';

const albumServiceInstance = new AlbumsService();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const albums = await albumServiceInstance.getAlbums(req.user.user_id);
        res.status(200).json({ albums });
      } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { albumName } = req.body;
        const userId = req.user.user_id;
        const addedAlbum = await albumServiceInstance.addToAndUpdateAlbum(albumName, userId);
        res.status(201).json({ addedAlbum });
    } catch (error) {
        console.error('Error adding Album:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const albumId = req.params.id;
    try {
        const deletedAlbum = await albumServiceInstance.deleteAlbum(albumId);
        if (deletedAlbum) {
            res.status(200).json({ message: 'Album deleted successfully' });
        } else {
            res.status(404).json({ error: 'Album not found' });
        }
    } catch (error) {
        console.error('Error deleting Album:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;