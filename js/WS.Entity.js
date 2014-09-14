
WS.Entity = function( opt ) {
    if ( opt === undefined ) { throw 'Cannot create WS.Entity, constructor parameters missing'; }

  WS.Sprite.call( this, opt );

  this.mGameX = ( opt.game_x !== undefined ) ? opt.game_x : 0;
  this.mGameY = ( opt.game_y !== undefined ) ? opt.game_y : 0;

  this.mPassableTiles   = ( opt.passable_tiles   !== undefined ) ? opt.passable_tiles   : [];
  this.mPassableObjects = ( opt.passable_objects !== undefined ) ? opt.passable_objects : [];

  this.mCash  = ( opt.cash  !== undefined ) ? opt.cash : 0;
  this.mSpeed = ( opt.speed !== undefined ) ? opt.speed : 1.0;

  this.mLVL = ( opt.lvl !== undefined ) ? opt.lvl : 1;
  this.mEXP = ( opt.exp !== undefined ) ? opt.exp : 0;
  this.mKEXP = ( opt.kill_exp !== undefined ) ? opt.kill_exp : 0;
  this.mHP  = ( opt.hp  !== undefined ) ? opt.hp : [0,0]; // [current,max]
  this.mHTH = ( opt.hth !== undefined ) ? opt.hth : 0;
  this.mRNG = ( opt.rng !== undefined ) ? opt.rng : 0;
  this.mDEF = ( opt.def !== undefined ) ? opt.def : 0;
  this.mNHTH = ( opt.n_hth !== undefined ) ? opt.n_hth : 0;
  this.mNRNG = ( opt.n_rng !== undefined ) ? opt.n_rng : 0;
  this.mArmorPiercing = ( opt.armor_piercing !== undefined ) ? opt.armor_piercing : false;
  this.mPoisonAttack = ( opt.poison !== undefined ) ? opt.poison : false;
  this.mEntangleAttack = ( opt.entangle !== undefined ) ? opt.entangle : false;

  this.mBonusDrop = ( opt.bonus_drop !== undefined ) ? opt.bonus_drop : undefined;
  this.mRngRange  = ( opt.rng_range !== undefined ) ? opt.rng_range : 0;
  this.mRngEffect = ( opt.rng_effect !== undefined ) ? opt.rng_effect : undefined;
  this.mRegeneration  = ( opt.regeneration !== undefined ) ? opt.regeneration : undefined;

  this.mIsUndead    = ( opt.is_undead !== undefined ) ? opt.is_undead : false;
  this.mIsOrc     = ( opt.is_orc !== undefined ) ? opt.is_orc : false;
  this.mIsMagicUser   = ( opt.is_magicuser !== undefined ) ? opt.is_magicuser : false;
  this.mIsBoss    = ( opt.is_boss !== undefined ) ? opt.is_boss : false;

  this.mIsCharmed   = false;
  this.mIsFlying    = false;
  this.mIsHidden    = false;
  this.mIsPoisoned  = false;
  this.mIsBleeding  = false;
  this.mIsSleeping  = false;
  this.mIsEntangled   = false;
  this.mIsFrenzied  = false;

  this.mMagic = {
    fly:    0,
    mirror:   0,
    shadows:  0,
    tornado:  0,

    sleep:    0,
    charm:    0,
    frenzy:   0,
    heal:   0,
    entangle: 0,

    meteor:   0,
    rain:     0,
    forest:   0
  };

  this.mSense = ( opt.sense !== undefined ) ? opt.sense : 0;
  this.mState = ( opt.state !== undefined ) ? opt.state : 'neutral';
};


WS.Entity.prototype = Object.create( WS.Sprite.prototype );

