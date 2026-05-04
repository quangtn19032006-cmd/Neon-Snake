// adventure.js – v3 Cleaned & Balanced
(function(){
'use strict';
const CV=document.getElementById('game-canvas'),CX=CV.getContext('2d'),T=20;
const WALL=1,EMPTY=0;
function ch(c){return c==='#'?WALL:EMPTY;}

// Maps: '#'=wall '.'=empty '^'=spike 'E'=enemy 'D'=door 'S'=start 'F'=falling zone
const MAPS=[[
"################################################################################",
"################################################################################",
"################################################################################",
"################################################################################",
"################################################################################",
"################################################################################",
"################################################################################",
"################################################################################",
"################################################################################",
"################################################################################",
"################......F.........F.........F...##################################",
"################..............................##################################",
"################..............................##################################",
"################..............E...............##################################",
"################....^..............^..........###################............###",
"################..............................###################............###",
"################..............................###################............###",
"################..............................###################.........D..###",
"################........##############........###################............###",
"################........##############........###################............###",
"##............................................###################............###",
"##............................................###################............###",
"##.............E............E.................###################.....^..#######",
"##............................................###################........#######",
"##.S......^.........^...........^.............###################........#######",
"##............................................###################.....E..#######",
"##............................................###################........#######",
"##............................................###################........#######",
"################........#########################################........#######",
"################........#########################################........#######",
"##########......................#################################........#######",
"##########......................#################################........#######",
"##########......................#################################........#######",
"##########..E...................#################################........#######",
"##########..........^.........^.#################################........#######",
"##########......................#################################........#######",
"##########......................#################################........#######",
"##########......................#################################........#######",
"########################........................F.......F................#######",
"########################.................................................#######",
"########################.................................................#######",
"########################....................................E............#######",
"########################................^.........^.........^............#######",
"########################.................................................#######",
"########################.................................................#######",
"########################.................................................#######",
"################################################################################",
"################################################################################",
"################################################################################",
"################################################################################"
],[
"##########################################################################################",
"##########################################################################################",
"##########################################################################################",
"##########################################################################################",
"##########################################################################################",
"##########################################################################################",
"##...F.........F............##############################################################",
"##..........................##############################################################",
"##..........................##############################################################",
"##....E.....................##############################################################",
"##....^........^............##############################################################",
"##..........................##############################################################",
"##..........................##############################################################",
"##..........................##############################################################",
"##........##########.....F..............F.............######.....F......................##",
"##........##########..................................######............................##",
"##........##########E........................E........######............................##",
"##........##########^..............^..................######............................##",
"##........##########..................................######........................D...##",
"##........##########..................................######............................##",
"##........##########..................................######............................##",
"##........##########..................................######............................##",
"##........####################################........########################..........##",
"##........####################################........########################..........##",
"##....................................................########################..........##",
"##....................................................########################..........##",
"##........E...................E.......................################..................##",
"##............^...........^...........^...............################..................##",
"##..S.................................................################..................##",
"##....................................................################..................##",
"##..........................F.........................################..................##",
"##....................................................################..................##",
"##................................####################################..................##",
"##................E...............####################################..................##",
"##......^.........^...............####################################..................##",
"##................................####################################..................##",
"##................................####################################..................##",
"##................................####################################..................##",
"##########################........####################################........############",
"##########################........####################################........############",
"##########################........####################################........############",
"##########################........####################################........############",
"####################.........................F................................############",
"####################..........................................................############",
"####################..............................E...........................############",
"####################...............^..............^..............^............############",
"####################..........................................................############",
"####################..........................................................############",
"####################..........................................................############",
"####################..........................................................############",
"##########################################################################################",
"##########################################################################################",
"##########################################################################################",
"##########################################################################################",
"##########################################################################################"
],[
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"######..............................################################################################",
"######..............................################################################################",
"######..............................###################.....F..............F.................#######",
"######..E...........................###################......................................#######",
"######....^.........^...............###################......................................#######",
"######..............................###################......................................#######",
"######..............................###################......................................#######",
"######..............................###################......................................#######",
"######........##############........###################......................................#######",
"######........##############........###################......................................#######",
"######........##############.......F..............F............#####........####........############",
"######........##############...................................#####........####........############",
"######........##############...................................#####........####........############",
"######........##############..^.............^..................#####........####........############",
"######........##############......................E............#####E.......####........############",
"######........##############...................................#####........####........############",
"######........##############...................................#####........####........############",
"######........##############...................................#####........####........############",
"######........######################################...........#####........####........############",
"######........######################################...........#####........####........############",
"##.....................................................F................................############",
"##......................................................................................############",
"##........E........................E..........................E......................F..##..........",
"##.............^..............^..............^....^...................^.................##..........",
"##..S...................................................................................##..........",
"##......................................................................................##..........",
"##......................................................................................##..........",
"##................................................................................E.....##..........",
"######........##########################........################################........##......D...",
"######........##########################........################################........##..........",
"######....................................F.....################################........##..........",
"######..........................................################################........##..........",
"######..........................................####################................................",
"######....^.........^.E.......^.................####################................................",
"######..........................................####################................................",
"######....^.........^...........................####################............^...................",
"######..........................................####################................................",
"######..........................................####################................................",
"####################################################################................................",
"####################################################################................................",
"##########################################################################################..........",
"##########################################################################################..........",
"##########################################################################################..........",
"##########################################################################################..........",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################",
"####################################################################################################"
],[
"################################################################################",
"################################################################################",
"##.....................................................#########################",
"##.....................................................#########################",
"##.....................................................#......................##",
"##..................#####..............................#......................##",
"##..................#####..............................#......................##",
"##..................#####..............................#......................##",
"##......#####.......#####..............................#......................##",
"##......#####.......#####..............................#......................##",
"##......#####.................E........................#......................##",
"##......#####..........................................#......................##",
"##......#####..........................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##..S.........................................................................##",
"##......#####.................................................................##",
"##......#####.................................................................##",
"##......#####.................................................................##",
"##......#####..........................................#......................##",
"##......#####..........................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##......#####.......#####.....E........................#......................##",
"##......#####.......#####..............................#......................##",
"##......#####.......#####..............................#......................##",
"##......#####.......#####..............................#......................##",
"##......#####.......#####..............................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#......................##",
"##.....................................................#########################",
"##.....................................................#########################",
"################################################################################",
"################################################################################"
]];

function parseMap(raw){
    const mh=raw.length,mw=raw[0].length;
    const tiles=raw.map(r=>[...r].map(ch));
    let sx=2,sy=2,door=null;
    const spikes=[],enemies=[];
    raw.forEach((row,r)=>[...row].forEach((c,col)=>{
        if(c==='S'){sx=col;sy=r;}
        else if(c==='D'){door={x:col,y:r};}
        else if(c==='^'){spikes.push({x:col,y:r});}
        else if(c==='E'){enemies.push({x:col,y:r,timer:Math.floor(Math.random()*3000)});}
    }));
    return{mw,mh,tiles,sx,sy,door,spikes,enemies};
}

// State
let advLevel=1,advRunning=false,advInterval=null,advAnimReq=null;
let snake=[],curDir={x:0,y:0},lastDir={x:1,y:0},ammo=0;
let isPaused = false;
let pressedKeys=[]; // Danh sách phím đang giữ
let snakeBullets=[],enemyBullets=[];
let enemies=[],spikes=[],fallingWarns=[],activeSpikes=[];
let door=null,boss=null,blueFood=null,yellowFood=null;
let totalEnemies=0, killedEnemies=0;
let cam={x:0,y:0},map2d=[],mapW=0,mapH=0;
let advBgmActive = false;
let isFirstDrop = true;
window.maxAdvLevelReached = 4; // Đã mở khóa tất cả các màn chơi theo yêu cầu
let moveTimer=0,fallingTimer=0,yellowTimer=0;
let isTransitioning=false;
let currentZoom=1.5;
const MOVE_MS=110,TICK_MS=50; // Tăng tốc độ một chút

// DOM
const menuEl=document.getElementById('menu-screen');
const gameEl=document.getElementById('game-screen');
const goEl=document.getElementById('game-over-overlay');
const winEl=document.getElementById('win-overlay');
const advHud=document.getElementById('adv-hud');
const ammoEl=document.getElementById('adv-ammo');
const badgeEl=document.getElementById('adv-level-badge');
const bossHud=document.getElementById('boss-hud');
const bossBar=document.getElementById('boss-hp-fill');
const laserWarnEl=document.getElementById('laser-warn');

// Mode switching
document.getElementById('btn-mode-classic').addEventListener('click',function(){
    this.classList.add('active');
    document.getElementById('btn-mode-adventure').classList.remove('active');
    document.getElementById('classic-panel').classList.remove('hidden');
    document.getElementById('adventure-panel').classList.add('hidden');
    document.getElementById('stats-classic').classList.remove('hidden');
    document.getElementById('stats-adventure').classList.add('hidden');
});
function updateLevelButtons() {
    const maxLvl = window.maxAdvLevelReached || 1;
    for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById(`btn-lvl-${i}`);
        if (!btn) continue;
        if (i <= maxLvl) {
            btn.classList.remove('locked');
            btn.disabled = false;
        } else {
            btn.classList.add('locked');
            btn.disabled = true;
        }
    }
}

document.getElementById('btn-mode-adventure').addEventListener('click',function(){
    this.classList.add('active');
    document.getElementById('btn-mode-classic').classList.remove('active');
    document.getElementById('classic-panel').classList.add('hidden');
    document.getElementById('adventure-panel').classList.remove('hidden');
    document.getElementById('stats-classic').classList.add('hidden');
    document.getElementById('stats-adventure').classList.remove('hidden');
    updateLevelButtons(); // Cập nhật trạng thái các nút level
    if(typeof updateMenuStats === 'function') updateMenuStats();
});

document.querySelectorAll('.btn-lvl').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('locked')) return;
        sounds.click();
        advLevel = parseInt(btn.getAttribute('data-level'));
        startAdv();
    });
});
document.getElementById('btn-win-menu').addEventListener('click',exitAdv);
document.getElementById('btn-restart').addEventListener('click',()=>{if(advHud&&!advHud.classList.contains('hidden'))startAdv();});
document.getElementById('btn-menu').addEventListener('click',()=>{if(advHud&&!advHud.classList.contains('hidden'))exitAdv();});

