# WorkUup - Backend d'une Application de Réseau Social

## Description

**WorkUup** est le backend d'une application de réseau social, développé dans le cadre de mon projet final de formation.  
L'objectif principal est de créer une API complète permettant de gérer les utilisateurs, leurs publications, les commentaires, ainsi que la gestion des rôles.  
Ce backend utilise une architecture **MVC**, **Docker** pour la containerisation, **MySQL** comme base de données, et **Sequelize** comme ORM.

---

## Fonctionnalités

- **Gestion des utilisateurs** : Inscription, authentification, modification et suppression des utilisateurs.
- **Gestion des publications** : Création, récupération, modification et suppression de publications.
- **Gestion des commentaires** : Création, modification et suppression de commentaires sur les publications.
- **Gestion des rôles** : Définition des rôles (utilisateur, administrateur) avec restriction d'accès via middleware.
- **Authentification sécurisée avec JWT** : Utilisation de JSON Web Tokens pour sécuriser les routes.

---

## Technologies Utilisées

Ce projet utilise les technologies suivantes :

- **Node.js** : Environement d'execution JavaScript coté server pour le développement backend.
- **Express.js** : Framework web minimaliste pour la gestion des routes.
- **Sequelize** : ORM pour interagir avec la base de données MySQL.
- **MySQL** : Base de données relationnelle pour le stockage des données.
- **JWT** : Pour une authentification sécurisée des utilisateurs.
- **Docker** : Pour containeriser l'application et garantir sa portabilité.
- **Docker Compose** : Pour orchestrer les services Docker (backend et base de données).

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) (et Docker Compose)
- [MySQL](https://www.mysql.com/) ou un service compatible Docker

---

## Installation

### Cloner le Repo

```bash
git clone https://github.com/Walidd35/SocialNetwork.git
cd back
```
Configuration de l'/Environnement

Créez un fichier .env à la racine du projet avec les informations de connexion à la base de données :
```bash
DB_NAME=social_network
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_DIALECT=mysql
```
Optionnel : Utiliser Docker

Si vous souhaitez exécuter l'application avec Docker, assurez-vous que Docker est installé.
Le fichier docker-compose.yml est déjà configuré pour créer un environnement contenant le backend et MySQL.

Lancez l'application avec Docker :
```bash
docker-compose up --build
```
Installer les Dépendances Node.js
```bash
npm install
```
Lancer l'Application

Une fois toutes les dépendances installées, démarrez l'application :
```bash
npm start
```
L'API sera accessible sur http://localhost:3000.



Routes Principales

    POST /auth/signup : Inscription d'un nouvel utilisateur.
    POST /auth/login : Authentification d'un utilisateur.
    GET  /all/posts : Récupérer tous les posts.
    POST /post : Créer un nouveau post.
    GET  /post/:id : Récupérer un post par son ID.
    PUT  /post/:id : Modifier un post.
    DELETE /post/:id : Supprimer un post.

Contribuer

Si vous souhaitez contribuer à ce projet, suivez ces étapes :
      
    Forkez ce repository.

    Créez une branche pour votre fonctionnalité :
```bash
git checkout -b feature/nom-de-la-fonctionnalité
```
Faites vos changements et committez :
```bash
git commit -am 'Ajoute une nouvelle fonctionnalité'
```
Poussez votre branche :

    git push origin feature/nom-de-la-fonctionnalité

    Créez une Pull Request.

Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.