WS.Entity.prototype.TurnPassed = function() {
  if ( this.mIsBleeding === true ) {
    if ( this.mHP[0] > 3 && $.gmRndInt(0,100) < 33 ) {
      this.mHP[0] -= 1;
      GAME.AddTextAnimation('-1 HP', this.mGameX, this.mGameY, '#E00');
      if ( this.mType === 'player' ) {
        this.UpdateOverlay();
        GAME.Notifications.Post('You are loosing health due to bleeding', 'bad');
      }
    } else if ( $.gmRndInt(0,100) > 98 ) {
      this.mIsBleeding = false;
      if ( this.mType === 'player' ) {
        GAME.Notifications.Post('You are no longer bleeding', 'good');
      }
    }
  }
  if ( this.mIsPoisoned === true ) {
    if ( this.mHP[0] > 2 && $.gmRndInt(0,100) < 33 ) {
      this.mHP[0] -= 2;
      GAME.AddTextAnimation('-2 HP', this.mGameX, this.mGameY, '#0E0');
      if ( this.mType === 'player' ) {
        this.UpdateOverlay();
        GAME.Notifications.Post('You are loosing health due to poisoning', 'bad');
      }
    } else if ( $.gmRndInt(0,100) > 97 ) {
      this.mIsPoisoned = false;
      if ( this.mType === 'player' ) {
        GAME.Notifications.Post('You are no longer poisoned', 'good');
      }
    }
  }
};

WS.Entity.prototype.IsOffScreen = function() {
    var pc = GAME.player.GetGameXY();
    var c = this.GetGameXY();
    if ( Math.abs(c.x - pc.x) >= GAME.Display.mTileSize.hw || Math.abs(c.y - pc.y) >= GAME.Display.mTileSize.hh ) { return true; }
  return false;
};

WS.Entity.prototype.SetTrait = function( trait, flag ) {
  if ( flag === undefined || flag === true ) {
    switch( trait ) {
      case 'charmed':
        this.mIsCharmed   = true;
        this.mIsSleeping  = false;
        this.mIsHidden    = false;
        this.mIsEntangled   = false;
        this.mIsFrenzied  = false;
        break;
      case 'flying':
        this.mIsFlying    = true;
        break;
      case 'hidden':
        this.mIsHidden    = true;
        break;
      case 'poisoned':
        this.mIsPoisoned  = true;
        this.mIsSleeping  = false;
        this.mIsHidden    = false;
        break;
      case 'bleeding':
        this.mIsBleeding  = true;
        this.mIsSleeping  = false;
        this.mHidden    = false;
        break;
      case 'sleeping':
        this.mIsSleeping  = true;
        this.mIsEntangled   = false;
        this.mIsHidden    = false;
        this.mIsCharmed   = false;
        this.mIsFrenzied  = false;
        break;
      case 'entangled':
        this.mIsEntangled   = true;
        this.mIsHidden    = false;
        this.mIsCharmed   = false;
        this.mIsSleeping  = false;
        break;
      default:
        break;
    }
  } else {
    switch( trait ) {
      case 'charmed':
        this.mIsCharmed   = false;
        break;
      case 'flying':
        this.mIsFlying    = false;
        break;
      case 'hidden':
        this.mIsHidden    = false;
        break;
      case 'poisoned':
        this.mIsPoisoned  = true;
        break;
      case 'bleeding':
        this.mIsBleeding  = true;
        break;
      case 'sleeping':
        this.mIsSleeping  = true;
        break;
      case 'entangled':
        this.mIsEntangled   = true;
        break;
      default:
        break;
    }
  }
};

WS.Entity.prototype.IsTilePassable = function( tile_name ) {
  return ( this.mPassableTiles.inArray( tile_name ) );
};

WS.Entity.prototype.IsObjectPassable = function( object_name ) {
  return ( object_name === 'blood' || object_name.startsWith('deco_') || object_name.startsWith('bonus_')
     || object_name.startsWith('house_') || object_name === 'castle_b' || object_name === 'castle_c' || this.mPassableObjects.inArray( object_name ) );
};

WS.Entity.prototype.SetNAttacks = function( n_hth, n_rng ) {
  this.mNHTH = n_hth;
  this.mNRNG = n_rng;
};

WS.Entity.prototype.GetNAttacks = function() {
  return ( { 'n_hth': this.mNHTH, 'n_rng': this.mNRNG } );
};

WS.Entity.prototype.GetState = function() {
  return this.mState;
};

WS.Entity.prototype.SetState = function( state ) {
  if ( this.mType === 'player' ) { return; }
  this.mState = state;
    switch( state ) {
        case 'friendly':
            this.mTagColor = '#9F9';
      this.mIsFrenzied = false;
            break;
        case 'aggressive':
            this.mTagColor = '#F88';
      this.mIsFrenzied = false;
      this.mIsCharmed = false;
            break;
        case 'sleeping':
            this.mTagColor = '#55F';
      this.mIsFrenzied = false;
      this.mIsCharmed = false;
            break;
        case 'frenzied':
            this.mTagColor = '#FA0';
      this.mIsFrenzied = true;
      this.mIsCharmed = false;
            break;
        case 'angered':
            this.mTagColor = '#F55';
      this.mIsFrenzied = false;
      this.mIsCharmed = false;
            break;
        case 'neutral':
        case 'default':
            this.mTagColor = '#CCC';
            break;
    }
};