function startAdv(){
    stopAdv();
    // Dừng triệt để Classic Mode nếu đang chạy
    if(typeof gameLoopInterval !== 'undefined') clearInterval(gameLoopInterval);
    if(typeof stopBGM === 'function') stopBGM();
    
    window.maxAdvLevelReached = Math.max(window.maxAdvLevelReached || 1, advLevel);
    startAdvBGM();
    const raw=MAPS[Math.min(advLevel-1,3)];
    const ld=parseMap(raw);
    mapW=ld.mw;mapH=ld.mh;map2d=ld.tiles;
    snake=[{x:ld.sx,y:ld.sy},{x:ld.sx-1,y:ld.sy},{x:ld.sx-2,y:ld.sy}];
    curDir={x:0,y:0}; lastDir={x:1,y:0}; 
    // Chỉ reset/cấp lại đạn ở Level 1 hoặc Level 4
    if(advLevel === 1 && ammo < 5) ammo = 5; 
    else if(advLevel === 4) ammo = 5; 
    // Các Level 2 và 3 sẽ giữ nguyên số đạn từ màn trước đó
    
    snakeBullets=[];enemyBullets=[];
    spikes=ld.spikes.map(s=>({...s}));
    enemies=ld.enemies.map(e=>({...e}));
    totalEnemies=enemies.length; killedEnemies=0;
    fallingWarns=[];activeSpikes=[];
    pressedKeys=[]; // Reset keys
    isFirstDrop = true; // Reset nhịp rơi đá
    door=ld.door?{...ld.door}:null;
    blueFood=null; yellowFood=null;
    moveTimer=0; fallingTimer=-2000; yellowTimer=0; // Thêm 2s an toàn khi bắt đầu
    
    if(advLevel===4){
        currentZoom = 0.65; 
        boss={x:60,y:8,w:6,h:20,hp:100,maxHp:100,timer:0,attacks:0,state:'idle',laserY:18};
        bossHud.classList.remove('hidden');bossBar.style.width='100%';laserWarnEl.classList.add('hidden');
    }else{
        currentZoom = 1.5;
        boss=null;bossHud.classList.add('hidden');laserWarnEl.classList.add('hidden');
    }
    isPaused = false;
    document.getElementById('pause-overlay').classList.add('hidden');
    // Ẩn bảng kỷ lục trong chế độ Phiêu lưu
    document.getElementById('high-score').parentElement.classList.add('hidden');
    
    advHud.classList.remove('hidden');
    goEl.classList.add('hidden');winEl.classList.add('hidden');
    isTransitioning=false;
    badgeEl.innerText=`Level ${advLevel} / 4`;
    updateAmmo(); updateEnemyCount();
    document.getElementById('current-level').innerText=`Phiêu Lưu Lv${advLevel}`;
    // Đổi nhãn Điểm thành Kẻ thù
    document.getElementById('score').parentElement.firstChild.textContent = "Kẻ thù: ";
    menuEl.classList.remove('active');gameEl.classList.add('active');
    advRunning=true;
    updateCam(); 
    gameLoop();
    advInterval=setInterval(tick,TICK_MS);
}

