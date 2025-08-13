import { Request, Response, Router } from 'express';
import multer from 'multer';
import { GalleryService } from '../services/gallery.service';

const galleryServiceInstance = new GalleryService();
const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // can change limit here now its at 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // checking file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Extend Request type to include file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Get all photos for a user
router.get("/", async (req: Request, res: Response) => {
    try {
        const partnerId = req.query.partnerId?.toString();
        const photos = await galleryServiceInstance.getPhotos(req.user!.user_id, partnerId);

        res.status(200).json({ photos });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific photo by ID
router.get("/:id", async (req: Request, res: Response) => {
    const photoId = req.params.id;
    if (!photoId) {
        res.status(401).json({ error: 'No PhotoId Found' });
        return; 
    }
    try {
        const photo = await galleryServiceInstance.getPhotoById(photoId);
        
        if (!photo) {
            res.status(404).json({ error: 'Photo not found' });
            return;
        }
        
        res.status(200).json({ photo });
    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Upload a new photo
router.post("/", upload.array('photos'), async (req: any, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        const { albumId } = req.body;
        
        const uploadedPhotos = await Promise.all(
            files.map(
                file => galleryServiceInstance.uploadPhoto(
                    req.user!.user_id, 
                    file,
                    albumId,
                )
            )
        );
        res.status(201).json({ photo: uploadedPhotos });
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete photo
router.delete("/:id", async (req: Request, res: Response) => {
    const photoId = req.params.id;
    if (!photoId) {
        res.status(401).json({ error: 'User not authenticated' });
        return; 
    }
    
    try {
        const deleted = await galleryServiceInstance.deletePhoto(photoId);
        if (deleted) {
            res.status(200).json({ message: 'Photo deleted successfully' });
        } else {
            res.status(404).json({ error: 'Photo not found' });
        }
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;