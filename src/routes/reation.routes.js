module.exports = app => {
    const student_teacher_relation = require("../controllers/student_teacher_relation.controller.js");
  
    var router = require("express").Router();
  
    router.get("/findAll/:id/:role", student_teacher_relation.findAllRelations);
    
    router.get("/professor/:id", student_teacher_relation.findAllProfessorRelations);
    
    router.delete("/delete/:id", student_teacher_relation.deleteRelation);

    app.use('/api/relations', router);
  };