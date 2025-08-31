const API_BASE = "http://127.0.0.1:3000";

// Helper: Fetch with credentials for cookie-based auth
async function apiRequest(url, options = {}) {
    const response = await fetch(API_BASE + url, {
        ...options,
        credentials: "include", // include cookies (JWT)
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        // Optionally handle 401 or other errors globally
        throw new Error("API request failed with status " + response.status);
    }

    return response.json();
}

// On page load
window.addEventListener("DOMContentLoaded", () => {
    checkUserStatus();
    setupCardListeners();
});

function checkUserStatus() {
    fetch(API_BASE + "/api/dashboard", {
        method: "GET", // HTTP request type is GET
        credentials: "include", // include cookies (JWT)
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error("API request failed with status " + response.status);
        }
        return response.json();
    })
    .then(function(res) {
        if (res.user) {
            var userNameElem = document.querySelector(".user-details h4");
            if (userNameElem) {
                userNameElem.textContent = res.user.name;
            }
            document.querySelector(".user-avatar").innerHTML = `<img src="${res.user.picture}"></img>`
            console.log(res)
            var borrowedCount = res.pdfs.length;
            var returnedCount = Math.floor(Math.random() * (borrowedCount + 1));

            var borrowedElem = document.getElementById("borrowed-count");
            var returnedElem = document.getElementById("returned-count");

            if (borrowedElem) borrowedElem.textContent = borrowedCount;
            if (returnedElem) returnedElem.textContent = returnedCount;

            animatePieChart(borrowedCount, returnedCount);
        } else {
            redirectToLogin();
        }
    })
    .catch(function(err) {
        console.error("Error fetching dashboard:", err);
        redirectToLogin();
    });
}

function redirectToLogin() {
    // Uncomment and set to your actual login page
    window.location.href = "/index.html";
}

function setupCardListeners() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const action = card.dataset.action; // Use data-action attribute
        if (action) {
            card.addEventListener("click", () => {
                handleCardClick(action);
            });
        }
    });
}

function handleCardClick(type) {
    switch (type) {
        case "borrowed":
            alert("Showing borrowed book list (not implemented).");
            break;
        case "returned":
            alert("Showing returned book list (not implemented).");
            break;
        case "browse":
            alert("Browsing book inventory (not implemented).");
            break;
        default:
            alert("Unknown action.");
    }
}

// Animate pie chart arc
function animatePieChart(borrowed, returned) {
    const total = borrowed + returned || 1; // avoid division by zero
    const borrowedRatio = borrowed / total;
    const circumference = 2 * Math.PI * 80; // r=80
    const dash = borrowedRatio * circumference;

    const arc = document.getElementById("borrowed-arc");
    if (!arc) {
        console.warn("SVG element with id 'borrowed-arc' not found.");
        return;
    }

    arc.setAttribute("stroke-dasharray", `${dash} ${circumference - dash}`);
}
