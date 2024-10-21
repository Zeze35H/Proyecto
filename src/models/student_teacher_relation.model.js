module.exports = (sequelize, Sequelize, User, Subject) => {
  const StudentTeacherRelation = sequelize.define("student_teacher_relation", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_student: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    id_teacher: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    id_subject: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: 'id'
      }
    },
  })


  return StudentTeacherRelation;
};