function stopAdv(){
    advRunning=false;
    stopAdvBGM();
    if(advInterval){clearInterval(advInterval);advInterval=null;}
    if(advAnimReq){cancelAnimationFrame(advAnimReq);advAnimReq=null;}
}

function gameLoop(){
    if(!advRunning || isPaused)return;
    updateCam();
    draw();
    advAnimReq = requestAnimationFrame(gameLoop);
}

function togglePauseAdv() {
    if (!advRunning) return;
    isPaused = !isPaused;
    if (isPaused) {
        document.getElementById('pause-overlay').classList.remove('hidden');
        stopAdvBGM();
    } else {
        document.getElementById('pause-overlay').classList.add('hidden');
        startAdvBGM();
        gameLoop(); // Khởi động lại vòng lặp vẽ
    }
    sounds.click();
}

function exitAdv(){
    stopAdv();
    stopAdvBGM();
    isPaused = false;
    document.getElementById('pause-overlay').classList.add('hidden');
    advHud.classList.add('hidden');
    gameEl.classList.remove('active');menuEl.classList.add('active');
    goEl.classList.add('hidden');winEl.classList.add('hidden');
    // Đổi nhãn về Điểm cho Cổ điển
    document.getElementById('score').parentElement.firstChild.textContent = "Điểm: ";
    // Hiện lại bảng kỷ lục cho chế độ Cổ điển
    document.getElementById('high-score').parentElement.classList.remove('hidden');
}

