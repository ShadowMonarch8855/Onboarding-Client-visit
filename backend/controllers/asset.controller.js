import Asset from '../models/Asset.js';
import { success, error } from '../utils/apiResponse.js';
import fs from 'fs';
import path from 'path';

export const uploadAsset = async (req, res) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);
    
    const { project, category } = req.body;
    const asset = await Asset.create({
      project,
      category,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      storageUri: req.file.path,
      uploadedBy: req.user._id
    });
    
    success(res, asset, 201);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const getAssets = async (req, res) => {
  try {
    const query = req.query.project ? { project: req.query.project } : {};
    const assets = await Asset.find(query).populate('uploadedBy', 'name');
    success(res, assets);
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const downloadAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return error(res, 'Asset not found', 404);
    
    const filePath = path.resolve(asset.storageUri);
    if (fs.existsSync(filePath)) {
      res.download(filePath, asset.originalName);
    } else {
      error(res, 'File not found on disk', 404);
    }
  } catch (err) {
    error(res, err.message, 500);
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return error(res, 'Asset not found', 404);
    
    const filePath = path.resolve(asset.storageUri);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await Asset.findByIdAndDelete(req.params.id);
    success(res, { message: 'Asset deleted successfully' });
  } catch (err) {
    error(res, err.message, 500);
  }
};
