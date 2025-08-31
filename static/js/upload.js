document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("uploadBookForm");

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
});