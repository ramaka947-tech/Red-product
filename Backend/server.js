const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const hotelRoutes = require('./src/routes/hotels.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const errorHandler = require('./src/middlewares/error.middleware');

const app = express();

// Connexion MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir les fichiers statiques du Frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/notifications', notificationRoutes);

// Route de test
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/connexion.html'));
});

// Gestion des erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});