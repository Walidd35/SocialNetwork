// Importation des modules nécessaires pour les tests
const request = require('supertest'); // Pour envoyer des requêtes HTTP
const app = require('../SERVERetAPP/app'); // Point d'entrée de ton application Express
const User = require('../models/users.model'); // Modèle de l'utilisateur
const bcrypt = require('bcryptjs');

// Mock du middleware d'authentification
jest.mock('../middlewares/jwtAuth'); // Nous utilisons ce mock pour éviter d'effectuer des appels réels à notre middleware d'authentification.

jest.mock('../models/users.model'); // Mock du modèle User pour simuler la récupération d'utilisateur depuis la base de données

// describe('User controller - getById', () => {
//     // Réinitialise les mocks avant chaque exécution de test
//     beforeEach(() => {
//         jest.clearAllMocks(); // Réinitialise tous les mocks après chaque test pour éviter les effets de bord
//     });

//     // Test pour obtenir un utilisateur par ID
//     test('devrait retourner un user par son ID', async () => {
//         const userId = 1; // Identifiant d'utilisateur à tester
//         const mockUser = { // Utilisateur fictif retourné par le mock
//             user_id: userId,
//             username: 'TestUser',
//             email: 'test@test.com'
//         };
        
//         User.findByPk.mockResolvedValue(mockUser); // Mock la fonction findByPk pour retourner un utilisateur fictif

//         const response = await request(app) // Envoie une requête HTTP pour obtenir un utilisateur par ID
//             .get(`/api/user/${userId}`) // Route à tester
//             .set('Authorization', 'Bearer fake-token'); // Ajout du token d'authentification fictif

//         // Vérifications des résultats
//         expect(response.status).toBe(200); // Vérifie que le statut HTTP est 200
//         expect(response.body).toEqual(mockUser); // Vérifie que la réponse contient les détails de mockUser
//     });

//     // Test pour vérifier le cas où l'utilisateur n'est pas trouvé
//     test("devrait retourner erreur 404 si l'user n'est pas trouvé", async () => {
//         const userId = 2;
//         User.findByPk.mockResolvedValue(null); // Mock pour indiquer qu'aucun utilisateur n'est trouvé

//         const response = await request(app)
//             .get(`/api/user/${userId}`)
//             .set('Authorization', 'Bearer fake-token');

//         // Vérifications des résultats
//         expect(response.status).toBe(404); // Vérifie que le statut HTTP est 404
//         expect(response.body).toHaveProperty('error', 'Utilisateur non trouvé'); // Vérifie que le corps de la réponse contient le message d'erreur attendu
//     });

//     // Test pour simuler une erreur de base de données
//     test('devrait retourner erreur 500 si une erreur se produit', async () => {
//         const userId = 3;
//         User.findByPk.mockRejectedValue(new Error('Erreur de base de données')); // Mock pour simuler une erreur

//         const response = await request(app)
//             .get(`/api/user/${userId}`)
//             .set('Authorization', 'Bearer fake-token');

//         // Vérifications des résultats
//         expect(response.status).toBe(500); // Vérifie que le statut HTTP est 500
//         expect(response.body).toHaveProperty('error'); // Vérifie que le corps de la réponse contient un message d'erreur
//     });
// });

// describe('User controller - getAll', () => {
//     beforeEach(() => {
//         jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
//     });

//     test('devrait retourner tout les users', async () => {
//         const mockUsers = [ // Liste fictive d'utilisateurs
//             {
//                 user_id: 1,
//                 username: 'TestUser1',
//                 email: 'test1@test.com'
//             },
//             {
//                 user_id: 2,
//                 username: 'TestUser2',
//                 email: 'test2@test.com'
//             }
//         ];

//         User.findAll.mockResolvedValue(mockUsers); // Mock la récupération de tous les utilisateurs

//         const response = await request(app)
//             .get('/api/users') // Route pour obtenir tous les utilisateurs
//             .set('Authorization', 'Bearer fake-token');

//         // Vérifications des résultats
//         expect(response.status).toBe(200); // Le statut HTTP devrait être 200
//         expect(response.body).toEqual(mockUsers); // Le corps de la réponse doit être la liste des utilisateurs
//     });

//     test("devrait retourner un array vide si aucun user n'est trouvé", async () => {
//         User.findAll.mockResolvedValue([]); // Mock la situation où aucun utilisateur n'est trouvé

//         const response = await request(app)
//             .get('/api/users')
//             .set('Authorization', 'Bearer fake-token');

//         expect(response.status).toBe(200); // Le statut HTTP devrait toujours être 200
//         expect(response.body).toEqual([]); // Le corps de la réponse devrait être une liste vide
//     });

