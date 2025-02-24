/* Code to make it fit in Code pen */
// Canvas is rendered to the HTML canvas at the bottom of the game code with some 
// Fx just for fun.
const cctx = canvas.getContext("2d");
const fxCan = document.createElement("canvas");
const fxCtx = fxCan.getContext("2d");
var lineHandle;

var ready = false;
var linesReady = false;
const resize = () => {
  const ratio = 225 / 126;
  fxCan.width = canvas.height = innerHeight;
  fxCan.height = canvas.width = innerHeight * ratio;
  linesReady = false;
  clearTimeout(lineHandle,100);
  lineHandle = setTimeout(drawTVLines,100); // debounce so not to chew power
  canvas.style.left = ((innerWidth * (1/2) - innerHeight * ratio * (1/2)) | 0) + "px";
  ready = true;
  
}
function drawTVLines(){
  var y;
  const w = fxCan.width;
  const h = fxCan.height;
  const w10 = w * 0.1;
  const c = fxCtx;
  const g = c.createLinearGradient(0,0,w,0);
  g.addColorStop(0,"rgba(0,0,0,0)");
  g.addColorStop(0.2,"rgba(0,0,0,0.8)");
  g.addColorStop(0.8,"rgba(0,0,0,0.8)");
  g.addColorStop(1,"rgba(0,0,0,0)");
  c.strokeStyle = g;
  c.lineWidth = 226 * 2 / h;
  c.beginPath();
  for(y = 0; y < h; y += h / 126){
      c.moveTo(0,y + Math.random() * 0.2 - 0.1);
      c.lineTo(w,y + Math.random() * 0.2 - 0.1);      
      c.moveTo(w10,y + Math.random() * 0.2 - 0.1);
      c.lineTo(w-w10,y + Math.random() * 0.2 - 0.1);      
  }
  c.stroke();
 linesReady = true;
}
addEventListener("resize",resize);
setTimeout(resize,0);
focus();



