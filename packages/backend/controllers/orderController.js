import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { sendEmail } from '../config/email.js';

// @desc    Create new order
// @route   POST /api/orders
export const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, totalProductsPrice, tax, shippingCharge, totalAmount } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
        buyer: req.user._id,
        items: orderItems,
        shippingAddress,
        totalProductsPrice,
        tax,
        shippingCharge,
        totalAmount
    });

    const createdOrder = await order.save();

    // Send Email to Owner
    await sendEmail(
        process.env.OWNER_EMAIL,
        `New Order Received - JUTEIT #${createdOrder._id}`,
        `You have a new order from ${req.user.name}. Total: ${totalAmount}. Address: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.pincode}`,
        `<h1>New Order Received</h1><p>Order ID: ${createdOrder._id}</p><p>Total: ${totalAmount}</p>`
    );

    res.status(201).json(createdOrder);
};

// @desc    Cancel order (within 20 hours)
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.status === 'cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        const now = new Date();
        if (now > order.cancellationDeadline) {
            return res.status(400).json({ message: 'Cancellation window (20h) has expired' });
        }

        order.status = 'cancelled';
        await order.save();
        res.json({ message: 'Order cancelled successfully' });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
    const orders = await Order.find({ buyer: req.user._id });
    res.json(orders);
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
export const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('buyer', 'name email');
    res.json(orders);
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};
