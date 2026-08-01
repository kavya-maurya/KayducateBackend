

const User = require("../models/contact.model");
// const logger = require("../config/logger");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const transporter = require("../config/mail");
// const nodemailer = require("nodemailer");

const authValidator = require("../validators/contact.validator");

module.exports = {
  
    createContact:async (req, res) => {
      try {
    const value = await authValidator.validateAsync(req.body);
    const user = await User.create(req.body);


 
    res.status(200).json({ message: user, status: "Contact created successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: err.details ? err.details[0].message : err.message
    });
  }
    },


getAllContacts:async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const search = req.query.search || '';

        const query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { subject: { $regex: search, $options: 'i' } },
            { message: { $regex: search, $options: 'i' } }
          ]
        };

        if (!search) {
          delete query.$or;
        }

        const total = await User.countDocuments(query);
        const contacts = await User.find(query)
          .sort({ [sortBy]: sortOrder })
          .skip((page - 1) * limit)
          .limit(limit);

        res.status(200).json({
          message: contacts,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err.message });
      }
    },

getContactById:async (req, res) => {
      const user = await User.findById(req.params.id)
     
       res.status(200).json({ message: user });
    },

updateContact:async (req, res) => {
      const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json({ message: user });
    },

deleteContact:async (req, res) => {
       const user = await User.findByIdAndDelete(req.params.id);
         res.status(200).json({ message: "contact deleted" });
      
    },

// searchContacts:async (req, res) => {
//       const user = await req.query.search;
     
//        res.status(200).json({ message: user });
//     },

// sortContacts:async (req, res) => {
//       const user = await User.find();
     
//        res.status(200).json({ message: user });
//     },
    
}