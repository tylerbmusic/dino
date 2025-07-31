// ==UserScript==
// @name         Dino game stuff
// @version      1.0
// @description  Some codes for the dino game
// @author       GGamerGGuy
// @match        *chrome*
// @grant        none
// ==/UserScript==
setTimeout(() => {
    Runner().isDarkMode = true; //Error handling go brrrr
    
    document.body.style.overflow = 'hidden';

    if (!localStorage.getItem('inited')) {
        localStorage.setItem('inited', 'true');
        localStorage.setItem('djEnabled', '0');
        localStorage.setItem('djAmount', '1');
        localStorage.setItem('rrEnabled', '0');
        localStorage.setItem('potEnabled', '0');
        localStorage.setItem('mpEnalbed', '0')
        localStorage.setItem('theme', 'Kasey');
        localStorage.setItem('scale', '5');
        localStorage.setItem('mmDuration', '8');
    }

    let c = document.getElementById('control-buttons');
    c.style.display = 'flex';
    c.style.float = 'none';
    c.style.justifyContent = 'center';
    c.innerHTML = ``;
    c.innerHTML += `<button id="duckBtn">Duck</button>`;
    if (localStorage.getItem('rrEnabled') == '1') {
        c.innerHTML += `<button id="rrUp">Move Up</button><button id="rrDown">Move Down</button>"`;
    }
    setTimeout(() => {
        let btn = document.getElementById('duckBtn');
        btn.addEventListener('pointerdown', () => {
            if (Runner().activated && !Runner().crashed && !Runner().paused) {
                if (Runner().tRex.jumping) {
                    Runner().tRex.setSpeedDrop()
                } else if (!Runner().tRex.jumping && !Runner().tRex.ducking) {
                    Runner().tRex.setDuck(true)
                }
            }
        });
        btn.addEventListener('pointerup', () => {
            Runner().tRex.speedDrop = false;
            Runner().tRex.setDuck(false);
        });
    }, 100);







    //Double Jump
    if (localStorage.getItem('djEnabled') == '1') {
        window.maxJumps = Number(localStorage.getItem('djAmount')); //Maximum number of Enter jumps, default 1
        window.jumps = 0;
        Trex.prototype.startJump = function(speed) {
            if (!this.jumping || window.jumps < window.maxJumps) {
                if (this.jumping) {
                    window.jumps++;
                } else {
                    window.jumps = 0;
                }
                this.update(0, Status.JUMPING);
                this.jumpVelocity = this.config.initialJumpVelocity - speed / 10;
                this.jumping = true;
                this.reachedMinHeight = false;
                this.speedDrop = false;
                if (this.config.invertJump) {
                    this.minJumpHeight = this.groundYPos + this.config.minJumpHeight
                }
            }
        }
    }








    //Dino road runner
    if (localStorage.getItem('rrEnabled') == '1') {
        var interval = null;
        let downFunc = function(e) {
            if (e == "down" && !interval) {
                interval = setInterval(() => {
                    Runner().tRex.groundYPos -= 3;
                    Runner().tRex.groundYPos = Math.max(0, Math.min(93, Runner().tRex.groundYPos));
                    Runner().tRex.yPos = Runner().tRex.groundYPos;
                }, 10);
            } else if (e == "up" && !interval) {
                interval = setInterval(() => {
                    Runner().tRex.groundYPos += 3;
                    Runner().tRex.yPos = Runner().tRex.groundYPos;
                    Runner().tRex.groundYPos = Math.max(0, Math.min(93, Runner().tRex.groundYPos));
                }, 10);
            }
        }
        let upFunc = function() {
            clearInterval(interval);
            interval = null;
        }
        document.addEventListener("keydown", (e) => {
            if (e.key == "w")  {
                downFunc('down');
            } else if (e.key == "s") {
                downFunc('up');
            }
        });
        document.addEventListener("keyup", (e) => {
            if (e.key == "w" || e.key == "s") {
                upFunc();
            }
        });
        document.getElementById('rrDown').addEventListener('pointerdown', () => {downFunc('down')});
        document.getElementById('rrDown').addEventListener('pointerup', upFunc);
        document.getElementById('rrUp').addEventListener('pointerdown', () => {downFunc('up')});
        document.getElementById('rrUp').addEventListener('pointerup', upFunc);
        

        setInterval(() => {
            Runner().horizon.obstacleTypes[1].yPosMobile = Math.random() * 90;
            Runner().horizon.obstacleTypes[1].yPos = Runner().horizon.obstacleTypes[1].yPosMobile;
            Runner().horizon.obstacleTypes[0].yPosMobile = Math.random() * 105;
            Runner().horizon.obstacleTypes[0].yPos = Runner().horizon.obstacleTypes[0].yPosMobile;
        }, 1000);
    }








    //"Potato PC" (Runs on document click)
    if (localStorage.getItem('potEnabled') == '1') {
        window.isInit = false;
        document.body.addEventListener('pointerup', (e) => {
            if (!window.isInit) {
                window.isInit = true;
                function rb() {
            let rand = (Math.random()*300)+100;
            for (var i in Runner().horizon.obstacles) {
                let o = Runner().horizon.obstacles[i];
                o.xPos += rand;
                if (Math.random() < 0.95) {
                    o.collisionBoxes = [];
                }
            }
            Runner().tRex.yPos = 93;
            if (Math.random() < 0.1 && Runner().horizon.obstacles.length >= 1) {
                let o = Runner().horizon.obstacles;
                o[Math.floor(Math.random()*o.length)].remove = true;
                if (Math.random() < 0.7) {
                    let o = Runner().horizon.obstacles;
                o[Math.floor(Math.random()*o.length)].yPos -= (Math.random() * 50)+20;
                }
            }
            setTimeout(rb, (Math.random()*2500)+500);
        }
        rb();
        function lag() {
            let currTime = Date.now();
            let num = 0;
            let waitTime = Math.random()*500;
            while (Date.now() < (currTime+waitTime)) {
                num++;
            }
            if (Math.random() < 0.4) {
                document.body.style.transform = `scale(${(Math.random()*0.2)+0.8}) rotate(${(Math.random()*10)-5}deg)`;
            }
            setTimeout(lag, (Math.random()*2500)+500);
        }
        lag();
        function tankFrames() {
            let currTime = Date.now();
            let FPS = (Math.random()*50)+10;
            let ms = 1e3/FPS;
            let n = 0;
            while (Date.now() < currTime+ms) {
                n++;
            }
            setTimeout(tankFrames, 5);
        }
        tankFrames();
        Runner().tRex.config.gravity = 0.3;
        window.scaleHeight = 1;
        window.scaleWidth = 1;
        window.rotate = 0.2;
        window.tweakHeight = 0;
        Runner().tRex.draw = function(x, y) {
                var that = Runner().tRex;
                let sourceX = x;
                let sourceY = y;
                let sourceWidth = that.ducking && that.status !== Status.CRASHED ? that.config.widthDuck : that.config.width;
                let sourceHeight = that.config.height;
                const outputHeight = sourceHeight;
                if (that.altGameModeEnabled) {
                    assert(that.config.widthCrashed)
                }
                const outputWidth = that.altGameModeEnabled && that.status === Status.CRASHED ? that.config.widthCrashed : that.config.width;
                const runnerImageSprite = getRunnerImageSprite();
                assert(runnerImageSprite);
                if (that.altGameModeEnabled) {
                    if (that.jumping && that.status !== Status.CRASHED) {
                        assert(that.config.widthJump);
                        sourceWidth = this.config.widthJump
                    } else if (that.status === Status.CRASHED) {
                        assert(that.config.widthCrashed);
                        sourceWidth = that.config.widthCrashed
                    }
                }
                if (IS_HIDPI) {
                    sourceX *= 2;
                    sourceY *= 2;
                    sourceWidth *= 2;
                    sourceHeight *= 2
                }
                sourceX += that.spritePos.x;
                sourceY += that.spritePos.y;
                if (that.flashing) {
                    if (that.timer < that.config.flashOn) {
                        that.canvasCtx.globalAlpha = .5
                    } else if (that.timer > that.config.flashOff) {
                        that.timer = 0
                    }
                }
                if (that.ducking && that.status !== Status.CRASHED) {
                    that.canvasCtx.save();
                    that.canvasCtx.scale(window.scaleWidth,window.scaleHeight);
                    that.canvasCtx.rotate(window.rotate);
                    that.canvasCtx.drawImage(runnerImageSprite, sourceX, sourceY, sourceWidth, sourceHeight, that.xPos/(2*window.scaleWidth), that.yPos-window.tweakHeight, that.config.widthDuck, outputHeight);
                    that.canvasCtx.restore();
                } else if (that.altGameModeEnabled && that.jumping && that.status !== Status.CRASHED) {
                    assert(that.config.widthJump);
                    const spriteDefinition = getRunnerSpriteDefinition();
                    assert(spriteDefinition);
                    assert(spriteDefinition.tRex);
                    const jumpOffset = spriteDefinition.tRex.jumping.xOffset * (IS_HIDPI ? 2 : 1);
                    that.canvasCtx.save();
                    that.canvasCtx.scale(window.scaleWidth,window.scaleHeight);
                    that.canvasCtx.rotate(window.rotate);
                    that.canvasCtx.drawImage(runnerImageSprite, sourceX, sourceY, sourceWidth, sourceHeight, (that.xPos - jumpOffset)/(2*window.scaleWidth), that.yPos-window.tweakHeight, that.config.widthJump, outputHeight);
                    that.canvasCtx.restore();
                } else {
                    if (that.ducking && that.status === Status.CRASHED) {
                        that.xPos++
                    }
                    that.canvasCtx.save();
                    that.canvasCtx.scale(window.scaleWidth,window.scaleHeight);
                    that.canvasCtx.rotate(window.rotate);
                    that.canvasCtx.drawImage(runnerImageSprite, sourceX, sourceY, sourceWidth, sourceHeight, (that.xPos)/(2*window.scaleWidth), that.yPos-window.tweakHeight, outputWidth, outputHeight);
                    that.canvasCtx.restore();
                }
                that.canvasCtx.globalAlpha = 1
            }
        let func = Runner().tRex.startJump;
        Runner().tRex.startJump = function(speed) {
            setTimeout(() => {
                func.call(Runner().tRex, speed);
            }, Math.random()*1000);
        }
        function antMan() {
            window.rotate = Math.random() - 0.5;
            window.scaleWidth = Math.random()*4 + 0.5;
            if (Math.random() < 0.1 && !Runner().crashed && Runner().activated) {
                Runner().gameOver();
                setTimeout(() => {
                alert("Error - Disconnected from server."); //It's funny because there's no server
                }, 500);
            }
            setTimeout(antMan, Math.random()*5000);
        }
        antMan();
        function speedy() {
            if (Runner().activated && !Runner().paused) {
            Runner().currentSpeed += 10;
            setTimeout(() => {
                Runner().currentSpeed -= 10;
                setTimeout(speedy, Math.random()*10000);
            }, Math.random()*2000);
            }
        }
        speedy();
            }
        });
    }


























    /**************\
   |====DINOPOLY====|
    \**************/
    if (localStorage.getItem('mpEnabled') == '1') {
        window.music = new Audio('monopoly.mp3');
        window.music.loop = true;
        let div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.fontFamily = 'sans-serif';
        div.style.textAlign = 'center';
        div.style.margin = '0';
        div.style.top = '0';
        div.style.left = '0';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.background = '#223';
        div.style.color = 'white';
        document.body.appendChild(div);
        div.id = 'dinopoly-div';
        div.innerHTML = `
            <div id="start-game-btn" style="position: fixed;display: flex;justify-content: center;align-content: center;align-items: center;width: 100%;height: 100%;backdrop-filter: blur(10px) brightness(0.8);z-index: 1;">
                <button style="scale: 5;margin: auto;" onclick="startGame()">START</button>
            </div>
            <div id="messagebox" style="position: fixed;text-align: center;padding: 5px 20px;left: -30%;border-radius: 0px 25px 25px 0px;border-top: 1px solid gray;border-bottom: 1px solid gray;border-image: initial;border-left: none;background: linear-gradient(138deg, rgba(112, 0, 255, 0.14), transparent);backdrop-filter: blur(20px) contrast(0.8) brightness(0.8);box-shadow: black 0px 0px 20px 0px;top: 5%;max-width: 24%;transition: left 1s;border-right: solid 2px gray;">
                <span id="mb-title" style="font-size: x-large;font-weight: 700;width: 100%;display: block;border-bottom: 2px solid #658;">[Title]</span><br>
                <span id="mb-msg">[Message]</span>
            </div>
            <div id="main-hud" style="position: fixed;top: 10%;left: 0px;min-width: 200px;display: flex;height: 80%;overflow: auto;flex-direction: column;justify-content: space-evenly;">
                <div id="money" style="text-align: center;padding: 15px;width: fit-content;margin: auto;border: 1px solid gray;border-radius: 25px;margin-bottom: 20px;box-shadow: 0 0 20px 0 black;background: linear-gradient(130deg, #ff96002e, transparent);backdrop-filter: blur(5px) contrast(0.5) brightness(0.5);">You have $<span id="val" style="color: #aaf;font-weight: 600;font-size: large;">1500</span>.</div>
                <div id="dice-box" style="border: solid 1px lightgray;border-radius: 15px;text-align: center;background: linear-gradient(315deg, transparent, #ffffff3b);backdrop-filter: blur(10px);box-shadow: 0 0 20px 0 black;margin: auto">
                    Current roll:<br>
                    <div style="display: inline;">
                        <img id="dice1" src="dinopoly/dice1.png" style="width: 50%"><img id="dice2" src="dinopoly/dice1.png" style="width: 50%">
                    </div><br>
                    <button id="roller" onclick="roll()" style="background: #ed1c24;color: #efefef;font-weight: bold;border: none;border-radius: 40px;height: 30px;width: 100px;cursor: pointer;filter: none;margin-right: calc(50% - 50px);">Roll Dice</button>
                </div>
                <div id="options" style="visibility: hidden; display: flex;justify-content: space-evenly;margin: auto;padding: 10px;border: 1px solid gray;border-radius: 20px;backdrop-filter: blur(10px) contrast(0.8) brightness(0.8);background: linear-gradient(172deg, #ffffff5c, transparent);width: -webkit-fill-available;">
                    <button id="rent" onclick="payRent()">Pay Rent</button><button id="buy" onclick="buyProperty()">Buy Property</button>
                </div>
            </div>
            <div id="right-panel" style="right: 3%;position: fixed;top: 5%;width: 20%;height: 90%;backdrop-filter: blur(15px) contrast(0.8) brightness(0.8);background: linear-gradient(128deg, #ffffff29, transparent);border: 1px solid #7b7b7b;border-radius: 30px;box-shadow: 0 0 20px 0 black;overflow: auto; min-width: 200px;scrollbar-width: none;z-index: 2;">
                <div style="padding: 15px;">
                    <div style="font-size: xx-large;text-align: center;">
                        <span>How to play</span>
                        <svg id="ec-svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 6.35 6.35" version="1.1" id="svg1" inkscape:version="1.4 (86a8ad7, 2024-10-11)" sodipodi:docname="arrow.svg" style="vertical-align: middle;scale: 0.7;transition: 1s;transition-property: rotate;rotate: 180deg;cursor: pointer;" onpointerup="toggleRules()">
                            <sodipodi:namedview id="namedview1" pagecolor="#ffffff" bordercolor="#000000" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" inkscape:document-units="px" showguides="false" showgrid="true" inkscape:zoom="32" inkscape:cx="11.578125" inkscape:cy="9.796875" inkscape:window-width="1920" inkscape:window-height="991" inkscape:window-x="-9" inkscape:window-y="-9" inkscape:window-maximized="1" inkscape:current-layer="layer1">
                              <sodipodi:guide position="0,6.35" orientation="0,24" id="guide1" inkscape:locked="false"></sodipodi:guide>
                              <sodipodi:guide position="6.35,6.35" orientation="24,0" id="guide2" inkscape:locked="false"></sodipodi:guide>
                              <sodipodi:guide position="6.35,0" orientation="0,-24" id="guide3" inkscape:locked="false"></sodipodi:guide>
                              <sodipodi:guide position="0,0" orientation="-24,0" id="guide4" inkscape:locked="false"></sodipodi:guide>
                              <inkscape:grid id="grid4" units="px" originx="0" originy="0" spacingx="1.5875" spacingy="1.5875" empcolor="#0099e5" empopacity="0.30196078" color="#0099e5" opacity="0.14901961" empspacing="1" enabled="true" visible="true" dotted="false" snapvisiblegridlinesonly="true"></inkscape:grid>
                            </sodipodi:namedview>
                            <defs id="defs1">
                              <inkscape:path-effect effect="fillet_chamfer" id="path-effect4" is_visible="true" lpeversion="1" nodesatellites_param="F,0,0,1,0,0,0,1 @ F,0,0,1,0,0.24522689,0,1 @ F,0,0,1,0,0,0,1" radius="0" unit="px" method="auto" mode="F" chamfer_steps="1" flexible="false" use_knot_distance="true" apply_no_radius="true" apply_with_radius="true" only_selected="false" hide_knots="false"></inkscape:path-effect>
                            </defs>
                            <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1">
                              <path style="fill:#999999;stroke-width:0.264583" d="M -0.00206706,0.00103353 3.0385517,4.5580045 a 0.16354642,0.16354642 179.98704 0 0 0.272126,-6.15e-5 L 6.3489665,0 Z" id="path4" sodipodi:nodetypes="cccc" inkscape:path-effect="#path-effect4" inkscape:original-d="M -0.00206706,0.00103353 C 1.0568422,1.5880194 2.1157515,3.1750052 3.1746608,4.7619911 4.2327627,3.1746607 5.2908646,1.5873304 6.3489665,0 4.2319553,3.4451e-4 2.1149441,6.8902e-4 -0.00206706,0.00103353 Z"></path>
                            </g>
                        </svg>
                    </div>
                    <hr>
                    <span id="howtoplay" style="display: block;height: fit-content;overflow: hidden;transition: 1s;max-height:fit-content;">
                        Dinopoly is fundamentally Monopoly, but turned on its head and completely changed.<br><br>
                        At the start of the game, and any time you pass go, you play the Dinosaur Game to determine how much money you start with or gain.<br><br>
                        To start, play the dino game, then roll the dice.<br><br>
                        To win, buy all properties, railroads, and utilities.
                    </span><hr>
                    <span>Properties left to buy (<span id="buy-num"></span>):</span><br>
                    <span id="properties-left"></span>
                </div>
            </div>
            <canvas id="board" width="2000" height="2000" style="background: url('dinopoly/board.png');background-size: contain;margin: auto;display: flex;box-shadow: 0 0 20px 0 black;border: 1px solid gray;border-radius: 10px;"></canvas>
            <div id="images" style="display: none;">
            <img src="dinopoly/piece.png" id="pieceImg">
            </div>
        `;
        /* Place Types
            0: Does nothing (go to jail, free parking, etc.)
            1: Typical property behavior
            2: Go To Jail
            3: Community Chest
            4: Chance
            5: You Land, You Lose (money)
            6: Jail
         */
        window.targetPos = {x: 0, y: 0};
        window.currPlace = 0;
        window.inJail = false;
        window.jailPlace = {
            "x": 30,
            "y": 1730,
            "type": 6,
            "title": "Jail"
        }
        window.outOfJailCards = 0;
        window.money = 0;
        window.chance = null;
        window.isDino = false;
        window.dinoTarget = 0;
        window.dinoMode = 0; //0: Pass GO; 1: Buy property; 2: Get out of jail; 3: Start of Game
        window.rulesExpanded = true;
        document.getElementById('content').style.visibility = 'hidden';
        const places = [
            {
                "x": 1760,
                "y": 1770,
                "type": 0,
                "title": "Go" //Go is special, you gain $200 when you PASS it, so that's handled separately.
            },
            {
                "x": 1560,
                "y": 1780,
                "type": 1,
                "title": "Mediterranean Avenue",
                "price": 600,
                "rent": 20,
                "owned": false
            },
            {
                "x": 1400,
                "y": 1780,
                "type": 3,
                "title": "Community Chest",
            },
            {
                "x": 1240,
                "y": 1780,
                "type": 1,
                "title": "Baltic Avenue",
                "rent": 40,
                "price": 600,
                "owned": false
            },
            {
                "x": 1090,
                "y": 1780,
                "type": 5,
                "title": "Income Tax",
                "price": 200
            },
            {
                "x": 930,
                "y": 1780,
                "type": 1,
                "title": "Reading Railroad",
                "price": 2000,
                "rent": 250,
                "owned": false
            },
            {
                "x": 770,
                "y": 1780,
                "type": 1,
                "title": "Oriental Avenue",
                "price": 1000,
                "rent": 60,
                "owned": false
            },
            {
                "x": 620,
                "y": 1780,
                "type": 4,
                "title": "Chance",
            },
            {
                "x": 460,
                "y": 1780,
                "type": 1,
                "title": "Vermont Avenue",
                "price": 1000,
                "rent": 60,
                "owned": false
            },
            {
                "x": 300,
                "y": 1780,
                "type": 1,
                "title": "Conneticut Avenue",
                "price": 1200,
                "rent": 80,
                "owned": false
            },
            {
                "x": 30,
                "y": 1830,
                "type": 0,
                "title": "Visiting Jail",
            },
            {
                "x": 70,
                "y": 1560,
                "type": 1,
                "title": "St. Charles Place",
                "price": 1400,
                "rent": 100,
                "owned": false
            },
            {
                "x": 70,
                "y": 1400,
                "type": 1,
                "title": "Electric Company",
                "price": 1500,
                "rent": 120,
                "owned": false
            },
            {
                "x": 70,
                "y": 1240,
                "type": 1,
                "title": "States Avenue",
                "price": 1400,
                "rent": 100,
                "owned": false
            },
            {
                "x": 70,
                "y": 1090,
                "type": 1,
                "title": "Virginia Avenue",
                "price": 1600,
                "rent": 120,
                "owned": false
            },
            {
                "x": 70,
                "y": 930,
                "type": 1,
                "title": "Pennsylvania Railroad",
                "price": 2000,
                "rent": 250,
                "owned": false
            },
            {
                "x": 70,
                "y": 780,
                "type": 1,
                "title": "St. James Place",
                "price": 1800,
                "rent": 140,
                "owned": false
            },
            {
                "x": 70,
                "y": 620,
                "type": 3,
                "title": "Community Chest"
            },
            {
                "x": 70,
                "y": 460,
                "type": 1,
                "title": "Tennessee Avenue",
                "price": 1800,
                "rent": 140,
                "owned": false
            },
            {
                "x": 70,
                "y": 310,
                "type": 1,
                "title": "New York Avenue",
                "price": 2000,
                "rent": 160,
                "owned": false
            },
            {
                "x": 110,
                "y": 120,
                "type": 0,
                "title": "Free Parking"
            },
            {
                "x": 310,
                "y": 70,
                "type": 1,
                "title": "Kentucky Avenue",
                "price": 2200,
                "rent": 180,
                "owned": false
            },
            {
                "x": 460,
                "y": 70,
                "type": 4,
                "title": "Chance"
            },
            {
                "x": 620,
                "y": 70,
                "type": 1,
                "title": "Indiana Avenue",
                "price": 2200,
                "rent": 200,
                "owned": false
            },
            {
                "x": 770,
                "y": 70,
                "type": 1,
                "title": "Illinois Avenue",
                "price": 2400,
                "rent": 220,
                "owned": false
            },
            {
                "x": 930,
                "y": 70,
                "type": 1,
                "title": "B. & O. Railroad",
                "price": 2000,
                "rent": 250,
                "owned": false
            },
            {
                "x": 1090,
                "y": 70,
                "type": 1,
                "title": "Atlantic Avenue",
                "price": 2600,
                "rent": 220,
                "owned": false
            },
            {
                "x": 1240,
                "y": 70,
                "type": 1,
                "title": "Ventnor Avenue",
                "price": 2600,
                "rent": 220,
                "owned": false
            },
            {
                "x": 1400,
                "y": 70,
                "type": 1,
                "title": "Water Works",
                "price": 1500,
                "rent": 120,
                "owned": false
            },
            {
                "x": 1550,
                "y": 70,
                "type": 1,
                "title": "Marvin Gardens",
                "price": 2800,
                "rent": 240,
                "owned": false
            },
            {
                "x": 1770,
                "y": 110,
                "type": 2,
                "title": "Go To Jail"
            },
            {
                "x": 1800,
                "y": 310,
                "type": 1,
                "title": "Pacific Avenue",
                "price": 3000,
                "rent": 260,
                "owned": false
            },
            {
                "x": 1800,
                "y": 460,
                "type": 1,
                "title": "North Carolina Avenue",
                "price": 3000,
                "rent": 260,
                "owned": false
            },
            {
                "x": 1800,
                "y": 620,
                "type": 3,
                "title": "Community Chest"
            },
            {
                "x": 1800,
                "y": 770,
                "type": 1,
                "title": "Pennsylvania Avenue",
                "price": 3200,
                "rent": 280,
                "owned": false
            },
            {
                "x": 1800,
                "y": 930,
                "type": 1,
                "title": "Short Line",
                "price": 2000,
                "rent": 250,
                "owned": false
            },
            {
                "x": 1800,
                "y": 1090,
                "type": 4,
                "title": "Chance"
            },
            {
                "x": 1800,
                "y": 1240,
                "type": 1,
                "title": "Park Place",
                "price": 3500,
                "rent": 350,
                "owned": false
            },
            {
                "x": 1800,
                "y": 1400,
                "type": 5,
                "title": "Luxury Tax",
                "price": 75
            },
            {
                "x": 1800,
                "y": 1560,
                "type": 1,
                "title": "Boardwalk",
                "price": 4000,
                "rent": 500,
                "owned": false
            }
        ];
        window.place = places[currPlace];
        var piece = {
            width: 126,
            height: 134,
            image: document.getElementById('pieceImg')
        };
        window.places = [];
        window.msgOverride = true;
        window.showDino = function(msg, target = 0, mode = 1) {
            if (mode == 1) {
                document.getElementById('options').style.visibility  = 'hidden';
            }
            document.getElementById('content').style.visibility = 'visible';
            document.getElementById('dinopoly-div').style.visibility = 'hidden';
            document.getElementById('main-message').children[0].children[0].innerHTML = msg;
            window.dinoTarget = target;
            window.dinoMode = mode;
        }
        let func = Runner().gameOver;
        Runner().gameOver = function() {
            let redo = false;
            func.call(Runner());
            let score = Number(Runner().distanceMeter.digits.join(""));
            if (window.dinoMode == 3) { //Start of Game
                window.money = Math.max(1500, score);
                updateMoney();
                showMessage('Dinopoly', 'Your score was ' + score + '.<br>Press "Roll Dice" to start a turn.');
            } else if (window.dinoMode == 0) { //Passing Go
                window.money += Math.max(200, score);
                updateMoney();
                handleLanding();
            } else if (window.dinoMode == 1) { //Buying a property
                if (score >= window.dinoTarget) {
                    showMessage('Dinopoly', 'You bought ' + place.title + ' for $' + place.price + '.');
                    handleLoss(place.price);
                    place.owned = true;
                    updateToBuy();
                    enableRoll();
                } else {
                    let msgs = ["The seller doesn't like your negotiation skills.", "The seller doesn't want your filthy money this time.", "The seller would like to look at more options before selling.", "The seller declined your offer but did not give a comment.", 'The seller told you to "Get lost, child!"', 'The seller wrote a memoire about rejecting offers. Yours is chapter one.', 'The seller is far too important to deal with your kind of offer.', "Your offer was reviewed. Then ridiculed. Then deleted.", "The seller said they'd rather live in a shoe than sell to you.", "Better luck next time!"];
                    let r = msgs[Math.floor(Math.random()*msgs.length)];
                    showMessage('The seller declined', r);
                    document.getElementById('buy').style.display = 'none';
                    document.getElementById('options').style.visibility = 'visible';
                }
            } else if (window.dinoMode == 2) { //In jail
                if (score > 2467) {
                    showMessage('Jail', 'You got out of jail!');
                    handleLoss(50);
                    currPlace = 10;
                    place = places[10];
                    pos.x = place.x;
                    pos.y = place.y;
                    enableRoll();
                } else {
                    alert('You did not score high enough. Try again.');
                    redo = true;
                }
            }
            if (redo) {
                return;
            }
            document.getElementById('content').style.visibility = 'hidden';
            document.getElementById('dinopoly-div').style.visibility = 'visible';
        }
        window.startGame = function() {
            document.getElementById('start-game-btn').style.visibility = 'hidden';
            showDino('Your score determines how much money you start with.', 0, 3);
        }
        function updateToBuy() {
            let pl = document.getElementById('properties-left');
            pl.innerHTML = "";
            let n = 0;
            for (let p in places) {
                if (places[p].type == 1 && !places[p].owned) {
                    pl.innerHTML += places[p].title + '<br>';
                    n++;
                }
            }
            document.getElementById('buy-num').innerHTML = n;
            if (n == 0) {
                location.href = 'mpWin.html';
            }
        }
        updateToBuy();
        function updateMoney() {
            document.getElementById('val').innerText = window.money;
            updateToBuy();
        }
        window.toggleRules = function() {
            let svg = document.getElementById('ec-svg');
            let htp = document.getElementById('howtoplay');
            if (window.rulesExpanded) {
                window.rulesExpanded = false;
                svg.style.rotate = '0deg';
                htp.style.height = '0px';
            } else {
                window.rulesExpanded = true;
                svg.style.rotate = '180deg';
                htp.style.height = htp.scrollHeight + 'px';
            }
        }
        function resize() {
            let size = Math.min(window.innerHeight, window.innerWidth) - 20;
            document.getElementById('board').style.width = size + 'px';
            document.getElementById('board').style.height = size + 'px';
            window.dpScale = size/2000;
            let maxWidth = document.getElementById('board').getBoundingClientRect().left;
            let mh = document.getElementById('main-hud');
            mh.style.maxWidth = (maxWidth) + 'px';
            mh.style.marginLeft = (maxWidth*0.05) + 'px';
            mh.style.marginRight = (maxWidth*0.05) + 'px';
            mh.style.width = (maxWidth*0.9) + 'px';
            mh.style.top = (window.innerHeight/2 - (mh.clientHeight/2)) + 'px';
            document.getElementById('right-panel').style.maxWidth = maxWidth + 'px';
        }
        resize();
        window.addEventListener('resize', resize);
        window.pos = {x: 0, y: 0};
        setInterval(() => { //Game loop of sorts, handles rendering
            let canvas = document.getElementById('board');
            let ctx = canvas.getContext('2d');
            ctx.reset();
            ctx.drawImage(piece.image, pos.x, pos.y, piece.width, piece.height);
        }, 20);
        pos.x = place.x;
        pos.y = place.y;
        function move(spaces = 1) {
            let test = (currPlace + spaces);
            currPlace = (currPlace + spaces) % places.length;
            if (currPlace != test) {
                window.passedGo = true;
                console.log("PASSED GO");
                handleGo();
            }
            place = places[currPlace];
            pos.x = place.x;
            pos.y = place.y;
        }
        function handleGo() {
            window.money += 200;
            updateMoney();
        }
        function goToJail() {
            currPlace = -1;
            place = jailPlace;
            pos.x = place.x;
            pos.y = place.y;
            window.showDino('You are in jail. Score high enough to get out.', 2467, 2);
            disableRoll();
        }
        function chance() {
            let chances = 6;
            let rand = Math.floor(Math.random()*chances);
            switch (rand) {
                case 0: 
                    showMessage('Chance', 'Advance to Go.');
                    let target = places.length;
                    let int = setInterval(() => {
                        if (currPlace == target || currPlace == 0) {
                            clearInterval(int);
                            enableRoll();
                        } else {
                            move();
                        }
                    }, 200);
                    break;
                case 1: 
                    showMessage('Chance', 'Get Out of Jail Free');
                    window.outOfJailCards++;
                    enableRoll();
                    break;
                case 2: 
                    showMessage('Chance', 'Bank pays you dividend of $250.');
                    window.money += 250;
                    updateMoney();
                    enableRoll();
                    break;
                case 3: 
                    showMessage('Chance', 'Go to jail. Go directly to jail, do not pass Go.');
                    if (window.outOfJailCards > 0) {
                        window.outOfJailCards--;
                        showMessage('Jail', 'Your Get Out of Jail Free card prevented you from going to jail.');
                        enableRoll();
                        break;
                    } else {
                        goToJail();
                        break;
                    }
                case 4: 
                    showMessage('Chance', 'Speeding fine $15.');
                    handleLoss(15);
                    enableRoll();
                    break;
                case 5: 
                    showMessage('Chance', 'Pay poor tax of $12.');
                    handleLoss(15);
                    enableRoll();
                    break;
                case 6: 
                    showMessage('Chance', 'Your building loan matures. Collect $500.');
                    window.money += 500;
                    enableRoll();
                    break;
            }
        }
        function communityChest() {
            let chests = 10;
            let rand = Math.floor(Math.random()*chests);
            switch(rand) {
                case 0: 
                    showMessage('Community Chest', 'Advance to Go');
                    let target = places.length;
                    let int = setInterval(() => {
                        if (currPlace == target || currPlace == 0) {
                            clearInterval(int);
                            enableRoll();
                        } else {
                            move();
                        }
                    }, 200);
                    break;
                case 1: 
                    showMessage('Community Chest', 'Bank error in your favor. Collect $200');
                    money += 200;
                    enableRoll();
                    updateMoney();
                    break;
                case 2: 
                    showMessage('Community Chest', "Doctor's fee. Pay $50");
                    handleLoss(50);
                    enableRoll();
                    break;
                case 3: 
                    showMessage('Community Chest', 'From sale of stock you get $50');
                    money += 50;
                    enableRoll();
                    updateMoney();
                    break;
                case 4: 
                    showMessage('Community Chest', 'Get Out of Jail Free');
                    window.outOfJailCards++;
                    enableRoll();
                    break;
                case 5: 
                    showMessage('Community Chest', 'Go to Jail. Go directly to jail, do not pass Go.');
                    if (window.outOfJailCards > 0) {
                        window.outOfJailCards--;
                        showMessage('Jail', 'Your Get Out of Jail Free card prevented you from going to jail.');
                        enableRoll();
                        break;
                    } else {
                        goToJail();
                        break;
                    }
                case 6: 
                    showMessage('Community Chest', 'Holiday fund matures. Recieve $100');
                    money += 100;
                    enableRoll();
                    updateMoney();
                    break;
                case 7: 
                    showMessage('Community Chest', 'Income tax refund. Collect $20');
                    money += 20;
                    enableRoll();
                    updateMoney();
                    break;
                case 8: 
                    let amt = 10*Math.floor(Math.random()*60)+1
                    showMessage('Community Chest', 'It is your birthday. Your grandmother gives you $' + amt);
                    money += amt;
                    enableRoll();
                    updateMoney();
                    break;
                case 9: 
                    showMessage('Community Chest', 'Life insurance matures. Collect $100');
                    money += 100;
                    enableRoll();
                    updateMoney();
                    break;
                case 10: 
                    showMessage('Community Chest', 'Pay hospital fees of $100');
                    handleLoss(100);
                    enableRoll();
                    break;
                case 11: 
                    showMessage('Community Chest', 'Pay school fees of $50');
                    handleLoss(50);
                    enableRoll();
                    break;
                case 12: 
                    showMessage('Community Chest', 'Recieve $25 consultancy fee');
                    money += 25;
                    enableRoll();
                    updateMoney();
                    break;
                case 13: 
                    showMessage('Community Chest', 'You are assessed for street repair. Pay $160');
                    handleLoss(160);
                    enableRoll();
                    break;
                case 14: 
                    showMessage('Community Chest', 'You have won second prize in a beauty contest. Collect $10');
                    money += 10;
                    enableRoll();
                    updateMoney();
                    break;
                case 15: 
                    showMessage('Community Chest', 'You inherit $100');
                    money += 100;
                    enableRoll();
                    updateMoney();
            }
        }
        function handleLoss(amount) {
            if (money < amount) {
                alert("BANKRUPTCY!\nYou've gone bankrupt.\nPlease fill out the Chapter 7 Bankruptcy form.");
                window.open('dinopoly/bankruptcy.pdf','_blank', 'width=1280,height=720');
                let s = document.getElementById('start-game-btn')
                s.style.visibility = 'visible';
                s.children[0].innerHTML = 'Accept defeat';
                window.startGame = function() {
                    location.reload();
                };
            } else {
                money -= amount;
                updateMoney();
            }
        }
        window.buyProperty = function() {
            if (place.owned) {
                enableRoll();
                showMessage('Error', 'You already own ' + place.title + '.');
                return;
            }
            if (place.price > money) {
                showMessage('Error', 'You do not have enough money to buy ' + place.title + '. You need $' + (place.price - money) + ' more to afford it.');
                return;
            }
            //Todo: Start a game of Dino Runner. After ending the game, if the score exceeds the price, buy the property. Otherwise, remove the "buy property" button.
            showDino(`Get a score of ${place.price} or greater to buy ${place.title}.`, place.price, 1);
        }
        window.payRent = function() {
            if (place.owned) {
                money += place.rent;
            } else {
                handleLoss(place.rent);
            }
            document.getElementById('options').style.visibility = 'hidden';
            enableRoll();
        }
        function disableRoll() {
            document.getElementById('roller').disabled = true;
            document.getElementById('roller').style.filter = 'blur(1px) contrast(0.85)';
            document.getElementById('roller').style.cursor = 'not-allowed';
        }
        function enableRoll() {
            document.getElementById('roller').disabled = false;
            document.getElementById('roller').style.filter = 'none';
            document.getElementById('roller').style.cursor = 'pointer';
        }
        window.roll = function() {
            console.log("rolling...");
            window.passedGo = false;
            document.getElementById('options').style.visibility = 'hidden';
            let a = Math.floor(Math.random()*6)+1;
            let b = Math.floor(Math.random()*6)+1;
            let num = a+b;
            document.getElementById('roller').innerHTML = 'Rolling...';
            disableRoll();
            setTimeout(() => {
                document.getElementById('dice1').src = "dinopoly/dice" + a  + ".png";
                document.getElementById('dice2').src = "dinopoly/dice" + b  + ".png";
                let curr = 0;
                document.getElementById('roller').innerHTML = 'Roll Dice';
                let interval = setInterval(() => {
                    if (curr >= num) {
                        clearInterval(interval);
                        console.log(place.title);
                        handleLanding();
                    } else {
                        move();
                        curr++;
                    }
                }, 500);
            }, Math.random()*2000+1000);
        }
        window.TIMOUT = null;
        window.showMessage = function(title, message) {
            let time = 0;
            if (window.TIMOUT) {
                clearTimeout(window.TIMOUT);
                window.TIMOUT = null;
                document.getElementById('messagebox').style.left = '-30%';
                time = 500;
            }
            setTimeout(() => {
                document.getElementById('mb-title').innerText = title;
                document.getElementById('mb-msg').innerHTML = message;
                document.getElementById('messagebox').style.left = '0%';
                window.TIMOUT = setTimeout(() => {document.getElementById('messagebox').style.left = '-30%';window.TIMOUT = null;}, 5000);
            }, time);
        }
        window.handleLanding = function() {
            if (window.passedGo) {
                window.passedGo = false;
                showDino('Your score determines how much money you gain by passing Go', 0, 0);
                return;
            }
            if (place.type == 1) {
                window.showMessage('Dinopoly', 'You landed on ' + place.title + '.');
                document.getElementById('buy').style.display = 'initial';
                if (place.owned) {
                    enableRoll();
                    return;
                }
                document.getElementById('options').style.visibility = 'visible';
            } else if (place.type == 5) {
                window.showMessage('Dinopoly', 'You landed on ' + place.title + ' and lost $' + place.price + '.');
                handleLoss(place.price);
                enableRoll();
            } else if (place.type == 2) {
                goToJail();
            } else if (place.type == 4) {
                chance();
            } else if (place.type == 3) {
                communityChest();
            } else if (place.type != 6) {
                window.showMessage('Dinopoly', 'You landed on ' + place.title + '.');
                enableRoll();
            }
        }
    }




















    //Themed Dino Run (2x, gets THEME-${Theme}.js?) //TODO
    if (localStorage.getItem('theme') !== 'none') {
        window.scale = 5;
        window.duckFrame = 0;
window.duckCs = [ //duckC(oordinate)s
    {x: 4800, y: 0, w: 440, h: 470},
    {x: 5240, y: 0, w: 470, h: 426},
    {x: 5710, y: 0, w: 500, h: 382},
    {x: 5300, y: 640, w: 530, h: 328},
    {x: 6000, y: 676, w: 560, h: 294}
];
DistanceMeter.prototype.draw = function(digitPos, value, highScore) {
        var that = Runner().distanceMeter;
        let sourceWidth = Dimensions.WIDTH;
        let sourceHeight = Dimensions.HEIGHT;
        let sourceX = Dimensions.WIDTH * value;
        let sourceY = 0;
        const targetX = digitPos * Dimensions.DEST_WIDTH;
        const targetY = that.y;
        const targetWidth = Dimensions.WIDTH;
        const targetHeight = Dimensions.HEIGHT;
        if (IS_HIDPI) {
            sourceWidth *= 2;
            sourceHeight *= 2;
            sourceX *= 2
        }
        sourceX += that.spritePos.x;
        sourceY += that.spritePos.y;
        that.canvasCtx.save();
        if (IS_RTL) {
            const translateX = highScore ? that.canvasWidth - Dimensions.WIDTH * (that.maxScoreUnits + 3) : that.canvasWidth - Dimensions.WIDTH;
            that.canvasCtx.translate(translateX, that.y);
            that.canvasCtx.scale(-1, 1)
        } else {
            const highScoreX = that.x - that.maxScoreUnits * 2 * Dimensions.WIDTH;
            that.canvasCtx.translate(highScore ? highScoreX : that.x, that.y)
        }
        that.canvasCtx.drawImage(that.image, sourceX*window.scale, sourceY*window.scale, sourceWidth*window.scale, sourceHeight*window.scale, targetX, targetY, targetWidth, targetHeight);
        that.canvasCtx.restore()
    }
GameOverPanel.prototype.drawGameOverText = function(dimensions, useAltText) {
        const centerX = this.canvasDimensions.width / 2;
        let textSourceX = dimensions.textX;
        let textSourceY = dimensions.textY;
        let textSourceWidth = dimensions.textWidth;
        let textSourceHeight = dimensions.textHeight;
        const textTargetX = Math.round(centerX - dimensions.textWidth / 2);
        const textTargetY = Math.round((this.canvasDimensions.height - 25) / 3);
        const textTargetWidth = dimensions.textWidth;
        const textTargetHeight = dimensions.textHeight;
        if (IS_HIDPI) {
            textSourceY *= 2;
            textSourceX *= 2;
            textSourceWidth *= 2;
            textSourceHeight *= 2
        }
        if (!useAltText) {
            textSourceX += this.textImgPos.x;
            textSourceY += this.textImgPos.y
        }
        const spriteSource = useAltText ? getRunnerAltCommonImageSprite() : getRunnerOrigImageSprite();
        assert(spriteSource);
        this.canvasCtx.save();
        if (IS_RTL) {
            this.canvasCtx.translate(this.canvasDimensions.width, 0);
            this.canvasCtx.scale(-1, 1)
        }
        this.canvasCtx.drawImage(spriteSource, textSourceX*window.scale, textSourceY*window.scale, textSourceWidth*window.scale, textSourceHeight*window.scale, textTargetX, textTargetY, textTargetWidth, textTargetHeight);
        this.canvasCtx.restore()
    }
GameOverPanel.prototype.drawAltGameElements = function(tRex) {
        const spriteDefinition = getRunnerSpriteDefinition();
        assert(spriteDefinition);
        if (this.altGameModeActive && spriteDefinition) {
            assert(this.altGameEndImgPos);
            const altGameEndConfig = spriteDefinition.altGameEndConfig;
            assert(altGameEndConfig);
            let altGameEndSourceWidth = altGameEndConfig.width;
            let altGameEndSourceHeight = altGameEndConfig.height;
            const altGameEndTargetX = tRex.xPos + altGameEndConfig.xOffset;
            const altGameEndTargetY = tRex.yPos + altGameEndConfig.yOffset;
            if (IS_HIDPI) {
                altGameEndSourceWidth *= 2;
                altGameEndSourceHeight *= 2
            }
            const altCommonImageSprite = getRunnerAltCommonImageSprite();
            assert(altCommonImageSprite);
            this.canvasCtx.drawImage(altCommonImageSprite, this.altGameEndImgPos.x*window.scale, this.altGameEndImgPos.y*window.scale, altGameEndSourceWidth*window.scale, altGameEndSourceHeight*window.scale, altGameEndTargetX, altGameEndTargetY, altGameEndConfig.width, altGameEndConfig.height)
        }
    }
GameOverPanel.prototype.drawRestartButton = function() {
        const dimensions = defaultPanelDimensions;
        let framePosX = animConfig.frames[this.currentFrame];
        let restartSourceWidth = dimensions.restartWidth;
        let restartSourceHeight = dimensions.restartHeight;
        const restartTargetX = this.canvasDimensions.width / 2 - dimensions.restartHeight / 2;
        const restartTargetY = this.canvasDimensions.height / 2;
        if (IS_HIDPI) {
            restartSourceWidth *= 2;
            restartSourceHeight *= 2;
            framePosX *= 2
        }
        this.canvasCtx.save();
        if (IS_RTL) {
            this.canvasCtx.translate(this.canvasDimensions.width, 0);
            this.canvasCtx.scale(-1, 1)
        }
        const origImageSprite = getRunnerOrigImageSprite();
        assert(origImageSprite);
        this.canvasCtx.drawImage(origImageSprite, (this.restartImgPos.x + framePosX)*window.scale, this.restartImgPos.y*window.scale, restartSourceWidth*window.scale, restartSourceHeight*window.scale, restartTargetX, restartTargetY, dimensions.restartWidth, dimensions.restartHeight);
        this.canvasCtx.restore()
    }
BackgroundEl.prototype.draw = function() {
        this.canvasCtx.save();
        let sourceWidth = this.spriteConfig.width;
        let sourceHeight = this.spriteConfig.height;
        let sourceX = this.spriteConfig.xPos;
        const outputWidth = sourceWidth;
        const outputHeight = sourceHeight;
        const imageSprite = getRunnerImageSprite();
        assert(imageSprite);
        if (IS_HIDPI) {
            sourceWidth *= 2;
            sourceHeight *= 2;
            sourceX *= 2
        }
        this.canvasCtx.drawImage(imageSprite, sourceX*window.scale, this.spritePos.y*window.scale, sourceWidth*window.scale, sourceHeight*window.scale, this.xPos, this.yPos, outputWidth, outputHeight);
        this.canvasCtx.restore()
    }
Cloud.prototype.draw = function() {
        const runnerImageSprite = getRunnerImageSprite();
        assert(runnerImageSprite);
        this.canvasCtx.save();
        let sourceWidth = Config$1.WIDTH;
        let sourceHeight = Config$1.HEIGHT;
        const outputWidth = sourceWidth;
        const outputHeight = sourceHeight;
        if (IS_HIDPI) {
            sourceWidth = sourceWidth * 2;
            sourceHeight = sourceHeight * 2
        }
        this.canvasCtx.drawImage(runnerImageSprite, this.spritePos.x*window.scale, this.spritePos.y*window.scale, sourceWidth*window.scale, sourceHeight*window.scale, this.xPos, this.yPos, outputWidth, outputHeight);
        this.canvasCtx.restore()
    }
HorizonLine.prototype.draw = function() {
        const runnerImageSprite = getRunnerImageSprite();
        assert(runnerImageSprite);
        this.canvasCtx.drawImage(runnerImageSprite, this.sourceXPos[0]*window.scale, this.spritePos.y*window.scale, this.sourceDimensions.width*window.scale, this.sourceDimensions.height*window.scale, this.xPos[0], this.yPos, this.dimensions.width, this.dimensions.height);
        this.canvasCtx.drawImage(runnerImageSprite, this.sourceXPos[1]*window.scale, this.spritePos.y*window.scale, this.sourceDimensions.width*window.scale, this.sourceDimensions.height*window.scale, this.xPos[1], this.yPos, this.dimensions.width, this.dimensions.height)
    }
NightMode.prototype.draw = function() {
        let moonSourceWidth = this.currentPhase === 3 ? Config.WIDTH * 2 : Config.WIDTH;
        let moonSourceHeight = Config.HEIGHT;
        const currentPhaseSpritePosition = PHASES[this.currentPhase];
        assert(currentPhaseSpritePosition !== undefined);
        let moonSourceX = this.spritePos.x + currentPhaseSpritePosition;
        const moonOutputWidth = moonSourceWidth;
        let starSize = Config.STAR_SIZE;
        let starSourceX = spriteDefinitionByType.original.ldpi.star.x;
        const runnerOrigImageSprite = getRunnerOrigImageSprite();
        assert(runnerOrigImageSprite);
        if (IS_HIDPI) {
            moonSourceWidth *= 2;
            moonSourceHeight *= 2;
            moonSourceX = this.spritePos.x + currentPhaseSpritePosition * 2;
            starSize *= 2;
            starSourceX = spriteDefinitionByType.original.hdpi.star.x
        }
        this.canvasCtx.save();
        this.canvasCtx.globalAlpha = this.opacity;
        if (this.drawStars) {
            for (const star of this.stars) {
                this.canvasCtx.drawImage(runnerOrigImageSprite, starSourceX*window.scale, star.sourceY*window.scale, starSize*window.scale, starSize*window.scale, Math.round(star.x), star.y, Config.STAR_SIZE, Config.STAR_SIZE)
            }
        }
        //this.canvasCtx.drawImage(runnerOrigImageSprite, moonSourceX*window.scale, this.spritePos.y*window.scale, moonSourceWidth*window.scale, moonSourceHeight*window.scale, Math.round(this.xPos), this.yPos, moonOutputWidth, Config.HEIGHT);
        this.canvasCtx.globalAlpha = 1;
        this.canvasCtx.restore()
    }
Obstacle.prototype.draw = function() {
        let sourceWidth = this.typeConfig.width;
        let sourceHeight = this.typeConfig.height;
        if (IS_HIDPI) {
            sourceWidth = sourceWidth * 2;
            sourceHeight = sourceHeight * 2
        }
        let sourceX = sourceWidth * this.size * (.5 * (this.size - 1)) + this.spritePos.x;
        if (this.currentFrame > 0) {
            sourceX += sourceWidth * this.currentFrame
        }
        this.canvasCtx.drawImage(this.imageSprite, sourceX*window.scale, this.spritePos.y*window.scale, sourceWidth * this.size*window.scale, sourceHeight*window.scale, this.xPos, this.yPos, this.typeConfig.width * this.size, this.typeConfig.height)
    }
Trex.prototype.draw = function(x, y) {
        let sourceX = x;
        let sourceY = y;
        let sourceWidth = this.ducking && this.status !== Status.CRASHED ? this.config.widthDuck : this.config.width;
        let sourceHeight = this.config.height;
        const outputHeight = sourceHeight;
        if (this.altGameModeEnabled) {
            assert(this.config.widthCrashed)
        }
        const outputWidth = this.altGameModeEnabled && this.status === Status.CRASHED ? this.config.widthCrashed : this.config.width;
        const runnerImageSprite = getRunnerImageSprite();
        assert(runnerImageSprite);
        if (this.altGameModeEnabled) {
            if (this.jumping && this.status !== Status.CRASHED) {
                assert(this.config.widthJump);
                sourceWidth = this.config.widthJump
            } else if (this.status === Status.CRASHED) {
                assert(this.config.widthCrashed);
                sourceWidth = this.config.widthCrashed
            }
        }
        if (IS_HIDPI) {
            sourceX *= 2;
            sourceY *= 2;
            sourceWidth *= 2;
            sourceHeight *= 2
        }
        sourceX += this.spritePos.x;
        sourceY += this.spritePos.y;
        if (this.flashing) {
            if (this.timer < this.config.flashOn) {
                this.canvasCtx.globalAlpha = .5
            } else if (this.timer > this.config.flashOff) {
                this.timer = 0
            }
        }
        if (this.ducking && this.status !== Status.CRASHED) {
            if (window.duckFrame < 5) {
                let dc = window.duckCs[Math.floor(window.duckFrame)];
                this.canvasCtx.drawImage(runnerImageSprite, dc.x, dc.y, dc.w, dc.h, this.xPos, this.yPos+5*Math.floor(window.duckFrame), dc.w/10,dc.h/10);
                window.duckFrame += 0.25;
            } else {
                this.canvasCtx.drawImage(runnerImageSprite, sourceX*window.scale, sourceY*window.scale, sourceWidth*window.scale, sourceHeight*window.scale, this.xPos, this.yPos, this.config.widthDuck, outputHeight);
            }
        } else if (this.altGameModeEnabled && this.jumping && this.status !== Status.CRASHED) {
            assert(this.config.widthJump);
            const spriteDefinition = getRunnerSpriteDefinition();
            assert(spriteDefinition);
            assert(spriteDefinition.tRex);
            const jumpOffset = spriteDefinition.tRex.jumping.xOffset * (IS_HIDPI ? 2 : 1);
            this.canvasCtx.drawImage(runnerImageSprite, sourceX*window.scale, sourceY*window.scale, sourceWidth*window.scale, sourceHeight*window.scale, this.xPos - jumpOffset, this.yPos, this.config.widthJump, outputHeight);
        } else {
            if (this.ducking && this.status === Status.CRASHED) {
                this.xPos++
            }
            if (window.duckFrame > 0) {
                window.duckFrame -= 0.25;
                let dc = window.duckCs[Math.floor(window.duckFrame)];
                this.canvasCtx.drawImage(runnerImageSprite, dc.x, dc.y, dc.w, dc.h, this.xPos, this.yPos+5*Math.floor(window.duckFrame), dc.w/10,dc.h/10);
            } else {
                this.canvasCtx.drawImage(runnerImageSprite, sourceX*window.scale, sourceY*window.scale, sourceWidth*window.scale, sourceHeight*window.scale, this.xPos, this.yPos, outputWidth, outputHeight);
            }
        }
        this.canvasCtx.globalAlpha = 1
    }
        let theme = localStorage.getItem('theme') || 'none';
        if (Runner().isDarkMode && theme !== 'none') {
            document.getElementById("offline-resources-2x").src = `dinorun_2x_${theme}_Dark.png?t=${Date.now()}`;
        } else if (theme !== 'none') {
            document.getElementById("offline-resources-2x").src = `dinorun_2x_${theme}_Light.png?t=${Date.now()}`;
        }
    }
    window.keys="";window.winKeys="interlochen";document.body.addEventListener('keydown',(e)=>{keys+=e.key.toLowerCase();if(!winKeys.includes(keys)){keys="";keys+=e.key.toLowerCase();}if(keys==winKeys){alert('GOD MODE ACTIVATED.');Runner().tRex.config.gravity=-0.3;setTimeout(()=>{Runner().currentSpeed*=Runner().currentSpeed;Runner().tRex.startJump(Runner().currentSpeed);},100);setTimeout(()=>{Runner().tRex.config.gravity=0.6;Runner().stop();alert('NORMAL MODE RESUMED.')},60000);}});
}, 500);