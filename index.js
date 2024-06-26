const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const EmployeeModel = require('./models/Employee');
const Bill = require('./models/Bill');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// CORS middleware configuration
app.use(function (req, res, next) {
  // Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});

app.use(express.json());
app.use(bodyParser.json());

// Use CORS and specify the allowed origin
// app.use(cors({
//   origin: 'https://billingmernstack.netlify.app', // Replace this with your Netlify app's URL
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
//     process.exit(1); // Exit process if unable to connect to database
//   });


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    if (err.name === 'MongoNetworkError') {
      console.error('Network error. Check if your IP address is whitelisted and the server is accessible.');
    } else if (err.name === 'MongooseServerSelectionError') {
      console.error('Server selection error. Check if your MongoDB URI is correct and the cluster is running.');
    }
    process.exit(1); // Exit process if unable to connect to database
  });

// Authentication Routes
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No Record Existed' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect Password' });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Success', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new EmployeeModel({
      email,
      password: hashedPassword,
      // include other required fields
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error('Signup error:', err); // Detailed error logging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Bill Management Routes
app.get('/bills', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (err) {
    console.error('Fetching bills error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/bills', async (req, res) => {
  const { title, amount } = req.body;
  const newBill = new Bill({ title, amount });

  try {
    const bill = await newBill.save();
    res.json(bill);
  } catch (err) {
    console.error('Creating bill error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.delete('/bills/:id', async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    console.error('Deleting bill error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
