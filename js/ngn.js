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
      8 + 5 * Math.sin( frame / ( 20 + uniqr * 40 ) / 50 + uniqr * 6),
      8 + 5 * Math.sin( frame / ( 20 + uniqg * 40 ) / 50 + uniqg * 6),
      8 + 5 * Math.sin( frame / ( 20 + uniqb * 40 ) / 50 + uniqb * 6) ];

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
    frame++;
  };
  function mv() {
    toa = window.setTimeout( mv, 17 );
    if ( paused === 1 ) { return; };
    if ( nmys.length < 20 + frame / 5000 && !(frame % 200 ) ) {
      nmys.push( utl.any( 2, 0 ) ? new Nmy2() : new Nmy1() );
    }
    for ( var i = 0, l = nmys.length; i < l; i++ ) {
      if ( nmys[ i ] ) {
        nmys[ i ].mv( i );
      }
    }
    if ( plr ) { plr.mv(); };
  };
  function frm() {
    tof = window.setTimeout( frm, 1000 );
    document.getElementById( 'readout1' ).innerHTML = ( frame - lastframe );
    document.getElementById( 'readout2' ).innerHTML = log;
    lastframe = frame;
  };
  drw();
  mv();
  frm();
}

if(document.addEventListener) {
  document.addEventListener( "visibilitychange", utl.visibility_event );
}

var ngn = new Ngn();

// temp init nmys
//nmys.push( new Nmy1() );
nmys.push( new Nmy2() );