WS.Entity.prototype.GetLvlExp = function( lvl ) {
//    return 25 * ( 3 * ( lvl + 1 ) + 2 ) * lvl; // F3 formula
    return 25 * ( 3 * lvl + 2 ) * lvl;
};

WS.Entity.prototype.GetXP = function( exp ) {
  this.mEXP += exp;
  if ( this.mType === 'player' ) {
    this.CheckLevelUp();
    this.UpdateOverlay();
  }
};

WS.Entity.prototype.RenderInfo = function() {
  this.RenderI( this.mHP[0] / this.mHP[1], this.mLVL );
};

WS.Entity.prototype.SetGameXY = function( x, y ) {
    this.mGameX = ( x !== undefined ) ? x : 0;
    this.mGameY = ( y !== undefined ) ? y : 0;
};

WS.Entity.prototype.GetGameXY = function() {
  return ({ 'x': this.mGameX, 'y': this.mGameY });
};

WS.Entity.prototype.DistanceTo = function( entity ) {
  return Math.sqrt( Math.pow( this.mGameX - entity.mGameX, 2 ) + Math.pow( this.mGameY - entity.mGameY, 2 ) );
};

WS.Entity.prototype.DamageMod = function( entity, dmg ) {
  if ( this.mType === 'player' ) {
    switch ( GAME.data['role'] ) {
      case 'role_1_0':
        if ( entity.mIsMagicUser === true ) { dmg = dmg * 1.5; }
        if ( $.gmRndInt(1,5) === 1 ) { dmg *= 2; } // knight produces double damage in 1/5 attacks
        break;
      case 'role_1_1':
        if ( entity.mIsUndead === true ) { dmg = dmg * 1.5; }
        if ( $.gmRndInt(1,4) === 1 ) { dmg *= 2; } // mage produces double damage in 1/4 attacks
        break;
      case 'role_2_0':
        if ( entity.mIsUndead === true ) { dmg = dmg * 1.5; }
        if ( $.gmRndInt(1,20) === 1 ) { dmg = 10000; } // instant kill
        break;
      case 'role_2_1':
        if ( entity.mIsUndead === true ) { dmg = dmg * 1.5; }
        // elven swordsman = normal attacks
        if ( $.gmRndInt(1,2) === 1 ) { dmg *= 1.2; } // +20% damage in 50% of cases
        break;
      case 'role_3_0':
        // dwarven scout
        if ( entity.mIsOrc === true ) { dmg = dmg * 1.5; }
        if ( $.gmRndInt(1,7) === 1 ) { dmg *= 3; } // scout produces triple ranged damage in 1/7 attacks
        break;
      case 'role_3_1':
        if ( entity.mIsOrc === true ) { dmg = dmg * 1.5; }
        if ( $.gmRndInt(1,7) === 1 ) { dmg *= 4; } // scout produces quadruple ranged damage in 1/7 attacks
        break;
      case 'role_4_0':
        if ( entity.mIsMagicUser === true ) { dmg = dmg * 1.5; }
        if ( entity.mIsUndead === true ) { dmg = dmg * 1.5; }
        break;
      case 'role_4_1':
        if ( entity.mIsOrc === true ) { dmg = dmg * 1.5; }
        if ( $.gmRndInt(1,10) === 1 ) { dmg *= 2; }
        break;
      default:
        break;
    }
  }

  // don't mess with Undead at night, hehe
  var timeofday = GAME.mTime.GetTimeOfDay();
  switch ( timeofday ) {
    case 'night':
      if ( this.mIsUndead === true ) { dmg *= $.gmRnd( 1.0, 2.0 ); }
      if ( GAME.data['role'] === 'role_4_0' ) { dmg *= 1.2; }
      if ( GAME.data['role'].startsWith('role_1' ) ) { dmg *= 0.8; }
      break;
    case 'evening':
      if ( this.mIsUndead === true ) { dmg *= 1.33; }
      if ( this.mIsOrc  === true ) { dmg *= 1.10; }
      if ( GAME.data['role'] === 'role_4_0' ) { dmg *= 1.1; }
      break;
    case 'day':
      if ( this.mIsUndead === true ) { dmg *= 0.85; }
      if ( this.mIsOrc  === true ) { dmg *= 0.95; }
      break;
    case 'morning':
      if ( this.mIsUndead === true ) { dmg *= 0.95; }
      if ( this.mIsOrc  === true ) { dmg *= 1.10; }
      if ( GAME.data['role'] === 'role_4_0' ) { dmg *= 1.1; }
      break;
    default:
      break;
  }

  if ( this.mIsEntangled === true ) {
    dmg *= 0.5;
  }

  return parseInt(Math.round(dmg));
};

