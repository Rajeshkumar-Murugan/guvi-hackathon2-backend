
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken')
const JWTD = require('jwt-decode')

const secret = "ABCD1234"
const hashing = async(value)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(value, salt)
        console.log(salt)
        return hash
     
    } catch (error) {
        return error;
    }
}

const hashcompare = async(password,hashValue)=>{
 try {
    return await bcrypt.compare(password,hashValue) 

 } catch (error) {
     return error
 }
}

const createJWT = async({email})=>{
    return await JWT.sign({
        email
    },
    secret,
    {
        expiresIn:'5m'
    }
    )
}

const authentication = async(token)=>{
    const decode = JWTD(token)
    if(Math.round(new Date()/1000) <= decode.exp)
    {
        console.log(true)
        return {
            email:decode.email,
            validity:true
        }
    }
    else
    {
        return {
            email:decode.email,
            validity:false
        }
    }
    
}

const role = async(req,res,next)=>{
    switch(req.body.role){
        case 1: console.log('Admin')
        res.send({
            message:"Welcome admin"
        })
        next();
        break;
        case 2: console.log('Theater Owner')
        next();
        break;
        case 3: console.log('Customer')
        next();
        break;
        default: res.send({
            message:"Invalid Role"
        })
        break;
    }
    
}

// const rolecheck = async(req,res,next)=>{
//     if(req.body.role==1){
//         res.send({
//             message:"Welcome Admin"
//         })
//         next();
//     }
//     else if(req.body.role==2){
//         res.send({
//             message:"Welcome Merchant"
//         })
    
//     }
//     else if(req.body.role==3){
//         res.send({
//             message:"Welcome Customer"
//         })
    
//     } 
//     else{
//         res.send({
//            message:"Invalid user" 
//         })
//     }
// }
const adminrole = async(req,res,next)=>{
    if(req.body.role==1){
        res.send({
            message:"Welcome Admin"
        })
        next();
    }
    else{
        res.send({
            message:"Permission denied"
        })
    }
}
// const customer = async(req,res,next)=>{
//     if(req.body.role==1){
//         res.send({
//             message:"Welcome Owner"
//         })
//         next();
//     }
//     else{
//         res.send({
//             message:"Permission denied"
//         })
//     }
// }

module.exports={hashing,hashcompare,role, createJWT, authentication, adminrole}