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
      },
      onDelete: 'CASCADE'
    },
    id_teacher: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    id_subject: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  })


  return StudentTeacherRelation;
};