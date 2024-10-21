// const subjects_data = [
//     {id: 1, name: 'maths'},
//     {id: 2, name: 'english'},
//     {id: 3, name: 'spanish'},
//     {id: 4, name: 'science'},
//     {id: 5, name: 'pe'},
//     {id: 6, name: 'music'},
// ]

// const roles_data = [
//     {id: 1, role_name: 'estudiante'},
//     {id: 2, role_name: 'profesor'},
// ]

// const users_data = [
//    {id: 1, username : "zeze35h", name: "Jose", surnames: "Henriques", email: "zezeh35@hotmail.com", role: 1, access_token: "asd1", password_token: "asd2"},
//    {id: 2, username : "zeze36h", name: "Pedro", surnames: "Lima", email: "zezeh36@hotmail.com", role: 2, access_token: "asd1", password_token: "asd2"},
//    {id: 3, username : "zeze37h", name: "Joao", surnames: "Silva", email: "zezeh37@hotmail.com", role: 1, access_token: "asd1", password_token: "asd2"},
//    {id: 4, username : "zeze38h", name: "Miguel", surnames: "Rodrigues", email: "zezeh38@hotmail.com", role: 1, access_token: "asd1", password_token: "asd2"},
//    {id: 5, username : "zeze39h", name: "Sofia", surnames: "Goncalves", email: "zezeh39@hotmail.com", role: 2, access_token: "asd1", password_token: "asd2"},
//    {id: 6, username : "zeze31h", name: "Ricardo", surnames: "Pereira", email: "zezeh31@hotmail.com", role: 1, access_token: "asd1", password_token: "asd2"},
//    {id: 7, username : "zeze32h", name: "Luis", surnames: "Torres", email: "zezeh32@hotmail.com", role: 1, access_token: "asd1", password_token: "asd2"},
// ]

// const stud_teach_rel_data = [
//     {id: 1, id_student: 1, id_teacher: 2, id_subject: 1},
//     {id: 2, id_student: 3, id_teacher: 2, id_subject: 2},
//     {id: 3, id_student: 4, id_teacher: 5, id_subject: 3},
//     {id: 4, id_student: 6, id_teacher: 5, id_subject: 4},
// ]

// // One-To-One association
// User.belongsTo(Role, { as: 'userRole', foreignKey: 'role' });
// // One-To-Many association
// Role.hasMany(User, { foreignKey: 'role' })
// // Many-To-Many association
// Subject.belongsToMany(User, { through: 'StudentTeacherRelation'})
// User.belongsToMany(Subject, { through: 'StudentTeacherRelation'})


// sequelize.sync({ force: true }).then(() => {
//     Role.bulkCreate(roles_data, { validate: true }).then(() => {
//       Subject.bulkCreate(subjects_data, { validate: true }).then(() => {
//         User.bulkCreate(users_data, { validate: true }).then(() => {
//           StudentTeacherRelation.bulkCreate(stud_teach_rel_data, { validate: true }).then(() => {
//           }).catch((error) => {
//             console.log(error);
//           });
//         }).catch((error) => {
//           console.log(error);
//         });
//       }).catch((error) => {
//         console.log(error);
//       });
//     }).catch((error) => {
//       console.log(error);
//     });
//   }).catch((error) => {
//     console.error('Unable to create table: ', error);
//   });

// export const loginUser = function (username, password) {
//   sequelize.query(
//     'SELECT * FROM users WHERE username = ? AND password = ?',
//     {
//       replacements: [username, password],
//       type: sequelize.QueryTypes.SELECT // there are some other types as well, such as QueryTypes.UPDATE and QueryTypes.DELETE
//     }
//   ).then(result => {
//     console.log(result);
//     console.log("LOGIN!!!!!!")
//   }).catch((error) => {
//     console.error('Failed to insert data : ', error);
//   });
// };

// export const x = 2