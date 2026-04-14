const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'Serveur RED PRODUCT fonctionne !' });
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});


// Liste des hôtels (pour l'instant sans base de données)
const hotels = [
    { id: 1, nom: "Hôtel Terrou-Bi", adresse: "Boulevard Martin Luther King, Dakar", prix: 25000 },
    { id: 2, nom: "King Fahd Palace", adresse: "Rte des Almadies, Dakar", prix: 20000 },
    { id: 3, nom: "Radisson Blu Hotel", adresse: "Rte de la Corniche, Dakar", prix: 22000 }
];

app.get('/api/hotels', (req, res) => {
    res.json(hotels);
});