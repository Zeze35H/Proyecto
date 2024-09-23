const db = require("../models");
const User = db.user;
const StudentTeacherRelation = db.student_teacher_relation
const Subject = db.subject

// Retrieve all Users from the database.
exports.findAllRelations = (req, res) => {
  console.log("inside student_teacher_relation.controller.js findAllRelations")

  StudentTeacherRelation.findAll({
    include: [
      {
        model: User,
        as: 'student', // Use the alias 'student'
        where: {
          username: req.params.username,
        },
      },
      {
        model: User,
        as: 'professor' // Use the alias 'professor'
      },
      {
        model: Subject, // No alias needed as it's direct relation
        attributes: ['id', 'name'] // Include the relevant attributes for subjects
      }
    ]
  }).then(data => {
    console.log(data)
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    });
  });
};
