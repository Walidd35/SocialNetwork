const { describe, it, expect, beforeEach } = require("@jest/globals");
const Comment = require("../models/comments.model");
const Post = require("../models/posts.model");
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
      // Setup
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

      // Execute
      await commentController.createComment(req, res);

      // Verify
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
      // Setup
      req.body = { content: "Test Comment" };
      req.params.postId = "999";
      Post.findByPk.mockResolvedValue(null);

      // Execute
      await commentController.createComment(req, res);

      // Verify
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Post non trouvé" });
    });
  });

  describe("getCommentById", () => {
    it("Doit pouvoir retourner un commentaire par son ID", async () => {
      // Setup
      req.params.commentId = "1";
      const mockComment = {
        comment_id: 1,
        content: "Test Comment",
        User: { username: "testuser", email: "test@example.com" },
        Post: {
          post_id: 1,
          title: "Test Post",
          User: { email: "post@example.com" },
        },
      };

      Comment.findByPk.mockResolvedValue(mockComment);

      // Execute
      await commentController.getCommentById(req, res);

      // Verify
      expect(Comment.findByPk).toHaveBeenCalledWith("1", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockComment);
    });

    it("should return 404 if comment not found", async () => {
      // Setup
      req.params.commentId = "999";
      Comment.findByPk.mockResolvedValue(null);

      // Execute
      await commentController.getCommentById(req, res);

      // Verify
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Commentaire non trouvé",
      });
    });

    it("should handle server errors", async () => {
      // Setup
      req.params.commentId = "1";
      Comment.findByPk.mockRejectedValue(new Error("Database error"));

      // Execute
      await commentController.getCommentById(req, res);

      // Verify
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erreur lors de la récupération du commentaire",
      });
    });
  });

  describe("modifyComment", () => {
    it("Doit pouvoir modifier un commentaire", async () => {
      // Setup
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

      // Execute
      await commentController.modifyComment(req, res);

      // Verify
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
      // Setup
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

      // Execute
      await commentController.modifyComment(req, res);

      // Verify
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Vous n'êtes pas autorisé à modifier ce commentaire",
      });
    });
  });

  describe("deleteComment", () => {
    it("Doit pouvoir supprimer un commentaire", async () => {
      // Setup
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

      // Execute
      await commentController.deleteComment(req, res);

      // Verify
      expect(mockComment.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Commentaire supprimé avec succès.",
      });
    });

    it("Doit retourner 403 si User non-autorisé", async () => {
      // Setup
      req.params.commentId = "1";
      req.auth.userId = "2";
      req.auth.roles = ["user"];

      const mockComment = {
        comment_id: 1,
        user_id: "1",
        Post: { user_id: "2" },
      };

      Comment.findOne.mockResolvedValue(mockComment);

      // Execute
      await commentController.deleteComment(req, res);

      // Verify
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Vous n'êtes pas autorisé à supprimer ce commentaire.",
      });
    });
  });
});
