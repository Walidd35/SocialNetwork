const { describe, it, expect, beforeEach } = require("@jest/globals");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Roles: Role } = require("../models/index");
const userController = require("../controllers/user.controller");

// Configuration des mocks pour les modèles et Sequelize

// Cela permet de simuler le comportement de la base de données
jest.mock("../models/index", () => {
  const actualSequelize = jest.requireActual("sequelize");
  return {
    sequelize: {
      define: jest.fn(),
      authenticate: jest.fn(),
      sync: jest.fn(),
      query: jest.fn(),
      queryInterface: {
        describeTable: jest.fn().mockResolvedValue({}),
      },
      Sequelize: {
        Op: {
          and: Symbol("and"),
          or: Symbol("or"),
          gt: Symbol("gt"),
          lt: Symbol("lt"),
          
        },
      },
    },
    User: {
      findByPk: jest.fn(),
      findAll: jest.fn(),
      destroy: jest.fn(),
      create: jest.fn().mockImplementation((data) => ({
        ...data,
        setRoles: jest.fn(), 
        user_id: 1,
      })),
      findOne: jest.fn(),
      define: jest.fn(),
    },
    Roles: {
      findOne: jest.fn(),
      belongsToMany: jest.fn(),
    },
    Posts: {
      belongsTo: jest.fn(),
      hasMany: jest.fn(),
    },
    Comments: {
      belongsTo: jest.fn(),
    },
    ROLES: ["user", "admin"],
  };
});

jest.mock("sequelize", () => {
  // Configuration du mock pour Sequelize
  class MockModel {
    static init = jest.fn();
    static findOne = jest.fn();
    static create = jest.fn();
  }

  return {
    Model: MockModel,
    DataTypes: {
      INTEGER: "INTEGER",
      STRING: "STRING",
    },
    Sequelize: jest.fn(() => ({
      define: jest.fn(),
      authenticate: jest.fn(),
      sync: jest.fn(),
    })),
  };
});

// Mock des dépendances
jest.mock("../models/index");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

// Début des tests unitaires pour le contrôleur User
describe("Test Unitaire User", () => {
  let req, res;

  // Configuration initiale avant chaque test
  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  // Tests pour la fonction deleteUser
  describe("deleteUser", () => {
    it("Doit supprimmer un user", async () => {
      req.params.id = "1";
      User.destroy.mockResolvedValue(1);

      await userController.deleteUser(req, res);

      expect(User.destroy).toHaveBeenCalledWith({ where: { user_id: "1" } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Utilisateur supprimé avec succès",
      });
    });

    it("Doit retourner 404 si user non trouvé", async () => {
      req.params.id = "1";
      User.destroy.mockResolvedValue(0);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Utilisateur non trouvé",
      });
    });

    it("Doit gérer les erreurs de serveur", async () => {
      req.params.id = "1";
      User.destroy.mockRejectedValue(new Error("Database error"));

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
  // Tests pour la fonction Signup
  describe("signup", () => {
    it("Doit enregistrer un nouvel user", async () => {
      req.body = {
        email: "test@example.com",
        password: "password",
        username: "testuser",
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const mockCreatedUser = {
        user_id: 1,
        email: "test@example.com",
        username: "testuser",
        password: "hashedPassword",
        setRoles: jest.fn().mockResolvedValue(true),
      };

      User.create.mockResolvedValue(mockCreatedUser);
      Role.findOne.mockResolvedValue({ role_id: 1, role_name: "user" });

      await userController.signup(req, res);

      expect(User.create).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
      });

      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("enregistré avec succès"),
        })
      );
    });
  });

  // Tests pour la fonction modifier user
  describe("updateUser", () => {
    it("Doit modifier l/user avec succès", async () => {
      const mockUser = {
        id: 1,
        username: "oldname",
        email: "old@test.com",
        save: jest.fn(),
        setRoles: jest.fn(),
      };

      req.params = { id: "1" };
      req.body = {
        username: "newname",
        email: "new@test.com",
      };

      User.findByPk.mockResolvedValue(mockUser);

      await userController.updateUser(req, res);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Utilisateur mis à jour avec succès",
        user: mockUser,
      });
    });

    it("devrait gérer les erreurs d/user non trouvé", async () => {
      req.params = { id: "999" };
      User.findByPk.mockResolvedValue(null);

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Utilisateur non trouvé",
      });
    });

    it("devrait gérer la mise à jour du mot de passe", async () => {
      const mockUser = {
        id: 1,
        save: jest.fn(),
        setRoles: jest.fn(),
      };

      req.params = { id: "1" };
      req.body = {
        password: "newpassword",
      };

      User.findByPk.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue("hashedPassword");

      await userController.updateUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword", 8);
      expect(mockUser.password).toBe("hashedPassword");
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  // Tests pour la fonction Login
  describe("login", () => {
    it("Devrait se connecter avec succès et renvoyer un token", async () => {
      req.body = { email: "test@example.com", password: "password" };
      User.findOne.mockResolvedValue({
        user_id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        roles: [{ role_name: "user" }],
      });
      
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await userController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Connexion réussie",
        token: "token",
      });
    });

    it("devrait renvoyer 400 si l/utilisateur est introuvable", async () => {
      req.body = { email: "nonexistent@example.com", password: "password" };
      User.findOne.mockResolvedValue(null);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Identifiants incorrects",
      });
    });
    // il faut que j'ajoute d'autres tests pour les cas d'erreur et de mot de passe incorrect
  });

  // Tests pour la fonction getAllUser
  describe("getAllUsers", () => {
    it("Doit retourner tout les users", async () => {
      const mockUsers = [
        { id: 1, name: "User1" },
        { id: 2, name: "User2" },
      ];
      User.findAll.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("Devrait gérer les erreurs", async () => {
      User.findAll.mockRejectedValue(new Error("Database error"));

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  // Tests pour la fonction getUserById
  describe("getUserById", () => {
    it("Doit retourner un user grâce son ID", async () => {
      req.params.id = "1";
      const mockUser = { id: 1, name: "User1" };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("Devrait retourner erreur 404 si user n/est pas trouver", async () => {
      req.params.id = "999";
      User.findByPk.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Utilisateur non trouvé",
      });
    });

    it("Devrait gérer les erreurs", async () => {
      req.params.id = "1";
      User.findByPk.mockRejectedValue(new Error("Database error"));

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
