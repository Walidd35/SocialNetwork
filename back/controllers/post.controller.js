const  Post  = require("../models/posts.model");

exports.createPost = async (req, res) => {
    try {
      const { title, description, user_id } = req.body;
      const imageUrl = req.file ? req.file.path : null;
  
      // Vérifie si user_id est présent
      if (!user_id) {
        return res.status(400).json({ error: 'user_id est requis.' });
      }
  
      // Création du post
      const post = await Post.create({
        title,
        description,
        image: imageUrl,
        user_id, // Assure-toi de bien envoyer user_id
      });
  
      res.status(201).json(post);
    } catch (error) {
      console.error('Erreur lors de la création de la publication :', error);
      res.status(500).json({ error: 'Erreur lors de la création de la publication.', details: error.message });
    }
  };
  
  exports.getAllPosts = async (req,res) => {
    try{
      const posts = await Post.findAll();
      res.status(200).json(posts);     
    } catch (error){
           console.error('Erreur lors de la récuperation des publications :', error);
           res.status(500).json({error: 'Erreur lors de la récuperation des posts !'})
    }
  };