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
    if ( plr ) { plr.drw(); };
    if ( nmys.length ) {
      for ( var i = 0, l = nmys.length; i < l; i++ ) {
        nmys[ i ].drw( env.scrx, env.scry );
      }
    }
    if ( scrbrd ) { scrbrd.drw(); };
    frame++;
  };
  function mv() {
    toa = window.setTimeout( mv, 17 );
    if ( game_mode === 'paused' ) { return; }
    for ( var i = 0, l = nmys.length; i < l; i++ ) {
      if ( nmys[ i ] ) {
        nmys[ i ].mv( i );
      }
    }
    if ( nmys.length < 20 + frame / 5000 && !(frame % 200 ) ) {
      nmys.push( utl.any( 2, 0 ) ? new Nmy2() : new Nmy1() );
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
    go: function() {
      if ( game_mode === 'end' || game_mode === 'init' ) {
        game_mode = 'start';
        nmys = [];
        nmys.push( new Nmy1() );
        plr = new Plr();
        scrbrd = new Scrbrd;
        rgd = {
          lin: {
            vx: 0,
            vy: 0,
            x: 100,
            y: 100
          },
          ang: {
            vel: 0,
            rad: Math.random()*2*pi
          },
          ply: {
            ang: 0,
            rot: 0,
            r: 20
          }
        };
        frame = 0;
        lastframe = 0;
        uniqr = Math.random();
        uniqg = Math.random();
        uniqb = Math.random();
        bgs = [];
        for (var i = 0, l = settings.amt_bg; i < l; i++) {
          bgs.push( new Bg( i + 50 ) );
        }
      }
    }
  }
}
if(document.addEventListener) {
  document.addEventListener( "visibilitychange", utl.visibility_event );
}
var ngn = new Ngn();
