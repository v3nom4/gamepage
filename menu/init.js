var GAMEWIDTH = 800;
var GAMEHEIGHT = 600;
var game = new Phaser.Game(GAMEWIDTH, GAMEHEIGHT, Phaser.AUTO, '');
WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    active: function() {game.state.start('menu');},
    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Revalia','Bangers','Ultra','Press Start 2P']
    }
};
init = {
    background: undefined,
    preload: function(){
        var dirPrefix = 'menu/assets/'
        game.load.image('background', dirPrefix + 'yellow_bg.png');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },
    create: function(){
        self.background = game.add.image(0, 0, 'background');
    }
};
game.state.add('init', init);
game.state.start('init');
