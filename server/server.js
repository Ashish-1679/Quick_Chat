const express = require('express');
require('dotenv/config');
const { connectDB } = require('./lib/db.js');
const cors = require('cors');
const userRouter = require('./routes/userRoutes.js');
const messageRouter = require('./routes/messageRoutes.js');

const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: '4mb' }));

app.use('/api/status', (req, res) => {
  res.send('Server is Live');
});

app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

const startServer = async () => {
  const isDatabaseConnected = await connectDB();
  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (!isDatabaseConnected) {
      console.warn('MongoDB is unavailable; database-backed routes may not work.');
    }
  });
};

startServer().catch((error) => {
  console.error('Unable to start server:', error);
});

