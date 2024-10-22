module.exports = (sequelize, Sequelize, Role) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    surname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: Role,
        key: 'id'
      }
    },
    access_token: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    password_token: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    picture: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "/default_picture.png",
    },
  });

  return User;
};