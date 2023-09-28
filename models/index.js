// Archivo que va a contener la conexión a la BBDD

const { Sequelize } = require("sequelize");

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

// Requerimos todos los modelos

const Article = require("./Article");
const Author = require("./Author");
const Comment = require("./Comment");

// Inicializamos todos los modelos
Article.initModel(sequelize);
Author.initModel(sequelize);
Comment.initModel(sequelize);

// Establecemos todas las relaciones
Article.belongsTo(Author);
Comment.hasOne(Article);
Article.hasMany(Comment);

// Creacion de tablas
// sequelize.sync().then(() => {
//   console.log("Las tablas se crearon");
// });

// Exportamos la conexión y todos los modelos

module.exports = {
  sequelize,
  Article,
  Author,
  Comment,
};
