
GAME.Display = GAME.Display || {
    mDX: 72,
    mDY: 72,

    mOutDX: 72,
    mOutDY: 72,

	mScaleFactor: 1.0,

    mScreenPixelSize: { w: 0, h: 0, hw: 0, hh: 0 },
    mTileSize: { w: 0, h: 0, hw: 0, hh: 0 },

	mFlags: {
	    tiling:  true,
    	objects: true,
	    player:  true,
    	lvl: 	 true,
		speed_boost: false
	},

	mMouseTileX: 0,
	mMouseTileY: 0,
	mMouseDef:	undefined,
	mMouseState: 0,
	mFinder: new PF.AStarFinder({ allowDiagonal: false })
};

GAME.Display.DrawTileDef = function( def, color ) {
	def += '%';
	var dx = this.mOutDX;
    var posx = this.mTileSize.hw * dx + this.mMouseTileX * dx;
    var posy = this.mTileSize.hh * dx + dx + this.mMouseTileY * dx;
	//console.log('drawing percentage: ' + def + ' at ' + posx + ',' + posy );
    var scale = this.mScaleFactor;
	var ctx = GAME.layer_control.GetContext('mouse');
    ctx.save();
    ctx.translate( posx, posy );
    ctx.font = parseInt( Math.floor( 17 * scale ) ) + "px monospace";
    ctx.fillStyle = "#333";
    ctx.fillText( def, 1, 1 );
    ctx.fillStyle = color;
    ctx.fillText( def, 0, 0 );
	ctx.restore();
};

GAME.Display.UpdateDayNightLayer = function() {
	var dncanvas = GAME.layer_control.GetCanvas( 'daynight' );
	var dnctx = GAME.layer_control.GetContext( 'daynight' );

	var radGrad = dnctx.createRadialGradient( dncanvas.width / 2, dncanvas.height / 2, this.mOutDX / 4,
		    dncanvas.width / 2, dncanvas.height / 2, this.mOutDX * 4 );

	radGrad.addColorStop( 0, "transparent" );
	radGrad.addColorStop( 1, "#000" );
	dnctx.fillStyle = radGrad;
	dnctx.fillRect(0, 0, dncanvas.width, dncanvas.height );
};

GAME.Display.ZoomReset = function() {
	this.mScaleFactor = 1;
	this.mOutDX = 72;
	this.mOutDY = 72;
	this.UpdateScreenResolution();

	// update player params
	if ( GAME.player != undefined ) {
		var gd = GAME.Display;
		GAME.player.SetXY( gd.mTileSize.hw * gd.mOutDX + gd.mOutDX / 2,
            gd.mTileSize.hh * gd.mOutDY + gd.mOutDY / 2 );
	}
};

GAME.Display.ZoomIn = function() {
	this.mScaleFactor += 0.250;
	if ( this.mScaleFactor > 4.0 ) { this.mScaleFactor = 4.0; }
	this.mOutDX = 72 * this.mScaleFactor;
	this.mOutDY = 72 * this.mScaleFactor;
	this.UpdateScreenResolution();

	// update player params
	if ( GAME.player != undefined ) {
		var gd = GAME.Display;
		GAME.player.SetXY( gd.mTileSize.hw * gd.mOutDX + gd.mOutDX / 2,
            gd.mTileSize.hh * gd.mOutDY + gd.mOutDY / 2 );
	}
};

GAME.Display.ZoomOut = function() {
	this.mScaleFactor -= 0.125;
	if ( this.mScaleFactor < 0.375 ) { this.mScaleFactor = 0.375; }
	this.mOutDX = 72 * this.mScaleFactor;
	this.mOutDY = 72 * this.mScaleFactor;
	this.UpdateScreenResolution();

	// update player params
	if ( GAME.player != undefined ) {
		var gd = GAME.Display;
		GAME.player.SetXY( gd.mTileSize.hw * gd.mOutDX + gd.mOutDX / 2,
	            gd.mTileSize.hh * gd.mOutDY + gd.mOutDY / 2 );
	}
};

