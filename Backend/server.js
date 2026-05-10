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

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/notifications', notificationRoutes);

// Désactiver le cache pour les fichiers HTML
app.use((req, res, next) => {
  if (req.url.endsWith('.html') || req.url === '/') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// Servir les fichiers statiques du Frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

// Servir les fichiers statiques du Frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

// Route principale → connexion
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/connexion.html'));
});

// Gestion des erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});