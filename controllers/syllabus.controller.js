const Syllabus = require("../models/syllabus.model");

// ===========================================
// Create Subject
// ===========================================

exports.createSubject = async (req, res) => {
    try {

        const syllabus = await Syllabus.create(req.body);

        res.status(201).json({
            success: true,
            message: "Subject Created Successfully",
            data: syllabus
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// ===========================================
// Get All Subjects
// ===========================================

exports.getSubjects = async (req, res) => {
    try {

        const subjects = await Syllabus.find();

        res.status(200).json({
            success: true,
            data: subjects
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// ===========================================
// Get Single Subject
// ===========================================

exports.getSubject = async (req, res) => {
    try {

        const subject = await Syllabus.findById(req.params.id);

        if (!subject) {

            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });

        }

        res.status(200).json({
            success: true,
            data: subject
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// ===========================================
// Add Chapter
// ===========================================

exports.addChapter = async (req, res) => {

    try {

        const { id } = req.params;
        const { name } = req.body;

        const subject = await Syllabus.findById(id);

        if (!subject) {

            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });

        }

        subject.chapters.push({
            name
        });

        await subject.save();

        res.status(201).json({
            success: true,
            message: "Chapter Added Successfully",
            data: subject
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ===========================================
// Update Chapter
// ===========================================

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

        if (req.body.name !== undefined)
            chapter.name = req.body.name;

        if (req.body.tuitionCompleted !== undefined)
            chapter.tuitionCompleted = req.body.tuitionCompleted;

        if (req.body.schoolCompleted !== undefined)
            chapter.schoolCompleted = req.body.schoolCompleted;

        if (req.body.testCompleted !== undefined)
            chapter.testCompleted = req.body.testCompleted;

        await syllabus.save();

        res.status(200).json({
            success: true,
            message: "Chapter Updated Successfully",
            data: syllabus
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ===========================================
// Delete Chapter
// ===========================================

exports.deleteChapter = async (req, res) => {

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

        syllabus.chapters.pull(chapterId);

        await syllabus.save();

        res.status(200).json({
            success: true,
            message: "Chapter Deleted Successfully",
            data: syllabus
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
exports.deleteChapter = async (req, res) => {

    try {

        const { chapterId } = req.params;

        const syllabus = await Syllabus.findOne({
            "chapters._id": chapterId
        });

        if (!syllabus) {
            return res.status(404).json({
                success:false,
                message:"Chapter not found"
            });
        }

        syllabus.chapters.pull(chapterId);

        await syllabus.save();

        res.json({
            success:true,
            message:"Chapter deleted"
        });

    } catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

};