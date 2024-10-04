module.exports = app => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/create", user.create);

  // Retrieve user by username
  router.get("/findByUsername/:username", user.findByUsername);

  // Retrieve user by email
  router.get("/findByEmail/:email", user.findByEmail);

  // Retrieve user by email
  router.get("/findByToken/:token", user.findByToken);

  // Send reset password email link
  router.post("/resetPassword", user.resetPassword);

  // Change password of the user
  router.post("/changePassword/:id", user.changePassword)

  // Change password of the user
  router.post("/activateAccount/:id", user.activateAccount)

  // // Retrieve all published Users
  // router.get("/published", user.findAllStudents);

  // // Retrieve a single User with id
  // router.get("/:id", user.findOne);

  // // Update a User with id
  // router.put("/:id", user.update);

  // // Delete a User with id
  // router.delete("/:id", user.delete);

  // // Delete all Users
  // router.delete("/", user.deleteAll);

  app.use('/api/users', router);
};