const  Post  = require("../models/posts.model");


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

  // post.controller.js

exports.getAllPosts = async (req, res) => {
  try {
      const posts = await Post.findAll();
      res.status(200).json(posts);
  } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des posts.' });
  }
};


  exports.updatePost = async (req,res) => {
    try{
       const {title, description, user_id } = req.body;
       const imageUrl = req.file ? req.file.path : null;

       const post = await Post.findByPk(req.params.id);
         if(!post){
            return res.status(404).json({error: 'Publication non trouvée.'})
         }
         if (post.user_id !== req.auth.userId) {
          return res.status(403).json({ error: 'Accès refusé. Vous ne pouvez pas modifier cette publication.' });
        }
        
       post.title = title || post.title;
       post.description = description || post.description;
       post.image = imageUrl || post.image;
       post.user_id = user_id || post.user_id;
       
       await post.save();
       res.status(200).json(post);

    } catch (error) {
       console.error('Erreur lors de la mise a jour de la publication :', error);
       res.status(500).json({error: 'Erreur lors de la mise a jour de la publication : ', error })
    }
  };

  exports.deletePost = async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Publication non trouvée.' });
      }
  
      // Vérifiez que l'utilisateur est le propriétaire du post
      if (post.user_id !== req.auth.userId) {
        return res.status(403).json({ error: 'Accès refusé.' });
      }
  
      await post.destroy();
      res.status(200).json({ message: 'Publication supprimée avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la publication :', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de la publication.' });
    }
  };
  