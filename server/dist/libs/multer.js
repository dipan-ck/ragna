import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'profile_images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});
// Extra security: prevent .webp or .exe upload
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype))
        cb(null, true);
    else
        cb(new Error('Only JPG, JPEG, and PNG formats are allowed.'));
};
const upload = multer({ storage, fileFilter });
export default upload;
