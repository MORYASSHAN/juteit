import { User } from '../models/User.js';

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

            if (req.body.address) {
                user.address = {
                    street: req.body.address.street || user.address?.street,
                    city: req.body.address.city || user.address?.city,
                    state: req.body.address.state || user.address?.state,
                    pincode: req.body.address.pincode || user.address?.pincode,
                    country: req.body.address.country || user.address?.country || 'India',
                };
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phoneNumber: updatedUser.phoneNumber,
                address: updatedUser.address,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