WS.Entity.prototype.GetDefSum = function( entity, x, y, abstract ) {
  if ( entity.mIsHidden === true ) { return 80; }

  x = ( x !== undefined ) ? x : entity.mGameX;
  y = ( y !== undefined ) ? y : entity.mGameY;
  abstract = ( abstract !== undefined ) ? abstract : false;

  var def = entity.mDEF; // base = natural armor
  // tile penalty
  var tile = GAME.Tiles.GetAtXY( x, y );
  def += GAME.Tiles.Get( tile ).penalty;
  var obj = GAME.Objects.GetTerrainAtXY( x, y );
  if ( entity.mType === 'player' || ( entity.monster_type !== undefined && entity.monster_type === 'clone') ) {
    var preset = GAME.PlayersControl.GetPreset( GAME.data['role'] );
    // individual tile_mod:
    if ( preset.tile_mod[ tile ] !== undefined ) { def += preset.tile_mod[ tile ]; }
    // individual obj_mod:
    if ( obj !== undefined && preset.obj_mod[ obj.t ] !== undefined ) { def += preset.obj_mod[ obj.t ]; }
    // max class def check
    if ( def > preset.max_def ) { def = preset.max_def; }
  } else {
    var m = GAME.Monsters.Get( entity.monster_type );
    // tile mod check:
    if ( m !== undefined ) {
      if ( m.tile_mod[ tile ] !== undefined ) { def += m.tile_mod[ tile ]; }
      //  obj mod check:
      if ( obj !== undefined && m.obj_mod[ obj.t] !== undefined ) { def +=  m.obj_mod[ obj.t]; }
    }
  }
  // armor piercing ability halves unit armor rating
  if ( abstract === false && def > 0 && this.mArmorPiercing !== undefined && this.mArmorPiercing === true ) {
    def *= 0.5;
  }

  if ( entity.mIsEntangled === true ) { def -= 50; } // entangled characters receive a penalty
  if ( entity.mIsSleeping  === true ) { def = -50; } // sleeping characters always receive full damage

  // final bounds check
  if ( def < -50 ) { def = -50; }
  if ( def > 100 ) { def =  95; }
  return def;
};

WS.Entity.prototype.DefenseMod = function( entity, dmg ) {
  dmg = dmg * ( 100.0 - this.GetDefSum(entity) ) / 100.0;
  if ( entity.mType === 'player' ) {
    switch ( GAME.data['role'] ) {
      case 'role_1_1':
        if ( $.gmRndInt(1,4) === 1 ) { dmg = 0; GAME.Notifications.Post('Some damage absorbed by Magical Shield'); }
        break;
    }
  }
  return dmg;
};

