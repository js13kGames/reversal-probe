/* todos

window resize: change cvh/cvw
layered scrolling - bgs + nmys

*/
var count = 0;
cx.scale( 2, 2 );

var Ngn = function() {
  function drw() {
    requestAnimationFrame( drw );
    if ( paused === 1 ) { return; };
    env.bg_col = [
      8 + 6 * Math.sin( frame / ( 20 + uniqr * 40 ) / 30 + uniqr * 6),
      8 + 6 * Math.sin( frame / ( 20 + uniqg * 40 ) / 30 + uniqg * 6),
      8 + 6 * Math.sin( frame / ( 20 + uniqb * 40 ) / 30 + uniqb * 6) ];

    cx.fillStyle = 'rgb(40,38,35)';
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
    mvs++;
    if ( game_mode === 'paused' ) { return; }
    for ( var i = 0, l = nmys.length; i < l; i++ ) {
      if ( nmys[ i ] ) {
        nmys[ i ].mv( i );
      }
    }
    if ( nmys.length < 15 + mvs / 1000 && !( mvs % ~~( 200 - ( 1 / mvs / mvs / mvs ) ) ) ) {
      // 1, 2 at 45sec, 3 at 90sec,
      var nnum = utl.any( Math.min( ~~( mvs / 2700, 3 ) ), 0 ) + 1;
      nmys.push( new window[ 'Nmy' + nnum ]() );
    }
    if ( game_mode != 'start' ) { return; };
    if ( plr ) { plr.mv(); };
  };
  function frm() {
    tof = window.setTimeout( frm, 1000 );
    // console.log ( 'fps: ' + ( frame - lastframe ) );
    lastframe = frame;
  };
  drw();
  mv();
  frm();
  return {
    end_game: function() {
      game_mode = 'end';
    },
    esc: function() {
      switch ( game_mode ) {
        case 'start' :
          game_mode = 'pause';
          break;
        case 'init' :
          game_mode = 'hint-init';
          break;
        case 'end' :
          game_mode = 'hint-end';
          break;
        case 'pause' :
          game_mode = 'start';
          break;
        case 'hint-init' :
          game_mode = 'init';
          break;
        case 'hint-end' :
          game_mode = 'end';
          break;
      }
    },
    go: function() {
      console.log (game_mode);
      switch ( game_mode ) {
        case 'end' :
        case 'init' :
          game_mode = 'start';
          nmys = [];
          nmys.push( new Nmy1() );
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
          env.y = 2100;
          frame = 0;
          lastframe = 0;
          uniqr = Math.random();
          uniqg = Math.random();
          uniqb = Math.random();
          bgs = [];
          for (var i = 0, l = settings.amt_bg; i < l; i++) {
            bgs.push( new Bg( i + 50 ) );
          }
          break;
        case 'hint-init' :
          game_mode = 'init';
          break;
        case 'hint-end' :
          game_mode = 'end';
          break;
        case 'pause' :
          game_mode = 'start';
          break;
      }
      console.log (game_mode);
    }
  }
}
if(document.addEventListener) {
  document.addEventListener( "visibilitychange", utl.visibility_event );
}
var ngn = new Ngn();
