//
// WS.Sprite
//
// Description:
//

WS.Sprite = function( opt ) {
	if ( opt === undefined ) { throw 'Cannot create WS.Sprite, constructor parameters missing'; }
	if ( opt.canvas === undefined ) { throw "Cannot create WS.Sprite, canvas is missing"; }
	if ( opt.animations === undefined ) { throw "Cannot create WS.Sprite, animations are missing"; }

	WS.ScreenObject.call( this, opt );

	this.mCanvas = ( opt.canvas !== undefined ) ? opt.canvas : undefined;
	this.mCtx    = ( this.mCanvas !== undefined ) ? this.mCanvas.getContext("2d") : undefined;

	this.mFlipX = ( opt.flipx !== undefined ) ? opt.flipx : false;
	this.mOffsetX = ( opt.offsetx !== undefined ) ? opt.offsetx : 0;
	this.mOffsetY = ( opt.offsety !== undefined ) ? opt.offsety : 0;

	this.mOverlay = ( opt.overlay !== undefined ) ? opt.overlay : undefined;

	this.mAnimations = ( opt.animations !== undefined ) ? opt.animations : {};
	this.mDefaultAnimation = ( opt.default_animation !== undefined ) ? opt.default_animation : "";
	this.mCurrentAnimation = ( opt.current_animation !== undefined ) ? opt.current_animation : opt.default_animation;

	this.mTagColor = ( opt.tag_color !== undefined ) ? opt.tag_color : '#CCC';

	this.mEffects = [];
	this.mRangedEffect = undefined;

	this.mCallbackFunc = undefined;
};

WS.Sprite.prototype = Object.create( WS.ScreenObject.prototype );

WS.Sprite.prototype.SetTagColor = function( tag_color ) {
	this.mTagColor = ( tag_color !== undefined ) ? tag_color : '#CCC';
};

WS.Sprite.prototype.SetOverlay = function( overlay ) {
    this.mOverlay = overlay;
	return this;
};

WS.Sprite.prototype.RemoveOverlay = function() {
    this.mOverlay = undefined;
	return this;
};

WS.Sprite.prototype.Update = function( dt ) {
	if ( dt === undefined ) { throw "Cannot update WS.Sprite, delta t is missing"; }
	if ( this.mCurrentAnimation === "" ) { return; }

	var is_animation_ended = this.mAnimations[this.mCurrentAnimation].Update( dt );

	if ( is_animation_ended === true && this.mDefaultAnimation !== "") {
		this.mCurrentAnimation = this.mDefaultAnimation;
	}

	if ( is_animation_ended === true ) {
		//console.log( 'animation ended' );
		if ( this.mCallbackFunc ) {
			//console.log('Sprite: executing callback');
			//console.log( this.mCallbackFunc );
			var tmp = this.mCallbackFunc.bind({});
			this.mCallbackFunc = undefined;
			tmp();
		} else {
			//console.log('no callback to call');
		}
	}

	if ( this.mEffects.length > 0 ) {
		var i = this.mEffects.length;
		while ( i-- ) {
			if ( this.mEffects[i].Update(dt) === true ) {
				this.mEffects.splice( i, 1 );
			}
		}
	}

	if ( this.mRangedEffect != undefined ) {
		var effect_ended = this.mRangedEffect.UpdateEffect( dt );
		if ( effect_ended === true ) {
			this.mRangedEffect = undefined;
		}
	}

	return is_animation_ended;
};

WS.Sprite.prototype.Render = function() {
	var gd = GAME.Display;
	this.mCtx.save();
	this.mCtx.translate( this.mX + this.mOffsetX, this.mY + this.mOffsetY ); // already at center of sprite
	if ( this.mFlipX === true ) {
	    this.mCtx.scale( -1, 1 );
	}
	this.mAnimations[this.mCurrentAnimation].Render( this.mCtx, this.mFlipX );
    if ( this.mOverlay !== undefined ) {
        this.mOverlay.Render( this.mCtx );
    }
	if ( this.mEffects.length > 0 ) {
		for ( var i = 0, len = this.mEffects.length; i < len; i++ ) {
			this.mEffects[i].Render( this.mCtx, this.mFlipX );
		}
	}
	if ( this.mRangedEffect != undefined ) {
		this.mRangedEffect.RenderEffect();
	}
	this.mCtx.restore();

	if ( this.mIsBoss !== undefined && this.mIsBoss === true ) {
		this.RenderBoss();
	}
	if ( this.mIsCharmed !== undefined && this.mIsCharmed === true ) {
		this.RenderCharmed();
	}
	if ( this.mIsFlying !== undefined && this.mIsFlying === true ) {
		this.RenderFlying();
	}
	if ( this.mIsPoisoned !== undefined && this.mIsPoisoned === true ) {
		this.RenderPoisoned();
	}
	if ( this.mIsBleeding !== undefined && this.mIsBleeding === true ) {
		this.RenderBleeding();
	}
	if ( this.mIsHidden !== undefined && this.mIsHidden === true ) {
		this.RenderHidden();
	}
	if ( this.mIsSleeping !== undefined && this.mIsSleeping === true ) {
		this.RenderSleeping();
	}
	if ( this.mIsEntangled !== undefined && this.mIsEntangled === true ) {
		this.RenderEntangled();
	}
	if ( this.mIsFrenzied !== undefined && this.mIsFrenzied === true ) {
		this.RenderFrenzied();
	}

	return this;
};

