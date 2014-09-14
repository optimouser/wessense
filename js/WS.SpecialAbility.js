
WS.SpecialAbility = function( opt ) {
	this.mButton 		= ( opt.button 			!== undefined ) ? opt.button 		: undefined;
	this.mEffectTime 	= ( opt.effecttime 		!== undefined ) ? opt.effecttime 	: 3;
	this.mCoolDownTime 	= ( opt.cooldowntime	!== undefined ) ? opt.cooldowntime 	: 10;
	this.mEffectTimeLeft 	= 0;
	this.mCoolDownTimeLeft	= 0;
	this.mName = ( opt.name !== undefined ) ? opt.name : 'default action';
	this.mFunc = ( opt.func !== undefined ) ? opt.func : 'TimeStop';
};

WS.SpecialAbility.prototype = {
    constructor: WS.SpecialAbility
};

WS.SpecialAbility.prototype.TurnPassed = function() {
	if ( this.mTimeLeft > 0 ) {
		this.mTimeLeft -= 1;
		if ( this.mTimeLeft === 0 ) {
			// effect ended
		}
	}
	if ( this.mCoolDownTimeLeft > 0 ) {
		this.mCoolDownTimeLeft -= 1;
		if ( this.mCoolDownTimeLeft === 0 ) {
			// ability recharged
		}
	}
};

WS.SpecialAbility.prototype.TimeStop = function() {
	console.log('TimeStop Special');	
};
