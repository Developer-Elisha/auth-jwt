const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const multer = require('multer');
const fs = require('fs');
const { body, validationResult } = require('express-validator');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Register a new user
router.post('/register', upload.single('profilePic'), async (req, res) => {
    try {
        const { name, email, password, profilePic } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profilePicFilename = 'default.png';

        // If an image file was uploaded via multer
        if (req.file) {
            profilePicFilename = req.file.filename;
        }
        // If profilePic is a Base64 string, save it as an image
        else if (profilePic && profilePic.startsWith('data:image')) {
            const base64Data = profilePic.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const filename = `profile-${Date.now()}.png`;

            fs.writeFileSync(`uploads/${filename}`, buffer);
            profilePicFilename = filename;
        }

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            profilePic: profilePicFilename
        });

        await user.save();

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ token, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// User Login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid Credentials' });

        // ✅ Use bcrypt.compare to match passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials' });

        // ✅ Use process.env.JWT_SECRET
        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, profilePic: user.profilePic });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
