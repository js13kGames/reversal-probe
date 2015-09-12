var Bllt = function( ex, ey ) {
  var n = this;
  Nmy0.call( n );
  n.x = ex;
  n.y = ey;
  n.v = 3;
  n.r = 3;
  n.action = 'translate';
  n.glw_cl = 'rgba(255,0,64,0.5)';

  n.drw = function( ex, ey ) {
    if ( !utl.is_showing ( n.x, n.y, n.r )) {
      return;
    }
    var pt_tail = n.npt_xy( n.a + pi, n.r * 2.5 ),
      pt_2_a = n.a + ( 21 * pi / 16),
      pt_2 = n.npt_xy ( pt_2_a, n.r );

    utl.shape_start( [ n.x - ex, n.y - ey ] );
    cx.fillStyle = n.glw_cl;
    cx.arc( n.x - ex, n.y - ey, n.r * 3 / 2, 0, pi * 2 );
    cx.fill();
    cx.closePath();
    utl.shape_start( pt_tail );
    utl.ln_2_pt( pt_2 );
    cx.arc( n.x - ex, n.y - ey, n.r, pt_2_a, pt_2_a + 11 * pi / 8 );
    utl.ln_2_pt( pt_tail );
    cx.fillStyle = n.fill;
    cx.strokeStyle = n.stroke;
    utl.shape_stop();
  };

}

var NmyBllt = function( ex, ey ) {
  var n = this;
  Bllt.call( n, ex, ey );
  n.a = n.get_pdir() + pi;

  n.mv = function( nmy_pos ) {
    n.id =  nmy_pos;
    n[ n.action ]();
    if ( !( utl.in_env( n.x, n.y, n.r ) ) ||
      plr.tail_ht( n.x, n.y, n.r ) ) {
      utl.remove_nmy( n.id );
    }
  };

}

var PlrBllt = function( ex, ey ) {
  var n = this;
  Bllt.call( n, ex, ey );
  n.fill = 'white';
  n.stroke = 'black';
  n.v = 5;
  n.glw_cl = 'rgba(0,255,64,0.5)';

  n.get_edir = function() {
    var target = utl.get_first_close_nmy( n.x, n.y );
    if ( target ) {
      return utl.angle_between( n.x, n.y, target.x, target.y );
    }
  };
  n.a = n.get_edir() + pi;

  n.mv = function( nmy_pos ) {
    n.id =  nmy_pos;
    n[ n.action ]();
    if ( !( utl.in_env( n.x, n.y, n.r ) ) || utl.ht_nmys( n.x, n.y, n.r ) ) {
      utl.remove_nmy( n.id );
    }
  };

}

var Bmb = function( ex, ey ) {
  var n = this;
  Bllt.call( n, ex, ey );
  n.action = 'tick';
  n.countdown = 240;
  n.r = 5;
  n.v = 0;


  n.tick = function() {
    if ( n.countdown-- < 1 ) {
      n.death_init();
    }
  }

  n.drw = function( ex, ey ) {
    switch( n.action ) {
      case 'tick' :
        var ptr = [ n.x - ex + n.r, n.y - ey ],
          pt0 = [ n.x - ex, n.y - ey ],
          prcnt = n.countdown / 240;
        utl.shape_start( ptr );
        cx.fillStyle = n.glw_cl;
        cx.arc( pt0[ 0 ], pt0[ 1 ], n.r * 3 / 2, 0, pi * 2 );
        cx.fill();
        cx.closePath();
        n.drw_tmr( ex, ey, prcnt, n.fill );
        utl.shape_start( ptr );
        cx.arc( pt0[ 0 ], pt0[ 1 ], n.r, 0, pi * 2 );
        utl.shape_stop();
        break;
      case 'death' :
        n.death_col();
        var pt0 = [ n.x - ex, n.y - ey ];
        var ptr = [ n.x - ex + n.r, n.y - ey ];
        utl.shape_start( ptr );
        cx.arc( pt0[ 0 ], pt0[ 1 ], n.r, 0, 2 * pi );
        utl.shape_stop();
        n.drw_death();
        break;
    }
  }

}

var NmyBmb = function( ex, ey ) {
  var n = this;
  Bmb.call( n, ex, ey );
  n.dmgd_plr = false;

  n.mv = function( nmy_pos ) {
    n.id =  nmy_pos;
    n[ n.action ]();
    if ( plr.tail_ht( n.x, n.y, n.r ) ) {
      n.death_init();
    }
    switch ( n.action ) {
      case 'death' :
        n.r = n.bits_count * 1.5;
        if ( !( n.bits.length ) || n.bits_count > 32 ) {
          utl.remove_nmy( n.id );
        }
        break;
    }
  };

}

var PlrBmb = function( ex, ey ) {
  var n = this;
  Bmb.call( n, ex, ey );
  n.fill = 'white';
  n.stroke = 'black';
  n.glw_cl = 'rgba(0,255,64,0.5)';

  n.mv = function( nmy_pos ) {
    n.id =  nmy_pos;
    n[ n.action ]();
    if ( !( utl.in_env( n.x, n.y, n.r ) ) || utl.ht_nmys( n.x, n.y, n.r ) ) {
      n.death_init();
    }
    switch ( n.action ) {
      case 'death' :
        n.r = n.bits_count * 1.5;
        if ( !( n.bits.length ) || n.bits_count > 32 ) {
          utl.remove_nmy( n.id );
        }
        break;
    }
  };

}

