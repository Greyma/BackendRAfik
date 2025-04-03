const express = require("express"),
      mysql = require("mysql2/promise"),
      cors = require("cors"),
      multer = require("multer"),
      path = require("path"),
      db = require("./databases/cnx"),
      app = express(),
      port = 5477;


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
  const nocache = require("nocache");
  const jwt = require("jsonwebtoken");

// Middleware
app.use(nocache());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
  });
  app.use("/uploads", express.static("photos")); // Permet l'accès aux images

// Configuration de l'upload d'images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Assurez-vous que ce dossier existe
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers .jpeg, .jpg et .png sont autorisés"));
    }
  }
});


// Ajouter un nouveau client
app.post("/Clients", async (req, res) => {
    const { nom, email, telephone, Niss, Niff, Adresse } = req.body;
    if (!nom) return res.status(400).json({ message: "Le nom est requis" });

    const query = "INSERT INTO clients (nom, email, telephone, Niss, Niff, Adresse) VALUES (?, ?, ?, ?, ?, ?)";
    try {
      const [results] = await db.query(query, [nom, email || null, telephone || null, Niss || null, Niff || null, Adresse || null]);
      res.status(201).json({ 
        data: { 
          id: results.insertId, 
          nom, 
          email, 
          telephone, 
          Niss, 
          Niff, 
          Adresse 
        }, 
        message: "Client créé avec succès" 
      });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// Modifier un client
app.put("/Clients/:id", async (req, res) => {
    const { nom, email, telephone, Niss, Niff, Adresse } = req.body;
    if (!nom) return res.status(400).json({ message: "Le nom est requis" });

    const query = "UPDATE clients SET nom = ?, email = ?, telephone = ?, Niss = ?, Niff = ?, Adresse = ? WHERE id = ?";
    try {
      const [results] = await db.query(query, [nom, email || null, telephone || null, Niss || null, Niff || null, Adresse || null, req.params.id]);
      if (results.affectedRows === 0) return res.status(404).json({ message: "Client non trouvé" });

      res.status(200).json({ 
        data: { 
          id: req.params.id, 
          nom, 
          email, 
          telephone, 
          Niss, 
          Niff, 
          Adresse 
        }, 
        message: "Client mis à jour avec succès" 
      });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// Supprimer un client
app.delete("/Clients/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

    const query = "DELETE FROM clients WHERE id = ?";
    try {
      const [results] = await db.query(query, [id]);
      if (results.affectedRows === 0) return res.status(404).json({ message: "Client non trouvé" });

      res.status(200).json({ message: "Client supprimé avec succès" });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});


app.get("/Clients", async (req, res) => {
    const query = "SELECT id, nom, email, telephone, Niss, Niff, Adresse FROM clients";
    try {
      const [results] = await db.query(query);
      if (results.length === 0) return res.status(404).json({ message: "Aucun client trouvé" });
      const clients = results.map(client => ({
        id: client.id,
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
        Niss: client.Niss,
        Niff: client.Niff,
        Adresse: client.Adresse
      }));
      res.status(200).json({ data: clients, message: "success" });
    } catch (err) {
      console.error("Erreur dans la récupération des clients:", err);
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// Ajouter un nouveau fournisseur
app.post("/Fournisseurs", async (req, res) => {
    const { nom, email, telephone, Niss, Niff, Adresse } = req.body;
    if (!nom) return res.status(400).json({ message: "Le nom est requis" });

    const query = "INSERT INTO fournisseurs (nom, email, telephone, Niss, Niff, Adresse) VALUES (?, ?, ?, ?, ?, ?)";
    try {
      const [results] = await db.query(query, [nom, email || null, telephone || null, Niss || null, Niff || null, Adresse || null]);
      res.status(201).json({ 
        data: { 
          id: results.insertId, 
          nom, 
          email, 
          telephone, 
          Niss, 
          Niff, 
          Adresse 
        }, 
        message: "Fournisseur créé avec succès" 
      });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// Modifier un fournisseur
app.put("/Fournisseurs/:id", async (req, res) => {
    const { nom, email, telephone, Niss, Niff, Adresse } = req.body;
    if (!nom) return res.status(400).json({ message: "Le nom est requis" });

    const query = "UPDATE fournisseurs SET nom = ?, email = ?, telephone = ?, Niss = ?, Niff = ?, Adresse = ? WHERE id = ?";
    try {
      const [results] = await db.query(query, [nom, email || null, telephone || null, Niss || null, Niff || null, Adresse || null, req.params.id]);
      if (results.affectedRows === 0) return res.status(404).json({ message: "Fournisseur non trouvé" });

      res.status(200).json({ 
        data: { 
          id: req.params.id, 
          nom, 
          email, 
          telephone, 
          Niss, 
          Niff, 
          Adresse 
        }, 
        message: "Fournisseur mis à jour avec succès" 
      });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// Supprimer un fournisseur
app.delete("/Fournisseurs/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

    const query = "DELETE FROM fournisseurs WHERE id = ?";
    try {
      const [results] = await db.query(query, [id]);
      if (results.affectedRows === 0) return res.status(404).json({ message: "Fournisseur non trouvé" });

      res.status(200).json({ message: "Fournisseur supprimé avec succès" });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// Récupérer tous les fournisseurs
app.get("/Fournisseurs", async (req, res) => {
    const query = "SELECT id, nom, email, telephone, Niss, Niff, Adresse FROM fournisseurs";
    try {
      const [results] = await db.query(query);
      if (results.length === 0) return res.status(404).json({ message: "Aucun fournisseur trouvé" });
      const fournisseurs = results.map(fournisseur => ({
        id: fournisseur.id,
        nom: fournisseur.nom,
        email: fournisseur.email,
        telephone: fournisseur.telephone,
        Niss: fournisseur.Niss,
        Niff: fournisseur.Niff,
        Adresse: fournisseur.Adresse
      }));
      res.status(200).json({ data: fournisseurs, message: "success" });
    } catch (err) {
      console.error("Erreur dans la récupération des fournisseurs:", err);
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

  app.get("/CategorieAll", async (req, res) => {
    const query = "SELECT id, nom, created_at FROM categories";
    try {
      const [results] = await db.query(query);
      if (results.length === 0) return res.status(404).json({ message: "Aucune catégorie trouvée" });
      const categories = results.map(cat => ({ id: cat.id, nom: cat.nom, date: cat.created_at }));
      res.status(200).json({ data: categories, message: "success" });
    } catch (err) {
      console.error("Erreur dans la récupération des catégories:", err); // Log d'erreur
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
  });


  app.post("/CategorieSave", async (req, res) => {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: "Le nom est requis" });

    const query = "INSERT INTO categories (nom, created_at) VALUES (?, NOW())";
    try {
      const [results] = await db.query(query, [nom]);
      res.status(201).json({ data: { id: results.insertId, nom }, message: "Catégorie créée avec succès" });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
  });

  app.put("/CategorieEdit/:id", async (req, res) => {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: "Le nom est requis" });

    const query = "UPDATE categories SET nom = ?, updated_at = NOW() WHERE id = ?";
    try {
      const [results] = await db.query(query, [nom, req.params.id]);
      if (results.affectedRows === 0) return res.status(404).json({ message: "Catégorie non trouvée" });

      res.status(200).json({ data: { id: req.params.id, nom }, message: "Catégorie mise à jour avec succès" });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
  });

  app.delete("/CategorieDelete/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

    const query = "DELETE FROM categories WHERE id = ?";
    try {
      const [results] = await db.query(query, [id]);
      if (results.affectedRows === 0) return res.status(404).json({ message: "Catégorie non trouvée" });

      res.status(200).json({ message: "Catégorie supprimée avec succès" });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
  });



// Récupérer tous les produits
app.get("/ProduitAll", async (req, res) => {
    const query = `
      SELECT id, categorie_id, fournisseur_id, nom, description, prix_vente, prix_achat, quantite, reference, image, etat 
      FROM produits
    `;
    try {
      const [results] = await db.query(query);
      if (results.length === 0) return res.status(404).json({ message: "Aucun produit trouvé" });

      const produits = results.map(produit => ({
        id: produit.id,
        categorie_id: produit.categorie_id,
        fournisseur_id: produit.fournisseur_id,
        nom: produit.nom,
        description: produit.description,
        prix_vente: produit.prix_vente,
        prix_achat: produit.prix_achat,
        quantite: produit.quantite,
        reference: produit.reference,
        image: produit.image,
        etat: produit.etat
      }));
      res.status(200).json({ data: produits, message: "success" });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// Récupérer un produit par ID
app.get("/Produit/:id", async (req, res) => {
    const produitId = parseInt(req.params.id, 10);
    if (isNaN(produitId)) return res.status(400).json({ message: "ID invalide" });

    const query = `
      SELECT 
        id, 
        categorie_id, 
        fournisseur_id, 
        nom, 
        description, 
        prix_vente, 
        prix_achat, 
        quantite, 
        reference, 
        image, 
        etat 
      FROM produits 
      WHERE id = ?
    `;
    try {
      const [results] = await db.query(query, [produitId]);
      if (results.length === 0) return res.status(404).json({ message: "Produit non trouvé" });

      const produit = results[0];
      res.status(200).json({
        data: {
          id: produit.id,
          categorie_id: produit.categorie_id,
          fournisseur_id: produit.fournisseur_id,
          nom: produit.nom,
          description: produit.description,
          prix_vente: produit.prix_vente,
          prix_achat: produit.prix_achat,
          quantite: produit.quantite,
          reference: produit.reference,
          image: produit.image,
          etat: produit.etat
        },
        message: "Produit récupéré avec succès",
      });
    } catch (err) {
      console.error("Erreur lors de la récupération du produit :", err);
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// Ajouter un nouveau produit
app.post("/ProduitSave", upload.array("images", 10), async (req, res) => {
    try {
        const { categorie_id, fournisseur_id, nom, description, prix_vente, prix_achat, quantite, reference, etat } = req.body;

        if (!(categorie_id && nom && prix_vente && prix_achat && quantite && reference)) {
            return res.status(400).json({ message: "Tous les champs requis doivent être fournis" });
        }

        // Vérifier et stocker les images
        let imagePaths = ["/uploads/default.png"];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => "/uploads/" + file.filename);
        }

        const query = `
            INSERT INTO produits 
            (categorie_id, fournisseur_id, nom, description, prix_vente, prix_achat, quantite, reference, image, etat)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            const [results] = await db.query(query, [
                categorie_id,
                fournisseur_id || null, // Peut être null si non fourni
                nom,
                description || null,
                prix_vente,
                prix_achat,
                quantite,
                reference,
                JSON.stringify(imagePaths),
                etat || 'actif' // Par défaut "actif" si non spécifié
            ]);

            res.status(201).json({
                data: {
                    id: results.insertId,
                    categorie_id,
                    fournisseur_id,
                    nom,
                    description,
                    prix_vente,
                    prix_achat,
                    quantite,
                    reference,
                    image: imagePaths,
                    etat: etat || 'actif'
                },
                message: "Produit créé avec succès"
            });

        } catch (err) {
            console.error("❌ Erreur lors de l'insertion du produit :", err);
            res.status(500).json({ message: "Erreur serveur lors de l'insertion", error: err.message });
        }
        
    } catch (error) {
        console.error("⛔ Erreur générale :", error);
        res.status(500).json({ message: "Une erreur inconnue est survenue", error: error.message });
    }
});

// Modifier un produit
app.put("/ProduitEdit/:id", async (req, res) => {
    const { categorie_id, fournisseur_id, nom, description, prix_vente, prix_achat, quantite, reference, etat } = req.body;
    if (!(categorie_id && nom && prix_vente && prix_achat && quantite && reference)) {
      return res.status(400).json({ message: "Tous les champs requis doivent être fournis" });
    }

    const query = `
      UPDATE produits 
      SET 
        categorie_id = ?, 
        fournisseur_id = ?, 
        nom = ?, 
        description = ?, 
        prix_vente = ?, 
        prix_achat = ?, 
        quantite = ?, 
        reference = ?, 
        etat = ? 
      WHERE id = ?
    `;
    try {
      const [results] = await db.query(query, [
        categorie_id,
        fournisseur_id || null,
        nom,
        description || null,
        prix_vente,
        prix_achat,
        quantite,
        reference,
        etat || 'actif',
        req.params.id
      ]);
      if (results.affectedRows === 0) return res.status(404).json({ message: "Produit non trouvé" });

      res.status(200).json({
        data: {
          id: req.params.id,
          categorie_id,
          fournisseur_id,
          nom,
          description,
          prix_vente,
          prix_achat,
          quantite,
          reference,
          etat
        },
        message: "Produit mis à jour avec succès"
      });
    } catch (err) {
      console.error("Erreur lors de l'exécution de la requête :", err);
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// Supprimer un produit
app.delete("/ProduitDelete/:id", async (req, res) => {
    const produitId = req.params.id;
    if (!produitId) return res.status(400).json({ message: "ID du produit manquant" });

    const query = "DELETE FROM produits WHERE id = ?";
    try {
      const [results] = await db.query(query, [produitId]);
      if (results.affectedRows === 0) return res.status(404).json({ message: "Produit non trouvé" });

      res.status(200).json({ message: "Produit supprimé avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur lors de la suppression", error: err });
    }
});




  app.delete('/factures/:id', async (req, res) => {
    const factureId = req.params.id;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1️⃣ Récupérer les articles liés à la facture
        const [articles] = await connection.query(
            'SELECT produit_id, quantite FROM articles_facture WHERE facture_id = ?',
            [factureId]
        );

        if (articles.length === 0) {
            return res.status(404).json({ message: "Facture introuvable ou déjà supprimée" });
        }

        // 2️⃣ Réapprovisionner les produits
        for (const { produit_id, quantite } of articles) {
            await connection.query(
                'UPDATE produits SET quantite = quantite + ? WHERE id = ?',
                [quantite, produit_id]
            );
        }

        // 3️⃣ Supprimer les articles de la facture
        await connection.query(
            'DELETE FROM articles_facture WHERE facture_id = ?',
            [factureId]
        );

        // 4️⃣ Supprimer la facture
        await connection.query(
            'DELETE FROM factures WHERE id = ?',
            [factureId]
        );

        await connection.commit();
        res.json({ message: `Facture ${factureId} supprimée avec succès.` });

    } catch (error) {
        await connection.rollback();
        console.error("❌ Erreur:", error);
        res.status(500).json({ message: "Erreur lors de la suppression de la facture." });
    } finally {
        connection.release();
    }
});




  app.get("/FacturesAll", async (req, res) => {
    try {
      const [factures] = await db.query(`
        SELECT 
          f.id AS facture_id,
          f.nom_client,
          f.prix_total,
          f.date_creation,
          p.id AS produit_id,
          p.nom AS produit_nom,
          p.prix_vente AS produit_prix_vente,
          p.prix_achat AS produit_prix_achat,
          af.quantite AS produit_quantite
        FROM 
          factures f
        LEFT JOIN 
          articles_facture af ON f.id = af.facture_id
        LEFT JOIN 
          produits p ON af.produit_id = p.id
      `);

      const facturesMap = {};
      factures.forEach(row => {
        const factureId = row.facture_id;
        if (!facturesMap[factureId]) {
          facturesMap[factureId] = { id: factureId, nom_client: row.nom_client, prix_total: row.prix_total, date_creation: row.date_creation, produits: [] };
        }
        if (row.produit_id) {
          facturesMap[factureId].produits.push({
            id: row.produit_id, nom: row.produit_nom, quantite: row.produit_quantite,
            prix_vente: row.produit_prix_vente, prix_achat: row.produit_prix_achat,
            prix_total: (row.produit_prix_vente * row.produit_quantite).toFixed(2)
          });
        }
      });

      res.status(200).json(Object.values(facturesMap));
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
  });

  app.post("/FactureSave", async (req, res) => {
    const { nom_client, produits } = req.body;
    if (!nom_client || !Array.isArray(produits) || produits.length === 0) {
      return res.status(400).json({ message: "Le nom du client et les produits sont requis" });
    }

    let conn;
    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      let prix_total = 0;
      const produitsVerifies = [];

      for (let produit of produits) {
        const { produit_id, quantite } = produit;
        if (!produit_id || quantite <= 0) {
          await conn.rollback();
          return res.status(400).json({ message: "Chaque produit doit avoir un ID et une quantité valide" });
        }

        const [stockResults] = await conn.query("SELECT nom, quantite, prix_vente FROM produits WHERE id = ?", [produit_id]);
        if (stockResults.length === 0) {
          await conn.rollback();
          return res.status(404).json({ message: `Le produit avec l'ID ${produit_id} n'existe pas.` });
        }

        const stock = stockResults[0];
        if (stock.quantite < quantite) {
          await conn.rollback();
          return res.status(400).json({ message: `Le produit ${stock.nom} n'a pas assez de stock.` });
        }

        produitsVerifies.push({ produit_id, quantite, prix_vente: stock.prix_vente, nom: stock.nom });
        prix_total += stock.prix_vente * quantite;
      }

      const [factureResult] = await conn.query("INSERT INTO factures (nom_client, prix_total, date_creation) VALUES (?, ?, NOW())", [nom_client, prix_total]);
      const factureId = factureResult.insertId;
      const articlesData = produitsVerifies.map(p => [factureId, p.produit_id, p.quantite]);

      await conn.query("INSERT INTO articles_facture (facture_id, produit_id, quantite) VALUES ?", [articlesData]);
      
      for (let produit of produitsVerifies) {
        await conn.query("UPDATE produits SET quantite = quantite - ? WHERE id = ?", [produit.quantite, produit.produit_id]);
      }

      await conn.commit();
      res.status(201).json({ message: "Facture créée avec succès", data: { factureId, nom_client, prix_total, produits: produitsVerifies } });
    } catch (error) {
      if (conn) await conn.rollback();
      console.error("Erreur lors de l'ajout de la facture :", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    } finally {
      if (conn) conn.release();
    }
  });
  app.post('/login', (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ message: 'Identifiant et mot de passe sont requis.' });
    }
    if(id=="adminbs" && password =="adminbs2025")
    {
        const payload = { userId: "trendybox" }; // Vous pouvez ajouter plus d'infos si nécessaire

      // Créer le token
      const token = jwt.sign(payload, 'votre_clé_secrète', { expiresIn: '1h' });

      // Répondre avec le token
      return res.status(200).json({ 
          message: 'Identifiant et mot de passe sont corrects.', 
          token: token 
      });
    }
    else
    {
      return res.status(400).json({ message: 'Identifiant et mot de passe sont pas correct.' });

    }
    
  });

    
  app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
  });
