const { DateTime } = require("luxon");
const { Model, DataTypes } = require("sequelize");

class Comment extends Model {
  static initModel(sequelize) {
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
    return Comment;
  }
}

module.exports = Comment;
