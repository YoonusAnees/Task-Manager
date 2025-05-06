const addbtn =`  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;

const updateBtn = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

const btnSave = ` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Saving Your Updates...`;



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
        ShowError(e.message);
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

    // document.querySelector(".error").classList.remove("error");
  
    
    hideModel("#create-model");
    createForm[0].reset();
    const intitialContent = $("#create-btn").html();
    showLoader("#create-btn",addbtn);


    // if (data.description.length < 1) {
    //   return $("#desription-error").css("display","block")
    // }
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      const task = await response.json();

      
      
      if(task.error){
        return ShowError(task.error)
      }


      const taskHtml = taskComponent(task);
  
      $(".task-container").prepend(taskHtml); // show at top appending
  
      // // ✅ Clear input and checkbox
      $("#description").val("");
      $("#completed").prop("checked", false);
  
      // ✅ Hide modal
      hideModel("#create-model");

      // const taskContainer = $(".task-container");
      // taskContainer.innerHTML=taskHtml+taskContainer.innerHTML;

   

    showSuccess("Task Added Successfully");
    hideLoader("#create-btn",intitialContent);

  
    } catch (e) {
     ShowError("An error occurred while creating the task.")
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
    document.querySelector("#taskId").value=task._id;

    showModel("#updateModel");

    
  } catch (e) {
    alert("An error occurred while updating the task.");
  }

 
}

// const updateTask = async () => {
//   // const id = $("#updateModel").data("id"); // get task ID stored in modal
//   const taskId = document.querySelector("#taskId").value;

//   const url = "/api/tasks/" + taskId;
//   const data = {
//     description: $("#updateDescription").val(),
//     completed: document.querySelector("#updateCompleted").checked
//   };




//   try {
//     const response = await fetch(url, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(data)
//     });

//     const task = await response.json();

//     if (task.error) {
//       return ShowError(task.error);
//     }

//     $("#task-" + taskId + " h4").text(task.description);
//     $("#completed-" + taskId + "  .com").text(task.completed);


//     // // Refresh task list
//     getTask();

//     // // Hide modal
//     $("#updateModel").modal("hide");

    
//     showSuccess("Task Updated");


//     // const taskHtml = taskComponent(updatedTask);
//     // const taskContainer = $(".task-container");
//     // taskContainer.innerHTML=taskContainer.innerHTML+taskHtml;


//   } catch (e) {
//    ShowError("An error occurred while updating the task.");
//   }
// };



const updateTask = async () => {
  const taskId = document.querySelector("#taskId").value;
  const url = "/api/tasks/" + taskId;

  const data = {
    description: $("#updateDescription").val(),
    completed: document.querySelector("#updateCompleted").checked
  };

  $("#updateModel").modal("hide");

  const intitialContent = $("#updatebtn").html();
  showLoader("#updatebtn",updateBtn);

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const task = await response.json();

    if (task.error) {
      return ShowError(task.error);
    }

    // Update task description
    $("#task-" + taskId + " h4").text(task.description);

    // Update completed status text
    $("#completed-" + taskId).text(task.completed ? "Completed" : "Not Completed");

    // Refresh task list (optional if you want a fresh load)
    getTask();

    // Hide modal
  

    // Show success message
    showSuccess("Task Updated Successfully!");
    hideLoader("#updatebtn", intitialContent);


  } catch (e) {
    ShowError("An error occurred while updating the task.");
  }
};



  

  const taskComponent = (task) => {
    return `
      <div class="task-card" id="task-${task._id}">
        <div>
          <h4>${task.description}</h4>
          <div id="completed-${task._id}" class="com badge ${task.completed ? 'bg-success' : 'bg-danger'}">
             ${task.completed ? "Completed" : "Not Completed"}
                   </div>

        </div>
  
        <div class="task-action">
          <button class="btn btn-primary btn-sm " id="updatebtn" onclick="initialUpdateTask('${task._id}')">
            <i class="fas fa-user-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm"  id="deletebtn">
            <i class="fas fa-user-times"></i>
          </button>
        </div>
      </div>
    `;
  };
  

const showModel = (selector)=>{
  
  $("label.error").hide();
  $(".error").removeClass("error");
  $(selector).modal("show");
   
}

const hideModel =(Selector)=>{
  $(Selector).modal("hide");
}


const showSuccess = (message) =>{
  toastr.success(message);
}

const ShowError = (message) =>{
  toastr.error(message);}



const showLoader =(selector,content)=>{
  const btn = document.querySelector(selector);
  btn.innerHTML = content;
  btn.disabled = true;
}

const hideLoader =(selector, content)=>{
  const btn = document.querySelector(selector);
  btn.innerHTML = content;
  btn.disabled = false;
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

// console.log(createForm[0])
// createForm[0].reset();
