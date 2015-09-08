var Nmy1 = function() {
  var n = this;
  Nmy0.call( n );

  n.r = 7.5;
  n.shyness = 80 * n.v;
  n.clockwise = ( ( utl.any( 2, 0 ) ) - 0.5 );
  n.av = 0.2;
  n.spin = 0;

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
          if ( game_mode != 'end' && !( mvs % ~~( n.v * 100 ) ) ) {
            nmys.push( new NmyBllt( n.x, n.y ) );
          }
        }
        break;
      case 'retreat' :
        if ( !utl.is_close( n.x, n.y, n.shyness * 1.2, env.x, env.y, 0 ) ) {
          n.action = 'follow';
        }
        break;
      case 'reversed' :
          if ( !(mvs % ~~( n.v * 100 ) ) ) {
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
        var avf = frame / 200 + n.spin,
        s1 = n.r * ( 0.8 + Math.abs( Math.sin( avf ) / 2 ) ),
        s2 = n.r * ( 0.8 + Math.abs( Math.sin( avf + pi * 2 / 3 ) / 2 ) ),
        s3 = n.r * ( 0.8 + Math.abs( Math.sin( avf + pi * 4 / 3 ) / 2 ) ),
        r0 = n.r * 0.8,
        use_ang = n.spin;
        if ( n.action === 'wobble' ) {
          n.drw_tmr( ex, ey, n.countdown / 500 );
        }

        if ( n.action === 'wobble' || n.action === 'reversed' ) {
          // inanimate
        } else {
          n.spin += n.av / 30;
          if ( !~~( frame % ( 200 - Math.abs( n.av ) * 50 ) ) ) {
            n.av = utl.infany( 0.75 ) + 0.5;
            if ( ~~utl.any( 2, 0 ) ) {
              n.av *= -1;
            }
          }
        }
        if ( n.action === 'reversed' ) {
          use_ang = n.a;
        }
        var pts = [
          n.npt_xy( use_ang + pi * 1 / 15, r0 ),
          n.npt_xy( use_ang + pi * 3 / 15, r0 ),
          n.npt_xy( use_ang + pi * 4 / 15, s1 ),
          n.npt_xy( use_ang + pi * 10 / 15, s1 ),
          n.npt_xy( use_ang + pi * 11 / 15, r0 ),
          n.npt_xy( use_ang + pi * 13 / 15, r0 ),
          n.npt_xy( use_ang + pi * 14 / 15, s2 ),
          n.npt_xy( use_ang + pi * 20 / 15, s2 ),
          n.npt_xy( use_ang + pi * 21 / 15, r0 ),
          n.npt_xy( use_ang + pi * 23 / 15, r0 ),
          n.npt_xy( use_ang + pi * 24 / 15, s3 ),
          n.npt_xy( use_ang, s3 )
        ];
        cx.fillStyle = n.fill;
        cx.strokeStyle = n.stroke;
        utl.shape_start( pts[ 0 ] );
        utl.lns_frm_arr( pts );
        utl.shape_stop();
        break;
      case 'death' :
        n.drw_death();
        break;
    }
  };

}

