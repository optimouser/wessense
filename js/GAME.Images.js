
GAME.Images = GAME.Images || { REVISION: '1', mImg: {} };

GAME.Images.Preload = function() {
   var imgs = [], img, srcs = GAME.Images.list;
   var remaining = srcs.length;
   for (var i = 0, len = srcs.length; i < len; i++) {
       this.mImg[ srcs[i][0] ] = new Image();
       imgs.push( this.mImg[ srcs[i][0] ] );
       this.mImg[ srcs[i][0] ].onload = function() {
           --remaining;
           amplify.publish('IMAGES_PRELOADED_PROGRESS', ( ( srcs.length - remaining ) / srcs.length * 100.0 ) );
           if (remaining === 0) {
               amplify.publish('IMAGES_PRELOADED');
           }
       };
       this.mImg[ srcs[i][0] ].src = srcs[i][1];
   }
};

GAME.Images.Get = function(name) {
	return this.mImg[name];
};

GAME.Images.list = [
        ['halo',		'img/effects/halo.png'		],
        ['healing',		'img/effects/healing.png'	],
        ['firewheel',	'img/effects/firewheel.png'	],
        ['darkmagic',	'img/effects/darkmagic.png'	],
        ['blackmagic',	'img/effects/blackmagic.png'],
        ['sandstorm',	'img/effects/sandstorm.png'	],
        ['magicshield',	'img/effects/magicshield.png'],
        ['magichalo',	'img/effects/magichalo.png'],
        ['boom',		'img/effects/boom.png'],
        ['tornado-ring','img/effects/tornado-ring.png'],
        ['small-lightning','img/effects/small-lightning.png'],

        ['arrows',		'img/ranged_effects/arrows.png'		],
        ['battleaxe',	'img/ranged_effects/battleaxe.png' 	],
        ['fireblast',	'img/ranged_effects/fireblast.png' 	],
        ['hatchet',		'img/ranged_effects/hatchet.png' 	],
        ['icemissile',	'img/ranged_effects/icemissile.png'	],
        ['lightning',	'img/ranged_effects/lightning.png' 	],
        ['muzzle',		'img/ranged_effects/muzzle.png'		],
        ['projectiles',	'img/ranged_effects/projectiles.png'],
        ['water',		'img/ranged_effects/water.png'		],

        ['castle',		'img/castle.png'	],

        ['flags',		'img/flags.png'		],
        ['daynight',	'img/daynight.png'	],
        ['clouds',		'img/clouds.png'	],
        ['tilesets',	'img/tilesets.png'	],
        ['heroes',		'img/heroes.png'	],
        ['enemies',		'img/enemies.png'	],
        ['neutrals',	'img/neutrals.png'	],
        ['monsters',	'img/monsters.png'	],
        ['weapons',		'img/weapons.png'	],
        ['marker',		'img/flag-red.png'	],
        ['foot',		'img/foot.png'		],
		['splash_screen', 'img/splash.png'  ],

        ['role_1_0',	'img/portraits/role_1_0.gif'	],
        ['role_1_1',	'img/portraits/role_1_1.gif'	],
        ['role_2_0',	'img/portraits/role_2_0.gif'	],
        ['role_2_1',	'img/portraits/role_2_1.gif'	],
        ['role_3_0',	'img/portraits/role_3_0.gif'	],
        ['role_3_1',	'img/portraits/role_3_1.gif'	],
        ['role_4_0',	'img/portraits/role_4_0.gif'	],
        ['role_4_1',	'img/portraits/role_4_1.gif'	],

		['portrait_messenger', 		'img/portraits/portrait_messenger.gif'		],
		['portrait_elven_queen', 	'img/portraits/portrait_elven_queen.gif'	],
		['portrait_dwarven_king', 	'img/portraits/portrait_dwarven_king.gif'	],
		['portrait_human_general', 	'img/portraits/portrait_human_general.gif'	],
		['portrait_healer', 		'img/portraits/portrait_healer.gif'			],
		['portrait_thiefleader', 	'img/portraits/portrait_thiefleader.gif'	],
		['portrait_silver_mage', 	'img/portraits/portrait_silver_mage.gif'	],
		['portrait_elven_princess', 'img/portraits/portrait_elven_princess.gif'	],
		['portrait_elder_mage', 	'img/portraits/portrait_elder_mage.gif'		],
		['portrait_lich', 			'img/portraits/portrait_lich.gif'			],
		['portrait_necromancer', 	'img/portraits/portrait_necromancer.gif'	],
		['portrait_orc_boss', 		'img/portraits/portrait_orc_boss.gif'		],

		['portrait_shop_magic', 	'img/portraits/portrait_shop_magic.gif'		],
		['portrait_shop_weapons', 	'img/portraits/portrait_shop_weapons.gif'	],

		['gameover_bad', 'img/gameover_bad.jpg' ],
		['gameover_good', 'img/gameover_good.jpg' ],

		['markers', 'img/markers.png' ],
		['wesnoth_map', 'img/map.png' ],
		['dialog_background', 'img/background.png' ],
		['cursor_attack',	'img/cursors/attack.png'	],
		['cursor_attack_drag','img/cursors/attack_drag.png'	],
		['cursor_move',		'img/cursors/move.png'		],
		['cursor_move_drag','img/cursors/move_drag.png'		],
		['cursor_normal',	'img/cursors/normal.png'	],
		['cursor_wait',		'img/cursors/wait.png'		],
		['cursor_select',	'img/cursors/select.png'	],
		['cursor_select_location',	'img/cursors/select-location.png'	],
		['cursor_select_illegal',	'img/cursors/select-illegal.png'	]
	];
