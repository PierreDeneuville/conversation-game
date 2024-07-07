// Variables globales
let THEME;
let conversations;
let score = 0;
let lostInteractions = 0;
let currentConversation;
let currentQuestionIndex;
let interactionChance;
let askedQuestions;

// Fonction pour charger le thème depuis l'API
async function loadTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeId = urlParams.get('theme');
    try {
        const response = await fetch(`/api/themes/${themeId}`);
        if (!response.ok) {
            throw new Error('Failed to load theme');
        }
        const theme = await response.json();
        THEME = theme.variables;
        conversations = theme.conversations;
        initializeGame();
    } catch (error) {
        console.error('Error loading theme:', error);
        document.getElementById('game-container').innerHTML = '<p>Error loading theme. Please try again.</p>';
    }
}

// Fonction pour initialiser le jeu avec le thème chargé
function initializeGame() {
    console.log('Initializing game with theme:', THEME.title);
    const gameTitleElement = document.getElementById('game-title');
    if (gameTitleElement) {
        gameTitleElement.innerText = THEME.title;
    } else {
        console.error('game-title element not found');
    }

    const nextInteractionElement = document.getElementById('next-interaction');
    if (nextInteractionElement) {
        nextInteractionElement.innerText = `${THEME.interactionName} suivante`;
    } else {
        console.error('next-interaction element not found');
    }

    startGame();
}

function startGame() {
    console.log('Starting game');
    score = 0;
    lostInteractions = 0;
    updateScore();
    const restartButton = document.getElementById('restart');
    if (restartButton) {
        restartButton.style.display = 'none';
    }
    const resultElement = document.getElementById('result');
    if (resultElement) {
        resultElement.innerHTML = '';
    }
    nextInteraction();
}

function nextInteraction() {
    if (lostInteractions >= THEME.maxLostInteractions) {
        endGame();
        return;
    }

    interactionChance = 0;
    currentQuestionIndex = 0;
    askedQuestions = [];
    generateScene();
    
    const nextInteractionButton = document.getElementById('next-interaction');
    const restartButton = document.getElementById('restart');
    const resultElement = document.getElementById('result');

    if (nextInteractionButton) nextInteractionButton.style.display = 'none';
    if (restartButton) restartButton.style.display = 'none';
    if (resultElement) resultElement.innerHTML = '';
    
    askQuestion();
}

function generateScene() {
    const character2Color = '#' + Math.floor(Math.random()*16777215).toString(16);
    const character2ShirtColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    const character3Color = '#' + Math.floor(Math.random()*16777215).toString(16);
    const character3ShirtColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    let sceneHtml = THEME.sceneSvg
        .replace('#parentClothesColor#', character2Color)
        .replace('#parentShirtColor#', character2ShirtColor)
        .replace('#parentSkinColor#', '#' + Math.floor(Math.random()*16777215).toString(16))
        .replace('#studentClothesColor#', character3Color)
        .replace('#studentShirtColor#', character3ShirtColor)
        .replace('#studentSkinColor#', '#' + Math.floor(Math.random()*16777215).toString(16));

    const sceneContainer = document.getElementById('scene-container');
    if (sceneContainer) {
        sceneContainer.innerHTML = sceneHtml;
    } else {
        console.error('scene-container element not found');
    }
}

function askQuestion() {
    if (currentQuestionIndex >= 3) {
        decideOutcome();
        return;
    }

    let availableQuestions = conversations.filter(conv => !askedQuestions.includes(conv.question));
    
    if (availableQuestions.length === 0) {
        availableQuestions = conversations;
    }

    currentConversation = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    askedQuestions.push(currentConversation.question);

    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');

    if (questionElement) questionElement.innerHTML = currentConversation.question;
    if (answersElement) {
        answersElement.innerHTML = '';
        currentConversation.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.innerHTML = answer.text;
            button.onclick = () => selectAnswer(index);
            answersElement.appendChild(button);
        });
    }
}

function selectAnswer(index) {
    const answer = currentConversation.answers[index];
    interactionChance += answer.score * 10;
    currentQuestionIndex++;
    askQuestion();
}

function decideOutcome() {
    const interactionValue = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    const outcomeRoll = Math.random() * 100;

    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const resultElement = document.getElementById('result');
    const nextInteractionButton = document.getElementById('next-interaction');

    if (questionElement) questionElement.innerHTML = '';
    if (answersElement) answersElement.innerHTML = '';

    if (outcomeRoll < interactionChance) {
        if (resultElement) resultElement.innerHTML = `Le ${THEME.character2Name} est satisfait ! Vous gagnez ${interactionValue} ${THEME.scoreUnit}.`;
        score += interactionValue;
    } else {
        if (resultElement) resultElement.innerHTML = `Le ${THEME.character2Name} n'est pas convaincu.`;
        lostInteractions++;
    }

    updateScore();
    if (nextInteractionButton) nextInteractionButton.style.display = 'inline-block';
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    const lostInteractionsElement = document.getElementById('lost-interactions');
    
    if (scoreElement) scoreElement.innerHTML = `Score: ${score} ${THEME.scoreUnit}`;
    if (lostInteractionsElement) lostInteractionsElement.innerHTML = `${THEME.interactionName}s perdues: ${lostInteractions}`;
}

function endGame() {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const resultElement = document.getElementById('result');
    const nextInteractionButton = document.getElementById('next-interaction');
    const restartButton = document.getElementById('restart');

    if (questionElement) questionElement.innerHTML = '';
    if (answersElement) answersElement.innerHTML = '';
    if (resultElement) resultElement.innerHTML = `Partie terminée ! Score final: ${score} ${THEME.scoreUnit}, ${THEME.interactionName}s réussies: ${Math.floor(score / 55)}`;
    if (nextInteractionButton) nextInteractionButton.style.display = 'none';
    if (restartButton) restartButton.style.display = 'inline-block';
}

function backToMenu() {
    window.location.href = 'index.html';
}

// Gestionnaires d'événements
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const nextInteractionButton = document.getElementById('next-interaction');
    const restartButton = document.getElementById('restart');
    const backToMenuButton = document.getElementById('back-to-menu');
    
    if (nextInteractionButton) nextInteractionButton.onclick = nextInteraction;
    if (restartButton) restartButton.onclick = startGame;
    if (backToMenuButton) backToMenuButton.onclick = backToMenu;
    
    loadTheme();
});