import { Product } from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req, res) => {
    const products = await Product.find({ inStock: true });
    res.json(products);
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
export const createProduct = async (req, res) => {
    const { name, description, category, images, originalPrice, discountedPrice, stock, sizes, colors, deliveryEstimate, returnable, isHeadline } = req.body;

    const product = new Product({
        name, description, category, images, originalPrice, discountedPrice, stock, sizes, colors, deliveryEstimate, returnable, isHeadline
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        Object.assign(product, req.body);
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Get all products (Admin only - includes out of stock)
// @route   GET /api/products/admin
export const getProductsAdmin = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};
