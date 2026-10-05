// ==========================================
// TOOLS WEBSITE AI - SCRIPT ENGINE
// ==========================================

const DEFAULT_TOOLS = [
    {
        id: 1,
        title: "AI Article Writer",
        description: "Smart text options and auto-generating features for professional bloggers and content creators.",
        image: "https://images.unsplash.com/photo-1542744094-3a31246264d0",
        link: "#"
    },
    {
        id: 2,
        title: "Smart Image Generator",
        description: "Smart AI image generator that builds professional product designs and stunning artwork.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        link: "#"
    },
    {
        id: 3,
        title: "SEO Optimizer",
        description: "Optimize your website content for caching, keyword tracking, and deep analytics.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        link: "#"
    },
    {
        id: 4,
        title: "Smart Table Analyzer",
        description: "Organize raw data, spreadsheets, and structured information seamlessly using AI.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        link: "#"
    }
];

window.appState = {
    toolsList: DEFAULT_TOOLS
};

window.addEventListener('DOMContentLoaded', () => {
    renderTools(window.appState.toolsList);
    fetchToolsFromJson();

    const searchInput = document.getElementById('toolSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleToolSearch);
    }
});

// Fetch from tools.json with fallback
async function fetchToolsFromJson() {
    const sources = [
        "https://toolswebsiteai.github.io/tools.json?t=" + Date.now(),
        "tools.json?t=" + Date.now(),
        "./tools.json?t=" + Date.now()
    ];

    for (let url of sources) {
        try {
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (data && data.tools && data.tools.length > 0) {
                    window.appState.toolsList = data.tools;
                    renderTools(window.appState.toolsList);
                    break;
                }
            }
        } catch (e) {}
    }
}

function renderTools(toolsArray) {
    const grid = document.getElementById('aiComponentsGrid');
    const countText = document.getElementById('toolsCount');
    if (!grid) return;

    grid.innerHTML = '';
    if (countText) countText.innerText = `${toolsArray.length} tools available`;

    if (toolsArray.length === 0) {
        grid.innerHTML = `<p class="text-slate-400 text-xs col-span-full text-center py-10">No AI tools found matching your search.</p>`;
        return;
    }

    toolsArray.forEach(tool => {
        const card = document.createElement('div');
        card.className = "ai-comp-card";

        let imgSrc = tool.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe";

        card.innerHTML = `
            <div>
                <div class="ai-comp-img">
                    <img src="${imgSrc}" alt="${tool.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'">
                </div>
                <h3 class="text-sm font-bold text-white mb-1">${tool.title}</h3>
                <p class="text-xs text-slate-400 line-clamp-2 mb-4">${tool.description}</p>
            </div>
            <a href="${tool.link || '#'}" class="block bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 px-4 rounded-xl text-center transition shadow-sm">Learn More ➔</a>
        `;
        grid.appendChild(card);
    });
}

function handleToolSearch() {
    const query = (document.getElementById('toolSearch')?.value || '').toLowerCase();
    const filtered = window.appState.toolsList.filter(tool => 
        tool.title.toLowerCase().includes(query) || 
        tool.description.toLowerCase().includes(query)
    );
    renderTools(filtered);
}
