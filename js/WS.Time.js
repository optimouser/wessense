
WS.Time = function( opt ) {
	this.mTurns = 1;
	this.mTimeOfDay = "day";
	this.mTimeInDay = 0;
	this.mOffset = {
		"day"		: 0 - Math.PI / 4,
		"evening"	: Math.PI / 2 - Math.PI / 4,
		"night"		: Math.PI - Math.PI / 4,
		"morning"	: 3 * Math.PI / 2 - Math.PI / 4
	};
	this.mLasts = {
		"day"		:  300,
		"evening"	:  50,
		"night"		:  150,
		"morning"	:  50
	};
	this.mCycle = {
		"day"		: "evening",
		"evening"	: "night",
		"night"		: "morning",
		"morning"	: "day"
	};
};

WS.Time.prototype = {
    constructor: WS.Time
};

WS.Time.prototype.Init = function() {
	var that = this;
	amplify.subscribe('TURN_ENEMY_END', function() {
		that.TurnPassed();
	});
};

WS.Time.prototype.TurnPassed = function() {
	this.mTurns += 1;
	this.mTimeInDay += 1;
	if ( this.mTimeInDay > this.mLasts[ this.mTimeOfDay ] ) {
		this.mTimeOfDay = this.mCycle[ this.mTimeOfDay ];
		this.mTimeInDay = 0;
	}
	switch( this.mTimeOfDay ) {
		case 'day':
			GAME.layer_control.FadeToLayer('daynight', 0.0);
			break;
		case 'night':
			GAME.layer_control.FadeToLayer('daynight', 0.95);
			break;
		case 'morning':
			GAME.layer_control.FadeToLayer('daynight', 0.95 - 0.95 * this.mTimeInDay / this.mLasts[ this.mTimeOfDay ] );
			break;
		case 'evening':
			GAME.layer_control.FadeToLayer('daynight',  0.95 * this.mTimeInDay / this.mLasts[ this.mTimeOfDay ] );
			break;
	}
//	console.log( 'turn: ' + this.mTurns );
//	console.log( 'time_in_day: ' + this.mTimeInDay );
//	console.log( 'time_of_day: ' + this.mTimeOfDay );
};

WS.Time.prototype.GetTimeOfDay = function() {
	return this.mTimeOfDay;
};

WS.Time.prototype.GetRotation = function() {
	return ( this.mOffset[this.mTimeOfDay] + Math.PI / 2.0 * this.mTimeInDay / this.mLasts[ this.mTimeOfDay ] );
};

