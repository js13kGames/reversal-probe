var Plr = function() {
  var trail = [],
    envw = env.w / 2,
    trail_bounds = [ env.w, env.w, 0, 0 ];
    exy = [ env.x, env.y ],
    tail = [ ],
    tail_end = exy,
    r = 10,
    fill = 'white',
    stroke = 'black';

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
      if ( game_mode !== 'start' ) { return; };
      for ( var t = trail.length - 1; t > 0; t-- ) {
        if ( utl.is_close_course( nmyx, nmyy, nmyr, trail[ t ][ 0 ], trail[ t ][ 1 ], 2 ) ) {
          return true;
        }
      }
      return false;
    },
    add_to_tail: function( nmy ) {
      con += 6.5;
      nmy.fill = fill;
      nmy.stroke = stroke;
      tail.push( nmy );
      snds.upgrade();
    },
    tail_ht: function( nx, ny, nr ) {
      var l = tail.length;
      // hit plr if no tail
      if ( game_mode === 'start' ) {
        if ( utl.is_close( nx, ny, nr, env.x, env.y, r ) ) {
          if ( l ) {
            tail[ 0 ].death_init();
            tail.splice( t, 1 );
            con -= 6.5;
          } else {
            for ( var n = 0; n < 12; n++ ) {
              var nmy = new Nmy2();
              nmy.x = env.x;
              nmy.y = env.y;
              nmy.bits_count = -1 * n;
              nmy.death_init ();
              nmys.push( nmy );
            }
            ngn.end_game();
            scrbrd.die();
            tail = [];
            trail = [];
          }
          return true;
        }
      }
      for ( var t = 0; t < l; t++ ) {
        var n = tail[ t ];
        if ( utl.is_close_course( nx, ny, nr, n.x, n.y, n.r) &&
          utl.is_close( nx, ny, nr, n.x, n.y, n.r ) ) {
          n.death_init();
          tail.splice( t, 1 );
          con -= 6.5;
          scrbrd.pt();
          return true;
        };
      }
      return false;
    },
    is_touching_whole: function( nmyx, nmyy, nmyr ) {
      if ( utl.is_close( nmyx, nmyy, nmyr, env.x, env.y, r ) ) { return true; };
      if ( utl.is_close( nmyx, nmyy, nmyr, tail_end[ 0 ], tail_end[ 1 ], 6.5 ) ) { return true };
      var l = tail.length;
      for ( var t = 0; t < l; t++ ) {
        var n = tail[ t ];
        if ( utl.is_close_course( nmyx, nmyy, nmyr, n.x, n.y, n.r) &&
          utl.is_close( nmyx, nmyy, nmyr, n.x, n.y, n.r ) ) {
          return true;
        }
      }
      // also test plr and tail nmys
    },
    mv: function() {
      // thrusting
      if ( game_mode != 'start' ) { return; };
      if ( ins.keysDown.left ) { rgd.ply.rot -= .01; };
      if ( ins.keysDown.right ) { rgd.ply.rot += .01; };
      if ( ins.keysDown.up ) {
        var sqt = Math.sqrt( con );
        var a = rgd.ply.ang;
        snds.thrust_start();
        rgd.ang.vel -= Math.cos( a + pi/2 - rgd.ang.rad ) / 200 / sqt;
        axy = utl.get_xy( a,.2-sqt/100,0,0 );
        rgd.lin.vx += axy[ 0 ];
        rgd.lin.vy += axy[ 1 ];
      };
      // movement
      env.x = utl.bounds( env.x + rgd.lin.vx, env.w );
      // gravity version: env.y = utl.bounds( env.y + ( rgd.lin.vy += .02 ), env.h );
      env.y = utl.bounds( env.y + ( rgd.lin.vy ), env.h );
      env.scrx = env.x * ( env.w - cvw ) / env.w;
      env.scry = env.y * ( env.h - cvh ) / env.h;
      rgd.ang.rad += rgd.ang.vel;
      rgd.ply.ang += rgd.ply.rot;
      // friction
      rgd.ply.rot *= .94;
      rgd.ang.vel *= .996;
      rgd.lin.vx *= .99;
      rgd.lin.vy *= .99;
      var oxy = utl.plr_to_scr (env.x, env.y),
        x = oxy[ 0 ],
        y = oxy[ 1 ],
        rad = rgd.ang.rad,
        ang = rgd.ply.ang;

      var dist = -13;
      var xy = utl.get_xy ( rad, con, x, y );
      for ( var t = 0, l = tail.length; t < l; t++ ) {
        if ( tail[ t ] ) {

          xy = utl.get_xy (rad, dist, xy[0], xy[1]);
          // elasticy - leave for now
          // old = lasttows[ t ] || xy;
          // xy[0] = xy[0] - (xy[0] - old[0]) / 16 * t;
          // xy[1] = xy[1] - (xy[1] - old[1]) / 16 * t;
          // lasttows[ t ] = xy;
          tail[ t ].x = xy[ 0 ] + env.scrx;
          tail[ t ].y = xy[ 1 ] + env.scry;
        }
      }
      xy = utl.get_xy ( rad, con * -1, x, y );

      tail_end = [ xy[ 0 ] + env.scrx, xy[ 1 ] + env.scry ];
      // update trail and bounds
      if ( !( mvs % 3 ) ) {
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
      if ( game_mode === 'init' ) { return; };

      //trail
      var poxy = utl.plr_to_scr (env.x, env.y);
      var pxy = utl.get_xy ( rad, con, poxy[ 0 ], poxy[ 1 ] );
      utl.shape_start( pxy );
      utl.ln_2_pt( trail[ 0 ] );
      var curx = trail[ 0 ][ 0 ];
      var cury = trail[ 0 ][ 1 ];

      for ( var i = 0, l = trail.length; i < l; i++ ) {
        if ( Math.abs( trail[ i ][ 0 ] - curx ) > 3 ||
          Math.abs( trail[ i ][ 1 ] - cury ) > 3 ) {
          cx.strokeStyle = 'rgba(255,255,255,' + ( i / 120 ) + ')';
          cx.lineWidth = i / 30;
          utl.shape_start( [ curx - env.scrx, cury - env.scry ] );
          cx.lineTo( trail[ i ][ 0 ] - env.scrx,
            trail[ i ][ 1 ] - env.scry );
          cx.stroke();

          cx.strokeStyle = 'rgba(175,255,215,' + ( i / 240 ) + ')';
          cx.lineWidth = i / 15;
          cx.moveTo( curx - env.scrx, cury - env.scry );
          cx.lineTo( trail[ i ][ 0 ] - env.scrx,
            trail[ i ][ 1 ] - env.scry );
          cx.stroke();

          cx.closePath();
          curx = trail[ i ][ 0 ];
          cury = trail[ i ][ 1 ];
        }
      }

      cx.lineWidth = .5;

      //tail ( nmys drw does this )



      var xy = [ tail_end[ 0 ] - env.scrx, tail_end[ 1 ] - env.scry ],
        x = xy[ 0 ],
        y = xy[ 1 ],
        rad = rgd.ang.rad,
        ang = rgd.ply.ang,
        ta = rad + pi / 12,
        tr = 6,
        wd6 = pi / 6,
        xy_c = utl.get_xy( rad, con, env.x - env.scrx, env.y - env.scry );

      utl.shape_start( xy );
      cx.lineWidth = 2;
      cx.strokeStyle = 'rgba(0,0,0,0.25)';
      utl.ln_2_pt( xy_c );
      utl.shape_stop();

      // tailend
      cx.beginPath();
      cx.lineWidth = 0.5;
      cx.fillStyle = fill;
      cx.strokeStyle = stroke;

      cx.arc( xy[0], xy[1], tr, ta, ta + 3 * wd6 );
      var tept = utl.get_xy( ta + 3.5 * wd6, tr, xy[ 0 ], xy[ 1 ] );
      cx.arc( tept[0], tept[1], tr / 3.5, ta + .5 * wd6, ta + 6.5 * wd6 );
      cx.arc( xy[0], xy[1], tr, ta + 4 * wd6, ta + 7 * wd6 );
      tept = utl.get_xy( ta + 7.5 * wd6, tr, xy[ 0 ], xy[ 1 ] );
      cx.arc( tept[0], tept[1], tr / 3.5, ta + 4.5 * wd6, ta + 10.5 * wd6 );
      cx.arc( xy[0], xy[1], tr, ta + 8 * wd6, ta + 11 * wd6 );
      tept = utl.get_xy( ta + 11.5 * wd6, tr, xy[ 0 ], xy[ 1 ] );
      cx.arc( tept[0], tept[1], tr / 3.5, ta + 8.5 * wd6, ta + 14.5 * wd6 );
      utl.shape_stop();

      //plr

      xy = xy_c;
      //thrusties
      if ( game_mode === 'start' && ins.keysDown.up ) {
        cx.beginPath();
        cx.strokeStyle = 'rgb(150,150,150)';
        var fxy = utl.get_xy ( ang, -3 * r, xy[ 0 ], xy[ 1 ]);
        for (var i = 0; i < 2; i++) {
          var fx = fxy[ 0 ] + utl.any( r, 0 ) - r / 2,
            fy = fxy[ 1 ] + utl.any( r, 0 ) - r / 2,
            fz = utl.any( r, 0 ) / 2 + r / 4;
          cx.moveTo(xy[ 0 ],xy[ 1 ]);
          cx.lineTo(fx, fy);
          cx.moveTo(fx + fz, fy);
          cx.arc( fx, fy, fz, 0, 2*pi );
        }
        cx.stroke();
        cx.closePath();
      }
      //exhaust
      var wdg = pi / 32;
      var ptt1 = utl.get_xy(ang + 28 * wdg, r * 1.1, xy[ 0 ], xy[ 1 ] );
      var ptt2 = utl.get_xy(ang + 36 * wdg, r * 1.1, xy[ 0 ], xy[ 1 ] );
      utl.shape_start( xy );
      utl.ln_2_pt( ptt1 );
      cx.arc( xy[ 0 ], xy[ 1 ], r * 1.1, ang + 29 * wdg, ang + 35 * wdg );
      utl.ln_2_pt( xy );
      cx.strokeStyle = stroke;
      cx.fillStyle = '#bbb';
      utl.shape_stop();
      //body
      cx.fillStyle = fill;
      var ptt3 = utl.get_xy(ang + 39 * wdg, r, xy[ 0 ], xy[ 1 ] );
      var ptt4 = utl.get_xy(ang + 54 * wdg, r * .7, xy[ 0 ], xy[ 1 ] );
      var ptt5 = utl.get_xy(ang + 74 * wdg, r * .7, xy[ 0 ], xy[ 1 ] );
      var ptt6 = utl.get_xy(ang + 89 * wdg, r, xy[ 0 ], xy[ 1 ] );
      var ptt7 = utl.get_xy(ang, r * .5, xy[ 0 ], xy[ 1 ] );
      utl.shape_start( ptt3 );
      utl.ln_2_pt( ptt4 );
      cx.arc( ptt7[ 0 ], ptt7[ 1 ], r * .58, ang - pi / 2, ang + pi / 2 );
      utl.ln_2_pt( ptt5 );
      utl.ln_2_pt( ptt6 );
      utl.ln_2_pt( ptt3 );
      utl.shape_stop();
      //window
      utl.shape_start( ptt7[ 0 ] + r * .3, ptt7[ 1 ] );
      cx.arc( ptt7[ 0 ], ptt7[ 1 ], r * .3, 0, pi * 2 );
      cx.stroke();

      //fins
      var ptt8 = utl.get_xy(ang + 48 * wdg, r * .6, xy[ 0 ], xy[ 1 ] );
      var ptt9 = utl.get_xy(ang + 16 * wdg, r * .6, xy[ 0 ], xy[ 1 ] );
      var ptt10 = utl.get_xy(ang + 43 * wdg, r * 1, xy[ 0 ], xy[ 1 ] );
      var ptt11 = utl.get_xy(ang + 21 * wdg, r * 1, xy[ 0 ], xy[ 1 ] );
      cx.moveTo( ptt8[ 0 ], ptt8[ 1 ] );
      utl.ln_2_pt( ptt9 );
      utl.ln_2_pt( ptt11 );
      utl.ln_2_pt( ptt6 );
      utl.ln_2_pt( ptt3 );
      utl.ln_2_pt( ptt10 );
      utl.ln_2_pt( ptt8 );
      cx.fillStyle = '#ddd';
      utl.shape_stop();

      //sensor
      var cn = utl.get_first_close_nmy( env.x, env.y ),
        cna = 0,
        eyerad = r * .12,
        look_amt = r * .08;

      if ( cn ) {
        cna = utl.angle_between( cn.x, cn.y, env.x, env.y );
        look_amt = r * .12;
      } else {
        cna = utl.angle_between( rgd.lin.vy, rgd.lin.vx, 0, 0 ) * -1 + pi / 2;
      }
      var ptt12 = utl.get_xy( cna, look_amt, ptt7[ 0 ], ptt7[ 1 ] );
      cx.beginPath();
      cx.arc( ptt12[ 0 ], ptt12[ 1 ], eyerad, 0, pi * 2 );
      cx.fillStyle = '#309060';
      utl.shape_stop();
    }
  }
}
var plr = new Plr();
