module.exports = app => {
    const student_teacher_relation = require("../controllers/student_teacher_relation.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Associations
    router.get("/:username", student_teacher_relation.findAllRelations);
    
    // Edit 
    router.get("/edit", student_teacher_relation.editRelation);

    app.use('/api/relations', router);
  };