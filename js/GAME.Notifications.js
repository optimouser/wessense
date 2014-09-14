
GAME.Notifications = GAME.Notifications || {
	mID: 'notifications',
	mTypeColors: {'good': ['#8F0', '#000'], 'bad': ['#C00','#CCC'], 'neutral': ['#CCC','#555'] }
};

GAME.Notifications.Post = function( message, type, time ) {
	type = ( type != undefined ) ? this.mTypeColors[type] : this.mTypeColors['neutral'];
	time = ( time != undefined ) ? time : 1000;
    $('#'+this.mID + '_contents').append( $('<li>'+message+'</li>').css({ 'font-size': 26*GAME.Display.mScaleFactor, 'color': type[0], 'text-shadow': '1px 1px '+type[1] }).fadeIn(1000).delay( time ).fadeOut(1000, function() { $(this).remove() }) );
};

GAME.Notifications.Create = function() {
    var contents = '<div id="'+this.mID+'" class="gm_notifications"><ul id="'+this.mID+'_contents"></ul></div>';
    var notifications = $(contents).css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': '100%',
        'z-index': 10,
        'text-align': 'center',
		'font-family': 'monospace',
        'color': 'white',
        'text-shadow': '1px 1px #555'
    });
    $('body').append(notifications);
	var that = this;
};

GAME.Notifications.PostMonsterStats = function( monster ) {
	var stats = '<strong>' + monster.mName + '</strong> HP: ' + parseInt(monster.mHP[0]) + '/' + parseInt(monster.mHP[1]);
	if ( monster.mDEF > 0 ) { stats += ', Armor: ' + monster.mDEF + '%'; };
 	if ( monster.mNHTH > 0 ) { stats += ', Melee: ' + monster.mNHTH + 'x' + monster.mHTH; }
	if ( monster.mNRNG > 0 ) { stats += ', Ranged: ' + monster.mNRNG + 'x' + monster.mRNG; }
	this.Post( stats );
};