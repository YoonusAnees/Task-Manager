const auth =(req,res,next)=>{

    if(req.session.user){
        req.userId = req.session.user._id;
        return next();  //we must retun the next
    
    }

     return res.send({error:"Your not authorized to access this data ! "});



}    //this is for session handling for all 

export default auth;

//reqesnt do to not pass the data //