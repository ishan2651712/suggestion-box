document
  .getElementById("suggestionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      category: document.getElementById("category").value,
      message: document.getElementById("message").value.trim(),
    };

    // Optional: Basic frontend validation
    if (!data.name || !data.email || !data.category || !data.message) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      alert(result.message);
      if (response.ok) {
        document.getElementById("suggestionForm").reset(); // ✅ Clears the input fields
      }
    } catch (error) {
      console.error("❌ Submission failed:", error);
      alert("Something went wrong. Please try again later.");
    }
  });
