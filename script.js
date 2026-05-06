// --- Web Audio API Hệ Thống Âm Thanh ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let bgmOscillator = null;
let bgmGainNode = null;
let isBgmPlaying = false;
// Cài đặt âm thanh
let masterVolume = 0.5;
let bgmEnabled = true;
let sfxEnabled = true;

function playTone(freq, type, duration, vol = 0.1, slideFreq = null) {
    if (!sfxEnabled) return; // Kiểm tra nếu SFX bị tắt
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (slideFreq) oscillator.frequency.exponentialRampToValueAtTime(slideFreq, audioCtx.currentTime + duration);
    gainNode.gain.setValueAtTime(vol * masterVolume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

const sounds = {
    move: () => playTone(300, 'sine', 0.05, 0.05),
    eat: () => {
        playTone(600, 'sine', 0.1, 0.1);
        setTimeout(() => playTone(800, 'sine', 0.15, 0.1), 100);
    },
    crash: () => playTone(150, 'sawtooth', 0.5, 0.2, 50),
    click: () => playTone(400, 'square', 0.1, 0.05),
    enemyShoot: () => playTone(200, 'square', 0.2, 0.03, 100),
    hit: () => playTone(100, 'sawtooth', 0.3, 0.15, 40)
};

function startBGM() {
    if (isBgmPlaying || !bgmEnabled) return; // Kiểm tra nếu nhạc bị tắt
    if (audioCtx.state === 'suspended') audioCtx.resume();
    isBgmPlaying = true;
    bgmGainNode = audioCtx.createGain();
    bgmGainNode.gain.value = 0.02 * masterVolume; // Áp dụng âm lượng tổng
    bgmGainNode.connect(audioCtx.destination);
    const notes = [220, 261.63, 329.63, 261.63];
    let noteIndex = 0;
    function playNextNote() {
        if (!isBgmPlaying) return;
        bgmOscillator = audioCtx.createOscillator();
        bgmOscillator.type = 'triangle';
        bgmOscillator.frequency.value = notes[noteIndex];
        bgmOscillator.connect(bgmGainNode);
        bgmOscillator.start();
        bgmOscillator.stop(audioCtx.currentTime + 0.5);
        noteIndex = (noteIndex + 1) % notes.length;
        setTimeout(playNextNote, 500);
    }
    playNextNote();
}

function stopBGM() {
    isBgmPlaying = false;
    if (bgmOscillator) {
        bgmOscillator.stop();
        bgmOscillator.disconnect();
    }
}

// --- Logic Game Rắn ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize; // 30

let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let currentLevelName = 'Vừa';
let highScores = {
    'Dễ': 0,
    'Vừa': 0,
    'Khó': 0,
    'Cực Khó': 0
};
let gameSpeed = 100;
let gameLoopInterval;
let isGameOver = false;
let isPaused = false;
let obstacles = [];
let obstacleTimer = 0;
let obstaclesVisible = true;

// DOM Elements
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverOverlay = document.getElementById('game-over-overlay');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const currentLevelEl = document.getElementById('current-level');
const finalScoreEl = document.getElementById('final-score');

const statEasyEl = document.getElementById('stat-val-easy');
const statMediumEl = document.getElementById('stat-val-medium');
const statHardEl = document.getElementById('stat-val-hard');
const statExtremeEl = document.getElementById('stat-val-extreme');

function updateMenuStats() {
    statEasyEl.innerText = highScores['Dễ'];
    statMediumEl.innerText = highScores['Vừa'];
    statHardEl.innerText = highScores['Khó'];
    statExtremeEl.innerText = highScores['Cực Khó'];
    const advValEl = document.getElementById('stat-val-adv');
    if(advValEl) advValEl.innerText = window.maxAdvLevelReached || 1;
}
updateMenuStats();

// Khởi tạo game
function initGame(speed, levelName) {
    currentLevelName = levelName;
    snake = [
        { x: 10, y: 15 },
        { x: 9, y: 15 },
        { x: 8, y: 15 }
    ];
    dx = 1;
    dy = 0;
    score = 0;
    gameSpeed = speed;
    isGameOver = false;
    isPaused = false;
    document.getElementById('pause-overlay').classList.add('hidden');
    obstacles = [];
    obstacleTimer = 0;
    obstaclesVisible = true;

    if (levelName === 'Khó' || levelName === 'Cực Khó') {
        generateObstacles(levelName);
    }

    scoreEl.innerText = score;
    currentLevelEl.innerText = levelName;
    highScoreEl.innerText = highScores[levelName];

    spawnFood();
    startBGM();

    menuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    gameOverOverlay.classList.add('hidden');

    if (gameLoopInterval) clearInterval(gameLoopInterval);
    // Nếu đang ở chế độ Phiêu lưu, không khởi tạo game Cổ điển
    if (!document.getElementById('adv-hud').classList.contains('hidden')) return;
    
    gameLoopInterval = setInterval(gameLoop, gameSpeed);
}

// Vòng lặp game
function gameLoop() {
    if (isPaused || isGameOver) return;
    if (currentLevelName === 'Khó' || currentLevelName === 'Cực Khó') {
        obstacleTimer += gameSpeed;
        if (obstaclesVisible && obstacleTimer >= 15000) {
            obstaclesVisible = false;
            obstacles = [];
        } else if (!obstaclesVisible && obstacleTimer >= 20000) {
            obstaclesVisible = true;
            obstacleTimer = 0;
            generateObstacles(currentLevelName);
        }
    }

    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    draw();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = score;

        // Cập nhật kỷ lục ngay lập tức nếu vượt
        if (score > highScores[currentLevelName]) {
            highScores[currentLevelName] = score;
            highScoreEl.innerText = score;
        }

        sounds.eat();
        spawnFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    for (let obs of obstacles) {
        if (head.x === obs.x && head.y === obs.y) return true;
    }
    return false;
}

function generateObstacles(level) {
    // Hình khối cố định
    for (let i = 5; i < 15; i++) {
        obstacles.push({ x: i, y: 5 });
        obstacles.push({ x: i, y: 24 });
    }
    for (let i = 10; i < 20; i++) {
        obstacles.push({ x: 25, y: i });
        obstacles.push({ x: 4, y: i });
    }

    let randomCount = (level === 'Cực Khó') ? 55 : 15;
    for (let i = 0; i < randomCount; i++) {
        let rx = Math.floor(Math.random() * tileCount);
        let ry = Math.floor(Math.random() * tileCount);
        if (rx >= 5 && rx <= 15 && ry >= 13 && ry <= 17) continue;
        obstacles.push({ x: rx, y: ry });
    }
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    for (let segment of snake) {
        if (food.x === segment.x && food.y === segment.y) { spawnFood(); return; }
    }
    for (let obs of obstacles) {
        if (food.x === obs.x && food.y === obs.y) { spawnFood(); return; }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ lưới neon mờ
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.05)';
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath(); ctx.moveTo(i * gridSize, 0); ctx.lineTo(i * gridSize, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * gridSize); ctx.lineTo(canvas.width, i * gridSize); ctx.stroke();
    }

    // Vẽ chướng ngại vật - Neon Red
    if (obstaclesVisible) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff3333';
        ctx.fillStyle = '#ff3333';
        for (let obs of obstacles) {
            ctx.fillRect(obs.x * gridSize + 1, obs.y * gridSize + 1, gridSize - 3, gridSize - 3);
        }
    }

    // Vẽ mồi - Neon Yellow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffff00';
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);

    // Vẽ rắn - Neon Cyan
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ffcc';
            ctx.fillStyle = '#00ffcc';
        }
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });

    ctx.shadowBlur = 0; // Reset
}

