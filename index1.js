// // server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const Bill = require('./models/Bill'); // Import the Bill model

// const app = express();
// const PORT = process.env.PORT || 3005;

// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://gpat5592:gpat5592@cluster0.8leyevd.mongodb.net/billDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log(err));

// // Routes
// app.get('http://localhost:3005/bills', async (req, res) => {
//   try {
//     const bills = await Bill.find();
//     res.json(bills);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// app.post('/bills', async (req, res) => {
//   const { title, amount } = req.body;

//   const newBill = new Bill({
//     title,
//     amount
//   });

//   try {
//     const bill = await newBill.save();
//     res.json(bill);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// app.delete('/bills/:id', async (req, res) => {
//   try {
//     await Bill.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Bill deleted' });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
