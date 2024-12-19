const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

let storedOtp = {};

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    storedOtp[email] = otp;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ success: false, message: 'Error sending OTP' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    });
});

app.post('/verify-otp', (req, res) => {
    const { otp, email } = req.body;

    if (storedOtp[email] && storedOtp[email].toString() === otp.toString()) {
        console.log('OTP is valid');
        return res.status(200).send({ success: true });
    } else {
        console.log('Invalid OTP');
        return res.status(400).send({ success: false, message: 'Invalid OTP' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
