
$.gmMatrix = function (rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.myarray = new Array(this.rows);
    for (var i=0; i < this.columns; i +=1) {
        this.myarray[i]=new Array(this.rows)
    }
    return this.myarray;
};

$.gmShuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};      

$.gmUUID = function () {
    return ( 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        }) );
};

$.gmIsEven = function(n) {
    return (n % 2 === 0);
};

$.gmRound = function(val) {
    if ( parseFloat(val.toFixed(0)) == parseFloat(val) ) { return val; }
    return (val).toFixed(1);
};

$.gmRound0 = function(val) {
    if ( parseFloat(val.toFixed(0)) == parseFloat(val) ) { return val; }
    return (val).toFixed(0);
};

$.gmRnd = function(min, max) {
    return Math.random() * (max - min) + min;
};  

$.gmRndInt = function(min, max) {
    min = parseInt(min,10);
    max = parseInt(max,10);
    return Math.floor( Math.random() * (max - min + 1) + min );
};


$.loadImage = function(url) {
  var loadImage = function(deferred) {
    var image = new Image();    
    image.onload = loaded;
    image.onerror = errored;
    image.onabort = errored;
    image.src = url;    
    function loaded() {
      unbindEvents();
      deferred.resolve(image);
    }
    function errored() {
      unbindEvents();
      deferred.reject(image);
    }
    function unbindEvents() {
      image.onload = null;
      image.onerror = null;
      image.onabort = null;
    }
  };
  return $.Deferred(loadImage).promise();
};

$.loadImageArray = function ( srcs ) {
	var promises = [];
	for (var i = 0; i < srcs.length; i++) {
		promises.push( $.loadImage(srcs[i]) );
	}
	return $.when.apply( this, promises );
};

String.prototype.stringToByteArray = function() {
    var array = new (window.Uint8Array !== void 0 ? Uint8Array : Array)(this.length);
    var i, il = this.length;
    for (i = 0; i < il; ++i) {
        array[i] = this.charCodeAt(i) & 0xff;
    }
    return array;
};

String.prototype.gmHashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) == str;
};

Array.prototype.inArray = function(needle) {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] == needle) return true;
    }
    return false;
};


$.gmMakeStandardAnimations = function( img_name, offset, speed ) {
	speed = ( speed !== undefined ) ? speed : 1.0; 
	var dx = 72;
	var animations = {
		'idle': new WS.Animation({
			'speed': GAME.data['animation_speed'],
			'source_image': GAME.Images.Get(img_name),
			'frames': [ { 'x': 0, 'y': dx * offset, 'w': dx, 'h': dx, 't': 350 }, { 'x': 1, 'y': dx * offset, 'w': dx, 'h': dx, 't': 350 }, 
							{ 'x': 0, 'y': dx * offset, 'w': dx, 'h': dx, 't': 50 } ]
                        }),
			'move': new WS.Animation({
				'source_image': GAME.Images.Get(img_name),
				'frames': [ { 'x': dx, 'y': dx * offset, 'w': dx, 'h': dx, 't': 110 }, { 'x': 0, 'y': dx * offset, 'w': dx, 'h': dx, 't': 40 } ] }),
      
			'attack': new WS.Animation({
				'source_image': GAME.Images.Get(img_name),
				'frames': [ { 'x': 0, 'y': dx * offset, 'w': dx, 'h': dx, 't': 150 }, { 'x': 2 * dx, 'y': dx * offset, 'w': dx, 'h': dx, 't': 450 }, 
						{ 'x': 0, 'y': dx * offset, 'w': dx, 'h': dx, 't': 50 } ] }),

			'defend': new WS.Animation({
				'source_image': GAME.Images.Get(img_name),
				'frames': [ { 'x': 0, 'y': dx * offset, 'w': dx, 'h': dx, 't': 150 }, { 'x': 3 * dx, 'y': dx * offset, 'w': dx, 'h': dx, 't': 450 }, 
						{ 'x': 0, 'y': dx * offset, 'w': dx, 'h': dx, 't': 50 } ] })
	};
	return animations;
};

$.gmSupportsHTML5Storage = function() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
};

