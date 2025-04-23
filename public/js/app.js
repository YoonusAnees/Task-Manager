

const getTask = async(req,res)=>{
    const url = "/api/tasks";

    try {

        const response = await fetch(url)
        const tasks = await response.json();
    
        var taskHtml = "";
        tasks.forEach((task)=>{
            taskHtml+= taskComponent(task);
        });
    
        $(".task-container").html(taskHtml)
        
    } catch (e) {
        alert("Somthing went wrong inable to fetch tasks")
    }
  

}

// const createTask= async()=>{
//   const url = "/api/tasks";
//   const data = {
//     description: $("#description").val(),
//     completed: document.querySelector('#completed').checked
//   }
//   try {
//     const response = await fetch(url,{
//         method:"POST",
//         headers:{
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     });

//     const task =await response.json();
//     const taskHtml = `
//       <div class="task-card">
//             <h4>${task.description}</h4>
    
//             <div class="task-action">
//                 <button class="btn btn-primary btn-sm"><i class="fas fa-user-edit"></i></button>
//                 <button class="btn btn-danger btn-sm"><i class="fas fa-user-times"></i></button>
//             </div>
//         </div>
    
//     </div>`;

//     $(".task-container").append(taskHtml);
//   } catch (e) {
//     alert("Somthing went wrong unable to create a new task")
//   }
// }

const createTask = async () => {
    const url = "/api/tasks";
    const data = {
      description: $("#description").val(),
      completed: document.querySelector('#completed').checked
    }

    if (data.description.length < 1) {
      return $("#desription-error").css("display","block")
    }
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      const task = await response.json();

      
      
      // if(task.error){
      //   return alert(task.error);
      // }


      const taskHtml = taskComponent(task);
  
      $(".task-container").prepend(taskHtml); // show at top
  
      // ✅ Clear input and checkbox
      $("#description").val("");
      $("#completed").prop("checked", false);
  
      // ✅ Hide modal
      $("#create-model").modal("hide");
  
    } catch (e) {
      alert("Something went wrong, unable to create a new task");
    }
  }


const initialUpdateTask = async (id)=>{
  const url = "/api/tasks/" + id;

  try {
     const response = await fetch(url);
     const task = await response.json();

     if(task.error){
       return alert(task.error);    
     }

     $("#updateDescription").val(task.description);
    //  $("#updateCompleted").prop("checked", task.completed);
    document.querySelector("#updateCompleted").checked = task.completed;



    $("#updateModel").modal();

    
  } catch (e) {
    alert("An error occurred while updating the task.");
  }

 
}

const updateTask = async () => {
  const id = $("#updateModel").data("id"); // get task ID stored in modal

  const url = "/api/tasks/" + id;
  const data = {
    description: $("#updateDescription").val(),
    completed: document.querySelector("#updateCompleted").checked
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const updatedTask = await response.json();

    if (updatedTask.error) {
      return alert(updatedTask.error);
    }

    // Refresh task list
    getTask();

    // Hide modal
    $("#updateModel").modal("hide");

  } catch (e) {
    alert("Something went wrong while updating the task.");
  }
};

  

const taskComponent = (task)=>{
return ` <div class="task-card">
          <h4>${task.description}</h4>
          <div class="task-action">
              <button class="btn btn-primary btn-sm" onclick="initialUpdateTask('${task._id}')"><i class="fas fa-user-edit"></i></button>
              <button class="btn btn-danger btn-sm"><i class="fas fa-user-times"></i></button>
          </div>
        </div> `;
}

getTask();



const createForm = $("#create-form");
const updateForm = $("#update-form");

createForm.validate({
  rules: {
    description: {
      required: true,
      minlength: 5
    }
  }
});

updateForm.validate({
  rules: {
    updateDescription: {
      required: true,
      minlength: 5
    }
  }
});


createForm.on("submit",(e)=>{
  e.preventDefault();
  // createTask();

  if(createForm.valid()){
    createTask();
  }
});


updateForm.on("submit", (e) => {
  e.preventDefault();

  if (updateForm.valid()) {
    updateTask();
  }
}); 



