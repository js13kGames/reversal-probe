function Nmy0() {

  var n = this;
  n.x = utl.any( env.w, 50 );
  n.y = utl.any( env.h, 50 );
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
    n.x += utl.infanyeq( 0.2 );
    n.y += utl.infanyeq( 0.2 );
    if ( --n.countdown < 0) {
      n.action = 'follow';
      n.fill = 'black';
      n.stroke = 'white';
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
      n.countdown = 400;
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

  n.drw_death = function() {
    if ( n.bits_count++ < 0 ) {
      return;
    }
    var alpha = ( 100 - n.bits_count * 3 ) / 100;
    cx.strokeStyle = 'rgba(255,32,0,' + alpha + ')';
    cx.fillStyle = 'rgba(255,224,0,' + alpha + ')';
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
      cx.fill();
      cx.stroke();
      cx.closePath();
    }
  };

}

var Nmy1 = function() {
  var n = this;
  Nmy0.call( n );

  n.r = 6.5;
  n.shyness = 80 * n.v;
  n.clockwise = ( ( utl.any( 2, 0 ) ) - 0.5 );

  n.circle = function() {
    var pdir = n.get_pdir();
    n.a = pdir % ( pi * 2 ) + n.clockwise * pi;
    n.translate();
    n.trail_wobble();
    n.tail_test ();
  };

  n.retreat = function() {
    var pdir = n.get_pdir();
    n.a = ( 2 * pi + n.a - utl.which_way ( n.a, pdir ) * 0.01 ) % ( pi * 2 );
    n.translate();
    n.trail_wobble();
    n.tail_test ();
  };

  n.mv = function( nmy_pos ) {
    n.id =  nmy_pos;
    n[ n.action ]();
    switch ( n.action ) {
      case 'follow' :
        if ( utl.is_close( n.x, n.y, n.shyness, env.x, env.y, 0 ) ) {
          n.action = 'circle';
        }
        break;
      case 'circle' :
        if ( utl.is_close( n.x, n.y, n.shyness * 0.9, env.x, env.y, 0 ) ) {
          n.action = 'retreat';
        } else if ( !( utl.is_close( n.x, n.y, n.shyness * 1.2, env.x, env.y, 0 ) ) ) {
          n.action = 'follow';
        } else {
          if ( !(frame % ~~( n.v * 100 ) ) ) {
            nmys.push( new NmyBllt( n.x, n.y ) );
          }
        }
        break;
      case 'retreat' :
        if ( !utl.is_close( n.x, n.y, n.shyness * 1.2, env.x, env.y, 0 ) ) {
          n.action = 'follow';
        }
        break;
      case 'wobble' :
        if ( plr.is_touching_end( n.x, n.y, n.r ) ) {
          n.action = 'reversed';
          n.fill = 'white';
          plr.add_to_tail( n );
        } else {
          if ( n.countdown < 80 ) {
            n.fill = ( ~~( n.countdown / 8 ) % 2 ) ? 'white' : 'black';
          }
        }
        break;
      case 'reversed' :
          if ( !(frame % ~~( n.v * 100 ) ) ) {
            nmys.push( new PlrBllt( n.x, n.y ) );
          }
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
    switch ( n.action ) {
      case 'follow' :
      case 'wobble' :
      case 'circle' :
      case 'retreat' :
      case 'reversed' :
        var sf = n.a + pi / 2 + 0.8 * Math.sin( frame * n.v / 12 ),
          cf = n.a - pi / 2 - 0.8 * Math.cos( frame * n.v / 11 ),
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

        cx.lineWidth = 1;
        cx.fillStyle = n.fill;
        cx.strokeStyle = n.stroke;
        cx.beginPath();
        cx.moveTo( arms[ 0 ][ 0 ], arms[ 0 ][ 1 ] );
        for ( var p = arms.length - 1; p > -1; p-- ) {
          cx.lineTo( arms[ p ][ 0 ], arms[ p ][ 1 ] );
        }
        cx.fill();
        cx.stroke();
        cx.closePath();
        cx.beginPath();
        cx.moveTo( pts[ 0 ][ 0 ], pts[ 0 ][ 1 ] );
        for ( var p = pts.length - 1; p > -1; p-- ) {
          cx.lineTo( pts[ p ][ 0 ], pts[ p ][ 1 ] );
        }
        cx.fill();
        cx.stroke();
        cx.closePath();
        break;
      case 'death' :
        n.drw_death();
        break;
    }
  };

}

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
      case 'wobble' :
        if ( plr.is_touching_end( n.x, n.y, n.r ) ) {
          n.action = 'reversed';
          n.fill = 'white';
          plr.add_to_tail( n );
        } else {
          if ( n.countdown < 80 ) {
            n.fill = ( ~~( n.countdown / 8 ) % 2 ) ? 'white' : 'black';
          }
        }
        break;
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

  n.drw = function() {

    switch ( n.action ) {

      case 'follow':
      case 'wobble':
      case 'reversed':
        cx.lineWidth = 1;
        cx.fillStyle = n.fill;
        cx.strokeStyle = n.stroke;

        var a1 = n.a + pi / 3 + 0.4 * Math.sin( frame * n.v / 10 ),
          a2 = n.a - pi / 3 - 0.4 * Math.cos( frame * n.v / 11 );
        if ( n.action === 'wobble' || n.action === 'reversed' ) {
          a1 = n.a + pi / 3;
          a2 = n.a - pi / 3;
        }
        var arms = [
          n.npt_xy( a1 - 0.06 * pi, n.r * 1.1 ),
          n.npt_xy( a1 - 0.18 * pi, n.r * 1.2 ),
          n.npt_xy( a1 - 0.16 * pi, n.r * 1.4 ),
          n.npt_xy( a1 + 0.06 * pi, n.r * 1.1 ),
          n.npt_xy( n.a - 0.06 * pi, n.r * 0.2 ),
          n.npt_xy( n.a + 0.06 * pi, n.r * 0.2 ),
          n.npt_xy( a2 + 0.06 * pi, n.r * 1.1 ),
          n.npt_xy( a2 + 0.18 * pi, n.r * 1.2 ),
          n.npt_xy( a2 + 0.16 * pi, n.r * 1.4 ),
          n.npt_xy( a2 - 0.06 * pi, n.r * 1.1 ),
          n.npt_xy( n.a - 0.06 * pi, n.r * 0.2 ),
          n.npt_xy( n.a + 0.06 * pi, n.r * 0.2 )
        ];
        var pts = [ 
          n.npt_xy( n.a, n.r * 1.1 ),
          n.npt_xy( n.a + pi * 0.3, n.r),
          n.npt_xy( n.a + pi * 0.91, n.r),
          n.npt_xy( n.a + pi * 1.09, n.r),
          n.npt_xy( n.a + pi * 1.7, n.r) 
        ];

        cx.beginPath();
        cx.moveTo( arms[ 0 ][ 0 ], arms[ 0 ][ 1 ] );
        for ( var p = arms.length - 1; p > -1; p-- ) {
          cx.lineTo( arms[ p ][ 0 ], arms[ p ][ 1 ] );
        }
        cx.fill();
        cx.stroke();
        cx.closePath();
        cx.beginPath();
        cx.moveTo( pts[ 0 ][ 0 ], pts[ 0 ][ 1 ] );
        for ( var p = pts.length - 1; p > -1; p-- ) {
          cx.lineTo( pts[ p ][ 0 ], pts[ p ][ 1 ] );
        }
        cx.fill();
        cx.stroke();
        cx.closePath();
        break;

      case 'death':
        n.drw_death();
        break;
    }
  }
}

