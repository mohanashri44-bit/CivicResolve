
let complaints = [];

try {
    complaints = JSON.parse(
        localStorage.getItem("complaints")
    ) || [];
} catch (error) {
    console.error("Unable to load complaints:", error);
    complaints = [];
}

function saveComplaints() {
    try {
        localStorage.setItem(
            "complaints",
            JSON.stringify(complaints)
        );
        return true;
    } catch (error) {
        console.error("Storage error:", error);
        alert("Unable to save complaint. Please try again.");
        return false;
    }
}

function getPriority(category, description) {
    const text = description.toLowerCase();

    if (
        category === "Road" ||
        text.includes("accident") ||
        text.includes("danger") ||
        text.includes("emergency")
    ) {
        return "High";
    }

    if (
        category === "Water" ||
        category === "Drainage" ||
        category === "Waste"
    ) {
        return "Medium";
    }

    return "Low";
}

const form = document.getElementById("complaintForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const citizen = document.getElementById("citizen").value.trim();
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!citizen || !category || !location || !description) {
        document.getElementById("message").textContent =
            "Please fill in all required fields.";
        return;
    }

    const complaint = {
        id: "CR" + Date.now(),
        citizen,
        category,
        location,
        description,
        priority: getPriority(category, description),
        status: "Pending",
        date: new Date().toLocaleDateString()
    };

    complaints.push(complaint);

    if (!saveComplaints()) {
        complaints.pop();
        return;
    }

    document.getElementById("message").textContent =
        "Complaint submitted successfully! Your ID: " + complaint.id;

    form.reset();
    updateDashboard();
});

function trackComplaint() {
    const id = document.getElementById("trackId").value.trim();

    const complaint = complaints.find(c => c.id === id);

    document.getElementById("trackResult").textContent = complaint
        ? `Status: ${complaint.status} | Category: ${complaint.category} | Priority: ${complaint.priority}`
        : "Complaint ID not found.";
}

function updateDashboard() {
    document.getElementById("total").textContent = complaints.length;

    document.getElementById("pending").textContent =
        complaints.filter(c => c.status === "Pending").length;

    document.getElementById("resolved").textContent =
        complaints.filter(c => c.status === "Resolved").length;

    const list = document.getElementById("complaintList");
    list.replaceChildren();

    complaints.forEach(c => {
        const card = document.createElement("div");
        card.className = "complaint-card";

        const details = document.createElement("p");

        details.textContent =
            `${c.id} | ${c.category} | ${c.location} | ${c.status} | Priority: ${c.priority || "Not classified"}`;

        card.appendChild(details);

        if (c.status !== "Resolved") {
            const button = document.createElement("button");

            button.textContent = "Mark as Resolved";

            button.addEventListener("click", function() {
                c.status = "Resolved";

                if (saveComplaints()) {
                    updateDashboard();
                }
            });

            card.appendChild(button);
        }

        list.appendChild(card);
    });
}

updateDashboard();
