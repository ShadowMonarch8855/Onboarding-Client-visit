import express from 'express';
import { uploadAsset, getAssets, downloadAsset, deleteAsset } from '../controllers/asset.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('file'), uploadAsset);
router.get('/', getAssets);
router.get('/:id/download', downloadAsset);
router.delete('/:id', deleteAsset);

export default router;
