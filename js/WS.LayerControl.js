//
// Layer Control class
// 
//

WS.LayerControl = function( opt ) {
    if ( opt === undefined ) { throw 'Cannot create WS.LayerControl, constructor parameters missing'; }
    if ( opt.container_name === undefined ) { throw 'Cannot create WS.LayerControl, container name missing'; }
    if ( opt.default_width === undefined ) { throw 'Cannot create WS.LayerControl, layer width missing'; }
    if ( opt.default_height === undefined ) { throw 'Cannot create WS.LayerControl, layer height missing'; }
    this.mContainerName = opt.container_name;
	this.mWidth = opt.default_width;
	this.mHeight = opt.default_height;
	this.mEnableCache = ( opt.enable_caching !== undefined ) ? opt.enable_caching : true;
	this.mCanvasCache = {};
	this.mContextCache = {};
	this.mPrefix = 'ws_lrctrl_';
	this.mKnownLayers = {};
};

WS.LayerControl.prototype = {
    constructor: WS.LayerControl
};

WS.LayerControl.prototype.TriggerMouseMove = function( layer_name ) {
	$( '#'+this.GetId( layer_name ) ).trigger('mousemove');
};

WS.LayerControl.prototype.GetId = function( layer_name ) {
	return ( this.mPrefix + layer_name );
};

WS.LayerControl.prototype.SetLayerCSS = function( layer_name, css_block ) {
	$('#'+this.GetId(layer_name) ).css( css_block );
};

WS.LayerControl.prototype.ClearLayer = function( layer_name ) {
	var cnv = this.GetCanvas( layer_name );
	var ctx = this.GetContext( layer_name );
	ctx.clearRect( 0, 0, cnv.width, cnv.height );
};

WS.LayerControl.prototype.GetCanvas = function( layer_name, zindex, css_opts ) {
	if ( zindex === undefined ) { zindex = 1; }
	if ( css_opts === undefined ) { css_opts = {}; }
	// check caching
	if ( this.mEnableCache === true ) {
		if ( this.mCanvasCache[ layer_name ] !== undefined ) {
			return this.mCanvasCache[ layer_name ][0];
		}
		var layer = this.CreateLayer( layer_name, zindex, css_opts );
		return layer;
	}
	// no caching
	if ( $('#'+this.mPrefix+layer_name).length !== 0 ) {
		return $('#'+this.mPrefix+layer_name)[0];
	}
	var layer = this.CreateLayer( layer_name, zindex, css_opts );
	return layer;
};

WS.LayerControl.prototype.GetContext = function( layer_name, zindex, css_opts ) {
	if ( zindex === undefined ) { zindex = 1; }
	if ( css_opts === undefined ) { css_opts = {}; }
	if ( this.mEnableCache === true ) {
		if ( this.mContextCache[ layer_name ] !== undefined ) { 
			return this.mContextCache[ layer_name ];
		}
		this.CreateLayer( layer_name, zindex, css_opts );
		return this.mContextCache[ layer_name ];
	}
	var cnv = this.GetCanvas( layer_name, zindex );
	return cnv.getContext('2d');
};

WS.LayerControl.prototype.FadeToLayer = function( layer_name, opacity ) { // 0 = transparent, 1.0 = opaque
	if ( this.mEnableCache === true ) {
		this.mCanvasCache[ layer_name ].fadeTo( 0, opacity );
	} else {
		$('#'+this.mPrefix+layer_name).fadeTo( 0, opacity );
	}	
};

WS.LayerControl.prototype.HideLayer = function( layer_name ) {
	//console.log('#'+this.mPrefix+layer_name);
	$('#'+this.mPrefix+layer_name).css({'display':'none'});
};

WS.LayerControl.prototype.DeleteLayer = function( layer_name ) {
	if ( this.mEnableCache === true ) {
		this.mCanvasCache[ layer_name ].remove();
	} else {
		$('#'+this.mPrefix+layer_name).remove();
	}
};

