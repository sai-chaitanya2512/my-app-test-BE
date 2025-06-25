const express = require("express");
const app = express();
require('dotenv').config();
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")
app.use(express.json());
app.use(cors());

const User = require('./userModel');

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl).then(() => {
    console.log('MongoDB connected successfully');
})
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/test", (req, res) => {
    res.send("Hello World");
})

const tempStore = {};

const MailSender = async (obj) => {

    let joke;

    await fetch(" https://v2.jokeapi.dev/joke/Dark")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log(data.error);
                return;
            }
            if (data.type == "twopart") {
                joke = { question: data.setup, answer: data.delivery };
            } else if (data.type == "single") {
                joke = data.joke;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });


    const { sendingMail, genratedOTP, innerText = "", res } = obj;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: sendingMail,
        subject:  innerText.includes("resetting") ? "Password reset" : "You are trying to login to our website",
        html: (genratedOTP ? `<h1>Your OTP is ${genratedOTP}</h1>` : `<h1>${innerText}</h1>`) + (typeof joke == "string" ? `<h2>${joke}</h2>` : `<h2>${joke.question}</h2>  <h2>${joke.answer}</h2>`)
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send("Error");
        } else {
            console.log("Email sent");
            res.status(200);
            res.send("Email sent");
        }
    });
}


// Register by email ( Expected Body in JSON )
// {
//     "email": "emial.com",
//     "password": "123456"
// }
app.post('/sendmail', async (req, res) => {
    const genratedOTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        alphabets: false,
        digits: true
    });

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // if user doesn't exist, create new

            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user with the hashed password
            user = new User({
                email,
                otp: genratedOTP,
                password: hashedPassword,
                otpCreatedAt: new Date()
            });

            // Save the new user
            res.status(201).json({ message: ["User registered successfully", "Please check your email for OTP"] });
            await user.save();

        } else {
            // if user exists, update OTP
            user.otp = genratedOTP;
            user.otpCreatedAt = new Date();
        }

        await user.save();

        // Send OTP email
        MailSender({ sendingMail: email, genratedOTP: genratedOTP, res });

    } catch (err) {
        console.error(err);
        res.status(500).json("Server error");
    }
});

//login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password" });
        }

         const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });


        // If everything is okay
        return res.status(200).json({ token: token, message: "Login successful" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});


//verify otp ( Expected Body in JSON )
// {
//     "email": "emial.com",
//     "otp": "123456"
// }
app.post("/verifyOtp", async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json("User not found");
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json("Wrong OTP");
        }

        // Check if OTP is expired (5 minutes)
        const now = new Date();
        const otpAgeInMinutes = (now - user.otpCreatedAt) / (1000 * 60);

        if (otpAgeInMinutes > 5) {
            return res.status(400).json("OTP expired");
        }

        // ✅ Verified
        MailSender({ sendingMail: email, innerText: "You are verified", res });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//fetchAllUser
app.get("/getUsers", async (req, res) => {
    try {
        const user = await User.find();
        console.log(user);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
})

//forgot password
app.post("/forgotPassword", async (req, res) => {

    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        
        const genratedOTP = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            alphabets: false,
            digits: true
        });    

        MailSender({ sendingMail: email, genratedOTP: genratedOTP, innerText: "You are resetting your password", res });
        res.status(200).send({message: "Password reset OTP sent to your email"});
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
    
})

app.post("/resetPassword", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        password = await bcrypt.hash(password, 10);
        user.password = password;
        await user.save();
        res.status(200).send("Password updated successfully");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
})


//jwt 
const SECRET_KEY = "your_secret_key"; // Use a strong secret key and store it securely

// Mock user for authentication
const users = [{ id: 1, username: "test", password: "password" }];

// Route to authenticate user and generate a token
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) returntoken: token, res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
};

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "You have accessed a protected route", userId: req.user.userId });
});