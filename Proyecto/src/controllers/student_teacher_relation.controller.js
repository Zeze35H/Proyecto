const db = require("../models");
const User = db.user;
const StudentTeacherRelation = db.student_teacher_relation
const Subject = db.subject

// Retrieve all Users from the database.
exports.findAllRelations = (req, res) => {
  console.log("inside student_teacher_relation.controller.js findAllRelations")

  console.log(req.params)
  console.log(req.query)
  const id = req.params.id
  console.log(id)

  let student_conditon = {}
  let professor_conditon = {}


  if (req.params.role != 2) {
    student_conditon = { id: id, }
  }
  else {
    professor_conditon = { id: id, }
  }

  StudentTeacherRelation.findAll({
    include: [
      {
        model: User,
        as: 'student', // Use the alias 'student'
        where: student_conditon,
      },
      {
        model: User,
        as: 'professor', // Use the alias 'professor'
        where: professor_conditon,
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
exports.findAllProfessorRelations = (req, res) => {

  console.log("inside student_teacher_relation.controller.js findAllProfessorRelations")

  StudentTeacherRelation.findAll({
    attributes: [
      [db.Sequelize.col('subject.name'), 'subject_name'],  // Use the alias 'subject' for the joined table
      [db.Sequelize.fn('COUNT', db.Sequelize.col('id_student')), 'num_students']  // Count of students
    ],
    where: {
      id_teacher: req.params.id,
    },
    include: [
      {
        model: Subject,  // Include the Subject model
        attributes: []   // Do not return the Subject attributes separately (handled above)
      }
    ],
    group: ['id_subject', 'subject.name']  // Use 'subject.name' in GROUP BY
  })
    .then(data => {
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
exports.deleteRelation = (req, res) => {
  const id = req.params.id;

  StudentTeacherRelation.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          success: true,
          message: "Relation was deleted successfully!"
        });
      } else {
        res.send({
          success: false,
          message: `Cannot delete Relation with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: "Could not delete Relation with id=" + id
      });
    });
};

