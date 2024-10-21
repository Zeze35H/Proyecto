const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(
  'proyecto',
  'root',
  'password',
   {
     host: 'localhost',
     dialect: 'mysql'
   }
 );

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

const Role = sequelize.define("roles", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
});

const User = sequelize.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: 1,
    references: {
        model: Role,
        key: 'id'
    }
  },
  access_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

const Subject = sequelize.define("subjects", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
});

const StudentTeacherRelation = sequelize.define("student_teacher_relation", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    id_student: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
      },
    id_teacher: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
      },
    id_subject: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Subject,
            key: 'id'
        }
      },
})

const subjects_data = [
    {id: 1, name: 'maths'},
    {id: 2, name: 'english'},
    {id: 3, name: 'spanish'},
    {id: 4, name: 'science'},
    {id: 5, name: 'pe'},
    {id: 6, name: 'music'},
]

const roles_data = [
    {id: 1, role_name: 'estudiante'},
    {id: 2, role_name: 'profesor'},
]

const users_data = [
   {id: 1, username : "zeze35h", name: "Jose", surnames: "Henriques", email: "zezeh35@hotmail.com", role: 1, access_token: "asd1", password_token: "asd2"},
   {id: 2, username : "zeze36h", name: "Pedro", surnames: "Lima", email: "zezeh36@hotmail.com", role: 2, access_token: "asd1", password_token: "asd2"},
   {id: 3, username : "zeze37h", name: "Joao", surnames: "Silva", email: "zezeh37@hotmail.com", role: 1, access_token: "asd1", password_token: "asd2"},
   {id: 4, username : "zeze38h", name: "Miguel", surnames: "Rodrigues", email: "zezeh38@hotmail.com", role: 1, access_token: "asd1", password_token: "asd2"},
   {id: 5, username : "zeze39h", name: "Sofia", surnames: "Goncalves", email: "zezeh39@hotmail.com", role: 2, access_token: "asd1", password_token: "asd2"},
   {id: 6, username : "zeze31h", name: "Ricardo", surnames: "Pereira", email: "zezeh31@hotmail.com", role: 1, access_token: "asd1", password_token: "asd2"},
   {id: 7, username : "zeze32h", name: "Luis", surnames: "Torres", email: "zezeh32@hotmail.com", role: 1, access_token: "asd1", password_token: "asd2"},
]

const stud_teach_rel_data = [
    {id: 1, id_student: 1, id_teacher: 2, id_subject: 1},
    {id: 2, id_student: 3, id_teacher: 2, id_subject: 2},
    {id: 3, id_student: 4, id_teacher: 5, id_subject: 3},
    {id: 4, id_student: 6, id_teacher: 5, id_subject: 4},
]

Subject.belongsToMany(User, { through: 'StudentTeacherRelation'})
User.belongsToMany(Subject, { through: 'StudentTeacherRelation'})


sequelize.sync({ force: true }).then(() => {
    Role.bulkCreate(roles_data, { validate: true }).then(() => {
      Subject.bulkCreate(subjects_data, { validate: true }).then(() => {
        User.bulkCreate(users_data, { validate: true }).then(() => {
          StudentTeacherRelation.bulkCreate(stud_teach_rel_data, { validate: true }).then(() => {
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

// Array Replacement

sequelize.query(
  'SELECT * FROM users WHERE role = ?',
  {
    replacements: [2],
    type: sequelize.QueryTypes.SELECT // there are some other types as well, such as QueryTypes.UPDATE and QueryTypes.DELETE
  }
).then(result => {
  console.log(result);
}).catch((error) => {
  console.error('Failed to insert data : ', error);
});

// Object Replacement

sequelize.query(
  'SELECT * FROM users WHERE role = :id',
  {
    replacements: { id: 2 },
    type: sequelize.QueryTypes.SELECT
  }
 ).then(result => {
    console.log(result);
}).catch((error) => {
    console.error('Failed to insert data : ', error);
});