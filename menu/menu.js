menu = {
    background: undefined,
    playDodgeGameButton: undefined,
    playDodgeGameButtonBig: undefined,
    playDodgeGameText: undefined,
    playFishGameButton: undefined,
    playFishGameButtonBig: undefined,
    playFishGameText: undefined,
    playBubblePopGameButton: undefined,
    playBubblePopGameButtonBig: undefined,
    playBubblePopGameText: undefined,
    preload: function(){
        var dirPrefix = 'menu/assets/'
        game.load.image('background', dirPrefix + 'yellow_bg.png');
        game.load.image('dodgeGameButton', dirPrefix + 'butt_star.png');
        game.load.image('dodgeGameButtonBig', dirPrefix + 'bigbutt_star.png');
        game.load.image('fishGameButton', dirPrefix + 'butt_shark.png');
        game.load.image('fishGameButtonBig', dirPrefix + 'bigbutt_shark.png');
        game.load.image('bubbleGameButton', dirPrefix + 'butt_bubble.png');
        game.load.image('bubbleGameButtonBig', dirPrefix + 'bigbutt_bubble.png');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	game.scale.pageAlignHorizontally = true;
    	game.scale.pageAlignVertically = true;
    },
    create: function(){
        self.background = game.add.image(0, 0, 'background');

        self.playDodgeGameButtonBig = game.add.image(GAMEWIDTH*0.18,GAMEHEIGHT*0.4,'dodgeGameButtonBig');
        self.playDodgeGameButtonBig.anchor.setTo(0.5);
        self.playDodgeGameButtonBig.inputEnabled = true;
        self.playDodgeGameButtonBig.events.onInputDown.add(this.playDodgeGame, this);
        self.playDodgeGameButton = game.add.image(GAMEWIDTH*0.18,GAMEHEIGHT*0.78,'dodgeGameButton');
        self.playDodgeGameButton.anchor.setTo(0.5);
        self.playDodgeGameButton.inputEnabled = true;
        self.playDodgeGameButton.events.onInputDown.add(this.playDodgeGame, this);
        self.playDodgeGameText = game.add.text(GAMEWIDTH*0.18,GAMEHEIGHT*0.78, 'StarDodge', { fontSize: '20px', fill: '#FFFFFF', align:'center' });
        self.playDodgeGameText.anchor.setTo(0.5);
        self.playDodgeGameText.font = 'Press Start 2P';

        self.playFishGameButtonBig = game.add.image(GAMEWIDTH*0.5,GAMEHEIGHT*0.4,'fishGameButtonBig');
        self.playFishGameButtonBig.anchor.setTo(0.5);
        self.playFishGameButtonBig.inputEnabled = true;
        self.playFishGameButtonBig.events.onInputDown.add(this.playFishGame, this);
        self.playFishGameButton = game.add.image(GAMEWIDTH*0.5,GAMEHEIGHT*0.78,'fishGameButton');
        self.playFishGameButton.anchor.setTo(0.5);
        self.playFishGameButton.inputEnabled = true;
        self.playFishGameButton.events.onInputDown.add(this.playFishGame, this);
        self.playFishGameText = game.add.text(GAMEWIDTH*0.5,GAMEHEIGHT*0.78, 'SharkFood', { fontSize: '20px', fill: '#FFFFFF', align:'center' });
        self.playFishGameText.anchor.setTo(0.5);
        self.playFishGameText.font = 'Press Start 2P';

        self.playBubblePopGameButtonBig = game.add.image(GAMEWIDTH*0.82,GAMEHEIGHT*0.4,'bubbleGameButtonBig');
        self.playBubblePopGameButtonBig.anchor.setTo(0.5);
        self.playBubblePopGameButtonBig.inputEnabled = true;
        self.playBubblePopGameButtonBig.events.onInputDown.add(this.playBubblePopGame, this);
        self.playBubblePopGameButton = game.add.image(GAMEWIDTH*0.82,GAMEHEIGHT*0.78,'bubbleGameButton');
        self.playBubblePopGameButton.anchor.setTo(0.5);
        self.playBubblePopGameButton.inputEnabled = true;
        self.playBubblePopGameButton.events.onInputDown.add(this.playBubblePopGame, this);
        self.playBubblePopGameText = game.add.text(GAMEWIDTH*0.82,GAMEHEIGHT*0.78, 'BubblePop', { fontSize: '20px', fill: '#FFFFFF', align:'center' });
        self.playBubblePopGameText.anchor.setTo(0.5);
        self.playBubblePopGameText.font = 'Press Start 2P';
    },
    playDodgeGame: function(){
        self = dodgeGame;
        game.state.start('dodgeGame');
    },
    playFishGame: function(){
        self = fishGame;
        game.state.start('fishGame');
    },
    playBubblePopGame: function() {
        self = bubblePopGame;
        game.state.start('bubblePopGame');
    }
};
game.state.add('menu', menu);
self = menu;
