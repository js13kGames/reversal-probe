var Nmy4pc = function( i ) {
    var n = this;
    Nmy0.call( n );
    n.fill = '#bbb';
    n.action = 'member';
    n.pts = [];
    n.a = 0;
    n.r = 24;
    n.it = i;
    while ( n.a < pi * 2  - 0.75) {
      n.a += Math.random() / 2 + 0.25;
      var l = ( n.r * 2 / 3 ) + ( n.r * utl.infany( .5 ) );
      n.pts.push( [ n.a, l ] );
    }

    n.drw = function( ex, ey ) {
      if ( n.action === 'death' ) {
        n.drw_death();
      } else {
        if ( n.action === 'dead' || !utl.is_showing ( n.x, n.y, n.r ) ) {
          return;
        }
        var first = n.npt_xy ( n.a, n.pts[ 0 ][ 1 ] );
        cx.fillStyle = n.fill;
        utl.shape_start( first );
        for ( var p = n.pts.length - 1; p > -1; p--) {
          var sxy = n.npt_xy ( n.a + n.pts[ p ][ 0 ], n.pts[ p ][ 1 ] );
          cx.lineTo( sxy[ 0 ], sxy[ 1 ] );
        }
        cx.fill();
        cx.closePath();
      }
    }

}

var Nmy4 = function() {
  var n = this;
  Nmy0.call( n );
  n.fill = '#444';
  n.v = .5 + utl.infany( 1.5 );
  n.mmbrs = [];
  n.action = 'group';
  n.vng = utl.infany( 1 ) / 100;
  n.spin = n.a;

  if ( n.x < 0 ) { n.a = pi * ( utl.infany( 1 ) + 1.5 ) }
  if ( n.x > env.w ) { n.a = pi * ( utl.infany( 1 ) + .5 ) }
  if ( n.y < 0 ) { n.a = pi * utl.infany( 1 ) }
  if ( n.y > env.h ) { n.a = pi * ( utl.infany( 1 ) + 1 ) }

  for ( var i = utl.any( 5, 0 ); i >= 0; i-- ) {
    n.mmbrs.push( new Nmy4pc( i ) );
  };

  n.mv = function( nmy_pos ) {
    var found = 0;
    n.translate();
    if ( n.x < -100 || n.x > env.w + 100 || n.y < -100 || n.y > env.h + 100 ) {
      utl.remove_nmy( nmy_pos );
      num_nmys--;
    }
    n.id =  nmy_pos;
    n.spin += n.vng;
    for ( var m = n.mmbrs.length - 1; m >= 0; m-- ) {
      var mmbr = n.mmbrs[ m ],
        ng = pi * m / 3,
        ra = ( m > 0 ) ? mmbr.r : 0,
        xy = utl.get_xy( n.spin + ng, ra, n.x, n.y );

      if ( mmbr.action === 'member' ) {
        mmbr.x = xy[ 0 ];
        mmbr.y = xy[ 1 ];
        mmbr.a = n.vng + mmbr.a;
        if ( mmbr.tail_test() ) { scrbrd.pt(); }
      }
      if ( mmbr.action === 'death' ) {
        mmbr.death();
        if ( !( mmbr.bits.length ) || mmbr.bits_count > 32 ) {
          mmbr.action = 'dead';
        }
      }
      if ( n.action !== 'dead' ) {
        found = 1;
      }
    };
    if ( !found ) {
      utl.remove_nmy( nmy_pos );
      num_nmys--;
    }
  }

  n.drw = function( ex, ey ) {
    for ( var m = n.mmbrs.length - 1; m >= 0; m-- ) {
      n.mmbrs[ m ].drw();
    };
  }

}
