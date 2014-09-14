
WS.ProgressControl = function( css_options ) {
  this.mCssOptions = ( css_options !== undefined ) ? css_options : {};
  this.mPrefix = 'ws_progctrl_';
  this.mCounter = 0;
  this.pending_count = 0;
  this.listeners = $.Callbacks();
};

WS.ProgressControl.prototype = {
  constructor: WS.ProgressControl
};

WS.ProgressControl.prototype.Add = function( message, progress_subscribe_text, complete_event_name ) {
  var current_counter = this.mCounter;
  var that = this;
  amplify.subscribe( progress_subscribe_text, function( progress ) {
    $('#'+that.mPrefix+current_counter+'_val').text( Math.round(progress) + '%' );
  });
  var $message = $('<div id="'+this.mPrefix+this.mCounter+'">'+message+' <div id="'+this.mPrefix+current_counter+'_val" style="float: right; display: inline-block;">0%</div></div>')
    .css( $.extend( { 'margin-top': ( 32 * current_counter )+'px' }, this.mCssOptions ) );
  $('body').append($message);

  // setup pending tracking
  this.pending_count += 1;
  amplify.subscribe(complete_event_name, function() {
    that.pending_count -= 1;
    if (!that.is_pending()) {
      that.listeners.fire();
      that.listeners.empty();
    }
  })

  this.mCounter += 1;
  return current_counter;
};

WS.ProgressControl.prototype.is_pending = function() {
  return this.pending_count > 0;
}

WS.ProgressControl.prototype.wait_pending = function(callback) {
  if (this.is_pending()) {
    this.listeners.add(callback);
  } else {
    callback();
  }
  return false;
}

WS.ProgressControl.prototype.ClearAll = function() {
  for ( var i = 0; i < this.mCounter; i++ ) {
    $( '#' + this.mPrefix + i ).fadeOut(1500, function() { $(this).remove(); });
  }
  this.mCounter = 0;
};
