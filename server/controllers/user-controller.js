const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        }).send();
    })
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(401)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(402)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(403)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        //Process of hashing plaintext password into a hashed password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        //Create a user object to be saved
        const newUser = new User({
            firstName, lastName, email, passwordHash
        });
        //save the created user object into the database
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async (req, res) => {
    //check if email exists in databse
    //check hashed provided password against hashed password in database
    //sign a jwt using site's secret and embed user id inside
    //attach token to response in http-only cookie
    //send success to user and embed necessary user info
    try {
        const { inputEmail, inputPassword } = req.body
        if (!inputEmail || !inputPassword) {
            return res
                .status(800)
                .json({ errorMessage: "DID NOT WORK." });
        }
    } catch (error) {

    }
    const { inputEmail, inputPassword } = req.body
    
    try {
        await User.findOne({ email: inputEmail})
    } catch (error) {
        return console.log("WTF")
    }
    
    const existingUser = await User.findOne({ email: inputEmail})

    if (existingUser) {
        const existingUserPass = await bcrypt.compare(inputPassword, existingUser.passwordHash)
        if (existingUserPass) {
            //CODE TO ACCEPT PASSWORD
            const userToken = auth.signToken(existingUser)
            res.cookie('token', token, { httpOnly: true });
            return res
                .status(200)
                .json({
                    success: true,
                    token: userToken
                })
        } else {
            //CODE TO REJECT PASSWORD
            return res
                .status(405)
                .json({
                    success: false,
                    errorMessage: "Incorrect Password"
                })
        }
    } else {
        //CODE TO REJECT USERNAME
        return res
                .status(406).send("hello")
                .json({
                    success: false,
                    errorMessage: "Email not found"
                })
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser
}