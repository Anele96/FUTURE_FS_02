let allLeads = [];
let editingId = null;
let leadChart;

// Show Toast Notification
function showToast(message, type="success") {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.innerText = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.remove();
    }, 2500);
}

// Load Leads from server
async function loadLeads() {
    const res = await fetch("http://localhost:5000/leads");
    allLeads = await res.json();
    updateDashboard();
    displayLeads(allLeads);
    updateChart();
}

// Add or Update Lead
async function addLead() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const status = document.getElementById("status").value;
    const notes = document.getElementById("notes").value;

    if(!name || !email){
        alert("Please enter name and email");
        return;
    }

    if(editingId) {
        // Update Lead
        await fetch(`http://localhost:5000/leads/${editingId}`, {
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({name,email,status,notes})
        });
        showToast("Lead updated!", "update");
        editingId = null;
        document.getElementById("submitBtn").innerText = "Add Lead";
        document.getElementById("submitBtn").classList.remove("update");
        document.getElementById("submitBtn").classList.add("add");
    } else {
        // Add Lead
        await fetch("http://localhost:5000/leads",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({name,email,status,notes})
        });
        showToast("Lead added!", "success");
    }

    clearForm();
    loadLeads();
}

// Clear Form
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("notes").value = "";
    document.getElementById("status").value = "new";
}

// Display Leads
function displayLeads(leads) {
    const list = document.getElementById("leadList");
    list.innerHTML = "";
    leads.forEach(lead => {
        list.innerHTML += `
        <tr>
            <td>${lead.name}</td>
            <td>${lead.email}</td>
            <td>${lead.status}</td>
            <td>${lead.notes}</td>
            <td>
                <button class="edit" onclick="editLead('${lead._id}')">Edit</button>
                <button class="delete" onclick="deleteLead('${lead._id}')">Delete</button>
            </td>
        </tr>`;
    });
}

// Edit Lead
function editLead(id) {
    const lead = allLeads.find(l => l._id === id);
    document.getElementById("name").value = lead.name;
    document.getElementById("email").value = lead.email;
    document.getElementById("notes").value = lead.notes;
    document.getElementById("status").value = lead.status;
    editingId = id;
    document.getElementById("submitBtn").innerText = "Update Lead";
    document.getElementById("submitBtn").classList.remove("add");
    document.getElementById("submitBtn").classList.add("update");
}

// Delete Lead
async function deleteLead(id){
    await fetch(`http://localhost:5000/leads/${id}`,{method:"DELETE"});
    showToast("Lead deleted!", "delete");
    loadLeads();
}

// Filter Leads
function filterLeads(){
    const filter = document.getElementById("filter").value;
    if(filter === "all") displayLeads(allLeads);
    else displayLeads(allLeads.filter(l => l.status === filter));
}

// Update Dashboard Counts
function updateDashboard(){
    let newCount = 0, contactedCount = 0, convertedCount = 0;
    allLeads.forEach(l => {
        if(l.status==="new") newCount++;
        if(l.status==="contacted") contactedCount++;
        if(l.status==="converted") convertedCount++;
    });
    document.getElementById("newCount").innerText = newCount;
    document.getElementById("contactedCount").innerText = contactedCount;
    document.getElementById("convertedCount").innerText = convertedCount;
}

// Update Chart
function updateChart() {
    const ctx = document.getElementById('leadChart').getContext('2d');
    const data = {
        labels: ['New','Contacted','Converted'],
        datasets: [{
            label: 'Number of Leads',
            data: [
                allLeads.filter(l=>l.status==="new").length,
                allLeads.filter(l=>l.status==="contacted").length,
                allLeads.filter(l=>l.status==="converted").length
            ],
            backgroundColor: ['#3b82f6','#f59e0b','#10b981'],
            borderRadius: 6
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: { responsive:true, plugins:{legend:{display:false}, title:{display:true,text:'Lead Status Overview'}} }
    };
    if(leadChart) leadChart.destroy();
    leadChart = new Chart(ctx, config);
}
// Sort
function sortLeads(by){
  const sorted = [...allLeads].sort((a,b)=>{
    if(a[by].toLowerCase() < b[by].toLowerCase()) return -1;
    if(a[by].toLowerCase() > b[by].toLowerCase()) return 1;
    return 0;
  });
  displayLeads(sorted);
}
function searchLeads() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allLeads.filter(lead => 
        lead.name.toLowerCase().includes(query) || 
        lead.email.toLowerCase().includes(query)
    );
    displayLeads(filtered);
}

// Initial Load
loadLeads();