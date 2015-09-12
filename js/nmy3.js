var Nmy3 = function() {

  var n = this;
    Nmy0.call( n );

  n.action = 'randomy';
  n.r = 7;
  n.get_next_target = [];

  n.get_next_target = function() {
    n.next_target = [ utl.any( env.w, 0 ), utl.any( env.h, 0 ) ];
  }

  n.get_next_target();

  n.randomy = function() {
    var dir = utl.angle_between( n.x, n.y, n.next_target[ 0 ], n.next_target[ 1 ] );
    n.a = ( 2 * pi + n.a + utl.which_way ( n.a, dir ) * 0.01 ) % ( pi * 2 );
    if ( utl.is_close( n.x, n.y, n.r, n.next_target[ 0 ], n.next_target[ 1 ], 50 ) ) {
      n.get_next_target();
    }
    n.translate();
    n.trail_wobble();
    n.tail_test ();
  };

  n.mv = function( nmy_pos ) {
    n.id =  nmy_pos;
    n[ n.action ]();
    switch ( n.action ) {
      case 'randomy' :
        var nxt_bmb = mvs % ~~( n.v * 250 );
        if ( game_mode === 'start' && nxt_bmb <= 0 ) {
          nmys.push( new NmyBmb( n.x, n.y ) );
        }
        break;
      case 'reversed' :
        var nxt_bmb = mvs % ~~( n.v * 125 );
        if ( nxt_bmb <= 0 ) {
          nmys.push( new PlrBmb( n.x, n.y ) );
        }
        n.a += rgd.ang.vel;
        break;
      case 'follow' :
        n.action = 'randomy';
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
      case 'randomy' :
      case 'wobble' :
      case 'reversed' :
        if ( n.action === 'wobble' ) {
          n.drw_tmr( ex, ey, n.countdown / 500 );
        }
        var sf = n.a + pi / 2 + 0.8 * Math.sin( mvs * n.v / 12 ),
          cf = n.a - pi / 2 - 0.8 * Math.cos( mvs * n.v / 11 ),
          adj = 0.06* pi,
          sm = n.r * 0.2,
          lg = n.r * 0.8;
        if ( n.action === 'wobble' || n.action === 'reversed' ) {
          sf = n.a + pi / 2;
          cf = n.a - pi / 2;
        }
        var arms = [
            n.npt_xy( sf - adj, n.r * 0.8 ),
            n.npt_xy( sf + adj, n.r * 0.8 ),
            n.npt_xy( n.a - adj, n.r * 0.2 ),
            n.npt_xy( n.a + adj, n.r * 0.2 ),
            n.npt_xy( cf - adj, n.r * 0.8 ),
            n.npt_xy( cf + adj, n.r * 0.8 ),
            n.npt_xy( n.a - adj, n.r * 0.2 ),
            n.npt_xy( n.a + adj, n.r * 0.2 )
          ],
          pts = [
            n.npt_xy( n.a, n.r * 0.6 ),
            n.npt_xy( n.a + pi * 0.13, n.r),
            n.npt_xy( n.a + pi * 0.22, n.r),
            n.npt_xy( n.a + pi * 0.91, n.r),
            n.npt_xy( n.a + pi * 1.09, n.r),
            n.npt_xy( n.a + pi * 1.78, n.r),
            n.npt_xy( n.a + pi * 1.87, n.r)
          ];
        n.rst_cl();
        utl.shape_start( arms[ 0 ] );
        utl.lns_frm_arr( arms );
        utl.shape_stop();
        utl.shape_start( pts[ 0 ] );
        utl.lns_frm_arr ( pts );
        utl.shape_stop();
        break;
    }
  }
}
