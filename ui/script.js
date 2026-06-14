const loadBtn = document.getElementById("loadBtn");
const askBtn = document.getElementById("askBtn");
const statusText = document.getElementById("status");
const answerText = document.getElementById("answer");
const videoUrlInput = document.getElementById("videoUrl");
const videoInfo = document.getElementById("videoInfo");
const videoTitle = document.getElementById("videoTitle");

let videoLoaded = false;

askBtn.disabled = true;
askBtn.style.opacity = "0.5";
askBtn.style.cursor = "not-allowed";

loadBtn.addEventListener("click", async () => {
  const url = videoUrlInput.value.trim();

  if (!url) {
    statusText.textContent = "Please enter a YouTube URL";
    statusText.classList.add("error");
    return;
  }

  statusText.classList.remove("error");
  statusText.classList.add("loading");
  statusText.textContent = "Loading video and creating embeddings...";
  loadBtn.disabled = true;
  loadBtn.textContent = "Loading...";

  try {
    const response = await fetch("http://localhost:8000/load-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    console.log("load-video response:", data);

    if (data.error) {
      statusText.classList.remove("loading");
      statusText.classList.add("error");
      statusText.textContent = data.message || "Failed to load video.";
    } else {
      videoLoaded = true;
      statusText.classList.remove("loading");
      statusText.classList.remove("error");
      statusText.textContent = data.message || "Video loaded successfully!";

      videoInfo.style.display = "block";
      videoTitle.textContent = `Loaded: ${url.substring(0, 50)}...`;

      askBtn.disabled = false;
      askBtn.style.opacity = "1";
      askBtn.style.cursor = "pointer";
      console.log("Ask button enabled");
    }
  } catch (error) {
    statusText.classList.remove("loading");
    statusText.classList.add("error");
    statusText.textContent = "Network error: " + error.message;
    console.error("Fetch error:", error);
  } finally {
    loadBtn.disabled = false;
    loadBtn.textContent = "Load Video";
  }
});

askBtn.addEventListener("click", async () => {
  const question = document.getElementById("question").value.trim();

  if (!question) {
    answerText.textContent = "Please enter a question";
    answerText.style.display = "block";
    return;
  }

  if (!videoLoaded) {
    answerText.textContent = "Please load a video first";
    answerText.style.display = "block";
    return;
  }

  statusText.classList.remove("error");
  statusText.classList.add("loading");
  statusText.textContent = "Thinking...";
  answerText.textContent = "Processing your question...";
  askBtn.disabled = true;
  askBtn.textContent = "Thinking...";

  try {
    const response = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    statusText.classList.remove("loading");
    statusText.classList.remove("error");
    statusText.textContent = "Answer ready";
    answerText.textContent = data.answer || "No answer found.";
    answerText.style.display = "block";
  } catch (error) {
    statusText.classList.remove("loading");
    statusText.classList.add("error");
    statusText.textContent = "Error";
    answerText.textContent = "Error getting answer: " + error.message;
    answerText.style.display = "block";
    console.error(error);
  } finally {
    askBtn.disabled = false;
    askBtn.textContent = "Ask";
  }
});
