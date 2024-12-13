const { describe, it, expect, beforeEach } = require("@jest/globals");
const Post = require("../models/posts.model");
const User = require("../models/users.model");
const postController = require("../controllers/post.controller");

// Mock des modèles
jest.mock("../models/posts.model");
jest.mock("../models/users.model");

describe("Tests Unitaires Post", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      auth: {
        userId: "1",
        roles: ["user"],
      },
      file: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
   
    jest.clearAllMocks();
  });

  describe("createPost", () => {
    
    it("Doit pouvoir créer un post", async () => {
     
      req.body = {
        title: "Test Post",
        description: "Test Description",
      };
      req.file = { path: "test/image.jpg" };

      const mockPost = {
        id: 1,
        title: "Test Post",
        description: "Test Description",
        image: "test/image.jpg",
        user_id: "1",
      };

      Post.create.mockResolvedValue(mockPost);

      
      await postController.createPost(req, res);

     
      expect(Post.create).toHaveBeenCalledWith({
        title: "Test Post",
        description: "Test Description",
        image: "test/image.jpg",
        user_id: "1",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it("Doit retourner 400 si titre ou description manquante", async () => {
      
      req.body = { title: "Test Post" }; 
      // manque la description exemple
      
      await postController.createPost(req, res);

      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Le titre et la description sont requis.",
      });
      expect(Post.create).not.toHaveBeenCalled();
    });

    it("Doit retourner 400 si token manquant", async () => {
     
      req.auth = null;
      req.body = {
        title: "Test Post",
        description: "Test Description",
      };

     
      await postController.createPost(req, res);

  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "L'identifiant de l'utilisateur est manquant dans le token.",
      });
    });

    it("Doit pouvoir gérer les erreurs", async () => {
 
      req.body = {
        title: "Test Post",
        description: "Test Description",
      };
      const error = new Error("Database error");
      Post.create.mockRejectedValue(error);

      
      await postController.createPost(req, res);

     
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erreur lors de la création du post.",
        details: "Database error",
      });
    });
  });

  describe("getAllPosts", () => {

    it("Doit retourner tout les posts avec les infos des Users", async () => {
     
      const mockPosts = [
        {
          id: 1,
          title: "Post 1",
          User: { username: "user1" },
          toJSON: () => ({
            id: 1,
            title: "Post 1",
            User: { username: "user1" },
          }),
        },
      ];

      Post.findAll.mockResolvedValue(mockPosts);

      
      await postController.getAllPosts(req, res);

      
      expect(Post.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
        order: [["created_at", "DESC"]], 
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          title: "Post 1",
          User: { username: "user1" },
        },
      ]);
    });

    it("Doit pouvoir gérer les erreurs", async () => {
      
      Post.findAll.mockRejectedValue(new Error("Database error"));

     
      await postController.getAllPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Une erreur est survenue lors de la récupération des posts.",
      });
    });
  });

  describe("getPostById", () => {

    let req, res, next;

    beforeEach(() => {
      req = {
        params: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it("Doit retourner un post grâce a son ID", async () => {
      
      req.params.id = "1";
      const mockPost = { id: 1, title: "Test Post" };
      Post.findByPk.mockResolvedValue(mockPost);

     
      await postController.getPostById(req, res);

      // Verification
      expect(Post.findByPk).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it("Doit retourner 404 si le post n/existe pas", async () => {
     
      req.params.id = "999";
      Post.findByPk.mockResolvedValue(null);

     
      await postController.getPostById(req, res);

      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post non disponible",
      });
    });

    it("Doit retourner 500 si il une erreur base de données", async () => {
      
      req.params.id = "1";
      Post.findByPk.mockRejectedValue(new Error("Database error"));

      
      await postController.getPostById(req, res);

  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erreur lors de la récupération du post",
      });
    });
  });

  describe("updatePost", () => {

    it("Doit pouvoir modifier un post", async () => {
     
      req.params.id = "1";
      req.body = {
        title: "Updated Title",
        description: "Updated Description",
      };
      req.auth.userId = "1";

      const mockPost = {
        id: 1,
        title: "Old Title",
        description: "Old Description",
        user_id: "1",
        save: jest.fn(),
      };

      Post.findByPk.mockResolvedValue(mockPost);

      
      await postController.updatePost(req, res);

      
      expect(mockPost.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Publication mise à jour avec succès",
        post: mockPost,
      });
    });

    it("Doit retourner 404 si post inexistant", async () => {
      
      req.params.id = "999";
      Post.findByPk.mockResolvedValue(null);

      
      await postController.updatePost(req, res);

      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Publication non trouvée.",
      });
    });

    it("Doit retourner 403 si User non-autorisé", async () => {
      
      req.params.id = "1";
      req.auth.userId = "2"; // Different user
      req.auth.roles = ["user"]; // Not admin

      const mockPost = {
        id: 1,
        user_id: "1",
      };

      Post.findByPk.mockResolvedValue(mockPost);

      
      await postController.updatePost(req, res);

      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Accès refusé. Vous ne pouvez pas modifier cette publication.",
      });
    });
  });

  describe("deletePost", () => {

    it("Doit pouvoir supprimer un post", async () => {
      
      req.params.id = "1";
      const mockPost = {
        id: 1,
        destroy: jest.fn(),
      };
      Post.findByPk.mockResolvedValue(mockPost);

      
      await postController.deletePost(req, res);

      
      expect(mockPost.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Publication supprimée avec succès.",
      });
    });

    it("Doit retourner 404 si post inexistant", async () => {
      
      req.params.id = "999";
      Post.findByPk.mockResolvedValue(null);

      
      await postController.deletePost(req, res);

      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Publication non trouvée.",
      });
    });

    it("Doit gérer les erreurs serveur", async () => {
      
      req.params.id = "1";
      Post.findByPk.mockRejectedValue(new Error("Database error"));

      
      await postController.deletePost(req, res);

      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erreur lors de la suppression de la publication.",
      });
    });
  });
});
