const dbConfig = require("../services/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.role = require("./role.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize, db.role);
db.subject = require("./subject.model.js")(sequelize, Sequelize);
db.student_teacher_relation = require("./student_teacher_relation.model.js")(sequelize, Sequelize, db.user, db.subject);
db.session = require("./session.model.js")(sequelize, Sequelize, db.user);

module.exports = db;