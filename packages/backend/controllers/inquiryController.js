import { sendEmail } from '../config/email.js';
import { Inquiry } from '../models/Inquiry.js';

// @desc    Submit a product inquiry (public)
// @route   POST /api/inquiries
export const submitInquiry = async (req, res) => {
    try {
        const { name, email, product, productName, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email and message are required' });
        }

        const inquiry = await Inquiry.create({ name, email, product, productName, message });

        // Send confirmation email
        const subject = `Inquiry Received: ${productName || 'General Inquiry'}`;
        const text = `Hi ${name},\n\nThank you for reaching out to JUTEIT regarding "${productName || 'our products'}". We have received your message:\n\n"${message}"\n\nOur team will connect with you via email soon.\n\nBest regards,\nTeam JUTEIT`;

        await sendEmail(email, subject, text);

        res.status(201).json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all inquiries (admin)
// @route   GET /api/inquiries
export const getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).populate('product', 'name images');
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update inquiry status (admin)
// @route   PUT /api/inquiries/:id
export const updateInquiryStatus = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        inquiry.status = req.body.status || inquiry.status;
        const updated = await inquiry.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an inquiry (admin)
// @route   DELETE /api/inquiries/:id
export const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }
        res.json({ message: 'Inquiry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
