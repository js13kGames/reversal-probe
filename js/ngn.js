cx.scale( 2, 2 );

var Ngn = function() {
  function drw() {
    requestAnimationFrame( drw );
    env.bg_col = [
      8 + 6 * Math.sin( frame / ( 20 + uniqr * 40 ) / 30 + uniqr * 6),
      8 + 6 * Math.sin( frame / ( 20 + uniqg * 40 ) / 30 + uniqg * 6),
      8 + 6 * Math.sin( frame / ( 20 + uniqb * 40 ) / 30 + uniqb * 6) ];

    cx.fillStyle = '#292724';
    cx.rect(0, 0, cvw, cvh);
    cx.fill();
    if ( bgs.length ) {
      for ( var i = 0, l = bgs.length; i < l; i++ ) {
        bgs[ i ].drw( env.scrx, env.scry );
      }
    }
    if ( nmys.length ) {
      for ( var i = 0, l = nmys.length; i < l; i++ ) {
        nmys[ i ].drw( env.scrx, env.scry );
      }
    }
    if ( plr ) { plr.drw(); };
    if ( scrbrd ) { scrbrd.drw(); };
    frame++;
  };
  function mv() {
    toa = window.setTimeout( mv, 17 );
    if ( game_mode === 'pause' ) { return; }
    mvs++;
    for ( var i = 0, l = nmys.length; i < l; i++ ) {
      if ( nmys[ i ] ) {
        nmys[ i ].mv( i );
      }
    }
    if ( game_mode !== 'start') { return; }
    if ( num_nmys < ( 2 + Math.min( mvs / 500, 100 ) ) ) {
      var nnum = Math.min( utl.any( ~~( Math.min( mvs / 2700 + 1, 7 ) ), 0 ), 3 ) + 1;
      nmys.push( new window[ 'Nmy' + nnum ]() );
      num_nmys++;
    }
    if ( plr ) { plr.mv(); };
  };
  drw();
  mv();
  return {
    end_game: function() {
      game_mode = 'init';
    },
    esc: function() {
      switch ( game_mode ) {
        case 'start' :
          game_mode = 'pause';
          break;
        case 'pause' :
          game_mode = 'start';
          break;
      }
    },
    go: function() {
      switch ( game_mode ) {
        case 'init' :
          game_mode = 'start';
          nmys = [];
          plr = new Plr();
          scrbrd = new Scrbrd;
          rgd = {
            lin: {
              vx: 0,
              vy: -10,
              x: 100,
              y: 100
            },
            ang: {
              vel: 0.2,
              rad: Math.random() * 2 * pi
            },
            ply: {
              ang: 2.8,
              rot: 0.5,
              r: 20
            }
          };
          env.x = 1500;
          num_nmys = 0,
          env.y = 2100;
          uniqr = utl.infany( 1 )
          uniqg = utl.infany( 1 );
          uniqb = utl.infany( 1 );
          bgs = [];
          snds.reset();
          mvs = 0;
          frame = 0;
          for (var i = 0, l = settings.amt_bg; i < l; i++) {
            bgs.push( new Bg( i + 50 ) );
          }
          break;
        case 'pause' :
          game_mode = 'start';
          break;
        case 'start' :
          game_mode = 'pause';
          break;
      }
    }
  }
}
var ngn = new Ngn();
