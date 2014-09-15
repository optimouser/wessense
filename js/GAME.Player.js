
GAME.Player = function( opt ) {
    if ( opt === undefined ) { throw 'Cannot create GAME.Player, constructor parameters missing'; }
    WS.Entity.call( this, opt );
  this.mPath = [];
  this.mStats = {
    'houses_owned'    : [0,0],
    'monoliths_visited' : [0,0],
    'monsters_killed' : [0,0],
    'spells_cast'   : 0,

    'tower_key_found'   : false, // primary
    'hostage_released'    : false,

    'orc_boss_killed'   : false, // secondary
    'evil_boss_killed'    : false,

    'necklace_found'    : false, // optional
    'flamingsword_found'  : false,
    'book_postament_found'  : false,

    'mines_cleared'     : [0,0], // special
    'potion_of_youth_found' : false,
    'unicorn_released'    : false,
    'fugitive_killed'   : false
  };
};

GAME.Player.prototype = Object.create( WS.Entity.prototype );

GAME.Player.prototype.SetMovePath = function( path ) {
  this.mPath = path;
};

GAME.Player.prototype.ClearMovePath = function() {
  this.mPath = [];
};

GAME.Player.prototype.HasMovePath = function() {
  return ( this.mPath.length > 0 );
};

GAME.Player.prototype.MakeStepPath = function() {
  if ( this.mPath.length <= 0 ) { this.ClearMovePath(); return; }
  var step = this.mPath.shift();
  var dx = step[0] - this.mGameX, dy = step[1] - this.mGameY;
  if ( ! GAME.player.MoveToDXY( dx, dy ) ) {
    this.ClearMovePath();
  }
}

GAME.Player.prototype.GetNormalizedLvl = function() {
    var lvl = parseInt(Math.floor(this.mLVL / 10));
    if ( lvl >= 3 ) { lvl = 2; }
    return lvl;
};

GAME.Player.prototype.UpdateOverlay = function() {
  $('.val_lvl').text( this.mLVL );

  if ( GAME.player.mNHTH > 0 ) {
    $('.val_hth').text( this.mNHTH+'x'+this.mHTH );
  }

  if ( GAME.player.mNRNG > 0 ) {
    $('.val_rng').text( this.mNRNG+'x'+this.mRNG );
  }

  var max_def = GAME.PlayersControl.GetPreset( GAME.data['role'] ).max_def;
  $('.val_def').text( ( this.mDEF < max_def ) ? ( this.mDEF + '%') : ( max_def + '%') );

  $('.val_hp').text( parseInt(this.mHP[0]) +' / ' + parseInt(this.mHP[1]) );

  $('.val_exp').text( this.mEXP );
  $('.val_money').text( this.mCash );

  var exp_diff = this.GetLvlExp( this.mLVL ) - this.mEXP;
  var exp_pct  = parseInt( 100.0 - ( exp_diff / ( this.GetLvlExp( this.mLVL ) - this.GetLvlExp( this.mLVL - 1 ) ) * 100.0 ) );

  $('#exp_bar_inner').css({ width: (exp_pct+'%') });
  $('#exp_bar_text').text( 'NEXT LVL: '+exp_pct+'%, EXP TO NEXT LEVEL: '+ exp_diff );

  var stat = GAME.PlayersControl.GetPreset( GAME.data['role'] );
  if ( stat.disable_rng === true ) {
    $('.img_rng').hide(0); $('.val_rng').hide(0);
  } else if ( stat.disable_hth === true ) {
    $('.img_hth').hide(0); $('.val_hth').hide(0);
  }

    $('.img_hth').css({ "background-position" : stat.imgoff_hth[this.GetNormalizedLvl()*2] + "px " + stat.imgoff_hth[this.GetNormalizedLvl()*2+1]+"px"});
    $('.img_rng').css({ "background-position" : stat.imgoff_rng[this.GetNormalizedLvl()*2] + "px " + stat.imgoff_rng[this.GetNormalizedLvl()*2+1]+"px"});
    $('.img_def').css({ "background-position" : stat.imgoff_def[this.GetNormalizedLvl()*2] + "px " + stat.imgoff_def[this.GetNormalizedLvl()*2+1]+"px"});
};

