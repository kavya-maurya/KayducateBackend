const router = require("express").Router();

const controller = require("../controllers/syllabus.controller");

router.post("/", controller.createSubject);

router.get("/", controller.getSubjects);

router.get("/:id", controller.getSubject);

router.patch("/chapter/:chapterId", controller.updateChapter);

module.exports = router;