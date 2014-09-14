//
// WS.Animation - complete?
//
// Description: 
//

WS.Animation = function( opt ) {
    if ( opt === undefined ) { throw 'Cannot create WS.Animation, constructor parameters missing'; }
	this.mName = ( opt.name !== undefined ) ? opt.name : "";
	this.mSourceImage = ( opt.source_image !== undefined ) ? opt.source_image : undefined;
	this.mFrames = ( opt.frames !== undefined ) ? opt.frames : []; // each frame: { 'x': 0, 'y': 0, 'w': 72, 'h': 72, 't': 150 }
	this.mSpeed = ( opt.speed !== undefined ) ? opt.speed : 1.0;

	this.mMaxTime = 0;
	for ( var i = 0, len = this.mFrames.length; i < len; i++ ) {
		this.mMaxTime += this.mFrames[i].t * this.mSpeed;
	}
	this.mCurrentFrame = 0;
	this.mOffsetX = ( opt.offset_x !== undefined ) ? opt.offset_x : 0;
	this.mOffsetY = ( opt.offset_y !== undefined ) ? opt.offset_y : 0;

	this.mTime = 0;
};

WS.Animation.prototype = {
	constructor: WS.Animation
};

WS.Animation.prototype.Update = function( dt ) {
	if ( dt === undefined ) { throw "Cannot draw WS.Animation, delta t is undefined"; }
	if ( dt < 0 ) { throw 'dt is negative!!!'; }
	this.mTime += dt; 
	var animation_ended = false;
	if ( this.mTime > this.mMaxTime ) { 
		this.mTime = this.mMaxTime - this.mTime; 
		if ( this.mTime < 0 ) { this.mTime = 0; }
		animation_ended = true;
	} 
	var timesum = 0;
	for ( var i = 0, len = this.mFrames.length; i < len; i++ ) {
		timesum += this.mFrames[i].t * this.mSpeed;
		if ( this.mTime < timesum ) { this.mCurrentFrame = i; break; }
	}
	return animation_ended; // false == animation still rolling, true = just ended
};

WS.Animation.prototype.Render = function( ctx, flipx ) {
	if ( ctx === undefined ) { throw "Cannot draw WS.Animation, context is undefined"; }
	var scale = GAME.Display.mScaleFactor;
	var flip = ( flipx === true ) ? -1 : 1;
	var frame = this.mFrames[this.mCurrentFrame];
	ctx.save();
	ctx.drawImage( this.mSourceImage, frame.x, frame.y, frame.w, frame.h, 
		-frame.w / 2 * scale + this.mOffsetX * scale, 
		-frame.h / 2 * scale + this.mOffsetY * scale, 
		parseInt( frame.w * scale ), parseInt( frame.h * scale ) 
	);
	ctx.restore();
};

WS.Animation.prototype.TimeReset = function() {
	this.mTime = 0;
};

WS.Animation.prototype.SetOffsetXY = function( offset_x, offset_y ) {
	this.mOffsetX = offset_x;
	this.mOffsetY = offset_y;
};