function tick(){
    if(!advRunning || isTransitioning || isPaused)return;
    moveTimer+=TICK_MS;fallingTimer+=TICK_MS;
    const currentMoveSpeed = (advLevel === 4) ? 85 : MOVE_MS;
    if(moveTimer>=currentMoveSpeed&&(curDir.x||curDir.y)){moveTimer=0;tryMove(curDir.x,curDir.y);}
    
    // update bullets (No wall piercing)
    snakeBullets=snakeBullets.filter(b=>{
        b.x+=b.dx;b.y+=b.dy;
        if(b.x<0||b.x>=mapW||b.y<0||b.y>=mapH) return false;
        if(map2d[Math.floor(b.y)][Math.floor(b.x)]===WALL) return false;
        return true;
    });
    enemyBullets=enemyBullets.filter(b=>{
        if(b.type==='boss'){
            b.x += b.dx;
            b.y += Math.sin(b.x * 0.2) * 0.4 + b.dy;
            if(b.dx < 0 && b.x < cam.x/T + 2){
                b.dx = Math.abs(b.dx);
                b.returned = true;
            }
            return b.x < mapW + 10;
        } else {
            b.x+=b.dx; b.y+=b.dy;
            if(b.x<0||b.x>=mapW||b.y<0||b.y>=mapH) return false;
            if(map2d[Math.floor(b.y)][Math.floor(b.x)]===WALL) return false;
            return b.x>=0&&b.x<mapW&&b.y>=0&&b.y<mapH;
        }
    });
    // enemies shoot logic
    const camX_T = cam.x / T, camW_T = 600 / (T * currentZoom);
    const camY_T = cam.y / T, camH_T = 600 / (T * currentZoom);
    enemies.forEach(e=>{
        const isOnScreen = e.x >= camX_T - 1 && e.x <= camX_T + camW_T + 1 &&
                           e.y >= camY_T - 1 && e.y <= camY_T + camH_T + 1;
        if(isOnScreen){
            e.timer += TICK_MS;
            if(e.timer >= 5000){
                shootFrom(e);
                e.timer = 0; 
            }
        } else {
            e.timer = 0; 
        }
    });
    
    // yellow food spawn
    if(advLevel<4){
        yellowTimer+=TICK_MS;
        if(!yellowFood && yellowTimer>=15000){
            yellowTimer=0;
            spawnYellow();
        }
    }
    
    if(boss)updateBoss();

    // falling spikes (5s then 10s)
    const dropThreshold = isFirstDrop ? 5000 : 10000;
    if(advLevel>=2 && fallingTimer>=dropThreshold){
        fallingTimer=0;
        isFirstDrop=false;
        spawnFall();
    }
    fallingWarns.forEach(w=>{
        w.timer+=TICK_MS;
        if(w.timer < 2500){ w.x = Math.round(snake[0].x); }
    });
    const ready = fallingWarns.filter(w=>w.timer>=3000);
    fallingWarns = fallingWarns.filter(w=>w.timer<3000);
    ready.forEach(w=>{
        // Rơi thẳng từ trên xuống đáy cho chắc chắn
        activeSpikes.push({x:w.x, y:0, maxY:mapH});
        if(typeof sounds!=='undefined') sounds.crash();
    });
    activeSpikes.forEach(s=>s.y+=1.2);
    activeSpikes=activeSpikes.filter(s=>s.y <= mapH);
    
    checkHits();
}

function spawnFall(){
    fallingWarns.push({x: Math.round(snake[0].x), timer: 0});
}

function spawnYellow(){
    let rx, ry;
    for(let i=0; i<50; i++){
        // Spawn gần rắn (trong phạm vi +/- 8 ô)
        rx = Math.round(snake[0].x + (Math.random()*16 - 8));
        ry = Math.round(snake[0].y + (Math.random()*16 - 8));
        if(rx>=1 && rx<mapW-1 && ry>=1 && ry<mapH-1 && map2d[ry][rx]===EMPTY) {
            yellowFood = {x:rx, y:ry};
            break;
        }
    }
}