GAME.Player.prototype.SetStartingLocation = function(x,y) {
    if ( x !== undefined && y !== undefined ) { this.SetGameXY(x, y); return; }
    var dx = GAME.MapGen.mDX / 2;
  var x_start = 127; y_start = 256;
    for ( var i = 0; i < dx; i++) {
        if ( this.CheckStartingLocation( dx - i, dx ) == true ) { x_start = dx - i; y_start = dx; break; }
        if ( this.CheckStartingLocation( dx + i, dx ) == true ) { x_start = dx + i; y_start = dx; break; }
        if ( this.CheckStartingLocation( dx, dx - i ) == true ) { x_start = dx; y_start = dx - i; break; }
        if ( this.CheckStartingLocation( dx, dx + i ) == true ) { x_start = dx; y_start = dx + i; break; }
    }
  this.SetGameXY( x_start, y_start );
};

GAME.Player.prototype.CheckStartingLocation = function( x, y ) {
    var data = GAME.MapGen.mTileMap, mask = GAME.MapGen.mLakeMask, dx = GAME.MapGen.mDX;
    if ( mask[ x - 1 + y * dx ] === 2 && data[x-1][y] === 'water_shallow' ) {
        GAME.MapGen.mTerrainMap[x-1][y] = { t: 'deco_ship', v: 1 };
    GAME.data['position_ship'] = { 'x': x-1, 'y': y };
        return true;
    } else if ( mask[ x + 1 + y * dx ] === 2 && data[x+1][y] === 'water_shallow' ) {
        GAME.MapGen.mTerrainMap[x+1][y] = { t: 'deco_ship', v: 1 };
    GAME.data['position_ship'] = { 'x': x+1, 'y': y };
        return true;
    } else if ( mask[ x + (y - 1) * dx ] === 2 && data[x][y-1] === 'water_shallow' ) {
        GAME.MapGen.mTerrainMap[x][y-1] = { t: 'deco_ship', v: 1 };
    GAME.data['position_ship'] = { 'x': x, 'y': y-1 };
        return true;
    } else if ( mask[ x + (y + 1) * dx ] === 2 && data[x][y+1] === 'water_shallow' ) {
        GAME.MapGen.mTerrainMap[x][y+1] = { t: 'deco_ship', v: 1 };
    GAME.data['position_ship'] = { 'x': x, 'y': y+1 };
        return true;
    }
    return false;
};


