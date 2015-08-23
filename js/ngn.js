/* todos

window resize: change cvh/cvw
stop drw + ani if window loses focus
Spread bgs properly
layered scrolling - bgs + nmys
edges + remove teleporting

*/
var count = 0;
cx.scale( 2, 2 );
var nmy1s = [];
for ( var i = 0; i < 10; i++ ) {
  nmy1s.push( new Nmy1() );
}

var Ngn = function() {
  function drw() {
    requestAnimationFrame( drw );
    cx.fillStyle = 'rgb(40,38,35)';
    cx.rect(0, 0, cvw, cvh);
    cx.fill();
    for ( var i = 0, l = bgs.length; i < l; i++ ) {
      if ( bgs[ i ].is_showing( env.scrx, env.scry ) ) {
        bgs[ i ].drw( env.scrx, env.scry );
      }
    }
    for ( var i = 0; i < 10; i++ ) {
      nmy1s[ i ].drw( env.scrx, env.scry ); 
    }
    plr.drw();
    frame++;
  };
  function mv() {
    toa = window.setTimeout( mv, 17 );
    for ( var i = 0; i < 10; i++ ) {
      nmy1s[ i ].mv(); 
    }
    plr.mv();
  };
  function frm() {
    tof = window.setTimeout( frm, 1000 );
    document.getElementById( 'readout1' ).innerHTML = ( frame - lastframe );
    document.getElementById( 'readout2' ).innerHTML = log;
    lastframe = frame;
  }
  drw();
  mv();
  frm();
}
var ngn = new Ngn();
