
const Contact = require('../models/contact');
const AqiTraffic = require('../models/AqiTraffic');
const { spawn } = require("child_process");

const fs=require('fs');

exports.gethome=(req,res,next)=>{
    res.render("index");
}
exports.postreqdata=(req,res,next)=>{
    const { name, phoneNumber, email, weatherdata,message } = req.body;
    const contact = new Contact({  name, phoneNumber, email, weatherdata,message });
    contact.save().then(()=>{
        console.log("New msg Details Received:", contact);
        res.status(201).json({ success: true, message: "Contact saved" });
    })
    .catch(err => {
            console.log("Error while adding home:", err);
            res.status(500).json({ success: false, error: err.message });
        });  
}

exports.getapidata=async(req,res,next)=>{
   try {
    const data = await AqiTraffic.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch AQI data" });
  }
};

exports.getaboutus=(req,res,next)=>{
    res.render("aboutus");
};

exports.getcontactus=(req,res,next)=>{
    res.render("Contactus");
}
exports.getlogin=(req,res,next)=>{
    res.render("login");
};

exports.postlogin=(req,res,next)=>{
  const reqbody = req.body;
  fs.appendFile(
    "userlogin.txt",
    JSON.stringify(reqbody, null, 2) + "\n",
    (err) => {
      if (err) {
         return res.status(500).json({ success: false, error: "Failed to save" });
      }
      console.log("data is written in the file");
      res.status(200).json({ success: true });
    }
  );
};



