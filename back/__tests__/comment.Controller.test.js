const { describe, it, expect, beforeEach } = require("@jest/globals");
const Comment = require("../models/comments.model");
const Post = require("../models/posts.model");
const User = require('../models/users.model'); 

const commentController = require("../controllers/comment.controller");

// Mock des modèles
jest.mock("../models/comments.model");
jest.mock("../models/posts.model");
jest.mock("../models/users.model");

describe("Test unitaires Comment", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      auth: {
        userId: "1",
        roles: ["user"],
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("createComment", () => {
    it("Doit pouvoir créer un commentaire", async () => {

      req.body = { content: "Test Comment" };
      req.params.postId = "1";
      req.auth.userId = "1";

      const mockPost = { id: 1 };
      const mockComment = {
        comment_id: 1,
        content: "Test Comment",
        post_id: "1",
        user_id: "1",
      };

      Post.findByPk.mockResolvedValue(mockPost);
      Comment.create.mockResolvedValue(mockComment);

      // Execution
      await commentController.createComment(req, res);

      // Verification
      expect(Post.findByPk).toHaveBeenCalledWith("1");
      expect(Comment.create).toHaveBeenCalledWith({
        content: "Test Comment",
        post_id: "1",
        user_id: "1",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Commentaire envoyée avec succès",
        commentaire: mockComment,
      });
    });

    it("Doit retourner 404 si erreurs", async () => {
     
      req.body = { content: "Test Comment" };
      req.params.postId = "999";
      Post.findByPk.mockResolvedValue(null);

    
      await commentController.createComment(req, res);

      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Post non trouvé" });
    });
  });

  // describe('getCommentsByPostId', () => {
  //   it('Doit retourner les commentaires pour un post donné', async () => {
  //     // Préparation
  //     const mockComments = [
  //       {
  //         id: 1,
  //         content: 'Premier commentaire',
  //         post_id: 1,
  //         User: { username: 'user1' }
  //       },
  //       {
  //         id: 2,
  //         content: 'Deuxième commentaire',
  //         post_id: 1,
  //         User: { username: 'user2' }
  //       }
  //     ];

  //     Comment.findAll.mockResolvedValue(mockComments);

  //     // Execution
  //     await commentController.getCommentsByPostId(req, res);

  //     // Verification
  //     expect(Comment.findAll).toHaveBeenCalledWith({
  //       where: { post_id: '1' },
  //       include: [{ model: User, attributes: ["username"] }],
  //       order: [["created_at", "DESC"]]
  //     });
  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith(mockComments);
  //   });

  //   it('Doit retourner 404 si aucun commentaire n\'est trouvé', async () => {
  //     // Préparation
  //     Comment.findAll.mockResolvedValue([]);

  //     // Execution
  //     await commentController.getCommentsByPostId(req, res);

  //     // Verification
  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith({ 
  //       message: "Aucun commentaire trouvé pour ce post." 
  //     });
  //   });

  //   it('Doit gérer les erreurs serveur', async () => {
  //     // Préparation
  //     const errorMessage = new Error('Erreur de base de données');
  //     Comment.findAll.mockRejectedValue(errorMessage);

  //     // Execution
  //     await commentController.getCommentsByPostId(req, res);

  //     // Verification
  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.json).toHaveBeenCalledWith({
  //       error: "Erreur serveur lors de la récupération des commentaires."
  //     });
  //   });
  // });

  describe('getCommentsByPostId', () => {
    it('Doit retourner les commentaires pour un post donné', async () => {
      // Préparation
      const mockComments = [
        {
          id: 1,
          content: 'Premier commentaire',
          post_id: 1,
          User: { username: 'user1' }
        },
        {
          id: 2,
          content: 'Deuxième commentaire',
          post_id: 1,
          User: { username: 'user2' }
        }
      ];
  
      // Mock de la méthode findAll pour retourner les commentaires simulés
      Comment.findAll.mockResolvedValue(mockComments);
  
      // Exécution de la fonction avec un postId simulé dans req.params
      const req = { params: { postId: '1' } }; // Assurer que postId est bien dans req.params
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      // Execution
      await commentController.getCommentsByPostId(req, res);
  
      // Vérification
      expect(Comment.findAll).toHaveBeenCalledWith({
        where: { post_id: '1' },
        include: [{ model: User, attributes: ["username"] }],
        order: [["created_at", "DESC"]]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockComments);
    });
  
    it('Doit retourner 404 si aucun commentaire n\'est trouvé', async () => {
      // Préparation
      Comment.findAll.mockResolvedValue([]);
  
      // Exécution de la fonction avec un postId simulé dans req.params
      const req = { params: { postId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      // Execution
      await commentController.getCommentsByPostId(req, res);
  
      // Vérification
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Aucun commentaire trouvé pour ce post."
      });
    });
  
    it('Doit gérer les erreurs serveur', async () => {
      // Préparation de l'erreur simulée
      const errorMessage = new Error('Erreur de base de données');
      Comment.findAll.mockRejectedValue(errorMessage);
  
      // Exécution de la fonction avec un postId simulé dans req.params
      const req = { params: { postId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      // Execution
      await commentController.getCommentsByPostId(req, res);
  
      // Vérification de l'erreur serveur
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erreur serveur lors de la récupération des commentaires. Erreur de base de données"
      });
    });
  });
  
  describe("modifyComment", () => {
    it("Doit pouvoir modifier un commentaire", async () => {
      
      req.params.commentId = "1";
      req.body = { content: "Updated Comment" };
      req.auth.userId = "1";
      req.auth.roles = ["user"];

      const mockComment = {
        comment_id: 1,
        content: "Original Comment",
        user_id: "1",
        update: jest.fn(),
        Post: { user_id: "2" },
      };

      Comment.findOne.mockResolvedValue(mockComment);

      
      await commentController.modifyComment(req, res);

      // Verification
      expect(mockComment.update).toHaveBeenCalledWith({
        content: "Updated Comment",
        updated_at: expect.any(Date),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Commentaire modifié avec succès",
        })
      );
    });

    it("Doit retourner 403 si User non-autorisé", async () => {
      
      req.params.commentId = "1";
      req.body = { content: "Updated Comment" };
      req.auth.userId = "2";
      req.auth.roles = ["user"];

      const mockComment = {
        comment_id: 1,
        user_id: "1",
        Post: { user_id: "2" },
      };

      Comment.findOne.mockResolvedValue(mockComment);

    
      await commentController.modifyComment(req, res);


      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Vous n'êtes pas autorisé à modifier ce commentaire",
      });
    });
  });

  describe("deleteComment", () => {
    it("Doit pouvoir supprimer un commentaire", async () => {
     
      req.params.commentId = "1";
      req.auth.userId = "1";
      req.auth.roles = ["user"];

      const mockComment = {
        comment_id: 1,
        user_id: "1",
        destroy: jest.fn(),
        Post: { user_id: "2" },
      };

      Comment.findOne.mockResolvedValue(mockComment);

     
      await commentController.deleteComment(req, res);

      
      expect(mockComment.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Commentaire supprimé avec succès.",
      });
    });

    it("Doit retourner 403 si User non-autorisé", async () => {
     
      req.params.commentId = "1";
      req.auth.userId = "2";
      req.auth.roles = ["user"];

      const mockComment = {
        comment_id: 1,
        user_id: "1",
        Post: { user_id: "2" },
      };

      Comment.findOne.mockResolvedValue(mockComment);

      
      await commentController.deleteComment(req, res);

      // Verification
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Vous n'êtes pas autorisé à supprimer ce commentaire.",
      });
    });
  });
});
