// ==UserScript==
// @name         Dino game stuff
// @version      1.0
// @description  Some codes for the dino game
// @author       GGamerGGuy
// @match        *chrome*
// @grant        none
// ==/UserScript==
setTimeout(() => {
    (async function() {
    const currVersion = 0.1;
    //let f = await fetch('todo');
    })();
    Runner().isDarkMode = true; //Error handling go brrrr
    
    document.body.style.overflow = 'hidden';

    if (!localStorage.getItem('inited')) {
        localStorage.setItem('inited', 'true');
        localStorage.setItem('djEnabled', '0');
        localStorage.setItem('djAmount', '1');
        localStorage.setItem('rrEnabled', '0');
        localStorage.setItem('potEnabled', '0');
        localStorage.setItem('theme', 'Kasey');
        localStorage.setItem('scale', '5');
    }







    //Double Jump
    if (localStorage.getItem('djEnabled') == '1') {
        window.maxJumps = Number(localStorage.getItem('djAmount')); //Maximum number of Enter jumps, default 1
        window.jumps = 0;
        window.wasJumping = false;
        document.addEventListener('keydown', (e) => {
            if(e.code == 'Space' && window.jumps < window.maxJumps) {
                window.Runner().tRex.jumping = false;
                setTimeout(()=>{window.Runner().tRex.startJump(50)}, 20);
                window.jumps++;
            }
        }
            );
        setInterval(() => {
            if (!window.Runner().tRex.jumping && !window.Runner().tRex.wasJumping) {
                window.jumps = 0;
            }
            window.wasJumping = window.Runner().tRex.jumping;
        }, 100);
    }








    //Dino road runner
    if (localStorage.getItem('rrEnabled') == '1') {
        var interval = null;
        document.addEventListener("keydown", (e) => {
            if (e.key == "w" && !interval) {
                interval = setInterval(() => {
                    Runner().tRex.groundYPos -= 3;
                    Runner().tRex.groundYPos = Math.max(0, Math.min(93, Runner().tRex.groundYPos));
                    Runner().tRex.yPos = Runner().tRex.groundYPos;
                }, 10);
            } else if (e.key == "s" && !interval) {
                interval = setInterval(() => {
                    Runner().tRex.groundYPos += 3;
                    Runner().tRex.yPos = Runner().tRex.groundYPos;
                    Runner().tRex.groundYPos = Math.max(0, Math.min(93, Runner().tRex.groundYPos));
                }, 10);
            }
        });
        document.addEventListener("keyup", (e) => {
            if (e.key == "w" || e.key == "s") {
                clearInterval(interval);
                interval = null;
            }
        });
        setInterval(() => {
        Runner().horizon.obstacleTypes[1].yPosMobile = Math.random() * 90;
        Runner().horizon.obstacleTypes[1].yPos = Runner().horizon.obstacleTypes[1].yPosMobile;
        Runner().horizon.obstacleTypes[0].yPosMobile = Math.random() * 105;
        Runner().horizon.obstacleTypes[0].yPos = Runner().horizon.obstacleTypes[0].yPosMobile;
        }, 1000);
    }








    //"Potato PC" (Runs on spacebar press)
    if (localStorage.getItem('potEnabled') == '1') {
        window.isInit = false;
        document.body.addEventListener('keydown', (e) => {
            if (e.code == "Space" && !window.isInit) {
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
        Runner().tRex.startJump = function(speed) {
            setTimeout(() => {
            var that = Runner().tRex;
                if (!that.jumping) {
                    that.update(0, Status.JUMPING);
                    that.jumpVelocity = that.config.initialJumpVelocity - speed / 10;
                    that.jumping = true;
                    that.reachedMinHeight = false;
                    that.speedDrop = false;
                    if (that.config.invertJump) {
                        that.minJumpHeight = that.groundYPos + that.config.minJumpHeight
                    }
                }
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
    //Dino flappy bird
    //WONTDO
}, 500);