module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
        role_name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
    });
  
    return Role;
  };