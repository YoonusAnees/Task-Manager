import express from 'express';
import '../db/mongoose.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import path from 'path';
import apiAuth from '../middleware/api_auth.js';
import { ObjectId } from 'mongodb';



const router = express.Router();




//========================Routes for html Pages  ===================================================//
router.get("/",(req,res)=>{
    if(req.session.user){
        req.session.user = undefined;  // if user there remove it becuse session is ending
    }
    res.render("index")
});

//when creating uploading images whe should so  create a unique name for the file , Allow only files , Allow only files with th esize fo rhease all doing we need id for it we will tak eit form mongoDB

router.get("/users/profile" , auth,(req,res)=>{


    res.render("profile_setting" ,{user : req.session.user});
});

router.post("/users/profile" , auth,(req,res)=>{
    console.log(req.body);
    console.log(req.files);
    const file = req.files.profile; //saving the file from outer
    // file.mv("./public/images/uploads"+file.name, (err)=>{
    //     if(err){
    //         return res.send({error:err.message});
    //     }
    // });
    const filePath = path.resolve("./public/images/uploads/" + file.name);
    //create a unique name fo rthe file
    const extention = file.name.split('.').pop();
    const fileName = new ObjectId().toString() + "." + extention;

    //Allow only images 
    const allowedFiles = ["png","jpeg","JPEG","JPG","gif"]

    if(!allowedFiles.includes(extention)){
           return  res.send({error:"Please upload image files!"})
    }

    //saving the file from outer //relove method is from path pakkage it makes absolute path
    file.mv(filePath,(e)=>{  //mv has to param one where to and other ine is erro handling // mv means move the file 
        if(e){
            return res.send({error:e.message});
        }
    })

    res.render("profile_setting" ,{user : req.session.user});
});
//========================Login Users ===================================================//


router.post('/api/users/login', async(req,res)=>{
   // Authenticate user  (identifiying user)

//    const user = await User.fineByCredentials(req.body.email ,req.body.password);
 const user = await User.fineByCredentials(req.body.email ,req.body.password);

   if(user){
    req.session.user = user;
    // return res.render("/task")  // it will work
    return res.send(user);
   }

   res.send({error:"Invalid Credential !"})

})

//========================Create Users ===================================================//
router.post("/api/users", async(req,res)=>{
    const user = new User(req.body);
try{
  
    await user.save();
    res.send(user);
} catch (e){
          if(e.code === 11000){
            return res.send({error:"Email already exists"});
          }
          res.send({error:e.message});
}
});


//Read users

//========================Read Users ===================================================//

router.get("/api/users",async(req,res)=>{

try{
    const users = await User.find({});
    if(users){
        return res.send(users);
    }
    res.send({error:"no users found"});
    
}catch(e){
    res.send({error:e.message});
}
})



//========================Read a User ===================================================//

router.get("/api/users/:id",async(req,res)=>{
try {
    const user = await User.findById(req.params.id);
    if(user){
          return res.send(user);
    }

    res.send({error:"user not found"});
   
} catch (e) {
    res.send({error:e.message});
}
});

//========================Update Users ===================================================//

router.patch("/api/users/:id",async(req,res)=>{

const allowedUpdates = ["name","age","password"]
const updates = Object.keys(req.body);
const isValid = updates.every((update)=>{
    return allowedUpdates.includes(update);
});

if(!isValid){
    return res.send({error:"Inavlid Updaets !!!"});
}

try {
    const user = await User.findById(req.params.id);

    if(!user){
        return res.send({error:"unable to update user. User not found!"});
    }

    updates.forEach((update)=>{
        user[update] = req.body[update];
    });
    await user.save();
    res.send(user);
} catch (e) {
     res.send({error: e.message});
}
});

//========================Delete Users ===================================================//

router.delete("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            return res.send({ message: "User deleted successfully." });
        }
        res.send({ error: "User not found." });
        } catch (e) {
            res.send({ error: e.message });

        }})

export default router;
