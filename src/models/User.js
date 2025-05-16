import validator from 'validator';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import path from 'path';
import { type } from 'os';
import fs from 'fs';
// import { ObjectId } from 'mongodb';
const ObjectId = mongoose.Types.ObjectId;

//schema is plane like before we did mdel but we cannot access inside but now we can able to do
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,   
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    imagePath:{
        type:String,
        default:"profile.png"
    },
    isEmailValidator:{
        type:Boolean,
        default:false
    }
});

userSchema.pre('save', async function (next) {
    // const user = this;
    // console.log('just before saving!');
    // next();
    if(this.isModified('password')){ // why this means if user updates except password  agin pasword is alos hasjoing to avoid thath we do this 
      this.password = await bcrypt.hash(this.password, 8);
    }
       
        next();

});

userSchema.statics.fineByCredentials = async (email , password) => {
  const user = await User.findOne({email:email});//finiding user with email

    if(!user){
    return ("undefined");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(isMatch){
    return user;
  
  }

  return undefined; // why here undefined means if we give propopper error message it easy to hacke and all

}

userSchema.statics.uploadAvatar = async(file)=>{
    // file.mv("./public/images/uploads"+file.name, (err)=>{
    //     if(err){
    //         return res.send({error:err.message}); 
    //     }
    // });

    //create a unique name fo rthe file
    const extention = file.name.split('.').pop();
    const fileName = new ObjectId().toString() + "." + extention;
 
    //Allow only images 
    const allowedFiles = ["png","jpeg","JPEG","JPG","gif"]

    if(!allowedFiles.includes(extention)){
           return  {error:"Please upload image files!"}
    }

    //Image Sizes  //file transfering in bytes 1bytes- 8bit
  
     const sizeLimit = 5 * 1024 * 1024 * 1024 ; //5GB

     if(file.size > sizeLimit){
        return {error:"File size is too large!"}
     }
    //saving the file from outer //relove method is from path pakkage it makes absolute path
        const filePath = path.resolve("./public/images/uploads/" + fileName);
      try {
         await  file.mv(filePath);
         return {fileName:fileName}; //then only we can target the fielname
    
      } catch (error) {
        return {error:error.message};
      }
}

// userSchema.statics.deleteFile = async (fileName)=>{
//     const filePath = path.resolve("./public/images/uploads/" + fileName);
//     const fs = require('fs');
//     fs.unlink(filePath, (err)=>{
//         if(err){
//             console.log(err);
//             return;
//         }
//     });
// }

// userSchema.statics.revomeAvatar =(file)=>{
//     const filePath = path.resolve("./public/images/uploads/" + fileName);
//   fs.unlinkSync(filePath, (e)=>{  //romev a file
//           if(e){
//             console.log(e);
//           }
  
          
//   });
// }

userSchema.statics.removeAvatar = (fileName) => {
    const filePath = path.resolve("./public/images/uploads/" + fileName);
    try {
        fs.unlinkSync(filePath);  // remove file synchronously
    } catch (err) {
        console.log("Failed to delete file:", err.message);
    }
};


//save is functiion 
// next is make to wait untill it hashed

const User = mongoose.model('User', userSchema);
//why we doing this means we want to our own congiguration in order to that we need to access to the plane (schema) 
// to i dentify the user we do 
export default User;