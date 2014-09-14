
GAME.CreateEffects = function() {

    this.ranged_effects['bone_arrow'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 0, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['dagger'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 72, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['spear'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 144, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['stone'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 216, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['stone_large'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 288, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['thorns'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 360, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['entangle'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 432, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['web'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 504, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['mud_globe'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 576, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['dark_missile'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 720, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['gaze'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 792, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['white_missile'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 864, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['ink'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 936, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['chakram'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 1008, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['water_spray'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('projectiles'), frames: [ { x: 0, y: 648, w: 72, h: 72, t: 650 } ]
    });


    this.ranged_effects['arrows_1'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('arrows'), frames: [ { x: 0, y: 0, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['arrows_2'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('arrows'), frames: [ { x: 0, y: 72, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['arrows_3'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0, rot_angle: Math.PI/2,
        source_image: GAME.Images.Get('arrows'), frames: [ { x: 0, y: 216, w: 72, h: 72, t: 650 } ]
    });

    this.ranged_effects['hatchet'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0,
        source_image: GAME.Images.Get('hatchet'),
            frames: [
                { x: 0, y:   0, w: 72, h: 72, t: 100 },
                { x: 0, y:  72, w: 72, h: 72, t: 100 },
                { x: 0, y: 144, w: 72, h: 72, t: 100 },
                { x: 0, y: 216, w: 72, h: 72, t: 100 },
                { x: 0, y: 288, w: 72, h: 72, t: 100 },
                { x: 0, y: 360, w: 72, h: 72, t: 100 },
                { x: 0, y: 432, w: 72, h: 72, t: 100 },
                { x: 0, y: 504, w: 72, h: 72, t: 100 },
                { x: 0, y: 576, w: 72, h: 72, t: 100 },
                { x: 0, y: 648, w: 72, h: 72, t: 100 }
            ]
    });

    this.ranged_effects['battleaxe'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0,
        source_image: GAME.Images.Get('battleaxe'),
            frames: [
                { x: 0, y:   0, w: 72, h: 72, t: 150 },
                { x: 0, y:  72, w: 72, h: 72, t: 150 },
                { x: 0, y: 144, w: 72, h: 72, t: 150 },
                { x: 0, y: 216, w: 72, h: 72, t: 150 },
                { x: 0, y: 288, w: 72, h: 72, t: 150 },
                { x: 0, y: 360, w: 72, h: 72, t: 150 }
            ]
    });

    this.ranged_effects['icemissile'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0,
        source_image: GAME.Images.Get('icemissile'),
            frames: [
                { x: 0, y:   0, w: 72, h: 72, t: 300 },
                { x: 0, y:  72, w: 72, h: 72, t: 250 },
                { x: 0, y: 144, w: 72, h: 72, t: 200 },
                { x: 0, y: 216, w: 72, h: 72, t: 60 },
                { x: 0, y: 288, w: 72, h: 72, t: 60 },
                { x: 0, y: 360, w: 72, h: 72, t: 60 },
                { x: 0, y: 432, w: 72, h: 72, t: 60 }
            ]
    });

    this.flags['owned'] = new WS.Animation({ source_image: GAME.Images.Get('flags'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y:   0, w: 72, h: 72, t: 200 },
            { x: 0, y:  72, w: 72, h: 72, t: 200 },
            { x: 0, y: 144, w: 72, h: 72, t: 200 },
            { x: 0, y: 216, w: 72, h: 72, t: 200 }
        ]
    });

    this.flags['notowned'] = new WS.Animation({ source_image: GAME.Images.Get('flags'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y: 288, w: 72, h: 72, t: 200 },
            { x: 0, y: 360, w: 72, h: 72, t: 200 },
            { x: 0, y: 432, w: 72, h: 72, t: 200 },
            { x: 0, y: 504, w: 72, h: 72, t: 200 }
        ]
    });

    this.effects['levelup'] = new WS.Animation({ source_image: GAME.Images.Get('halo'),
		speed: GAME.data['animation_speed'],
        offset_x: -2,
        offset_y: -125,
        frames: [
            { x: 0, y:    0, w: 125, h: 390, t: 60 },
            { x: 0, y:  390, w: 125, h: 390, t: 60 },
            { x: 0, y:  780, w: 125, h: 390, t: 60 },
            { x: 0, y: 1170, w: 125, h: 390, t: 60 },
            { x: 0, y: 1560, w: 125, h: 390, t: 60 },
            { x: 0, y: 1950, w: 125, h: 390, t: 60 },
            { x: 0, y: 2340, w: 125, h: 390, t: 60 }
        ]
    });

    this.effects['firewheel'] = new WS.Animation({ source_image: GAME.Images.Get('firewheel'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y:   0, w: 72, h: 72, t: 100 },
            { x: 0, y:  72, w: 72, h: 72, t: 100 },
            { x: 0, y: 144, w: 72, h: 72, t: 100 },
            { x: 0, y: 216, w: 72, h: 72, t: 100 },
            { x: 0, y: 288, w: 72, h: 72, t: 100 },
            { x: 0, y: 360, w: 72, h: 72, t: 100 },
            { x: 0, y:   0, w: 72, h: 72, t: 100 },
            { x: 0, y:  72, w: 72, h: 72, t: 100 }
		]
	});

    this.effects['water'] = new WS.Animation({ source_image: GAME.Images.Get('water'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y: 432, w: 72, h: 72, t: 100 },
            { x: 0, y: 360, w: 72, h: 72, t: 100 },
            { x: 0, y: 288, w: 72, h: 72, t: 100 },
            { x: 0, y: 216, w: 72, h: 72, t: 100 },
            { x: 0, y: 144, w: 72, h: 72, t: 100 },
            { x: 0, y:  72, w: 72, h: 72, t: 100 },
            { x: 0, y:   0, w: 72, h: 72, t: 100 }
		]
	});

    this.effects['darkmagic'] = new WS.Animation({ source_image: GAME.Images.Get('darkmagic'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y:   0, w: 72, h: 72, t: 100 },
            { x: 0, y:  72, w: 72, h: 72, t: 100 },
            { x: 0, y: 144, w: 72, h: 72, t: 100 },
            { x: 0, y: 216, w: 72, h: 72, t: 100 },
            { x: 0, y: 288, w: 72, h: 72, t: 100 },
            { x: 0, y: 360, w: 72, h: 72, t: 100 }
		]
	});

    this.effects['blackmagic'] = new WS.Animation({ source_image: GAME.Images.Get('blackmagic'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y:   0, w: 100, h: 100, t: 100 },
            { x: 0, y: 100, w: 100, h: 100, t: 100 },
            { x: 0, y: 200, w: 100, h: 100, t: 100 },
            { x: 0, y: 300, w: 100, h: 100, t: 100 },
            { x: 0, y: 400, w: 100, h: 100, t: 100 }
		]
	});

    this.effects['magicshield'] = new WS.Animation({ source_image: GAME.Images.Get('magicshield'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y:   0, w: 160, h: 160, t: 250 },
            { x: 0, y: 160, w: 160, h: 160, t: 250 },
            { x: 0, y: 320, w: 160, h: 160, t: 250 },
            { x: 0, y: 480, w: 160, h: 160, t: 250 },
            { x: 0, y: 640, w: 160, h: 160, t: 250 }
		]
	});

    this.effects['icehalo'] = new WS.Animation({ source_image: GAME.Images.Get('magichalo'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y:   0, w: 65, h: 65, t: 200 },
            { x: 0, y:  65, w: 65, h: 65, t: 200 },
            { x: 0, y: 130, w: 65, h: 65, t: 200 },
            { x: 0, y: 195, w: 65, h: 65, t: 200 },
            { x: 0, y: 260, w: 65, h: 65, t: 200 }
		]
	});

    this.effects['magichalo'] = new WS.Animation({ source_image: GAME.Images.Get('magichalo'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y: 325, w: 50, h: 50, t: 200 },
            { x: 0, y: 375, w: 50, h: 50, t: 200 },
            { x: 0, y: 425, w: 50, h: 50, t: 200 },
            { x: 0, y: 475, w: 50, h: 50, t: 200 },
            { x: 0, y: 525, w: 50, h: 50, t: 200 }
		]
	});

    this.effects['sandstorm'] = new WS.Animation({ source_image: GAME.Images.Get('sandstorm'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y:   0, w: 72, h: 72, t: 60 },
            { x: 0, y:  72, w: 72, h: 72, t: 60 },
            { x: 0, y: 144, w: 72, h: 72, t: 60 },
            { x: 0, y: 216, w: 72, h: 72, t: 60 },
            { x: 0, y: 288, w: 72, h: 72, t: 60 },
            { x: 0, y: 360, w: 72, h: 72, t: 60 },
            { x: 0, y: 432, w: 72, h: 72, t: 60 },
            { x: 0, y: 504, w: 72, h: 72, t: 60 }
        ]
    });

    this.effects['healing'] = new WS.Animation({ source_image: GAME.Images.Get('healing'),
		speed: GAME.data['animation_speed'],
        offset_x: 0, offset_y: 0,
        frames: [
            { x: 0, y:   0, w: 72, h: 72, t: 60 },
            { x: 0, y:  72, w: 72, h: 72, t: 60 },
            { x: 0, y: 144, w: 72, h: 72, t: 60 },
            { x: 0, y: 216, w: 72, h: 72, t: 60 },
            { x: 0, y: 288, w: 72, h: 72, t: 60 },
            { x: 0, y: 360, w: 72, h: 72, t: 60 },
            { x: 0, y: 432, w: 72, h: 72, t: 60 },
            { x: 0, y: 504, w: 72, h: 72, t: 60 }
        ]
    });

    this.ranged_effects['fireblast'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0,
        source_image: GAME.Images.Get('fireblast'), rot_angle: Math.PI/2.0,
        frames: [
            { x: 0, y:   0, w: 100, h: 100, t: 250 },
            { x: 0, y: 100, w: 100, h: 100, t: 200 },
            { x: 0, y: 200, w: 100, h: 100, t: 250 },

            { x: 0, y: 300, w: 100, h: 150, t: 30 },
            { x: 0, y: 450, w: 100, h: 150, t: 30 },
            { x: 0, y: 600, w: 100, h: 150, t: 30 },

            { x: 0, y: 750, w: 100, h: 150, t: 30 },
            { x: 0, y: 900, w: 100, h: 150, t: 30 },
            { x: 0, y: 1050, w: 100, h: 150, t: 30 }
        ]
    });

    this.ranged_effects['muzzle_1'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0,
        source_image: GAME.Images.Get('muzzle'), rot_angle: Math.PI/2.0,
        frames: [
            { x: 0, y:   0, w: 100, h: 150, t: 80 },
            { x: 0, y: 150, w: 100, h: 150, t: 95 },
            { x: 0, y: 300, w: 100, h: 150, t: 110 },
            { x: 0, y: 450, w: 71, h: 71, t: 500 }
        ]
    });

    this.ranged_effects['muzzle_2'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0,
        source_image: GAME.Images.Get('muzzle'), rot_angle: Math.PI/2.0,
        frames: [
            { x: 0, y:   0, w: 100, h: 150, t: 80 },
            { x: 0, y: 150, w: 100, h: 150, t: 95 },
            { x: 0, y: 300, w: 100, h: 150, t: 110 },
            { x: 0, y: 522, w: 71, h: 71, t: 500 }
        ]
    });

    this.ranged_effects['lightning'] = new WS.RangedEffect({
		speed: GAME.data['animation_speed'],
        canvas: GAME.layer_control.GetCanvas('monsters'), start_x: 0, start_y: 0, stop_x: 0, stop_y: 0,
        source_image: GAME.Images.Get('lightning'), rot_angle: -Math.PI/2.0,
        frames: [
            { x: 0, y:   0, w: 84, h: 200, t: 200 },
            { x: 0, y: 200, w: 84, h: 200, t: 200 },
        ]
    });

};
