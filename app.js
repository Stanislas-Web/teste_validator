const express = require("express");
const ejs = require("ejs-blocks");
const bodyParser = require("body-parser");
const sql = require("./config/db_config");
const { check, validationResult } = require("express-validator");
const port = 47;

const verification = [check("nom", "Le nom de l'article doit avoir au moin 3 caractere").isLength({min: 3, max: 255}), check("type", "le type doit avoir au moin 5 caracteres").isLength({min: 5, max: 50}), check("prix", "Le prix doit etre un chiffre compris entre 1 et 1000").isInt(), check("marque", "la marque ne doit pas etre vide").isLength({min: 1}), check("quantite", "La quantité d'un article doit etre un chiffre").isInt(),check("taille", "La quantité d'un article doit etre un chiffre").isInt()]


const app = express();



// on dit à express de mettre les données envoyée dans le body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));





app.set("views", __dirname + "/views/");
app.engine("ejs", ejs)
app.set("view engine", "ejs");

app.get("/articles", (req, res) => {
    sql.query(`select * from articles`, (error, result) => {
        if (error) {
            throw error
        } else {
            res.render("articles/index", {
                title: "articles",
                articles: result,
                
            });
        }
    })
})

app.get("/articles/ajouter", (req, res) => {
    res.render("articles/ajouter", {
        title: "ajouter un article",
        error: null,
        form: null
    });
})

app.post("/articles", verification,  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
        // console.log();
        return res.render('articles/ajouter', {title: "Ajouter un article", error: errors.array(), form: req.body });
        
        
    }
    else
    {
        sql.query(`insert into articles (nom, type, prixUHT, marque, quantite, taille) values (?, ?, ?, ?, ?, ?)`, [req.body.nom, req.body.type, parseInt(req.body.prix), req.body.marque, parseInt(req.body.quantite), parseInt(req.body.taille)], (error, result) => {
            if (error) {
                throw error
            }
            else
            {
                return res.redirect("/articles");
            }
        })
    }



})



app.listen(port, () => {
    console.log(`le serveur tourne sur http://localhost:${port}`);
})