const addbtn =`  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;

const updateBtn = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

const btnSave = ` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Saving Your Updates...`;

const genralLoader = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

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
  toastr.error(message);
}



const showLoader =(selector,content)=>{
  const btn = document.querySelector(selector);
  btn.innerHTML = content;
  btn.disabled = true;
}

const hideLoader = (selector, content) => {
  const btn = document.querySelector(selector);
  if (!btn) return; // Skip if element doesn't exist
  btn.innerHTML = content;
  btn.disabled = false;
};
