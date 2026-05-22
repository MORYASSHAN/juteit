import { sendEmail } from '../config/email.js';
import { Order } from '../models/Order.js';
import { Settings } from '../models/Settings.js';

// @desc    Create new order
// @route   POST /api/orders
export const addOrderItems = async (req, res) => {
    try {
        const { items, shippingAddress, totalProductsPrice, tax, shippingCharge, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const settings = await Settings.findOne();
        const rawQrUrl = settings?.qrCodeUrl || "";
        const qrCodeUrl = (rawQrUrl && !rawQrUrl.startsWith('http')) 
            ? `${process.env.VITE_API_URL || 'http://localhost:5000'}${rawQrUrl}` 
            : rawQrUrl;
        const thankYouMsg = settings?.emailThankYouMsg || "thank to order from juteit Your order";
        const cancelWindow = settings?.cancellationWindow || 24;

        const order = new Order({
            buyer: req.user._id,
            items,
            shippingAddress,
            totalProductsPrice,
            tax,
            shippingCharge,
            totalAmount,
            cancellationDeadline: new Date(Date.now() + cancelWindow * 60 * 60 * 1000)
        });

        const createdOrder = await order.save();
        const populatedOrder = await Order.findById(createdOrder._id).populate('items.product', 'name images');

        // Build items HTML for emails
        const itemsHtml = populatedOrder.items.map(item => `
            <li style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                <div style="display: flex; justify-content: space-between;">
                    <strong>${item.product ? item.product.name : 'Unknown Product'}</strong>
                    <span>&#8377;${item.priceAtPurchase} x ${item.quantity}</span>
                </div>
                <div style="font-size: 0.85em; color: #666; margin-top: 4px;">
                    Size: ${item.selectedSize || 'Standard'} | Color: ${item.selectedColor || 'N/A'}
                </div>
            </li>
        `).join('');

        // Email to Owner
        const ownerEmailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 5px;">New Order Received</h1>
                    <p style="color: #7f8c8d; margin-top: 0;">Order #${createdOrder._id}</p>
                </div>
                
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                    <h3 style="margin-top: 0; color: #34495e; border-bottom: 1px solid #dee2e6; padding-bottom: 10px;">Customer Information</h3>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${req.user.name}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${req.user.email}</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> ${shippingAddress.phoneNumber || req.user.phoneNumber || 'N/A'}</p>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #34495e; border-bottom: 1px solid #dee2e6; padding-bottom: 10px;">Delivery Address</h3>
                    <p style="margin: 5px 0;">${shippingAddress.street}</p>
                    <p style="margin: 5px 0;">${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #34495e; border-bottom: 1px solid #dee2e6; padding-bottom: 10px;">Order Summary</h3>
                    <ul style="list-style: none; padding: 0;">${itemsHtml}</ul>
                    <div style="margin-top: 15px; text-align: right;">
                        <p style="margin: 5px 0;">Subtotal: &#8377;${totalProductsPrice}</p>
                        <p style="margin: 5px 0;">Tax: &#8377;${tax}</p>
                        <p style="margin: 5px 0;">Shipping: &#8377;${shippingCharge}</p>
                        <p style="margin: 10px 0; font-size: 18px; color: #27ae60;"><strong>Total Amount: &#8377;${totalAmount}</strong></p>
                    </div>
                </div>
            </div>
        `;

        // Email to Buyer
        const buyerEmailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6; border: 1px solid #e0e0e0; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #27ae60; margin-bottom: 10px;">Order Confirmed!</h1>
                    <p style="font-size: 18px; font-weight: bold; margin: 0;">${thankYouMsg}</p>
                    <p style="color: #7f8c8d; margin-top: 5px;">Order ID: #${createdOrder._id}</p>
                </div>
                
                <p>Hello <strong>${req.user.name}</strong>,</p>
                <p>We're excited to let you know that we've received your order and it's being processed. Here are your order details:</p>

                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
                    <h3 style="margin-top: 0; color: #333;">Items Ordered</h3>
                    <ul style="list-style: none; padding: 0;">${itemsHtml}</ul>
                    <div style="margin-top: 15px; border-top: 2px solid #fff; padding-top: 10px; text-align: right;">
                        <p style="margin: 5px 0; font-size: 18px;"><strong>Total Amount Paid/Due: &#8377;${totalAmount}</strong></p>
                    </div>
                </div>

                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
                    <h3 style="margin-top: 0; color: #333;">Shipping & Contact Details</h3>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${req.user.name}</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> ${shippingAddress.phoneNumber || req.user.phoneNumber || 'N/A'}</p>
                    <p style="margin: 5px 0;"><strong>Address:</strong> ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
                </div>

                <div style="text-align: center; background-color: #fff9e6; border: 2px dashed #f1c40f; border-radius: 12px; padding: 30px; margin: 30px 0;">
                    <h2 style="color: #f39c12; margin-top: 0;">Complete Your Payment</h2>
                    <p style="font-size: 16px; font-weight: bold; color: #d35400;">Please scan the QR code below for payment</p>
                    <p>To finalize your order, please pay via UPI:</p>
                    
                    ${qrCodeUrl ? `
                    <div style="margin: 20px auto; max-width: 250px;">
                        <img src="${qrCodeUrl}" alt="Payment QR Code" style="width: 100%; height: auto; border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-radius: 8px;" />
                    </div>
                    ` : `
                    <div style="margin: 20px auto; width: 200px; height: 200px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc; border-radius: 8px;">
                        <span style="color: #888;">[Payment QR Code]</span>
                    </div>
                    `}
                    
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">
                        <strong>Important:</strong> After successful payment, please reply to this email with your transaction ID or a screenshot.
                    </p>
                    <p style="font-size: 13px; color: #e67e22; margin-top: 10px;">
                        Note: You can cancel this order within <strong>${cancelWindow} hours</strong> if needed.
                    </p>
                </div>

                <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #95a5a6; text-align: center;">
                    <p>© 2026 JuteIt. Eco-friendly handcrafted jute products.</p>
                    <p>Contact Us: juteitstore@gmail.com</p>
                </div>
            </div>
        `;

        try {
            await sendEmail(
                process.env.OWNER_EMAIL,
                `New Order - JUTEIT #${createdOrder._id}`,
                `New order from ${req.user.name}. Total: &#8377;${totalAmount}.`,
                ownerEmailHtml
            );
            await sendEmail(
                req.user.email,
                `Order Received - JUTEIT #${createdOrder._id}`,
                `Thank you for your order! Total: &#8377;${totalAmount}. Please complete payment via the QR code in the email.`,
                buyerEmailHtml
            );
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel order (within 20 hours)
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('items.product', 'name images')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Owner/Admin only)
// @route   GET /api/orders
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('buyer', 'name email')
            .populate('items.product', 'name images')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (status === 'confirmed') {
            await Order.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Order confirmed and automatically deleted record as requested.' });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

