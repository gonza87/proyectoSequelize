const { Model, DataTypes } = require("sequelize");

class Author extends Model {
  static initModel(sequelize) {
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
    return Author;
  }
}

module.exports = Author;
