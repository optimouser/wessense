
WS.ProgressControl = function( css_options ) {
	this.mCssOptions = ( css_options !== undefined ) ? css_options : {};
    this.mPrefix = 'ws_progctrl_';
	this.mCounter = 0;
};

WS.ProgressControl.prototype = {
    constructor: WS.ProgressControl
};

WS.ProgressControl.prototype.Add = function( message, progress_subscribe_text ) {
	var current_counter = this.mCounter;
	var that = this;
	amplify.subscribe( progress_subscribe_text, function( progress ) {
        $('#'+that.mPrefix+current_counter+'_val').text( Math.round(progress) + '%' );
    });
    var message = $('<div id="'+this.mPrefix+this.mCounter+'">'+message+' <div id="'+this.mPrefix+current_counter+'_val" style="float: right; display: inline-block;">0%</div></div>')
		.css( $.extend( { 'margin-top': ( 32 * current_counter )+'px' }, this.mCssOptions ) );
    $('body').append(message);
	this.mCounter += 1;
};

WS.ProgressControl.prototype.ClearAll = function() {
	for ( var i = 0; i < this.mCounter; i++ ) { 
		$( '#' + this.mPrefix + i ).fadeOut(1500, function() { $(this).remove(); });
	}
	this.mCounter = 0;
};
