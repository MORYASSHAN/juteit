import { Product } from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req, res) => {
    try {
        const { keyword, category, sort } = req.query;

        let query = { inStock: { $ne: false } };

        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { category: { $regex: keyword, $options: 'i' } },
            ];
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        let apiQuery = Product.find(query);

        if (sort === 'priceAsc') {
            apiQuery = apiQuery.sort('discountedPrice');
        } else if (sort === 'priceDesc') {
            apiQuery = apiQuery.sort('-discountedPrice');
        } else {
            apiQuery = apiQuery.sort('-createdAt'); // Default to newest
        }

        const products = await apiQuery;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
export const createProduct = async (req, res) => {
    try {
        const { name, description, category, images, originalPrice, discountedPrice, stock, sizes, colors, deliveryEstimate, returnable, isHeadline } = req.body;

        if (!name || !originalPrice || !category) {
            return res.status(400).json({ message: 'Name, price and category are required' });
        }

        const product = new Product({
            name, description, category, images, originalPrice, discountedPrice, stock, sizes, colors, deliveryEstimate, returnable, isHeadline
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all products (Admin only - includes out of stock)
// @route   GET /api/products/admin
export const getProductsAdmin = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
