async function loadThemes() {
    const response = await fetch('/api/themes');
    const themes = await response.json();
    const themeList = document.getElementById('theme-list');
    
    themes.forEach(theme => {
        const themeButton = document.createElement('button');
        themeButton.textContent = theme.name;
        themeButton.onclick = () => startGame(theme.id);
        themeList.appendChild(themeButton);
    });
}

function startGame(themeId) {
    window.location.href = `game.html?theme=${themeId}`;
}

loadThemes();