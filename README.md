Social Network Backend "WorkUup"
Description

Ce projet est le backend d'une application de réseau social, développé dans le cadre de mon projet final de fin de formation. L'objectif est de créer une API complète permettant de gérer les utilisateurs, leurs posts, les commentaires, ainsi que la gestion des rôles. Ce backend utilise une architecture MVC, avec Docker pour la containerisation, MySQL comme base de données, et Sequelize pour l'ORM.
Fonctionnalités

    Gestion des utilisateurs : Inscription, authentification, modification, suppression.
    Gestion des posts : Création, récupération, modification, suppression de posts.
    Gestion des commentaires : Création, modification, suppression de commentaires sur les posts.
    Gestion des rôles : Définition des rôles (utilisateur, administrateur) avec restriction d'accès via middleware.
    Authentification avec JWT : Utilisation de JSON Web Tokens pour sécuriser les routes.

Technologies utilisées

Voici les technologies principales utilisées dans ce projet :

    Node.js Node.js : Framework JavaScript pour le développement backend.
    Express.js Express.js : Framework web minimaliste pour gérer les routes.
    Sequelize : ORM pour gérer les interactions avec la base de données MySQL.
    MySQL MySQL : Base de données relationnelle utilisée pour stocker les données.
    JWT JWT : Pour l'authentification sécurisée des utilisateurs.
    Docker Docker : Pour containeriser l'application et garantir la portabilité.
    Docker Compose Docker Compose : Pour orchestrer les services Docker (backend, base de données).

Prérequis

Avant de commencer, assurez-vous que vous avez installé les éléments suivants :

    Node.js
    Docker (et Docker Compose)
    MySQL ou un service compatible Docker
    Git

Installation
Cloner le repository

git clone https://github.com/Walidd35/SocialNetwork.git
cd SocialNetwork

Configuration de l'environnement

Configurer le fichier .env à la racine du projet pour les informations de connexion à la base de données :

DB_NAME=social_network
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_DIALECT=mysql

Optionnel : Docker

Si vous souhaitez utiliser Docker pour exécuter l'application, assurez-vous d'avoir Docker installé. Le fichier docker-compose.yml est déjà configuré pour créer un environnement contenant le backend et MySQL.

Lancer l'application avec Docker :

docker-compose up --build

Installer les dépendances Node.js

npm install

Lancer l'application

Une fois toutes les dépendances installées, vous pouvez démarrer l'application :

npm start

L'API sera accessible sur http://localhost:3000.
Structure du projet

├── back/
│   ├── config/              # Configuration de la base de données et Sequelize
│   ├── controllers/         # Logique des routes et gestion des requêtes
│   ├── models/              # Définition des modèles Sequelize (User, Post, Comment, Role)
│   ├── routes/              # Définition des routes API
│   ├── middlewares/         # Middlewares pour l'authentification et l'autorisation
│   ├── docker-compose.yml   # Fichier Docker Compose pour orchestrer les containers
│   └── server.js            # Point d'entrée de l'application
├── .env                     # Fichier de configuration pour les variables d'environnement
└── .gitignore               # Fichiers à ignorer dans le contrôle de version

Routes principales

    POST /auth/signup : Inscription d'un nouvel utilisateur.
    POST /auth/login : Authentification d'un utilisateur.
    GET /posts : Récupérer tous les posts.
    POST /all/posts : Créer un nouveau post.
    GET /post/:id : Récupérer un post par son ID.
    PUT /post/:id : Modifier un post.
    DELETE /post/:id : Supprimer un post.

Contribuer

Si vous souhaitez contribuer à ce projet, suivez ces étapes :

    Forkez ce repository.
    Créez une branche pour votre fonctionnalité (git checkout -b feature/nom-de-la-fonctionnalité).
    Faites vos changements et committez (git commit -am 'Ajoute une nouvelle fonctionnalité').
    Poussez votre branche (git push origin feature/nom-de-la-fonctionnalité).
    Créez une Pull Request.

Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.
