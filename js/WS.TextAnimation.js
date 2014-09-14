
WS.TextAnimation = function( opt ) {
    if ( opt === undefined ) { throw 'Cannot create WS.TextAnimation, constructor parameters missing'; }
	this.mText = ( opt.text !== undefined ) ? opt.text : "";
	this.mStyle = ( opt.style !== undefined ) ? opt.style : "#CCC";
	this.mGameX = ( opt.game_x !== undefined ) ? opt.game_x : 0;
	this.mGameY = ( opt.game_y !== undefined ) ? opt.game_y : 0;

	this.mCanvas = GAME.layer_control.GetCanvas('monsters');
	this.mCtx = GAME.layer_control.GetContext('monsters');

	this.mCurX = $.gmRndInt( parseInt( -GAME.Display.mOutDX / 2 ), parseInt( GAME.Display.mOutDX / 2 ) );
	this.mCurY =  $.gmRndInt( -parseInt(GAME.Display.mOutDX / 5 ), parseInt( GAME.Display.mOutDY / 3 ) );
}

WS.TextAnimation.prototype = {
    constructor: WS.TextAnimation
};

WS.TextAnimation.prototype.Update = function( dt ) {
	var dy = GAME.Display.mOutDY
	this.mCurY += dt / 1000.0 * dy / 2;
	if ( this.mCurY > dy * 1.5 ) { this.mCurY = dy; return true; }
	return false;
};

WS.TextAnimation.prototype.Render = function() {
	var dx = GAME.Display.mOutDX;
	var x = this.mCurX, y = -this.mCurY;
	var pc = GAME.player.GetGameXY();

	posx = GAME.Display.mTileSize.hw * dx + dx / 2 + (this.mGameX - pc.x) * dx; 
	posy = GAME.Display.mTileSize.hh * dx + dx / 2 + (this.mGameY - pc.y) * dx;

	var scale = GAME.Display.mScaleFactor;

	this.mCtx.save();

    this.mCtx.translate( posx, posy );

	// text shadow
    this.mCtx.fillStyle = '#000';
    this.mCtx.font = parseInt( Math.floor( 20 * scale ) ) + "px monospace";
    this.mCtx.fillText( this.mText, x + 1 - this.mText.length / 2 * parseInt( Math.floor( 10 * scale ) ), y + 1 );

	// text
    this.mCtx.fillStyle = this.mStyle;
    this.mCtx.font = parseInt( Math.floor( 20 * scale ) ) + "px monospace";
    this.mCtx.fillText( this.mText, x - this.mText.length / 2 * parseInt( Math.floor( 10 * scale ) ), y );

	this.mCtx.restore();

};
