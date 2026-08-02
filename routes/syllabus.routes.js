const router = require("express").Router();

const controller = require("../controllers/syllabus.controller");

router.post("/", controller.createSubject);

router.get("/", controller.getSubjects);

router.get("/:id", controller.getSubject);

router.post("/:id/chapter", controller.addChapter);

router.patch("/chapter/:chapterId", controller.updateChapter);

router.delete("/chapter/:chapterId", controller.deleteChapter);

router.delete("/chapter/:chapterId", controller.deleteChapter);
module.exports = router;