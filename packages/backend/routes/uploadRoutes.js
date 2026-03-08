import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /png|jpg|jpeg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images Only! Only .png, .jpg and .jpeg formats are allowed.'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: 'No files uploaded' });
    }

    // Construct URLs for the uploaded images
    // Assuming the server is running on localhost:5000, we'll return relative paths
    // which the frontend can prepend with the backend URL if needed, or we just return the path.
    // Best approach is storing relative URLs like `/uploads/filename.png`
    const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
    res.send({
        message: 'Images Uploaded Successfully',
        urls: filePaths,
    });
});

export default router;
