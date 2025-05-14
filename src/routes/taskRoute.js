import express from 'express';
import Task from '../models/Task.js';
import '../db/mongoose.js';
import auth from '../middleware/auth.js';
import apiAuth from '../middleware/api_auth.js';
 import session from 'express-session'; //its all in middleware
const router = express.Router();


//Interface//

router.get("/task", auth  , (req,res)=>{

 // console.log(req.sessionID);// id of the session 
    console.log(req.session.user);
    res.render("task",{user:req.session.user}) // it for seein gthe user name in the nav bar
})


// End point of API
//create task
router.post("/api/tasks", apiAuth,async(req,res)=>{
    const task = new Task(req.body);
   setTimeout(async() => {
    try {
        const userId = req.session.user._id;  //saving the id propert to make relationship for the user (its comnes with session id)
        task.owner = userId;
        await task.save();
        res.send(task);
        
    } catch (e) {
        res.send({error:e.message});
    }
   }, 2000);
});


/// Read Task
 // const task = await Task.find({});
        // if(task){

        //     return res.send(task)
        // }


// router.get("/api/tasks",async(req,res)=>{
//     const search = req.query.search;
//     var tasks =[];
//     try {
//         if(search){
//             tasks = await Task.find({description:search});
//         }
//         else{
//             tasks = await Task.find({});
//         }
         


//         res.send({error:"No Tasks Available"})
        
//     } catch (e) {
//         res.send({error:e.message})
//     }
// });

// Get All taskss resoureces
router.get("/api/tasks",apiAuth, async (req, res) => {
    const search = req.query.search;
    try {
        var tasks =[];
        // const userId = req.session.user._id; // this will work byt we can do this in middleware
        if (search) {
            tasks = await Task.find(
                { 
                owner :req.userId,
                description: { $regex: search , $options:"i"} });
        } else {
            tasks = await Task.find({owner:req.userId});
        }

        // Return tasks, even if empty
        res.send(tasks);

    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});


//Read a task

router.get("/api/tasks/:id",apiAuth,async(req,res)=>{
    const id = req.params.id;
    try {
        const task = await Task.findOne({owner:req.userId,_id:id});
        if(task){
            return res.send(task);
        }

         res.send({error:"No Task Available"});
    } catch (e) {
        res.send({error:e.message})
        
    }
});

// Update a task
router.patch("/api/tasks/:id", apiAuth,async (req, res) => {
    setTimeout(async() => {
        try {
            const task = await Task.findOneAndUpdate(    // only those people owns this task will able to get
                {owner:req.userId,_id:req.params.id},
                 req.body, 
                 { new: true });


        if (!task) {
                return res.send({ error: "Task not found" });
            }
            res.send(task);
        } catch (e) { res.send({ error: e.message }); }
    }, 2000); });

    // Delete a task

router.delete("/api/tasks/:id",apiAuth, async (req, res) => {
    
   setTimeout(async() => {
    const id =req.params.id;
     try {
        const task = await Task.findOneAndDelete({   // only those people owns this task will able to delete
            owner:req.userId,// only those people owns this task will able to delete
            _id:id
        });

        if (!task) {
            return res.status(404).send({ error: "Task not found" });
        }

        res.send({ message: "Task deleted successfully", task });
    }
     catch (e) {
        
        res.send({ error: e.message });
    }
   }, 2000);
});

export default router;
