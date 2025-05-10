import validator from 'validator';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

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




//save is functiion 
// next is make to wait untill it hashed

const User = mongoose.model('User', userSchema);
//why we doing this means we want to our own congiguration in order to that we need to access to the plane (schema) 
// to i dentify the user we do 
export default User;