GAME.Display.Init = function() {

    $(window).on('resize', function() {
        GAME.Display.UpdateScreenResolution();
		// update player params
		if ( GAME.player != undefined ) {
			var gd = GAME.Display;
			GAME.player.SetXY( gd.mTileSize.hw * gd.mOutDX + gd.mOutDX / 2, gd.mTileSize.hh * gd.mOutDY + gd.mOutDY / 2 );
	        gd.RenderLand();
            gd.RenderObjects();
		}
    });
	this.UpdateScreenResolution();
	GAME.layer_control.CreateLayer( 'land',     1 );
	GAME.layer_control.CreateLayer( 'monsters', 3 );
	GAME.layer_control.CreateLayer( 'daynight', 5 );
	GAME.layer_control.CreateLayer( 'mouse',    6 );

    var css_opts = {
 		'position': 'fixed',
		'border-radius': GAME.Display.mDX*1.5,
		'width': GAME.Display.mDX * 3, 'height': GAME.Display.mDY * 3,
        'border': '2px solid #CCC', 'top': '10px', 'left': '10px', 'margin-top': 0, 'margin-left': 0,
		'box-shadow': '4px 4px 2px #333', 'cursor': 'pointer'
    };
    GAME.layer_control.CreateLayer('minimap', 7, css_opts);

    css_opts = {
		'position': 'fixed',
		'border-radius': GAME.MapGen.mDX / 2.0,
		'width': GAME.MapGen.mDX, 'height': GAME.MapGen.mDY,
        'border': '2px solid #FFF', 'box-shadow': '4px 4px 2px #333', 'cursor': 'pointer'

    };
    GAME.layer_control.CreateLayer('worldmap', 7, css_opts);
    GAME.layer_control.CreateLayer('worldmap_marks', 8, css_opts);

	css_opts = {
		'position': 'fixed',
		'border-radius': GAME.Display.mDX * 1.5,
		'width': GAME.Display.mDX * 3, 'height': GAME.Display.mDY * 3,
		'border': '2px solid #CCC', 'top': '10px', 'right': '10px', 'margin-top': 0, 'margin-right': 0,
		'background': 'radial-gradient(ellipse at center, #fefcea 0%,#f7bf09 100%)',
		'box-shadow': '4px 4px 2px #333', 'cursor': 'pointer'
	};
	GAME.layer_control.CreateLayer('hero_portrait', 7, css_opts);

	this.CreatePlayerOverlay();
	GAME.Notifications.Create();
	GAME.Buttons.Create();

	$( '#' + GAME.layer_control.GetId( 'hero_portrait' ) ).click( function() {
		GAME.Buttons.Toggle();
        return false;
    }).mouseup( function(e) { return false; } );;

	$( '#'+GAME.layer_control.GetId( 'minimap' ) ).click( function() {
		if ( GAME.mDisableControls === true ) { return; }
		GAME.Display.RenderWorldmapMarks();
		$( '#'+GAME.layer_control.GetId( 'worldmap' ) ).show(0);
		$( '#'+GAME.layer_control.GetId( 'worldmap_marks' ) ).show(0);
		$(this).hide(0);
        return false;
    }).mouseup( function(e) { return false; } );

	$( '#'+GAME.layer_control.GetId( 'worldmap_marks' ) ).click( function() {
		if ( GAME.mDisableControls === true ) { return; }
		$( '#'+GAME.layer_control.GetId( 'minimap' ) ).show(0);
		$( '#'+GAME.layer_control.GetId( 'worldmap' ) ).hide(0);
		$( '#'+GAME.layer_control.GetId( 'worldmap_marks' ) ).hide(0);
        return false;
    }).mouseup( function(e) { return false; } );

};

GAME.Display.CreatePlayerOverlay = function() {
    if ( $('#player_overlay').length > 0 ) {
		$('#player_overlay').remove();
		return;
	}
    var contents = '<div id="player_overlay" class="disableSelection">';
        contents += '<div class="img_lvl img_stat">Level</div> <div class="val_lvl gm_val">0</div>';
       	contents += '<div class="img_hth img_stat">Melee</div> <div class="val_hth gm_val">0</div>';
        contents += '<div class="img_rng img_stat">Ranged</div> <div class="val_rng gm_val">0</div>';
        contents += '<div class="img_def img_stat">Armor</div> <div class="val_def gm_val">0</div>';
        contents += '<div class="img_hp img_stat">Hits</div> <div class="val_hp gm_val">0 / 0</div>';
        contents += '<div class="img_money img_stat">Gold</div> <div class="val_money gm_val">0</div>';
        //contents += '<div class="img_exp img_stat">Exp</div> <div class="val_exp gm_val">0 / 0</div>';
		contents += '<div id="exp_bar"><div id="exp_bar_inner"></div><div id="exp_bar_text">EXP TO NEXT LEVEL: 123123 / 50%</div></div>';
        contents += '</div>';
    var overlay = $(contents).css({
        'position'	: "fixed",
        'bottom'	: "0",
        'left'		: "0",
        'width'		: "100%",
        'height'	: "90px",
		'display'	: 'none',
        'vertical-align': "bottom",
        'text-align': "center",
        'z-index'	: 10,
        'border'	: 0
    });
    $('body').append(overlay);
};

GAME.Display.HidePlayerOverlay = function() {
	$('#player_overlay').hide(0);
};

GAME.Display.ShowPlayerOverlay = function() {
	$('#player_overlay').show(0);
};

