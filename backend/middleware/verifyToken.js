import  jwt  from "jsonwebtoken"


export const verifyToken = (req , res , next)=>{

    const token = req.cookies.token

    try{
        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });        }
        
        const decode = jwt.verify(token,process.env.JWT_SECRET)


        if(!decode){
            return res.status(401).json({ success: false, message: "Invalid token" });        

        }
        
        req.userId = decode.userId;
        next()



    }catch(err){
        res.status(500).json({success : false , message : 'token verification failed', err: err.message })


    }


}