var Nmy2 = function() {
  var n = this;
  Nmy0.call( n );
  n.fill = 'black';
  n.stroke = 'white';
  n.r = 7;
  n.v = 2 + utl.infany( 1 );

  n.mv = function( nmy_pos ) {
    n.id =  nmy_pos;
    n[ n.action ]();
    switch( n.action ) {
      case 'reversed' :
          n.a += rgd.ang.vel;
        break;
      case 'death' :
        if ( !( n.bits.length ) || n.bits_count > 32 ) {
          utl.remove_nmy( n.id );
        }
        break;
    }
  };

  n.drw = function( ex, ey ) {
    if ( n.action === 'death' ) { n.drw_death(); }
    if ( !utl.is_showing ( n.x, n.y, n.r )) {
      return;
    }

    switch ( n.action ) {

      case 'follow':
      case 'wobble':
      case 'reversed':

        if ( n.action === 'wobble' ) {
          n.drw_tmr( ex, ey, n.countdown / 500 );
        }
        n.rst_cl();

        var a1 = n.a + pi / 3 + .4 * Math.sin( mvs * n.v / 10 ),
          a2 = n.a - pi / 3 - .4 * Math.cos( mvs * n.v / 11 );
        if ( n.action === 'wobble' || n.action === 'reversed' ) {
          a1 = n.a + pi / 3;
          a2 = n.a - pi / 3;
        }
        var arms = [
          n.npt_xy( a1 - .06 * pi, n.r * 1.1 ),
          n.npt_xy( a1 - .18 * pi, n.r * 1.2 ),
          n.npt_xy( a1 - .16 * pi, n.r * 1.4 ),
          n.npt_xy( a1 + .06 * pi, n.r * 1.1 ),
          n.npt_xy( n.a - .06 * pi, n.r * .2 ),
          n.npt_xy( n.a + .06 * pi, n.r * .2 ),
          n.npt_xy( a2 + .06 * pi, n.r * 1.1 ),
          n.npt_xy( a2 + .18 * pi, n.r * 1.2 ),
          n.npt_xy( a2 + .16 * pi, n.r * 1.4 ),
          n.npt_xy( a2 - .06 * pi, n.r * 1.1 ),
          n.npt_xy( n.a - .06 * pi, n.r * .2 ),
          n.npt_xy( n.a + .06 * pi, n.r * .2 )
        ];
        var pts = [
          n.npt_xy( n.a, n.r * 1.1 ),
          n.npt_xy( n.a + pi * .3, n.r),
          n.npt_xy( n.a + pi * .91, n.r),
          n.npt_xy( n.a + pi * 1.09, n.r),
          n.npt_xy( n.a + pi * 1.7, n.r)
        ];

        utl.shape_start( arms[ 0 ] );
        utl.lns_frm_arr( arms );
        utl.shape_stop();
        utl.shape_start( pts[ 0 ] );
        utl.lns_frm_arr( pts );
        utl.shape_stop();
        break;
    }
  }
}
