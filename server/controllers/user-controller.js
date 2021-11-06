const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        try {
            const loggedInUser = await User.findOne({ _id: req.userId });
            return res.status(200).json({
                loggedIn: true,
                user: {
                    firstName: loggedInUser.firstName,
                    lastName: loggedInUser.lastName,
                    email: loggedInUser.email
                }
                }).send();
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }   
    })
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ 
                    errorMessage: "Please enter all required fields." ,
                    errorCode: 1
                    });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters.",
                    errorCode: 2
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice.",
                    errorCode: 3
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists.",
                    errorCode: 4
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
        const {email, password} = req.body;
        if (!email || !password) {
            return res
                    .status(400)
                    .json({
                        errorMessage: "Handle Modal: Please enter all required fields",
                        errorCode: 1
                    })
        }
        try {
            let existingUser = await User.findOne({ email: email})
            if (!existingUser) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        errorMessage: "Handle Modal: Email does not exist.",
                        errorCode: 5
                    })
            }
            try {
                const existingUserPassword = await bcrypt.compare(password, existingUser.passwordHash);

                if (existingUserPassword) {

                    //CODE TO ACCEPT PASSWORD
                    const thisUser = new User({
                        firstName : existingUser.firstName, 
                        LastName: existingUser.lastName, 
                        email: existingUser.email, 
                        passwordHash: existingUser.passwordHash
                    });
                    const token = auth.signToken(thisUser);
                    
                    await res.cookie('token', token, { 
                        httpOnly: true,
                        secure: true,
                        sameSite: "none"
                    }).status(200).json({
                        success: true,
                        user: {
                            firstName: existingUser.firstName,
                            lastName: existingUser.lastName,
                            email: existingUser.email
                        }
                    }).send()
                } else {
                    return res
                    .status(400)
                    .json({
                        errorMessage: "Handle Modal: Incorrect Password",
                        errorCode: 5
                    })
                }
            } catch (error) {
                return res
                    .status(400)
                    .json({
                        errorMessage: "Handle Modal: Incorrect Password",
                        errorCode: 5
                    })
            }
        } catch (error) {
            return res
                    .status(400)
                    .json({
                        errorMessage: "Handle Modal: Email does not exist",
                        errorCode: 99
                    })
        }

    } catch (error) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    await res.clearCookie("token").status(200).json({ success: true })
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}