WS.LayerControl.prototype.HideAllLayers = function() {
//	console.log('hiding all layers');
	$('.gm_layers').css({'display': 'none'});
};

WS.LayerControl.prototype.DeleteAllLayers = function() {
	for ( var i in this.mKnownLayers ) {
		this.DeleteLayer(i);
	}
};

WS.LayerControl.prototype.ShowLayer = function( layer_name, fadeInTime ) {
//	console.log( 'showing layer: ' + layer_name );
	if ( fadeInTime === undefined ) { fadeInTime = 0; }
	if ( this.mEnableCache === true ) {
		if ( fadeInTime > 0 ) {
			this.mCanvasCache[ layer_name ].fadeIn(fadeInTime);
		} else { 
			this.mCanvasCache[ layer_name ].show(0);
		}
	} else {
		if ( fadeInTime > 0 ) {
			$('#'+this.mPrefix+layer_name).fadeIn(fadeInTime);
		} else {
			$('#'+this.mPrefix+layer_name).show(0);
		}
	}
};

WS.LayerControl.prototype.ShowAllLayers = function( fadeInTime ) {
	for ( var i in this.mKnownLayers ) {
		this.ShowLayer( i, fadeInTime );
	}
};

WS.LayerControl.prototype.ToggleLayer = function( layer_name ) {
	if ( this.mEnableCache === true ) {
		this.mCanvasCache[ layer_name ].toggle(0);
	} else {
		$('#'+this.mPrefix+layer_name).toggle(0);
	}
};

WS.LayerControl.prototype.SetSize = function( width, height ) { 
	var canvas;
	for ( var i in this.mKnownLayers ) {
		canvas = this.GetCanvas( i );
		if ( canvas.width != this.mWidth || canvas.height != this.mHeight ) { continue; }
		canvas.width = width;
		canvas.height = height;
		$('#'+this.mPrefix+i).css({
			'position': 'fixed',
			'top': '50%',
			'left': '50%',
			'margin-top': -( height / 2 ),
			'margin-left': -( width / 2 )
		});
	}
	this.mWidth = width;
	this.mHeight = height;
}

WS.LayerControl.prototype.GetSize = function() { 
	return ( {'w': this.mWidth, 'h': this.mHeight } ); 
};

WS.LayerControl.prototype.CreateLayer = function( layer_name, zindex, css_opts) {
//	console.log('creating layer: ' + layer_name);
	if ( css_opts === undefined ) { css_opts = {}; }
	var width = ( css_opts.width === undefined ) ? this.mWidth : css_opts.width;
	var height = ( css_opts.height === undefined ) ? this.mHeight : css_opts.height;
	if ( css_opts.right === undefined && css_opts.left === undefined ) { 
		css_opts.left = '50%'; css_opts['margin-left'] = -( width / 2 );
	}
	if ( css_opts.bottom === undefined && css_opts.top === undefined ) { 
		css_opts.top = '50%'; css_opts['margin-top'] = -( height / 2 ); 
	}
	var cnv = $('<canvas id="'+this.mPrefix+layer_name+'" class="disableSelection gm_layers" />').css(
		$.extend( {
			'display': 'none',
			'position': 'fixed',
			'z-index': zindex
		}, css_opts) 
	);
	cnv[0].width  = parseInt(width);
	cnv[0].height = parseInt(height);
	$(this.mContainerName).append(cnv);
	this.mKnownLayers[ layer_name ] = true;
	if ( this.mEnableCache === true ) {
		 this.mCanvasCache[ layer_name ] = cnv;
		this.mContextCache[ layer_name ] = cnv[0].getContext('2d');			
        this.mContextCache[ layer_name ].mozImageSmoothingEnabled = false;
        this.mContextCache[ layer_name ].webkitImageSmoothingEnabled = false;
        this.mContextCache[ layer_name ].msImageSmoothingEnabled = false;
        this.mContextCache[ layer_name ].imageSmoothingEnabled = false;
	}
	return cnv[0];
};
