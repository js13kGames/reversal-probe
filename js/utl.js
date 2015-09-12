var Utl = function() {
  return {
    plr_to_scr: function( px, py ) {
      sx = px * cvw / env.w;
      sy = py * cvh / env.h;
      return [ sx, sy ];
    },
    get_xy: function( rad, mag, sx, sy ) {
      return [ sx-mag*Math.sin( rad - pi / 2 ),
        sy+mag*Math.cos( rad - pi / 2 ) ];
    },
    get_xy_0: function( sx, sy, dist ) {
      var cwalf = env.w / 2,
        chalf = env.h / 2;
      return [ sx, sy ];
      return( [
        ( sx - cwalf ) * dist / 150 + chalf,
        ( sy - chalf ) * dist / 150 + chalf,
        ] );
    },
    get_xy_course: function( rad, mag, sx, sy ) {
      var xy = utl.get_xy( rad, mag, sx, sy );
      return [ Math.round( xy[ 0 ]), Math.round( xy[ 1 ] ) ];
    },
    bounds: function( p, l ) {
      if ( p < 0 ) { return 0; }
      if ( p > l ) { return l; }
      return p;
    },
    any: function( rng, pddg ) {
      return ( ~~( Math.random() * ( rng + pddg* 2 )) - pddg );
    },
    infany: function( rng ) {
      return ( Math.random() * rng );
    },
    infanyeq: function( rng ) {
      return ( utl.infany( rng ) * 2 - rng );
    },
    throb: function( r, offst ) {
      return ( r * Math.sin( offst * frame / 1500 + offst * 100 ) / 2 );
    },
    is_close_course: function( x1, y1, r1, x2, y2, r2 ) {
      if ( Math.abs( x1 - x2 ) < r1 + r2 && Math.abs( y1 - y2 ) < r1 + r2 ) {
        return true;
      }
      return false;
    },
    is_close: function( x1, y1, r1, x2, y2, r2 ) {
      if ( ( x1 - x2 ) * ( x1 - x2 ) +
        ( y1 - y2 ) * ( y1 - y2 ) <
        ( r1 + r2 ) * ( r1 + r2 ) ) {
        return true;
      }
      return false;
    },
    on_scrn: function( x, y ) {
      return utl.is_in_bounds( env.scrx, env.scrx + cvw, env.scry, env.scry + cvh, x, y );
    },
    is_in_bounds: function( lxmin, lxmax, lymin, lymax, px, py ) {
      return ( px > lxmin && px < lxmax && py > lymin && py < lymax );
    },
    in_env: function( bx, by, br ) {
      return utl.is_in_bounds( -br, env.w + 100, -100, env.h + 100, bx, by );
    },
    is_showing: function( x, y, r ) {
      var margin = r * 1.5;
      return ( ( x > env.scrx - margin ) &&
        ( x < env.scrx + cvw + margin ) &&
        ( y > env.scry - margin ) &&
        ( y < env.scry + cvh + margin ) );
    },
    angle_between: function( x1, y1, x2, y2 ) {
      return ( Math.atan2( y2 - y1, x2 - x1 ) + pi * 9) % (Math.PI*2);
    },
    turn_dir: function( x1, y1, x2, y2, a ) {
      var ang = utl.angle_between( x1, y1, x2, y2 );
      if ( ( a % ( 2*pi ) ) + 2*pi < ( ang % ( 2*pi ) ) + 2*pi ) {
        return 1;
      }
      return -1;
    },
    which_way: function( s, t ){
      var retval = 1,
        source = ( s + pi * 10 ) % ( 2 * pi ),
        target = ( t + pi * 10 ) % ( 2 * pi );
      if( Math.abs( target - source ) > pi / 10 ) {
        if ( target < source - pi ) {
          retval = -1;
        } else if ( target > source && ( 2 * pi - target ) + source > pi ) {
          retval = -1;
        }
      }
      return retval;
    },
    remove_nmy: function( nmy_pos ) {
      nmys.splice( nmy_pos, 1 );
    },
    get_first_close_nmy: function( x, y ) {
      for ( var n = 0, l = nmys.length; n < l; n++ ) {
        var nmy = nmys[ n ];
        if ( Math.abs( nmy.x - x ) < 300 && Math.abs ( nmy.y - y ) < 300 ) {
          if ( [ 'follow', 'circle', 'retreat', 'randomy', 'group' ].indexOf( nmy.action ) > -1 ) {
            return nmy;
          }
        }
      }
      return;
    },
    ht_nmys: function( bx, by, br ) {
      for ( var n = 0, l = nmys.length; n < l; n++ ) {
        var nmy = nmys[ n ];
        if ( [ 'follow', 'circle', 'retreat', 'randomy' ].indexOf( nmy.action ) > -1 &&
          utl.is_close( nmy.x, nmy.y, nmy.r, bx, by, br ) ) {
          nmy.death_init();
          scrbrd.pt();
          return true;
        }
        if ( nmy.action === 'group' ) {
          for ( var m = 0, ml = nmy.mmbrs.length; m < ml; m++ ) {
            var mem = nmy.mmbrs[ m ];
            if ( mem.action === 'member' ) {
              if ( utl.is_close( nmy.mmbrs[ m ].x, nmy.mmbrs[ m ].y, nmy.mmbrs[ m ].r, bx, by, br ) ) {
                nmy.mmbrs[ m ].death_init();
                scrbrd.pt();
                return true;
              }
            }
          }
        }
      }
    },
    shape_start: function( pt ) {
      cx.beginPath();
      cx.moveTo( pt[ 0 ], pt [ 1 ] );
    },
    shape_stop: function( fll ) {
      fll = fll || true;
      if ( fll ) {
        cx.fill();
      }
      cx.stroke();
      cx.closePath();
    },
    ln_2_pt: function( pt ) {
      cx.lineTo( pt[ 0 ], pt[ 1 ] );
    },
    lns_frm_arr: function( arr ) {
      for ( var i = arr.length - 1; i >= 0; i-- ) {
        utl.ln_2_pt( arr[ i ] );
      };
    }
  };
};
var utl = new Utl();
