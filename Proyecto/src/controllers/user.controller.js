const db = require("../models");
const User = db.user;

const bcrypt = require('bcrypt');

const correct_token = '3rhb23uydb238ry6g2429hrh'

const EmailService = require("../services/EmailService.js");
const { v4: uuidv4 } = require('uuid');


// Create and Save a new User
exports.create = (req, res) => {

  console.log("inside user.controller.js create")

  // Validate request
  if (req.body.role == 2 && req.body.token != correct_token) {
    res.status(400).send({
      message: "Incorrect token."
    });
    return;
  }


  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    };

    // Create a User
    const user = {
      username: req.body.username,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      role: req.body.role,
      password_token: hashedPassword,
    };

    // Save User in the database
    User.create(user)
      .then(data => {

        console.log(data)
        const link = "http://localhost:8081/login?token=" + data.access_token

        const text =
          `
          Hello, ${req.body.name} ${req.body.surname}.\n
          We've received a request to create an account using this email address.
          If this wasn't you, please ignore this email.
          Otherwise, click the link below to activate your account and complete your registration!\n
          ${link}\n
          Do not share this link with anyone!\n
          Best regards,
          Website Thingy Team
          `

        EmailService.sendMail(req.body.email, "WebsiteThingy Account Confirmation", text)
          .then(data => {
            console.log(data)
            res.status(200).send(data);
          })
          .catch(err => {
            console.log(err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the user."
            });
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      });
  });

};

// Retrieve all Users from the database.
exports.findByUsername = (req, res) => {

  console.log("inside user.controller.js findByUsername")

  const username = req.params.username;
  var condition = username ? { username: username } : null;

  User.findOne({ where: condition })
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
exports.findByEmail = (req, res) => {

  console.log("inside user.controller.js findByEmail")

  const email = req.params.email;
  var condition = email ? { email: email } : null;

  User.findOne({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};

// Retrieve all Users from the database.
exports.findByToken = (req, res) => {

  console.log("inside user.controller.js findByEmail")

  const token = req.params.token;
  var condition = token ? { access_token: token } : null;

  User.findOne({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};


// Send reset password email
exports.resetPassword = (req, res) => {

  console.log("inside user.controller.js resetPassword")

  // TODO: SEND EMAIL WITH RESET LINK

  console.log(req.body)

  const link = "http://localhost:8081/password_change?token=" + req.body.access_token

  const text =
    `
      Hello, ${req.body.name} ${req.body.surname}.\n
      We've received a request to reset your password.
      If this wasn't you, please ignore this email.
      Otherwise, click the link below to reset your password!\n
      ${link}\n
      Do not share this link with anyone!\n
      Best regards,
      Website Thingy Team
    `

  EmailService.sendMail(req.body.email, "WebsiteThingy Password Reset", text)
    .then(data => {
      console.log(data)
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};

exports.changePassword = (req, res) => {

  console.log("inside user.controller.js changePassword")

  console.log(req.body)
  console.log(req.params)

  const id = req.params.id;

  bcrypt.hash(req.body.new_password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the User."
      });
    };

    console.log(id, hashedPassword)

    User.update({ password_token: hashedPassword }, {
      where: { id: id }
    })
      .then(num => {
        console.log("num", num)
        if (num == 1) {
          res.send({
            message: "User was updated successfully.",
            success: true,
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
            success: false,
          });
        }
      })
      .catch(err => {
        console.log("err", err)
        res.status(500).send({
          message: "Error updating User with id=" + id,
          success: false,
        });
      });
  })

};


exports.activateAccount = (req, res) => {

  console.log("inside user.controller.js activateAccount")

 const newvar = uuidv4();
 console.log(newvar)

  User.update({ access_token: newvar, active: true }, {
    where: { id: req.params.id }
  })
    .then(num => {
      console.log("num", num)
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
          success: true,
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`,
          success: false,
        });
      }
    })
    .catch(err => {
      console.log("err", err)
      res.status(500).send({
        message: "Error updating User with id=" + id,
        success: false,
      });
    });

};


// OTHERS

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

// find all student users
exports.findAllStudents = (req, res) => {
  User.findAll({ where: { role: 1 } })
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

// find all professor users
exports.findAllProfessors = (req, res) => {
  User.findAll({ where: { role: 2 } })
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

// find all professor users
exports.uploadImage = (req, res) => {
  console.log("inside upload Image").then(data => {
    res.send(data);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

exports.login = (req, res) => {

  console.log("inside user.controller.js login")

  User.findOne({ where: { username: "zeze35h" } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
}