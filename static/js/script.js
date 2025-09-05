const API_BASE = "http://127.0.0.1:3000";

// -------------------- API Helper --------------------
async function apiRequest(url, options = {}) {
    const response = await fetch(API_BASE + url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });
    if (!response.ok) throw new Error("API request failed with status " + response.status);
    return response.json();
}

// -------------------- Page Load --------------------
window.addEventListener("DOMContentLoaded", () => {
    checkUserStatus();
    setupCardListeners();
    setupSidebarNavigation();
});

// -------------------- Check User --------------------
function checkUserStatus() {
    apiRequest("/api/dashboard")
        .then(res => {
            if (res.user) {
                const userNameElem = document.querySelector(".user-details h4");
                if (userNameElem) userNameElem.textContent = res.user.name;

                const avatarElem = document.querySelector(".user-avatar");
                if (avatarElem && res.user.picture) {
                    avatarElem.innerHTML = `<img src="${res.user.picture}" alt="User Avatar">`;
                }

                const borrowedCount = (res.pdfs || []).length;
                const returnedCount = Math.floor(Math.random() * (borrowedCount + 1));

                const borrowedElem = document.getElementById("borrowed-count");
                const returnedElem = document.getElementById("returned-count");

                if (borrowedElem) borrowedElem.textContent = borrowedCount;
                if (returnedElem) returnedElem.textContent = returnedCount;

                animatePieChart(borrowedCount, returnedCount);
            } else {
                redirectToIndex();
            }
        })
        .catch(err => {
            console.error("Error fetching dashboard:", err);
            redirectToIndex();
        });
}

// -------------------- Redirects --------------------
function redirectToIndex() {
    window.location.href = "index.html";
}

// -------------------- Cards --------------------
function setupCardListeners() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const action = card.dataset.action;
        if (action) card.addEventListener("click", () => handleCardClick(action));
    });
}

function handleCardClick(type) {
    switch(type) {
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

// -------------------- Pie Chart --------------------
function animatePieChart(borrowed, returned) {
    const total = borrowed + returned || 1;
    const borrowedRatio = borrowed / total;
    const circumference = 2 * Math.PI * 80;
    const dash = borrowedRatio * circumference;

    const arc = document.getElementById("borrowed-arc");
    if (!arc) return;
    arc.setAttribute("stroke-dasharray", `${dash} ${circumference - dash}`);
}

// -------------------- Sidebar --------------------
function setupSidebarNavigation() {
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    sidebarItems.forEach(item => {
        const id = item.id; 
        item.addEventListener("click", () => {
            switch(id) {
                case "nav-back":
                    window.location.href = "dashboard.html";
                    break;
                case "nav-mybooks":
                    window.location.href = "yourreadbooks.html";
                    break;
                case "nav-upload":
                    window.location.href = "uploadbooks.html";
                    break;
                case "nav-reports":
                    alert("Reports section (not implemented).");
                    break;
                case "nav-help":
                    alert("Help section (not implemented).");
                    break;
                case "nav-logout":
                    // Clear any session storage or cookies if needed
                    redirectToIndex();
                    break;
                default:
                    console.warn("Unknown sidebar item:", id);
            }
        });
    });
}
