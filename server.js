// server.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const pool = require('./db');
const nodemailer = require('nodemailer');
require('dotenv').config();


const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


// contact endpoint
app.post('/api/contact',
// validation
body('name').isLength({min:2}).trim().escape(),
body('email').isEmail().normalizeEmail(),
body('message').isLength({min:5}).trim().escape(),
async (req,res)=>{
const errors = validationResult(req);
if(!errors.isEmpty()) return res.status(400).json({ error: 'Invalid input', details: errors.array() });


const { name, email, message } = req.body;
try{
// store message in DB
const sql = 'INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, NOW())';
await pool.execute(sql, [name, email, message]);


// send notification email
const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: process.env.SMTP_PORT || 587,
secure: process.env.SMTP_SECURE === 'true',
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS
}
});


const mailOptions = {
  from: process.env.FROM_EMAIL || process.env.SMTP_USER,
  to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
  subject: `New contact from ${name}`,
  text: `Name: ${name}\nEmail: ${email}\n\n${message}`
};

// send email
transporter.sendMail(mailOptions).catch(err => {
  console.warn('Mail send failed:', err && err.message);
});

// respond to client
res.json({ message: 'Message received. Thank you!' });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
}
});

// fallback for frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
