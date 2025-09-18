
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

// Multer setup for local storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'temp_uploads'); // Make sure this folder exists
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const upload = multer({ storage });

// Middleware function
const UploadThumbnail = [
	upload.single('thumbnail'),
	async (req, res, next) => {
		try {
			if (!req.file) {
				// No file uploaded, continue
				return next();
			}

			// Upload to Cloudinary
			const localPath = req.file.path;
			const result = await cloudinary.uploader.upload(localPath, {
				resource_type: 'image',
				folder: 'quiz_thumbnails',
			});

			// Remove local file
			fs.unlink(localPath, (err) => {
				if (err) console.error('Failed to remove local file:', err);
			});

			// Pass Cloudinary URL to controller
			req.body.thumbnail = {
				url:result.secure_url,
				cloudId:result.public_id
			};
			next();
		} catch (error) {
			console.error('Thumbnail upload error:', error);
			return res.status(500).json({ err: 'Thumbnail upload failed' });
		}
	}
];

export default UploadThumbnail;
