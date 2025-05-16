import express from 'express';
import '../db/mongoose.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import sendEmail from "../utils/email.js";





const router = express.Router();




//========================Routes for html Pages  ===================================================//
router.get("/", (req, res) => {
    if (req.session.user) {
        req.session.user = undefined;  // if user there remove it becuse session is ending
    }
    res.render("index")
});

//signup

router.get("/signup", (req, res) => {

    res.render("signup")
});

router.get("/confirm_email", async (req, res) => {
    console.log("confirm email route")
    const userId = req.query.userid;
    //  res.redirect("/");
    try {
        const user = await User.findByIdAndUpdate(userId,
            { isEmailValidator: true },
            { new: true }
        )

        if (user) {
            return res.redirect("/") // if user exist do this
        }


    } catch (e) {
        res.redirect("/?error=" + e.message)
    }
});

//when creating uploading images whe should so  create a unique name for the file , Allow only files , Allow only files with th esize fo rhease all doing we need id for it we will tak eit form mongoDB

router.get("/users/profile", auth, (req, res) => {


    res.render("profile_setting", { user: req.session.user });
});

// router.post("/users/profile" , auth, async(req,res)=>{
// console.log(req.body);
// console.log(req.files);
// User.uploadAvatar(req.files.profile);

// if(req.files){ //if there is a file we can uplaod (user upload a image)
//     const resutl =  await User.uploadAvatar(req.files.profile)

//     if(resutl.error){
//         return res.send({error:resutl.error})
//     } //if there is no errro we need filename but we arent not getting by req.body so thath we can dymantically get filename

//  req.body.imagePath = resutl.fileName;

// }

// const allowedUpdates = ["name","age","password","email","imagePath"]
// const updates = Object.keys(req.body);
// const isValid = updates.every((update)=>{
//     return allowedUpdates.includes(update);
// });

// if(!isValid){
//     return res.send({error:"Inavlid Updaets !!!"});
// }

// try {
//     // const user = await User.findById(req.params.id); //early we dont have authantication so we did like this now we have 
//     const user = await User.findById(req.session.user._id);
//     if(!user){
//         return res.send({error:"unable to update user. User not found!"});
//     }

//     updates.forEach((update)=>{
//         user[update] = req.body[update];
//     });
//     await user.save();
//     // res.send(user); //sending the user to client
//     res.redirect("/users/profile")
// } catch (e) {
//      res.send({error: e.message});
// }

// try {
//     const updates = Object.keys(req.body); //finiding out the fileds that  user trying to update

//     //set the allowed updates

//     const allowedUpdates = ["name","age","password","email","imagePath"];
//     const isValid = updates.every((update)=>{
//         return allowedUpdates.includes(update);
//     }); 

//     if(!isValid){
//         return res.send({error:"Inavlid Updaets !!!"});
//     }
//     const user = await User.findById(req.session.user._id);

//     if(!user){
//         return res.send({error:"unable to update user. User not found!"});
//     }

//     updates.forEach((update)=>{
//         user[update] = req.body[update];
//     });

//     await user.save();
//     res.redirect("/users/profile")
// } catch (error) {
//     res.send({error:error.message});
// }






// const file = req.files.profile; //saving the file from outer
// // file.mv("./public/images/uploads"+file.name, (err)=>{
// //     if(err){
// //         return res.send({error:err.message}); 
// //     }
// // });

// //create a unique name fo rthe file
// const extention = file.name.split('.').pop();
// const fileName = new ObjectId().toString() + "." + extention;

// //Allow only images 
// const allowedFiles = ["png","jpeg","JPEG","JPG","gif"]

// if(!allowedFiles.includes(extention)){
//        return  res.send({error:"Please upload image files!"})
// }

// //Image Sizes  //file transfering in bytes 1bytes- 8bit

//  const sizeLimit = 5 * 1024 * 1024 * 1024 ; //5GB