function tryMove(dx,dy){
    const nx=Math.round(snake[0].x)+dx,ny=Math.round(snake[0].y)+dy;
    if(nx<0||ny<0||nx>=mapW||ny>=mapH)return;
    if(map2d[ny][nx]===WALL)return;
    
    // Body collision check
    for(let i=1; i<snake.length; i++){
        if(snake[i].x === nx && snake[i].y === ny) return;
    }

    // Door check (1x2 tiles)
    if(door && nx===door.x && (ny===door.y || ny===door.y+1)){
        if(enemies.length === 0){
            if(!isTransitioning) nextLevel();
        } else {
            // Thông báo nhỏ hoặc âm thanh nếu chưa diệt hết địch (tùy chọn)
        }
        return;
    }
    
    if(spikes.some(s=>s.x===nx&&s.y===ny)){die("Va vào gai nhọn!");return;}
    
    // Move snake
    snake=[{x:nx,y:ny},...snake.slice(0,snake.length-1)];
    if(typeof sounds!=='undefined') sounds.move();
}

function checkHits(){
    if(!advRunning)return;
    const h=snake[0];
    
    // Spikes (falling/active)
    for(const s of activeSpikes){
        if(Math.abs(h.x-s.x)<0.8 && Math.abs(h.y-s.y)<0.8){sounds.hit();die("Đá rơi trúng đầu!");return;}
    }
    // Enemy Bullets (Hit head OR body)
    for(const b of enemyBullets){
        for(const segment of snake){
            if(Math.abs(b.x-segment.x)<0.7 && Math.abs(b.y-segment.y)<0.7){
                sounds.hit();die("Trúng đạn kẻ thù!");return;
            }
        }
    }
    // Boss Laser (Massive wall of fire, only 4 rows safe)
    if(boss&&boss.state==='laser'){
        if(h.x < boss.x && (h.y < boss.safeZoneY || h.y >= boss.safeZoneY + 4)){
            sounds.hit();die("Không kịp vào vùng an toàn!");return;
        }
    }
    // Items
    if(blueFood&&Math.abs(h.x-blueFood.x)<1.2&&Math.abs(h.y-blueFood.y)<1.2){
        sounds.eat(); ammo+=3;updateAmmo();blueFood=null;
    }
    if(yellowFood&&Math.abs(h.x-yellowFood.x)<1.2&&Math.abs(h.y-yellowFood.y)<1.2){
        sounds.eat(); 
        ammo += (advLevel === 4 ? 3 : 5); // 3 viên ở Lv4, 5 viên ở các Lv khác
        updateAmmo();
        yellowFood = null;
    }
    
    // Enemy/Boss Collision (Snake head or body)
    for(const segment of snake){
        // With normal enemies
        for(const e of enemies){
            if(Math.abs(segment.x - e.x) < 0.8 && Math.abs(segment.y - e.y) < 0.8){
                sounds.hit(); die("Va chạm với kẻ thù!"); return;
            }
        }
        // With Boss
        if(boss){
            if(segment.x >= boss.x && segment.x <= boss.x + boss.w &&
               segment.y >= boss.y && segment.y <= boss.y + boss.h){
                sounds.hit(); die("Va chạm với Boss!"); return;
            }
        }
    }
    
    // Combat: Snake Bullets vs Enemy Bullets (Cancellation)
    snakeBullets = snakeBullets.filter(sb => {
        let hit = false;
        for(let i=enemyBullets.length-1; i>=0; i--){
            const eb = enemyBullets[i];
            if(Math.abs(sb.x - eb.x) < 0.8 && Math.abs(sb.y - eb.y) < 0.8){
                enemyBullets.splice(i, 1); // Triệt tiêu đạn địch
                hit = true;
                break;
            }
        }
        return !hit; // Triệt tiêu đạn rắn
    });

    if(boss){
        snakeBullets=snakeBullets.filter(b=>{
            if(b.x>=boss.x&&b.x<=boss.x+boss.w&&b.y>=boss.y&&b.y<=boss.y+boss.h){
                boss.hp-=10;bossBar.style.width=Math.max(0,boss.hp/boss.maxHp*100)+'%';
                if(boss.hp<=0)winGame();return false;
            }return true;
        });
    }

    // Combat: Snake Bullets vs Enemies (Only if on screen)
    const cX = cam.x / T, cW = 600 / (T * currentZoom);
    snakeBullets=snakeBullets.filter(b=>{
        for(let i=enemies.length-1;i>=0;i--){
            const e = enemies[i];
            if(Math.abs(b.x-e.x)<1.2&&Math.abs(b.y-e.y)<1.2){
                // Chỉ chết nếu đang ở trong Camera
                if(e.x >= cX - 1 && e.x <= cX + cW + 1){
                    enemies.splice(i,1);
                    killedEnemies++;
                    updateEnemyCount();
                    if(typeof sounds!=='undefined') sounds.eat();
                    return false;
                }
            }
        }return true;
    });
}

