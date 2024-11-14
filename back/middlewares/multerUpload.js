const multer = require('multer');
const path = require('path');

// Définir le stockage des fichiers (ici dans le dossier 'uploads')const storage = multer.diskStorage({
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'serveretapp', 'uploads')); // Accès au bon dossier
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  

// Créer une instance de multer avec les options de stockage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limiter la taille à 5 Mo (par exemple)
  fileFilter: (req, file, cb) => {
    // Filtrer les fichiers pour n'accepter que les images (extensions .jpg, .jpeg, .png)
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Le fichier doit être une image (JPEG, JPG, PNG)'));
    }
  }
});

module.exports = upload;