//  if(file.size > sizeLimit){
//     return res.send({error:"File size is too large!"})
//  }
// //saving the file from outer //relove method is from path pakkage it makes absolute path
//     const filePath = path.resolve("./public/images/uploads/" + fileName);
// file.mv(filePath,(e)=>{  //mv has to param one where to and other ine is erro handling // mv means move the file 
//     if(e){
//         return res.send({error:e.message});
//     }
// })

// res.render("profile_setting" ,{user : req.session.user});
// });
// router.post("/users/profile", auth, async (req, res) => {   this is just by form old methos below we made wuth js

//         if (req.files) {
//             const result = await User.uploadAvatar(req.files.profile);
//             if (result.error) {
//                 return res.send({ error: result.error });
//             }
//             req.body.imagePath = result.fileName;
//         }
//         try {

//         const updates = Object.keys(req.body);
//         const allowedUpdates = ["name", "age", "password", "email", "imagePath"];
//         const isValid = updates.every((update) => {
//        return allowedUpdates.includes(update)});

//         if (!isValid) {
//             return res.send({ error: "Invalid Updates!" }); // fixed typo 
//         }

//         const user = await User.findById(req.session.user._id);
//         const previousImagepath = user.imagePath; // we got the previous image path
//         if (!user) {
//             return res.send({ error: "Unable to update user. User not found!" });
//         }

//         updates.forEach((update) => {
//             user[update] = req.body[update]
//         });

//         await user.save();
//         req.session.user = user;
//         res.redirect("/users/profile");

//         if(req.body.imagePath && previousImagepath !== "profile.png"){  // here first we identifiyng whter user upload the omage and it isnt default imahe we arer deleting 

//             User.revomeAvatar(previousImagepath)
//         }



//     } catch (error) {
//         // console.log(error);
//         return res.send({ error: error.message });
//     }
// });

//sessoin isnt connected to the database

//========================Login Users ===================================================//


router.post('/api/users/login', async (req, res) => {
    // Authenticate user  (identifiying user)

    try {
        //    const user = await User.fineByCredentials(req.body.email ,req.body.password);
        const user = await User.fineByCredentials(req.body.email, req.body.password); //cheachikng whtger email password available


        if (user) {
            if (user.isEmailValidator) {
                req.session.user = user;
                return res.send(user);
            }

            return res.send({ error: "Please Confirm Your Password" })
        }



        res.send({ error: "Invalid Credential !" })


    } catch (e) {
        return res.send({ error: e.message })
    }
})

//========================Create Users ===================================================//
router.post("/api/users", async (req, res) => {
    const user = new User(req.body);
    try {

        await user.save();
        //send confirm email to user
        sendEmail({
            receiver: user.email,
            subject: "Confirm your  Email",
            content: `<p>Please Click The below link to confirm your email !</p>
        <a href="http://localhost:3000/confirm_email?userid=${user._id}">Confirm Email</a>`
        });


        res.send(user);
    } catch (e) {
        if (e.code === 11000) {
            return res.send({ error: "Email already exists" });
        }
        res.send({ error: e.message });
    }
});


//Read users

//========================Read Users ===================================================//

router.get("/api/users", async (req, res) => {

    try {
        const users = await User.find({});
        if (users) {
            return res.send(users);
        }
        res.send({ error: "no users found" });

    } catch (e) {
        res.send({ error: e.message });
    }
})



//========================Read a User ===================================================//

router.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            return res.send(user);
        }

        res.send({ error: "user not found" });

    } catch (e) {
        res.send({ error: e.message });
    }
});

//========================Update Users ===================================================//

// router.patch("/api/users/:id",async(req,res)=>{

// const allowedUpdates = ["name","age","password"]
// const updates = Object.keys(req.body);
// const isValid = updates.every((update)=>{
//     return allowedUpdates.includes(update);
// });

// if(!isValid){
//     return res.send({error:"Inavlid Updaets !!!"});
// }

// try {
//     const user = await User.findById(req.params.id);

