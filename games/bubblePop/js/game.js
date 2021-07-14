bubblePopGame = {
    background: undefined,
    topbar: undefined,
    legend: undefined,
    emitter: undefined,
    score: 0,
    highScore: 0,
    gameOver: false,
    gameOverText: undefined,
    scoreText: undefined,
    highScoreText: undefined,
    bubbleGroup: undefined,
    numOfbubbles: 5,
    badBubbleGroup: undefined,
    graphics: undefined,
    numOfBadBubbles: 0,
    bubblesPopped: 0,
    winConditionPoints: 15000,
    speed: 150,
    preload: function(){
        var dirPrefix = 'games/bubblePop/assets/'
        game.load.image('background', dirPrefix + 'bub_bg.png');
        game.load.image('bubble', dirPrefix + 'bubbleNice.png');
        game.load.image('particles', dirPrefix + 'bubbleNice.png');
        game.load.image('badBubble', dirPrefix + 'bubbleMean.png');
        game.load.image('msgbox', dirPrefix + 'MenuBG.png');
        game.load.image('playbutton', dirPrefix + 'button_Again.png');
        game.load.image('menubutton', dirPrefix + 'button_Menu.png');
        game.load.image('topbar', dirPrefix + 'TopBar.png');
        game.load.image('legend', dirPrefix + 'bubbleLegend.png');
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        self.createBackground();
        self.createbubbles();
        self.createBadBubbles();
        self.createTextElements();
        self.handleGameOver();
    },
    update: function(){
        self.emitter.forEach(function(child) {
            child.scale.setTo(child.scale.x * 0.97);
        }, game, true);
        game.physics.arcade.collide(self.bubbleGroup, self.bubbleGroup);
        game.physics.arcade.collide(self.badBubbleGroup, self.badBubbleGroup);
        game.physics.arcade.collide(self.bubbleGroup, self.topbar);
        game.physics.arcade.collide(self.badBubbleGroup, self.topbar);
    },
    createBackground: function(){
        self.background = game.add.image(0, 0, 'background');
        self.topbar = game.add.sprite(0, 0, 'topbar');
        game.physics.arcade.enable(self.topbar);
        self.topbar.body.immovable = true;
        self.legend = game.add.sprite(500, 0, 'legend');
    },
    createbubbles: function(){
        self.emitter = game.add.emitter(0, 0, 100);
        self.emitter.makeParticles('particles');
        self.emitter.maxParticleScale = 0.3;
        self.emitter.minParticleScale = 0.2;
        self.emitter.gravity = -100;

        self.bubbleGroup = game.add.group();
        self.bubbleGroup.inputEnableChildren = true;
        self.bubbleGroup.enableBody = true;
        var i;
        for(i = 0; i<self.numOfbubbles; i++) {
            self.addbubble();
        }
    },
    addbubble: function(){
        var spawnX = self.getRandomInt(50,GAMEWIDTH-50);
        var spawnY = self.getRandomInt(150,GAMEHEIGHT-50);
        var bubble = self.bubbleGroup.create(spawnX, spawnY, 'bubble');
        bubble.body.collideWorldBounds=true;
        bubble.anchor.setTo(0.5);
        bubble.body.velocity.x = self.getRandomInt(-self.speed,self.speed);
        bubble.body.velocity.y = self.getRandomInt(-self.speed,self.speed);
        bubble.body.bounce.setTo(1);
        bubble.events.onInputDown.add(self.bubbleClicked, self);
    },
    bubbleClicked: function(bubble){
        if(!self.gameOver) {
            self.particleBurst(bubble);
            self.increaseScore(100);
            self.bubblesPopped += 1;
            bubble.visible = false;
            bubble.body.enable = false;
            if(self.bubblesPopped >= self.numOfbubbles) {
                self.bubbleGroup.forEach(self.resetbubble, self);
                self.bubblesPopped = 0;
                self.addBadBubble();
            }
        }
    },
    particleBurst: function(bubble){
        self.emitter.x = bubble.position.x;
        self.emitter.y = bubble.position.y;
        self.emitter.start(true, 1000, null, 30);
    },
    resetbubble: function(bubble){
        bubble.position.x = self.getRandomInt(50,GAMEWIDTH-50);
        bubble.position.y = self.getRandomInt(150,GAMEHEIGHT-50);
        bubble.body.velocity.y = self.getRandomInt(-self.speed,self.speed);
        bubble.body.velocity.x = self.getRandomInt(-self.speed,self.speed);
        bubble.visible = true;
        bubble.body.enable = true;
    },
    createBadBubbles: function(){
        self.badBubbleGroup = game.add.group();
        self.badBubbleGroup.inputEnableChildren = true;
        self.badBubbleGroup.enableBody = true;
        var i;
        for(i = 0; i<self.numOfBadBubbles; i++) {
            self.addBadBubble();
        };
        self.graphics = game.add.graphics(0,0);
    },
    addBadBubble: function(){
        var spawnX = self.getRandomInt(50,GAMEWIDTH-50);
        var spawnY = self.getRandomInt(150,GAMEHEIGHT-50);
        var badBubble = self.badBubbleGroup.create(spawnX, spawnY, 'badBubble');
        badBubble.body.collideWorldBounds=true;
        badBubble.anchor.setTo(0.5);
        badBubble.body.velocity.x = self.getRandomInt(-self.speed,self.speed);
        badBubble.body.velocity.y = self.getRandomInt(-self.speed,self.speed);
        badBubble.body.bounce.setTo(1);
        badBubble.events.onInputDown.add(self.badBubbleClicked, self,0,badBubble);
    },
    badBubbleClicked: function(bubble){
        self.bubbleGroup.forEach(self.stopGroupMovement, self);
        self.badBubbleGroup.forEach(self.stopGroupMovement, self);
        self.flashCauseOfLoss(bubble);
        setTimeout(self.initGameOverState,2000);
    },
    stopGroupMovement: function(item){
        item.body.velocity.x = 0;
        item.body.velocity.y = 0;
    },
    flashCauseOfLoss: function(cause){
        self.graphics.x = cause.body.x;
        self.graphics.y = cause.body.y;
        self.graphics.beginFill(0xFF0000, 0.75);
        self.graphics.drawRect(0, 0, cause.width, cause.height);
        self.graphics.endFill();
        game.add.tween(self.graphics).to( {alpha:0}, 200, Phaser.Easing.Cubic.easeOut, true, 0, false).yoyo(true);
    },
    initGameOverState: function(){
        self.gameOver = true;
        self.gameOverText.setText('NICE JOB!\nYOU SCORED '+ self.score+' POINTS', true);
        self.gameOverText.visible = true;
        self.msgBox.visible = true;
        self.playAgainButton.visible = true;
        self.menuButton.visible = true;
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
        self.menuButton.events.onInputDown.add(self.goToMenu, self);
    },
    playAgain: function() {
        if(self.gameOver) {
            self.gameOver = false;
            self.gameOverText.visible = false;
            self.playAgainButton.visible = false;
            self.menuButton.visible = false;
            self.score = 0;
            self.bubblesPopped = 0;
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
            self.bubblesPopped = 0;
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
        if(self.score >= self.winConditionPoints) {
            self.gameOver = true;
            self.gameOverText.setText('NICE JOB!\nYOU WIN!', true);
            self.gameOverText.visible = true;
            self.msgBox.visible = true;
            self.playAgainButton.visible = true;
            self.menuButton.visible = true;
        }
    }
};
game.state.add('bubblePopGame', bubblePopGame);
