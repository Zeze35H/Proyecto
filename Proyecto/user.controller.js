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
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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

sequelize.sync().then(() => {
   console.log('User table created successfully!');



//    User.create({                         // CREATE AN USER
//        username: "zeze35h",
//        name: "Jose Eduardo",
//        surnames: "Henriques",
//        email: "zezeh35@hotmail.com",
//        access_token: "asd1",
//        password_token: "asd2",
//    }).then(res => {
//        console.log(res)
//    }).catch((error) => {
//        console.error('Failed to create a new record : ', error);
//    });

    // User.findAll().then(res => {            // FIND ALL USERS
    //     console.log(res)
    // }).catch((error) => {
    //     console.error('Failed to retrieve data : ', error);
    // });

    // User.findOne({                              // FIND ONE USER (WHERE...)
    //     where: {
    //         id : "1"
    //     }
    // }).then(res => {
    //     console.log(res)
    // }).catch((error) => {
    //     console.error('Failed to retrieve data : ', error);
    // });

    // User.destroy({                                  // DELETE ONE USER (WHERE...)
    //     where: {
    //       id: 1
    //     }
    // }).then(() => {
    //     console.log("Successfully deleted record.")
    // }).catch((error) => {
    //     console.error('Failed to delete record : ', error);
    // });

}).catch((error) => {
    console.error('Unable to create table : ', error);
});