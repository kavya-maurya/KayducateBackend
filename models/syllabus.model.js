const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
{
    name:
    {
        type: String,
        required: true,
        trim: true
    },

    tuitionCompleted:
    {
        type: Boolean,
        default: false
    },

    schoolCompleted:
    {
        type: Boolean,
        default: false
    },

    testCompleted:
    {
        type: Boolean,
        default: false
    }
},
{
    _id: true
});

const syllabusSchema = new mongoose.Schema(
{
    subject:
    {
        type: String,
        required: true,
        trim: true
    },

    chapters:
    {
        type: [chapterSchema],
        default: []
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Syllabus", syllabusSchema);