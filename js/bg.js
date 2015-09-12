var Bg = function( dist ) {
    var x = Math.random() * env.w,
    y = Math.random() * env.h,
    d = Math.round( dist / 20 ),
    r = 190,
    col_step = Math.round(d/2),
    c = '',
    pts = [],
    angv = Math.random() - 0.5,
    a = 0;
    while ( a < pi * 2  - 0.75) {
      a += Math.random() / 2 + 0.25;
      var l = ( r / 2 ) + ( r * Math.random() );
      pts.push( [ a, l ] );
    }
  return {
    drw: function( ex, ey ) {
      if ( !utl.is_showing ( x, y, r ) ) {
        return;
      }
      var xy0 = utl.get_xy_0( x, y, dist );
      var sx = xy0[ 0 ] - ex;
      var sy = xy0[ 1 ] - ey;
      var first = utl.get_xy ( a, l, sx, sy );
      c = 'rgb(' + ( 30 + ~~( col_step * env.bg_col[ 0 ] ) ) +
        ',' + ( 28 + ~~( col_step * env.bg_col[ 1 ] ) ) +
        ',' + ( 25 + ~~( col_step * env.bg_col[ 2 ] ) ) + ')',
      cx.fillStyle = c;
      utl.shape_start( first );
      for ( var p = pts.length - 1; p > -1; p--) {
        var sxy = utl.get_xy ( a + pts[ p ][ 0 ], pts[ p ][ 1 ], sx, sy )
        cx.lineTo( sxy[ 0 ], sxy[ 1 ] );
        pts[ p ][ 1 ] = r + utl.throb( r, pts[ p ][ 0 ] );
      }
      cx.fill();
      cx.closePath();
      a += angv / 500;
    }
  }
}
for (var i = 0, l = settings.amt_bg; i < l; i++) {
  bgs.push( new Bg( i + 50 ) );
}
