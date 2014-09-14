
WS.Overlay = function( opt ) {
    if ( opt === undefined ) { throw 'Cannot create WS.Overlay, constructor parameters missing'; }
	this.mImg = ( opt.img !== undefined ) ? opt.img : undefined;
	this.mX = (opt.x !== undefined ) ? opt.x : 0;
	this.mY = (opt.y !== undefined ) ? opt.y : 0;
	this.mW = (opt.w !== undefined ) ? opt.w : 1;
	this.mH = (opt.h !== undefined ) ? opt.h : 1;
	this.mDestX = (opt.dest_x !== undefined ) ? opt.dest_x : 0;
	this.mDestY = (opt.dest_y !== undefined ) ? opt.dest_y : 0;
};

WS.Overlay.prototype = {
    constructor: WS.Overlay
};

WS.Overlay.prototype.Render = function( ctx ) {
	var scale = GAME.Display.mScaleFactor;
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.globalCompositeOperation = "source-atop";
    ctx.drawImage(
        this.mImg,
        this.mX, // x from
        this.mY, // y from
        this.mW, // width from
        this.mH, // height from
		parseInt( this.mDestX * scale ), 
		parseInt( this.mDestY * scale ),
		parseInt( this.mW * scale ), 
		parseInt( this.mH * scale )
	);
    ctx.restore();
	return this;
};

