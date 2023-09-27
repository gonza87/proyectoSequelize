require("dotenv").config();
const { Sequelize, Model, DataTypes, BelongsTo } = require("sequelize");
const express = require("express");
const { DateTime } = require("luxon");
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const sequelize = new Sequelize(
  "dbsequelize",
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
  }
);

class Author extends Model {}
Author.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Nueva propiedad para tener el nombre completo de los autores
    fullname: {
      type: DataTypes.VIRTUAL, // Virtual field, no se almacena en la base de datos
      get() {
        return this.firstname + " " + this.lastname; // Accede a las propiedades del objeto actual (this)
      },
    },
  },
  { sequelize, modelName: "author" }
);

class Article extends Model {}

Article.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Nueva propiedad para la fecha formateada para la home
    formattedDateHome: {
      type: DataTypes.VIRTUAL, // Virtual field, no se almacena en la base de datos
      get() {
        // Obtener el día en formato numérico
        const diaNumerico = this.createdAt.getDate();

        // Obtener el mes en formato string
        const mesString = DateTime.fromJSDate(this.createdAt, {
          locale: "es-Es",
        }).toFormat("MMMM"); // 'MMMM' representa el nombre completo del mes

        const mesConMayuscula =
          mesString.charAt(0).toUpperCase() + mesString.slice(1);

        // Obtener el año en formato numérico
        const anoNumerico = this.createdAt.getFullYear();

        // Formatear la fecha en el formato deseado
        return `${diaNumerico} de ${mesConMayuscula} , ${anoNumerico}`;
      },
    },

    // Nueva propiedad para la fecha formateada para la home
    formattedDateAdmin: {
      type: DataTypes.VIRTUAL, // Virtual field, no se almacena en la base de datos
      get() {
        const formattedDateTime = DateTime.fromJSDate(this.createdAt).toFormat(
          "yyyy-MM-dd HH:mm"
        ); // Formato personalizado "año mes día hora:minutos"

        return formattedDateTime;
      },
    },
  },
  { sequelize, modelName: "article" }
);

class Comment extends Model {}
Comment.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formattedDateHome: {
      type: DataTypes.VIRTUAL, // Virtual field, no se almacena en la base de datos
      get() {
        // Obtener el día en formato numérico
        const diaNumerico = this.createdAt.getDate();

        // Obtener el mes en formato string
        const mesString = DateTime.fromJSDate(this.createdAt, {
          locale: "es-Es",
        }).toFormat("MMMM"); // 'MMMM' representa el nombre completo del mes

        const mesConMayuscula =
          mesString.charAt(0).toUpperCase() + mesString.slice(1);

        // Obtener el año en formato numérico
        const anoNumerico = this.createdAt.getFullYear();

        // Formatear la fecha en el formato deseado
        return `${diaNumerico} de ${mesConMayuscula} , ${anoNumerico}`;
      },
    },
  },
  { sequelize, modelName: "comment" }
);

//Relaciones
Article.belongsTo(Author);
Comment.hasOne(Article);
Article.hasMany(Comment);

//Creacion de tablas
sequelize.sync().then(() => {
  console.log("Las tablas se crearon");
});

//Rutas

app.get("/", async (req, res) => {
  const articles = await Article.findAll({
    order: [["createdAt", "DESC"]],
    include: [{ model: Author }],
  });
  res.json(articles);
});

app.get("/home", async (req, res) => {
  const articles = await Article.findAll({
    order: [["createdAt", "DESC"]],
    include: [{ model: Author }],
  });

  res.render("home", { articles });
  
});

app.get("/articles", (req, res) => {
  res.render("articles");
});

app.get("/articles/new", (req, res) => {
  res.render("newarticle");
});

app.get("/admin", async (req, res) => {
  const articles = await Article.findAll({
    order: [["createdAt", "DESC"]],
    include: [{ model: Author }],
  });

  res.render("admin", { articles });
});



 app.get("/article/:id", async (req, res) => {
   const article = await Article.findByPk(req.params.id, {
    include: [{ model: Author }, { model: Comment }],
  
   });
   const cantidad = await Comment.count({//cuento los comentarios que tiene un articulo
    where: {
      articleId: req.params.id // Aquí defines tu condición
    }
    
  });
  
  res.render("articles", {article, cantidad});
   
 });


app.get("/new", async (req, res) => {
  const authors = await Author.findAll();
  res.render("newarticle", { authors });
});

app.post("/article", async (req, res) => {
  await Article.create({
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    authorId: req.body.author,
  });
  res.redirect("/admin");
});


//crear comentarios
app.post("/newcoment", async (req, res)=>{
  await Comment.create({
    name: req.body.name,
    content: req.body.content,
    articleId: req.body.idarticle,
  });
res.redirect(`/article/${req.body.idarticle}`)//redirijo a la misma pagina del articulo

});






app.listen(3000, () => {
  console.log("Servidor escuchando en puerto 3000");
  console.log("http://localhost:3000");
  console.log("http://localhost:3000/home");
});
