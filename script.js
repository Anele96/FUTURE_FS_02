let allLeads = [];
let editingId = null;
let statusChart = null;

// CHECK LOGIN
if(localStorage.getItem("isLoggedIn") !== "true") window.location.href="index.html";

// LOAD PROFILE PIC
if(localStorage.getItem("profilePic")){
  document.getElementById("profilePic").src = localStorage.getItem("profilePic");
}

// PROFILE UPLOAD
function openProfileUpload(){
  const input = document.createElement("input");
  input.type = "file"; input.accept = "image/*";
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("profilePic", reader.result);
      document.getElementById("profilePic").src = reader.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// LOGOUT
function logout(){
  localStorage.removeItem("isLoggedIn");
  window.location.href="index.html";
}

// DARK/LIGHT MODE
function toggleDarkMode(){
  document.body.classList.toggle("light-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("light-mode") ? "light":"dark");
}
if(localStorage.getItem("darkMode") === "light") document.body.classList.add("light-mode");

// SHOW SECTION
function showSection(sectionId){
  document.querySelectorAll(".section").forEach(s=>s.style.display="none");
  document.getElementById(sectionId).style.display="block";
}

// LOAD LEADS
if(!localStorage.getItem("leads")) localStorage.setItem("leads","[]");
function loadLeads(){
  allLeads = JSON.parse(localStorage.getItem("leads") || "[]");
  displayLeads(allLeads);
  drawGraph();
}

// DISPLAY LEADS
function displayLeads(leads){
  const tbody = document.getElementById("leadList");
  tbody.innerHTML = "";
  leads.forEach((l,i)=>{
    const avatarHTML = l.avatar ? `<img src="${l.avatar}" class="lead-avatar">` : `<div class="avatar-initials">${l.name.charAt(0)}</div>`;
    tbody.innerHTML += `<tr>
      <td>${avatarHTML}</td>
      <td>${l.name}</td>
      <td>${l.email}</td>
      <td>${l.status}</td>
      <td>${l.notes}</td>
      <td>
        <button onclick="editLead(${i})">✏️ Edit</button>
        <button onclick="deleteLead(${i})">🗑 Delete</button>
      </td>
    </tr>`;
  });
}

// MODAL OPEN/CLOSE
function openModal(){
  editingId=null;
  document.getElementById("modalTitle").innerText="Add Lead";
  document.getElementById("modalName").value="";
  document.getElementById("modalEmail").value="";
  document.getElementById("modalStatus").value="New";
  document.getElementById("modalNotes").value="";
  document.getElementById("modalAvatar").value="";
  document.getElementById("leadModal").style.display="flex";
}
function closeModal(){ document.getElementById("leadModal").style.display="none"; }

// SUBMIT MODAL
function submitModal(){
  const name=document.getElementById("modalName").value.trim();
  const email=document.getElementById("modalEmail").value.trim();
  const status=document.getElementById("modalStatus").value;
  const notes=document.getElementById("modalNotes").value.trim();
  const avatarInput=document.getElementById("modalAvatar");

  if(!name||!email){ alert("Name and Email required!"); return; }
  const leadObj={name,email,status,notes};

  if(avatarInput.files[0]){
    const reader=new FileReader();
    reader.onload=()=>{ leadObj.avatar=reader.result; saveLead(leadObj); };
    reader.readAsDataURL(avatarInput.files[0]);
  }else{
    if(editingId!==null && allLeads[editingId].avatar) leadObj.avatar=allLeads[editingId].avatar;
    saveLead(leadObj);
  }
}

// SAVE LEAD
function saveLead(lead){
  if(editingId!==null) allLeads[editingId]=lead;
  else allLeads.push(lead);
  localStorage.setItem("leads",JSON.stringify(allLeads));
  closeModal();
  loadLeads();
}

// EDIT/DELETE
function editLead(id){
  editingId=id;
  const lead=allLeads[id];
  document.getElementById("modalTitle").innerText="Edit Lead";
  document.getElementById("modalName").value=lead.name;
  document.getElementById("modalEmail").value=lead.email;
  document.getElementById("modalStatus").value=lead.status;
  document.getElementById("modalNotes").value=lead.notes;
  document.getElementById("leadModal").style.display="flex";
}
function deleteLead(id){
  if(confirm("Delete this lead?")){
    allLeads.splice(id,1);
    localStorage.setItem("leads",JSON.stringify(allLeads));
    loadLeads();
  }
}

// SEARCH
function searchLeads(){
  const term=document.getElementById("searchInput").value.toLowerCase();
  displayLeads(allLeads.filter(l=>l.name.toLowerCase().includes(term)||l.email.toLowerCase().includes(term)));
}

// DRAW CHART
function drawGraph(){
  const ctx=document.getElementById("statusChart").getContext("2d");
  const statusCount={New:0,Contacted:0,Converted:0};
  allLeads.forEach(l=>{ if(statusCount[l.status]!==undefined) statusCount[l.status]++; });
  if(statusChart) statusChart.destroy();
  statusChart=new Chart(ctx,{
    type:"bar",
    data:{
      labels:["New","Contacted","Converted"],
      datasets:[{label:"Lead Count", data:[statusCount.New,statusCount.Contacted,statusCount.Converted], backgroundColor:["#3b82f6","#6366f1","#10b981"]}]
    },
    options:{ responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true, precision:0}}}
  });
  cord.addEventListener("click", () => {
  isOn = !isOn;

  lamp.classList.toggle("on");
  loginBox.classList.toggle("show");

  // Show demo box ONLY when login is hidden
  if (isOn) {
    demoBox.style.display = "none";   // hide when login shows
  } else {
    demoBox.style.display = "block";  // show when login hidden
  }
});
}

// INITIAL LOAD
window.onload=loadLeads;