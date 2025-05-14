



const getTask = async(search)=>{
    var url = "/api/tasks";
   
    if (search){
       const cleanedSearch = search.trim();
       if(cleanedSearch !=""){
        url = url + "?search=" + search;
       }
    }
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

// const getTask= async(search)=>{
//   const url = "/api/tasks";

//    if (search){
//       url = url + "?search" + search;
//     }

//     console.log(url);
 
//   try {
//     const response = await fetch(url);
//     const tasks =await response.json();
//     const taskHtml = "";

//     tasks.forEach(task=>{
//       taskHtml+= taskComponent(task);
//     })
     

//     $(".task-container").html(taskHtml);
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
    

  
    } catch (e) {
     ShowError("An error occurred while creating the task.")
    }
    finally{
      hideLoader("#create-btn",intitialContent);
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

   const intitialContentSave = $(".btnSaving").html();
   showLoader(".btnSaving", btnSave);
  
  const btnSelectorupdate ="#task-"+taskId + "  .btnUpdate";
  const intitialContent = $().html(btnSelectorupdate);
  showLoader(btnSelectorupdate,updateBtn);
 

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
    
   


  } catch (e) {
    ShowError("An error occurred while updating the task.");
  }
  finally{    
    hideLoader(".btnSaving", intitialContentSave);
    hideLoader(btnSelectorupdate, intitialContent);
  }
};


const deleteTask = async (id) => {
  const url = "/api/tasks/" + id;

  const btnSelector = "#task-" + id + " .deleteBtn";
  const intitialContent = $(btnSelector).html();  
  showLoader(btnSelector, genralLoader);


  try {
    const response = await fetch(url, {
      method: "DELETE"
    });

    const task = await response.json();

    if (task.error) {
      return ShowError(task.error);
    }

    $("#task-" + id).remove();

    showSuccess("Task Deleted Successfully!");

  } catch (e) {
    ShowError("An error occurred while deleting the task.");
  }
  finally{
    hideLoader(btnSelector, intitialContent);
  
  }
};

const initiateDelete = (id)=>{
swal({
  title: "Are you sure?",
  text: "Once deleted, you will not be able to recover this rocrd!",
  icon: "warning",
  buttons: true,
  dangerMode: true,
}).then((willDelete) => {
  if (willDelete) {
    deleteTask(id);
  } else {
    swal("Your  Record is safe!");
  }
});

}


  

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
          <button class="btn btn-primary btn-sm btnUpdate " id="updatebtn" onclick="initialUpdateTask('${task._id}')">
            <i class="fas fa-user-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm deleteBtn" onclick="initiateDelete('${task._id}')">
            <i class="fas fa-user-times"></i>
          </button>
        </div>
      </div>
    `;
  };
  



getTask();



const createForm = $("#create-form");
const updateForm = $("#update-form");
const searchForm = $("#search-form");
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


searchForm.on('submit', (e)=>{
  e.preventDefault();
  const search = $("#search-input").val();
  getTask(search);


})

// console.log(createForm[0])
// createForm[0].reset();


//  const searchValue = $('#search').val().trim();

//   if(searchValue.length>0){
//     getTask(searchValue);
//   }else{
//     getTask();
//   }