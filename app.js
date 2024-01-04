const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const User = require("./models/userModel");

require("dotenv").config();

(async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log(`DB connected`);
  } catch (err) {
    console.log("DB error :::::::", err);
    process.exit(1);
  }
})();

const app = express();

const corsOptions = {
  origin: ["http://localhost:8500"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.set("Content-Type", "application/json");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const DOB = req.body.DOB

    const user = new User({
        username,
        email,
        DOB
    })

    const checkEmail = await User.findOne({ email })

  if (checkEmail) return res.status(401).redirect('/alreadyExist')

    await user.save();

  const checkBirthdays = async () => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const todayBirthdays = await Birthday.find({
      date: { $gte: startOfDay, $lt: endOfDay },
    });
  
    if (todayBirthdays.length > 0) {
      console.log('Today\'s Birthdays:');
      todayBirthdays.forEach(birthday => {
        console.log(`${birthday.name} - ${birthday.date.toDateString()}`);


        // async function main() {
        //   let testAccount = await nodemailer.createTestAccount();
    
        //   let transporter = nodemailer.createTransport({
        //     host: process.env.MAIL_HOST,
        //     port: process.env.MAIL_PORT,
        //     secure: true, // true for 465, false for other ports
        //     auth: {
        //       user: process.env.MAIL_USER, // generated ethereal user
        //       pass: process.env.MAIL_PWD, // generated ethereal password
        //     },
        //   });
    
        //   // console.log(transporter)
    
        //   // send mail with defined transport object
        //   let info = await transporter.sendMail({
        //     from: `"E-Series" <${process.env.MAIL_USER}>`, // sender address
        //     to: `${q.email}`, // list of receivers
        //     subject: "Your Account has been created", // Subject line
    
        //     html: `
        //        <h2>Hello there!</h2>
        //        <p>Your OTP is <em>${otp}</em></p>
        //        <p>Thanks for joining us</p>
        //        <p>Log in after your OTP has been verified</p>
        //        `,
        //   });
    
        //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // }
      });
    } else {
      console.log('No birthdays today.');
    }
  };
 res.status(200).redirect("/submit")

});

app.get("/submit", async (req, res) => {
  res.render("submit")
})

app.get("/alreadyExist", async (req, res) => {
  res.render('exist')
})


const PORT = 8500;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