//     test('devrait retourner erreur 500 si une erreur se produit', async () => {
//         User.findAll.mockRejectedValue(new Error('Erreur de base de données')); // Simuler une erreur de base de données

//         const response = await request(app)
//             .get('/api/users')
//             .set('Authorization', 'Bearer fake-token');

//         expect(response.status).toBe(500); // Le statut HTTP devrait être 500 en cas d'erreur
//         expect(response.body).toHaveProperty('error'); // Le corps de la réponse doit contenir un message d'erreur
//     });
// });

// describe('User controller - deleteById', () => {
//         beforeEach(() => {
//             jest.clearAllMocks(); // Réinitialise tous les mocks après chaque test pour éviter les effets de bord
//         });

//     test('devrait supprimer un utilisateur par ID', async () => {
//             const userId = 1;
//             const mockUser = {
//                 user_id: userId,
//                 username: 'TestUser',
//                 email: 'test@test.com'
//             };

//             // Configuration des mocks pour simuler un succès
//             User.findOne.mockResolvedValue(mockUser);
//             User.destroy.mockResolvedValue(1);

//             const response = await request(app)
//                 .delete(`/api/user/${userId}`)
//                 .set('Authorization', 'Bearer fake-token');

//             expect(response.status).toBe(200);
//             expect(response.body).toHaveProperty('message', 'Utilisateur supprimer avec succès');
//             expect(User.findOne).toHaveBeenCalledWith({ where: { user_id: userId.toString() } });
//             expect(User.destroy).toHaveBeenCalledWith({ where: { user_id: userId.toString() } });
//         });

//     test('devrait retourner 404 si l\'utilisateur n\'est pas trouvé', async () => {
//             const userId = 2;
            
//             // Mock pour simuler un utilisateur non trouvé
//             User.findOne.mockResolvedValue(null);
//             // Assurez-vous que destroy ne sera pas appelé
//             User.destroy.mockReset();

//             const response = await request(app)
//                 .delete(`/api/user/${userId}`)
//                 .set('Authorization', 'Bearer fake-token');

//             expect(response.status).toBe(404);
//             expect(response.body).toHaveProperty('error', 'Utilisateur non trouvé');
//             expect(User.findOne).toHaveBeenCalledWith({ where: { user_id: userId.toString() } });
//             expect(User.destroy).not.toHaveBeenCalled();
//         });

//     test('devrait retourner 500 en cas d\'erreur', async () => {
//             const userId = 3;
            
//             // Mock pour simuler une erreur de base de données
//             User.findOne.mockRejectedValue(new Error('Erreur de base de données'));
//             // Assurez-vous que destroy ne sera pas appelé
//             User.destroy.mockReset();

//             const response = await request(app)
//                 .delete(`/api/user/${userId}`)
//                 .set('Authorization', 'Bearer fake-token');

//             expect(response.status).toBe(500);
//             expect(response.body).toHaveProperty('error');
//             expect(User.findOne).toHaveBeenCalledWith({ where: { user_id: userId.toString() } });
//             expect(User.destroy).not.toHaveBeenCalled();
//         });
// });

describe('User controller -  signup',() => {
    beforeEach(() => {
        jest.clearAllMocks(); // Réinitialise tous les mocks après chaque test pour éviter les effets de bord
    });

    // Test pour une inscription réussie
    test('devrait enregistrer un nouvel utilisateur et envoyer un message', async () => {
        const newUser = { // Données fictives pour l'inscription
            username: 'NewUser',
            email: 'newuser@test.com',
            password: 'password123', // Mot de passe en clair, il sera hashé avant l'enregistrement
        };

        // Mock la fonction findOne pour vérifier que l'email n'est pas déjà pris
        User.findOne.mockResolvedValue(null); // Simule que l'email n'existe pas dans la base

        // Mock le hashage du mot de passe avec bcrypt
        bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword'); // Simule que le mot de passe est hashé

        // Mock la création de l'utilisateur dans la base de données
        User.create.mockResolvedValue(newUser);

        const response = await request(app)
            .post('/api/signup') // La route pour l'inscription
            .send(newUser);

        // Vérifications des résultats
        expect(response.status).toBe(201); // Vérifie que le statut HTTP est 201 (création)
        expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès'); // Vérifie que le message de succès est correct
        expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ // Vérifie que la création de l'utilisateur a bien été appelée avec les bonnes données
            username: newUser.username,
            email: newUser.email,
            password: 'hashedPassword', // Vérifie que le mot de passe a été hashé
        }));
    });
});
