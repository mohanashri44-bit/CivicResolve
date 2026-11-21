
let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

function saveComplaints() {
    localStorage.setItem("complaints", JSON.stringify(complaints));
}

document.getElementById("complaintForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const complaint = {
        id: "CR" + Date.now().toString().slice(-6),
        citizen: document.getElementById("citizen").value,
        category: document.getElementById("category").value,
        location: document.getElementById("location").value,
        description: document.getElementById("description").value,
        status: "Pending"
    };

    complaints.push(complaint);
    saveComplaints();

    document.getElementById("message").textContent =
        "Complaint submitted successfully! Your ID: " + complaint.id;

    this.reset();
    updateDashboard();
});

function trackComplaint() {
    const id = document.getElementById("trackId").value.trim();
    const complaint = complaints.find(c => c.id === id);

    document.getElementById("trackResult").textContent = complaint
        ? "Complaint Status: " + complaint.status + " | Category: " + complaint.category
        : "Complaint ID not found.";
}

function updateDashboard() {
    document.getElementById("total").textContent = complaints.length;

    document.getElementById("pending").textContent =
        complaints.filter(c => c.status === "Pending").length;

    document.getElementById("resolved").textContent =
        complaints.filter(c => c.status === "Resolved").length;

    const list = document.getElementById("complaintList");
    list.innerHTML = "";

    complaints.forEach(c => {
        const card = document.createElement("div");
        card.className = "complaint-card";

        const details = document.createElement("p");
        details.textContent =
            c.id + " | " + c.category + " | " + c.location + " | " + c.status;

        card.appendChild(details);

        if (c.status !== "Resolved") {
            const button = document.createElement("button");
            button.textContent = "Mark as Resolved";

            button.addEventListener("click", function() {
                c.status = "Resolved";
                saveComplaints();
                updateDashboard();
            });

            card.appendChild(button);
        }

        list.appendChild(card);
    });
}

updateDashboard();
