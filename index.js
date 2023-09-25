const {Sequelize, Model, DataTypes, BelongsTo} = require("sequelize");
const express = require("express");
const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));



const sequelize = new Sequelize("dbsequelize", "root", "root",{
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
});

class Author extends Model{}
Author.init(
    {
        id:{
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        firstname:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {sequelize, modelName: "author"}
);

class Article extends Model{}
Article.init(
    {
        id:{
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        content:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        image:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {sequelize, modelName: "article"}
);

class Comment extends Model{}
Comment.init(
    {
        id:{
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        content:{
            type: DataTypes.STRING,
            allowNull: false,
        },
       
    },
    {sequelize, modelName: "comment"}
);
//Relaciones
Article.belongsTo(Author);
Comment.belongsTo(Article);
//Creacion de tablas
sequelize.sync().then(()=>{
console.log("Las tablas se crearon");
});
//rutas
app.get("/", async (req, res)=>{
    const articles = await Article.findAll({order: [["createdAt", "DESC"]], include: [{model: Author}]});
    res.json(articles);
});
app.get("/:id", async (req, res)=>{
    res.json("Articulo por id");
});







app.listen(3000, ()=>{
    console.log("Servidor escuchando en puerto 3000");
    console.log("http://localhost:3000");
})