function gameOver() {
    isGameOver = true;
    isPaused = false;
    document.getElementById('pause-overlay').classList.add('hidden');
    clearInterval(gameLoopInterval);
    stopBGM();
    sounds.crash();
    finalScoreEl.innerText = score;
    gameOverOverlay.classList.remove('hidden');
}

function togglePause() {
    if (isGameOver) return;
    // Chỉ hoạt động cho Classic nếu Adventure đang ẩn
    if (!document.getElementById('adv-hud').classList.contains('hidden')) return;
    
    isPaused = !isPaused;
    if (isPaused) {
        document.getElementById('pause-overlay').classList.remove('hidden');
    } else {
        document.getElementById('pause-overlay').classList.add('hidden');
    }
    sounds.click();
}

// --- Xử lý sự kiện ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        togglePause();
        return;
    }
    if (isGameOver || isPaused) return;
    let moved = false;
    switch (e.key) {
        case 'ArrowUp':    if (dy === 0) { dx = 0; dy = -1; moved = true; } break;
        case 'ArrowDown':  if (dy === 0) { dx = 0; dy = 1;  moved = true; } break;
        case 'ArrowLeft':  if (dx === 0) { dx = -1; dy = 0; moved = true; } break;
        case 'ArrowRight': if (dx === 0) { dx = 1;  dy = 0; moved = true; } break;
    }
    if (moved) sounds.move();
});