//     if(!user){
//         return res.send({error:"unable to update user. User not found!"});
//     }

//     updates.forEach((update)=>{
//         user[update] = req.body[update];
//     });
//     await user.save();
//     res.send(user);
// } catch (e) {
//      res.send({error: e.message});
// }
// }); // if we have session we dont need ID


// router.patch("/api/users", async (req, res) => {



//     try {

//         if (req.files) {
//             const result = await User.uploadAvatar(req.files.profile);
//             if (result.error) {
//                 return res.send({ error: result.error });
//             }
//             req.body.imagePath = result.fileName;
//         }


//         const updates = Object.keys(req.body);
//         const allowedUpdates = ["name", "email", "password", "age", "imagePath"];

//         const isValid = updates.every((update) => {
//             return allowedUpdates.includes(update);
//         });

//         if (!isValid) {
            
//             return res.send({ error: "Inavlid Updaets !!!" });
//         }


//         const user = await User.findById(req.session.user._id);
//         const previousImagePath = user.imagePath; // we got the previous image path


//         if (!user) {
//             console.log(user);
//             return res.send({ error: "unable to update user. User not found!" });
            
//         }

//         updates.forEach((update) => {
//             user[update] = req.body[update];
//         });
//         await user.save();
//         req.session.user = user;
//         res.send(user);

//         if (req.body.imagePath && previousImagePath !== "profile.png") {  // here first we identifiyng whter user upload the omage and it isnt default imahe we arer deleting 

//             User.removeAvatar(previousImagePath);
//         }


//     } catch (e) {
//         res.send({ error: e.message });
//     }
// });


router.patch("/api/users", async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.send({ error: "User not found" });
        }

        const previousImagePath = user.imagePath;
        let newImagePath = null;

        // Handle file upload
        if (req.files && req.files.profile) {
            const result = await User.uploadAvatar(req.files.profile);
            if (result.error) return res.send({ error: result.error });
            req.body.imagePath = result.fileName;
            newImagePath = result.fileName;
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ["name", "email", "password", "age", "imagePath"];
        const isValid = updates.every(update => allowedUpdates.includes(update));
        if (!isValid) return res.send({ error: "Invalid Updates!" });

        updates.forEach(update => {
            user[update] = req.body[update];
        });

        await user.save();
        req.session.user = user;

        if (newImagePath && previousImagePath !== "profile.png") {
            User.removeAvatar(previousImagePath);
        }

        return res.send(user);
    } catch (e) {
        return res.send({ error: e.message });
    }
});




// router.patch("/api/users", async (req, res) => {
//   try {
//     // Handle file upload
//     if (req.files) {
//       const result = await User.uploadAvatar(req.files.profile);
//       if (result.error) {
//         return res.send({ error: result.error });
//       }
//       req.body.imagePath = result.fileName;
//     }

//     const updates = Object.keys(req.body);
//     const allowedUpdates = ["name", "age", "password", "email", "imagePath"];
//     const isValid = updates.every((update) => allowedUpdates.includes(update));

//     if (!isValid) {
//       return res.send({ error: "Invalid Updates !!!" });
//     }

//     const user = await User.findById(req.session.user._id);
//     if (!user) {
//       return res.send({ error: "Unable to update user. User not found!" });
//     }

//     const previousImagePath = user.imagePath;

//     updates.forEach((update) => {
//       user[update] = req.body[update];
//     });

//     await user.save();
//     req.session.user = user;

//     // Remove old image if updated
//     if (req.body.imagePath && previousImagePath !== "profile.png") {
//       await User.revomeAvatar(previousImagePath); // <-- make sure this is awaited if it's async
//     }

//     return res.send(user); // ✅ Only one response

//   } catch (e) {
//     return res.send({ error: e.message });
//   }
// });

// if we have session we dont need ID





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

    }
})

export default router;

//if the  rror came like cannot set haders after they are sent to the clinet means we made response twice