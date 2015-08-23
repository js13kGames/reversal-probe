var Bg = function( dist ) {
    var x = Math.random() * env.w,
    y = Math.random() * env.h,
    d = Math.round( dist / 20 ),
    // r = Math.round(820 / d),
    r = 180,
    col_step = Math.round(d/2),
    c = 'rgb(' + ( 40 + col_step * 9 )+ ',' + ( 38 + col_step * 3 ) + ',' + ( 35 + col_step * 2 ) + ')',
    pts = [],
    angv = Math.random() - 0.5,
    a = 0;
    while ( a < pi * 2  - 0.75) {
      a += Math.random() / 2 + 0.25;
      var l = ( r / 2 ) + ( r * Math.random() );
      pts.push( [ a, l ] );
    }
  return {
    is_showing: function( ex, ey ) {
      var margin = r * 1.5;
      return true;
      return ( ( x > ex - margin ) && 
        ( x < ex + cvw + margin ) && 
        ( y > ey - margin ) && 
        ( y < ey + cvh + margin ) ); 
    },
    drw: function( ex, ey ) {
      var xy0 = utl.get_xy_0( x, y, dist );
      var sx = xy0[ 0 ] - ex;
      var sy = xy0[ 1 ] - ey;
      var first = utl.get_xy ( a, l, sx, sy );
      cx.fillStyle = c;
      cx.moveTo( first[ 0 ], first[ 1 ]);
      cx.beginPath(); 
      for ( var p = pts.length - 1; p > -1; p--) {
        var sxy = utl.get_xy_course ( a + pts[ p ][ 0 ], pts[ p ][ 1 ], sx, sy )
        cx.lineTo( sxy[ 0 ], sxy[ 1 ] );
        pts[ p ][ 1 ] = r + utl.throb( r, pts[ p ][ 0 ] );
      }
      cx.fill();
      cx.closePath();
      a += angv / 500;
    }
  }
}
var bgs = [];
for (var i = 0, l = 150; i < l; i++) {
  bgs.push( new Bg( i + 50 ) );
}