WS.Sprite.prototype.RenderCharmed = function() {
	var scale = GAME.Display.mScaleFactor;
	var img = GAME.Images.Get('markers');
	this.mCtx.save();
	this.mCtx.translate( this.mX + this.mOffsetX + GAME.Display.mOutDX / 2 - 12 * scale,
		this.mY - GAME.Display.mOutDY / 2 + this.mOffsetY + 30 * scale );
    this.mCtx.drawImage( img, 0, 144, 24, 24,
        parseInt(-12 * scale),
        parseInt(-12 * scale),
        parseInt( 24 * scale ), parseInt( 24 * scale )
    );
	this.mCtx.restore();
	return this;
};

WS.Sprite.prototype.RenderFlying = function() {
	var scale = GAME.Display.mScaleFactor;
	var img = GAME.Images.Get('markers');
	this.mCtx.save();
	this.mCtx.translate( this.mX - GAME.Display.mOutDX / 2 + this.mOffsetX,
		this.mY - GAME.Display.mOutDY / 2 + this.mOffsetY );
    this.mCtx.drawImage( img, 0, 72, 24, 24,
        0,
        0,
        parseInt( 24 * scale ), parseInt( 24 * scale )
    );
	this.mCtx.restore();
	return this;
};

WS.Sprite.prototype.RenderHidden = function() {
	var scale = GAME.Display.mScaleFactor;
	var img = GAME.Images.Get('markers');
	this.mCtx.save();
	this.mCtx.translate( this.mX - GAME.Display.mOutDX / 2 + this.mOffsetX,
		this.mY - GAME.Display.mOutDY / 2 + this.mOffsetY );
    this.mCtx.drawImage( img, 0, 96, 24, 24,
        0,
        0,
        parseInt( 24 * scale ), parseInt( 24 * scale )
    );
	this.mCtx.restore();
	return this;
};

WS.Sprite.prototype.RenderEntangled = function() {
	var scale = GAME.Display.mScaleFactor;
	var img = GAME.Images.Get('markers');
	this.mCtx.save();
	this.mCtx.translate( this.mX - GAME.Display.mOutDX / 2 + this.mOffsetX,
		this.mY - GAME.Display.mOutDY / 2 + this.mOffsetY );
    this.mCtx.drawImage( img, 0, 240, 24, 24,
        0,
        parseInt( 48 * scale ),
        parseInt( 24 * scale ), parseInt( 24 * scale )
    );
	this.mCtx.restore();
	return this;
};

WS.Sprite.prototype.RenderPoisoned = function() {
	var scale = GAME.Display.mScaleFactor;
	var img = GAME.Images.Get('markers');
	this.mCtx.save();
	this.mCtx.translate( this.mX - GAME.Display.mOutDX / 2 + this.mOffsetX,
		this.mY - GAME.Display.mOutDY / 2 + this.mOffsetY );
    this.mCtx.drawImage( img, 0, 216, 24, 24,
        parseInt(18 * scale),
        parseInt(0 * scale),
        parseInt( 24 * scale ), parseInt( 24 * scale )
    );
	this.mCtx.restore();
	return this;
};

WS.Sprite.prototype.RenderBleeding = function() {
	var scale = GAME.Display.mScaleFactor;
	var img = GAME.Images.Get('markers');
	this.mCtx.save();
	this.mCtx.translate( this.mX - GAME.Display.mOutDX / 2 + this.mOffsetX,
		this.mY - GAME.Display.mOutDY / 2 + this.mOffsetY );
    this.mCtx.drawImage( img, 0, 48, 24, 24,
        parseInt(30 * scale),
        parseInt(0 * scale),
        parseInt( 24 * scale ), parseInt( 24 * scale )
    );
	this.mCtx.restore();
	return this;
};

WS.Sprite.prototype.RenderFrenzied = function() {
	var scale = GAME.Display.mScaleFactor;
	var img = GAME.Images.Get('markers');
	this.mCtx.save();
	this.mCtx.translate( this.mX - GAME.Display.mOutDX / 2 + this.mOffsetX,
		this.mY - GAME.Display.mOutDY / 2 + this.mOffsetY );
    this.mCtx.drawImage( img, 0, 264, 24, 24,
        parseInt(48 * scale),
        parseInt(48 * scale),
        parseInt( 24 * scale ), parseInt( 24 * scale )
    );
	this.mCtx.restore();
	return this;
};

