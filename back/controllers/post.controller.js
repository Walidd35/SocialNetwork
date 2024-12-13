const Post = require("../models/posts.model");
const User = require("../models/users.model");
const path = require("path");

exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    console.log(req.body); 

    // Vérification que req.auth et req.auth.userId sont définis
    if (!req.auth || !req.auth.userId) {
      return res
        .status(400)
        .json({
          error: "L'identifiant de l'utilisateur est manquant dans le token.",
        });
    }

    const user_id = req.auth.userId; 

    //Verification des champs obligatoires
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Le titre et la description sont requis." });
    }

    
    const post = await Post.create({
      title,
      description,
      image: imageUrl,
      user_id, // Lier le userId au post
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Erreur lors de la création du post :", error);
    res.status(500).json({
      error: "Erreur lors de la création du post.",
      details: error.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const postsWithUsernames = posts.map((post) => {
      const plainPost = post.toJSON();
      return {
        ...plainPost,
        username: plainPost.User ? plainPost.User.username : "Anonyme",
        // Extrait uniquement le nom de fichier
        image: plainPost.image ? plainPost.image.split("/").pop() : null,
      };
    });

    res.status(200).json(postsWithUsernames);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    res
      .status(500)
      .json({
        message: "Une erreur est survenue lors de la récupération des posts.",
      });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post non disponible",
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du post (ID: ${req.params.id}):`,
      error
    );
    return res.status(500).json({
      error: "Erreur lors de la récupération du post",
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    //Recherche de la publication par son ID
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Publication non trouvée." });
    }

    //Verification des rôles et de l'utilisateur
    if (post.user_id !== req.auth.userId && !req.auth.roles.includes("admin")) {
      return res
        .status(403)
        .json({
          error: "Accès refusé. Vous ne pouvez pas modifier cette publication.",
        });
    }

    // Mise à jour des champs
    post.title = title || post.title;
    post.description = description || post.description;
    post.image = imageUrl || post.image;


    await post.save();
    res
      .status(200)
      .json({ message: "Publication mise à jour avec succès", post });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la publication :", error);
    res
      .status(500)
      .json({
        error: "Erreur lors de la mise à jour de la publication.",
        details: error.message,
      });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Publication non trouvée." });
    }

    await post.destroy();
    return res
      .status(200)
      .json({ message: "Publication supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la publication :", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la publication." });
  }
};
