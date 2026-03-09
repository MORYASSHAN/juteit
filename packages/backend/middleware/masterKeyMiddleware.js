export const masterKey = (req, res, next) => {
    const key = req.headers['x-master-key'];

    if (!key || key !== process.env.MASTER_KEY) {
        return res.status(401).json({ message: 'Unauthorized: Invalid master key' });
    }

    next();
};