function updateBoss(){
    boss.timer+=TICK_MS;
    if(boss.state==='idle'&&boss.timer>=2500){
        boss.timer=0;boss.attacks++;
        if(boss.attacks>=3){
            boss.attacks=0;boss.state='warn';
            // Chọn ngẫu nhiên vùng an toàn 4 ô (giới hạn trong mapH)
            boss.safeZoneY = Math.floor(Math.random()*(mapH-15)) + 5; 
            laserWarnEl.classList.remove('hidden');
        }else{
            sounds.enemyShoot();
            // Bắn đạn Boss có quỹ đạo đặc biệt
            for(let i=-2;i<=2;i++) {
                enemyBullets.push({
                    x: boss.x, 
                    y: boss.y + boss.h/2, 
                    dx: -0.6, 
                    dy: i * 0.1, 
                    type: 'boss'
                });
            }
        }
    }else if(boss.state==='warn'&&boss.timer>=3000){boss.state='laser';boss.timer=0;laserWarnEl.classList.add('hidden');}
    else if(boss.state==='laser'&&boss.timer>=1200){
        boss.state='idle';boss.timer=0;
        // Boss rơi túi tiếp tế màu xanh nước biển (3 viên đạn)
        blueFood={x:Math.floor(Math.random()*25)+3,y:Math.floor(Math.random()*(mapH-4))+2};
        yellowFood=null;
    }
}

function shootFrom(e){
    sounds.enemyShoot();
    const dx=snake[0].x-e.x,dy=snake[0].y-e.y,l=Math.sqrt(dx*dx+dy*dy)||1;
    enemyBullets.push({x:e.x,y:e.y,dx:dx/l*0.7,dy:dy/l*0.7});
}

function updateCam(){
    const VP_W=Math.floor(600/(T*currentZoom)),VP_H=Math.floor(600/(T*currentZoom));
    let targetX = (snake[0].x - VP_W / 2) * T;
    let targetY = (snake[0].y - VP_H / 2) * T;
    
    // Level 4: Giữ Boss trong khung hình
    if(advLevel===4 && boss){
        const bossEdge = (boss.x + boss.w) * T;
        const camRight = targetX + 600/currentZoom;
        if(camRight < bossEdge + 2*T) {
            targetX = bossEdge + 2*T - 600/currentZoom;
        }
    }

    targetX = Math.max(0, Math.min(targetX, mapW * T - 600 / currentZoom));
    targetY = Math.max(0, Math.min(targetY, mapH * T - 600 / currentZoom));
    const lerpFactor = 0.08; 
    cam.x += (targetX - cam.x) * lerpFactor;
    cam.y += (targetY - cam.y) * lerpFactor;
}

function updateAmmo(){ammoEl.innerText=`🔫 ${ammo}`;}
function updateEnemyCount(){
    document.getElementById('score').innerText = `${killedEnemies} / ${totalEnemies}`;
}
function nextLevel(){
    if(isTransitioning) return;
    isTransitioning = true;
    
    // Hiệu ứng chui vào cổng: Di chuyển thêm 2 bước tự động
    let count = 0;
    const enterInt = setInterval(()=>{
        snake=[{x:snake[0].x+1,y:snake[0].y},...snake.slice(0,snake.length-1)];
        count++;
        if(count>=3){
            clearInterval(enterInt);
            advLevel++;
            if(advLevel>4){winGame();return;}
            setTimeout(startAdv, 300);
        }
    }, 80);
}
function die(reason="Thất bại!"){
    stopAdv();
    isPaused = false;
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('final-score').innerText = `Lv${advLevel} - ${reason}`;
    goEl.classList.remove('hidden');
}
function winGame(){stopAdv();stopAdvBGM();winEl.classList.remove('hidden');}

// --- Adventure Cyberpunk BGM ---
function startAdvBGM() {
    if (advBgmActive) return;
    advBgmActive = true;
    const tempo = 135; // BPM
    const noteLen = 60 / tempo / 2; // 1/8 note
    let step = 0;
    
    const bassSeq = [55, 55, 65, 55, 73, 55, 65, 62]; // Frequencies (Hz)
    
    function playStep() {
        if (!advBgmActive) return;
        
        // Bass Synth
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassSeq[step % bassSeq.length], audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(bassSeq[step % bassSeq.length] * 0.8, audioCtx.currentTime + noteLen);
        
        g.gain.setValueAtTime(0.03, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + noteLen);
        
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + noteLen);
        
        // Hi-hat (Noise)
        if (step % 2 === 1) {
            const n = audioCtx.createOscillator(); // Using a high freq square for simplified hat
            const ng = audioCtx.createGain();
            n.type = 'square';
            n.frequency.setValueAtTime(8000, audioCtx.currentTime);
            ng.gain.setValueAtTime(0.01, audioCtx.currentTime);
            ng.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            n.connect(ng); ng.connect(audioCtx.destination);
            n.start(); n.stop(audioCtx.currentTime + 0.05);
        }

        step++;
        setTimeout(playStep, noteLen * 1000);
    }
    playStep();
}

function stopAdvBGM() {
    advBgmActive = false;
}

