//
// WS.ScreenObject
//
// Description: 
//

WS.ScreenObject = function( opt ) {
    if ( opt === undefined ) { throw 'Cannot create WS.ScreenObject, constructor parameters missing'; }
    this.mName = ( opt.name !== undefined ) ? opt.name : "";
    this.mUUID = ( opt.uuid !== undefined ) ? opt.uuid : $.gmUUID();
    this.mX = ( opt.x !== undefined ) ? opt.x : 0; // game X, or screen X ?
    this.mY = ( opt.y !== undefined ) ? opt.y : 0; // conversion from game X to screen X ?
	this.mType = ( opt.type != undefined ) ? opt.type : 'monster';
};

WS.ScreenObject.prototype = {
    constructor: WS.ScreenObject
};

WS.ScreenObject.prototype.SetName = function( name ) {
    this.mName = ( name !== undefined ) ? name : "";
	return this;
};

WS.ScreenObject.prototype.SetUUID = function( uuid ) {
    this.mUUID = ( uuid !== undefined ) ? uuid : "";
	return this;
};

WS.ScreenObject.prototype.SetXY = function( x, y ) {
    this.mX = ( x !== undefined ) ? x : 0;
    this.mY = ( y !== undefined ) ? y : 0;
	return this;
};

WS.ScreenObject.prototype.GetName = function() {
    return this.mName;
};

WS.ScreenObject.prototype.GetUUID = function() {
    return this.mUUID;
};

WS.ScreenObject.prototype.GetXY = function() {
	return {'x': this.mX, 'y': this.mY };
};

WS.ScreenObject.prototype.DistanceToObj = function( obj ) {
	return Math.sqrt( Math.pow(this.mX - obj.mX,2) + Math.pow(this.mY - obj.mY,2) );
};

