const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userController = require("./src/controllers/user.controller");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./src/models");

db.sequelize.sync({ force: true }).then(() => {
  db.role.create({
    id: 1,
    role_name: "Student"
  }).then(res => {
     console.log("'Student' Role created succesfully");
  }).catch(err=>console.log(err));
  
  db.role.create({
    id: 2,
    role_name: "Professor"
  }).then(res => {
     console.log("'Professor' Role created succesfully");
  }).catch(err=>console.log(err));
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./src/services/routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
