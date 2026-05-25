
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Contact = require('../models/contact');
const AqiTraffic = require('../models/AqiTraffic');

const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().min(2),
  phoneNumber: z.string().regex(/^\d{10}$/),
  email: z.string().email(),
  weatherdata: z.string(),
  message: z.string().min(5)
});

exports.gethome=(req,res,next)=>{
    res.render("index");
}
exports.postreqdata=(req,res,next)=>{
    try {
        const validatedData = contactSchema.parse(req.body);
        const { name, phoneNumber, email, weatherdata, message } = validatedData;
        const contact = new Contact({  name, phoneNumber, email, weatherdata, message });
        contact.save().then(()=>{
            console.log("New msg Details Received:", contact);
            res.status(201).json({ success: true, message: "Contact saved" });
        })
        .catch(err => {
                console.log("Error while adding home:", err);
                res.status(500).json({ success: false, error: err.message });
            });  
    } catch (err) {
        res.status(400).json({ success: false, error: err.errors || err.message });
    }
}

exports.getapidata=async(req,res,next)=>{
   try {
    // Get latest record for each location
    const data = await AqiTraffic.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$location.name",
          latestRecord: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$latestRecord" } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch AQI data" });
  }
};

exports.gethistory = async (req, res, next) => {
  const { location } = req.params;
  try {
    const history = await AqiTraffic.find({ "location.name": location })
      .sort({ createdAt: -1 })
      .limit(24);
    res.json(history.reverse());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

exports.postSignup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ success: true, message: "User created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.postlogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );
    res.status(200).json({ success: true, token, userId: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



