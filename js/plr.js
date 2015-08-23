var Plr = function() {
  var trail = [],
    exy = [ env.x, env.y ],
    tail_end = [ 1500, 1500 ];
  for ( var i = 0, l = 200; i < l; i++ ) {
    trail.push( exy );
  }
  return {
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
      trail.shift();
      trail.push( tail_end );
    },
    drw: function() {
      var oxy = utl.plr_to_scr (env.x, env.y);
      var x = oxy[ 0 ];
      var y = oxy[ 1 ];
      var rad = rgd.ang.rad;
      var xy = utl.get_xy (rad, con, x, y);
      var pxy1 = utl.get_xy (rgd.ply.ang, 12, xy[ 0 ], xy[ 1 ]);
      var pxy2 = utl.get_xy (rgd.ply.ang + 1, -7, xy[ 0 ], xy[ 1 ]);
      var pxy3 = utl.get_xy (rgd.ply.ang - 1, -7, xy[ 0 ], xy[ 1 ]);
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
      cx.strokeStyle = 'rgb(255,255,255)';
      cx.moveTo( xy[ 0 ], xy[ 1 ] );
      cx.lineTo( pxy2[ 0 ], pxy2[  1] );
      cx.lineTo( pxy1[ 0 ], pxy1[ 1 ] );
      cx.lineTo( pxy3[ 0 ], pxy3[ 1 ] );
      cx.lineTo( xy[ 0 ], xy[ 1 ] );
      cx.fillStyle = 'white';
      cx.fill();
      cx.closePath();
      cx.beginPath();
      cx.strokeStyle = 'rgb(220,220,255)';
      var n = 0;
      while ( 6*n + 2 < con ) {
        // draw reversed nmy
        n+=1;
        xy = utl.get_xy (rad, -12, xy[0], xy[1]);
        old = lasttows[n] ? lasttows[n] : xy;
        xy[0] = xy[0] - (xy[0] - old[0]) / 16 * n;
        xy[1] = xy[1] - (xy[1] - old[1]) / 16 * n;
        cx.moveTo( xy[0] + 5, xy[1] );
        cx.arc( xy[0], xy[1], 5, 0, 2*pi );
        lasttows[n]=xy;
        if ( con - 6*n < 8 ) {
          tail_end = [ xy[ 0 ] + env.scrx, xy[ 1 ] + env.scry ];
          cx.fill();
        }
      }
      cx.stroke();
      cx.closePath();
      cx.moveTo( trail[ 0 ][ 0 ] - env.scrx, trail[ 0 ][ 1 ] - env.scry );
      var curx = trail[ 0 ][ 0 ];
      var cury = trail[ 0 ][ 1 ];
      for ( var i = 0, l = trail.length; i < l; i++) {
        if ( Math.abs( trail[ i ][ 0 ] - curx ) < 100 && 
          ( Math.abs( trail[ i ][ 0 ] - curx ) > 3 ||
          Math.abs( trail[ i ][ 1 ] - cury ) > 3 ) ) {
          cx.beginPath();
          cx.strokeStyle = 'rgba(255,255,255,' + ( i / 100 ) + ')';
          cx.lineWidth = i / 50;
          cx.moveTo( curx - env.scrx, cury - env.scry );
          cx.lineTo( trail[ i ][ 0 ] - env.scrx, 
            trail[ i ][ 1 ] - env.scry );
          cx.stroke();
          cx.closePath();
          curx = trail[ i ][ 0 ];
          cury = trail[ i ][ 1 ];
        }
      }
      cx.lineWidth = 1;
    }
  }
}
var plr = new Plr();