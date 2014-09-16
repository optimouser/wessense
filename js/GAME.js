
var GAME = GAME || {
	REVISION: '0.87a',
	data: { 'role': 'role_1_0', 'houses': 0, 'mines': 0, 'monoliths': 0, 
		'hostage': $.gmRndInt(0,1) == 0 ? 'elven_princess' : 'elder_mage',
		'enemy': $.gmRndInt(0,1) == 0 ? 'necromancer' : 'lich',
		'necromancer_name': 'Necromancer Gaghor Deathwhisper',
		'lich_name': 'Ancient Lich Mororg',
		'elven_princess_name': 'Princess Gaeruilneth',
		'elder_mage_name': 'Arch Mage Gareth Bleakair',
		'animation_speed': 1.0,
		'shops': { 'magic': 0, 'weapons': 0 }
	},
	options: {
		minimap_display_monsters: true
	},
	mTimeStop: 0,

	mSpecialCountDown: 0,
	mSpellCountDown: 0,

	mSpellFlyingCountDown: 0,
	mSpellShadowsCountDown: 0,
	mSpellLearnLvl: 0,

	mAnimationLoopID: undefined,
	mLoopLastTimeUpdated: Date.now(),
	mLastKeyPress: 0,
	mLastTick: 0,
	mMQ: $({}),
	mTime: undefined,
	mDisableControls: false,
	mLoopThrottle: true,
	mGameOver: false,
	progress_control: undefined,
	layer_control: undefined,
	overlays: {},
	effects: {},
	ranged_effects: {},
	flags: { "owned": undefined, "notowned": undefined },
	text_animations: []
};

GAME.Init = function() {

	this.mTime = new WS.Time();
	this.mTime.Init();

	this.progress_control = new WS.ProgressControl({
		'position': 'absolute',
		'top': '40%',
		'left': '50%',
		'width': '500px',
		'font-size': '30px',
		'font-family': 'monospace',
		'margin-left': '-250px'
	});
	
	this.layer_control = new WS.LayerControl({ 
		'container_name': 'body', 
		'default_width' : $(window).width(), 
		'default_height': $(window).height(), 
		'enable_caching': true 
	});

	this.Display.Init();
};

GAME.Run = function() {
	console.log('GAME::Run');

	this.RunInit();
	this.Update(0);
	this.Render();

	this.StartLoop();

};

GAME.RunInit = function() {

	this.overlays['water_shallow'] = new WS.Overlay({ img: GAME.Images.Get('tilesets'), x: 360, y: 621, w: 72, h: 27, dest_x: -36, dest_y: 9, scale_w: 1, scale_h: 1 });
	this.overlays['water_medium']  = new WS.Overlay({ img: GAME.Images.Get('tilesets'), x: 360, y: 405, w: 72, h: 27, dest_x: -36, dest_y: 9, scale_w: 1, scale_h: 1 });
	this.overlays['water_deep']    = new WS.Overlay({ img: GAME.Images.Get('tilesets'), x: 360, y: 189, w: 72, h: 27, dest_x: -36, dest_y: 9, scale_w: 1, scale_h: 1 });
	this.overlays['swamp_shallow']    = new WS.Overlay({ img: GAME.Images.Get('tilesets'), x: 360, y: 1917, w: 72, h: 27, dest_x: -36, dest_y: 9, scale_w: 1, scale_h: 1 });
	this.overlays['swamp_deep']    = new WS.Overlay({ img: GAME.Images.Get('tilesets'), x: 360, y: 2133, w: 72, h: 27, dest_x: -36, dest_y: 9, scale_w: 1, scale_h: 1 });

	// PLAYER INIT: 
	var p = GAME.PlayersControl.GetPreset( GAME.data['role'] );
	var opts = {
        // entity
        'game_x': 128, 'game_y': 256, 'n_hth': p.n_hth, 'n_rng': p.n_rng,
//        'lvl': 1, 'exp': 8749, 'kill_exp': 0, 'hp': [p.hp, p.hp],
        'lvl': 1, 'exp': 0, 'kill_exp': 0, 'hp': [p.hp, p.hp],
        'hth': p.hth, 'rng': p.rng, 'def': p.def,
		'passable_tiles': p.passable_tiles,
		'passable_objects': p.passable_objects,
        // sprite
        'canvas': GAME.layer_control.GetCanvas( 'monsters' ), 'tag_color': '#FF0',
        'animations': $.gmMakeStandardAnimations( 'heroes', p.offset * 3 + 0 ),
        'current_animation': 'idle',
        'default_animation': 'idle',
        // screen object
		'x': GAME.Display.mTileSize.hw * GAME.Display.mOutDX + GAME.Display.mOutDX / 2, 
		'y': GAME.Display.mTileSize.hh * GAME.Display.mOutDY + GAME.Display.mOutDY / 2, 
        'name': 'Ivan', 'type': 'player'
    };

	if ( p.rng_effects !== undefined && p.rng_effects[0] !== undefined ) {
		opts['rng_effect'] = $.extend( {}, GAME.ranged_effects[ p.rng_effects[0] ] );
	}

	if ( p.armor_piercing !== undefined ) {
		opts['armor_piercing'] = p.armor_piercing;
	}

	GAME.player = new GAME.Player( opts );
	//GAME.player.SetTrait('poisoned');
	//GAME.player.SetTrait('bleeding');

	GAME.player.mCash = 25;
	GAME.player.mStats['houses_owned'][1] 		= GAME.data['houses'];
	GAME.player.mStats['mines_cleared'][1] 		= GAME.data['mines'];
	GAME.player.mStats['monoliths_visited'][1] 	= GAME.data['monoliths'];
	GAME.player.mStats['monsters_killed'][1] 	= GAME.Monsters.CountMonsters();
	//console.log(GAME.player.mStats);
	
	if ( GAME.data['role'] === 'role_1_0' ) {
		GAME.player.mMagic.mirror 	= 8;
		GAME.player.mMagic.heal 	= 8;
	} else if ( GAME.data['role'] === 'role_1_1' ) {
		GAME.player.mMagic.mirror 	= 6;
		GAME.player.mMagic.rain 	= 0;
		GAME.player.mMagic.fly 		= 0;
		GAME.player.mMagic.sleep	= 6;
		GAME.player.mMagic.tornado 	= 3;
		GAME.player.mMagic.frenzy 	= 0;
		GAME.player.mMagic.entangle = 6;
		GAME.player.mMagic.heal 	= 6;
		GAME.player.mMagic.charm 	= 6;
		GAME.player.mMagic.forest 	= 0;
		GAME.player.mMagic.meteor 	= 0;
		GAME.player.mMagic.shadows 	= 0;
	} else if ( GAME.data['role'] === 'role_2_0' ) {
		GAME.player.mMagic.forest 	= 8;
		GAME.player.mMagic.heal 	= 4;
	} else if ( GAME.data['role'] === 'role_2_1' ) {
		GAME.player.mMagic.entangle = 8;
		GAME.player.mMagic.rain 	= 8;
		GAME.player.mMagic.heal 	= 8;
		GAME.player.mMagic.sleep	= 8;
	} else if ( GAME.data['role'] === 'role_3_0' ) {
		GAME.player.mMagic.tornado 	= 4;
		GAME.player.mMagic.frenzy 	= 4;
	} else if ( GAME.data['role'] === 'role_3_1' ) {
		GAME.player.mMagic.meteor 	= 4;
		GAME.player.mMagic.fly 		= 2;
	} else if ( GAME.data['role'] === 'role_4_0' ) {
		GAME.player.mMagic.sleep	= 4;
		GAME.player.mMagic.shadows 	= 8;
	} else if ( GAME.data['role'] === 'role_4_1') {
		GAME.player.mMagic.sleep	= 4;
		GAME.player.mMagic.frenzy 	= 4;
		GAME.player.mMagic.heal 	= 8;
	}

	GAME.player.SetStartingLocation();
	GAME.player.UpdateOverlay();

	var c = GAME.player.GetGameXY();
	GAME.MapGen.mTerrainMap[c.x][c.y] = undefined;

	// FIXME: test
//	GAME.Objects.CreateAt('shop_magic', c.x+1, c.y);
//	GAME.Objects.CreateAt('shop_weapons', c.x, c.y+1);

	// init mouse path
	var mouse_layer_id = '#'+GAME.layer_control.GetId('mouse');
    $( mouse_layer_id ).on( "mousemove", function( event ) {
		if ( GAME.mDisableControls !== false ) { return; }
        var dir = GAME.Display.ScreenToTileXY(event.pageX, event.pageY);
        //GAME.Display.mMouseTileX = dir.x; GAME.Display.mMouseTileY = dir.y;

		// def rating
		var calc_def = undefined, calc_def_color = "#6F6";

        if ( dir.x === 0 && dir.y === 0 ) { 
			calc_def = GAME.player.GetDefSum( GAME.player, GAME.player.mGameX, GAME.player.mGameY, true );
			GAME.layer_control.ClearLayer('mouse');
            GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/move_drag.png),auto'});
			if ( calc_def !== undefined ) { GAME.Display.DrawTileDef( calc_def, calc_def_color ); }
        	GAME.Display.mMouseTileX = dir.x; GAME.Display.mMouseTileY = dir.y;
			return; 
		}
        // mouse following: automatic walk path to XY
        if ( dir.x != GAME.Display.mMouseTileX || dir.y != GAME.Display.mMouseTileY ) {
			var pcoord = GAME.player.GetGameXY();
			var monster = GAME.Monsters.IsMonsterThere(pcoord.x + dir.x, pcoord.y + dir.y );
            var path = GAME.Display.GetPossiblePath(pcoord.x, pcoord.y, pcoord.x + dir.x, pcoord.y + dir.y);
            if ( monster !== false ) {
				calc_def = GAME.player.GetDefSum( monster ); calc_def_color = "#FFF";
				GAME.Notifications.PostMonsterStats( monster );
				//if ( GAME.MapGen.CheckLos( pcoord.x, pcoord.y, pcoord.x + dir.x, pcoord.y + dir.y ) === true
				if ( GAME.player.CheckLosToXY( pcoord.x + dir.x, pcoord.y + dir.y ) === true
					&& ( ( GAME.player.HasHTHAttack() && monster.DistanceTo( GAME.player ) <= 1.01 )
					|| ( GAME.player.HasRangedAttack() === true && monster.DistanceTo( GAME.player ) <= GAME.player.GetRangedRange() ) ) ) {
            		GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/attack.png),auto'});
                    GAME.Display.mMouseState = 2;
				} else {
	                GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-illegal.png),auto'});
    		        GAME.Display.mMouseState = 0;
				}
				GAME.layer_control.ClearLayer('mouse');
            } else if ( path != undefined && path.length >= 2 ) {
				calc_def = GAME.player.GetDefSum( GAME.player, pcoord.x + dir.x, pcoord.y + dir.y, true );
            	GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/move.png),auto'});
                GAME.Display.mMouseState = 1;
            	GAME.Display.MakeTrailPath(path);
            } else {
				//calc_def = GAME.player.GetDefSum( GAME.player, pcoord.x + dir.x, pcoord.y + dir.y );
                GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-illegal.png),auto'});
                GAME.Display.mMouseState = 0;
				GAME.layer_control.ClearLayer('mouse');
            }
        }
        GAME.Display.mMouseTileX = dir.x; GAME.Display.mMouseTileY = dir.y;
		if ( calc_def !== undefined ) {
			GAME.Display.DrawTileDef( calc_def, calc_def_color );
		}
    });

    $( mouse_layer_id ).on( "click", function( event ) {
//		console.log('mouse click registered');

		if ( GAME.mDisableControls === true ) { 
			if ( GAME.data['active_spell'] !== undefined ) {
				GAME.ProcessSpellClick( GAME.Display.ScreenToTileXY(event.pageX, event.pageY) );
				GAME.mDisableControls = false;
			}
			return; 
		}
//		console.log('controls not disabled');
        var dir = GAME.Display.ScreenToTileXY( event.pageX, event.pageY );
		if ( dir.x === 0 && dir.y === 0 ) {
			GAME.player.MoveToDXY( 0, 0 );
			GAME.Notifications.Post('Skipping Turn');
			GAME.Display.RenderMinimap();
			GAME.Display.RenderLand();
			GAME.Display.RenderObjects();
			GAME.Render();
			amplify.publish('TURN_ENEMY_START');
			return;
		}

		var pcoord = GAME.player.GetGameXY();
		var monster = GAME.Monsters.IsMonsterThere( pcoord.x + dir.x, pcoord.y + dir.y );
//		console.log('checking for monster');
		if ( monster !== false && GAME.mTimeStop === 0 ) {
//			console.log('monster is there..');
			var mcoord = monster.GetGameXY();
			if ( GAME.player.mGameX > mcoord.x ) { GAME.player.SetFlipX( true ); } else { GAME.player.SetFlipX( false ); }
			if ( GAME.player.HasHTHAttack() && monster.DistanceTo( GAME.player ) <= 1.01 ) {
//				console.log('performing hth attack');
				GAME.EntityAttacksEntityHTH(GAME.player, monster, function() {
//					console.log('player hth attack ended');
					amplify.publish('TURN_ENEMY_START');
				});
			} else if ( GAME.player.HasRangedAttack() === true 
					&& monster.DistanceTo( GAME.player ) <= GAME.player.GetRangedRange() 
					&& GAME.player.CheckLosToXY( mcoord.x, mcoord.y ) === true
				) {
//				console.log('queuing player attack animation');
				GAME.EntityAttacksEntityRNG(GAME.player, monster, function() {
//					console.log('player rng attack ended');
					amplify.publish('TURN_ENEMY_START');
				});	
			}
		} else {
			// check if we need to set path to this point:
            var path = GAME.Display.GetPossiblePath(pcoord.x, pcoord.y, pcoord.x + dir.x, pcoord.y + dir.y);
            if ( path != undefined && path.length >= 2 ) {
				if (path[0][0] == pcoord.x && path[0][1] == pcoord.y ) {
					path.shift();
				}
				GAME.player.SetMovePath( path );
				GAME.player.MakeStepPath();
			}
		}
		return false;
	}).mouseup( function(e) { return false; } );

	amplify.subscribe('SPELL_CAST', function(spell) { 
		GAME.player.mStats['spells_cast'] += 1;
		GAME.data['active_spell'] = spell;
		switch(spell) {
			// instant
			case 'fly':
				GAME.SpellFly();
				GAME.data['active_spell'] = undefined;
				break;
			case 'mirror':
				GAME.SpellMirror();
				GAME.data['active_spell'] = undefined;
				break;
			case 'tornado':
				GAME.SpellTornado();
				GAME.data['active_spell'] = undefined;
				break;
			case 'shadows':
				GAME.SpellShadows();
				GAME.data['active_spell'] = undefined;
				break;

			// unit
			case 'sleep':
				GAME.Display.MakeTerrainHint(4.2);
				GAME.data['active_spell_range'] = 4.2;
				GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-location.png),auto'});
				GAME.mDisableControls = true;
				break;
			case 'charm':
				GAME.Display.MakeTerrainHint(4.2);
				GAME.data['active_spell_range'] = 4.2;
				GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-location.png),auto'});
				GAME.mDisableControls = true;
				break;
			case 'frenzy':
				GAME.Display.MakeTerrainHint(3.2);
				GAME.data['active_spell_range'] = 3.2;
				GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-location.png),auto'});
				GAME.mDisableControls = true;
				break;
			case 'heal':
				GAME.Display.MakeTerrainHint(3.2);
				GAME.data['active_spell_range'] = 3.2;
				GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-location.png),auto'});
				GAME.mDisableControls = true;
				break;
			case 'entangle':
				GAME.Display.MakeTerrainHint(3.2);
				GAME.data['active_spell_range'] = 3.2;
				GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-location.png),auto'});
				GAME.mDisableControls = true;
				break;

			// terrain
			case 'meteor':
				GAME.Display.MakeTerrainHint(4.2);
				GAME.data['active_spell_range'] = 4.2;
				GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-location.png),auto'});
				GAME.mDisableControls = true;
				break;
			case 'rain':
				GAME.Display.MakeTerrainHint(3.2);
				GAME.data['active_spell_range'] = 3.2;
				GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-location.png),auto'});
				GAME.mDisableControls = true;
				break;
			case 'forest':
				GAME.Display.MakeTerrainHint(3.2);
				GAME.data['active_spell_range'] = 3.2;
				GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-location.png),auto'});
				GAME.mDisableControls = true;
				break;
			default:
				break;
		}
	});

	amplify.subscribe('TURN_ENEMY_START', function() {
		if ( GAME.mGameOver === true ) { return; }
        GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/wait.png),auto'});
		if ( GAME.mSpellCountDown > 0 ) {
			GAME.mSpellCountDown -= 1;
			if ( GAME.mSpellCountDown === 0 ) {
				GAME.Notifications.Post('Spellcasting Ability Restored', 'good');
				$('.gm_spells').removeClass('desaturate');
			}
		}
		if ( GAME.player.mIsFlying === true ) {
			GAME.mSpellFlyingCountDown -= 1;
			if ( GAME.mSpellFlyingCountDown <= 0 
				&& GAME.player.IsTilePassable( GAME.Tiles.GetAtXY( GAME.player.mGameX, GAME.player.mGameY ) ) === true ) { 
				var obj = GAME.Objects.GetTerrainAtXY( GAME.player.mGameX, GAME.player.mGameY );
				if ( obj === undefined || GAME.player.IsObjectPassable( obj.t ) === true ) {
					GAME.mSpellFlyingCountDown = 0;
					GAME.player.SetTrait('flying', false);
					GAME.Notifications.Post('You have lost an ability to fly', 'bad');
				}
			}
		}
		if ( GAME.mSpellShadowsCountDown > 0 ) {
			GAME.mSpellShadowsCountDown -= 1;
			if ( GAME.mSpellShadowsCountDown === 0 ) {
				GAME.player.SetTrait('hidden', false);
				GAME.Notifications.Post('You are no more hiding in shadows', 'bad');
			}
		}
		if ( GAME.mSpecialCountDown !== 0 ) { 
			GAME.mSpecialCountDown -= 1; 
			if ( GAME.mSpecialCountDown === 0 ) { 
				GAME.Buttons.SpecialEnable(); 
				GAME.Notifications.Post('Special Ability Recovered', 'good');
			}
		}
		if ( GAME.mTimeStop !== 0 ) { 
			GAME.mTimeStop -= 1;
			if ( GAME.mTimeStop === 0 ) {
				GAME.Notifications.Post('Time flow is back to normal');
				GAME.Display.RenderLand();
				GAME.Display.RenderObjects();
			}
		}
		if ( GAME.mTimeStop === 0 ) {			
			$('.turn_indicators').hide(0);
			$('#turn_indicator_enemies').show(0);

			GAME.mDisableControls = true;

			pcoord = GAME.player.GetGameXY();
			var monsters = GAME.Monsters.Find( pcoord.x - 15, pcoord.y - 15, pcoord.x + 15, pcoord.y + 15 );

			$.each(monsters, function( i, monster ) {
				if ( monster.died === undefined ) {
					monster.TurnPassed();
				}
				GAME.mMQ.queue('monster_move_queue', function( next_monster_move ) {
					if ( monster.died === undefined ) {
						GAME.ProcessMonsterAction( monster, function() { next_monster_move(); });
					} else {
						next_monster_move();
					}
				});
			});

			//console.log('queued monster moves');
			GAME.mMQ.queue('monster_move_queue', function( next_monster_move ) {
				//console.log('TURN_ENEMY_END');	
				next_monster_move();
				amplify.publish('TURN_ENEMY_END');
			});
			//console.log('queued end of monster turn');
		
			GAME.mMQ.dequeue('monster_move_queue');
		} else {
			amplify.publish('TURN_ENEMY_END');
		}
	});

	amplify.subscribe('TURN_ENEMY_END', function() {
		if ( GAME.mGameOver === true ) { return; }
		GAME.mDisableControls = true;

		//console.log('PLAYERs TURN STARTED');
		GAME.player.TurnPassed();
        GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/move.png),auto'});

		// check village healing every turn
		var gp = GAME.player;
		var obj = GAME.Objects.GetTerrainAtXY( gp.mGameX, gp.mGameY );
	    if ( obj !== undefined && obj.t.startsWith('house') && ( gp.mHP[0] < gp.mHP[1] ) ) {
	    	var dhp = ( gp.mHP[1] - gp.mHP[0] >= 8 ) ? 8 : ( gp.mHP[1] - gp.mHP[0] );
	    	gp.mHP[0] += dhp;
			gp.mIsPoisoned = false;
			gp.mIsBleeding = false;
			gp.mIsEntangled = false;
	    	GAME.AddTextAnimation('+'+parseInt(dhp)+' HP', gp.mGameX, gp.mGameY, '#E00');
	   		gp.AddEffect( $.extend( {}, GAME.effects['healing'] ) );
	    	gp.UpdateOverlay();
	    }
		$('.turn_indicators').hide(0);
		$('#turn_indicator_player').show(0);

		// check magic shop
		if ( obj !== undefined ) {
			if ( obj.t === 'shop_magic' ) {
				GAME.player.ClearMovePath();
				GAME.Dialogs.DisplayShopMagic();
			} else if ( obj.t === 'shop_weapons' ) {
				GAME.player.ClearMovePath();
				GAME.Dialogs.DisplayShopWeapons();
			}
		}

		if ( GAME.player.HasMovePath() === true ) {
			setTimeout( function() {
				GAME.player.MakeStepPath();
			}, 200);
		} else {
			GAME.mDisableControls = false;
		}
	});

	var pcoord = GAME.player.GetGameXY();
	GAME.Monsters.DestroyMonstersInRadius( pcoord.x, pcoord.y, 4.6 );

	// RENDER INIT:
	GAME.Display.RenderLand();
	GAME.Display.RenderObjects();
	GAME.Display.RenderWorldmap();
	GAME.Display.RenderMinimap();
	GAME.Display.RenderHeroPortrait();

	this.layer_control.ShowLayer('land', 1000);
	this.layer_control.ShowLayer('monsters', 1000);
	this.layer_control.ShowLayer('mouse', 1000);
	this.layer_control.ShowLayer('minimap', 1000);
	this.layer_control.ShowLayer('hero_portrait', 1000);

	GAME.Display.UpdateDayNightLayer();
//	this.layer_control.ShowLayer('daynight', 1000);

	this.Display.ShowPlayerOverlay();
	GAME.Buttons.Show();
	$('#turn_indicator_player').show();
};

GAME.EntityAttacksEntityHTH = function( attacker, defender, next_monster_move ) {
	this.mDisableControls = true;

	if ( attacker.mGameX > defender.mGameX ) { attacker.SetFlipX(true); } else { attacker.SetFlipX(false); }
	if ( defender.mGameX > attacker.mGameX ) { defender.SetFlipX(true); } else { defender.SetFlipX(false); }

	GAME.mMQ.queue('monster_action_queue', function( next_monster_action ) {
		//console.log('setting monster hth attack animation');
		if ( attacker.IsOffScreen() === false ) {
	    	attacker.SetCurrentAnimation('attack');
		}
		next_monster_action();
	});

	GAME.mMQ.queue('monster_action_queue', function( next_monster_action ) {
		//console.log('setting player animation: defend');
		if ( defender.IsOffScreen() === false ) {
	        defender.SetCurrentAnimation('defend', function() {
				//console.log('monster defend ended');
				next_monster_action();
			});
		} else {
			next_monster_action();
		}
	});

	GAME.mMQ.queue('monster_action_queue', function( next_monster_action ) {
		//console.log('calculating hth result for monster attack');
		attacker.AttackHandToHand( defender );
		GAME.mLoopThrottle = true;
		next_monster_action();
	});

	GAME.mMQ.queue('monster_action_queue', function( next_monster_action ) {
		next_monster_action();
		//console.log('last monster action, moving to next monster');
		GAME.mDisableControls = false;
		next_monster_move();
	});

	GAME.mMQ.dequeue('monster_action_queue');
};

GAME.EntityAttacksEntityRNG = function( attacker, defender, next_monster_move ) {
	this.mDisableControls = true; // do not allow controls until attack ends..

//	console.log('ranged attack performed');
	if ( attacker.mGameX > defender.mGameX ) { attacker.SetFlipX(true); } else { attacker.SetFlipX(false); }
	if ( defender.mGameX > attacker.mGameX ) { defender.SetFlipX(true); } else { defender.SetFlipX(false); }

	GAME.mMQ.queue('monster_action_queue', function( next_monster_action ) {
//		console.log('setting monster ranged attack animation');
		if ( attacker.IsOffScreen() === false ) {
		    attacker.SetCurrentAnimation('attack');
		}
		next_monster_action();
	});

	GAME.mMQ.queue('monster_action_queue', function( next_monster_action ) {
//		console.log('executing ranged effect');
		if ( attacker.IsOffScreen() === false ) {
			var effect = attacker.mRngEffect;
	        var c = defender.GetGameXY();
	        var start = GAME.Display.WorldTileToScreenXY( attacker.mGameX, attacker.mGameY );
	        var stop  = GAME.Display.WorldTileToScreenXY( c.x, c.y );
		    effect.SetStartStopXY( 0, 0, stop.x - start.x, stop.y - start.y );
	    	effect.SetCallback( function() {
//				console.log('effect ended, next monster action');
				next_monster_action();
			});
	        attacker.SetRangedEffect( effect );
		} else {
			next_monster_action();
		}
	});

	GAME.mMQ.queue('monster_action_queue', function( next_monster_action ) {
		if ( defender.IsOffScreen() === false ) {
	    	defender.SetCurrentAnimation('defend', function() {
//				console.log('defender action ended');
				next_monster_action();
			});
		} else {
			next_monster_action();
		}
	});

	GAME.mMQ.queue('monster_action_queue', function( next_monster_action ) {
		if ( attacker.IsOffScreen() === false ) {
	       	attacker.AttackRanged( defender );
	        GAME.mLoopThrottle = true;
//			console.log('ranged attack ended');
			next_monster_action();
		} else {
			next_monster_action();
		}
	});

	GAME.mMQ.queue('monster_action_queue', function( next_monster_action ) {
		next_monster_action();
//		console.log('monster actions ended');
		GAME.mDisableControls = false;
		next_monster_move();
	});

	GAME.mMQ.dequeue('monster_action_queue');
};

GAME.ProcessMonsterAction = function( monster, next_monster_move ) {

	if ( monster.mRegeneration !== undefined && monster.mHP[0] < monster.mHP[1] ) {
		// normal regeneration 
		var hp = monster.mHP[1] - monster.mHP[0];
		if ( hp > monster.mRegeneration ) { hp = monster.mRegeneration; }
		monster.mHP[0] += hp
		if ( monster.IsOffScreen() === false ) {
			GAME.AddTextAnimation('+'+hp+' HP regenerated', monster.mGameX, monster.mGameY, '#0E0');
		}
	} else if ( GAME.mTime.GetTimeOfDay() === 'night' && monster.mIsUndead === true && monster.mHP[0] < monster.mHP[1] ) {
		// undead regenerate at night...
		var hp = monster.mHP[1] - monster.mHP[0];
		if ( hp > 8 ) { hp = 8; }
		monster.mHP[0] += hp
		if ( monster.IsOffScreen() === false ) {
			GAME.AddTextAnimation('+'+hp+' HP restored', monster.mGameX, monster.mGameY, '#090');
		}
	}

	var units = undefined, c = GAME.player.GetGameXY(), dist = monster.DistanceTo( GAME.player );
	//console.log( 'processing monster with state '+ monster.mState );
	switch ( monster.mState ) {

		case 'sleeping':
			next_monster_move();
			break;

		case 'cowardly':
			// move away from player and friendly units
			// find closest "friendly" unit or player:
			units = GAME.Monsters.FindInRadius( monster.mGameX, monster.mGameY, 10.0, ['friendly'] );
			for ( var i = 0, len = units.length; i < len; i++ ) {
				if ( monster.DistanceTo( units[i] ) < dist ) {
					c = monster.GetGameXY();
				}
			}
			// move in the opposite side of nearest enemy
			monster.MoveTowardsOrAwayFromPoint( c.x, c.y, false );
			next_monster_move();
			break;

		case 'frenzied':
			if ( $.gmRndInt(0,1) === 0 ) {
				//console.log('frenzied: moving randomly');
				monster.MoveRandomly();
				next_monster_move();
			} else {
				//console.log('frenzied: attacking');
				// attack nearest unit with hth or rng
				var defender = GAME.Monsters.FindNearestMonsterInRadius( monster.mGameX, monster.mGameY, monster.mRngRange > 0 ? monster.mRngRange : 1 );

				if ( defender !== undefined && monster.DistanceTo( defender ) > monster.DistanceTo( GAME.player ) ) {
					defender = GAME.player;
				} else if ( defender === undefined && monster.DistanceTo( GAME.player ) <= ( monster.mRngRange > 0 ? monster.mRngRange : 1 ) ) {
					defender = GAME.player;
				}

				if ( defender !== undefined ) {
					if ( monster.IsAdjacentEntity( defender ) === true && monster.HasHTHAttack() === true ) {
						//console.log('frenzied: attacking hth');
						this.EntityAttacksEntityHTH( monster, defender, next_monster_move );
					} else if ( monster.HasRangedAttack() === true 
						&& monster.CheckLosToEntity( defender ) === true
						&& monster.mRngRange >= monster.DistanceTo( defender ) 
						) {
						//console.log('frenzied: attacking rng');
						this.EntityAttacksEntityRNG( monster, defender, next_monster_move );
					} else {
						next_monster_move();
					}
				} else {
					next_monster_move();
				}
			}
			break;

		case 'friendly':
			//console.log( 'friendly at ' + dist );
			// move towards player or attack aggressive/angered units
			var defender = GAME.Monsters.FindNearestMonsterInRadius( monster.mGameX, monster.mGameY, monster.mSense, ['aggressive','angered','frenzied'] );
			if ( defender !== undefined ) {
				if ( monster.IsAdjacentEntity( defender ) === true && monster.HasHTHAttack() === true ) {
					//console.log('friendly '+monster.mName+' hth attack performed');
					this.EntityAttacksEntityHTH( monster, defender, next_monster_move );
				} else if ( monster.HasRangedAttack() === true 
					&& monster.CheckLosToEntity( defender ) === true
					&& monster.mRngRange >= monster.DistanceTo( defender )
					) {
					//console.log('friendly '+monster.mName+' ranged attack performed');
					this.EntityAttacksEntityRNG( monster, defender, next_monster_move );
				} else {
					//console.log('friendly '+monster.mName+' moved towards enemy');
					var path = monster.GetPossiblePathToXY( defender.mGameX, defender.mGameY );
					if ( path.length > 1 ) {
						path.shift();
						c = path.shift();
						monster.MoveTowardsOrAwayFromPoint( c[0], c[1], true );
					} else {
						monster.MoveTowardsOrAwayFromPoint( GAME.player.mGameX, GAME.player.mGameY, true );
					}
					next_monster_move();
				}
			} else {
				//console.log('moving towards player');
				if ( dist < 1.5 ) {
					monster.MoveTowardsOrAwayFromPoint( c.x, c.y, false );
				} else if ( dist < 10.0 ) {
					var path = monster.GetPossiblePathToXY( c.x, c.y );
					if ( path.length > 1 ) {
						path.shift();
						c = path.shift();
						monster.MoveTowardsOrAwayFromPoint( c[0], c[1], true );
					} else {
						monster.MoveTowardsOrAwayFromPoint( c.x, c.y, true );
					}
				}
				next_monster_move();
			}
			break;

		case 'neutral':
			// noop, do nothing. neutral units do nothing until attacked
			if ( monster.IsAdjacentEntity( GAME.player ) === true ) {
				monster.SetState('aggressive'); // don't come close to neutral monsters
			}
			next_monster_move();
			break;

		case 'angered':
		case 'aggressive':
			var defender = GAME.Monsters.FindNearestMonsterInRadius( monster.mGameX, monster.mGameY, monster.mSense, ['friendly','frenzied'] );
			if ( defender !== undefined && monster.DistanceTo( defender ) > monster.DistanceTo( GAME.player ) ) {
				defender = GAME.player;
			} else if ( defender === undefined && monster.DistanceTo( GAME.player ) <= monster.mSense ) {
				defender = GAME.player;
			}
			if ( defender !== undefined ) {
				if ( monster.IsAdjacentEntity( defender ) === true && monster.HasHTHAttack() === true ) {
					//console.log('aggressive '+monster.mName+' hth attack performed');
					this.EntityAttacksEntityHTH( monster, defender, next_monster_move );
				} else if ( monster.HasRangedAttack() === true 
					&& monster.CheckLosToEntity( defender ) === true
					&& monster.mRngRange >= monster.DistanceTo( defender )
					) {
					//console.log('aggressive '+monster.mName+' ranged attack performed xy: ' + monster.mGameX + ',' + monster.mGameY+', pxy:'+GAME.player.mGameX+','+GAME.player.mGameY);
					this.EntityAttacksEntityRNG( monster, defender, next_monster_move );
				} else {
					//console.log('aggressive '+monster.mName+' move towards enemy');
					var path = monster.GetPossiblePathToXY( defender.mGameX, defender.mGameY );
					if ( path.length > 1 ) {
						path.shift();
						c = path.shift();
						monster.MoveTowardsOrAwayFromPoint( c[0], c[1], true );
					} else {
						if ( monster.MoveTowardsOrAwayFromPoint( defender.mGameX, defender.mGameY, true ) === false ) {
							 monster.MoveTowardsOrAwayFromPoint( defender.mGameX, defender.mGameY, false );
						}
					}
					next_monster_move();
				}
			} else if ( monster.mState === 'angered' ) {					
				if ( monster.IsAdjacentEntity( GAME.player ) === true && monster.HasHTHAttack() === true ) {
					//console.log('angered '+monster.mName+' hth attack performed');
					this.EntityAttacksEntityHTH( monster, GAME.player, next_monster_move );
				} else if ( monster.HasRangedAttack() === true 
					&& monster.CheckLosToEntity( GAME.player ) === true
					&& monster.mRngRange >= dist
					) {
					//console.log('angered '+monster.mName+'ranged attack performed');
					this.EntityAttacksEntityRNG( monster, GAME.player, next_monster_move );
				} else {
					//console.log('angered '+monster.mName+' move towards enemy');
					var path = monster.GetPossiblePathToXY( c.x, c.y );
					if ( path.length > 1 ) {
						path.shift();
						c = path.shift();
						monster.MoveTowardsOrAwayFromPoint( c[0], c[1], true );
					} else {
						monster.MoveTowardsOrAwayFromPoint( c.x, c.y, true );
					}
					next_monster_move();
				}
			} else {
				//console.log('player out of reach');
				next_monster_move();
			}
			break;
		default:
			// should never get there..
			//console.log('should never get there');
			next_monster_move();
			break;
	}

};

GAME.AddTextAnimation = function( text, x, y, color ) {
	GAME.text_animations.push( new WS.TextAnimation({ 'text': text, 'game_x': x , 'game_y': y, 'style': color }) );
};

GAME.GameOver = function( good ) {
	GAME.mGameOver = true;
    GAME.StopLoop();
    GAME.mDisableControls = true;
	$('.gm_special_abilities').hide(0);
	GAME.Buttons.Hide();
    GAME.layer_control.HideAllLayers();
    $('#player_overlay').hide(0);
	$('.turn_indicators').hide(0);

	if ( good === true ) {
	    this.Dialogs.DisplayGameOverGoodDialog();
	} else {
	    this.Dialogs.DisplayGameOverBadDialog();
	}
};

GAME.ResurrectHero = function() {
	console.log('resurrecting hero');

	GAME.mGameOver = false;
	var gp = GAME.player;

	gp.mIsBleeding  = false;
	gp.mIsPoisoned  = false;
	gp.mIsEntangled = false;
	gp.mIsFrenzied  = false;
	gp.mIsSleeping  = false;
	gp.mIsHidden    = false;
	gp.mIsFlying    = false;

	var c = GAME.data['position_ship'];
	gp.mGameX = c.x;
	gp.mGameY = c.y;
	var mm = gp.mMagic;

	// remove gold
	gp.mCash = 0;

	// remove unlearned spells
	for ( var i in mm ) {
		if ( mm[i] > 0 ) { mm[i] = 0; }
	}

	// remove EXP
	gp.mEXP = gp.GetLvlExp( gp.mLVL - 1 );

	// decrease attack
	if ( gp.mNHTH > 0 ) { gp.mHTH *= 0.9; gp.mHTH = Math.ceil( gp.mHTH ); }
	if ( gp.mNRNG > 0 ) { gp.mRNG *= 0.9; gp.mRNG = Math.ceil( gp.mRNG ); }

	// decrease hit points	
	if ( gp.mHP[1] > 10 ) { gp.mHP[1] -= parseInt( gp.mHP[1] / 10 ); gp.mHP[0] = gp.mHP[1]; }

    // decrease defense
	if ( gp.mDEF > 0 ) { gp.mDEF *= 0.9; gp.mDEF = Math.ceil( gp.mDEF ); }

    gp.UpdateOverlay();

	// game settings:
    GAME.Display.RenderLand();
    GAME.Display.RenderObjects();
    GAME.Display.RenderWorldmap();
    GAME.Display.RenderMinimap();
    GAME.Display.RenderHeroPortrait();
        
    this.layer_control.ShowLayer('land', 1000);
    this.layer_control.ShowLayer('monsters', 1000);
    this.layer_control.ShowLayer('mouse', 1000);
    this.layer_control.ShowLayer('minimap', 1000);
    this.layer_control.ShowLayer('hero_portrait', 1000);
            
    GAME.Display.UpdateDayNightLayer();
    this.Display.ShowPlayerOverlay();
    GAME.Buttons.Show();
    $('#turn_indicator_player').show();

    this.Update(0);
    this.Render();
    GAME.mDisableControls = false;
	GAME.Notifications.Post('Resurrection has a cost: spells, gold, attack/defense/armor', 'bad');
    this.StartLoop();
};

GAME.Update = function(dt) {

	this.mLastKeyPress += dt;
	var key_pressed = false;

	if ( this.mDisableControls === false && this.mLastKeyPress > 150 ) {

		if ( key.isPressed('l') ) {
			GAME.player.GetXP( GAME.player.GetLvlExp( GAME.player.mLVL ) - GAME.player.mEXP );
			this.mLastKeyPress = 0;
			key_pressed = true;
		}

		if ( key.isPressed('space') ) {
			var c = GAME.player.GetGameXY();
			GAME.player.MoveToDXY( 0, 0 );
			GAME.Notifications.Post('Skipping Turn');
			GAME.Display.RenderMinimap();
			this.mLastKeyPress = 0;
			key_pressed = true;
		}

		if ( key.isPressed('q') ) {
			GAME.GameOver( false );
			key_pressed = 'ignore';
		}

		if ( key.isPressed('pageup') ) {
			GAME.Display.ZoomIn();
			this.mLastKeyPress = 0;
			key_pressed = 'ignore';
		};

		if ( key.isPressed('pagedown') ) {
			GAME.Display.ZoomOut();
			this.mLastKeyPress = 0;
			key_pressed = 'ignore';
		};

		if ( key.isPressed('home') ) {
			GAME.Display.ZoomReset();
			this.mLastKeyPress = 0;
			key_pressed = 'ignore';
		};

		if ( key_pressed === false && key.isPressed('left') ) {
			var c = GAME.player.GetGameXY();
			GAME.player.SetFlipX(true);
			if ( GAME.player.MoveToDXY( -1, 0 ) === true ) {
				GAME.player.SetCurrentAnimation('move');
				GAME.Display.RenderMinimap();
				key_pressed = true;
			}
			this.mLastKeyPress = 0;
		}

		if ( key_pressed === false && key.isPressed('right') ) {
			var c = GAME.player.GetGameXY();
			GAME.player.SetFlipX(false);
			if ( GAME.player.MoveToDXY( +1, 0 ) === true ) {
				GAME.player.SetCurrentAnimation('move');
				GAME.Display.RenderMinimap();
				key_pressed = true;
			}
			this.mLastKeyPress = 0;
		}

		if ( key_pressed === false && key.isPressed('up') ) {
			var c = GAME.player.GetGameXY();
			if ( GAME.player.MoveToDXY( 0, -1 ) === true ) {
				GAME.player.SetCurrentAnimation('move');
				GAME.Display.RenderMinimap();
				key_pressed = true;
			}
			this.mLastKeyPress = 0;
		}

		if ( key_pressed === false && key.isPressed('down') ) {
			var c = GAME.player.GetGameXY();
			if ( GAME.player.MoveToDXY( 0, +1 ) === true ) {
				GAME.player.SetCurrentAnimation('move');
				GAME.Display.RenderMinimap();
				key_pressed = true;
			}
			this.mLastKeyPress = 0;
		}

		if ( key_pressed !== false ) {
			GAME.Display.RenderLand();
			GAME.Display.RenderObjects();
			GAME.Render();
			if ( key_pressed === true ) {
				amplify.publish('TURN_ENEMY_START');
			}
		}
	}

	GAME.player.Update( dt );
	GAME.UpdateMonsters( dt );
	GAME.flags.owned.Update( dt );
	GAME.flags.notowned.Update( dt );

    var i = GAME.text_animations.length;
    while ( i-- ) {
    	if ( GAME.text_animations[i].Update(dt) === true ) {
        	GAME.text_animations.splice( i, 1 );
        }
    }
};

GAME.Render = function() {
	GAME.layer_control.ClearLayer('monsters');
	GAME.Display.RenderMonsters();
	GAME.player.Render();
	GAME.player.RenderInfo();

	if ( GAME.text_animations.length > 0 ) {
		for( var i = 0, len = GAME.text_animations.length; i < len; i++ ) {
			GAME.text_animations[i].Render();
		}	
	}	
};

GAME.StartLoop = function() {
	var that = this;

    that.mAnimationLoopID = requestAnimationFrame( that.StartLoop.bind(that) );
    var now = Date.now();
    var dt = now - this.mLoopLastTimeUpdated;
    this.mLoopLastTimeUpdated = now;

	this.mLastTick += dt;
	if ( this.mLoopThrottle === true && this.mLastTick < 50 ) { 
		return; 
	} else { 
		this.Update(this.mLastTick);
		this.Render();
		this.mLastTick = 0; 
		return;
	}

	this.Update(dt);
	this.Render();

};

GAME.StopLoop = function() {
	cancelAnimationFrame( this.mAnimationLoopID );
};

GAME.UpdateMonsters = function( dt ) {
	var c = GAME.player.GetGameXY();
    var monsters = GAME.Monsters.Find( c.x - GAME.Display.mTileSize.hw - 1, c.y - GAME.Display.mTileSize.hh - 1, 
		c.x + GAME.Display.mTileSize.hw + 1, c.y + GAME.Display.mTileSize.hh + 1 );
    for ( var i = 0, len = monsters.length; i < len; i++ ) {
		//if ( c.x < monsters[i].mGameX ) { monsters[i].SetFlipX(true); } else { monsters[i].SetFlipX(false); }
		monsters[i].Update( dt );
	}
};

GAME.ProcessSpellClick = function( c, range ) {
	var spell = GAME.data['active_spell'];
	GAME.layer_control.ClearLayer('mouse');
	GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/select-illegal.png),auto'});
	var pc = GAME.player.GetGameXY();
	switch( spell ) {
		case 'sleep':
			GAME.SpellSleep( c, pc );
			break;
		case 'charm':
			GAME.SpellCharm( c, pc );
			break;
		case 'frenzy':
			GAME.SpellFrenzy( c, pc );
			break;
		case 'heal':
			GAME.SpellHeal( c, pc );
			break;
		case 'entangle':
			GAME.SpellEntangle( c, pc );
			break;
		case 'meteor':
			GAME.SpellMeteor( c, pc );
			break;
		case 'rain':
			GAME.SpellRain( c, pc );
			break;
		case 'forest':
			GAME.SpellForest( c, pc );
			break;
		default:
			break;
	}
	GAME.data['active_spell'] = undefined;
};

//------------- INSTANT SPELLS -------------
GAME.SpellTornado = function() {
	// pushes all enemies 3 moves away from player
	// transforms trees into dead trees
	// places sand under player, and dirt around sand
	var c = GAME.player.GetGameXY(), tile = undefined, obj = undefined;
	for (var x = -2; x <= 2; x++ ) {
		for (var y = -2; y <= 2; y++) {
			if ( ( x === -2 && y === -2 ) || ( x === -2 && y === 2 ) || ( x === 2 && y === -2 ) || ( x === 2 && y === 2 ) ) { continue; }
			tile = GAME.Tiles.GetAtXY(c.x + x, c.y + y);
			if ( tile === 'sand' || tile.startsWith('water') || tile.startsWith('swamp') ) { continue; } 
			GAME.Tiles.SetAtXY( 'mud', c.x + x, c.y + y );
			obj = GAME.Objects.GetTerrainAtXY( c.x + x, c.y + y );
			if ( obj !== undefined && ( obj.t.startsWith('house') || obj.t === 'mine'|| obj.t === 'monolith' ) ) { continue; }
			GAME.Objects.Destroy( c.x + x, c.y + y );
			GAME.Objects.DestroyTerrain( c.x + x, c.y + y );
		}
	}
	for (var x = -1; x <= 1; x++ ) {
		for (var y = -1; y <= 1; y++) {
			tile = GAME.Tiles.GetAtXY(c.x + x, c.y + y);
			if ( tile === 'sand' || tile.startsWith('water') || tile.startsWith('swamp') ) { continue; } 
			GAME.Tiles.SetAtXY( 'dirt', c.x + x, c.y + y );
		}
	}
	GAME.Tiles.SetAtXY( 'sand', c.x, c.y );

	var monsters = GAME.Monsters.FindInRadius( c.x, c.y, 3.1), dmg = 0;
	for ( var i = 0, len = monsters.length; i < len; i++ ) {
		var m = monsters[i];
		m.MoveTowardsOrAwayFromPoint( c.x, c.y, false );
		m.MoveTowardsOrAwayFromPoint( c.x, c.y, false );
		dmg = parseInt(m.mHP[0] * $.gmRnd(0.50,0.90));
		m.mHP[0] -= dmg;
		GAME.AddTextAnimation('-'+parseInt(dmg)+' HP', m.mGameX, m.mGameY, '#E00');
	}
	GAME.player.AddEffect( $.extend( {}, GAME.effects['tornado-ring'] ) );

	GAME.Notifications.Post('Mighty tornado rushed through the area', 'good');
	GAME.Display.RenderLand();
	GAME.Display.RenderObjects();
	GAME.Display.RenderWorldmap();
	GAME.Display.RenderMinimap();
	GAME.Render();
};
GAME.SpellFly = function() {
	// temporarily grants an ability to fly
	// N turns + until movable tile reached
	GAME.player.SetTrait('flying');
	GAME.player.AddEffect( $.extend( {}, GAME.effects['magichalo'] ) );
	GAME.mSpellFlyingCountDown = 10;
	GAME.Notifications.Post('You have gained a temporary ability to fly', 'good');
};
GAME.SpellMirror = function() {
	// two copies of player are created nearby
	// having 1/3 hit points, and friendly state
	var c = GAME.player.GetGameXY();

	pos_1 = GAME.MapGen.SearchRadius( c.x, c.y, GAME.player.mPassableTiles );
	GAME.Monsters.CreatePlayerCopy( pos_1.x, pos_1.y );

	pos_2 = GAME.MapGen.SearchRadius( c.x, c.y, GAME.player.mPassableTiles );
	GAME.Monsters.CreatePlayerCopy( pos_2.x, pos_2.y );

	GAME.player.AddEffect( $.extend( {}, GAME.effects['magichalo'] ) );	
	GAME.Notifications.Post('You have successfully created mirror images of yourself', 'good');
};
GAME.SpellShadows = function() {
	GAME.player.mIsHidden = true;
	GAME.player.AddEffect( $.extend( {}, GAME.effects['magichalo'] ) );	
	GAME.mSpellShadowsCountDown = 15;
	GAME.Notifications.Post('Hiding in shadows', 'good');	
};

//------------ TILE SPELLS -------------------
GAME.SpellRain = function( c, pc ) {
	// cast on a tile near player
	// transforms tile into medium water, and tiles around it into shallow water
	var range = GAME.data['active_spell_range'];
	if ( range < Math.sqrt( c.x * c.x + c.y * c.y ) ) {
		GAME.Notifications.Post('Spell wasted: out of range', 'bad');
		return;
	}

	tile = GAME.Tiles.GetAtXY(pc.x + c.x, pc.y + c.y);

	for (var x = -2; x <= 2; x++ ) {
		for (var y = -2; y <= 2; y++) {
			if ( ( x === -2 && y === -2 ) || ( x === -2 && y === 2 ) || ( x === 2 && y === -2 ) || ( x === 2 && y === 2 ) ) { continue; }
			var monster = GAME.Monsters.IsMonsterThere( pc.x + c.x + x, pc.y + c.y + y );
			if ( monster !== false ) { // monster
				var dmg = monster.mHP[0] * $.gmRnd(0.5, 0.75); 
				monster.mHP[0] -= dmg;
				monster.AddEffect( $.extend( {}, GAME.effects['small-lightning'] ) );
				GAME.AddTextAnimation('-'+parseInt(dmg)+' HP', monster.mGameX, monster.mGameY, '#E00');
			}
			obj = GAME.Objects.GetTerrainAtXY( pc.x + c.x + x, pc.y + c.y + y );
			if ( obj !== undefined && ( obj.t.startsWith('house') || obj.t === 'mine'|| obj.t === 'monolith' ) ) { continue; }
			tile = GAME.Tiles.GetAtXY(pc.x + c.x + x, pc.y + c.y + y);
			if ( tile.startsWith('water') || tile.startsWith('swamp') ) { continue; } 
			if ( x === 0 && y === 0 && c.x === 0 && c.y === 0 ) { continue; } // player
			GAME.Tiles.SetAtXY( 'water_shallow', pc.x + c.x + x, pc.y + c.y + y );
			GAME.Objects.Destroy( pc.x + c.x + x, pc.y + c.y + y );
			GAME.Objects.DestroyTerrain( pc.x + c.x + x, pc.y + c.y + y );
		}
	}
	for (var x = -1; x <= 1; x++ ) {
		for (var y = -1; y <= 1; y++) {
			obj = GAME.Objects.GetTerrainAtXY( pc.x + c.x + x, pc.y + c.y + y );
			if ( obj !== undefined && ( obj.t.startsWith('house') || obj.t === 'mine'|| obj.t === 'monolith' ) ) { continue; }
			if ( x === 0 && y === 0 && c.x === 0 && c.y === 0 ) { continue; } // player
			GAME.Tiles.SetAtXY( 'water_medium', pc.x + c.x + x, pc.y + c.y + y );
			GAME.Objects.Destroy( pc.x + c.x + x, pc.y + c.y + y );
			GAME.Objects.DestroyTerrain( pc.x + c.x + x, pc.y + c.y + y );
		}
	}
	if ( ! ( c.x === 0 && c.y === 0 ) ) {
		GAME.Tiles.SetAtXY( 'water_deep', pc.x + c.x, pc.y + c.y);
	}
	
	GAME.Notifications.Post('Nature has heard your call..Tropical Storm is here.', 'good');
	GAME.Display.RenderLand();
	GAME.Display.RenderObjects();
	GAME.Display.RenderWorldmap();
	GAME.Display.RenderMinimap();
	GAME.Render();
};

GAME.SpellForest = function( c, pc ) {
	var range = GAME.data['active_spell_range'];
	if ( range < Math.sqrt( c.x * c.x + c.y * c.y ) ) {
		GAME.Notifications.Post('Spell wasted: out of range', 'bad');
		return;
	}
	var forest_name = undefined;
	for (var x = -2; x <= 2; x++ ) {
		for (var y = -2; y <= 2; y++) {
			if ( ( x === -2 && y === -2 ) || ( x === -2 && y === 2 ) || ( x === 2 && y === -2 ) || ( x === 2 && y === 2 ) ) { continue; }
			tile = GAME.Tiles.GetAtXY(pc.x + c.x + x, pc.y + c.y + y);
			if ( tile.startsWith('water') || tile.startsWith('swamp') ) { continue; } 

			obj = GAME.Objects.GetTerrainAtXY( pc.x + c.x + x, pc.y + c.y + y );
			if ( obj !== undefined && ( obj.t.startsWith('house') || obj.t === 'mine'|| obj.t === 'monolith' ) ) { continue; }

			if ( GAME.Monsters.IsMonsterThere( pc.x + c.x + x, pc.y + c.y + y ) !== false ) { continue; } // monster
			if ( x === 0 && y === 0 && c.x === 0 && c.y === 0 ) { continue; } // player

			if ( $.gmRndInt(0,99) < 66 ) {
				GAME.Tiles.SetAtXY( 'grass', pc.x + c.x + x, pc.y + c.y + y );
				GAME.Objects.Destroy( pc.x + c.x + x, pc.y + c.y + y );
				GAME.Objects.DestroyTerrain( pc.x + c.x + x, pc.y + c.y + y );
				if ( $.gmRndInt(0,99) < 50 ) { 
					forest_name = 'forest_deducious'; 
				} else { 
					forest_name = 'forest_coniferous'; 
				}
				GAME.Objects.CreateAt( forest_name, pc.x + c.x + x, pc.y + c.y + y );
			}
		}
	}
	
	GAME.Notifications.Post('Nature has heard your call..Forests has grown.', 'good');
	GAME.Display.RenderLand();
	GAME.Display.RenderObjects();
	GAME.Display.RenderWorldmap();
	GAME.Display.RenderMinimap();
	GAME.Render();
};

GAME.SpellMeteor = function( c, pc ) {
	var range = GAME.data['active_spell_range'];
	if ( range < Math.sqrt( c.x * c.x + c.y * c.y ) ) {
		GAME.Notifications.Post('Spell wasted: out of range', 'bad');
		return;
	}
	for (var x = -2; x <= 2; x++ ) {
		for (var y = -2; y <= 2; y++) {
			if ( ( x === -2 && y === -2 ) || ( x === -2 && y === 2 ) || ( x === 2 && y === -2 ) || ( x === 2 && y === 2 ) ) { continue; }

			tile = GAME.Tiles.GetAtXY(pc.x + c.x + x, pc.y + c.y + y);
			if ( tile.startsWith('water') || tile.startsWith('swamp') ) { continue; } 

			obj = GAME.Objects.GetTerrainAtXY( pc.x + c.x + x, pc.y + c.y + y );
			if ( obj !== undefined && ( obj.t.startsWith('house') || obj.t === 'mine'|| obj.t === 'monolith' ) ) { continue; }

			var monster = GAME.Monsters.IsMonsterThere( pc.x + c.x + x, pc.y + c.y + y );
			if ( monster !== false ) {
				var dmg = monster.mHP[0] * $.gmRnd(0.75, 0.95); 
				monster.mHP[0] -= dmg;
				monster.AddEffect( $.extend( {}, GAME.effects['boom'] ) );
				GAME.AddTextAnimation('-'+parseInt(dmg)+' HP', monster.mGameX, monster.mGameY, '#E00');
				GAME.Tiles.SetAtXY( 'sand', pc.x + c.x + x, pc.y + c.y + y );
				GAME.Objects.Destroy( pc.x + c.x + x, pc.y + c.y + y );
				GAME.Objects.DestroyTerrain( pc.x + c.x + x, pc.y + c.y + y );
				continue; 
			}

			if ( x === 0 && y === 0 && c.x === 0 && c.y === 0 ) { continue; } // player

			if ( $.gmRndInt(0,99) < 33 ) {
				GAME.Tiles.SetAtXY( 'lava', pc.x + c.x + x, pc.y + c.y + y );
				GAME.Objects.Destroy( pc.x + c.x + x, pc.y + c.y + y );
				GAME.Objects.DestroyTerrain( pc.x + c.x + x, pc.y + c.y + y );
			}
		}
	}
	
	GAME.Notifications.Post('Nature has heard your call.. Meteors have fallen from the sky', 'good');
	GAME.Display.RenderLand();
	GAME.Display.RenderObjects();
	GAME.Display.RenderWorldmap();
	GAME.Display.RenderMinimap();
	GAME.Render();
};
//------------ MONSTER SPELLS ------------------
GAME.SpellEntangle = function( c, pc ) {
	var range = GAME.data['active_spell_range'];
	if ( range < Math.sqrt(c.x*c.x + c.y*c.y) ) {
		GAME.Notifications.Post('Spell wasted: out of range', 'bad');
		return;
	}
	var monster = GAME.Monsters.IsMonsterThere(pc.x+c.x, pc.y+c.y);
	if ( monster === false ) {
		GAME.Notifications.Post('Spell wasted: no target', 'bad');
	} else {
		var rndval = $.gmRndInt(0,99);
		if ( monster.mLVL < 3 ) {
			monster.SetState('angered');
			monster.SetTrait('entangled');
			GAME.Notifications.Post(monster.mName+' was successfully entangled', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL >= 3 && rndval < 50 ) {
			monster.SetState('angered');
			monster.SetTrait('entangled');
			GAME.Notifications.Post(monster.mName+' was successfully entangled', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else {
			monster.SetState('angered');
			GAME.Notifications.Post('Failed to entangle '+monster.mName, 'bad');
		}
	}
};

GAME.SpellHeal = function( c, pc ) {
	var range = GAME.data['active_spell_range'];
	if ( range < Math.sqrt(c.x*c.x + c.y*c.y) ) {
		GAME.Notifications.Post('Spell wasted: out of range', 'bad');
		return;
	}
	if ( c.x === 0 && c.y === 0 ) {
		var gp = GAME.player;
		gp.mHP[0] = gp.mHP[1];
		gp.mIsBleeding  = false;
		gp.mIsPoisoned  = false;
		gp.mIsEntangled = false;
		GAME.Notifications.Post('You are fully healed', 'good');
		gp.AddEffect( $.extend( {}, GAME.effects['healing'] ) );
		return;
	}
	var monster = GAME.Monsters.IsMonsterThere(pc.x+c.x, pc.y+c.y);
	if ( monster === false ) {
		GAME.Notifications.Post('Spell wasted: no target', 'bad');
	} else {
		if ( monster.mIsUndead === false ) {
			monster.mHP[0] = monster.mHP[1];
			monster.mIsBleeding  = false;
			monster.mIsPoisoned  = false;
			monster.mIsEntangled = false;
			GAME.Notifications.Post(monster.mName+' is fully healed', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['healing'] ) );
		} else {
			var dmg = monster.mHP[0] * $.gmRnd(0.25, 0.75); 
			monster.mHP[0] -= dmg;
			GAME.Notifications.Post(monster.mName+' suffered from Heal spell', 'good');
			GAME.AddTextAnimation('-'+parseInt(dmg)+' HP', monster.mGameX, monster.mGameY, '#E00');		
		}
	}
};

GAME.SpellCharm = function( c, pc ) {
	// selected monster is charmed = becomes friendly
	var range = GAME.data['active_spell_range'];
	if ( range < Math.sqrt(c.x*c.x + c.y*c.y) ) {
		GAME.Notifications.Post('Spell wasted: out of range', 'bad');
		return;
	}
	var monster = GAME.Monsters.IsMonsterThere(pc.x+c.x, pc.y+c.y);
	if ( monster === false ) {
		GAME.Notifications.Post('Spell wasted: no target', 'bad');
	} else {
		var rndval = $.gmRndInt(0,99);
		if ( monster.mLVL === 0 ) {
			monster.SetState('friendly');
			monster.SetTrait('charmed');
			GAME.Notifications.Post(monster.mName+' was successfully charmed', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL === 1 && rndval < 75 ) {
			monster.SetState('friendly');
			monster.SetTrait('charmed');
			GAME.Notifications.Post(monster.mName+' was successfully charmed', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL === 2 && rndval < 50 ) {
			monster.SetState('friendly');
			monster.SetTrait('charmed');
			GAME.Notifications.Post(monster.mName+' was successfully charmed', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL === 3 && rndval < 25 ) {
			monster.SetState('friendly');
			monster.SetTrait('charmed');
			GAME.Notifications.Post(monster.mName+' was successfully charmed', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL > 3 ) {
			monster.SetState('angered');
			GAME.Notifications.Post('Lvl '+monster.mLVL+' creatures cannot be charmed! Spell wasted.', 'bad');
		} else {
			monster.SetState('angered');
			GAME.Notifications.Post('Failed to charm '+monster.mName, 'bad');
		}
	}
};
GAME.SpellSleep = function( c, pc ) {
	// selected monster falls asleep = becomes sleeping
	var range = GAME.data['active_spell_range'];
	if ( range < Math.sqrt(c.x*c.x + c.y*c.y) ) {
		GAME.Notifications.Post('Spell wasted: out of range', 'bad');
		return;
	}
	var monster = GAME.Monsters.IsMonsterThere(pc.x+c.x, pc.y+c.y);
	if ( monster === false ) {
		GAME.Notifications.Post('Spell wasted: no target', 'bad');
	} else {
		var rndval = $.gmRndInt(0,99);
		if ( monster.mIsUndead === true ) {
			monster.SetState('angered');
			GAME.Notifications.Post('Undead are immune to Sleep spell. Spell wasted.', 'bad');
		} else if ( monster.mLVL === 0 ) {
			monster.SetState('sleeping');
			monster.SetTrait('sleeping');
			GAME.Notifications.Post(monster.mName+' was successfully put asleep', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL === 1 && rndval < 75 ) {
			monster.SetState('sleeping');
			monster.SetTrait('sleeping');
			GAME.Notifications.Post(monster.mName+' was successfully put asleep', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL === 2 && rndval < 50 ) {
			monster.SetState('sleeping');
			monster.SetTrait('sleeping');
			GAME.Notifications.Post(monster.mName+' was successfully put asleep', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL === 3 && rndval < 25 ) {
			monster.SetState('sleeping');
			monster.SetTrait('sleeping');
			GAME.Notifications.Post(monster.mName+' was successfully put asleep', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL > 3 ) {
			monster.SetState('angered');
			GAME.Notifications.Post('Lvl '+monster.mLVL+' creatures are immune to Sleep magic! Spell wasted.', 'bad');
		} else {
			monster.SetState('angered');
			GAME.Notifications.Post('Failed to put asleep '+monster.mName, 'bad');
		}
	}
};
GAME.SpellFrenzy = function( c, pc ) {
	// selected monster becomes frenzied = moves randomly or attacks randomly
	var range = GAME.data['active_spell_range'];
	if ( range < Math.sqrt(c.x*c.x + c.y*c.y) ) {
		GAME.Notifications.Post('Spell wasted: out of range', 'bad');
		return;
	}
	var monster = GAME.Monsters.IsMonsterThere(pc.x+c.x, pc.y+c.y);
	if ( monster === false ) {
		GAME.Notifications.Post('Spell wasted: no target', 'bad');
	} else {
		var rndval = $.gmRndInt(0,99);
		if ( monster.mIsUndead === true ) {
			monster.SetState('angered');
			GAME.Notifications.Post('Undead are immune to Frenzy spell. Spell wasted.', 'bad');
		} else if ( monster.mLVL === 0 ) {
			monster.SetState('frenzied');
			monster.SetTrait('frenzied');
			GAME.Notifications.Post(monster.mName+' was successfully frenzied', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL <= 1 && rndval < 85 ) {
			monster.SetState('frenzied');
			monster.SetTrait('frenzied');
			GAME.Notifications.Post(monster.mName+' was successfully frenzied', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL === 2 && rndval < 66 ) {
			monster.SetState('frenzied');
			monster.SetTrait('frenzied');
			GAME.Notifications.Post(monster.mName+' was successfully frenzied', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL === 3 && rndval < 33 ) {
			monster.SetState('frenzied');
			monster.SetTrait('frenzied');
			GAME.Notifications.Post(monster.mName+' was successfully frenzied', 'good');
			monster.AddEffect( $.extend( {}, GAME.effects['icehalo'] ) );
		} else if ( monster.mLVL > 3 ) {
			monster.SetState('angered');
			GAME.Notifications.Post('Lvl '+monster.mLVL+' creatures are immune to Frenzy magic! Spell wasted.', 'bad');
		} else {
			monster.SetState('angered');
			GAME.Notifications.Post('Failed to frenzy '+monster.mName, 'bad');
		}
	}
};
