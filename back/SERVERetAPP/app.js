
// Définit l'application Express.
// Ajoute des en-têtes CORS pour permettre l'accès à l'API depuis différentes origines.
// Active la gestion des requêtes JSON.
// Utilise un routeur défini dans le fichier routes/routes.js.
// Ajoute une route de base (/) pour tester si le serveur fonctionne.

const express = require('express');
const app = express();
const router = require('../routes/routes')

 app.use((req,res,next)=>{
    // Accéder à notre API depuis n'importe quel origine (*)/
  res.setHeader('Access-Control-Allow-Origin','*');
    // Ajout des Headers mentionnés au requêtes envoyés vers notre API (Origin, X-Requested-With, etc .)
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,Content,Accept,Content-Type,Authorization');
    // Envoi des requêtes avec les méthodes mentionnées (GET,POST,ETC .)
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH, OPTIONS');
 next()  
});

app.use(express.json());

app.use('/api', router)

// Snipet pour verifier si le serveur est fonctionnel 
app.get('/', (req, res) => {
    res.json({message:'hello from paris'});
});


module.exports = app;
