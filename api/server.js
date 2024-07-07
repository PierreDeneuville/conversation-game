const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Servir les fichiers statiques du dossier racine du projet
app.use(express.static(path.join(__dirname, '..')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/api/themes', (req, res) => {
    const themesPath = path.join(__dirname, '..', 'data', 'themes.json');
    const themes = JSON.parse(fs.readFileSync(themesPath, 'utf8'));
    res.json(themes.map(theme => ({ id: theme.id, name: theme.variables.title })));
});

app.get('/api/themes/:id', (req, res) => {
    const themesPath = path.join(__dirname, '..', 'data', 'themes.json');
    const themes = JSON.parse(fs.readFileSync(themesPath, 'utf8'));
    const theme = themes.find(t => t.id === req.params.id);
    if (theme) {
        res.json(theme);
    } else {
        res.status(404).json({ error: 'Theme not found' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Serving static files from:', path.join(__dirname, '..'));
});