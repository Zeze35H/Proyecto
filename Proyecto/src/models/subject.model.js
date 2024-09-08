module.exports = (sequelize, Sequelize) => {
  const Subject = sequelize.define("subjects", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  
  return Subject;
};