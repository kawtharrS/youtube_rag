const loadBtn = document.getElementById("loadBtn");
const askBtn = document.getElementById("askBtn");

const statusText = document.getElementById("status");
const answerText = document.getElementById("answer");

loadBtn.addEventListener("click", async () => {
    const url = document.getElementById("videoUrl").value;

    if (!url) {
        alert("Please enter a YouTube URL");
        return;
    }

    statusText.textContent = "Loading video and creating embeddings...";

    try {
        const response = await fetch(
            "http://localhost:8000/load-video",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url })
            }
        );

        const data = await response.json();

        statusText.textContent =
            data.message || "Video indexed successfully!";
    } catch (error) {
        statusText.textContent = "Failed to load video";
        console.error(error);
    }
});

askBtn.addEventListener("click", async () => {
    const question = document.getElementById("question").value;

    if (!question) {
        alert("Please enter a question");
        return;
    }

    answerText.textContent = "Thinking...";

    try {
        const response = await fetch(
            "http://localhost:8000/ask",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question })
            }
        );

        const data = await response.json();

        answerText.textContent =
            data.answer || "No answer found.";
    } catch (error) {
        answerText.textContent = "Error getting answer.";
        console.error(error);
    }
});