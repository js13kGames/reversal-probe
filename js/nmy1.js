var Nmy1 = function() {
  var x = utl.any( env.w, 50 ), 
     y = utl.any( env.h, 50 ),
     a = utl.infany( 2 * pi ),
     v = utl.infany( 0.5 ) + 0.25,
     vxy = utl.get_xy( a, v, 0, 0 );
  return {
    mv: function() {
    	x += vxy[ 0 ];
    	y += vxy[ 1 ];
    },
    drw: function( ex, ey ) {
      cx.beginPath();
      cx.lineTo( x - ex + 5, y - ey);
      cx.arc( x - ex, y - ey, 5, 0, 2 * pi );
      cx.fillStyle = 'rgb(150,0,0)';
      cx.fill();
      cx.closePath();
    }
  }
}