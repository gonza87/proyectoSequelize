const { DateTime } = require("luxon");
const { Model, DataTypes } = require("sequelize");

class Article extends Model {
  static initModel(sequelize) {
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
            const formattedDateTime = DateTime.fromJSDate(
              this.createdAt
            ).toFormat("yyyy-MM-dd HH:mm"); // Formato personalizado "año mes día hora:minutos"

            return formattedDateTime;
          },
        },
      },
      { sequelize, modelName: "article" }
    );
    return Article;
  }
}

module.exports = Article;
