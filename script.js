document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("aiComponentsGrid");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const searchInput = document.getElementById("toolSearch");

    let toolsData = [];
    let currentIndex = 0;
    const toolsPerLoad = 10; // Har click par 10 tools aayenge

    // RELATIVE PATH: ./tools.json (GitHub Pages ke liye sab se behtar)
    fetch("./tools.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP Status " + response.status);
            }
            return response.json();
        })
        .then(data => {
            toolsData = data;
            console.log("Successfully loaded " + toolsData.length + " tools from tools.json");
        })
        .catch(err => {
            console.warn("Could not fetch tools.json yet. (If testing locally via file://, push to GitHub Pages to test properly):", err);
        });

    // Card Banane Ka Template
    function createCardHTML(tool) {
        return `
        <div class="ai-comp-card">
            <div class="ai-comp-img">
                <img src="${tool.image}" alt="${tool.name}" width="300" height="170" loading="lazy" decoding="async">
            </div>
            <h3 class="text-lg font-bold mb-1 text-white">${tool.name}</h3>
            <p class="text-xs mb-4 text-slate-400 line-clamp-3">${tool.description}</p>
            <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="block text-center w-full bg-slate-800 hover:bg-brand-600 border border-slate-700 hover:border-brand-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all">
                Visit Website <i class="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px]"></i>
            </a>
        </div>`;
    }

    // BUTTON CLICK EVENT
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            if (toolsData.length === 0) {
                alert("Tools are loading or tools.json is being read. Please make sure this is running on GitHub Pages!");
                return;
            }

            const nextBatch = toolsData.slice(currentIndex, currentIndex + toolsPerLoad);

            if (nextBatch.length > 0) {
                const markup = nextBatch.map(createCardHTML).join("");
                grid.insertAdjacentHTML("beforeend", markup);
                currentIndex += toolsPerLoad;
            }

            // Jab saare JSON tools load ho jayen, tab button hide ho
            if (currentIndex >= toolsData.length) {
                loadMoreBtn.style.display = "none";
            }
        });
    }

    // SEARCH FILTER
    if (searchInput && grid) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.trim().toLowerCase();
            const cards = grid.querySelectorAll(".ai-comp-card");

            cards.forEach((card) => {
                const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
                const desc = card.querySelector("p")?.textContent.toLowerCase() || "";

                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });

            if (loadMoreBtn) {
                if (query.length > 0) {
                    loadMoreBtn.style.display = "none";
                } else if (currentIndex < toolsData.length) {
                    loadMoreBtn.style.display = "inline-flex";
                }
            }
        });
    }
});
