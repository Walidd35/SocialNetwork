const  Post = require("../models/posts.model");


  exports.createPost = async (req, res) => {
  try {
      const { title, description } = req.body;
      const imageUrl = req.file ? req.file.path : null;

      // Vérification que req.auth et req.auth.userId sont définis
      if (!req.auth || !req.auth.userId) {
          return res.status(400).json({ error: 'L\'identifiant de l\'utilisateur est manquant dans le token.' });
      }

      const user_id = req.auth.userId;  // Utilisation de userId extrait du token

      // Vérification des champs obligatoires
      if (!title || !description) {
          return res.status(400).json({ error: 'Le titre et la description sont requis.' });
      }

      // Création du post avec l'ID utilisateur
      const post = await Post.create({
          title,
          description,
          image: imageUrl,
          user_id, // Lier le user_id au post
      });

      // Réponse avec le post créé
      res.status(201).json(post);
  } catch (error) {
      console.error('Erreur lors de la création du post :', error);
      res.status(500).json({ error: 'Erreur lors de la création du post.', details: error.message });
  }
  };   

  exports.getAllPosts = async (req, res) => { 
  try {
      const posts = await Post.findAll();
      res.status(200).json(posts);
  } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des posts.' });
  }
  };

  exports.getPostById = async (req, res, next) => {
    try {
        // Si on appelle directement la fonction (comme middleware)
        const postId = req.params ? req.params.id : req;
        
        const post = await Post.findByPk(postId);
        
        if (!post) {
            if (next) {
                return next(new Error('Post non trouvé'));
            }
            return null;
        }
        
        // Si appelé comme middleware, renvoyer la réponse
        if (res) {
            return res.status(200).json(post);
        }
        // Si appelé comme fonction, renvoyer juste le post
        return post;
        
    } catch (error) {
        console.error('Erreur lors de la récupération de la publication :', error);
        if (next) {
            return next(error);
        }
        throw error;
    }
  };

exports.updatePost = async (req, res) => {

    try {
        const { title, description } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        // Recherche de la publication par son ID
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Publication non trouvée.' });
        }

        // Vérification des rôles et de l'utilisateur
        if (post.user_id !== req.auth.userId && !req.auth.roles.includes('admin')) {
            return res.status(403).json({ error: 'Accès refusé. Vous ne pouvez pas modifier cette publication.' });
        }

        // Mise à jour des champs
        post.title = title || post.title;
        post.description = description || post.description;
        post.image = imageUrl || post.image;
        // Ne pas changer le user_id, car un utilisateur ne peut pas changer l'auteur du post
        // post.user_id = user_id || post.user_id;  // Cette ligne est supprimée

        // Sauvegarde de la publication
        await post.save();
        res.status(200).json({ message: 'Publication mise à jour avec succès', post });

    } catch (error) {
        console.error('Erreur lors de la mise à jour de la publication :', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la publication.', details: error.message });
    }
};

  exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByPk(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Publication non trouvée.' });
        }
        
        await post.destroy();
        return res.status(200).json({ message: 'Publication supprimée avec succès.' });
        
    } catch (error) {
        console.error('Erreur lors de la suppression de la publication :', error);
        return res.status(500).json({ error: 'Erreur lors de la suppression de la publication.' });
    }
  };