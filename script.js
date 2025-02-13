document.addEventListener("DOMContentLoaded", function () {
    // Animate Gallery Button
    const animateButton = document.querySelector(".animate-btn");
    if (animateButton) {
        animateButton.addEventListener("click", function () {
            document.querySelectorAll(".gallery img").forEach((img, index) => {
                setTimeout(() => {
                    img.style.display = "block";
                    img.style.opacity = "1";
                }, 300 * index);
            });
        });
    }

    function loadData(url, containerId, formatFunction) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onloadend = function () {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Error: Element with ID '${containerId}' not found.`);
                return;
            }

            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    container.innerHTML = data.map(formatFunction).join("");
                } catch (error) {
                    console.error(`Error parsing JSON from ${url}:`, error);
                    container.innerHTML = "Error loading data.";
                }
            } else if (xhr.status === 404) {
                console.error(`Error: ${url} not found (404).`);
                container.innerHTML = "Data currently unavailable.";
            } else {
                console.error(`Error: Failed to load ${url}. Status code: ${xhr.status}`);
            }
        };
        xhr.send();
    }

    // Formatting functions for different JSON data
    function formatEvent(event) {
        return `
            <div class="event-card">
                <h3>${event.title}</h3>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p>${event.description}</p>
            </div>
        `;
    }

    function formatMember(member) {
        return `<p><strong>${member.name}</strong> - ${member.role || "Member"}</p>`;
    }

    function formatAnnouncement(announcement) {
        return `<p><strong>${announcement.title}:</strong> ${announcement.message}</p>`;
    }

    // Load formatted data into the page
    loadData("events.json", "events-container", formatEvent);
    loadData("members.json", "members-container", formatMember);
    loadData("announcements.json", "announcements-container", formatAnnouncement);

    // Refresh announcements every 10 seconds
    setInterval(() => loadData("announcements.json", "announcements-container", formatAnnouncement), 10000);
});

// Submit Feedback via AJAX
function submitFeedback() {
    const feedbackInput = document.getElementById("feedback-input");
    if (!feedbackInput) return;

    const feedback = feedbackInput.value;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "submit_feedback.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseDiv = document.getElementById("feedback-response");
            if (responseDiv) responseDiv.innerHTML = "Thank you for your feedback!";
        }
    };
    xhr.send("feedback=" + encodeURIComponent(feedback));
}

// Fetch Announcements with Cache Bypass
fetch("announcements.json?v=" + new Date().getTime())
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error loading announcements:", error));