/* Game starts here */
(() => {

    function drawSpriteOn(ctx, idx, x, y){
        var spr = spriteImg.sprites[idx];
        ctx.drawImage(spriteImg, spr.x, spr.y, spr.w, spr.h, x, y, spr.w, spr.h);
    }
    function drawSprite(idx, x, y){
        var spr = spriteImg.sprites[idx];
        ctx.drawImage(spriteImg, spr.x, spr.y, spr.w, spr.h, x, y, spr.w, spr.h);
    }
    function drawSpriteSize(idx, x, y, w, h){
        var spr = spriteImg.sprites[idx];
        ctx.drawImage(spriteImg, spr.x, spr.y, spr.w, spr.h, x, y, w, h);
    }
    function drawNumber(num, x, y){
        var i = num.length;
        while(i--){
            const c = (num.charCodeAt(i) - ZERO) * 2;
            const sx = numberSprites[c];
            const w = numberSprites[c+1]
            ctx.drawImage(numbers, sx, 0, w, 5, x - w, y, w, 5);
            x -= w + 1;
        }
    }
    function createBinImage(color,data) {
        var w,h,can,c,d,d32,x,y,i,bits
        can = document.createElement("canvas");
        can.width = w = data[0];
        can.height = h = data[1];
        data = data[2].split(",")
        c = can.getContext("2d");
        d = c.getImageData(0,0,w,h);
        d32 = new Uint32Array(d.data.buffer);
        for (y = 0; y < h; y++) {
            x = 0;
            i = w - Math.floor(w / 32) * 32;
            i = i === 0 ? 32 : i;
            while (x < w) {
                bits = parseInt(data.shift(),16);
                while (i--) { d32[(x++) + y * w] = bits & (1<<i) ? color : 0 }
                i = 32;
            }
        }
        c.putImageData(d,0,0);
        return can;
    }
    const color = 0xFFFFCC88; // 32Bit
    const bulletColor = "#88CCFF";
    const insertCoinImg = createBinImage(color, [41, 6, "1d2,6eee1929,9a,88a422ad,9a,4ce422ad,96,28c422ab,1d2,cea41929"]);
    const numbers = createBinImage(color, [37, 5, "1d,77377777,15,11444155,15,22567177,15,41715251,1d,77167477"]);
    const spriteImg = createBinImage(color, [ 26, 34,"91486,1006336,240449,10a3369,400546,2115a46,248599,802a89,4010,36dada0,921249,1bb1ac6,fe3fe6,fe1fc9,6c0d80,441046,3e01f0,410208,9484a4,808404,3ffffff,379b73b,1b34b36,ff87fc,7ff028,fff810,1fffc10,3fffe7c,3fffefe,3ffffff,3ffffff,3ffffff,3f07fff,3c01e00"]);
    const gameOverImg = createBinImage(color,[ 32, 21,"3c3bc1bf,7e7ce3bf,e6eef7b1,c0c6ffb4,cefeddbc,cefec9bc,c6c6c1b4,e6c6c1b1,7ec6c1bf,3deee3bf,0,3df77efe,7e637eff,e76362c3,c36368c3,c37778ff,c33678fe,c33668d8,e73e62cc,7e1c7ec6,3c1dfee7" ]);
    const ZERO = ("0").charCodeAt(0);
    const numberSprites = [0,3,4,1,6,3,10,3,14,3,18,3,22,3,26,3,30,3,34,3];
    spriteImg.sprites = [
        {x: 0, y: 24,w: 17,h: 10}, //0 base.png
        {x: 17,y: 24,w: 9, h: 9},  //1 Ship.png
        {x: 0, y: 0, w: 11,h: 8},  //2 expolode2.png
        {x: 11,y: 0, w: 11,h: 8},  //3 explode1.png
        {x: 13,y: 16,w: 13,h: 8},  //4 UFO2.png
        {x: 0, y: 16,w: 13,h: 8},  //5 UFO1.png
        {x: 0, y: 8, w: 11,h: 8},  //6 Alien1.png
        {x: 11,y: 8, w: 11,h: 8},  //7 Alien2.png
        {x: 22,y: 0, w: 2, h: 8},  //8 Bomb2.png
        {x: 15,y: 0, w: 2, h: 8},  //9 Bomb3.png
        {x: 24,y: 0, w: 2, h: 8},  //10 Bomb1.png
        {x: 22,y: 12,w: 4, h: 4},  //11 splash1.png
        {x: 22,y: 8, w: 4, h: 4},  //12 splash2.png
        {x: 3, y: 10,w: 5, h: 5},  //13 life
    ];
    const spriteNames = {
        base : 0,
        alien : [7,6],
        alienExplode : [2,3],
        ufo : [4,5],
        ship : 1,
        bombs : [8,9,10],
        splash : [11,12],
        life : 13,
    }
    const UFO_W = spriteImg.sprites[spriteNames.ufo[0]].w;
    const UFO_H = spriteImg.sprites[spriteNames.ufo[0]].h;
    const UFO_TIME = 60 * 2; // 60 frame per second * two seconds
    const UFO_STEP_FRAME = 4; // number of frame between moves
    const PLAYER_W = spriteImg.sprites[spriteNames.ship].w;
    const PLAYER_H = spriteImg.sprites[spriteNames.ship].h;
    const ALIEN_W = spriteImg.sprites[spriteNames.alien[0]].w;
    const ALIEN_H = spriteImg.sprites[spriteNames.alien[0]].h;
    const BOMB_W = spriteImg.sprites[spriteNames.bombs[0]].w;
    const BOMB_H = spriteImg.sprites[spriteNames.bombs[0]].h;
    
    const ALIEN_ROWS = 5;
    const ALIEN_COLUMNS = 11;
    const ALIEN_START_SPEED = 32;

    const INFO_H = 6; // space at top for lives score and what not
    const SHIP_BULLET_COUNT = 1;  // Max number of bullets at one time for player's ship
    const W_SPACING = 4;
    const H_SPACING = 4;
    const UFO_TOP = UFO_H / 2 + INFO_H | 0;
    const ALIEN_TOP = UFO_H * 2 + INFO_H;
    const SIDES = 15;
    const W = (ALIEN_W + W_SPACING) * ALIEN_COLUMNS + SIDES * 4;
    const H = (ALIEN_H + H_SPACING) * ALIEN_ROWS + SIDES * 4 + INFO_H;
    const GROUND = H - 10;
    const ALIEN_X_STEP = 2;
    const ALIEN_Y_STEP = 2;
    const BOMB_SPEED = 1;
    const BULLET_SPEED = 1;
    const BULLET_W = 2;
    const BULLET_H = 4;
    const ALIEN_BOMBING_RATE = 1 /(ALIEN_ROWS * ALIEN_COLUMNS);
    const UFO_ANIM_FRAME_COUNT = 8;  // number of frames 
    const BOMB_ANIM_FRAME_COUNT = 8;  // number of frames 
    const BOMB_ANIM_FRAMES = 3;  // number of frames 
    const BOMB_ANIM_SPLASH_FRAMES = 2;  // number of frames 
    const BASE_W = spriteImg.sprites[spriteNames.base].w;
    const BASE_H = spriteImg.sprites[spriteNames.base].h;
    const BASE_COUNT = 4;
    const BASE_PLAYER_CLEARANCE = BASE_H / 2 | 0;
    const BASE_SPACING = (((W - SIDES * 4) - (BASE_COUNT * BASE_W)) / (BASE_COUNT - 1)) | 0;
    const LIFE_BLINK_RATE = 8; // Blink rate of life used in frames
    const COIN_BLINK_RATE = 35; 
    const TIME_TO_RESTART = 10000; // Time for game ove to apear and alow continue
    const TIME_TILL_NEXT_LIFE = 2000; // time from death till next life
    const TIME_TILL_GAME_OVER = 2000; // time from last life death to game over displayed
    const TIME_TO_LEVEL_UP = 1000; // Time from level end to start of next
    const GET_READY_TIME = 1000;  // time to get ready
    
    const baseCan = document.createElement("canvas");
    baseCan.width = BASE_COUNT * BASE_W + BASE_SPACING * (BASE_COUNT - 1);
    baseCan.height = BASE_H ;
    const baseCtx = baseCan.getContext("2d");
    
    var can = document.createElement("canvas");
    can.width = W;
    can.height = H;
    var ctx = can.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const states = {
        init : 0,
        gameOver : 1,
        inPlay : 2,
        levelUp : 3,
        getReady : 4,
        insertCoin : 5,
        startGame : 6,
        nextLife : 7,

    };
    

    
    var stateChangeTimerHandle;
    var frameCount = 0;
    
    
    
    function drawCoins(blink = false) {
        if((blink && (frameCount  / COIN_BLINK_RATE | 0) % 2 === 0) || !blink){
            const x = (W / 2 | 0) - ((insertCoinImg.width + 9) / 2 | 0);
            ctx.drawImage(insertCoinImg,(W / 2 | 0) - ((insertCoinImg.width + 9) / 2 | 0),2);
            drawNumber(""+game.coins,x + insertCoinImg.width + 9,2);
        }
        
    }
    function drawScore() {
        drawNumber(game.score + "", W-12, 2);
    }
    function drawLives(blink = false) {
        var x;
        const len = game.lives - (blink ? 1 : 0);
        for(x = 0; x < len; x++){
             drawSprite(spriteNames.life, 2 + x * 6, 2);
        }
        if(blink && (frameCount  / LIFE_BLINK_RATE | 0) % 2){
            drawSprite(spriteNames.life, 2 + x * 6, 2);
        }
    }

    function drawLevel(){
        drawNumber(game.level + "", W-4, 2);
    }
    function showGameOver() {
        const x = W / 2 - gameOverImg.width | 0;
        const y = H / 2 - gameOverImg.height * 2 | 0;
        const w = gameOverImg.width * 2;
        const h = gameOverImg.height * 2;
        ctx.clearRect(x - 1, y - 1, w + 2, h + 2);
        ctx.drawImage(gameOverImg,x, y, w, h);

    }
    const player = {
        x: W / 2 | 0,
        dx: 0,
        dead : false,
        anim : 0,
        step() {
            if(!player.dead){
                this.x += this.dx;
                this.x = this.x < SIDES - PLAYER_W ? SIDES - PLAYER_W : this.x > W-SIDES +PLAYER_W ? W-SIDES +PLAYER_W : this.x; 
            }else{
                if(player.anim === 0){
                    game.state = states.nextLife;
                }
                player.anim  ++;


            }
        },
        draw() {
            if(player.dead){
                const f = (frameCount/4|0) % spriteNames.alienExplode.length;
                drawSpriteSize(spriteNames.alienExplode[f], player.x, GROUND, PLAYER_W, PLAYER_H);

            }else{
                drawSprite(spriteNames.ship, this.x, GROUND);
            }
        },
    };
    
    function List(type, extraProperties){
        const list = Object.assign([],{
                each(cb){
                    var i;
                    for(i = 0; i < list.length; i++) { cb(list[i],i) }
                },
                filtered(cb){
                    var i;
                    for(i = 0; i < list.length; i++){
                        if(cb(list[i],i) === false) { list.splice(i--,1) }
                    }
                },
                add(...args) { list.push(new type(...args)) },
                drawArgs(...args) { for(const item of list){ item.draw(...args) } },
                draw() { for(const item of list){ item.draw() } },
            },
            extraProperties
        );
        return list
        
        
    }
    function Bullet(x) {
        this.x = player.x + PLAYER_W / 2 - BULLET_W / 2 | 0;
        this.y = GROUND;
        this.dead = false;

    }
    Bullet.prototype = {
        draw() {
            ctx.fillStyle = bulletColor;
            ctx.fillRect(this.x,this.y,BULLET_W, BULLET_H);
        },
        move() {  this.y -= BULLET_SPEED }
    }
    function Bomb(x,y){
        this.x = x;
        this.y = y;
        this.hitGround = false;
        this.animate = 0;
    }
    Bomb.prototype = {
        draw() {
            this.animate += 1;
            if(this.hitGround){
                drawSprite(spriteNames.splash[(this.animate / BOMB_ANIM_FRAME_COUNT | 0) % BOMB_ANIM_SPLASH_FRAMES],this.x - 2 , this.y - 4);
            }else{
                drawSprite(spriteNames.bombs[(this.animate / BOMB_ANIM_FRAME_COUNT | 0) % BOMB_ANIM_FRAMES], this.x, this.y)                
            }
        },
        move() {
            if(!this.hitGround){
                this.y += BOMB_SPEED;
                if(!player.dead && this.y > GROUND - PLAYER_H && this.x+ 1 > player.x && this.x-1 < player.x + PLAYER_W){
                    this.y = GROUND + PLAYER_H;
                    player.dead = true;
                    player.anim = 0;
                    this.animate = 0;
                    this.hitGround = true;

                }else if(this.y + BOMB_H > GROUND + PLAYER_H){
                    this.y = GROUND + PLAYER_H;
                    this.animate = 0;
                    this.hitGround = true;
                }
            }
        }
    }    
    function Alien(x, y, frame) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.dieCount = 0;
        this.frame = frame;
    }
    Alien.prototype = {
        draw(frameStep) { 
            if(this.alive){
                const f = (this.frame + frameStep) % spriteNames.alien.length;
                drawSprite(spriteNames.alien[f], this.x, this.y)
            }else{
                this.dieCount += 1;
                if(this.dieCount < 32){
                    const f = (this.dieCount/4|0) % spriteNames.alienExplode.length;
                    drawSprite(spriteNames.alienExplode[f], this.x, this.y)
                }
            }
        }
    }   
    function Base(idx){
        this.x = SIDES * 2 + idx * (BASE_W + BASE_SPACING);
        this.y = GROUND - BASE_H - BASE_PLAYER_CLEARANCE;
        this.active = true;
        this.shape = [];
        for (let j = 0; j < BASE_W; j++) { this.shape.push([0, BASE_H]) }
        drawSpriteOn(baseCtx, spriteNames.base, this.x - SIDES * 2, 0);
    }
    Base.prototype = {
        checkHit(x, y, w, h, dy) { 
            if (x + w < this.x || x > this.x + BASE_W || y + h < y || y > this.y + BASE_H) {
                return false;
            }
            var xx = x - this.x;
            xx = xx < 0 ? 0 : xx >= BASE_W - 1 ? BASE_W - 2 : xx;
            const idx = dy < 0 ? 1 : 0;
            const minY = Math.min( this.shape[xx][idx], this.shape[xx + 1][idx]);
            if((idx && y < this.y + minY) || (!idx && y + h > this.y + minY)){          
               const bSprite = spriteNames.bombs[0];
               x -= SIDES * 2;
               if(idx){
                   y -= 1 + this.y;
                   this.shape[xx][idx] = y;
                   this.shape[xx + 1][idx] = y;
               }else{
                   y += (h / 2 | 0) - this.y
                   this.shape[xx][idx] = y + h;
                   this.shape[xx + 1][idx] = y + h;
               }
               drawSpriteOn(baseCtx, bSprite + 1, x - 1 , y);               
               drawSpriteOn(baseCtx, bSprite, x, y);            
               drawSpriteOn(baseCtx, bSprite + 1, x + 1, y);          
               return true;
            }
            return false;
        },
        isClear() {
            var size = 0;
            for(const s of this.shape) {
                if (s[0] >= s[1] - 1) {
                    s[1] = -(s[0] = 1000);
                } else { size += s[1] - s[0] }
            }
            if (size < 15) {
                baseCtx.clearRect(this.x - SIDES * 2, 0, BASE_W, BASE_H);
                return true;
            }           
            return false;
        }
    }   
    
    const bullets = List(
        Bullet, {
            shoot(x){
                if(bullets.length < SHIP_BULLET_COUNT && !player.dead){  bullets.add(x) }
            },
            step() {
                this.filtered(bullet=> {
                    bullet.move();
                    if(bullet.y < 0 || bullet.dead) { return false }
                });
            },
        }
    );
    const bombs = List(
        Bomb, {
            step(){
                this.filtered(bomb => {
                    var remove = false;
                    if(bomb.hitGround && bomb.animate > 16){
                        remove = true;
                    }else{
                        bomb.move();
                        bullets.filtered(b => {
                           if(!(bomb.x + BOMB_W < b.x || bomb.x > b.x + BULLET_W  ||
                               bomb.y + BOMB_H < b.y || bomb.y > b.y + BULLET_H)){
                               remove = true;    
                               return false;
                           }
                        })
                    }
                    return ! remove;
                });
            }           
        }
    )
    const aliens = List(
        Alien, {
            speed : 32,
            direction : ALIEN_X_STEP,
            counter : 0,
            frame : 0,
            stepDown : false,          
            step() {
                aliens.counter += 1;
                var aliveCount = 0;
                aliens.filtered(alien => {
                    if(alien.alive){
                        bullets.filtered(bullet => {
                            if(!bullet.dead && !(bullet.x + BULLET_W < alien.x || bullet.x > alien.x + ALIEN_W ||
                            bullet.y + BULLET_H < alien.y || bullet.y > alien.y + ALIEN_H)){
                                alien.alive = false;
                                game.score += 2;
                                return false;
                            }
                        })
                        aliveCount ++;
                    }else{
                        if(alien.dieCount > 32){
                            return false;
                        }                    
                    }
                });
                

                aliens.speed = (aliveCount / 55) * (ALIEN_START_SPEED - (game.level >= ALIEN_START_SPEED ? ALIEN_START_SPEED : game.level)) + 2| 0;
                
    
                if((aliens.counter % aliens.speed) === 0){
                    let dy = 0;
                    let dx = aliens.direction;
                    
                    if(aliens.stepDown ) {
                        dy = ALIEN_Y_STEP;
                        dx = 0;
                        aliens.direction = -aliens.direction;
                        aliens.stepDown = false;
                    }               
                    aliens.frame += 1;
                    aliens.each(alien => {
                        alien.y += dy;
                        alien.x += dx;
                        if(alien.alive){
                            if(Math.random() < ALIEN_BOMBING_RATE){
                                const offset = Math.random() < 0.5 ? 1 : 0;  // Offset so that bases dont have thin sections remaining
                                bombs.add(alien.x + offset + ALIEN_W / 2 | 0, alien.y + ALIEN_H);
                            }
                            if(bases.length > 0 && alien.y + ALIEN_H > GROUND - BASE_H - BASE_PLAYER_CLEARANCE){
                                bases.length = 0;
                            }
                            if(alien.y + ALIEN_H > GROUND){
                                game.state = states.gameOver;
                                game.canContinue = false;  // NOTE this line must come after the state change
                            }
                            if(!aliens.stepDown){
                                if(aliens.direction > 0 && alien.x > W - SIDES - ALIEN_W){
                                    aliens.stepDown = true;
                                }else if(aliens.direction < 0 && alien.x < SIDES){
                                    aliens.stepDown = true;
                                }
                            }
                        }
                    })
                }
                if(aliveCount === 0){
                    game.state = states.levelUp;
                }               
            },
            draw() {
                aliens.drawArgs(aliens.frame)
            },
            create() {
                //aliens.speed = alienStartSpeed;
                aliens.direction = ALIEN_X_STEP;
                aliens.counter = 0;
                var y,x;
                if(aliens.length === 0){
                    for(y = 0; y < ALIEN_ROWS; y ++){
                        for (x = 0; x < ALIEN_COLUMNS; x++) {
                            aliens.add(x * (ALIEN_W + W_SPACING) + SIDES, y * (ALIEN_H + H_SPACING) + ALIEN_TOP + game.level, y);
                        }
                    }
                }
        
            }       
            
        }
    )
    const UFO = {
        x : -2 - UFO_W,
        direction : 1,
        frame : 0,
        nextTime : UFO_TIME,
        explode:false,
        set side(val) {
            if(val === "right"){
                UFO.nextTime = UFO_TIME;
                UFO.direction = -1;
                UFO.x = W + 2;
            } else {
                UFO.nextTime = UFO_TIME;
                UFO.direction = 1;
                UFO.x = - 2 - UFO_W;
            }
            UFO.explode = false;
        },
        draw(){
            if(UFO.explode){
                // using alien explosion sprites 
                const f = (UFO.frame/4|0) % spriteNames.alienExplode.length;
                drawSpriteSize(spriteNames.alienExplode[f], UFO.x, UFO_TOP, UFO_W, UFO_H)               
            }else if(UFO.nextTime === 0){
                drawSprite(spriteNames.ufo[(UFO.frame / UFO_ANIM_FRAME_COUNT|0) % spriteNames.ufo.length], UFO.x, UFO_TOP);
            }
        },
        step(){
            UFO.frame++;
            if(UFO.explode){
                if(UFO.frame > 32){
                    UFO.side = UFO.direction > 0 ? "right" : "left";
                    UFO.explode = false;
                }
                
            }else if(UFO.nextTime === 0){
                if(UFO.frame % UFO_STEP_FRAME === 0){
                    UFO.x += UFO.direction;
                }
                bullets.filtered(bullet => {
                    if(!bullet.dead && !(bullet.x + BULLET_W < UFO.x || bullet.x > UFO.x + UFO_W ||
                    bullet.y + BULLET_H < UFO_TOP || bullet.y > UFO_TOP + ALIEN_H)){
                        UFO.explode = true;
                        game.score += 10;
                        UFO.frame = 0;
                        return false;
                    }
                })
                if(UFO.direction > 0){
                    if(UFO.x > W){
                        UFO.side = "right";
                    }
                } else {
                    if(UFO.x + UFO_W < 0){
                        UFO.side = "left";
                    }
                }
            }else{
                UFO.nextTime -= 1;
            }
        }
    }
    const bases = List(
        Base, {
            create() {
                bases.length = 0;
                for (let i = 0; i < BASE_COUNT; i++) { bases.add(i) }
            },
            draw() { 
                if(bases.length > 0){
                    ctx.drawImage(baseCan, SIDES * 2, GROUND - BASE_H - BASE_PLAYER_CLEARANCE);
                }
            },
            step() {
                baseCtx.globalCompositeOperation = "destination-out";
                bases.filtered((base, idx) => {
                    bullets.filtered(b => {
                        if (!b.dead && base.checkHit(b.x, b.y, BULLET_W, BULLET_H, -1)) { return false }
                    });
                    bombs.filtered(b => {
                        if (base.checkHit(b.x, b.y, BOMB_W, BOMB_H, 1)) { return false }
                    });
                    return !base.isClear()
                });
                baseCtx.globalCompositeOperation = "source-over";
            }
        }
    );
 

    const game = {
        score : 0,
        lives : 0,
        coins : 0,
        level : 1,
        canContinue : true,
        canRestart : true,
        gameState : 0,
        move : false,
        shoot : false,
        aliens : false,
        alienFreeze : false,
        showGameOver : false,
        blinkLives : false,
        currentState(){
            game.restart();
            keyboard.addCallback("Digit1",()=>{
                if(game.coins < 99){
                    game.coins += 1;
                }
                return false;
            })
            keyboard.addCallback("KeyS",()=>{
                if(game.coins > 0){
                    if(game.canContinue){
                        game.coins -= 1;
                        game.lives += 3;
                        game.state = states.nextLife
                        instructs.textContent= "";
                    }else if(game.canRestart){
                        game.coins -= 1;
                        game.lives += 3;
                        game.state = states.startGame;
                        instructs.textContent= "";
                    }
                }
                return false;
            })
            game.currentState = game.step
            game.state = states.insertCoin;
            
        },
        startLevel(){
            game.level += 1;
            bases.length = 0;
            aliens.length = 0;
            UFO.side = "left";
            aliens.create();
            bases.create(); 
        },
        restart() {
            game.level = 0;
            bombs.length = 0;
            bullets.length = 0;            
            game.startLevel();
            player.dead = false;
            player.x = W / 2 | 0;
            keys.anyKey = false; 

        },
        nextLife() {
            bombs.length = 0;
            bullets.length = 0;
            if(game.lives > 0){ return  states.getReady }
            return states.gameOver;
        },
        draw(){
            bases.draw();
            bullets.draw()
            bombs.draw();
            UFO.draw();
            aliens.draw();
            drawScore();
            drawLevel();
            if(game.showGameOver){ showGameOver() }
            if(game.showPlayer){ player.draw() }
            drawLives(game.blinkLives);
            drawCoins(game.blinkCoins);
        },
        step() {
            if(game.gameState !== states.gameOver){
                if(game.shoot){
                    if (keys.ArrowUp) { bullets.shoot(player.x + 5) }
                }
                player.dx = 0;
                if(game.move){
                    if (keys.ArrowLeft) { player.dx = -1 }
                    if (keys.ArrowRight) {  player.dx = 1 }
                }
                if(game.move || game.shoot){ player.step() }
                if(game.shoot){  bullets.step() }
                if(game.aliens){
                    bombs.step();
                    bases.step();
                    if(!game.alienFreeze){
                        aliens.step();
                    }
                    UFO.step();    
                }
            }
        },
        stepState(shoot, move, aliens = false, alienFreeze = false){
            game.shoot = shoot;
            game.move = move;
            game.aliens = aliens;    
            game.alienFreeze = alienFreeze;  
        },
        drawState(showPlayer, blinkLives = false, blinkCoins = false, showGameOver = false){
            game.showPlayer = showPlayer;
            game.blinkLives = blinkLives;
            game.blinkCoins = blinkCoins;
            game.showGameOver = showGameOver;
            
        },
        set state(state){  
            const nextState = (s, t) => (state = s, time = t);
            var time = -1;
            clearTimeout(stateChangeTimerHandle);
            game.canRestart = false;
            game.canContinue = false;
            const prevState = game.gameState;
            game.gameState = state;
            if(state === states.insertCoin){
                game.restart();
                game.canRestart = true;
                game.stepState(false,false,true);
                game.drawState(false,false,true)
            }else if(state === states.startGame){
                game.restart();
                game.stepState(false,true);
                game.drawState(true,true);
                nextState(states.inPlay, GET_READY_TIME);
            }else if(state === states.getReady){
                UFO.side = "left";
                player.dead = false;
                player.x = W / 2 | 0;  
                game.stepState(false,true);
                game.drawState(true,true);
                nextState(states.inPlay, GET_READY_TIME);
            }else if(state === states.levelUp){
                bullets.length = 0;
                game.stepState(false,true, true, true, true);
                nextState(states.inPlay, TIME_TO_LEVEL_UP);
            }else if(state === states.gameOver){
                game.lives = 0;
                game.canContinue = true;
                player.dead = false;
                player.x = W / 2 | 0;  
                game.drawState(false,false,true,true);
                nextState(states.insertCoin, TIME_TO_RESTART);
            }else if(state === states.nextLife){
                game.stepState(false, false, true, true);
                game.drawState(true,false,false,false);
                state = game.nextLife();
                time = state === states.getReady ? TIME_TILL_NEXT_LIFE : TIME_TILL_GAME_OVER;
            }else if(state === states.inPlay){
                if (prevState === states.levelUp) { game.startLevel() }
                else { game.lives -= 1 }
                game.stepState(true, true, true, false);
                game.drawState(true);
            }
            if(time > -1) {
                stateChangeTimerHandle = setTimeout(()=>game.state = state, time);
            }
        },
        
    }
    var fade = 0;
    function mainLoop(){
        frameCount += 1;
        ctx.clearRect(0,0,can.width,can.height);
        game.currentState();

        game.draw();
        requestAnimationFrame(mainLoop);
        if(ready){
          if(fade < 1){
             fade += 0.02;
             if(fade >= 1){
                 canvas.style.opacity = 1;
             }else{
                 canvas.style.opacity = (fade ** 2);
             }
           
          }
          cctx.globalCompositeOperation = "copy";
          cctx.imageSmoothingEnabled = false; 
          cctx.drawImage(can,0,0,cctx.canvas.width,cctx.canvas.height);       
         if(linesReady && cctx.canvas.height > H * 3){
          cctx.globalCompositeOperation = "source-over";
          cctx.imageSmoothingEnabled = true; 
          cctx.drawImage(fxCan,0,0,cctx.canvas.width,cctx.canvas.height);       
          
         }
         
        }
        
    }
    


    const keyboard = (() => {
        const keys = {
            anyKey : false,
        };
        const callbacks = {};
        const callbackOnce = {};
        function keyEvents(e){
            const isDown = e.type === "keydown";
            if(keys[e.code] !== undefined){
                keys[e.code] = isDown;
                e.preventDefault();
            }
            var anyKey = isDown;
            if(isDown && !keys.anyKey){
                if(callbacks.anyKey) {
                    anyKey = callbacks.anyKey(e) === true;
                }
                if(callbackOnce.anyKey) {
                    anyKey = callbackOnce.anyKey(e) === true;
                    delete callbackOnce.anyKey;
                }
                keys.anyKey = anyKey;
            }
            if(callbacks[e.code] && isDown){
              callbacks[e.code](e);
            }
            if(callbackOnce[e.code] && isDown){
                callbackOnce[e.code](e);
                delete callbackOnce[e.code];
            }
        }
        const API = {
            start(...keyNames){
                for(const key of keyNames){
                    keys[key] = false;
                }
                addEventListener("keyup", keyEvents);
                addEventListener("keydown", keyEvents);
                if (window.keys === undefined) { window.keys = keys }
                return keys;
            },
            stop(){
                removeEventListener("keyup", keyEvents);
                removeEventListener("keydown", keyEvents);
            },
            addCallback(keyName, callback){
                callbacks[keyName] = callback;
            },
            addCallbackOnce(keyName, callback){
                callbacksOnce[keyName] = callback;
            }
        }
        return API;
    })();   
    const keys = keyboard.start("ArrowUp","ArrowLeft","ArrowRight");
    
    
    requestAnimationFrame(mainLoop);
})();