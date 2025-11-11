
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

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
const uploadProfile = [
	upload.single('profile'),
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
				folder: 'quiz_profiles',
			});

			// Remove local file
			fs.unlink(localPath, (err) => {
				if (err) console.error('Failed to remove local file:', err);
			});

			// Pass Cloudinary URL to controller
			req.body.profile = {
				url:result.secure_url,
				cloudId:result.public_id
			};
			next();
		} catch (error) {
			console.error('Profile upload error:', error);
			return res.status(500).json({ err: 'Profile upload failed' });
		}
	}
];

export default uploadProfile;
