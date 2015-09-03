var Plr = function() {
  var trail = [],
    envw = env.w / 2,
    trail_bounds = [ env.w, env.w, 0, 0 ];
    exy = [ env.x, env.y ],
    tail = [ ],
    tail_end = [ envw,envw ], 
    r = 7;
  for ( var i = 0, l = 100; i < l; i++ ) {
    trail.push( exy );
  }
  function extend_trail_bounds( pt ) {
    trail_bounds[ 0 ] = Math.min( trail_bounds[ 0 ], pt[ 0 ] );
    trail_bounds[ 1 ] = Math.min( trail_bounds[ 1 ], pt[ 1 ] );
    trail_bounds[ 2 ] = Math.max( trail_bounds[ 2 ], pt[ 0 ] );
    trail_bounds[ 3 ] = Math.max( trail_bounds[ 3 ], pt[ 1 ] );
  }
  function get_trail_bounds() {
    trail_bounds = [ env.w, env.w, 0, 0 ];
    for ( var t = trail.length - 1; t > 0; t-- ) {
      extend_trail_bounds( trail[ t ] );
    }
  }
  return {
    is_in_trail_bounds: function( nmyx, nmyy ) {
      if ( nmyx > trail_bounds[ 0 ] && nmyx < trail_bounds[ 2 ] && 
        nmyy > trail_bounds[ 1 ] && nmyy < trail_bounds[ 3 ] ) {
        return true;
      }
      return false;
    },
    is_touching_trail: function( nmyx, nmyy, nmyr ) {
      for ( var t = trail.length - 1; t > 0; t-- ) {
        if ( utl.is_close_course( nmyx, nmyy, nmyr, trail[ t ][ 0 ], trail[ t ][ 1 ], -1 ) ) {
          return true;
        }
      }
      return false;
    },
    add_to_tail: function( nmy ) {
      con += 6;
      tail.push( nmy );
    },
    tail_ht: function( nx, ny, nr ) {
      var l = tail.length;
      // hit plr if no tail
      if ( !l && utl.is_close( nx, ny, nr, env.x, env.y, r ) ) { 
        for ( var n = 0; n < 12; n++ ) {
          var nmy = new Nmy2();
          nmy.x = env.x;
          nmy.y = env.y;
          nmy.bits_count = -1 * n;
          nmy.death_init ();
          nmys.push( nmy );
        }
        // game over
        alert('game over');
        return true;
      }
      for ( var t = 0; t < l; t++ ) {
        var n = tail[ t ];
        if ( utl.is_close_course( nx, ny, nr, n.x, n.y, n.r) && 
          utl.is_close( nx, ny, nr, n.x, n.y, n.r ) ) { 
          n.death_init();
          tail.splice( t, 1 );
          con -= 6;          
          // all higher tail nmys die?D
          return true; 
        }; 
      }
      return false;
    },
    is_touching_end: function( nmyx, nmyy, nmyr ) {
      return utl.is_close( nmyx, nmyy, nmyr, tail_end[ 0 ], tail_end[ 1 ], 6.5 );
    },
    mv: function() {
      if ( ins.keysDown.left ) { rgd.ply.rot -= 0.01; };
      if ( ins.keysDown.right ) { rgd.ply.rot += 0.01; };
      if ( ins.keysDown.up ) {
        var sqt = Math.sqrt( con );
        var a = rgd.ply.ang;
        rgd.ang.vel -= Math.cos( a + pi/2 - rgd.ang.rad ) / 200 / sqt;
        axy = utl.get_xy( a,0.2-sqt/100,0,0 );
        rgd.lin.vx += axy[ 0 ];
        rgd.lin.vy += axy[ 1 ];
      };
      env.x = utl.bounds( env.x + rgd.lin.vx, env.w );
      // gravity version: env.y = utl.bounds( env.y + ( rgd.lin.vy += 0.02 ), env.h );
      env.y = utl.bounds( env.y + ( rgd.lin.vy ), env.h );
      env.scrx = env.x * ( env.w - cvw ) / env.w;
      env.scry = env.y * ( env.h - cvh ) / env.h;
      rgd.ang.rad += rgd.ang.vel;
      rgd.ply.ang += rgd.ply.rot;
      rgd.ply.rot *= 0.94;
      rgd.ang.vel *= 0.996;
      rgd.lin.vx *= 0.99;
      rgd.lin.vy *= 0.99;
      if ( frame % 3 ) {
        var trail_rm = trail.shift();
        if ( trail_rm[ 0 ] <= trail_bounds[ 0 ] ||
          trail_rm[ 0 ] >= trail_bounds[ 2 ] ||
          trail_rm[ 1 ] <= trail_bounds[ 1 ] ||
          trail_rm[ 1 ] >= trail_bounds[ 3 ] ) {
          get_trail_bounds();
        }
        trail.push( tail_end );
        extend_trail_bounds( tail_end );
      }
    },
    drw: function() {
      var oxy = utl.plr_to_scr (env.x, env.y),
        x = oxy[ 0 ],
        y = oxy[ 1 ],
        rad = rgd.ang.rad,
        ang = rgd.ply.ang;

      var xy = utl.get_xy (rad, con, x, y);
      var pxy1 = utl.get_xy (rgd.ply.ang, 12, xy[ 0 ], xy[ 1 ]);
      var pxy2 = utl.get_xy (rgd.ply.ang + 1, -7, xy[ 0 ], xy[ 1 ]);
      var pxy3 = utl.get_xy (rgd.ply.ang - 1, -7, xy[ 0 ], xy[ 1 ]);
      cx.lineWidth = 1;
      if ( ins.keysDown.up ) {
        cx.beginPath();
        cx.strokeStyle = 'rgb(150,150,150)';
        var fxy = utl.get_xy (rgd.ply.ang, -25, xy[ 0 ], xy[ 1 ]);
        for (var i = 0; i < 2; i++) {
          var fx = fxy[ 0 ] + Math.random()*20-10,
            fy = fxy[ 1 ] + Math.random()*20-10,
            fz = Math.random()*8+2
          cx.moveTo(xy[ 0 ],xy[ 1 ]);
          cx.lineTo(fx, fy);
          cx.moveTo(fx + fz, fy);
          cx.arc( fx, fy, fz, 0, 2*pi );
        }
        cx.stroke();
        cx.closePath();
      }
      cx.beginPath();
      cx.moveTo( xy[ 0 ], xy[ 1 ] );
      cx.lineTo( pxy2[ 0 ], pxy2[  1] );
      cx.lineTo( pxy1[ 0 ], pxy1[ 1 ] );
      cx.lineTo( pxy3[ 0 ], pxy3[ 1 ] );
      cx.lineTo( xy[ 0 ], xy[ 1 ] );
      // start at back
      // var start_xy = utl.get_xy( ang, r, xy[ 0 ], xy[ 1 ] );
      // var foc1 = utl.get_xy( ang + pi * 4 / 3, r * 1.2, xy[ 0 ], xy[ 1 ] );
      // var xy1 = utl.get_xy( ang + pi * 15 / 8, r * 1.6, xy[ 0 ], xy[ 1 ] );
      // cx.moveTo( start_xy[ 0 ], start_xy[ 1 ] );
      // cx.quadraticCurveTo( foc1[ 0 ], foc1[ 1 ], xy1[ 0 ], xy1[ 1 ]);  
      // var foc2 = utl.get_xy( ang, r * 2, xy[ 0 ], xy[ 1 ] );
      // var xy2 = utl.get_xy( ang + pi / 8, r * 1.6, xy[ 0 ], xy[ 1 ] );
      // cx.quadraticCurveTo( foc2[ 0 ], foc2[ 1 ], xy2[ 0 ], xy2[ 1 ], r * 0.6 ); 
      // var foc3 = utl.get_xy( ang + pi * 2 / 3, r, xy[ 0 ], xy[ 1 ] );
      // cx.quadraticCurveTo( foc3[ 0 ], foc3[ 1 ], start_xy[ 0 ], start_xy[ 1 ], r * 2.1 );
      cx.fillStyle = 'white';
      cx.strokeStyle= 'black';
      cx.fill();
      cx.stroke();
      cx.closePath();
      cx.beginPath();

      //var n = 0;
      //
      for ( var t = 0, l = tail.length; t < l; t++ ) {
        if ( tail[ t ] ) {
        //while ( 6*n + 2 < con ) {
          // draw reversed nmy
          // n+=1;
          xy = utl.get_xy (rad, -12, xy[0], xy[1]);
          old = lasttows[ t ] || xy;
          xy[0] = xy[0] - (xy[0] - old[0]) / 16 * t;
          xy[1] = xy[1] - (xy[1] - old[1]) / 16 * t;
          lasttows[ t ] = xy;
          tail[ t ].x = xy[ 0 ] + env.scrx;
          tail[ t ].y = xy[ 1 ] + env.scry;
          //console.log( tail[ t ] );
        }
      }
      // draw tailend
      xy = utl.get_xy (rad, -12, xy[0], xy[1]);
      cx.moveTo( xy[0] + 6.5, xy[1] );
      cx.arc( xy[0], xy[1], 6.5, 0, 2*pi );
      tail_end = [ xy[ 0 ] + env.scrx, xy[ 1 ] + env.scry ];
      cx.fillStyle = 'green';
      cx.fill();
      cx.stroke();
      cx.closePath();
      cx.moveTo( trail[ 0 ][ 0 ] - env.scrx, trail[ 0 ][ 1 ] - env.scry );
      var curx = trail[ 0 ][ 0 ];
      var cury = trail[ 0 ][ 1 ];
      cx.strokeStyle = 'rgb(220,220,255)';
      for ( var i = 0, l = trail.length; i < l; i++) {
        if ( Math.abs( trail[ i ][ 0 ] - curx ) < 100 &&
          ( Math.abs( trail[ i ][ 0 ] - curx ) > 3 ||
          Math.abs( trail[ i ][ 1 ] - cury ) > 3 ) ) {
          cx.beginPath();
          cx.strokeStyle = 'rgba(255,255,255,' + ( i / 100 ) + ')';
          cx.lineWidth = i / 30;
          cx.moveTo( curx - env.scrx, cury - env.scry );
          cx.lineTo( trail[ i ][ 0 ] - env.scrx,
            trail[ i ][ 1 ] - env.scry );
          cx.stroke();
          cx.closePath();
          curx = trail[ i ][ 0 ];
          cury = trail[ i ][ 1 ];
        }
      }
      // draw trail bounds for testing
      // cx.beginPath();
      // cx.strokeStyle = 'red';
      // cx.lineWidth = 1;
      // cx.rect( trail_bounds[ 0 ] - env.scrx, trail_bounds[ 1 ] - env.scry, trail_bounds[ 2 ] - trail_bounds[ 0 ], trail_bounds[ 3 ] - trail_bounds[ 1 ] );
      // cx.stroke();
      // cx.closePath();
    }
  }
}
var plr = new Plr();