function advShoot(){
    if(!advRunning||ammo<=0)return;
    ammo--;updateAmmo();
    if(typeof sounds!=='undefined') sounds.enemyShoot();
    // Bắn theo hướng nhìn cuối cùng (lastDir)
    const bx = snake[0].x + lastDir.x;
    const by = snake[0].y + lastDir.y;
    snakeBullets.push({x:bx, y:by, dx:lastDir.x*2, dy:lastDir.y*2});
}

function draw(){
    CX.clearRect(0,0,600,600);
    CX.fillStyle='#0a0a0a';CX.fillRect(0,0,600,600);
    CX.save();
    CX.scale(currentZoom, currentZoom);
    CX.translate(-cam.x,-cam.y);
    const sCol = Math.floor(cam.x / T), eCol = Math.ceil((cam.x + 600 / currentZoom) / T);
    const sRow = Math.floor(cam.y / T), eRow = Math.ceil((cam.y + 600 / currentZoom) / T);

    // Walls
    CX.shadowBlur = 8; CX.shadowColor = '#0066ff';
    for(let r=Math.max(0, sRow); r<Math.min(mapH, eRow); r++) {
        for(let c=Math.max(0, sCol); c<Math.min(mapW, eCol); c++) {
            if(map2d[r][c]===WALL){
                CX.fillStyle='#1a2a3a';CX.fillRect(c*T,r*T,T,T);
                CX.fillStyle='#2a3d50';CX.fillRect(c*T+1,r*T+1,T-2,T-2);
            }
        }
    }
    CX.shadowBlur = 0;
    // Grid
    CX.strokeStyle='rgba(0, 255, 204, 0.05)';
    CX.lineWidth = 1/currentZoom;
    for(let i=Math.max(0, sCol); i<=Math.min(mapW, eCol); i++){CX.beginPath();CX.moveTo(i*T,cam.y);CX.lineTo(i*T,cam.y+600/currentZoom);CX.stroke();}
    for(let i=Math.max(0, sRow); i<=Math.min(mapH, eRow); i++){CX.beginPath();CX.moveTo(cam.x,i*T);CX.lineTo(cam.x+600/currentZoom,i*T);CX.stroke();}

    // Door
    if(door){
        CX.shadowBlur = 15; CX.shadowColor = '#00ff55';
        CX.fillStyle='#00ff55';CX.fillRect(door.x*T,door.y*T,T,T*2);
        CX.fillStyle='#00cc44';CX.fillRect(door.x*T+3,door.y*T+3,T-6,T*2-6);
        CX.shadowBlur = 0;
    }
    // Static Spikes
    CX.shadowBlur = 10; CX.shadowColor = '#ff3333'; CX.fillStyle='#aaaaaa';
    spikes.forEach(s=>{if(s.x>=sCol-1&&s.x<=eCol&&s.y>=sRow-1&&s.y<=eRow){CX.beginPath();CX.moveTo(s.x*T+T/2,s.y*T);CX.lineTo(s.x*T+T,s.y*T+T);CX.lineTo(s.x*T,s.y*T+T);CX.closePath();CX.fill();}});
    CX.shadowBlur = 0;

    // Active Spikes
    activeSpikes.forEach(s=>{ 
        CX.shadowBlur = 15; CX.shadowColor = '#ff3300';
        CX.fillStyle='#ff3300'; 
        CX.fillRect(s.x*T - 2, s.y*T - 2, T + 4, T + 4); 
    });

    // Falling Warns
    fallingWarns.forEach(w=>{
        if(Math.floor(Date.now()/150)%2===0){
            CX.shadowBlur = 0;
            CX.fillStyle='rgba(255,50,0,0.6)';
            CX.fillRect(w.x*T, 0, T, mapH*T);
        }
        CX.fillStyle='#ff0000'; CX.fillRect(w.x*T + 2, 0, T - 4, 6);
    });


    // Enemies
    CX.shadowBlur = 12; CX.shadowColor = '#aa44ff';
    enemies.forEach(e=>{if(e.x>=sCol-1&&e.x<=eCol&&e.y>=sRow-1&&e.y<=eRow){CX.fillStyle='#7700cc';CX.fillRect(e.x*T,e.y*T,T,T);CX.fillStyle='#aa44ff';CX.fillRect(e.x*T+3,e.y*T+3,T-6,T-6);}});
    CX.shadowBlur = 0;

    // Boss
    if(boss){
        CX.shadowBlur = 25; CX.shadowColor = '#ff0000';
        CX.fillStyle='#cc1100';CX.fillRect(boss.x*T,boss.y*T,boss.w*T,boss.h*T);
        CX.fillStyle='#ff4400';CX.fillRect(boss.x*T+4,boss.y*T+4,boss.w*T-8,boss.h*T-8);
        CX.shadowBlur = 0;
        CX.fillStyle='#fff';CX.beginPath();CX.arc((boss.x+boss.w/2)*T,(boss.y+boss.h*0.3)*T,8,0,Math.PI*2);CX.fill();
        CX.fillStyle='#f00';CX.beginPath();CX.arc((boss.x+boss.w/2)*T,(boss.y+boss.h*0.3)*T,4,0,Math.PI*2);CX.fill();
        if(boss.state==='laser'){
            CX.shadowBlur = 25; CX.shadowColor = '#ff0000';
            CX.fillStyle='rgba(255,0,0,0.85)';
            // Vẽ 2 khối Laze lớn
            CX.fillRect(cam.x, 0, 600/currentZoom, boss.safeZoneY*T);
            CX.fillRect(cam.x, (boss.safeZoneY+4)*T, 600/currentZoom, (mapH - (boss.safeZoneY+4))*T);
        } else if(boss.state==='warn'){
            CX.fillStyle='rgba(255,50,0,0.2)';
            // Vẽ vùng nguy hiểm sẽ có laze
            CX.fillRect(cam.x, 0, 600/currentZoom, boss.safeZoneY*T);
            CX.fillRect(cam.x, (boss.safeZoneY+4)*T, 600/currentZoom, (mapH - (boss.safeZoneY+4))*T);
        }
        CX.shadowBlur = 0;
    }

    // Items
    CX.shadowBlur = 15;
    if(blueFood){
        CX.shadowColor = '#0088ff'; CX.fillStyle='#0088ff';
        CX.fillRect(blueFood.x*T+3,blueFood.y*T+3,T-6,T-6);
    }
    if(yellowFood){
        const isLv4 = (advLevel === 4);
        const color = isLv4 ? '#00d9ff' : '#ffff00'; // Xanh dương ở Lv4, Vàng ở các Lv khác
        CX.shadowColor = color; CX.fillStyle = color;
        CX.fillRect(yellowFood.x*T+2,yellowFood.y*T+2,T-4,T-4);
    }
    CX.shadowBlur = 0;

    // Bullets
    CX.shadowBlur = 8; CX.shadowColor = '#ff8800'; CX.fillStyle='#ff8800';
    enemyBullets.forEach(b=>{if(b.x>=sCol-1&&b.x<=eCol&&b.y>=sRow-1&&b.y<=eRow){CX.beginPath();CX.arc(b.x*T+T/2,b.y*T+T/2,5,0,Math.PI*2);CX.fill();}});
    CX.shadowBlur = 10; CX.shadowColor = '#00ffff'; CX.fillStyle='#00ffff';
    snakeBullets.forEach(b=>{if(b.x>=sCol-1&&b.x<=eCol&&b.y>=sRow-1&&b.y<=eRow){CX.fillRect(b.x*T+6,b.y*T+6,8,8);}});
    CX.shadowBlur = 0;

    // Snake
    snake.forEach((s,i)=>{
        if(i===0){ CX.shadowBlur = 20; CX.shadowColor = '#ffffff'; CX.fillStyle='#ffffff'; } 
        else { CX.shadowBlur = 15; CX.shadowColor = '#00ffcc'; CX.fillStyle='#00ffcc'; }
        CX.fillRect(s.x*T+1,s.y*T+1,T-2,T-2);
    });
    CX.shadowBlur = 0;
    CX.restore();
}

