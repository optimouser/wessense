(function() {

  var heroes = {
    'role_1_0': "<b>Human Knight</b><br><small>Heavy Armor, Hates Magic Users, Strike!</small>",
    'role_1_1': "<b>Human Mage</b><br><small> Magic User, Hates Undead, Magical Shield</small>",
    'role_2_0': "<b>Elven Ranger</b><br><small>Expert Archer, Hates Undead, Instant Kill, Friend of Woods</small>",
    'role_2_1': "<b>Elven Fighter</b><br><small>Expert Swordsman, Hates Undead, Blade Virtue, Friend of Woods</small>",
    'role_3_0': "<b>Dwarven Scout</b><br><small>Throws Hatchets, Hates Orcs, Deadly Hatchets, Mountain Expert</small>",
    'role_3_1': "<b>Dwarven Thunderer</b><br><small>Expert Musketeer, Hates Orcs, Mountain Expert</small>",
    'role_4_0': "<b>Human Thief</b><br><small>Low HP, Deadly Daggers. Hates Undead and Magic Users, Terrain Master</small>",
    'role_4_1': "<b>Human Cavalier</b><br><small>Heavy Armor, Hates Orcs, Crossbow Mastery</small>"
  };

  var land_param_defaults = [ 1, 2, 2, 2, 2];
  var land_param_key = ['game_difficulty', 'map_size_factor', 'resource_factor', 'monsters_factor', 'animation_speed'];
  var land_param_values = [
    [0.5, 1.0, 2.0],
    [1.20, 1.15, 1.10, 1.05, 1.00],
    [0.30, 0.60, 1.00, 1.50, 2.00],
    [0.50, 0.75, 1.00, 1.25, 2.00],
    [2.00, 1.50, 1.00, 0.75, 0.50]
  ];

GAME.Dialogs = GAME.Dialogs || {
  mCurrentScreen: 0,
  mQuestScreens: [ 'Intro', 'Rescue', 'Optional', 'Elven', 'Dwarven', 'Human', 'Special', 'Teleport', 'Departure' ],
  mCurrentHelpPage: 0,
  mHelpTexts: [
    "<b>Controls.</b><p>Click tile to move or attack. Press 'backspace' or tap green \"Current Turn\" indicator to skip turns. Press \"PgUp\" / \"PgDn\" or use OPTIONS menu to change tile scale.</p><b>Strategy.</b><p>Tiles provide defense bonus to your hero, displayed in the bottom-left corner of the tile (mouseover). Make sure that your position is providing best defense rating when you engage into combat.</p><p>Be wise with ranged attacks - make sure that enemy has to walk at least two tiles before reaching your mage. Use 'Time' ability to escape unwanted melee combat. Melee units may want to use 'Time' ability to get closer to enemy units equipped with ranged weapons.</p><b>Monsters</b><p>There are neutral, aggressive and friendly monsters, marked by gray, pink and green markers accordingly. Neutral monsters will ignore your character unless it comes close to them - this will make them aggressive. Friendly monsters/units will follow player, but will not attack. Aggressive monsters will do their best to kill player. Life is tough on this island. Monsters may possess various abilities, like ranged attacks or regeneration - be warned. When monster is killed, there is a chance that it will drop some useful item, like healing potion or magical weapon.</p>",
    "<b>Quests</b><p>'Easy' game difficulty level allows to see ALL quest locations on the World Map, including secondary quests. 'Normal' level Worldmap displays just primary quest locations. 'Hard' level is hard, it provides no help with quest locations, so you have to discover them completely on your own.</p><p>Completion of the main quest ends game, so make sure you have done all secondary, optional and special quests before you finish main quest.</p>",
    "<b>Damage Modifiers</b><p>There are many damage modifiers in the game. For example, if Character has \"Hates XXX\" trait, than it will deal x1.5 damage to the enemies of type XXX.</p><p>Also, day/night cycle matters for Undead and Orcs. Undead will do up to x2 of their regular damage at night and x1.33 more at evenings. They have reduced damage during day x0.85, and mornings x0.95.</p><p>Orcs do x1.1 damage during twilight hours in the morning/eventing, and x0.95 during the day.</p><p>Human Thief characters do x1.2 damage during night, and x1.1 during mornings and evenings.</p><p>There are spells which affect damage too. For example, Entangle will reduce the damage inflicted by the entangled unit by 50 percent (applied after all other modifiers!).</p>",
    "<b>Armor Modifiers</b><p>All creatures in game have armor defense rating, which is a derivative from unit\'s armor, tile defense bonus/penalty and various spell effects.</p><p>There are minimal and maximal values for the Armor protection. After all modifiers applied, armor rating can never be lower than -50 percent (which means increased damage taken), and can never be higher than 95 percent. Note that there are natural upper limits for different classes as well, but it is always lower than 95 percent protection.</p><p>Entangled creatures receive large penalty to their armor rating.</p><p>Human Mage character has permanent Magical Shield ability, which provides a 25 percent chance to absorb incoming damage, rendering enemy\'s attack ineffective.</p>"
  ],
  mShopMode: 'buy'
};

GAME.Dialogs.DisplayShopMagic = function() {

  if ( $('#shopmagicdialog').length > 0 ) {
    $('#shopmagicdialog').dialog('destroy').remove();
  }
    var text = '<div id="shopmagicdialog" title="Magic Shop: buy spells here..">';
    text += '<img src="img/portraits/portrait_shop_magic.gif" style="position: relative; bottom: 0; left: 0;">';
    text += '<div style="position: absolute; top: 20px; right: 20px; width: 610px;" id="buy_container_magic" class="disableSelection"></div>';
    text += '</div>';
  $('body').append(text);
  $('#buy_container_magic').append('<div class="img_money img_stat">Gold</div> <div class="val_money gm_val">'+GAME.player.mCash+'</div>');

  $('#buy_container_magic').append('<input type="button" class="button_shop_magic_buy" value="MODE: BUY" />');
  $('.button_shop_magic_buy').hide(0).click(function() {
    GAME.Dialogs.mShopMode = 'sell';
    GAME.Dialogs.DisplayShopMagic();
        return false;
    }).mouseup( function(e) { return false; } );

  $('#buy_container_magic').append('<input type="button" class="button_shop_magic_sell" value="MODE: SELL" />');
  $('.button_shop_magic_sell').hide(0).click(function() {
    GAME.Dialogs.mShopMode = 'buy';
    GAME.Dialogs.DisplayShopMagic();
        return false;
    }).mouseup( function(e) { return false; } );

  $('#buy_container_magic').append('<br>');

  if ( GAME.Dialogs.mShopMode === 'buy' ) {
    $('.button_shop_magic_sell').hide(0);
    $('.button_shop_magic_buy' ).show(0);
  } else if ( GAME.Dialogs.mShopMode === 'sell' ) {
    $('.button_shop_magic_buy' ).hide(0);
    $('.button_shop_magic_sell').show(0);
  }

  var sp = GAME.Buttons.mSpells;
  for ( var i in sp ) {
    if ( GAME.Dialogs.mShopMode === 'buy' && GAME.player.mMagic[i] < 0 ) { continue; }
    else if ( GAME.Dialogs.mShopMode === 'sell' && GAME.player.mMagic[i] <= 0 ) { continue; }
    var item = $('<div style="width: 200px; display: inline-block; border-top: 1px dashed silver;" data-name="'+i+'"></div>');
    item.append( $('<div class="'+sp[i][1]+' gm_spells" data-spell="'+i+'">'+sp[i][0]+'<br>'+GAME.player.mMagic[i]+'</div>') );
    item.append( $('<div class="gm_val" style="color: gold; font-size: 20px; float: right;">'+ ( ( GAME.Dialogs.mShopMode === 'sell' ) ? ( sp[i][4] - 1 ) : ( sp[i][4] ) ) +' gold</div>') );
    if ( ( GAME.Dialogs.mShopMode === 'buy' && GAME.player.mCash < sp[i][4] )
      || ( GAME.Dialogs.mShopMode === 'sell' && GAME.player.mMagic[i] <= 0 ) ) {
      item.addClass('desaturate');
      item.hover(
        function() {
          $(this).css({'background-color': '#700'});
        },
        function() {
          $(this).css({'background-color': ''});
        }
      );
    } else {
      item.hover(
        function() {
          $(this).css({'background-color': '#070'});
        },
        function() {
          $(this).css({'background-color': ''});
        }
      );
      item.click( function() {
        if ( GAME.Dialogs.mShopMode === 'buy' ) {
          GAME.player.mCash -= parseInt( GAME.Buttons.mSpells[ $(this).data('name') ][4]);
          GAME.player.mMagic[ $(this).data('name') ] += 1;
          GAME.Dialogs.DisplayShopMagic();
          GAME.Buttons.Show();
        } else if ( GAME.Dialogs.mShopMode === 'sell' ) {
          GAME.player.mCash += parseInt( GAME.Buttons.mSpells[ $(this).data('name') ][4]) - 1;
          GAME.player.mMagic[ $(this).data('name') ] -= 1;
          GAME.Dialogs.DisplayShopMagic();
          GAME.Buttons.Show();
        }
      });
    }
    $('#buy_container_magic').append( item );
  }

    $("#shopmagicdialog").dialog({
        autoOpen: true,
        width: 1020,
    height: 520,
    closeOnEscape: false,
    minHeight: "auto",
        modal: true,
        dialogClass: "no-close",
        buttons: {
      'Leave': function() {
                $( this ).dialog( "close" );
      }
    }
  });

};

GAME.Dialogs.DisplayShopWeapons = function() {

  function update_item( item, price ) {
    item.unbind('mouseenter mouseleave');
    item.unbind('click');
    if ( GAME.player.mCash < price ) {
      item.addClass('desaturate');
    } else {
      item.click( function() {
        GAME.player.mCash -= price;
        if ( $(this).data('name') === 'hp' ) {
          GAME.player.mHP[1] += 1;
        } else {
          GAME.player[ $(this).data('name') ] += 1;
        }
        GAME.player.UpdateOverlay();
        GAME.Dialogs.DisplayShopWeapons();
      });
    }
    item.hover(
      function() {
        if ( GAME.player.mCash >= price ) {
          $(this).css({'background-color': '#070'});
          $(this).click(function() {
            GAME.Notifications.Post('You have bought an extra training', 'good');
          });
        } else {
          $(this).css({'background-color': '#700'});
          $(this).click(function() {
            GAME.Notifications.Post('Not enough gold to buy this training', 'bad');
          });
        }
      },
      function() {
        $(this).css({'background-color': ''});
      }
    );
  };

  if ( $('#shopweaponsdialog').length > 0 ) {
    $('#shopweaponsdialog').dialog('destroy').remove();
  }
    var text = '<div id="shopweaponsdialog" title="Weapons Shop: train combat skills here">';
    text += '<img src="img/portraits/portrait_shop_weapons.gif" style="position: relative; top: 0; left: 0;">';
    text += '<div style="position: absolute; top: 20px; right: 20px; width: 350px;" id="buy_container_weapons" class="disableSelection"></div>';
    text += '</div>';
  $('body').append(text);

  $('#buy_container_weapons').append('<div class="img_money img_stat">Gold</div> <div class="val_money gm_val">'+GAME.player.mCash+'</div>');
  $('#buy_container_weapons').append('<br><br><br>');

  var price = 0;

  if ( $('.img_hth:visible').length > 0 ) {
    price = 9;
    var item = $('<div style="width: 300px; display: inline-block; border-top: 1px dashed silver;" data-name="mHTH"></div>');
    item.append( $('.img_hth').clone() );
    item.append( $('.val_hth').clone() );
    item.append( $('<div class="gm_val" style="color: gold; font-size: 20px; float: right;">'+price+' gold</div>') );
    update_item(item, price);
    $('#buy_container_weapons').append(item);
    $('#buy_container_weapons').append('<br>');
  }

  if ( $('.img_rng:visible').length > 0 ) {
    price = 12;
    var item = $('<div style="width: 300px; display: inline-block; border-top: 1px dashed silver;" data-name="mRNG"></div>');
    item.append( $('.img_rng').clone() );
    item.append( $('.val_rng').clone() );
    item.append( $('<div class="gm_val" style="color: gold; font-size: 20px; float: right;">'+price+' gold</div>') );
    update_item(item, price);
    $('#buy_container_weapons').append(item);
    $('#buy_container_weapons').append('<br>');
  }

    var item = $('<div style="width: 300px; display: inline-block; border-top: 1px dashed silver;" data-name="mDEF"></div>');
    price = 10;
    item.append( $('.img_def').clone() );
    item.append( $('.val_def').clone() );
    item.append( $('<div class="gm_val" style="color: gold; font-size: 20px; float: right;">'+price+' gold</div>') );
    update_item(item, price);
    $('#buy_container_weapons').append(item);
    $('#buy_container_weapons').append('<br>');

    item = $('<div style="width: 300px; display: inline-block; border-top: 1px dashed silver; border-bottom: 1px dashed silver;" data-name="hp"></div>');
    price = 6;
    item.append( $('.img_hp').clone() );
    item.append( $('<div class="val_hp gm_val">'+GAME.player.mHP[1]+'</div>') );
    item.append( $('<div class="gm_val" style="color: gold; font-size: 20px; float: right;">'+price+' gold</div>') );
    update_item(item, price);
    $('#buy_container_weapons').append(item);
    $('#buy_container_weapons').append('<br>');

    $("#shopweaponsdialog").dialog({
        autoOpen: true,
        width: 800,
    height: 510,
    closeOnEscape: false,
    minHeight: "auto",
        modal: true,
        dialogClass: "no-close",
        buttons: {
      'Leave': function() {
                $( this ).dialog( "close" );
      }
    }
  });
};

GAME.Dialogs.DisplayHelpDialog = function() {
  if ( $('#helpdialog').length > 0 ) {
    $('#helpdialog').dialog('destroy').remove();
  }
    var text = '<div id="helpdialog" title="Help"></div>';
  $('body').append(text);
    $("#helpdialog").dialog({
        autoOpen: true,
        width: 626,
    height: 565,
    closeOnEscape: false,
    minHeight: "auto",
        modal: true,
        dialogClass: "no-close",
        buttons: {
            'Next': function() {
        GAME.Dialogs.mCurrentHelpPage += 1;
        if ( GAME.Dialogs.mCurrentHelpPage >= GAME.Dialogs.mHelpTexts.length ) {
          GAME.Dialogs.mCurrentHelpPage = 0;
        }
        $('#helpdialog').html(GAME.Dialogs.mHelpTexts[ GAME.Dialogs.mCurrentHelpPage ] );
            },
      'Close': function() {
                $( this ).dialog( "close" );
      }
    }
  });
  $('#helpdialog').html(this.mHelpTexts[ this.mCurrentHelpPage ] );
};

GAME.Dialogs.DisplayConfigDialog = function() {
  if ( $('#configdialog').length > 0 ) {
    $('#configdialog').dialog('destroy').remove();
  }
    var text = '<div id="configdialog" title="Configuration Options">';
    text += '<div id="configuration_options">';
    text += '<table border=0 width="100%">';
    text += '<tr><th colspan=3>GAME OPTIONS</th></tr>';
  text += '<tr><td colspan=3><hr></td></tr>';
    text += '<tr><td width="50%">Display enemies on Minimap</td><td width="25%"><div id="slider_minimap"></div></td><td align="right"><div id="slider_minimap_text"></div></td></tr>';
  text += '<tr><td colspan=3><hr></td></tr>';
    text += '<tr><td>Zoom Level</td><td colspan=2><input type="button" value="Zoom In" id="config_zoom_in"> <input type="button" value="Zoom Reset" id="config_zoom_reset"> <input type="button" value="Zoom Out" id="config_zoom_out"></td></tr>';
  text += '<tr><td colspan=3><hr></td></tr>';
    text += '</table>';
  text += '</div>';
  text += '</div>';
  $('body').append(text);
    $("#configdialog").dialog({
        autoOpen: true,
        width: 600,
    height: 300,
    closeOnEscape: false,
    minHeight: "auto",
        modal: true,
        dialogClass: "no-close",
        buttons: {
      'Close': function() {
                $( this ).dialog( "close" );
      }
    }
  });
  if ( GAME.options.minimap_display_monsters === true ) {
    $('#slider_minimap_text').text('true');
  } else {
    $('#slider_minimap_text').text('false');
  }

    $('#slider_minimap').slider({
        value: GAME.options.minimap_display_monsters === true ? 1 : 0,
        min: 0,
        max: 1,
        step: 1,
        slide: function( event, ui ) {
      if ( ui.value === 1 ) {
              $('#slider_minimap_text').text( 'true' );
        GAME.options.minimap_display_monsters = true;
      } else {
        $('#slider_minimap_text').text( 'false' );
        GAME.options.minimap_display_monsters = false;
      }
      GAME.Display.RenderMinimap();
        }
    });
  $('#config_zoom_in, #config_zoom_out, #config_zoom_reset').css({'display': 'inline-block !important'}).button();

  $('#config_zoom_in').click( function() {
    GAME.Display.ZoomIn();
            GAME.Display.RenderLand();
            GAME.Display.RenderObjects();
            GAME.Render();
  });
  $('#config_zoom_reset').click( function() {
    GAME.Display.ZoomReset();
            GAME.Display.RenderLand();
            GAME.Display.RenderObjects();
            GAME.Render();
  });
  $('#config_zoom_out').click( function() {
    GAME.Display.ZoomOut();
            GAME.Display.RenderLand();
            GAME.Display.RenderObjects();
            GAME.Render();
  });

};

GAME.Dialogs.DisplayGameScoreDialog = function() {
  if ( $('#gamescoredialog').length > 0 ) {
    $('#gamescoredialog').dialog('destroy').remove();
  }

    var text = '<div id="gamescoredialog" title="Game Score Review">';
  text += '<table border="0" cellpadding="2" class="tbl_gamescore">';
  text += '<thead><tr><th colspan="4" style="color: #FF7F00; font-size: 24px;">GAME SCORE</th></tr></thead>';
  text += '<tbody>';
    text += '<tr align="center"> <td> <div id="img_tower"></div> <div id="img_tower_key"></div>     </td> <td>Main Quest Completed</td>       <td><div id="gs_mainquest"></div></td>  <td> <div id="gs_mainquest_pts"></div> </td> </tr>';
    text += '<tr align="center"> <td> <div id="img_evil_flag"></div> <div id="img_orc_flag"></div>    </td> <td>Secondary Quests Completed </td>  <td> <div id="gs_secquest"></div> / 2 </td>   <td> <div id="gs_secquest_pts"></div> </td> </tr>';
    text += '<tr align="center"> <td> <div id="img_necklace"></div> <div id="img_holy_book"></div> <div id="img_flaming_sword"> </td> <td>Optional Quests Completed </td>   <td> <div id="gs_optquest"></div> / 3 </td> <td> <div id="gs_optquest_pts"></div> </td> </tr>';
    text += '<tr align="center"> <td>';
    if ( GAME.data['role'].startsWith('role_1') ) {
      text += '<div id="img_potion_youth"></div>';
    } else if ( GAME.data['role'].startsWith('role_2') ) {
      text += '<div id="img_caged_unicorn"></div>';
    } else if ( GAME.data['role'].startsWith('role_3') ) {
      text += '<div id="img_mine"></div>';
    } else if ( GAME.data['role'].startsWith('role_4') ) {
      text += '<div id="img_fugitive"></div>';
    }
    text += '</td> <td>Special Quest Completed </td>    <td> <div id="gs_specquest"></div> </td>  <td> <div id="gs_specquest_pts"></div> </td> </tr>';
    text += '<tr align="center"> <td>Monsters Killed: <div id="gs_monsters_killed"></div> / <div id="gs_monsters_total"></div> </td><td> <div id="gs_monsters_pts"></div> </td> ';
    text += '<td>Spells Cast: <div id="gs_spells"></div> </td> <td> <div id="gs_spells_pts"></div> </td> </tr>';
    text += '<tr align="center"> <td>Turns Spent: <div id="gs_turns"></div> </td> <td> <div id="gs_turns_pts"></div> </td> <td> </td> <td> </td> </tr>';
    text += '<tr align="center"> <td colspan="4"> <hr> </td> </tr>';
    text += '<tr> <td colspan="4"> TOTAL: <div id="gs_total_pts"></div> POINTS </td> </tr>';
  text += '</tbody>';
  text += '</table>';

  // major quest completed: 1+1
  // secondary quests completed: 2
  // optional quests completed: 3
  // special quest completed: 1
  // N monsters killed
  // N spells cast
  // N turns spent

    text += '</div>';
  $('body').append(text);

  var total_points = 0;

  var gps = GAME.player.mStats;

  // primary quest
  if ( gps['tower_key_found'] === true && gps['hostage_released'] === true ) {
    $('#gs_mainquest').css({'color': '#0F0'}).text('YES');
    $('#gs_mainquest_pts').css({'color': '#0F0'}).text(' = 1000 pts');
    total_points += 1000;
  } else {
    $('#gs_mainquest').css({'color': '#F00'}).text('NO');
    $('#gs_mainquest_pts').css({'color': '#F00'}).text(' = 0 pts');
  }

  // secondary quests
  var secondary_quests_completed = 0;
  var secondary_quests_points = 0;
  if ( gps['evil_boss_killed'] === true ) {
    secondary_quests_completed += 1;
    total_points += 750;
    secondary_quests_points += 750;
  }
  if ( gps['orc_boss_killed'] === true ) {
    secondary_quests_completed += 1;
    total_points += 500;
    secondary_quests_points += 500;
  }
  $('#gs_secquest').text( secondary_quests_completed );
  $('#gs_secquest_pts').text( ' = ' + secondary_quests_points + ' pts');

  // optional quests
  var optional_quests_completed = 0;
  var optional_quests_points = 0;
  if ( gps['necklace_found'] === true ) {
    optional_quests_completed += 1;
    total_points += 250;
    optional_quests_points += 250;
  }
  if ( gps['flamingsword_found'] === true ) {
    optional_quests_completed += 1;
    total_points += 250;
    optional_quests_points += 250;
  }
  if ( gps['book_postament_found'] === true ) {
    optional_quests_completed += 1;
    total_points += 250;
    optional_quests_points += 250;
  }
  $('#gs_optquest').text( optional_quests_completed );
  $('#gs_optquest_pts').text( ' = ' + optional_quests_points + ' pts');

  // special quest
  if (   ( GAME.data['role'].startsWith('role_1') === true && gps['potion_of_youth_found'] === true )
    || ( GAME.data['role'].startsWith('role_2') === true && gps['unicorn_released'] === true )
    || ( GAME.data['role'].startsWith('role_3') === true && gps['mines_cleared'][0] === gps['mines_cleared'][1] )
    || ( GAME.data['role'].startsWith('role_4') === true && gps['fugitive_killed'] === true ) ) {
      $('#gs_specquest').css({'color': '#0F0'}).text('YES');
      $('#gs_specquest_pts').css({'color': '#0F0'}).text(' = 500 pts');
      total_points += 500;
  } else {
      $('#gs_specquest').css({'color': '#F00'}).text('NO');
      $('#gs_specquest_pts').css({'color': '#F00'}).text(' = 0 pts');
  }

  // monsters
  $( '#gs_monsters_killed' ).text( gps['monsters_killed'][0] );
  $( '#gs_monsters_total'  ).text( gps['monsters_killed'][1] );
  var monsters_pts = total_points * gps['monsters_killed'][0] / gps['monsters_killed'][1];
  $( '#gs_monsters_pts'  ).text( ' = ' + monsters_pts + ' pts');
  total_points += monsters_pts;

  // turns
  $('#gs_turns').text( GAME.mTime.mTurns );
  var turns_pts = ( 5000 - GAME.mTime.mTurns );
  $('#gs_turns').text( GAME.mTime.mTurns );
  $('#gs_turns_pts').text( ' = ' + turns_pts + ' pts');
  total_points += turns_pts;

  // spells
  $('#gs_spells').text( gps['spells_cast'] );
  var spells_pts = gps['spells_cast'] * 10;
  $('#gs_spells_pts').text( ' = ' + spells_pts + ' pts');
  total_points += spells_pts;

  // total
  $( '#gs_total_pts' ).css({'color': '#0F0'}).text( total_points );

    $("#gamescoredialog").dialog({
        autoOpen: true,
        width: 850,
    height: 560,
    closeOnEscape: false,
    minHeight: "auto",
        modal: true,
        dialogClass: "no-close",
        buttons: {
            'Start New Game': function() {
                $( this ).dialog( "close" );
        location.reload();
            }
    }
  });
};

GAME.Dialogs.DisplayGameOverGoodDialog = function() {
  if ( $('#gameovergooddialog').length > 0 ) {
    $('#gameovergooddialog').dialog('destroy').remove();
  }
    var text = '<div id="gameovergooddialog" title="Congratulations!"><center><img src="img/gameover_good.jpg" border=0></center></div>';
  $('body').append(text);
    $("#gameovergooddialog").dialog({
        autoOpen: true,
        width: 626,
    height: 565,
    closeOnEscape: false,
    minHeight: "auto",
        modal: true,
        dialogClass: "no-close",
        buttons: {
      'View Game Score': function() {
                $( this ).dialog( "close" );
        GAME.Dialogs.DisplayGameScoreDialog();
      },
            'Start New Game': function() {
                $( this ).dialog( "close" );
        location.reload();
            }
    }
  });
};

GAME.Dialogs.DisplayGameOverBadDialog = function() {
  if ( $('#gameoverbaddialog').length > 0 ) {
    $('#gameoverbaddialog').dialog('destroy').remove();
  }
    var text = '<div id="gameoverbaddialog" title="Ouch..This tale is not that heroic, afterall.."><center><img src="img/gameover_bad.jpg" border=0></center></div>';
  $('body').append(text);
    $("#gameoverbaddialog").dialog({
        autoOpen: true,
        width: 626,
    height: 565,
    closeOnEscape: false,
    minHeight: "auto",
        modal: true,
        dialogClass: "no-close",
        buttons: {
            'Restart Game': function() {
                $( this ).dialog( "close" );
        location.reload();
            },
            'Resurrect Hero': function() {
                $( this ).dialog( "close" );
        GAME.ResurrectHero();
            }
    }
  });
};

GAME.Dialogs.QuestScreenIntro = function() {
//  console.log( GAME.data['role'] );
  var txt  = '<center> <img src="img/portraits/'+GAME.data['role']+'.gif">';
    txt += '<p>You do not remember what was the idea behind the decision to leave your home and become an adventurer. New places, new people - all that amazed you since very young age. Now you are ready for whatever awaits you beyound horizon.</p></center>';
  $('#mainquestdialog').html(txt);
};

GAME.Dialogs.QuestScreenRescue = function() {
  var txt = '<div style="padding: 0; margin: 0; position: absolute; top: 20px; right: 20px; border: 1px solid #FFF; background-color: #CC9955;"><img src="img/portraits/'+GAME.data['role']+'.gif" style="width: 100px; height: 100px;"></div>';
    txt += '<div style="position: absolute; top: 20px; left: 20px; border: 1px solid #FFF; background-color: #BBDD77;"><img src="img/portraits/portrait_'+GAME.data['hostage']+'.gif" style="width: 100px; height: 100px;"></div>';
    txt += '<div style="position: absolute; top: 240px; left: 34px; border: 1px solid #999; background-image: url(img/tilesets.png);  background-position: -504px -288px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<div style="position: absolute; top: 332px; left: 34px; border: 1px solid #999; background-image: url(img/tilesets.png);  background-position: -648px -1656px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<center><img src="img/portraits/portrait_messenger.gif">';
    txt += '<p style="margin: 0; padding: 0;"><small>( you did\'n wait too long for an adventure to begin, do you? )</small></p><p style="margin: 0; padding: 0;">Hey, I\'m Kandi. You seem to be a capable hero for the problem I need to resolve, and time is running out fast. Long story short: our island is in trouble and you are our only hope! Our kind Ruler, ' + GAME.data[ GAME.data['hostage'] + '_name' ] + ', was captured and was locked into the dark tower by Forces of Evil. Please help!</p></center></center>';
  $('#mainquestdialog').html(txt);
};

GAME.Dialogs.QuestScreenOptional = function() {
  var txt = '<div style="position: absolute; top: 20px; right: 20px; border: 1px solid #FFF; background-color: #CC9955;"><img src="img/portraits/'+GAME.data['role']+'.gif" style="width: 100px; height: 100px;"></div>';
    txt += '<div style="position: absolute; top: 20px; left: 20px; border: 1px solid #FFF; background-color: #777;"><img src="img/portraits/portrait_'+GAME.data['enemy']+'.gif" style="width: 100px; height: 100px;"></div>';
    txt += '<div style="position: absolute; top: 140px; left: 20px; border: 1px solid #FFF; background-color: #777;"><img src="img/portraits/portrait_orc_boss.gif" style="width: 100px; height: 100px;"></div>';
    txt += '<div style="position: absolute; top: 240px; right: 34px; border: 1px solid #999; background-image: url(img/tilesets.png);  background-position: -648px -3456px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<div style="position: absolute; top: 332px; right: 34px; border: 1px solid #999; background-image: url(img/tilesets.png);  background-position: -576px -3456px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<center><img src="img/portraits/portrait_messenger.gif">';
    txt += '<p>Foul Orcs helped evil '+ GAME.data[ GAME.data['enemy'] + '_name' ] +' to take over our tiny island. They caught us totally unprepared for a battle. Now they are destroying our farms and crops. We will be eternally grateful if you could spare us from both ' + GAME.data[ GAME.data['enemy'] + '_name' ] + ' and Orcs!</p></center>';
  $('#mainquestdialog').html(txt);
};

GAME.Dialogs.QuestScreenElven = function() {
  var txt = '<div style="position: absolute; top: 20px; right: 20px; border: 1px solid #FFF; background-color: #CC9955;"> <img src="img/portraits/'+GAME.data['role']+'.gif" style="width: 100px; height: 100px;"> </div>';
    txt += '<div style="float: left;"><img src="img/portraits/portrait_elven_queen.gif">';
    txt += '<div style="position: absolute; top: 140px; right: 34px; border: 1px solid #999; background-image: url(img/tilesets.png);  background-position: -432px -1512px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<center><p>Hello, brave adventurer! I am Galedladhrae, Queen of Elves, and I need your help. ' + GAME.data[ GAME.data['enemy'] + '_name' ] + ' has stolen my favorite magical necklace, and is preparing to use its power in dark rituals. Please retrieve that necklace until it is too late.</p></center></div>';
  $('#mainquestdialog').html(txt);
};

GAME.Dialogs.QuestScreenDwarven = function() {
  var txt = '<div style="position: absolute; top: 20px; right: 20px; border: 1px solid #FFF; background-color: #CC9955;"> <img src="img/portraits/'+GAME.data['role']+'.gif" style="width: 100px; height: 100px;"> </div>';
    txt += '<div style="fleat: left;"><img src="img/portraits/portrait_dwarven_king.gif" style="display: inline;">';
    txt += '<div style="position: absolute; top: 140px; right: 34px; border: 1px solid #999; background-image: url(img/tilesets.png);  background-position: -504px -1512px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<center><p>Hah, you. Yes, you - with poorly maid weapons and wide smile. I am Thoradafr, Leader of Grey Clans, so listen carefully. This tiny island is a home for a banished dwarven tribe. Unfortunately, they took one of our Holy Books into exile, and you must find and return that book for us. Dismissed.</p></center></div>';
  $('#mainquestdialog').html(txt);
};

GAME.Dialogs.QuestScreenHuman = function() {
  var txt = '<div style="position: absolute; top: 20px; right: 20px; border: 1px solid #FFF; background-color: #CC9955;"> <img src="img/portraits/'+GAME.data['role']+'.gif" style="width: 100px; height: 100px;"> </div>';
    txt += '<div style="float: left;"><img src="img/portraits/portrait_human_general.gif">';
    txt += '<div style="position: absolute; top: 140px; right: 34px; border: 1px solid #999; background-image: url(img/tilesets.png);  background-position: -504px -2376px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<center><p>Hmm.. You are going to the island, right? I have a request, highly important one. Royal investigators reported that thieves, who have stolen our Famous Relic, The Flaming Sword, might be hiding there. Please kill them and return the relic to Royal Treasury.</p></center></div>';
  $('#mainquestdialog').html(txt);
};

GAME.Dialogs.QuestScreenSpecial = function() {
  var role = GAME.data['role'];
  var txt = '';
  if ( role.startsWith('role_1') === true ) {
    txt = '<div style="position: absolute; top: 20px; left: 20px; border: 1px solid #FFF; background-color: #CC9955;"> <img src="img/portraits/'+GAME.data['role']+'.gif" style="width: 100px; height: 100px;"> </div>';
    txt += '<div style="position: absolute; top: 140px; left: 34px; border: 1px solid #999; background-image: url(img/tilesets.png);  background-position: -648px -1944px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<center><img src="img/portraits/portrait_healer.gif">';
    txt += '<p>Oh, great that you are still here. I am local healer, Johanna. I\'ve just got some hint that Trolls of that island might posess the Potion of Youth. I will appreciate if you can bring me a sample - it may cure many deadly deceases instantly.</p></center>';
  } else if ( role.startsWith('role_2') === true ) {
    txt = '<div style="position: absolute; top: 20px; right: 20px; border: 1px solid #FFF; background-color: #CC9955;"> <img src="img/portraits/'+GAME.data['role']+'.gif" style="width: 100px; height: 100px;"> </div>';
    txt += '<div style="float: left;"><img src="img/portraits/portrait_elven_queen.gif">';
    txt += '<div style="position: absolute; top: 140px; right: 34px; border: 1px solid #999; background-image: url(img/neutrals.png);  background-position: 0px -936px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<center><p>Dear, High Queen of Elves has special request for you. We cannot trust it to humans or dwarves, it must be somebody of our kind. Please find and release the Spirit of the Island, white unicorn. Foul Orcs captured it and put in a cage - island is dying and Nature calls for our intervention.</p></center></div>';
  } else if ( role.startsWith('role_3') === true ) {
    txt = '<div style="position: absolute; top: 20px; right: 20px; border: 1px solid #FFF; background-color: #CC9955;"> <img src="img/portraits/'+GAME.data['role']+'.gif" style="width: 100px; height: 100px;"> </div>';
    txt += '<div style="float: left;"><img src="img/portraits/portrait_dwarven_king.gif">';
    txt += '<div style="position: absolute; top: 140px; right: 34px; border: 1px solid #999; background-image: url(img/tilesets.png);  background-position: -576px -2232px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<center><p>Young one, Dwarven Clans have a task for you. There are long-abandoned gold mines on the island, which you need to put back to work. Find all mines and kill all creatures which may inhabit them now. This will help us to fund dwarven outposts and restore trade activity in that region. Dismissed.</p></center></div>';
  } else {
    txt = '<div style="position: absolute; top: 20px; right: 20px; border: 1px solid #FFF; background-color: #CC9955;"> <img src="img/portraits/'+GAME.data['role']+'.gif" style="width: 100px; height: 100px;"> </div>';
    txt += '<div style="float: left;"><img src="img/portraits/portrait_thiefleader.gif">';
    txt += '<div style="position: absolute; top: 140px; right: 34px; border: 1px solid #999; background-image: url(img/enemies.png);  background-position: 0px -3024px; background-color: #555; width: 72px; height: 72px;"></div>';
    txt += '<center><p>Psst! I am Angrol Arthasar, Master of the Thieves Guild. I have an quick job for you, generous pay. Agreed? Okay, now what needs to be done: one of my leutenants decided to form his own guild. He took our stash of rubies and escaped to that very same island you will visit soon. I can not let it go, traitor should be punished. Kill him and tell everyone what happened. Ciao.</p></center></div>';
  }
  $('#mainquestdialog').html(txt);
};

GAME.Dialogs.QuestScreenTeleport = function() {
  var txt = '<div style="position: absolute; top: 20px; right: 20px; border: 1px solid #FFF; background-color: #CC9955;"> <img src="img/portraits/'+GAME.data['role']+'.gif" style="width: 100px; height: 100px;"> </div>';
    txt += '<div style="float: left;"><img src="img/portraits/portrait_silver_mage.gif">';
    txt += '<center><p>Hello, I am Jasper, head of the local Silver Mage Circle. I will teleport you and your ship to the island, along with the supplies we have gathered for you. Your ship will trigger reverse teleport automagically, so get back to it with the prisoner and we will take you back home safely.</p></center></div>';
  $('#mainquestdialog').html(txt);
};

GAME.Dialogs.QuestScreenDeparture = function() {
  var txt = '<center> <img src="img/map.png" style="width: 400px; height: 400px; border: 2px solid brown;">';
    txt += '<p> Your eyes blinked as Jasper waived his staff, and next thing you realized is that you are standing on the unknown, but obviously dangerous shore of the beautiful island.</p></center></div>';
  $('#mainquestdialog').html(txt);
};

GAME.Dialogs.DisplayMainQuestDialog = function() {
  if ( $('#mainquestdialog').length > 0 ) {
    $('#mainquestdialog').dialog('destroy').remove();
  }
  this.mCurrentScreen = 0;
    var text = '<div id="mainquestdialog" title="Main Quest">';
    text += '</div>';
  $('body').append(text);
  $("#mainquestdialog").dialog({
    autoOpen: true,
    width: 640,
    height: 620,
    closeOnEscape: false,
    minHeight: "auto",
        modal: true,
        dialogClass: "no-close",
        buttons: {
      'Prev' : function() {
        GAME.Dialogs.mCurrentScreen -= 1;
        if ( GAME.Dialogs.mCurrentScreen >= 0 ) {
          GAME.Dialogs['QuestScreen' + GAME.Dialogs.mQuestScreens[GAME.Dialogs.mCurrentScreen]]();
        } else {
          $( this ).dialog("close");
          GAME.Dialogs.DisplayHeroSelectionDialog();
        }
      },
      'Next' : function() {
        GAME.Dialogs.mCurrentScreen += 1;
        if ( GAME.Dialogs.mCurrentScreen < GAME.Dialogs.mQuestScreens.length ) {
          GAME.Dialogs['QuestScreen' + GAME.Dialogs.mQuestScreens[GAME.Dialogs.mCurrentScreen]]();
        } else {
          $( this ).dialog( "close" );
          GAME.Dialogs.DisplayLandSelectionDialog();
        }
      },
      'Skip Quest Intro': function() {
        $( this ).dialog( "close" );
        GAME.Dialogs.DisplayLandSelectionDialog();
      }
    }
  });

  GAME.Dialogs['QuestScreen' + GAME.Dialogs.mQuestScreens[GAME.Dialogs.mCurrentScreen]]();
};

GAME.Dialogs.DisplayQuestsDialog = function() {
  if ( $('#questsdialog').length > 0 ) {
    $('#questsdialog').dialog('destroy').remove();
  }
    var text  = '<div id="questsdialog" title="Status: Quests">';
    text += '<table border=0 width="100%">';
    text += '<tr><td class="q1"><div id="img_tower_key"></div></td><td class="q1" width="40%">&nbsp;Primary: <b>Find Tower Key</b></td> <td class="q3"><div id="img_necklace"></div></td><td class="q3" width="40%">&nbsp;Optional: <b>Search for an Elven Necklace</b></td> </tr>';
    text += '<tr><td class="q1"><div id="img_tower"></div></td><td class="q1">&nbsp;Primary: <b>Release Hostage</b></td> <td class="q3"><div id="img_holy_book"></div></td><td class="q3">&nbsp;Optional: <b>Return Dwarven Holy Book</b></td></tr>';
    text += '<tr><td class="q2"><div id="img_evil_flag"></div></td><td class="q2">&nbsp;Secondary: <b>Kill Evil Boss</b></td><td class="q3"><div id="img_flaming_sword"></div></td><td class="q3">&nbsp;Optional: <b>Find Flaming Sword</b></td></tr>';
    text += '<tr><td class="q2"><div id="img_orc_flag"></div></td><td class="q2">&nbsp;Secondary: <b>Kill Orc Boss</b></td>';
    if ( GAME.data['role'].startsWith('role_1') ) {
      text += '<td class="q4"><div id="img_potion_youth"></div><td class="q4">&nbsp;Special: <b>Get Potion of Youth</b></td></tr>';
    } else if ( GAME.data['role'].startsWith('role_2') ) {
      text += '<td class="q4"><div id="img_caged_unicorn"></div><td class="q4">&nbsp;Special: <b>Free Unicorn</b></td></tr>';
    } else if ( GAME.data['role'].startsWith('role_3') ) {
      text += '<td class="q4"><div id="img_mine"></div><td class="q4">&nbsp;Special: <b>Clear Gold Mines</b></td></tr>';
    } else if ( GAME.data['role'].startsWith('role_4') ) {
      text += '<td class="q4"><div id="img_fugitive"></div><td class="q4">&nbsp;Special: <b>Kill Fugitive</b></td></tr>';
    }
    text += '</table>';
    text += '</div>';
  $('body').append(text);

  var p = GAME.player.mStats;
  if ( p.necklace_found === true ) { $('#img_necklace').css({ 'background-color': '#0F0' }); } else { $('#img_necklace').css({ 'background-color': '#F00' }); }
  if ( p.flamingsword_found === true ) { $('#img_flaming_sword').css({ 'background-color': '#0F0' }); } else { $('#img_flaming_sword').css({ 'background-color': '#F00' }); }
  if ( p.potion_of_youth_found === true ) { $('#img_potion_youth').css({ 'background-color': '#0F0' }); } else { $('#img_potion_youth').css({ 'background-color': '#F00' }); }
  if ( p.book_postament_found === true ) { $('#img_holy_book').css({ 'background-color': '#0F0' }); } else { $('#img_holy_book').css({ 'background-color': '#F00' }); }
  if ( p.tower_key_found === true ) { $('#img_tower_key').css({ 'background-color': '#0F0' }); } else { $('#img_tower_key').css({ 'background-color': '#F00' }); }
  if ( p.hostage_released === true ) { $('#img_tower').css({ 'background-color': '#0F0' }); } else { $('#img_tower').css({ 'background-color': '#F00' }); }
  if ( p.unicorn_released === true ) { $('#img_caged_unicorn').css({ 'background-color': '#0F0' }); } else { $('#img_caged_unicorn').css({ 'background-color': '#F00' }); }
  if ( p.orc_boss_killed === true ) { $('#img_orc_flag').css({ 'background-color': '#0F0' }); } else { $('#img_orc_flag').css({ 'background-color': '#F00' }); }
  if ( p.evil_boss_killed === true ) { $('#img_evil_flag').css({ 'background-color': '#0F0' }); } else { $('#img_evil_flag').css({ 'background-color': '#F00' }); }
  if ( p.mines_cleared[0] === p.mines_cleared[1] ) { $('#img_mine').css({ 'background-color': '#0F0' }); } else { $('#img_mine').css({ 'background-color': '#F00' }); }
  if ( p.fugitive_killed === true ) { $('#img_fugitive').css({ 'background-color': '#0F0' }); } else { $('#img_fugitive').css({ 'background-color': '#F00' }); }

    $("#questsdialog").dialog({
        autoOpen: true,
        width: 760,
    closeOnEscape: false,
    minHeight: "auto",
        modal: true,
        dialogClass: "no-close",
        buttons: {
            'Close': function() {
                $( this ).dialog( "close" );
            }
        }
    });
};

GAME.Dialogs.ProceedWithNewGame = function() {
  GAME.progress_control.wait_pending(function() {
    if ( GAME.data['map_size_factor'] !== undefined ) {
      GAME.MapGen.mMapSizeFactor = GAME.data['map_size_factor'];
    }
    if ( GAME.data['resource_factor'] !== undefined ) {
      GAME.MapGen.mResourceFactor = GAME.data['resource_factor'];
    }
    if ( GAME.data['monsters_factor'] !== undefined ) {
      GAME.MapGen.mMonstersFactor = GAME.data['monsters_factor'];
    }
    if ( GAME.data['seed'] !== undefined ) {
      GAME.MapGen.mSeed = GAME.data['seed'];
    }

    GAME.progress_control.Add('Generating mask..', 'WORLD_MASK_GENERATION_PROGRESS', 'WORLD_MASK_GENERATED');
    GAME.progress_control.Add('Generating land..', 'LAND_GENERATION_PROGRESS', 'LAND_GENERATED');
    GAME.progress_control.Add('Generating swamps..', 'SWAMPS_GENERATION_PROGRESS', 'SWAMPS_GENERATED');
    GAME.progress_control.Add('Generating objects..', 'OBJECTS_GENERATION_PROGRESS', 'OBJECTS_GENERATED');
    GAME.progress_control.Add('Generating monsters..', 'MONSTERS_GENERATION_PROGRESS', 'MONSTERS_GENERATED');

    GAME.MapGen.Generate();
  })
}

GAME.Dialogs.DisplayIntroDialog = function() {
  if ( $('#introdialog').length > 0 ) {
    $('#introdialog').dialog('destroy').remove();
  }
  var text = '<div id="introdialog" title="W.Essense: rogue-like, inspired by Battle for Wesnoth and Wayward">';
  text += '<img src="img/splash.png" border=0 style="height: 400px; width: 650px;">';
  text += '<center><small><p>All graphics and art used in this game belong to <a class="disableSelection" href="http://www.wesnoth.org/">Battle for Wesnoth</a> project, published under GPL license. ';
  text += 'Most js codes of this game are published under MIT license and are allowed to be used anywhere without restrictions - but watch for exceptions, as external libraries may have different licenses. Some concepts were borrowed from the amazing <a href="http://www.unlok.ca/wayward/">Wayward</a> - survival rogue-like. W.Essense development is <a href="http://forums.wesnoth.org/viewtopic.php?f=13&t=40803">discussed here</a>.</p></center>';
  text += '</small></div>';
    $('body').append(text);

    $("#introdialog").dialog({
        autoOpen: true,
        width: 650,
    closeOnEscape: false,
    minHeight: "auto",
        modal: true,
        dialogClass: "no-close",
        buttons: {
          'New Game': function() {
            $( this ).dialog( "close" );
            GAME.Dialogs.DisplayHeroSelectionDialog();
          },
          'Feeling Lucky': function() {
            $( this ).dialog( "close" );
            GAME.data['role'] = $.gmShuffleArray($.map(heroes, function(_txt, r) { return r}))[0];

            GAME.data['seed'] = Math.random();
            $.each(land_param_key, function(i) {
               GAME.data[ this ] = land_param_values[i][window.localStorage['lsd_' + i] || land_param_defaults[i]];
            });

            GAME.Dialogs.ProceedWithNewGame();
          }
        }
    });

};

GAME.Dialogs.DisplayLandSelectionDialog = function() {
  if ( $('#landselectiondialog').length > 0 ) {
     $('#landselectiondialog').dialog('destroy').remove();
  }

    var text = '<div id="landselectiondialog" title="W.Essense: Online Rogue-like, inspired by Battle for Wesnoth and Wayward">';
    text += '<div id="introoptions">';
    text += '<table border=0 width="100%">';
    text += '<tr><th colspan=3>TUNE WORLD PARAMETERS</th></tr>';
    text += '<tr><td width="25%">Difficulty</td><td><div id="slider0"></div></td><td width="20%"><div id="slidertext0"></div></td></tr>';
    text += '<tr><td>Land Size</td><td><div id="slider1"></div></td><td width="20%"><div id="slidertext1"></div></td></tr>';
    text += '<tr><td>Resources</td><td><div id="slider2"></div></td><td><div id="slidertext2"></div></td></tr>';
    text += '<tr><td>Monsters</td><td><div id="slider3"></div></td><td><div id="slidertext3"></div></td></tr>';
    text += '<tr><td>World Seed</td><td colspan="2"> <input type="text" value="" id="intro_seed"></td></tr>';
  text += '<tr><td colspan=3><hr></td></tr>';
    text += '<tr><td>Animation Speed</td><td><div id="slider4"></div></td><td><div id="slidertext4"></div></td></tr>';
    text += '</table>';
    text += '</div>';
    text += '</div>';
  $('body').append(text);

  var textlabels = [
    ['Easy', 'Normal', 'Hard'],
    ['Tiny', 'Small', 'Average', 'Large', 'Huge'],
    ['Very Rare', 'Rare', 'Average', 'Generous', 'Abundant'],
    ['Very Rare', 'Rare', 'Average', 'Plenty', 'Hordes'],
    ['Very Slow', 'Slower', 'Normal', 'Faster', 'Fastest']
  ];

  $.each(textlabels, function(i) {
    $('#slider' + i).slider({
      min: 0,
      max: textlabels[i].length - 1,
      step: 1,
      slide: function(event, ui) {
        $('#slidertext' + i).text( textlabels[i][ui.value] );
      },
      change: function(event, ui) {
        $('#slidertext' + i).text( textlabels[i][ui.value] );
        GAME.data[land_param_key[i]] = land_param_values[i][ui.value];
        window.localStorage['lsd_' + i] = ui.value;
      }
    }).slider('value', window.localStorage['lsd_' + i] || land_param_defaults[i]);
  })

  $('#intro_seed').val(Math.random());
  $("#landselectiondialog").dialog({
    autoOpen: true,
    width: 640,
    height: 410,
    closeOnEscape: false,
    modal: true,
    dialogClass: "no-close",
    buttons: {
      'START ADVENTURE': function() {
        $( this ).dialog( "close" );
        GAME.data['seed'] = parseFloat( $('#intro_seed').val() );
        GAME.Dialogs.ProceedWithNewGame();
      }
    }
  });
};

GAME.Dialogs.DisplayHeroSelectionDialog = function() {

  if ( $('#herodialog').length > 0 ) {
    $('#herodialog').dialog('destroy').remove();
  }

    var text = '<div id="herodialog" title="W.Essense: Online Rogue-like, inspired by Battle for Wesnoth and Wayward">';
    text += '<table border=0 width="100%">';
    text += '<tr><td><img data-role="role_1_0" src="img/portraits/role_1_0.gif" class="disableSelection"></td><td><img data-role="role_2_0" src="img/portraits/role_2_0.gif" class="disableSelection"></td><td><img data-role="role_3_0" src="img/portraits/role_3_0.gif" class="disableSelection"></td><td><img data-role="role_4_0" src="img/portraits/role_4_0.gif" class="disableSelection"></td></tr>';
    text += '<tr><td><img data-role="role_1_1" src="img/portraits/role_1_1.gif" class="disableSelection"></td><td><img data-role="role_2_1" src="img/portraits/role_2_1.gif" class="disableSelection"></td><td><img data-role="role_3_1" src="img/portraits/role_3_1.gif" class="disableSelection"></td><td><img data-role="role_4_1" src="img/portraits/role_4_1.gif" class="disableSelection"></td></tr>';
    text += '<tr><td colspan="4"><div id="hero_desc"><b>Choose Your Hero</b><br><small>each hero has specific traits, choose wisely!</small></div></td></tr>';
    text += '</table>';
  text += '</div>';
  $('body').append(text);

  $( "#herodialog img" )
    .mouseenter(function() {
      $('#hero_desc').html(heroes[ $(this).data('role') ]);
    })
    .mouseleave(function() {
      $('#hero_desc').html('<b>Choose Your Hero</b><br><small>each hero has specific traits, choose wisely!');
    });

  $('#herodialog img').click(function() {
    var that = this;
    $('#herodialog img').each( function() {
      $(this).toggleClass('desaturate', that != this);
      $(this).unbind('mouseenter').unbind('mouseleave');
    });
    GAME.data['role'] = $(this).data('role');
    $('#hero_desc').html(heroes[ $(this).data('role') ]);
    $('#herodialog img').css({
      'background': 'radial-gradient(ellipse at center, #f8ffe8 0%,#e3f5ab 33%,#b7df2d 100%)',
      'border': '3px solid #555'
    });
    $(this).css({
      'background': 'radial-gradient(ellipse at center, #fefcea 0%,#f7bf09 100%)',
      'border': '3px solid #FFF'
    });
    $('#next_button').show(0);
  });

    $("#herodialog").dialog({
        autoOpen: true,
         width: 900,
        minHeight: "auto",
    closeOnEscape: false,
        modal: true,
        dialogClass: "no-close",
        buttons: {
            'NEXT': {
        text: "NEXT",
        id: "next_button",
        click: function() {
                  $( this ).dialog( "close" );
          GAME.Dialogs.DisplayMainQuestDialog();
        }
            }
        }
    });
};
})();