WS.Entity.prototype.AttackHandToHand = function( entity ) {
  for ( var i = 0; i < this.mNHTH; i++) {
    var dmg = this.mHTH * $.gmRnd( 0.66, 1.33 );
    //console.log( 'raw:' + dmg );

    if ( dmg < 0 ) { dmg = 0; }
    dmg =  this.DamageMod( entity, dmg );
    //console.log( 'hth:' + dmg );

    dmg = this.DefenseMod( entity, dmg );
    //console.log( 'def:' + dmg );

    dmg = Math.round( dmg );
    //console.log( 'fin: ' + dmg );

    entity.mHP[0] -= dmg;
    if ( entity.mType === 'monster' && ( this.mType === 'player' || entity.mState === 'neutral' ) ) {
      if ( entity.mState === 'aggressive' ) {
        entity.SetState('angered');
      } else {
        entity.SetState('aggressive');
      }
    } else {
      GAME.player.mPath = [];
      GAME.player.UpdateOverlay();
    }
    if ( dmg > 0 ) {
      GAME.AddTextAnimation('-'+parseInt(dmg)+' HP', entity.mGameX, entity.mGameY, '#E00');
    } else {
      GAME.AddTextAnimation('attack inefficient', entity.mGameX, entity.mGameY, '#E00');
    }
    if ( entity.mHP[0] <= 0 ) {
      this.EntityKilled( entity );
      break;
    }
    if ( this.mPoisonAttack === true && entity.mIsPoisoned === false && $.gmRndInt(0,100) < 33 ) {
      entity.SetTrait('poisoned');
      if ( entity.mType === 'player' ) {
        GAME.Notifications.Post('You have been poisoned by ' + this.mName, 'bad');
      }
    }
    if ( this.mEntangleAttack === true && entity.mIsEntangled === false && $.gmRndInt(0,100) < 25 ) {
      entity.SetTrait('entangled');
      if ( entity.mType === 'player' ) {
        GAME.Notifications.Post('You have been entangled by ' + this.mName, 'bad');
      }
    }
    if ( entity.mIsBleeding === false && $.gmRndInt(0,100) < 5 ) {
      entity.SetTrait('bleeding');
      if ( entity.mType === 'player' ) {
        GAME.Notifications.Post(this.mName + ' seriously wounded you', 'bad');
      }
    }
  }
};

WS.Entity.prototype.AttackRanged = function( entity ) {
  for ( var i = 0; i < this.mNRNG; i++) {
    var dmg = this.mRNG * $.gmRnd( 0.66, 1.33 );
    //console.log( 'raw:' + dmg );

    if ( dmg < 0 ) { dmg = 0; }
    dmg =  this.DamageMod( entity, dmg );
    //console.log( 'rng:' + dmg );

    dmg = this.DefenseMod( entity, dmg );
    //console.log( 'def: ' + dmg );

    dmg = Math.ceil( dmg );
    //console.log( 'fin: ' + dmg );

    entity.mHP[0] -= dmg;
    if ( entity.mType === 'monster' && ( this.mType === 'player' || entity.mState === 'neutral' ) ) {
      if ( entity.mState === 'aggressive' ) {
        entity.SetState('angered');
      } else {
        entity.SetState('aggressive');
      }
    } else {
      GAME.player.mPath = [];
      GAME.player.UpdateOverlay();
    }
    if ( dmg > 0 ) {
      GAME.AddTextAnimation('-'+parseInt(dmg)+' HP', entity.mGameX, entity.mGameY, '#E00');
    } else {
      GAME.AddTextAnimation('attack inefficient', entity.mGameX, entity.mGameY, '#E00');
    }
    if ( entity.mHP[0] <= 0 ) {
      this.EntityKilled( entity );
      break;
    }
    if ( this.mPoisonAttack === true && entity.mIsPoisoned === false && $.gmRndInt(0,100) < 33 ) {
      entity.SetTrait('poisoned');
      if ( entity.mType === 'player' ) {
        GAME.Notifications.Post('You have been poisoned by ' + this.mName, 'bad');
      }
    }
    if ( this.mEntangleAttack === true && entity.mIsEntangled === false && $.gmRndInt(0,100) < 25 ) {
      entity.SetTrait('entangled');
      if ( entity.mType === 'player' ) {
        GAME.Notifications.Post('You have been entangled by ' + this.mName, 'bad');
      }
    }
  }
};

