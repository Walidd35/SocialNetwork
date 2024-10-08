const http = require('http');
const app = require('./app'); 

// Je normalise le port
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val; // Je retourne le val si ce n'est pas un nombre
    }
    if (port >= 0) {
        return port; // Je retourne le port s'il est valide
    }
    return false; // Je retourne false si le port n'est pas valide
};

const port = normalizePort(process.env.PORT || '3000'); // Je définit le port
app.set('port', port); // Je définit le port dans l'application Express

// Gestion des erreurs
const errorHandler = (error) => {
    if (error.syscall !== 'listen') {
        throw error; // Lance l'erreur si ce n'est pas une erreur d'écoute
    }

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error; // Lance d'autres erreurs
    }
};

// Je crée le serveur HTTP avec l'application Express
const server = http.createServer(app);
server.on('error', errorHandler);

// Événement d'écoute
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Le serveur écoute au ' + bind); // Affiche l'adresse d'écoute
});

// Je démarre le serveur
server.listen(port);

module.exports = server; // J'exporte le serveur pour une utilisation dans d'autres fichiers
