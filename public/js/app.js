

const getTask = async(req,res)=>{
    const url = "/api/tasks";

    try {

        const response = await fetch(url)
        const tasks = await response.json();
    
        var taskHtml = "";
        tasks.forEach((task)=>{
            taskHtml+=`
              <div class="task-card">
            <h4>${task.description}</h4>
    
            <div class="task-action">
                <button class="btn btn-primary btn-sm"><i class="fas fa-user-edit"></i></button>
                <button class="btn btn-danger btn-sm"><i class="fas fa-user-times"></i></button>
            </div>
        </div>
    
    </div>
            `;
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
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      const task = await response.json();
      const taskHtml = `
        <div class="task-card">
          <h4>${task.description}</h4>
          <div class="task-action">
              <button class="btn btn-primary btn-sm"><i class="fas fa-user-edit"></i></button>
              <button class="btn btn-danger btn-sm"><i class="fas fa-user-times"></i></button>
          </div>
        </div>`;
  
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
  

getTask();


const createForm = $("#create-form");
createForm.on("submit",(e)=>{
  e.preventDefault();
  createTask();
})

