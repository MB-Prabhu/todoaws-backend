const TodoModel = require("../models/Todo.model");
const userModel = require("../models/user.model");
const { parseExpiry } = require("../utils/stringtosecond");

const jwt = require('jsonwebtoken')


const login = async (req, res) => {
    try {

        const isdemoaccessTokenExist = req.cookies.demoaccessToken;

        if (isdemoaccessTokenExist) {
            return res.status(403).json({ message: "user already logged in", ok: false });
        }

        let { email, password } = req.body

        if (!email) {
            throw new Error("Enter the Email")
        }

        if (!password) {
            throw new Error("Enter the Password")
        }

        let isExists = await userModel.findOne({ email })

        if (!isExists) {
            throw new Error("Invalid email or password")
        }

        if (isExists.password !== password) {
            throw new Error("Invalid email or password")
        }

        const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY; // 15 minutes


        let demoaccessToken = jwt.sign({ _id: isExists._id }, process.env.JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });

        res.cookie("demoaccessToken", demoaccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true for HTTPS in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: parseExpiry(ACCESS_TOKEN_EXPIRY) * 1000 // Convert seconds to ms
        });


        res.status(200).json({ demoaccessToken, message: "Login successful", ok: true });
    }

    catch (err) {
        console.log("error from adminLogin api", err.message)
        res.status(400).json({ message: err.message, ok: false });
    }
}

const logout = async (req, res) => {
    try {
        const demoaccessToken = req.cookies.demoaccessToken// Assuming Bearer token

        if (!demoaccessToken) {
            return res.status(400).json({ msg: "please login to logout", ok: false })
        }

        res.clearCookie("demoaccessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            path: "/",
        });

        res.json({ message: "Logout successful", ok: true });
    } catch (err) {
        console.error("error from Logout api", err.message);
        res.status(400).json({ message: err.message, error: "logout failed", ok: false });
    }
}

const createTodo = async (req, res) => {
    try {
        const { todoName, completed } = req.body

        let data = await TodoModel.create({ todoName, completed })

        res.status(201).json({ msg: "creted successfully", data, ok: true })
    }
    catch (err) {
        console.error("error from createTodo Api", err.message);
        res.status(400).json({ message: err.message, error: "not created", ok: false });

    }
}

const getTodo = async (req, res) => {
    try {
        let data = await TodoModel.find({})

        if (!data.length) {
            return res.status(200).json({ msg: "no Todo available", data: [], ok: true })
        }

        res.status(200).json({ msg: "fetched successfully", data, ok: true })

    }
    catch (err) {
        console.error("error from getTodo Api", err.message);
        res.status(400).json({ message: err.message, error: "not fetched", ok: false });

    }
}

const updateTodo = async (req, res) => {
    try {
        let id = req.params.id

        let { completed } = req.body

        let data = await TodoModel.findByIdAndUpdate(id, { completed }, { returnDocument: "after" })

        if (!data) {
            throw new Error("no items found with the id provided")
        }

        res.status(200).json({ msg: "updated successfully", data, ok: true })


    }
    catch (err) {
        console.error("error from updatedTodo Api", err.message);
        res.status(400).json({ message: err.message, error: "not updated", ok: false });

    }
}

const deleteTodo = async (req, res) => {
    try {
        let id = req.params.id

        let data = await TodoModel.findByIdAndDelete(id, { returnDocument: "after" })

        if (!data) {
            throw new Error("no items found with the id provided")
        }

        res.status(200).json({ msg: "deleted successfully", data, ok: true })
    }
    catch (err) {
        console.error("error from delteTodo Api", err.message);
        res.status(400).json({ message: err.message, error: "not deleted", ok: false });
    }
}

const isAuthenticatedUser = async (req, res) => {
    try {
        const demoaccessToken = req.cookies?.demoaccessToken; // Get access token from cookies
      
        if (!demoaccessToken) {
            return res.status(401).json({ authenticated: false, error: "authentication failed", ok: false });
        }
        
        jwt.verify(demoaccessToken, process.env.JWT_SECRET, (err) => {
            console.log(err)
            if (err) {
                return res.status(401).json({ authenticated: false, ok: false });
            }
            return res.status(200).json({ authenticated: true, ok: true }); // Send user role if authenticated
        });
    }
    catch (err) {
        console.error("error from isAuthrviated user Api", err.message);
        res.status(401).json({ message: err.message, error: "not authenticated", ok: false });
    }
}


module.exports = {
    getTodo,
    createTodo,
    deleteTodo,
    updateTodo,
    login,
    logout,
    isAuthenticatedUser,
    // refresh
}