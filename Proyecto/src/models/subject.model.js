module.exports = (sequelize, Sequelize) => {
  const Subject = sequelize.define("subjects", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  
  return Subject;
};