import { Inquiry } from '../models/Inquiry.js';

// @desc    Submit a product inquiry (public)
// @route   POST /api/inquiries
export const submitInquiry = async (req, res) => {
    const { name, email, product, productName, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const inquiry = await Inquiry.create({ name, email, product, productName, message });
    res.status(201).json(inquiry);
};

// @desc    Get all inquiries (admin)
// @route   GET /api/inquiries
export const getInquiries = async (req, res) => {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).populate('product', 'name images');
    res.json(inquiries);
};

// @desc    Update inquiry status (admin)
// @route   PUT /api/inquiries/:id
export const updateInquiryStatus = async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
        return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.status = req.body.status || inquiry.status;
    const updated = await inquiry.save();
    res.json(updated);
};

// @desc    Delete an inquiry (admin)
// @route   DELETE /api/inquiries/:id
export const deleteInquiry = async (req, res) => {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
        return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ message: 'Inquiry deleted' });
};
