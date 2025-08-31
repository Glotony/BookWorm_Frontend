const API_BASE = "http://127.0.0.1:3000";

// Register user
async function register() {
    try {
        const response = await fetch(API_BASE + "/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // include cookies if any
            body: JSON.stringify({
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value.trim()
            })
        });

        const data = await response.json();
        alert(data.message);

        if (response.status === 201) {
            // window.location.href = "/login.html";
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("დარეგისტრირებისას მოხდა შეცდომა.");
    }
}

// Login user
async function login() {
    try {
        const response = await fetch(API_BASE + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // important for cookie auth
            body: JSON.stringify({
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value.trim()
            })
        });

        const data = await response.json();
        alert(data.message);

        if (response.status === 200) {
            // window.location.href = "/dashboard.html";
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("ავტორიზაციისას მოხდა შეცდომა.");
    }
}

// Logout user
async function logout() {
    try {
        const response = await fetch(API_BASE + "/api/logout", {
            method: "POST",
            credentials: "include",
        });

        const data = await response.json();
        alert(data.message);
        // window.location.href = "/login.html";
    } catch (error) {
        console.error("Logout error:", error);
        alert("გასვლა ვერ მოხერხდა.");
    }
}
