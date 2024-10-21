module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'password',
    DB:'proyecto',
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 'proyecto',
 'root',
 'password',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });