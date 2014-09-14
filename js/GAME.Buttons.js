
GAME.Buttons = GAME.Buttons || {
	mIDs : { 'help': 'gm_button_help', 'config': 'gm_button_config', 'quests': 'gm_button_quests', 
		'special_A': 'gm_special_a', 'spell_container': 'gm_spells_container' },
	mSpells: { 
		'fly'		: ['Fly',		'gm_spell_fly', 	'Fairy Fly', 		'instant', 8 ], // potion blue
		'mirror'	: ['Mirror',	'gm_spell_mirror', 	'Mirror Image', 	'instant', 12 ], // potion green
		'tornado'	: ['Tornado',	'gm_spell_tornado', 'Powerful Tornado',	'instant', 10 ], // scroll cyan
		'shadows'	: ['Shadows',	'gm_spell_shadows', 'Hide In Shadows',	'instant', 6 ], // potion gray

		'sleep'		: ['Sleep',		'gm_spell_sleep', 	'Sleep',			'monster', 5 ], // scroll purple
		'charm'		: ['Charm',		'gm_spell_charm', 	'Charm Monster',	'monster', 10 ], // scroll yellow
		'frenzy'	: ['Frenzy',	'gm_spell_frenzy', 	'Frenzy Monster', 	'monster', 7 ], // scroll black
		'heal'		: ['Heal',		'gm_spell_heal', 	'Heal', 			'monster', 6 ], // potion holy
		'entangle'	: ['Entangle',	'gm_spell_entangle', 'Entangle', 		'monster', 3 ], // scroll orange

		'meteor'	: ['Meteor',	'gm_spell_meteor', 	'Meteor',				'tile', 10 ], // scroll red
		'rain'		: ['Rain',		'gm_spell_rain', 	'Tropical Rainstorm',	'tile', 8 ], // scroll blue 
		'forest'	: ['Forest',	'gm_spell_forest', 	'Grow Forest',			'tile', 6 ]  // scroll green

	}
};

GAME.Buttons.Create = function() {	

	var player_turn_indicator = $('<div id="turn_indicator_player" class="turn_indicators">Current Turn: Player</div>').css({
		'position': 'fixed',
		'top': '235px',
		'left': '43px',
		'width': '150px',
		'text-align': 'center',
		'border': '1px solid #999',
		'background-color': '#090',
		'color': '#FFF',
		'z-index': 6,
		'display': 'none',
		'cursor': 'pointer'
	});

	var friends_turn_indicator = $('<div id="turn_indicator_friends" class="turn_indicators">Current Turn: Friendly Units</div>').css({
		'position': 'fixed',
		'top': '235px',
		'left': '43px',
		'width': '150px',
		'text-align': 'center',
		'border': '1px solid #999',
		'background-color': '#009',
		'color': '#FFF',
		'z-index': 6,
		'display': 'none'
	});

	var enemies_turn_indicator = $('<div id="turn_indicator_enemies" class="turn_indicators">Current Turn: Enemy Units</div>').css({
		'position': 'fixed',
		'top': '235px',
		'left': '43px',
		'width': '150px',
		'text-align': 'center',
		'border': '1px solid #999',
		'background-color': '#900',
		'color': '#FFF',
		'z-index': 6,
		'display': 'none'
	});

	$('body').append( player_turn_indicator );
	$('body').append( friends_turn_indicator );
	$('body').append( enemies_turn_indicator );


	$('#turn_indicator_player').click( function() {
		if ( GAME.mDisableControls === false ) {
			GAME.Notifications.Post('Skipping Turn');
			amplify.publish('TURN_ENEMY_START');
		}
	});

	var	button = '<div id="' + this.mIDs['special_A'] + '" class="gm_special_abilities">Time</div>';
	var special_A = $(button).css({
		'position': 'fixed',
		'top': 305,
		'right': 92,
		'width': 60,
		'height': 60,
		'text-align': 'center',
		'border': '1px solid #F90',

		'font-size': '13px',
		'line-height': '60px',
		'vertical-align': 'bottom',
		'font-weight': 'bold',
		'color': '#FFF',

		'font-family': 'monospace',
		'text-shadow': '1px 1px #000',
		'z-index': 10,
		'display': 'none',
		'background-image': 'url(img/weapons.png)',
		'background-position': '0px -1320px',
        'box-shadow': '4px 4px 2px #333', 'cursor': 'pointer'
	});
	$('body').append( special_A );

	// SPELLS:
	var spell_container = '<div id="gm_spells_container"></div>';
	$('body').append( spell_container );
	for ( var i in this.mSpells ) {
		var	spell_button = '<div class="'+this.mSpells[i][1]+' gm_spells" data-spell="'+i+'">'+this.mSpells[i][0]+'</div>';
		$('#gm_spells_container').append( spell_button );
		$('.'+this.mSpells[i][1]).click(function() {
			if ( GAME.mSpellCountDown > 0) { 
				GAME.Notifications.Post('Too tired to cast another spell..');
				return; 
			}
			if ( GAME.mDisableControls === true || GAME.mTimeStop !== 0 ) { return; }

			if ( GAME.player.mMagic[ $(this).data('spell') ] > 0 ) {
				GAME.player.mMagic[ $(this).data('spell') ] -= 1;
			}
			GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
			GAME.mSpellCountDown = 7;
			$('.gm_spells').addClass('desaturate');
			//GAME.Notifications.Post( 'Cast spell: '+GAME.Buttons.mSpells[ $(this).data('spell') ][2], 'good' );
			//GAME.Display.MakeTerrainHint(3.2);
			amplify.publish( 'SPELL_CAST', $(this).data('spell') );
		});
	}

		button = '<div id="' + this.mIDs['help'] + '" class="gm_service_buttons">Help</div>';
	var help = $(button).css({
		'position': 'fixed',
		'top': 235,
		'right': 172,
		'width': 60,
		'height': 60,
		'text-align': 'center',
		'font-size': '13px',
		'line-height': '60px',
		'vertical-align': 'bottom',
		'font-weight': 'bold',
		'color': '#FFF',
		'border': '1px solid #F90',
		'font-family': 'monospace',
		'text-shadow': '1px 1px #000',
		'z-index': 6,
		'display': 'none',
		'background-image': 'url(img/weapons.png)',
		'background-position': '-120px -1320px',
        'box-shadow': '4px 4px 2px #333', 'cursor': 'pointer'
	});
	$('body').append( help );

	button = '<div id="' + this.mIDs['config'] + '" class="gm_service_buttons">Options</div>';
	var config = $(button).css({
		'position': 'fixed',
		'top': 235,
		'right': 92,
		'width': 60,
		'height': 60,
		'text-align': 'center',
		'font-size': '13px',
		'line-height': '60px',
		'vertical-align': 'bottom',
		'font-weight': 'bold',
		'color': '#FFF',
		'border': '1px solid #F90',
		'font-family': 'monospace',
		'text-shadow': '1px 1px #000',
		'z-index': 6,
		'display': 'none',
		'background-image': 'url(img/weapons.png)',
		'background-position': '-60px -1320px',
        'box-shadow': '4px 4px 2px #333', 'cursor': 'pointer'
	});
	$('body').append( config );

	button = '<div id="' + this.mIDs['quests'] + '" class="gm_service_buttons">Quests</div>';
	var quests = $(button).css({
		'position': 'fixed',
		'top': 235,
		'right': 10,
		'width': 60,
		'height': 60,
		'text-align': 'center',
		'font-size': '13px',
		'line-height': '60px',
		'vertical-align': 'bottom',
		'font-weight': 'bold',
		'color': '#FFF',
		'border': '1px solid #F90',
		'font-family': 'monospace',
		'text-shadow': '1px 1px #000',
		'z-index': 6,
		'display': 'none',
		'background-image': 'url(img/weapons.png)',
		'background-position': '-120px -720px',
        'box-shadow': '4px 4px 2px #333', 'cursor': 'pointer'
	});
	$('body').append( quests );

	$('#'+this.mIDs['help']).click(function() {
		GAME.Dialogs.DisplayHelpDialog();
	});
	$('#'+this.mIDs['config']).click(function() {
		GAME.Dialogs.DisplayConfigDialog();
	});
	$('#'+this.mIDs['quests']).click(function() {
		GAME.Dialogs.DisplayQuestsDialog();
	});

	$('.gm_special_abilities').hover(
		function() {
			$(this).css({ 
				'border': '1px solid #F00',
        		'box-shadow': '7px 7px 4px #333'
			});
		},
		function() {
			$(this).css({ 
				'border': '1px solid #F90',
        		'box-shadow': '4px 4px 2px #333'
			});
		}
	);
	$('.gm_spells').hover(
		function() {
			$(this).css({ 
				'border': '1px solid #F00',
        		'box-shadow': '7px 7px 4px #333'
			});
		},
		function() {
			$(this).css({ 
				'border': '1px solid #F0F',
        		'box-shadow': '4px 4px 2px #333'
			});
		}
	);


	$('.gm_service_buttons').hover(
		function() {
			$(this).css({ 
				'border': '1px solid #F00',
        		'box-shadow': '7px 7px 4px #333'
			});
		},
		function() {
			$(this).css({ 
				'border': '1px solid #F90',
        		'box-shadow': '4px 4px 2px #333'
			});
		});

	$('#'+this.mIDs['special_A']).click(function() {
		if ( GAME.mSpecialCountDown > 0 ) { 
			GAME.Notifications.Post('Special Ability will be recovered in ' + GAME.mSpecialCountDown + ' turn(s)', 'bad');
			return; 
		}
		GAME.mTimeStop = 3;
		GAME.mSpecialCountDown = 10;
		$(this).addClass('desaturate');
		GAME.Notifications.Post('Special Ability: time is stopped for 3 turns', 'good');
	    GAME.Display.RenderLand();
	    GAME.Display.RenderObjects();
	});

	$('#'+this.mIDs['special_B']).click(function() {
		alert('special B');
	});

};

GAME.Buttons.SpecialEnable = function() {
	$('#'+this.mIDs['special_A']).removeClass('desaturate');
};

GAME.Buttons.SpecialDisable = function() {
	$('#'+this.mIDs['special_A']).addClass('desaturate');
};

GAME.Buttons.Toggle = function() {
	if ( $('#gm_spells_container:visible').length > 0 ) {
		this.Hide();
	} else {
		this.Show();
	}
};

GAME.Buttons.Hide = function() {
	for ( var i in this.mIDs ) {
		$('#'+this.mIDs[i]).hide(0);
	}
};

GAME.Buttons.Show = function() {
	// check spells before showing:
	var gpm = GAME.player.mMagic;
	$('.spell_counter').remove();
	for ( var i in gpm ) {
		if ( gpm[i] !== 0 ) {
			if ( gpm[i] > 0 ) {
				$('#gm_spells_container .'+this.mSpells[i][1]).append('<div class="spell_counter" style="position: relative; bottom: 0px; right: 0px; color: yellow;">'+gpm[i]+'</div>');
			}
			$('#gm_spells_container .'+this.mSpells[i][1]).show(0);
		} else {
			$('#gm_spells_container .'+this.mSpells[i][1]).hide(0);
		}
	}

	for ( var i in this.mIDs ) {
		$('#'+this.mIDs[i]).show(0);
	}
};


