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
    res.send(data);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Retrieve all Users from the database.
exports.editRelation = (req, res) => {
  console.log("inside student_teacher_relation.controller.js editRelation")

  res.status(500).send({
    message: "Error updating Relation",
    success: false,
  });

  // TODO: HOW THE HELL IS THE USER SUPPOSED TO EDIT THE INFO OF A RELATION WHEN A RELATION CONISTS OF FOREIGN KEYS TO THE USER (STUDENT/PROFESSOR) AND THE SUBJECT TABLES??
  //       IS IT SUPPOSED TO CHANGE THE NAME/SURNAME/EMAIL OF A PROFESSOR OR THE NAME OF A SUBJECT ???


  // StudentTeacherRelation.update({  }, {
  //   where: { id: req.body.id }
  // })
  //   .then(num => {
  //     console.log("num", num)
  //     if (num == 1) {
  //       res.send({
  //         message: "User was updated successfully.",
  //         success: true,
  //       });
  //     } else {
  //       res.send({
  //         message: `Cannot update User with id=${id}. Maybe User was not found!`,
  //         success: false,
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     console.log("err", err)
  //     res.status(500).send({
  //       message: "Error updating User with id=" + id,
  //       success: false,
  //     });
  //   });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  // TODO: SAME QUESTION OF THE EDIT BUT FOR THE DELETE !!!

  // User.destroy({
  //   where: { id: id }
  // })
  //   .then(num => {
  //     if (num == 1) {
  //       res.send({
  //         message: "User was deleted successfully!"
  //       });
  //     } else {
  //       res.send({
  //         message: `Cannot delete User with id=${id}. Maybe User was not found!`
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: "Could not delete User with id=" + id
  //     });
  //   });
};

