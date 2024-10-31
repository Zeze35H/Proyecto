module.exports = app => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/create", user.create);

  // Retrieve all users
  router.get("/findAllUsers", user.findAllUsers);

  // Retrieve user by username
  router.get("/findByUsername/:username", user.findByUsername);

  // Retrieve user by email
  router.get("/findByEmail/:email", user.findByEmail);

  // Retrieve user by email
  router.get("/findByToken/:jwt/:access_token", user.findByToken);

  // Send reset password email link
  router.post("/resetPassword", user.resetPassword);

  // Change password of the user
  router.post("/update/:id", user.update)

  // Change password of the user
  router.post("/changePassword/:id", user.changePassword)

  // Change password of the user
  router.post("/activateAccount/:id", user.activateAccount)

  // Upload user picture
  router.post("/uploadImage/:id", user.uploadImage)


  app.use('/api/users', router);
};