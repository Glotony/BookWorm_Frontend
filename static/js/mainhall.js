// mainhall.js - Full working version with Back button

const API_BASE = "http://127.0.0.1:3000";

// -------------------- Helper: API Request with cookies --------------------
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
        throw new Error("API request failed with status " + response.status);
    }
    return response.json();
}

// -------------------- On Page Load --------------------
window.addEventListener("DOMContentLoaded", () => {
    checkUserStatus();
    loadUploadedPDFs();
    loadBooks();
    setupSidebarNavigation();
});

// -------------------- Check User Status --------------------
async function checkUserStatus() {
    try {
        const res = await apiRequest("/api/dashboard");
        if (res.user) {
            const userNameElem = document.querySelector(".user-details h4");
            if (userNameElem) userNameElem.textContent = res.user.name;

            const avatarElem = document.querySelector(".user-avatar");
            if (avatarElem && res.user.picture) {
                avatarElem.innerHTML = `<img src="${res.user.picture}" alt="Avatar">`;
            }

            const borrowedCount = res.pdfs.length;
            const returnedCount = Math.floor(Math.random() * (borrowedCount + 1));

            const borrowedElem = document.getElementById("borrowed-count");
            const returnedElem = document.getElementById("returned-count");

            if (borrowedElem) borrowedElem.textContent = borrowedCount;
            if (returnedElem) returnedElem.textContent = returnedCount;

            animatePieChart(borrowedCount, returnedCount);
        } else {
            redirectToLogin();
        }
    } catch (err) {
        console.error("Error fetching dashboard:", err);
        redirectToLogin();
    }
}

function redirectToLogin() {
    window.location.href = "/dashboard.html";
}

// -------------------- Load PDFs --------------------
async function loadUploadedPDFs() {
    const pdfContainer = document.getElementById("pdf-container");
    if (!pdfContainer) return;

    pdfContainer.innerHTML = "<p>Loading PDFs...</p>";

    try {
        const res = await apiRequest("/api/dashboard");
        const files = res.pdfs || [];

        if (!files.length) {
            pdfContainer.innerHTML = "<p>No PDFs uploaded yet.</p>";
            return;
        }

        pdfContainer.innerHTML = "";

        files.forEach(file => {
            const card = document.createElement("div");
            card.className = "pdf-card";
            card.innerHTML = `
                <div class="pdf-icon">📄</div>
                <div class="pdf-name" title="${file.filename}">${file.filename}</div>
            `;
            card.addEventListener("click", () => {
                window.open(`${API_BASE}/uploads/${file.filename}`, "_blank");
            });
            pdfContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading PDFs:", err);
        pdfContainer.innerHTML = "<p>Failed to load PDFs. Try again later.</p>";
    }
}

// -------------------- Load Books --------------------
async function loadBooks() {
    const borrowedList = document.getElementById("borrowed-books");
    const finishedList = document.getElementById("finished-books");

    if (!borrowedList || !finishedList) return;

    try {
        const borrowedBooks = await apiRequest("/api/books/borrowed");
        const finishedBooks = await apiRequest("/api/books/finished");

        borrowedList.innerHTML = borrowedBooks.length
            ? borrowedBooks.map(b => `<li class="book-card"><h4>${b.title}</h4><p>${b.author}</p></li>`).join("")
            : "<li class='book-card'>No borrowed books</li>";

        finishedList.innerHTML = finishedBooks.length
            ? finishedBooks.map(b => `<li class="book-card"><h4>${b.title}</h4><p>${b.author}</p></li>`).join("")
            : "<li class='book-card'>No finished books</li>";
    } catch (err) {
        console.error("Failed to load books:", err);
        borrowedList.innerHTML = "<li class='book-card'>Error loading borrowed books</li>";
        finishedList.innerHTML = "<li class='book-card'>Error loading finished books</li>";
    }
}

// -------------------- Sidebar Navigation --------------------
function setupSidebarNavigation() {
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    sidebarItems.forEach(item => {
        const id = item.id; // safer than using index
        item.addEventListener("click", () => {
            switch (id) {
                case "nav-back": // Go back to dashboard
                    window.location.href = "dashboard.html"; // <-- changed here
                    break;
                case "nav-upload":
                    window.location.href = "uploadbooks.html";
                    break;
                case "nav-mybooks":
                    window.location.href = "yourreadbooks.html";
                    break;
                case "nav-reports":
                    alert("Reports coming soon!");
                    break;
                case "nav-help":
                    alert("Help section coming soon!");
                    break;
                default:
                    console.warn("Unknown sidebar item:", id);
            }
        });
    });
}

// -------------------- Animate Pie Chart --------------------
function animatePieChart(borrowed, returned) {
    const total = borrowed + returned || 1;
    const borrowedRatio = borrowed / total;
    const circumference = 2 * Math.PI * 80;
    const dash = borrowedRatio * circumference;

    const arc = document.getElementById("borrowed-arc");
    if (!arc) {
        console.warn("SVG element with id 'borrowed-arc' not found.");
        return;
    }

    arc.setAttribute("stroke-dasharray", `${dash} ${circumference - dash}`);
}
