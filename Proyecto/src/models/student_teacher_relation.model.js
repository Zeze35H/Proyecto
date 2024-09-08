module.exports = (sequelize, Sequelize, User, Subject) => {
  const StudentTeacherRelation = sequelize.define("student_teacher_relation", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
    id_student: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
      },
    id_teacher: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
      },
    id_subject: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Subject,
            key: 'id'
        }
      },
    })

  
  return StudentTeacherRelation;
};