// Controls
document.addEventListener('keydown',e=>{
    if (e.key === 'Escape' && advRunning) {
        togglePauseAdv();
        return;
    }
    if(!advRunning || isTransitioning || isPaused)return;
    const map={'ArrowUp':{x:0,y:-1},'ArrowDown':{x:0,y:1},'ArrowLeft':{x:-1,y:0},'ArrowRight':{x:1,y:0}};
    if(map[e.key]){
        e.preventDefault();
        if(!pressedKeys.includes(e.key)){
            pressedKeys.push(e.key);
            const newDir = map[e.key];
            if(curDir.x !== newDir.x || curDir.y !== newDir.y){
                curDir = newDir;
                lastDir = newDir; // Ghi nhớ hướng nhìn
                moveTimer = 0;
                tryMove(curDir.x, curDir.y);
            }
        }
    } else if(e.key===' '){advShoot();e.preventDefault();}
});
document.addEventListener('keyup',e=>{
    if(!advRunning)return;
    const map={'ArrowUp':{x:0,y:-1},'ArrowDown':{x:0,y:1},'ArrowLeft':{x:-1,y:0},'ArrowRight':{x:1,y:0}};
    if(map[e.key]){
        pressedKeys = pressedKeys.filter(k=>k!==e.key);
        if(pressedKeys.length > 0){
            curDir = map[pressedKeys[pressedKeys.length-1]];
        } else {
            curDir = {x:0,y:0};
        }
    }
});

document.getElementById('btn-pause-top').addEventListener('click', togglePauseAdv);
document.getElementById('btn-resume').addEventListener('click', togglePauseAdv);
document.getElementById('btn-pause-menu').addEventListener('click', () => {
    if (advRunning) {
        isPaused = false;
        exitAdv();
    }
});
})();
