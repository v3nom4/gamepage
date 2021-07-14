dodgeGame = {
    player: undefined,
    background: undefined,
    topbar: undefined,
    emitter: undefined,
    stars: undefined,
    graphics: undefined,
    levelTimer: undefined,
    scoreTimer: undefined,
    score: 0,
    highScore: 0,
    gameOver: false,
    gameOverText: undefined,
    scoreText: undefined,
    highScoreText: undefined,
    level: 1,
    levelText: undefined,
    minStarSpeed: 100,
    maxStarSpeed: 200,
    readyText: undefined,
    preload: function(){
        var dirPrefix = 'games/kidsDodge/assets/'
        game.load.image('sky', dirPrefix + 'space.png');
        game.load.image('player', dirPrefix + 'red.png');
        game.load.image('star', dirPrefix + 'star.png');
        game.load.image('msgbox', dirPrefix + 'MenuBG.png');
        game.load.image('playbutton', dirPrefix + 'button_Again.png');
        game.load.image('menubutton', dirPrefix + 'button_Menu.png');
        game.load.image('topbar', dirPrefix + 'TopBar.png');
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        self.createBackground();
        self.createPlayer();
        self.createStars();
        self.createTextElements();
        self.handleGameOver();
        self.initTimers();
    },
    update: function(){
        self.checkColliders();
        self.emitter.forEach(function(child) {
            child.scale.setTo(child.scale.x * 0.97);
        }, game, true);
    },
    createBackground: function(){
        self.background = game.add.image(0, 0, 'sky');
        self.topbar = game.add.sprite(0, 0, 'topbar');
        game.physics.arcade.enable(self.topbar);
        self.topbar.body.immovable = true;
    },
    createPlayer: function(){
        self.player = game.add.sprite(GAMEWIDTH/2,GAMEHEIGHT/2, 'player');
        self.player.anchor.setTo(0.5);
        self.player.scale.setTo(0.1);
        game.physics.arcade.enable(self.player);
        self.player.body.collideWorldBounds = true;
        self.emitter = game.add.emitter(self.player.x, self.player.y, 200);
        self.emitter.makeParticles('player');
        self.emitter.maxParticleScale = 0.3;
        self.emitter.minParticleScale = 0.2;
        self.emitter.blendMode = 1;
        self.emitter.gravity = 0;
        self.emitter.start(false, 1000, 1);
        game.input.addMoveCallback(function (pointer) {
            self.player.x = pointer.x;
            if(pointer.y < 100) {
                self.player.y = 100;
            } else {
                self.player.y = pointer.y;
            }
            self.emitter.x = self.player.x;
            self.emitter.y = self.player.y;
        }, game);
    },
    createStars: function(){
        self.stars = game.add.group();
        self.stars.enableBody = true;
        self.graphics = game.add.graphics(0,0);
    },
    addStar: function(){
        var star = self.stars.create(50, 50, 'star');
        star.body.collideWorldBounds = true;
        star.body.bounce.x = 1;
        star.body.bounce.y = 1;
        star.body.velocity.x = self.getRandomInt(self.minStarSpeed, self.maxStarSpeed);
        star.body.velocity.y = self.getRandomInt(self.minStarSpeed, self.maxStarSpeed);
    },
    checkColliders: function(){
        game.physics.arcade.overlap(self.player, self.stars, self.hitStar, null, self);
        game.physics.arcade.collide(self.stars, self.topbar);
        game.physics.arcade.collide(self.player, self.topbar);
    },
    hitStar: function(player, star){
        self.levelTimer.timer.stop();
        self.scoreTimer.timer.stop();
        if(self.gameOver == false) {
            self.stars.forEach(self.stopGroupMovement, self);
            self.flashCauseOfLoss(star);
            setTimeout(self.initGameOverState,2000);
            self.gameOver = true;
        }
    },
    stopGroupMovement: function(item){
        item.body.velocity.x = 0;
        item.body.velocity.y = 0;
    },
    flashCauseOfLoss: function(cause){
        self.graphics.x = cause.body.x;
        self.graphics.y = cause.body.y;
        self.graphics.beginFill(0xFF0000, 0.75);
        self.graphics.drawCircle(cause.width/2, cause.height/2, cause.width);
        self.graphics.endFill();
        game.add.tween(self.graphics).to( {alpha:0}, 200, Phaser.Easing.Cubic.easeOut, true, 0, false).yoyo(true);
    },
    createTextElements: function(){
        self.msgBox = game.add.sprite(GAMEWIDTH/2,GAMEHEIGHT/2, 'msgbox');
        self.msgBox.anchor.setTo(0.5);
        self.scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        self.gameOverText = game.add.text(GAMEWIDTH/2,GAMEHEIGHT*0.4, 'NICE JOB!\nYOU SCORED '+ self.score, { fontSize: '32px', fill: '#FF0000', align:'center' });
        self.gameOverText.anchor.setTo(0.5);
        self.highScoreText = game.add.text(16, 48, 'Highscore: '+self.highScore, { fontSize: '32px', fill: '#FFF' });
        self.levelText = game.add.text(784, 16, 'Level: '+self.level, { fontSize: '32px', fill: '#FFF', align:'right' });
        self.levelText.anchor.setTo(1,0);
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
            self.level = 1;
            self.minStarSpeed = 100;
            self.maxStarSpeed = 200;
            game.state.restart();
            self.levelTimer.timer.start();
            self.scoreTimer.timer.start();
        }
    },
    goToMenu: function() {
        if(self.gameOver) {
            self.gameOver = false;
            self.gameOverText.visible = false;
            self.playAgainButton.visible = false;
            self.menuButton.visible = false;
            self.score = 0;
            self.level = 1;
            self.minStarSpeed = 100;
            self.maxStarSpeed = 200;
            self.levelTimer.timer.start();
            self.scoreTimer.timer.start();
            game.state.start('menu');
        }
    },
    increaseDifficulty: function(){
        self.level += 1;
        self.levelText.setText("Level: "+self.level);
        self.minStarSpeed += 50;
        self.maxStarSpeed += 50;
        self.addStar();
    },
    getRandomInt: function(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    },
    increaseScore: function(){
        self.score += 10*self.level;
        self.scoreText.setText('Score: ' + self.score);
        if(self.score > self.highScore) {
            self.highScore = self.score;
            self.highScoreText.setText('Highscore: ' + self.highScore);
        }
    },
    initTimers: function(){
        game.time.events.add(5000,self.startTimers,game);
        self.readyText = game.add.text(GAMEWIDTH/2,GAMEHEIGHT*0.4, 'DODGE THE STARS!', { fontSize: '60px', fill: '#FF0000', align:'center' });
        self.readyText.font = 'Revalia';
        self.readyText.anchor.setTo(0.5);
        game.add.tween(self.readyText).to( { alpha: 0 }, 5000, Phaser.Easing.Linear.None, true);
    },
    startTimers: function(){
        self.addStar();
        self.levelTimer = game.time.events.loop(4000,self.increaseDifficulty,game);
        self.scoreTimer = game.time.events.loop(1000,self.increaseScore,game);
    },
    initGameOverState: function(){
        self.gameOverText.setText('NICE JOB!\nYOU SCORED '+ self.score+' POINTS', true);
        self.gameOverText.visible = true;
        self.msgBox.visible = true;
        self.playAgainButton.visible = true;
        self.menuButton.visible = true;
    }
};
game.state.add('dodgeGame', dodgeGame);
