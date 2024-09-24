const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userController = require("./src/controllers/user.controller");

const session = require('express-session');
const passport = require('passport');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
  credentials: true
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON and handle session
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'your-secret-key', // Change this to a secure key
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const db = require("./src/models");

db.sequelize.sync({ force: true }).then(() => {
  const subjects_data = [
    { id: 1, name: 'Biology' },
    { id: 2, name: 'Psychology' },
    { id: 3, name: 'Chemistry' },
    { id: 4, name: 'Statistics' },
    { id: 5, name: 'Maths' },
    { id: 6, name: 'Music' },
  ]

  const roles_data = [
    { id: 1, role_name: 'Student' },
    { id: 2, role_name: 'Professor' },
  ]

  const users_data = [
    { id: 1, username: "zeze35h", name: "Jose Eduardo", surname: "Henriques", email: "zezeh35@hotmail.com", role: 1, active: true },
    { id: 2, username: "pml2000", name: "Pedro Miguel", surname: "Lages", email: "pedromiguel@gmail.com", role: 2, active: true },
    { id: 3, username: "nis123", name: "Anais", surname: "Neto", email: "nisneto123@outlook.com", role: 2, active: true },
    { id: 4, username: "vida_g", name: "Maria Margarida", surname: "Garcia", email: "mariamarg@gmail.com", role: 2, active: true },
    { id: 5, username: "filippapsi", name: "Filippa", surname: "Psychomani", email: "filippaps@gmail.com", role: 2, active: true },
    { id: 6, username: "rp000", name: "Ricardo", surname: "Pereira", email: "rp000@hotmail.com", role: 1, active: true },
    { id: 7, username: "luistorresss", name: "Luis", surname: "Torres", email: "luistorresss@gmail.com", role: 1, active: true },
  ]

  const stud_teach_rel_data = [
    { id: 1, id_student: 1, id_teacher: 2, id_subject: 1 },
    { id: 2, id_student: 1, id_teacher: 3, id_subject: 2 },
    { id: 3, id_student: 1, id_teacher: 4, id_subject: 3 },
    { id: 4, id_student: 1, id_teacher: 5, id_subject: 4 },
    { id: 5, id_student: 6, id_teacher: 5, id_subject: 4 },
    { id: 6, id_student: 7, id_teacher: 5, id_subject: 4 },
  ]

  // One-To-One association
  db.user.belongsTo(db.role, { as: 'userRole', foreignKey: 'role' });
  // One-To-Many association
  db.role.hasMany(db.user, { foreignKey: 'role' })
  // Many-To-Many association
  // db.subject.belongsToMany(db.user, { through: 'student_teacher_relation' })
  // db.user.belongsToMany(db.subject, { through: 'student_teacher_relation' })

  // Define associations for the student_teacher_relation table
  db.student_teacher_relation.belongsTo(db.user, { as: 'student', foreignKey: 'id_student' });
  db.student_teacher_relation.belongsTo(db.user, { as: 'professor', foreignKey: 'id_teacher' });
  db.student_teacher_relation.belongsTo(db.subject, { foreignKey: 'id_subject' });

  // Define the relationships for users and subjects
  db.user.hasMany(db.student_teacher_relation, { as: 'studentRelations', foreignKey: 'id_student' });
  db.user.hasMany(db.student_teacher_relation, { as: 'professorRelations', foreignKey: 'id_teacher' });
  db.subject.hasMany(db.student_teacher_relation, { foreignKey: 'id_subject' });


  db.role.bulkCreate(roles_data, { validate: true }).then(() => {
    db.subject.bulkCreate(subjects_data, { validate: true }).then(() => {
      db.user.bulkCreate(users_data, { validate: true }).then(() => {
        db.student_teacher_relation.bulkCreate(stud_teach_rel_data, { validate: true }).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  });
}).catch((error) => {
  console.error('Unable to create table: ', error);
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./src/routes/user.routes.js")(app);
require("./src/routes/reation.routes.js")(app);
require("./src/routes/auth.routes.js")(app, passport, db);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