WS.Sprite.prototype.RenderSleeping = function() {
	var scale = GAME.Display.mScaleFactor;
	var img = GAME.Images.Get('markers');
	this.mCtx.save();
	this.mCtx.translate( this.mX - GAME.Display.mOutDX / 2 + this.mOffsetX,
		this.mY - GAME.Display.mOutDY / 2 + this.mOffsetY );
    this.mCtx.drawImage( img, 0, 192, 24, 24,
        0,
        0,
        parseInt( 24 * scale ), parseInt( 24 * scale )
    );
	this.mCtx.restore();
	return this;
};

WS.Sprite.prototype.RenderBoss = function() {
	var scale = GAME.Display.mScaleFactor;
	var img = GAME.Images.Get('markers');
	this.mCtx.save();
	this.mCtx.translate( this.mX - 12 * scale + this.mOffsetX,
		this.mY - GAME.Display.mOutDY / 2 - 12 * scale + this.mOffsetY );
    this.mCtx.drawImage( img, 0, 120, 24, 24,
        0,
        0,
        parseInt( 24 * scale ), parseInt( 24 * scale )
    );
	this.mCtx.restore();
	return this;
};

WS.Sprite.prototype.RenderI = function( hp_pct, level ) {
	var scale = GAME.Display.mScaleFactor;
	this.mCtx.save();
	this.mCtx.translate( this.mX + this.mOffsetX + GAME.Display.mOutDX / 2 - 12 * scale,
		this.mY - GAME.Display.mOutDY / 2 + this.mOffsetY + 12 * scale );
    this.mCtx.beginPath();
    this.mCtx.arc(
		this.mOffsetX,
        this.mOffsetY,
        9 * scale,
		0, 2 * Math.PI,
		false );
    this.mCtx.fillStyle = this.mTagColor;
    this.mCtx.strokeStyle = '#666';
    this.mCtx.lineWidth = 1;
    this.mCtx.fill();
    this.mCtx.stroke();
    this.mCtx.closePath();

    this.mCtx.beginPath();
    this.mCtx.arc(
		this.mOffsetX,
        this.mOffsetY,
        10 * scale,
		-Math.PI/2,
		-Math.PI/2 + 2 * Math.PI * hp_pct,
		false );

    this.mCtx.lineWidth = 3 * scale;
    if ( hp_pct > 0.66 ) {
        this.mCtx.strokeStyle = '#0A0';
    } else if ( hp_pct > 0.33 ) {
        this.mCtx.strokeStyle = '#CC0';
    } else {
        this.mCtx.strokeStyle = '#C00';
    }
    this.mCtx.stroke();
    this.mCtx.fillStyle = "#000";
    this.mCtx.font = 'bold ' + Math.floor( 10 * scale ) + "px monospace";
    var factor = level < 10 ? 1.0 : 1.85;
    this.mCtx.fillText(	level,
		this.mOffsetX - factor * scale * 3,
        this.mOffsetY + scale * 4
	);
	this.mCtx.restore();
	return this;
};

WS.Sprite.prototype.SetCurrentAnimation = function( animation_name, callback_func ) {
	if ( this.mCallbackFunc ) {
		//console.log( 'executing old callback before override:' );
		//console.log( this.mCallbackFunc );
		var tmp = this.mCallbackFunc.bind({});
		this.mCallbackfunc = undefined;
		tmp();
	}
  this.mCallbackFunc = callback_func;

  if ( this.mCurrentAnimation == animation_name ) { return; }

	this.mCurrentAnimation = ( animation_name !== undefined ) ? animation_name : "";
	//console.log( 'Sprite: setting callback ' );
	//console.log( this.mCallbackFunc );
	this.mAnimations[this.mCurrentAnimation].TimeReset();
	return this;
};

WS.Sprite.prototype.SetDefaultAnimation = function( animation_name ) {
	this.mDefaultAnimation = ( animation_name !== undefined ) ? animation_name : "";
	return this;
};

WS.Sprite.prototype.SetAnimations = function( animations ) {
	this.mAnimations = ( animations !== undefined ) ? animations : {};
	return this;
};

WS.Sprite.prototype.SetOffsetXY = function( offset_x, offset_y ) {
	this.mOffsetX = ( offset_x !== undefined ) ? offset_x : 0;
	this.mOffsetY = ( offset_y !== undefined ) ? offset_y : 0;
	return this;
};

WS.Sprite.prototype.SetFlipX = function( flip_x ) {
	this.mFlipX = ( flip_x !== undefined ) ? flip_x : false;
	if ( this.mRangedEffect !== undefined ) { this.mRangedEffect.SetFlipX( flip_x ); }
	return this;
};

WS.Sprite.prototype.SetSwim = function( swim ) {
	this.mSwim = ( swim !== undefined ) ? swim : false;
	return this;
};

WS.Sprite.prototype.AddEffect = function( effect ) {
	this.mEffects.push( effect );
	return this;
};

WS.Sprite.prototype.SetRangedEffect = function( effect ) {
	this.mRangedEffect = effect;
	this.mRangedEffect.SetFlipX( this.mFlipX );
	return this;
};

