
WS.RangedEffect = function( opt ) {
  if ( opt === undefined ) { throw 'Cannot create WS.RangedEffect, constructor parameters missing'; }
  WS.Animation.call( this, opt );

  this.mCanvas = ( opt.canvas !== undefined ) ? opt.canvas : undefined;
  this.mCtx = ( this.mCanvas !== undefined ) ? this.mCanvas.getContext("2d") : undefined;

  if ( this.mCtx === undefined ) { throw 'Cannot create WS.RangedEffect, canvas is missing'; }

  this.mRotAngle =  ( opt.rot_angle !== undefined ) ? opt.rot_angle : 0;
  this.mStartPosX = ( opt.start_x !== undefined ) ? opt.start_x : 0;
  this.mStartPosY = ( opt.start_y !== undefined ) ? opt.start_y : 0;
  this.mStopPosX  = ( opt.stop_x  !== undefined ) ? opt.stop_x : 0;
  this.mStopPosY  = ( opt.stop_y  !== undefined ) ? opt.stop_y : 0;
  this.mCurPosX   = 0;
  this.mCurPosY   = 0;
  this.mFlipX = false;
  this.ranged_animation_progress = undefined;
};

WS.RangedEffect.prototype = Object.create( WS.Animation.prototype );

WS.RangedEffect.prototype.SetFlipX = function( flipx ) {
  this.mFlipX = flipx;
};

WS.RangedEffect.prototype.SetStartStopXY = function( start_x, start_y, stop_x, stop_y ) {
  this.mStartPosX = start_x;
  this.mStartPosY = start_y;
  this.mStopPosX = stop_x;
  this.mStopPosY = stop_y;
  return this;
};

WS.RangedEffect.prototype.start = function() {
  return this.ranged_animation_progress = $.Deferred();
}

WS.RangedEffect.prototype.UpdateEffect = function( dt ) {
  if (!this.ranged_animation_progress) {
    debugger;
  }
  this.mCurPosX = this.mStartPosX + ( this.mStopPosX - this.mStartPosX ) * ( this.mTime / this.mMaxTime );
  this.mCurPosY = this.mStartPosY + ( this.mStopPosY - this.mStartPosY ) * ( this.mTime / this.mMaxTime );
  var result = this.Update( dt );
  if (result === true) {
    this.ranged_animation_progress.resolve();
    this.ranged_animation_progress = undefined;
  }
  return result;
};

WS.RangedEffect.prototype.RenderEffect = function() {
  this.mCtx.save();
  if ( this.mFlipX === true ) {
    this.mCtx.scale( -1, 1 );
  }
  this.mCtx.translate( this.mCurPosX, this.mCurPosY );
  this.mCtx.rotate( this.mRotAngle + Math.atan2( this.mStopPosY - this.mStartPosY, this.mStopPosX - this.mStartPosX ) );
  this.Render( this.mCtx, false );
  this.mCtx.restore();
  return this;
};


