const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Model
const User = require('./models/User');
console.log('🧪 Type of User:', typeof User);

const Client = require('./models/client');



// ✅ POST Route
app.post('/api/users', async (req, res) => {
  try {
    console.log("📥 Client POST received:", req.body);

    console.log('📦 Incoming Data:', req.body); // <== log request body

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('❌ Error saving user:', err); // <== log full error
    res.status(400).json({ error: 'Failed to create user', details: err.message || err });
  }
});


// ✅ GET Route
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});
// POST: Add a new client and assign to a worker
app.post('/api/clients', async (req, res) => {
  try {
    const newClient = new Client(req.body);
    await newClient.save();
    res.status(201).json({ message: 'Client added successfully', client: newClient });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add client', details: err.message });
  }
});

// GET: Clients assigned to a specific worker (user)
app.get('/api/clients/worker/:userId', async (req, res) => {
  try {
    const clients = await Client.find({ assignedTo: req.params.userId });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching assigned clients' });
  }
});


// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