GAME.Display.RenderWorldmap = function() {

	var canvas = GAME.layer_control.GetCanvas('worldmap');
	var ctx = GAME.layer_control.GetContext('worldmap');
	var img = ctx.getImageData( 0, 0, canvas.width, canvas.height );

    var data = img.data, idx = undefined, cell = undefined;
    var tiles = GAME.MapGen.mTileMap, tilesets = GAME.Tiles.mTiles;
    var objs = GAME.MapGen.mTerrainMap;

	var DX = GAME.MapGen.mDX, DY = GAME.MapGen.mDY;

	// render world map:
    var c, oc;
    for ( var x = 0; x < DX; x++ ) {
        for ( var y = 0; y < DY; y++ ) {
            idx = x + y * DX;
            cell = idx * 4;
            c = tilesets[ tiles[x][y] ].color;
            if ( objs[x][y] != undefined ) {
                oc = GAME.Objects.Get( objs[x][y].t ).color;
                if ( oc != undefined ) { c = oc; }
            }
            data[cell] = c[0]; data[cell+1] = c[1]; data[cell+2] = c[2]; data[cell+3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
};

GAME.Display.RenderWorldmapMarks = function() {

	var DX = GAME.MapGen.mDX, DY = GAME.MapGen.mDY;
	var c = GAME.player.GetGameXY();

	// put player marker on worldmap_ptr map:
	GAME.layer_control.ClearLayer( 'worldmap_marks' );
	var ctx = GAME.layer_control.GetContext( 'worldmap_marks' );
    var img = GAME.Images.Get('clouds');
    for (var i = 0; i < 20; i++) {
        var xr = $.gmRndInt(0,392), yr = $.gmRndInt(0,392);
        if ( ( Math.abs(c.x - xr) < 90 ) && ( Math.abs(c.y - yr) < 77 ) ) { continue; }
        ctx.drawImage(
            img,
            0, // x from
            $.gmRndInt(0,2) * 94, // y from
            120, // width from
            94, // height from
            xr, // x to
            yr,  // y to
            120,
            94 );
    }

//	console.log( 'diff: ' + GAME.data['game_difficulty'] );

	var mark_img = GAME.Images.Get('tilesets');
	// ship mark
	ctx.drawImage( mark_img, 5*72, 48*72, 72, 72,
		GAME.data['position_ship'].x - 18,
    	GAME.data['position_ship'].y - 18,
	    36, 36
	);

    // player mark
	ctx.drawImage( mark_img, 7*72, 48*72, 72, 72,
		c.x - 24,
    	c.y - 24,
	    48, 48
	);

    img = GAME.Images.Get('marker');
    ctx.drawImage(
        img,
        0, // x from
        0, // y from
        img.width, // width from
        img.height, // height from
        c.x - 1, // x to
        c.y - img.height,  // y to
        img.width,
        img.height );

	if ( GAME.data['game_difficulty'] < 2.0 ) {
		// key mark:
		if ( GAME.player.mStats.tower_key_found === false ) {
			ctx.drawImage( mark_img, 9*72, 23*72, 72, 72,
				GAME.data['position_tower_key'].x - 36,
	        	GAME.data['position_tower_key'].y - 36,
			    72, 72
			);
		}

		// tower mark:
		if ( GAME.player.mStats.hostage_released === false ) {
			ctx.drawImage( mark_img, 7*72, 4*72, 72, 72,
				GAME.data['position_tower'].x - 18,
	        	GAME.data['position_tower'].y - 18,
			    36, 36
			);
		}

		// undead boss
		if ( GAME.player.mStats.evil_boss_killed === false ) {
			ctx.drawImage( mark_img, 9*72, 48*72, 72, 72,
				GAME.data['position_evil_boss'].x - 24,
	        	GAME.data['position_evil_boss'].y - 24,
			    48, 48
			);
		}

		// orc boss
		if ( GAME.player.mStats.orc_boss_killed === false ) {
			ctx.drawImage( mark_img, 8*72, 48*72, 72, 72,
				GAME.data['position_orc_boss'].x - 24,
	        	GAME.data['position_orc_boss'].y - 24,
			    48, 48
			);
		}
	}

	if ( GAME.data['game_difficulty'] < 1.0 ) {
		// bonus quest item marks
		var items = ['position_necklace', 'position_book_postament', 'position_potion_of_youth', 'position_flamingsword', 'position_unicorn', 'position_fugitive'];
		for (var i = 0, len = items.length; i < len; i++ ) {
			if ( GAME.data[items[i]] === undefined ) { continue; }
			c = GAME.data[items[i]];
			ctx.save();
			ctx.drawImage( mark_img, 6*72, 48*72, 72, 72,
				c.x - 18,
	        	c.y - 18,
			    36, 36
			);
		    ctx.restore();
		}
	}
};

GAME.Display.RenderMinimap = function() {
	var canvas = GAME.layer_control.GetCanvas('worldmap');
	var ctx = GAME.layer_control.GetContext('minimap');
	var c = GAME.player.GetGameXY();

	ctx.drawImage(canvas, c.x - 36, c.y - 36, 72, 72, 0, 0, 216, 216);

    ctx.beginPath();
    ctx.arc(108, 108, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#F00';
    ctx.stroke();

	if ( GAME.options.minimap_display_monsters === true ) {
		// display monsters
		var monsters = GAME.Monsters.Find(c.x - 36, c.y - 36, c.x + 36, c.y + 36), m = undefined;
		for ( var i = 0, len = monsters.length; i < len; i++ ) {
			m = monsters[i];
			if ( m.mState === 'aggressive' || m.mState === 'angered' ) { ctx.fillStyle = '#F00'; }
			else if ( m.mState === 'neutral' ) { ctx.fillStyle = '#333'; }
			else if ( m.mState === 'friendly' ) { ctx.fillStyle = '#0F0'; }
			else { ctx.fillStyle === '#CCC'; }
			ctx.fillRect( 3 * ( 36 + ( m.mGameX - c.x ) ), 3 * ( 36 + (m.mGameY - c.y ) ), 3, 3 );
		}
	}

	var daynight = GAME.Images.Get('daynight');
	ctx.save();
	ctx.translate(108, 216);
	ctx.rotate( GAME.mTime.GetRotation() );
	ctx.drawImage( daynight,
		0,
		0,
		60,
		60,
		-30,
		-30,
		60,
		60 );
	ctx.restore();

};

GAME.Display.RenderMonsters = function() {
    var c = GAME.player.GetGameXY();

	// render flags ( houses + monoliths + mines ) with monsters
	var hh = this.mTileSize.hh, hw = this.mTileSize.hw, obj = undefined, go = GAME.Objects;
	var ctx = GAME.layer_control.GetContext('monsters');
	for ( var x = -hw; x < hw; x++ ) {
		for ( var y = -hh; y < hh; y++ ) {
			obj = go.GetTerrainAtXY( c.x + x, c.y + y );
			if ( obj === undefined || !( ( obj.t.startsWith('house_') ) || (obj.t.startsWith('mine') ) || ( obj.t.startsWith('monolith') ) ) ) { continue; }
			//console.log( obj );
			ctx.save();
			ctx.translate( ( x + hw ) * this.mOutDX + this.mOutDX / 2, ( y + hh ) * this.mOutDX + this.mOutDX / 2 );
			if ( obj.owned !== undefined && obj.owned === true ) {
				GAME.flags.owned.Render( ctx );
			} else if ( obj.t.startsWith( 'house_' ) ) {
				GAME.flags.notowned.Render( ctx );
			}
			ctx.restore();
		}
	}

	// render monsters
    var monsters = GAME.Monsters.Find( c.x - this.mTileSize.hw, c.y - this.mTileSize.hh, c.x + this.mTileSize.hw, c.y + this.mTileSize.hh );
	var m, mc, tile;
	for ( var i = 0, len = monsters.length; i < len; i++ ) {
		m = monsters[i]; mc = m.GetGameXY();
		tile = GAME.MapGen.GetTile( mc.x, mc.y );
		if ( GAME.overlays[ tile ] != undefined ) { m.SetOverlay( GAME.overlays[ tile ] ); } else { m.RemoveOverlay(); }
		m.SetXY( ( mc.x - c.x + hw ) * this.mOutDX + this.mOutDX / 2,
			( mc.y - c.y + hh ) * this.mOutDY + this.mOutDY / 2 );
		m.Render();
		m.RenderInfo();
	}
};

GAME.Display.RenderObjects = function() {
	if ( this.mFlags.objects === false ) { return; }
	var bmap = GAME.MapGen.mBloodMap, tmap = GAME.MapGen.mTerrainMap, omap = GAME.MapGen.mObjMap;
	// render new objects
	var c = GAME.player.GetGameXY();
	var posx = 0, posy = 0;
	for ( var i = 0; i < this.mTileSize.w; i++ ) {
		for ( var j = 0; j < this.mTileSize.h; j++ ) {
			posx = c.x - this.mTileSize.hw + i; posy = c.y - this.mTileSize.hh + j;
			if ( tmap[posx][posy] !== undefined ) {
				this.RenderTerrainObject( posx, posy, i, j );
			}
			if ( bmap[posx][posy] !== undefined ) {
				this.RenderBlood( posx, posy, i, j );
			}
			if ( omap[posx][posy] !== undefined ) {
				this.RenderObject( posx, posy, i, j );
			}
		}
	}
	if ( GAME.mTimeStop !== 0 ) {
		var canvas = GAME.layer_control.GetCanvas('land');
		this.ConvertCanvasToGrayscale( canvas );
	}
};

GAME.Display.RenderTerrainObject = function( x, y, dst_x, dst_y ) {
    var o = GAME.MapGen.mTerrainMap[x][y];
	//console.log( 'rendering terrain object at '+x +',' + y);
    var obj = GAME.Objects.Get(o.t);
	var off_x = obj.xoff + o.v;
	var off_y = obj.yoff;
    var img = GAME.Images.Get( obj.tileset );
	var ctx = GAME.layer_control.GetContext('land');
    ctx.drawImage(
        img,
        off_x * this.mDX, // x from
        off_y * this.mDY, // y from
        this.mDX, // width from
        this.mDY, // height from
        dst_x * this.mOutDX, // x to
        dst_y * this.mOutDY,  // y to
        this.mOutDX,
        this.mOutDY
	);
};

GAME.Display.RenderObject = function( x, y, dst_x, dst_y ) {
    var o = GAME.MapGen.mObjMap[x][y];
	//console.log( 'rendering pickable object at '+x +',' + y);
	if ( o instanceof Array  ) {
		var img = GAME.Images.Get( obj.tileset );
		var ctx = GAME.layer_control.GetContext('land');
		for ( var i = 0; i < o.length; i++ ) {
			var ob = o.shift();
			var obj = GAME.Objects.Get(ob.t);
			var off_x = obj.xoff + o.v;
			var off_y = obj.yoff;
		    ctx.drawImage(
		        img,
		        off_x * this.mDX, // x from
		        off_y * this.mDY, // y from
		        this.mDX, // width from
		        this.mDY, // height from
		        dst_x * this.mOutDX, // x to
		        dst_y * this.mOutDY,  // y to
		        this.mOutDX,
		        this.mOutDY
			);
		}
	} else {
	    var obj = GAME.Objects.Get(o.t);
		var off_x = obj.xoff + o.v;
		var off_y = obj.yoff;
	    var img = GAME.Images.Get( obj.tileset );
		var ctx = GAME.layer_control.GetContext('land');
	    ctx.drawImage(
	        img,
	        off_x * this.mDX, // x from
	        off_y * this.mDY, // y from
	        this.mDX, // width from
	        this.mDY, // height from
	        dst_x * this.mOutDX, // x to
	        dst_y * this.mOutDY,  // y to
	        this.mOutDX,
	        this.mOutDY
		);
	}
};

GAME.Display.RenderBlood = function( x, y, dst_x, dst_y ) {
   	var o = GAME.MapGen.mBloodMap[x][y];
    var obj = GAME.Objects.Get(o.t);
	var off_x = obj.xoff + o.v;
	var off_y = obj.yoff;
    var img = GAME.Images.Get( obj.tileset );
	var ctx = GAME.layer_control.GetContext('land');
    ctx.drawImage(
        img,
        off_x * this.mDX, // x from
        off_y * this.mDY, // y from
        this.mDX, // width from
        this.mDY, // height from
        dst_x * this.mOutDX, // x to
        dst_y * this.mOutDY,  // y to
        this.mOutDX,
        this.mOutDY
	);
};

GAME.Display.RenderLand = function() {
	var c = GAME.player.GetGameXY();
	var posx = 0, posy = 0;
	for ( var i = 0; i < this.mTileSize.w; i++ ) {
		for ( var j = 0; j < this.mTileSize.h; j++) {
			posx = c.x - this.mTileSize.hw + i; posy = c.y - this.mTileSize.hh + j;
			this.RenderTileFull( posx, posy, i, j );
		}
	}
};

GAME.Display.ConvertCanvasToGrayscale = function( canvas ) {
    var tmp = document.createElement('canvas');
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    var tmpctx = tmp.getContext('2d');

    // conversion
    tmpctx.globalCompositeOperation="source-over";  // default composite value
    tmpctx.fillStyle="#FFFFFF";
    tmpctx.fillRect(0,0,canvas.width,canvas.height);
    tmpctx.globalCompositeOperation="luminosity";
    tmpctx.drawImage(canvas,0,0);

    // write converted back to canvas
    ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation="source-over";
    ctx.drawImage(tmp, 0, 0);
};

GAME.Display.RenderTileFull = function( x, y, dst_x, dst_y ) {
    var tile_data = GAME.MapGen.mTileMap;
    var tiles = GAME.Tiles.mTiles;
    var t = tile_data[x][y], tile_order = tiles[t].order;

	// render base tile:
    this.RenderTile( tiles[t].offset, 5, 2, dst_x, dst_y);

	if ( this.mFlags.tiling === false ) { return; }

	// render masked overlays:
    var masks = { 1: [-1,-1], 2: [0,-1], 4: [+1,-1], 8: [-1,0], 16: [+1,0], 32: [-1,+1], 64: [0,+1], 128: [+1,+1] };
    var r = {}, neighbor_order, neighbor;
    for (var i in masks ) {
        neighbor = tile_data[ x + masks[i][0] ][ y + masks[i][1] ];
        neighbor_order = tiles[ neighbor ].order;
        if ( neighbor_order <= tile_order ) { continue; }

        if ( r[neighbor] == undefined ) { r[neighbor] = { mask: 0, offset: tiles[neighbor].offset, order: neighbor_order }; }
        r[neighbor].mask += parseInt(i,10);
    }
    var res = [];
    for (var i in r) {
        res.push(r[i]);
    }
    res.sort( function(a,b) { return a.order - b.order; } );
    var id, mask;
    for ( var i = 0; i < res.length; i++) {
        id = res[i].offset;
        mask = res[i].mask;
        // full
        if ( ( mask & 90 ) == 90 ) {
            this.RenderTile( id, 1, 1, dst_x, dst_y ); // tileset_id, offset x, offset y, offset_dst_x, offset_dst_y
            continue;
        }
        // horseshoe
        if ( ( mask & 82 ) == 82 ) {
            this.RenderTile( id, 4, 2, dst_x, dst_y );
            continue;
        }
        if ( ( mask & 88 ) == 88 ) {
            this.RenderTile( id, 5, 1, dst_x, dst_y );
            continue;
        }
        if ( ( mask & 74 ) == 74 ) {
            this.RenderTile( id, 3, 2, dst_x, dst_y );
            continue;
        }
        if ( ( mask & 26 ) == 26 ) {
            this.RenderTile( id, 5, 0, dst_x, dst_y );
            continue;
        }
        // tunnels
        if ( ( mask & 66 ) == 66 ) {
            this.RenderTile( id, 1, 0, dst_x, dst_y );
            this.RenderTile( id, 1, 2, dst_x, dst_y );
            continue;
        }
        if ( ( mask & 24 ) == 24 ) {
            this.RenderTile( id, 0, 1, dst_x, dst_y );
            this.RenderTile( id, 2, 1, dst_x, dst_y );
            continue;
        }
        // triangles + dot
        if ( ( mask & 18 ) == 18 ) {
            this.RenderTile( id, 2, 0, dst_x, dst_y );
            if ( ( mask & 32 ) == 32 ) {
                this.RenderTile( id, 4, 0, dst_x, dst_y );
            }
            continue;
        }
        if ( ( mask & 80 ) == 80 ) {
            this.RenderTile( id, 2, 2, dst_x, dst_y );
            if ( ( mask & 1 ) == 1 ) {
                this.RenderTile( id, 4, 1, dst_x, dst_y );
            }
            continue;
        }
        if ( ( mask & 72 ) == 72 ) {
            this.RenderTile( id, 0, 2, dst_x, dst_y );
            if ( ( mask & 4 ) == 4 ) {
                this.RenderTile( id, 3, 1, dst_x, dst_y );
            }
            continue;
        }
        if ( ( mask & 10 ) == 10 ) {
            this.RenderTile( id, 0, 0, dst_x, dst_y );
            if ( ( mask & 128 ) == 128 ) {
                this.RenderTile( id, 3, 0, dst_x, dst_y );
            }
            continue;
        }
        // planar + two dots
        if ( ( mask & 2 ) == 2 ) {
            this.RenderTile( id, 1, 0, dst_x, dst_y );
            if ( ( mask & 32 ) == 32 ) {
                this.RenderTile( id, 4, 0, dst_x, dst_y );
            }
            if ( ( mask & 128 ) == 128 ) {
                this.RenderTile( id, 3, 0, dst_x, dst_y );
            }
            continue;
        }
        if ( ( mask & 8 ) == 8 ) {
            this.RenderTile( id, 0, 1, dst_x, dst_y );
            if ( ( mask & 4 ) == 4 ) {
                this.RenderTile( id, 3, 1, dst_x, dst_y );
            }
            if ( ( mask & 128 ) == 128 ) {
                this.RenderTile( id, 3, 0, dst_x, dst_y );
            }
            continue;
        }
        if ( ( mask & 16 ) == 16 ) {
            this.RenderTile( id, 2, 1, dst_x, dst_y );
            if ( ( mask & 1 ) == 1 ) {
                this.RenderTile( id, 4, 1, dst_x, dst_y );
            }
            if ( ( mask & 32 ) == 32 ) {
                this.RenderTile( id, 4, 0, dst_x, dst_y );
            }
            continue;
        }
        if ( ( mask & 64 ) == 64 ) {
            this.RenderTile( id, 1, 2, dst_x, dst_y );
            if ( ( mask & 1 ) == 1 ) {
                this.RenderTile( id, 4, 1, dst_x, dst_y );
            }
            if ( ( mask & 4 ) == 4 ) {
                this.RenderTile( id, 3, 1, dst_x, dst_y );
            }
            continue;
        }
        // single dots
        if ( ( mask & 1 ) == 1 ) {
            this.RenderTile( id, 4, 1, dst_x, dst_y );
        }
        if ( ( mask & 4 ) == 4 ) {
            this.RenderTile( id, 3, 1, dst_x, dst_y );
        }
        if ( ( mask & 32 ) == 32 ) {
            this.RenderTile( id, 4, 0, dst_x, dst_y );
        }
        if ( ( mask & 128 ) == 128 ) {
            this.RenderTile( id, 3, 0, dst_x, dst_y );
        }
    }
};

GAME.Display.RenderHeroPortrait = function() {
    var img = GAME.Images.Get( GAME.data['role'] );
	var canvas = GAME.layer_control.GetCanvas('hero_portrait');
	var ctx = GAME.layer_control.GetContext('hero_portrait');
    ctx.drawImage(
        img,
		0,0, img.width, img.height,
		0,0, canvas.width, canvas.height
	);
};

GAME.Display.RenderTile = function( tile_type_offset, off_x, off_y, dst_x, dst_y ) {
    off_x = parseInt(off_x); off_y = parseInt(off_y); dst_x = parseInt(dst_x); dst_y = parseInt(dst_y);
    var img = GAME.Images.Get('tilesets');
	var ctx = GAME.layer_control.GetContext('land');
    ctx.drawImage(
        img,
        off_x * this.mDX, 								// x from
        3 * this.mDX * tile_type_offset + off_y * this.mDY, // y from
        this.mDX, // width from
        this.mDY, // height from
        dst_x * this.mOutDX, // x to
        dst_y * this.mOutDY, // y to
        this.mOutDX, // out width
        this.mOutDY  // out height
	);
};

GAME.Display.UpdateScreenResolution = function() {
	this.mScreenPixelSize.w = $(window).width();
    this.mScreenPixelSize.h = $(window).height();
    this.mScreenPixelSize.hw = Math.floor( this.mScreenPixelSize.w / 2 ) + 1;
    this.mScreenPixelSize.hh = Math.floor( this.mScreenPixelSize.h / 2 ) + 1;

    this.mTileSize.w = Math.floor( this.mScreenPixelSize.w / this.mOutDX ) + 3;
    this.mTileSize.h = Math.floor( this.mScreenPixelSize.h / this.mOutDY ) + 3;

    this.mTileSize.hw = Math.floor( this.mTileSize.w / 2 );
    this.mTileSize.hh = Math.floor( this.mTileSize.h / 2 );

    if (this.mTileSize.w % 2 === 0) { this.mTileSize.w += 1; }
    if (this.mTileSize.h % 2 === 0) { this.mTileSize.h += 1; }

	GAME.layer_control.SetSize( this.mTileSize.w * this.mOutDX, this.mTileSize.h * this.mOutDY );
	if ( $("canvas[id*='daynight']").length > 0 ) {
		this.UpdateDayNightLayer();
	}
};

GAME.Display.ScreenToTileXY = function( x, y ) {
  var dx = x - this.mScreenPixelSize.hw,
      dy = y - this.mScreenPixelSize.hh,
      tx = Math.round(dx / this.mOutDX),
      ty = Math.round(dy / this.mOutDX);
  return { 'x': tx, 'y': ty };
};

GAME.Display.GetPossiblePath = function( x1, y1, x2, y2 ) {

    var tiles = GAME.MapGen.mTileMap;
    var objs  = GAME.MapGen.mTerrainMap;
    var preset = GAME.PlayersControl.GetPreset( GAME.player.mRole );

    var minx = x2 < x1 ? x2 : x1, maxx = x2 > x1 ? x2 : x1;
    var miny = y2 < y1 ? y2 : y1, maxy = y2 > y1 ? y2 : y1;
    var gridx = (maxx - minx) + 10, gridy = (maxy - miny) + 10;

    var grid = new PF.Grid(gridx, gridy);

    for ( var i = (minx - 5), lenx = ( maxx + 5 ); i < lenx; i++ ) {
        for ( var j = (miny - 5), leny = ( maxy + 5 ); j < leny; j++ ) {
            if ( !GAME.player.CanMoveIntoTile( tiles[i][j] ) ) {
                grid.setWalkableAt( i - (minx - 5), j - (miny - 5), false);
            } else if ( objs[i][j] != undefined && !GAME.player.CanMoveIntoObject( objs[i][j].t ) ) {
                grid.setWalkableAt( i - (minx - 5), j - (miny - 5), false);
            } else if ( GAME.Monsters.IsMonsterThere( i, j ) !== false ) {
                grid.setWalkableAt( i - (minx - 5), j - (miny - 5), false);
			}
        }
    }

    var path = this.mFinder.findPath( x1 - (minx - 5),  y1 - (miny - 5), x2 - (minx - 5), y2 - (miny - 5), grid );

    if ( path.length > 0 ) {
        for ( var i = 0; i < path.length; i++ ) {
            path[i] = [ path[i][0] + (minx - 5), path[i][1] + (miny - 5) ];
        }
    }

    return path;
};

GAME.Display.WorldTileToScreenXY = function( x, y ) {
    var tx = x - GAME.player.mGameX, ty = y - GAME.player.mGameY;
    tx = this.mTileSize.hw * this.mOutDX + tx * this.mOutDX + this.mOutDX / 2;
    ty = this.mTileSize.hh * this.mOutDY + ty * this.mOutDY + this.mOutDY / 2;
    return { 'x': tx, 'y': ty };
};

GAME.Display.WorldTileToScreenXYpath = function( x, y ) {
    var tx = x - GAME.player.mGameX, ty = y - GAME.player.mGameY;
    tx = this.mTileSize.hw * this.mOutDX + tx * this.mOutDX;
    ty = this.mTileSize.hh * this.mOutDY + ty * this.mOutDY;
    return { 'x': tx, 'y': ty };
};

GAME.Display.MakeTrailPath = function(path) {
	GAME.layer_control.ClearLayer('mouse');
	var mouseCtx = GAME.layer_control.GetContext('mouse');
    var img = GAME.Images.Get('foot');
    for (var i = 1; i < (path.length - 1); i++) {
        var c = this.WorldTileToScreenXYpath(path[i][0], path[i][1]);
       	mouseCtx.save();
        mouseCtx.globalAlpha = 0.25;
        mouseCtx.translate( c.x + this.mOutDX/2, c.y + this.mOutDX/2 );
        mouseCtx.rotate( Math.atan2( path[i+1][0] - path[i-1][0], path[i-1][1] - path[i+1][1] ) );
        mouseCtx.drawImage(
            img,
            0, 0,
            this.mDX, // width from
            this.mDX, // height from
            0 - this.mOutDX/2, // x to
            0 - this.mOutDX/2, // y to
            this.mOutDX, // width
            this.mOutDX // height
        );
        mouseCtx.restore();
    }
    if ( GAME.Display.mMouseState == 2 ) { return; }
    var fp = this.WorldTileToScreenXYpath( path[path.length - 1][0], path[path.length - 1][1] );
    mouseCtx.lineWidth = this.mOutDX / 32;
    mouseCtx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    for (var i = 1; i < 5; i++) {
        mouseCtx.beginPath();
        mouseCtx.arc(fp.x + this.mOutDX/2, fp.y + this.mOutDX/2, (this.mOutDX / 14 ) * i, 0, Math.PI*2, false);
        mouseCtx.stroke();
    }
    mouseCtx.beginPath();
    mouseCtx.moveTo(fp.x + this.mOutDX/2, fp.y + this.mOutDX * 0.25 );
    mouseCtx.lineTo(fp.x + this.mOutDX/2 , fp.y + this.mOutDX * 0.75 );
    mouseCtx.moveTo(fp.x + this.mOutDX * 0.25 , fp.y + this.mOutDX/2);
    mouseCtx.lineTo(fp.x + this.mOutDX * 0.75 , fp.y + this.mOutDX/2);
    mouseCtx.stroke();
};

GAME.Display.MakeTerrainHint = function( radius ) {
	GAME.layer_control.ClearLayer('mouse');
	var mouseCtx = GAME.layer_control.GetContext('mouse');
	var limit = parseInt(Math.ceil(radius));
	for ( var x = -limit; x <= limit; x++ ) {
		for ( var y = -limit; y <= limit; y++) {
			if ( radius < Math.sqrt( x*x + y*y ) ) { continue; }
       		mouseCtx.save();
	        mouseCtx.globalAlpha = 0.20;
        	mouseCtx.translate( this.mTileSize.hw * this.mOutDX + x * this.mOutDX, this.mTileSize.hh * this.mOutDX + y * this.mOutDY );
			mouseCtx.fillStyle = "#FF0";
			mouseCtx.fillRect( 0, 0, this.mOutDX, this.mOutDX );
			mouseCtx.restore();
		}
	}
};

