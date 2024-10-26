const db = require("../models");
const Sequelize = db.Sequelize
const Op = Sequelize.Op

const User = db.user;
const Role = db.role;
const Subject = db.subject;
const StudentTeacherRelation = db.student_teacher_relation;
const Session = db.session;

// USER

async function cleanUserData() {
    // Remove duplicate usernames or emails
    const duplicates = await User.findAll({
        attributes: ['id'],
        where: {
            id: {
                [Op.in]: Sequelize.literal(
                    `(SELECT MIN(id) FROM users GROUP BY username, email HAVING COUNT(*) > 1)`
                ),
            },
        },
    });

    // Extract IDs from the duplicates
    const duplicateIds = duplicates.map((user) => user.id);

    // Delete duplicate entries by IDs
    await User.destroy({
        where: {
            id: {
                [Op.in]: duplicateIds,
            },
        },
    });

    // Set role to 1 (Student) if not 1 or 2
    await User.update(
        { role: 1 },
        {
            where: {
                role: {
                    [Op.notIn]: [1, 2],
                },
            },
        }
    );

    console.log("User data cleaned.");
}

// ROLE

async function cleanRoleData() {
    // Remove any roles that are not 'Student' or 'Professor'
    await Role.destroy({
        where: {
            id: {
                [Op.notIn]: [1, 2],
            },
        },
    });

    // Ensure the correct entries are present in the Role table
    await Role.findOrCreate({ where: { id: 1 }, defaults: { role_name: 'Student' } });
    await Role.findOrCreate({ where: { id: 2 }, defaults: { role_name: 'Professor' } });

    console.log("Role data cleaned.");
}

// SUBJECT

async function cleanSubjectData() {
    // Remove any subject records with null or empty names
    await Subject.destroy({
        where: {
            name: {
                [Op.or]: [null, ''],
            },
        },
    });

    console.log("Subject data cleaned.");
}

// STUDENT_TEACHER_RELATION

async function cleanStudentTeacherRelationData() {
    // Delete entries where `id_student` does not refer to a Student (role 1)
    await StudentTeacherRelation.destroy({
        where: {
            id_student: {
                [Op.notIn]: Sequelize.literal(
                    `(SELECT id FROM users WHERE role = 1)`
                ),
            },
        },
    });

    // Delete entries where `id_teacher` does not refer to a Professor (role 2)
    await StudentTeacherRelation.destroy({
        where: {
            id_teacher: {
                [Op.notIn]: Sequelize.literal(
                    `(SELECT id FROM users WHERE role = 2)`
                ),
            },
        },
    });

    console.log("StudentTeacherRelation data cleaned.");
}

// SESSION

async function cleanSessionData() {
    // Delete expired sessions
    await Session.destroy({
        where: {
            expires: {
                [Op.lt]: new Date(),
            },
        },
    });

    console.log("Session data cleaned.");
}

// CLEAN DATABASE

async function cleanDatabase() {
    await cleanUserData();
    await cleanRoleData();
    await cleanSubjectData();
    await cleanStudentTeacherRelationData();
    await cleanSessionData();
    console.log("Database cleaned successfully.");
}

cleanDatabase()