WS.Entity.prototype.EntityKilled = function( entity ) {
  entity.died = true;
  GAME.layer_control.SetLayerCSS('mouse', {'cursor': 'url(img/cursors/move.png),auto'});
  entity.mHP[0] = 0;
  if ( entity.mType === 'monster' ) {
    if ( this.mType === 'player' || ( 'clone' == this.monster_type ) ) {
          GAME.AddTextAnimation('+'+entity.mKEXP+' Exp', this.mGameX, this.mGameY);
      GAME.player.mStats.monsters_killed[0] += 1;
      if ( entity.quest_evil_boss !== undefined ) {
        GAME.player.mStats.evil_boss_killed = true;
        GAME.data['position_evil_boss'] = undefined;
        GAME.Notifications.Post('Quest Progress: Evil Boss Killed!', 'good', 5000);
      } else if ( entity.quest_orc_boss !== undefined ) {
        GAME.player.mStats.orc_boss_killed = true;
        GAME.data['position_orc_boss'] = undefined;
        GAME.Notifications.Post('Quest Progress: Orc Boss Killed!', 'good', 5000);
      } else if ( entity.quest_fugitive !== undefined ) {
        GAME.player.mStats.fugitive_killed = true;
        GAME.data['position_fugitive'] = undefined;
        GAME.Notifications.Post('Quest Complete: Fugitive Killed!', 'good', 5000);
      } else if ( entity.quest_caged_unicorn !== undefined ) {
        GAME.player.mStats.unicorn_released = true;
        GAME.data['position_unicorn'] = undefined;
        GAME.Notifications.Post('Quest Complete: Unicorn Released!', 'good', 5000);
        var unicorn = GAME.Monsters.Create( 'unicorn', entity.mGameX, entity.mGameY );
                unicorn.quest_unicorn = true;
      }
    }
    this.GetXP( entity.mKEXP );
    if ( this.monster_type !== undefined && this.monster_type === 'clone' ) {
      GAME.player.GetXP( entity.mKEXP );
    }
    GAME.Notifications.Post( '<strong>' + entity.mName + '</strong> killed' );
    if ( entity.quest_caged_unicorn === undefined ) {
      GAME.Objects.CreateAt( 'blood', entity.mGameX, entity.mGameY );
      var irnd = $.gmRndInt(0,99);
      if ( irnd < 15 ) { // scroll or potion
        GAME.Objects.CreateRandomSpellObject( entity.mGameX, entity.mGameY );
      } else {
        if ( entity.mBonusDrop !== undefined && GAME.Objects.GetAtXY(entity.mGameX, entity.mGameY) === undefined ) {
          var ebd = entity.mBonusDrop;
          for (var i = 0, len = ebd.length; i < len; i++ ) {
            if ( ebd[i][1] > $.gmRndInt(0,99) ) {
              GAME.Objects.CreateAt( ebd[i][0], entity.mGameX, entity.mGameY );
              break;
            }
          }
        }
      }
    }
    GAME.Monsters.Destroy( entity.GetUUID() );
    GAME.Display.RenderLand();
    GAME.Display.RenderObjects();
  } else {
    if ( entity.mType === 'player' ) {
      console.log('player died');
      GAME.GameOver(false);
    }
  }
};

WS.Entity.prototype.HasHTHAttack = function() {
  return this.mHTH > 0;
};

WS.Entity.prototype.HasRangedAttack = function() {
  return this.mRNG > 0;
};

WS.Entity.prototype.IsAdjacentPoint = function( x, y ) {
  if ( Math.abs( this.mGameX - x ) === 1 && ( this.mGameY - y ) === 0 ) { return true; }
  if ( Math.abs( this.mGameY - y ) === 1 && ( this.mGameX - x ) === 0 ) { return true; }
  return false;
};

WS.Entity.prototype.IsAdjacentEntity = function( entity ) {
  return this.IsAdjacentPoint( entity.mGameX, entity.mGameY );
};

WS.Entity.prototype.MoveTowardsOrAwayFromPoint = function( x0, y0, towards ) {
  if ( x0 === undefined || y0 === undefined || towards === undefined ) { return false; }

  // calculate move offsets
  var dx = ( towards === false ) ? this.mGameX - x0 : x0 - this.mGameX;
  var dy = ( towards === false ) ? this.mGameY - y0 : y0 - this.mGameY;

  var dd = Math.max( Math.abs(dx), Math.abs(dy) );
  dx = parseInt(Math.floor(dx / dd));
  dy = parseInt(Math.floor(dy / dd));
  if (dx !== 0 && Math.abs(dx) === Math.abs(dy) ) {
    if ($.gmRndInt(0,1) === 0) { dx = 0; } else { dy = 0; }
  }
  // try making a step
  this.MoveToDXY(dx, dy);

  return true;
};

WS.Entity.prototype.MoveRandomly = function() {
  var offsets = [ [-1,0], [1,0], [0,-1], [0,1] ];
  offsets = $.gmShuffleArray( offsets );
  for ( var i = 0; i < offsets.length; i++ ) {
    if ( this.MoveToDXY(offsets[i][0], offsets[i][1] ) === true ) { return; }
  }
};

