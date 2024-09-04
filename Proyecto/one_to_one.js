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
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
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

const Role = sequelize.define("roles", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
});

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

// One-To-One association
User.belongsTo(Role, { as: 'userRole', foreignKey: 'role' });

sequelize.sync({ force: true }).then(() => {
   Role.bulkCreate(roles_data, { validate: true }).then(() => {
       User.bulkCreate(users_data, { validate: true }).then(() => {
            User.findAll({
                include: [{
                    model: Role,
                    as: 'userRole',  // Use the alias here
                }]
            }).then(result => {
                console.log(result)
            }).catch((error) => {
                console.error('Failed to retrieve data : ', error);
            });
       }).catch((err) => { console.log(err); });
   }).catch((err) => { console.log(err); });
}).catch((error) => {
   console.error('Unable to create the table : ', error);
});