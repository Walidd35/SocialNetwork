const express = require("express");
const app = express();
const router = require("../routes/routes");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());

//Assurez-vous de gérer les requêtes OPTIONS pour éviter le blocage
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Remplace par l'URL de ton frontend si nécessaire
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  res.sendStatus(200);
});

// Middleware pour afficher les logs des requêtes
app.use((req, res, next) => {
  console.log(
    `Requête reçue avec la méthode: ${req.method}, à l'URL: ${req.url}`
  );
  next();
});

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');  // URL de ton frontend
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   next();
// });

// Vérifier et créer le dossier "uploads" s'il n'existe pas

const uploadDir = path.join(__dirname, "..", "serveretapp", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.json());

app.use("/api", router);

// Snippet pour vérifier si le serveur est fonctionnel
// app.get('/', (req, res) => {
//     res.json({ message: 'hello from paris' });
// });

module.exports = app;
