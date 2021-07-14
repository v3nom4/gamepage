fishGame = {
    player: undefined,
    background: undefined,
    topbar: undefined,
    fishlegend: undefined,
    score: 0,
    highScore: 0,
    gameOver: false,
    gameOverText: undefined,
    scoreText: undefined,
    highScoreText: undefined,
    fishGroup: undefined,
    emitter: undefined,
    minFishSpeed: 50,
    maxFishSpeed: 200,
    numOfSmallFish: 20,
    numOfMediumFish: 5,
    numOfLargeFish: 5,
    playerSizeIncreaseSmall: 0.005,
    playerSizeIncreaseMedium: 0.010,
    playerSizeIncreaseLarge: 0.015,
    fishSizeIncreaseSmall: 0.005,
    fishSizeIncreaseMedium: 0.05,
    fishSizeIncreaseLarge: 0.075,
    winConditionPoints: 200000,
    readyText: undefined,
    preload: function(){
        var dirPrefix = 'games/fishy/assets/'
        game.load.image('background', dirPrefix + 'waterBG.png');
        game.load.image('player', dirPrefix + 'shark.png');
        game.load.image('littleFish', dirPrefix + 'LilFish.png');
        game.load.image('mediumFish', dirPrefix + 'MedFish.png');
        game.load.image('bigFish', dirPrefix + 'BigFish.png');
        game.load.image('msgbox', dirPrefix + 'MenuBG.png');
        game.load.image('playbutton', dirPrefix + 'button_Again.png');
        game.load.image('menubutton', dirPrefix + 'button_Menu.png');
        game.load.image('topbar', dirPrefix + 'TopBar.png');
        game.load.image('fishlegend', dirPrefix + 'FishLegend.png');
        game.load.image('bones', dirPrefix + 'bone.png');
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        self.createBackground();
        self.createPlayer();
        self.createFishGroup();
        self.createTextElements();
        self.handleGameOver();
        self.initReady();
    },
    update: function(){
        self.checkColliders();
        self.playerMovement();
    },
    createBackground: function(){
        self.background = game.add.image(0, 0, 'background');
        self.topbar = game.add.sprite(0, 0, 'topbar');
        game.physics.arcade.enable(self.topbar);
        self.topbar.body.immovable = true;
        self.fishlegend = game.add.sprite(400, 0, 'fishlegend');
    },
    createPlayer: function(){
        self.player = game.add.sprite(GAMEWIDTH/2,GAMEHEIGHT/2, 'player');
        self.player.anchor.setTo(0.5);
        self.player.scale.setTo(0.15);
        game.physics.arcade.enable(self.player);
        self.player.body.collideWorldBounds = true;
        self.player.body.drag.setTo(1200);
        self.player.body.setSize(self.player.body.width/self.player.scale.y*0.8,self.player.body.height/self.player.scale.y*0.8);
        self.player.body.offset.x = self.player.body.halfWidth;
        self.player.body.offset.y = self.player.body.halfHeight;
    },
    createFishGroup: function(){
        self.fishGroup = game.add.group();
        self.fishGroup.enableBody = true;
        self.emitter = game.add.emitter(0, 0, 100);
        self.emitter.makeParticles('bones');
        self.emitter.maxParticleScale = 0.05;
        self.emitter.minParticleScale = 0.01;
        self.emitter.gravity = 200;
    },
    addFish: function(size){
        var spawnX = self.getRandomInt(-50,-200);
        var spawnY = self.getRandomInt(100,GAMEHEIGHT-50);
        var speed = self.getRandomInt(self.minFishSpeed,self.maxFishSpeed);
        var switchSide = self.getRandomInt(0,2);
        if(switchSide >= 1) {
            spawnX = -spawnX + GAMEWIDTH;
            speed = -speed;
        }
        var fish;
        switch(size) {
            case 1:
                fish = self.fishGroup.create(spawnX, spawnY, 'littleFish');
                fish.scale.setTo(0.15)
                break;
            case 2:
                fish = self.fishGroup.create(spawnX, spawnY, 'mediumFish');
                fish.scale.setTo(0.3);
                break;
            case 3:
                fish = self.fishGroup.create(spawnX, spawnY, 'bigFish');
                fish.scale.setTo(0.5);
                break;
            default:
                break;
        }
        fish.body.setSize(fish.body.width*0.8,fish.body.height*0.8);
        fish.body.offset.x = fish.body.halfWidth*0.35;
        fish.body.offset.y = fish.body.halfHeight*0.15;
        fish.typeOfFish = size;
        fish.body.velocity.x = speed;
        if(speed < 0) {
            self.flipSpriteX(fish);
        }
    },
    checkColliders: function() {
        game.physics.arcade.overlap(self.player, self.fishGroup, self.hitFish, null, self);
        game.physics.arcade.collide(self.player, self.topbar);
        self.fishGroup.forEach(self.checkFishOutOfBounds, self);
    },
    checkFishOutOfBounds: function(fish){
        if(fish.body.x<-300 || fish.body.x >1100) {
            self.resetFish(fish, false);
        }
    },
    playerMovement: function(){
        if(!self.gameOver && !game.input.activePointer.circle.contains(self.player.x, self.player.y) ) {
            game.physics.arcade.moveToPointer(self.player, 300);
        }
        if((self.player.body.velocity.x < 0 && self.player.scale.x > 0) || (self.player.body.velocity.x > 0 && self.player.scale.x < 0)) {
            self.flipSpriteX(self.player);
        }
    },
    hitFish: function(player, fish){
        if(!self.gameOver) {
            if(player.body.width < fish.body.width) {
                setTimeout(self.initGameOverState,4000);
                self.gameOver = true;
                self.playSharkEatingAnimation(fish);
                self.playSharkDeadAnimation(player);
            } else {
                var points = Math.abs(fish.scale.x*1000);
                var sizeToAdd;
                switch(fish.typeOfFish) {
                    case 1:
                        sizeToAdd = self.playerSizeIncreaseSmall;
                        break;
                    case 2:
                        sizeToAdd = self.playerSizeIncreaseMedium;
                        break;
                    case 3:
                        sizeToAdd = self.playerSizeIncreaseLarge;
                        break;
                }
                player.scale.setTo(Math.abs(player.scale.x) + sizeToAdd);
                self.playSharkEatingAnimation(player);
                self.particleBurst(fish);
                self.resetFish(fish, true);
                self.increaseScore(points);
            }
        }
    },
    particleBurst: function(fish){
        self.emitter.x = fish.position.x;
        self.emitter.y = fish.position.y;
        self.emitter.start(true, 1000, null, 10);
    },
    initGameOverState: function(){
        self.gameOverText.setText('NICE JOB!\nYOU SCORED '+ self.score+' POINTS', true);
        self.gameOverText.visible = true;
        self.msgBox.visible = true;
        self.playAgainButton.visible = true;
        self.menuButton.visible = true;
    },
    playSharkDeadAnimation: function(player){
        let rotateUpsideDown = game.add.tween(player.body).to( {rotation: 180}, 800, Phaser.Easing.Cubic.easeOut);
        let tweenA = game.add.tween(player.body).to( {y: player.body.y-50}, 800, Phaser.Easing.Cubic.easeOut);
        let tweenB = game.add.tween(player.body).to( {y: player.body.y+1000}, 10000, Phaser.Easing.Cubic.easeOut);
        tweenA.chain(tweenB);
        rotateUpsideDown.start();
        tweenA.start()
    },
    playSharkEatingAnimation: function(player){
        let tweenA = game.add.tween(player.body).to( {rotation: -20}, 100, Phaser.Easing.Cubic.easeOut);
        let tweenB = game.add.tween(player.body).to( {rotation: 0}, 100, Phaser.Easing.Cubic.easeOut);
        tweenA.chain(tweenB);
        tweenA.start()
    },
    resetFish: function(fish, increaseSize){
        fish.body.x = self.getRandomInt(-100,-200);
        fish.body.y = self.getRandomInt(100,GAMEHEIGHT-50);
        fish.body.velocity.x = self.getRandomInt(self.minFishSpeed,self.maxFishSpeed);
        var switchSide = self.getRandomInt(0,2);
        if(switchSide >= 1) {
            fish.body.x = -fish.body.x + GAMEWIDTH;
            fish.body.velocity.x = -fish.body.velocity.x;
        }
        if(increaseSize) {
            var sizeToAdd;
            switch(fish.typeOfFish) {
                case 1:
                    sizeToAdd = self.fishSizeIncreaseSmall;
                    break;
                case 2:
                    sizeToAdd = self.fishSizeIncreaseMedium;
                    break;
                case 3:
                    sizeToAdd = self.fishSizeIncreaseLarge;
                    break;
            }
            fish.scale.setTo(Math.abs(fish.scale.x) + sizeToAdd);
        }
        if((fish.body.velocity.x < 0 && fish.scale.x > 0) || (fish.body.velocity.x > 0 && fish.scale.x < 0)) {
            self.flipSpriteX(fish);
        }
    },
    createTextElements: function(){
        self.msgBox = game.add.sprite(GAMEWIDTH/2,GAMEHEIGHT/2, 'msgbox');
        self.msgBox.anchor.setTo(0.5);
        self.scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        self.gameOverText = game.add.text(GAMEWIDTH/2,GAMEHEIGHT*0.4, 'NICE JOB!\nYOU SCORED '+ self.score, { fontSize: '32px', fill: '#FF0000', align:'center' });
        self.gameOverText.anchor.setTo(0.5);
        self.highScoreText = game.add.text(16, 48, 'Highscore: '+self.highScore, { fontSize: '32px', fill: '#FFF' });
        self.gameOverText.visible = false;
        self.msgBox.visible = false;
        self.playAgainButton = game.add.sprite(GAMEWIDTH*0.65,GAMEHEIGHT*0.65, 'playbutton');
        self.playAgainButton.anchor.setTo(0.5);
        self.playAgainButton.inputEnabled = true;
        self.playAgainButton.visible = false;
        self.menuButton = game.add.sprite(GAMEWIDTH*0.35,GAMEHEIGHT*0.65, 'menubutton');
        self.menuButton.anchor.setTo(0.5);
        self.menuButton.inputEnabled = true;
        self.menuButton.visible = false;
    },
    handleGameOver: function(){
        self.playAgainButton.events.onInputDown.add(self.playAgain, self);
        self.menuButton.events.onInputDown.add(self.goToMenu, game);
    },
    playAgain: function() {
        if(self.gameOver) {
            self.gameOver = false;
            self.gameOverText.visible = false;
            self.playAgainButton.visible = false;
            self.menuButton.visible = false;
            self.score = 0;
            game.state.restart();
        }
    },
    goToMenu: function() {
        if(self.gameOver) {
            self.gameOver = false;
            self.gameOverText.visible = false;
            self.playAgainButton.visible = false;
            self.menuButton.visible = false;
            self.score = 0;
            game.state.start('menu');
        }
    },
    getRandomInt: function(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    },
    increaseScore: function(points) {
        self.score += points;
        self.scoreText.setText('Score: ' + self.score);
        if(self.score > self.highScore) {
            self.highScore = self.score;
            self.highScoreText.setText('Highscore: ' + self.highScore);
        }
        if(self.score > self.winConditionPoints) {
            self.gameOver = true;
            self.gameOverText.setText('NICE JOB!\nYOU ARE THE BIGGEST FISH!', true);
            self.gameOverText.visible = true;
            self.msgBox.visible = true;
            self.playAgainButton.visible = true;
            self.menuButton.visible = true;
        }
    },
    flipSpriteX: function(sprite){
        sprite.scale.x *= -1;
    },
    initReady: function(){
        game.time.events.add(5000,self.createLittleFish,game);
        self.readyText = game.add.text(GAMEWIDTH/2,GAMEHEIGHT*0.4, 'EAT SMALLER FISH TO GROW BIG!\nAVOID BIGGER FISH!', { fontSize: '40px', fill: '#FF0000', align:'center' });
        self.readyText.anchor.setTo(0.5);
        game.add.tween(self.readyText).to( { alpha: 0 }, 7000, Phaser.Easing.Linear.None, true);
        game.time.events.add(15000,self.createMediumFish,game);
        game.time.events.add(25000,self.createLargeFish,game);
    },
    createLittleFish: function(){
        var i;
        for(i = 0; i<self.numOfSmallFish; i++) {
            self.addFish(1);
        }
    },
    createMediumFish: function(){
        var i;
        for(i = 0; i<self.numOfMediumFish; i++) {
            self.addFish(2);
        }
    },
    createLargeFish: function(){
        var i;
        for(i = 0; i<self.numOfLargeFish; i++) {
            self.addFish(3);
        }
    }
};
game.state.add('fishGame', fishGame);