var NmyBllt = function( ex, ey ) {
  var n = this;
  Nmy0.call( n );
  n.x = ex;
  n.y = ey;
  n.v = 3;
  n.r = 3;
  n.action = 'translate';
  n.a = n.get_pdir() + pi;
  n.fill = 'yellow';

  // n.translate = function() {
  //   n.translate();
  //   //HIT TEST NMYS
  // };

  n.mv = function( nmy_pos ) {
    n.id =  nmy_pos;
    n[ n.action ]();
    if ( !( utl.in_env( n.x, n.y, n.r ) ) || 
      plr.tail_ht( n.x, n.y, n.r ) ) {
      utl.remove_nmy( n.id );
    }
    // detect hit player or tail elements
  };

  n.drw = function( ex, ey ) {
    cx.fillStyle = 'blue';
    cx.lineWidth = 1;
    cx.beginPath();
    cx.lineTo( n.x - ex + n.r, n.y - ey);
    cx.arc( n.x - ex, n.y - ey, n.r, 0, 2 * pi );
    cx.fillStyle = n.fill;
    cx.strokeStyle = n.stroke;
    cx.fill();
    cx.stroke();
    cx.closePath();
  };

}

var PlrBllt = function( ex, ey ) {
  var n = this;
  Nmy0.call( n );
  n.x = ex;
  n.y = ey;
  n.v = 5;
  n.r = 3;
  n.action = 'translate';
  n.fill = 'blue';

  n.get_edir = function() {
    var target = utl.get_first_close_nmy( n.x, n.y );
    if ( target ) {
      return utl.angle_between( n.x, n.y, target.x, target.y );
    }
  };

  n.a = n.get_edir() + pi;
  // n.translate = function() {
  //   n.translate();
  //   //HIT TEST NMYS
  // };

  n.mv = function( nmy_pos ) {
    n.id =  nmy_pos;
    n[ n.action ]();
    if ( !( utl.in_env( n.x, n.y, n.r ) ) || utl.ht_nmys( n.x, n.y, n.r ) ) {
      utl.remove_nmy( n.id );
    }
  };

  n.drw = function( ex, ey ) {
    cx.fillStyle = 'yellow';
    cx.lineWidth = 1;
    cx.beginPath();
    cx.lineTo( n.x - ex + n.r, n.y - ey);
    cx.arc( n.x - ex, n.y - ey, n.r, 0, 2 * pi );
    cx.fillStyle = n.fill;
    cx.strokeStyle = n.stroke;
    cx.fill();
    cx.stroke();
    cx.closePath();
  };
}

