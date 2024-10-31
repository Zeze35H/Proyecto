const db = require("../models");
const User = db.user;

const bcrypt = require('bcrypt');

const correct_token = '3rhb23uydb238ry6g2429hrh'

const EmailService = require("../services/EmailService.js");
const { v4: uuidv4 } = require('uuid');

const jwt = require('jsonwebtoken');

const DBCleanupService = require("../services/DBCleanupService.js")(db)

const fs = require('fs');
const path = require('path');

// Create and Save a new User
exports.create = (req, res) => {

  console.log("inside user.controller.js create")

  // Validate request
  if (req.body.role == 2 && req.body.token != correct_token) {
    res.status(400).send({
      message: "The inserted token is incorrect."
    });
    return;
  }


  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    }

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

        DBCleanupService.cleanDatabase();

        const token = jwt.sign({ id: data.id }, 'your-secret-key', { expiresIn: '7d' });
        const link = "http://localhost:8081/login?jwt=" + token + '&access_token=' + data.access_token

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

        EmailService.sendMail(req.body.email, "SchoolWebsiteThingy Account Confirmation", text)
          .then(data => {
            res.status(200).send(data);
          })
          .catch(err => {
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
exports.findAllUsers = (req, res) => {

  console.log("inside user.controller.js findAllUsers")

  User.findAll()
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

// Find user by Username
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

// Find user by Email
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

// Find User by JWT and access_token
exports.findByToken = (req, res) => {

  console.log("inside user.controller.js findByToken")

  try {
    const decoded_jwt = jwt.verify(req.params.jwt, 'your-secret-key');
    const access_token = req.params.access_token;
    var condition = { id: decoded_jwt.id, access_token: access_token };

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
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving user."
    });
  }
};

// Send reset password email
exports.resetPassword = (req, res) => {

  console.log("inside user.controller.js resetPassword")

  const token = jwt.sign({ id: req.body.id }, 'your-secret-key', { expiresIn: '5m' });
  const link = "http://localhost:8081/password_change?jwt=" + token + '&access_token=' + req.body.access_token

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

  EmailService.sendMail(req.body.email, "ShoolWebsiteThingy Password Reset", text)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while sending the email."
      });
    });
};

// Update user info
exports.update = (req, res) => {
  const id = req.params.id;

  // Validate request
  if (req.body.token) {
    if (req.body.role == 2 && req.body.token != correct_token) {
      res.send({
        success: false,
        message: "Incorrect token."
      });
      return;
    }
    delete req.body["token"]
  }

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      DBCleanupService.cleanDatabase();

      if (num == 1) {
        res.send({
          success: true,
          message: "User was updated successfully."
        });
      } else {
        res.send({
          success: false,
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: `Error updating User with id=${id}. ${err}`
      });
    });
};

// Update users password
exports.changePassword = (req, res) => {

  console.log("inside user.controller.js changePassword")

  const id = req.params.id;

  bcrypt.hash(req.body.new_password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the User."
      });
    }

    User.update({ access_token: uuidv4(), password_token: hashedPassword }, {
      where: { id: id }
    })
      .then(num => {
        DBCleanupService.cleanDatabase();

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
        res.status(500).send({
          message: `Error updating User with id=${id}. ${err}`,
          success: false,
        });
      });
  })

};

// Set user's acctountas active
exports.activateAccount = (req, res) => {

  console.log("inside user.controller.js activateAccount")

  const id = req.params.id

  User.update({ access_token: uuidv4(), active: true }, {
    where: { id: id }
  })
    .then(num => {
      DBCleanupService.cleanDatabase();

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
      res.status(500).send({
        message: `Error updating User with id=${id}. ${err}`,
        success: false,
      });
    });

};

// Upload users profile image
exports.uploadImage = (req, res) => {

  console.log("inside user.controller.js uploadImage")

  const { old_picture, imageBase64 } = req.body;

  const id = req.params.id

  if (imageBase64) {
    // Decode Base64 string and save it as an image file
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate a unique filename with a timestamp
    const filename = `${Date.now()}.jpg`;
    const filePath = path.join(__dirname, '../../public', filename);

    // Write the file to the public directory
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Error saving image to the server.",
        });
      }

      // Update the user's profile picture URL in the database
      const imageUrl = `/${filename}`;

      User.update({ picture: imageUrl }, {
        where: { id: id }
      })
        .then(num => {
          DBCleanupService.cleanDatabase();

          if (num == 1) {

            // Delete old profile picture after successful update
            if (old_picture != "/default_picture.png") {
              const oldPath = path.join(__dirname, '../../public', old_picture);

              fs.unlink(oldPath, (err) => {
                if (err) console.log(err);
                else console.log('Old picture successfully deleted');
              });
            }

            res.send({
              imageUrl: imageUrl,
              message: "User picture was updated successfully.",
              success: true,
            });
          } else {
            res.send({
              message: `Cannot update User picture with id=${id}. Maybe User was not found!`,
              success: false,
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: `Error updating User picture with id=${id}. ${err}`,
            success: false,
          });
        });

    })
  } else {
    res.status(500).send({
      success: false,
      message: "No image file present in the request for upload.",
    });
  }

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
        message: `Error retrieving User with id=${id}. ${err}`,
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
        message: `Error deleting User with id=${id}. ${err}`,
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