WS.Entity.prototype.MoveToDXY = function( dx, dy ) {
    var c = { 'x': this.mGameX + dx, 'y': this.mGameY + dy };
  var pc = GAME.player.GetGameXY();

    // check if player occupies that spot
    if ( pc.x === c.x && pc.y === c.y ) { return false; }

    // check if tile is passable
    var tile = GAME.Tiles.GetAtXY( c.x, c.y );
    if ( this.IsTilePassable( tile ) === false ) { return false; }
  // check if object is passable
    var obj = GAME.Objects.GetTerrainAtXY( c.x, c.y );
    if ( obj !== undefined && !this.IsObjectPassable( obj.t ) ) { return false; }
  // check if monster is there
  if ( GAME.Monsters.IsMonsterThere( c.x, c.y ) !== false ) { return false; }

    // okay, our path is clear:
    if ( GAME.overlays[ tile ] !== undefined && this.mIsFlying === false ) {
        var ship = GAME.data['position_ship'];
        if ( c.x === ship.x && c.y === ship.y ) {
            this.RemoveOverlay();
        } else {
            this.SetOverlay( GAME.overlays[ tile ] );
        }
    } else {
        this.RemoveOverlay();
    }

    if ( dx < 0 && this.mFlipX === false ) {
        this.SetFlipX( true );
    } else if ( dx > 0 && this.mFlipX === true ) {
        this.SetFlipX( false );
    }

  this.SetGameXY( c.x, c.y );
  return true;
};

WS.Entity.prototype.GetPossiblePathToXY = function( x2, y2 ) {
  var x1 = this.mGameX;
  var y1 = this.mGameY;
    var tiles = GAME.MapGen.mTileMap;
    var objs  = GAME.MapGen.mTerrainMap;

    var minx = x2 < x1 ? x2 : x1, maxx = x2 > x1 ? x2 : x1;
    var miny = y2 < y1 ? y2 : y1, maxy = y2 > y1 ? y2 : y1;
    var gridx = (maxx - minx) + 10, gridy = (maxy - miny) + 10;

    var grid = new PF.Grid(gridx, gridy);

    for ( var i = (minx - 5), lenx = ( maxx + 5 ); i < lenx; i++ ) {
        for ( var j = (miny - 5), leny = ( maxy + 5 ); j < leny; j++ ) {
      if ( i === x2 && j === y2 ) { continue; }
            if ( !this.IsTilePassable( tiles[i][j] ) ) {
                grid.setWalkableAt( i - (minx - 5), j - (miny - 5), false);
            } else if ( objs[i][j] != undefined && !this.IsObjectPassable( objs[i][j].t ) ) {
                grid.setWalkableAt( i - (minx - 5), j - (miny - 5), false);
            } else if ( GAME.Monsters.IsMonsterThere( i, j ) !== false ) {
                grid.setWalkableAt( i - (minx - 5), j - (miny - 5), false);
            }
        }
    }

    var path = GAME.Display.mFinder.findPath( x1 - (minx - 5),  y1 - (miny - 5), x2 - (minx - 5), y2 - (miny - 5), grid );

    if ( path.length > 0 ) {
        for ( var i = 0; i < path.length; i++ ) {
            path[i] = [ path[i][0] + (minx - 5), path[i][1] + (miny - 5) ];
        }
    }

    return path;
};

WS.Entity.prototype.CheckLosToEntity = function( entity ) {
  return ( this.CheckLosToXY( entity.mGameX, entity.mGameY ) );
};

WS.Entity.prototype.CheckLosToXY = function( x1, y1 ) {
  var x0 = this.mGameX,
      y0 = this.mGameY,
      dx = Math.abs( x1 - x0 ),
      dy = Math.abs( y1 - y0 ),
      sx = x0 < x1 ? 1 : 0 - 1,
      sy = y0 < y1 ? 1 : 0 - 1,
      err = dx - dy;
  var obj = GAME.MapGen.mTerrainMap;
  var go = GAME.Objects;
  var cycle = 0;
  while ( true ) {
    if ( x0 === x1 && y0 === y1 ) { break; }
    if ( cycle !== 0 && obj[x0][y0] != undefined && go.Get( obj[x0][y0].t ).nolos === true ) { return false; }
    var e2 = 2 * err;
    if ( e2 > 0 - dy ) { err -= dy; x0 += sx; }
    if ( e2 < dx ) { err += dx; y0 += sy; }
    cycle += 1;
  }
  return true;
};


