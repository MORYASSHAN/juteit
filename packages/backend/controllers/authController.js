import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Forced to buyer by default. Only setupOwner API can create owners now.
    const userRole = 'buyer';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = password ? await bcrypt.hash(password, salt) : undefined;

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: userRole,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password, oauthId } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        if (oauthId && user.oauthId === oauthId) {
            // OAuth Login
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else if (password && user.password && (await bcrypt.compare(password, user.password))) {
            // Password Login
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } else {
        res.status(401).json({ message: 'User not found' });
    }
};

// @desc    Auth user with Google OAuth
// @route   POST /api/auth/google
export const googleAuth = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, sub } = ticket.getPayload();
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                oauthId: sub,
                role: 'buyer',
            });
        } else {
            // Update name and oauthId if they are missing
            let updated = false;
            if (!user.name && name) {
                user.name = name;
                updated = true;
            }
            if (!user.oauthId) {
                user.oauthId = sub;
                updated = true;
            }
            if (updated) {
                await user.save();
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid Google token' });
    }
};


// @desc    Setup owner role (Secured by Master Key)
// @route   POST /api/auth/setup-owner
export const setupOwner = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    let user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = password ? await bcrypt.hash(password, salt) : undefined;

    if (user) {
        user.role = 'owner';
        if (name) user.name = name;
        if (hashedPassword) user.password = hashedPassword;
        await user.save();
    } else {
        user = await User.create({
            name: name || 'Admin',
            email,
            password: hashedPassword,
            role: 'owner',
        });
    }

    res.status(200).json({
        message: 'Owner setup successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

// @desc    Delete owner/user (Secured by Master Key)
// @route   POST /api/auth/delete-owner
export const deleteOwner = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(user._id);

    res.status(200).json({ message: 'User deleted successfully' });
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
