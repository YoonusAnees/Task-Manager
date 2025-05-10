import express from 'express';
import '../db/mongoose.js';
import User from '../models/User.js';
const router = express.Router();



//========================Login Users ===================================================//


router.post('/api/users/login', async(req,res)=>{
   // Authenticate user  (identifiying user)

   const user = await User.fineByCredentials(req.body.email ,req.body.password);
   if(user){
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
