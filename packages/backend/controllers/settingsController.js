import { Settings } from '../models/Settings.js';

// @desc    Get store settings
// @route   GET /api/settings
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne() || {
            taxRate: 0,
            baseShippingCharge: 0,
            freeShippingThreshold: 0
        };
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update store settings (Admin only)
// @route   PUT /api/settings
export const updateSettings = async (req, res) => {
    try {
        const { bankDetails, taxRate, baseShippingCharge, freeShippingThreshold, ownerEmail, instagramUrl, heroImageUrl } = req.body;

        let settings = await Settings.findOne();

        if (settings) {
            settings.bankDetails = bankDetails || settings.bankDetails;
            settings.taxRate = taxRate !== undefined ? taxRate : settings.taxRate;
            settings.baseShippingCharge = baseShippingCharge !== undefined ? baseShippingCharge : settings.baseShippingCharge;
            settings.freeShippingThreshold = freeShippingThreshold !== undefined ? freeShippingThreshold : settings.freeShippingThreshold;
            settings.ownerEmail = ownerEmail || settings.ownerEmail;
            settings.instagramUrl = instagramUrl || settings.instagramUrl;
            settings.heroImageUrl = heroImageUrl || settings.heroImageUrl;

            const updatedSettings = await settings.save();
            res.json(updatedSettings);
        } else {
            settings = await Settings.create({
                bankDetails, taxRate, baseShippingCharge, freeShippingThreshold, ownerEmail, instagramUrl
            });
            res.status(201).json(settings);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
