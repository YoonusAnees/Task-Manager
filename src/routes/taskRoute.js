import express from 'express';
import Task from '../models/Task.js';
import '../db/mongoose.js';
const router = express.Router();


//Interface//

router.get("/task",(req,res)=>{
    res.render("task")
})


// End point of API

router.post("/api/tasks",async(req,res)=>{
    const task = new Task(req.body);
   setTimeout(async() => {
    try {
        await task.save();
        res.send(task);
        
    } catch (e) {
        res.send({error:message});
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

router.get("/api/tasks", async (req, res) => {
    const search = req.query.search;
    try {
        let tasks;
        if (search) {
            tasks = await Task.find({ description: { $regex: search } });
        } else {
            tasks = await Task.find({});
        }

        // Return tasks, even if empty
        res.send(tasks);

    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});


//Read a task

router.get("/api/tasks/:id",async(req,res)=>{
    try {
        const task = await Task.findById(req.params.id);
        if(task){
            return res.send(task);
        }

         res.send({error:"No Task Available"});
    } catch (e) {
        res.send({error:e.message})
        
    }
});

// Update a task
router.patch("/api/tasks/:id", async (req, res) => {
    setTimeout(async() => {
        try {
            const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
                return res.send({ error: "Task not found" });
            }
            res.send(task);
        } catch (e) { res.send({ error: e.message }); }
    }, 2000); });

    // Delete a task

router.delete("/api/tasks/:id", async (req, res) => {
    
   setTimeout(async() => {
     try {
        const task = await Task.findByIdAndDelete(req.params.id);

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
