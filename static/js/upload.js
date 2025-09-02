document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("uploadBookForm");

    // Upload form handler
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("http://127.0.0.1:3000/api/upload", {
                method: "POST",
                body: formData,
                credentials: "include" // send cookies so backend sees JWT
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ " + result.message);
                form.reset();
            } else {
                alert("❌ " + result.message);
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("⚠️ Failed to upload. Try again.");
        }
    });

    // Sidebar navigation
    setupSidebarNavigation();
});

// Function to handle sidebar navigation
function setupSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    sidebarItems.forEach((item) => {
        // Check if this is the back-to-dashboard button
        if (item.id === 'back-to-dashboard') {
            item.addEventListener('click', () => {
                window.location.href = "dashboard.html"; // Redirect to dashboard
            });
        } else {
            // For other sidebar items, keep your old behavior
            item.addEventListener('click', () => {
                const index = Array.from(sidebarItems).indexOf(item);
                handleSidebarNavigation(index);
            });
        }
    });
}

// Your existing handleSidebarNavigation function
function handleSidebarNavigation(index) {
    switch(index) {
        case 0:
            showModal('Dashboard', 'Navigating to the dashboard...', 'dashboard');
            break;
        case 1:
            showModal('My Books', 'Opening your read and returned books...', 'my-books');
            break;
        case 2:
            showModal('Inventory', 'Accessing the full book inventory...', 'inventory');
            break;
        case 3:
            showModal('Reports', 'Loading library reports...', 'reports');
            break;
        case 4:
            showModal('Help', 'Need assistance? Here’s the help section.', 'help');
            break;
        default:
            console.warn('Unhandled sidebar index:', index);
    }
}

// Simple modal/alert function (already in your old JS)
function showModal(title, message, type) {
    alert(`${title}\n\n${message}`);
    console.log(`User clicked: ${type} - ${title}`);
}