// Menu Buttons
document.querySelectorAll('.difficulty-buttons .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        sounds.click();
        const speed = parseInt(btn.getAttribute('data-speed'));
        const level = btn.getAttribute('data-level');
        initGame(speed, level);
    });
});

document.getElementById('btn-restart').addEventListener('click', () => {
    sounds.click();
    // Chỉ chạy lại Classic nếu không có Adventure HUD
    if (document.getElementById('adv-hud').classList.contains('hidden')) {
        initGame(gameSpeed, currentLevelName);
    }
});

document.getElementById('btn-pause-restart').addEventListener('click', () => {
    sounds.click();
    isPaused = false;
    document.getElementById('pause-overlay').classList.add('hidden');
    // Nếu là Classic Mode
    if (document.getElementById('adv-hud').classList.contains('hidden')) {
        initGame(gameSpeed, currentLevelName);
    } else {
        // Nếu là Adventure Mode (Hàm startAdv đã có trong adventure.js)
        if (typeof startAdv === 'function') startAdv();
    }
});

document.getElementById('btn-menu').addEventListener('click', () => {
    sounds.click();
    gameOverOverlay.classList.add('hidden');
    // Nếu đang ở Adventure, không làm gì ở đây (Adventure.js sẽ xử lý)
    if (!document.getElementById('adv-hud').classList.contains('hidden')) return;
    
    gameScreen.classList.remove('active');
    menuScreen.classList.add('active');
    updateMenuStats();
    startBGM();
});

document.getElementById('btn-pause-top').addEventListener('click', togglePause);
document.getElementById('btn-resume').addEventListener('click', togglePause);
document.getElementById('btn-pause-menu').addEventListener('click', () => {
    isPaused = false;
    document.getElementById('pause-overlay').classList.add('hidden');
    gameScreen.classList.remove('active');
    menuScreen.classList.add('active');
    stopBGM();
    updateMenuStats();
});

// Phát nhạc chờ khi click vào menu
document.addEventListener('click', () => {
    if (menuScreen.classList.contains('active') && !isBgmPlaying) {
        startBGM();
    }
});

// Settings Logic
const settingsPanel = document.getElementById('settings-panel');
const classicPanel = document.getElementById('classic-panel');
const advPanel = document.getElementById('adventure-panel');

document.getElementById('btn-settings').addEventListener('click', () => {
    sounds.click();
    classicPanel.classList.add('hidden');
    advPanel.classList.add('hidden');
    settingsPanel.classList.remove('hidden');
});

document.getElementById('btn-settings-back').addEventListener('click', () => {
    sounds.click();
    settingsPanel.classList.add('hidden');
    if (document.getElementById('btn-mode-classic').classList.contains('active')) {
        classicPanel.classList.remove('hidden');
    } else {
        advPanel.classList.remove('hidden');
    }
});

document.getElementById('volume-slider').addEventListener('input', (e) => {
    masterVolume = e.target.value / 100;
    if (bgmGainNode) {
        bgmGainNode.gain.setTargetAtTime(0.02 * masterVolume, audioCtx.currentTime, 0.1);
    }
});

document.getElementById('music-toggle').addEventListener('change', (e) => {
    bgmEnabled = e.target.checked;
    if (!bgmEnabled) {
        stopBGM();
        if (typeof stopAdvBGM === 'function') stopAdvBGM();
    } else {
        if (menuScreen.classList.contains('active')) startBGM();
        // Đối với Adventure, nó sẽ tự bật khi tiếp tục hoặc bắt đầu
    }
});

document.getElementById('sfx-toggle').addEventListener('change', (e) => {
    sfxEnabled = e.target.checked;
});

// Vẽ màn hình trống ban đầu
ctx.fillStyle = '#0a0a0a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
