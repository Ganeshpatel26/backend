

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const EmployeeModel = require('./models/Employee');
const Bill = require('./models/Bill');

const app = express();
const PORT = process.env.PORT || 3005;
const JWT_SECRET = 'your_jwt_secret';

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://gpat5592:gpat5592@cluster0.8leyevd.mongodb.net/Ganesh23', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Authentication Routes

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Success', token });
          } else {
            res.json({ message: 'Incorrect Password' });
          }
        });
      } else {
        res.json({ message: 'No Record Existed' });
      }
    })
    .catch((err) => res.status(500).json({ message: 'Server Error' }));
});

app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    const employee = await EmployeeModel.create(req.body);
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Bill Management Routes

app.get('/bills', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/bills', async (req, res) => {
  const { title, amount } = req.body;

  const newBill = new Bill({
    title,
    amount
  });

  try {
    const bill = await newBill.save();
    res.json(bill);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.delete('/bills/:id', async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));