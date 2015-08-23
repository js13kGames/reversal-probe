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
      if ( p < -20 ) { lasttows = []; return l + 20; }
      if ( p > l + 20 ) { lasttows = []; return -20; }
      return p;
    },
    cv_log: function( mess ) {
      log = mess;
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
      if ( x1 - x2 < r1 + r2 && y1 - y2 < r1 + r2 ) {
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
    is_in_bounds: function( lxmin, lxmax, lymin, lymax, px, py ) {
      if ( px > lxmin && px < lxmax && py > pymin && py > lymin && py < lymax ) {
        return true;
      }
      return false;
    }
  };
};
var utl = new Utl();
