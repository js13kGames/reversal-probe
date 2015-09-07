function Nmy0() {

  var n = this,
    start_rnttn = utl.any( 2, 0 ),
    start_end = utl.any( 2, 0 );
  n.x = start_rnttn ? utl.any( env.w, 50 ) : ( start_end ? - 50 : env.h + 50 );
  n.y = start_rnttn ? ( start_end ? - 50 : env.w + 50 ) : utl.any( env.h, 50 );
  n.a = utl.infany( 2 * pi );
  n.v = utl.infany( 1 ) + 1;
  n.r;
  n.action = 'follow';
  n.vxy = utl.get_xy( n.a, n.v, 0, 0 );
  n.fill = 'black';
  n.stroke = 'white';
  n.countdown = 0;
  n.id;
  n.vbits = 3;
  n.dbits = 0;
  n.bits = [];
  n.bits_count = 0;

  n.get_pdir = function() {
    return utl.angle_between( n.x, n.y, env.x, env.y );
  };

  n.translate = function() {
    n.vxy = utl.get_xy( n.a, n.v, 0, 0 );
    n.x += n.vxy[ 0 ];
    n.y += n.vxy[ 1 ];
  };

  n.follow = function() {
    var pdir = n.get_pdir();
    n.a = ( 2 * pi + n.a + utl.which_way ( n.a, pdir ) * 0.01 ) % ( pi * 2 );
    n.translate();
    n.trail_wobble();
    n.tail_test ();
  };

  n.wobble = function() {
    n.x += utl.infanyeq( 0.4 );
    n.y += utl.infanyeq( 0.4 );
    if ( --n.countdown <= 0) {
      n.action = 'follow';
      n.fill = 'black';
      n.stroke = 'white';
    } else {
      if ( plr.is_touching_end( n.x, n.y, n.r ) ) {
        n.action = 'reversed';
        plr.add_to_tail( n );
        n.fill = 'white';
        n.stroke = 'black';
        scrbrd.pt();
      } else {
        if ( n.countdown < 100 ) {
          n.fill = ( ~~( n.countdown / 5 ) % 2 ) ? 'white' : '#444444';
        }
      }
    }
  };

  n.reversed = function() {

  };

  n.death = function() {
    if ( n.bits_count < 0 ) {
      return;
    }
    n.translate();
    n.v *= 0.98;
    n.dbits += n.vbits;
    n.vbits *= 0.96;
  }

  n.death_init = function() {
    for ( var i = 0, l = 24; i < l; i++ ) {
      n.bits.push( [
        -3 + utl.infanyeq( 4 ),
        -3 + utl.infanyeq( 4 ),
        3 + utl.infanyeq( 4 ),
        3 + utl.infanyeq( 4 ),
        utl.infany( 2 * pi ),
        utl.any( 25, 0 ) + 5
      ] );
    }
    n.action = 'death';
  }

  n.trail_wobble = function() {
    if ( plr.is_in_trail_bounds( n.x, n.y ) && plr.is_touching_trail( n.x, n.y, n.r ) ) {
      n.action = 'wobble';
      n.countdown = 500;
      n.fill = 'white';
      n.stroke = 'black';
    }
  };

  n.tail_test = function() {
    if ( plr.tail_ht( n.x, n.y, n.r ) ) {
      n.death_init();
    }
  };

  n.npt_xy = function( a, r ) {
    return utl.get_xy( a, r, n.x - env.scrx, n.y - env.scry );
  }

  n.mv = function( nmy_pos ) {};

  n.drw = function( ex, ey ) {};

  n.death_col = function() {
    var alpha = ( 100 - n.bits_count * 3 ) / 100;
    cx.strokeStyle = 'rgba(255,32,0,' + alpha + ')';
    cx.fillStyle = 'rgba(255,224,0,' + alpha + ')';
  }

  n.drw_death = function() {
    if ( n.bits_count++ < 0 ) {
      return;
    }
    n.death_col();
    for ( var i = 0, l = n.bits.length; i < l; i++ ) {
      if ( !n.bits[ i ] || n.bits[ i ][ 5 ] < n.bits_count ) {
        n.bits.splice( i, 1 );
        continue;
      }
      var bxy = utl.get_xy( n.bits[ i ][ 4 ], n.dbits / n.bits[ i ][ 0 ] * 3, n.x - env.scrx, n.y - env.scry );
      cx.beginPath();
      cx.moveTo( bxy[ 0 ] + n.bits[ i ][ 0 ], bxy[ 1 ] );
      cx.lineTo( bxy[ 0 ], bxy[ 1 ] + n.bits[ i ][ 1 ] );
      cx.lineTo( bxy[ 0 ] + n.bits[ i ][ 2 ], bxy[ 1 ] );
      cx.lineTo( bxy[ 0 ], bxy[ 1 ] + n.bits[ i ][ 3 ] );
      cx.lineTo( bxy[ 0 ] + n.bits[ i ][ 0 ], bxy[ 1 ] );
      utl.shape_stop();
    }
  };

}