GAME.Player.prototype.MoveToDXY = function( dx, dy ) {
  var c = { 'x': this.mGameX + dx, 'y': this.mGameY + dy };
  var tile = GAME.MapGen.GetTile( c.x, c.y );
  var obj  = GAME.MapGen.GetTerrainObject( c.x, c.y );

  // is path clear?
  if ( !this.CanMoveIntoTile( tile ) || ( obj !== undefined && !this.CanMoveIntoObject( obj.t ) ) ) { return false; }
  var monster = GAME.Monsters.IsMonsterThere( c.x, c.y );
  if ( monster !== false ) { return false; }

  // okay, our path is clear:
  if ( GAME.overlays[ tile ] !== undefined && this.mIsFlying === false ) {
    var ship = GAME.data['position_ship'];
    if ( c.x === ship.x && c.y === ship.y ) {
      this.RemoveOverlay();
            if ( this.mStats.hostage_released === true ) {
                GAME.GameOver( true );
            } else {
        console.log('need to release hostage first..');
      }
    } else {
      this.SetOverlay( GAME.overlays[ tile ] );
      //this.AddEffect( $.extend( {}, GAME.effects['watersplash'] ) );
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
  this.PickObjectIfAny();
  this.CheckHouseOwnership();

  amplify.publish('PLAYER_MOVED');

  return true;
};

GAME.Player.prototype.CanMoveIntoTile = function( tiletype ) {
  return this.mIsFlying || this.IsTilePassable( tiletype ) ;
};

GAME.Player.prototype.CanMoveIntoObject = function( objtype ) {
  if ( this.mIsFlying === true ) { return true; }
  if ( objtype === undefined ) { return true; }
  return ( this.IsObjectPassable( objtype ) );
};

GAME.Player.prototype.GetRangedRange = function() {
  var preset = GAME.PlayersControl.GetPreset( GAME.data['role'] );
  if ( preset['rng_range'] === undefined ) { return 0; }
  return preset['rng_range'][ this.GetNormalizedLvl() ];
};

GAME.Player.prototype.GetRangedEffect = function() {
  var preset = GAME.PlayersControl.GetPreset( GAME.data['role'] );
  if ( preset['rng_effects'] === undefined ) { return undefined; }
    return $.extend( {}, GAME.ranged_effects[ preset['rng_effects'][ this.GetNormalizedLvl() ] ] );
};

GAME.Player.prototype.CheckLevelUp = function() {
  if ( this.mEXP < this.GetLvlExp( this.mLVL ) ) { return; }
  var norm_lvl_old = this.GetNormalizedLvl();
  this.mLVL += 1;
  var norm_lvl_new = this.GetNormalizedLvl();
  var pr = GAME.PlayersControl.GetPreset( GAME.data['role'] );
  if ( norm_lvl_old !== norm_lvl_new ) {
    this.SetAnimations( $.gmMakeStandardAnimations( 'heroes', pr.offset * 3 + norm_lvl_new ) );
    var upg = GAME.PlayersControl.GetPreset( GAME.data['role'] );
    this.mNHTH  += upg['majorupgrade']['n_hth'];
    this.mNRNG  += upg['majorupgrade']['n_rng'];
    this.mHP[1] += upg['majorupgrade']['hp' ];
    this.mDEF   += upg['majorupgrade']['def'];
    this.mHTH   += upg['majorupgrade']['hth'];
    this.mRNG   += upg['majorupgrade']['rng'];
    if ( pr.rng_effects !== undefined ) {
      this.mRngEffect = $.extend( {}, GAME.ranged_effects[ pr.rng_effects[ norm_lvl_new ] ] );
    }
    GAME.Notifications.Post('Major Upgrade Achieved!', 'good', 7000);
  } else {
    GAME.Notifications.Post('LevelUp!', 'good', 5000);
  }
  var p = pr.levelup;
  this.mHTH += p.hth;
  this.mRNG += p.rng;
  this.mDEF += p.def;
  this.mHP[1] += p.hp; this.mHP[0] = this.mHP[1];
  this.CheckLevelUp();
  this.AddEffect( $.extend( {}, GAME.effects['levelup'] ) );
};

GAME.Player.prototype.CheckHouseOwnership = function() {
  var house = GAME.Objects.GetTerrainAtXY( this.mGameX, this.mGameY );
  if ( house === undefined || !( house.t.startsWith('house_') || ( house.t.startsWith('mine') ) || ( house.t.startsWith('monolith') ) ) || house.owned !== undefined ) { return; }
  house['owned'] = true;
  if ( house.t.startsWith('house_') ) {
    GAME.Notifications.Post('Village Liberated', 'good');
    this.mStats.houses_owned[0] += 1;
    this.GetXP( 10 );
    GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
  } else if ( house.t.startsWith('mine') ) {
    GAME.Notifications.Post('Quest Progress: Mine Reclaimed', 'good', 2000);
    this.mStats.mines_cleared[0] += 1;
    this.GetXP( 20 );
    GAME.AddTextAnimation('+20 Exp', this.mGameX, this.mGameY);
  } else {
    GAME.Notifications.Post('Monolith Visited', 'good');
    this.mStats.monoliths_visited[0] += 1;
    this.GetXP( 15 );
    GAME.AddTextAnimation('+15 Exp', this.mGameX, this.mGameY);
  }
};

GAME.Player.prototype.PickObjectIfAny = function() {
    var obj = GAME.Objects.GetAtXY( this.mGameX, this.mGameY );
    if ( obj === undefined ) { return; }
  var should_destroy = false;
    switch (obj.t) {
    case 'bonus_book_postament':
      this.mStats['book_postament_found'] = true;
      GAME.data['position_book_postament'] = undefined;
      should_destroy = true;
      GAME.Notifications.Post('Quest Complete: Dwarven Holy Book found!','good', 5000);
      // dwarven defenders of the book = surprise!
      pos = GAME.MapGen.SearchRadius( GAME.player.mGameX, GAME.player.mGameY, [ 'swamp_shallow', 'swamp_deep', 'grass', 'mud', 'dirt', 'soil', 'snow', 'desert' ] );
      var runesmith = GAME.Monsters.Create( 'dwarven_runesmith', pos.x, pos.y );
      runesmith.SetState('angered');
      pos = GAME.MapGen.SearchRadius( GAME.player.mGameX, GAME.player.mGameY, [ 'swamp_shallow', 'swamp_deep', 'grass', 'mud', 'dirt', 'soil', 'snow', 'desert' ] );
      var hero = GAME.Monsters.Create( 'dwarven_hero', pos.x, pos.y );
      hero.SetState('angered');
      GAME.Notifications.Post('Oops, local dwarves do not want you to take their relic away!','bad', 5000);
      break;
    case 'bonus_key':
      this.mStats['tower_key_found'] = true;
      GAME.data['position_tower_key'] = undefined;
      should_destroy = true;
      GAME.Notifications.Post('Quest Progress: Tower Key found!','good', 5000);
      break;
    case 'bonus_necklace':
      this.mStats['necklace_found'] = true;
      GAME.data['position_necklace'] = undefined;
      should_destroy = true;
      GAME.Notifications.Post('Quest Complete: Elven Necklace found!','good', 5000);
      break;
    case 'bonus_flamingsword':
      this.mStats['flamingsword_found'] = true;
      GAME.data['position_flamingsword'] = undefined;
      should_destroy = true;
      GAME.Notifications.Post('Quest Complete: Flaming Sword found!','good', 5000);
      break;
    case 'bonus_potion_youth':
      this.mStats['potion_of_youth_found'] = true;
      GAME.data['position_potion_of_youth'] = undefined;
      should_destroy = true;
      GAME.Notifications.Post('Quest Complete: Potion of Youth found!','good', 5000);
      break;
        case 'bonus_sword':
      if ( ['role_1_0','role_2_1','role_4_0','role_4_1'].inArray( GAME.data['role'] ) === true ) {
        this.mHTH += 1;
        GAME.AddTextAnimation('+1 HTH', this.mGameX, this.mGameY, '#00E');
      } else {
        var cash = 1;
        if ( GAME.data['role'].startsWith('role_3') === true ) { cash = 2; }
        this.mCash += cash;
        GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
        this.GetXP( 10 );
        GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      }
      should_destroy = true;
      break;
        case 'bonus_lance':
      if ( ['role_1_0'].inArray( GAME.data['role'] ) === true ) {
        this.mHTH += 1;
        GAME.AddTextAnimation('+1 HTH', this.mGameX, this.mGameY, '#00E');
      } else {
        var cash = 1;
        if ( GAME.data['role'].startsWith('role_3') === true ) { cash = 2; }
        this.mCash += cash;
        GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
        this.GetXP( 10 );
        GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      }
      should_destroy = true;
      break;
        case 'bonus_book':
      if ( ['role_1_1'].inArray( GAME.data['role'] ) === true ) {
        this.mRNG += 1;
        GAME.AddTextAnimation('+1 Ranged', this.mGameX, this.mGameY, '#00E');
      } else {
        var cash = 1;
        if ( GAME.data['role'].startsWith('role_3') === true ) { cash = 2; }
        this.mCash += cash;
        GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
        this.GetXP( 10 );
        GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      }
      should_destroy = true;
      break;
        case 'bonus_book_necro':
      if ( ['role_1_1'].inArray( GAME.data['role'] ) === true ) {
        this.mRNG += 2;
        GAME.AddTextAnimation('+2 Ranged', this.mGameX, this.mGameY, '#00E');
      } else {
        var cash = 1;
        if ( GAME.data['role'].startsWith('role_3') === true ) { cash = 2; }
        this.mCash += cash;
        GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
        this.GetXP( 10 );
        GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      }
      should_destroy = true;
      break;
        case 'bonus_axe':
      if ( ['role_3_0'].inArray( GAME.data['role'] ) === true ) {
        this.mHTH += 1; this.mRNG += 1;
        GAME.AddTextAnimation('+1 HTH', this.mGameX, this.mGameY, '#00E');
        GAME.AddTextAnimation('+1 Ranged', this.mGameX, this.mGameY, '#00E');
      } else {
        var cash = 1;
        if ( GAME.data['role'].startsWith('role_3') === true ) { cash = 2; }
        this.mCash += cash;
        GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
        this.GetXP( 10 );
        GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      }
      should_destroy = true;
      break;
        case 'bonus_bow':
      if ( ['role_2_0','role_4_1'].inArray( GAME.data['role'] ) === true ) {
        this.mRNG += 1;
        GAME.AddTextAnimation('+1 Ranged', this.mGameX, this.mGameY, '#00E');
      } else {
        var cash = 1;
        if ( GAME.data['role'].startsWith('role_3') === true ) { cash = 2; }
        this.mCash += cash;
        GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
        this.GetXP( 10 );
        GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      }
      should_destroy = true;
      break;

        case 'bonus_staff':
      if ( ['role_1_1'].inArray( GAME.data['role'] ) === true ) {
        this.mHTH += 1;
        GAME.AddTextAnimation('+1 HTH', this.mGameX, this.mGameY, '#00E');
        this.mRNG += 1;
        GAME.AddTextAnimation('+1 Ranged', this.mGameX, this.mGameY, '#00E');
      } else {
        var cash = 1;
        if ( GAME.data['role'].startsWith('role_3') === true ) { cash = 2; }
        this.mCash += cash;
        GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
        this.GetXP( 10 );
        GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      }
      should_destroy = true;
      break;

    case 'bonus_armor':
      this.mDEF += 1;
      GAME.AddTextAnimation('+1 Armor', this.mGameX, this.mGameY, '#0E0');
      should_destroy = true;
      break;

    case 'bonus_armor_gold':
      this.mDEF += 2;
      GAME.AddTextAnimation('+2 Armor', this.mGameX, this.mGameY, '#0E0');
      should_destroy = true;
      break;

    case 'bonus_potion_health':
      if ( $.gmRndInt(1,3) === 1 ) {
        this.mHP[1] += 1;
        GAME.AddTextAnimation('+1 Max HP', this.mGameX, this.mGameY, '#E00');
      }
      this.mIsBleeding = false;
      this.mIsPoisoned = false;
      this.mIsEntangled = false;
      this.mHP[0] = this.mHP[1];
      this.AddEffect( $.extend( {}, GAME.effects['healing'] ) );
      should_destroy = true;
      break;


    //---------------------- SPELLS -------------------------------------------------------------------------

    case 'bonus_potion_heal':
      this.mMagic.heal = ( this.mMagic.heal !== -1 ) ? (this.mMagic.heal + 1) : this.mMagic.heal;
      if ( this.mMagic.heal !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.heal = -1;
        GAME.Notifications.Post('You have learned Heal spell', 'good');
      }
      if ( this.mMagic.heal !== -1 && GAME.data['role'].startsWith( 'role_2' ) && $.gmRndInt(0,99) < 50 ) {
        this.mMagic.heal = -1;
        GAME.Notifications.Post('You have learned Heal spell', 'good');
      }
      GAME.AddTextAnimation('+1 Heal Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_potion_green':
      this.mMagic.mirror = ( this.mMagic.mirror !== -1 ) ? (this.mMagic.mirror + 1) : this.mMagic.mirror;
      if ( this.mMagic.mirror !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.mirror = -1;
        GAME.Notifications.Post('You have learned Mirror Image spell', 'good');
      }
      GAME.AddTextAnimation('+1 Mirror Image Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_potion_gray':
      this.mMagic.shadows = ( this.mMagic.shadows !== -1 ) ? (this.mMagic.shadows + 1) : this.mMagic.shadows;
      if ( this.mMagic.shadows !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.shadows = -1;
        GAME.Notifications.Post('You have learned Shadows spell', 'good');
      }
      if ( this.mMagic.shadows !== -1 && GAME.data['role'] === 'role_4_0' && $.gmRndInt(0,99) < 50 ) {
        this.mMagic.shadows = -1;
        GAME.Notifications.Post('You have learned Shadows spell', 'good');
      }
      GAME.AddTextAnimation('+1 Shadows Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_potion_blue':
      this.mMagic.fly = ( this.mMagic.fly !== -1 ) ? (this.mMagic.fly + 1) : this.mMagic.fly;
      if ( this.mMagic.fly !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.fly = -1;
        GAME.Notifications.Post('You have learned Fly spell', 'good');
      }
      GAME.AddTextAnimation('+1 Fly Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_scroll_blue':
      this.mMagic.rain = ( this.mMagic.rain !== -1 ) ? (this.mMagic.rain + 1) : this.mMagic.rain;
      if ( this.mMagic.rain !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.rain = -1;
        GAME.Notifications.Post('You have learned Rain spell', 'good');
      }
      if ( this.mMagic.rain !== -1 && GAME.data['role'].startsWith('role_2') === true && $.gmRndInt(0,99) < 50 ) {
        this.mMagic.rain = -1;
        GAME.Notifications.Post('You have learned Rain spell', 'good');
      }
      GAME.AddTextAnimation('+1 Call Rain Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_scroll_yellow':
      this.mMagic.charm = ( this.mMagic.charm !== -1 ) ? (this.mMagic.charm + 1) : this.mMagic.charm;
      if ( this.mMagic.charm !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.charm = -1;
        GAME.Notifications.Post('You have learned Charm spell', 'good');
      }
      GAME.AddTextAnimation('+1 Charm Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_scroll_cyan':
      this.mMagic.tornado = ( this.mMagic.tornado !== -1 ) ? (this.mMagic.tornado + 1) : this.mMagic.tornado;
      if ( this.mMagic.tornado !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.tornado = -1;
        GAME.Notifications.Post('You have learned Tornado spell', 'good');
      }
      if ( this.mMagic.tornado !== -1 && GAME.data['role'].startsWith('role_2') === true && $.gmRndInt(0,99) < 50 ) {
        this.mMagic.tornado = -1;
        GAME.Notifications.Post('You have learned Tornado spell', 'good');
      }
      GAME.AddTextAnimation('+1 Tornado Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_scroll_green':
      this.mMagic.forest = ( this.mMagic.forest !== -1 ) ? (this.mMagic.forest + 1) : this.mMagic.forest;
      if ( this.mMagic.forest !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.forest = -1;
        GAME.Notifications.Post('You have learned Forest spell', 'good');
      }
      if ( this.mMagic.forest !== -1 && GAME.data['role'].startsWith('role_2') === true && $.gmRndInt(0,99) < 50 ) {
        this.mMagic.forest = -1;
        GAME.Notifications.Post('You have learned Forest spell', 'good');
      }
      GAME.AddTextAnimation('+1 Forest Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_scroll_purple':
      this.mMagic.sleep = ( this.mMagic.sleep !== -1 ) ? (this.mMagic.sleep + 1) : this.mMagic.sleep;
      if ( this.mMagic.sleep !== -1 && ( GAME.data['role'] === 'role_1_1' || GAME.data['role'] === 'role_4_0' ) ) {
        this.mMagic.sleep = -1;
        GAME.Notifications.Post('You have learned Sleep spell', 'good');
      }
      GAME.AddTextAnimation('+1 Sleep Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_scroll_black':
      this.mMagic.frenzy = ( this.mMagic.frenzy !== -1 ) ? (this.mMagic.frenzy + 1) : this.mMagic.frenzy;
      if ( this.mMagic.frenzy !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.frenzy = -1;
        GAME.Notifications.Post('You have learned Frenzy spell', 'good');
      }
      GAME.AddTextAnimation('+1 Frenzy Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_scroll_orange':
      this.mMagic.entangle = ( this.mMagic.entangle !== -1 ) ? (this.mMagic.entangle + 1) : this.mMagic.entangle;
      if ( this.mMagic.entangle !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.entangle = -1;
        GAME.Notifications.Post('You have learned Entangle spell', 'good');
      }
      GAME.AddTextAnimation('+1 Entangle Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    case 'bonus_scroll_red':
      this.mMagic.meteor = ( this.mMagic.meteor !== -1 ) ? (this.mMagic.meteor + 1) : this.mMagic.meteor;
      if ( this.mMagic.meteor !== -1 && GAME.data['role'] === 'role_1_1' ) {
        this.mMagic.meteor = -1;
        GAME.Notifications.Post('You have learned Meteor spell', 'good');
      }
      if ( this.mMagic.meteor !== -1 && GAME.data['role'].startsWith('role_3') === true && $.gmRndInt(0,99) < 50 ) {
        this.mMagic.meteor = -1;
        GAME.Notifications.Post('You have learned Meteor spell', 'good');
      }
      GAME.AddTextAnimation('+1 Meteor Spell', this.mGameX, this.mGameY, '#EEE');
      should_destroy = true;
      GAME.Buttons.Toggle(); GAME.Buttons.Toggle();
      break;

    //---------------------- SPELLS END -------------------------------------------------------------------------

    case 'bonus_gold_small':
      var cash = $.gmRndInt(1,4);
      if ( GAME.data['role'].startsWith('role_3') === true ) { cash *= 2; }
      this.mCash += cash;
      GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
      should_destroy = true;
      this.GetXP( 10 );
      GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      break;
    case 'bonus_gold_medium':
      var cash = $.gmRndInt(4,6);
      if ( GAME.data['role'].startsWith('role_3') === true ) { cash *= 2; }
      this.mCash += cash;
      GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
      should_destroy = true;
      this.GetXP( 10 );
      GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      break;
    case 'bonus_gold_large':
      var cash = $.gmRndInt(6,10);
      if ( GAME.data['role'].startsWith('role_3') === true ) { cash *= 2; }
      this.mCash += cash;
      GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
      should_destroy = true;
      this.GetXP( 10 );
      GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      break;
    case 'bonus_chest_gold':
      var cash = $.gmRndInt(8,14);
      if ( GAME.data['role'].startsWith('role_3') === true ) { cash *= 2; }
      this.mCash += cash;
      GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');
      should_destroy = true;
      this.GetXP( 10 );
      GAME.AddTextAnimation('+10 Exp', this.mGameX, this.mGameY);
      break;
    case 'bonus_barrel_floating':
      var cash = 1;
      if ( GAME.data['role'].startsWith('role_3') === true ) { cash = 2; }
      this.mCash += cash;
      GAME.AddTextAnimation('+'+cash+' Gold', this.mGameX, this.mGameY, '#EE0');

      var gain = $.gmRndInt(0,1);
      if ( gain === 1 ) {
        this.mHP[1] += gain;
        GAME.AddTextAnimation('+'+gain+' Max HP', this.mGameX, this.mGameY, '#E00');
      }

      gain = $.gmRndInt(0,100);
      if ( gain < 20 && this.mHTH > 0 ) {
        this.mHTH += 1;
        GAME.AddTextAnimation('+1 HTH', this.mGameX, this.mGameY, '#00E');
      }

      gain = $.gmRndInt(0,100);
      if ( gain < 20 && this.mRNG > 0) {
        this.mRNG += 1;
        GAME.AddTextAnimation('+1 Ranged', this.mGameX, this.mGameY, '#00E');
      }

      if ( this.mDEF < 30 ) {
        gain = $.gmRndInt(0,1);
        if ( gain === 1 ) {
          this.mDEF += gain;
          GAME.AddTextAnimation('+'+gain+' Armor', this.mGameX, this.mGameY, '#0E0');
        }
      }
      should_destroy = true;
      break;
    default:
      break;
  }
  if ( should_destroy === true ) {
    GAME.Objects.Destroy( this.mGameX, this.mGameY );
    GAME.Display.RenderObjects();
    this.UpdateOverlay();
  }
};

GAME.Player.prototype.tryAttack = function(monster) {
  var mcoord = monster.GetGameXY();
  this.SetFlipX( this.mGameX > mcoord.x );
  if ( this.HasHTHAttack() && monster.DistanceTo( this ) <= 1.01 ) {
//        console.log('performing hth attack');
    GAME.EntityAttacksEntityHTH(this, monster, function() {
//          console.log('player hth attack ended');
      amplify.publish('TURN_ENEMY_START');
    });
  } else if ( this.HasRangedAttack() === true
      && monster.DistanceTo( this ) <= this.GetRangedRange()
      && this.CheckLosToXY( mcoord.x, mcoord.y ) === true
    ) {
//        console.log('queuing player attack animation');
    GAME.EntityAttacksEntityRNG(this, monster, function() {
//          console.log('player rng attack ended');
      amplify.publish('TURN_ENEMY_START');
    });
  }
}
