const jwt = require('jsonwebtoken');



const verifyTokenMiddleware = async (req, res, next)=>{
   
   try{
    if (!req.cookies || !req.cookies.demoaccessToken) {
        return res.status(401).json({ message: "Access denied. No token provided please loign again.", ok: false });
    }
    // console.log("req.cookies:  ", req.cookies)

    let isUserdemotoken = req.cookies.demoaccessToken

    if(!isUserdemotoken){
        throw new Error("please login")
    }

      const decoded = jwt.verify(isUserdemotoken, process.env.JWT_SECRET);
        
            req.user = decoded;
            next();
        }
        catch (err) {
            console.log(err.message)
            res.status(401).json({ error: "No token provided", message: err.message, ok: false });
        }
}


module.exports = {verifyTokenMiddleware}