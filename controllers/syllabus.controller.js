const Syllabus = require("../models/syllabus.model");

exports.createSubject = async (req, res) => {

    try {

        const syllabus = await Syllabus.create(req.body);

        res.status(201).json({

            success: true,

            message: "Subject Created",

            data: syllabus

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
exports.getSubjects = async (req, res) => {

    try {

        const subjects = await Syllabus.find();

        res.json({

            success: true,

            data: subjects

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
exports.getSubjects = async (req, res) => {

    try {

        const subjects = await Syllabus.find();

        res.json({

            success: true,

            data: subjects

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
exports.getSubject = async (req, res) => {

    try {

        const subject = await Syllabus.findById(req.params.id);

        if (!subject) {

            return res.status(404).json({

                success: false,

                message: "Subject not found"

            });

        }

        res.json({

            success: true,

            data: subject

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
exports.updateChapter = async (req, res) => {

    try {

        const { chapterId } = req.params;

        const syllabus = await Syllabus.findOne({

            "chapters._id": chapterId

        });

        if (!syllabus) {

            return res.status(404).json({

                success: false,

                message: "Chapter not found"

            });

        }

        const chapter = syllabus.chapters.id(chapterId);

        if (req.body.tuitionCompleted !== undefined)
            chapter.tuitionCompleted = req.body.tuitionCompleted;

        if (req.body.schoolCompleted !== undefined)
            chapter.schoolCompleted = req.body.schoolCompleted;

        if (req.body.testCompleted !== undefined)
            chapter.testCompleted = req.body.testCompleted;

        await syllabus.save();

        res.json({

            success: true,

            message: "Chapter Updated",

            data: syllabus

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};