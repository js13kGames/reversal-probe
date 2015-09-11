function sldr( acx, hz_strt, vol_strt, hz_end, vol_end, dur ) {
    var tm = acx.currentTime,
    osc = acx.createOscillator(),
    gainr = acx.createGain();
  osc.connect( gainr );
  gainr.connect( acx.destination );
  osc.frequency.setValueAtTime( hz_strt, tm );
  gainr.gain.setValueAtTime( vol_strt, tm );
  osc.frequency.exponentialRampToValueAtTime( hz_end, tm + dur );
  gainr.gain.exponentialRampToValueAtTime( vol_end, tm + dur );
  osc.start( tm );
  osc.stop( tm + dur );
}

function kck_drm( acx ) {
  sldr( acx, 164.81, 1.5, .001, 0.01, .5 );
};

function bng( acx, buff, low, max, lngth ) {
  var tm = acx.currentTime,
    nz = acx.createBufferSource(),
    gainr = acx.createGain();
    fltr = acx.createBiquadFilter();

  nz.buffer = buff;
  nz.loop = true;
  gainr.gain.value = 0;
  nz.connect( fltr );
  fltr.connect( gainr );
  fltr.type = 'lowpass';
  fltr.frequency.value = low + utl.infany ( low / 2 );
  fltr.gain.value = utl.any( 200, 0 );
  gainr.connect( acx.destination );
  gainr.gain.setValueAtTime( max + utl.infany ( max ), tm );
  gainr.gain.exponentialRampToValueAtTime( .001, tm + lngth + utl.infany( lngth / 2 ) );
  nz.start( tm );
  nz.stop( tm + .5 );
};

var Snd = function( acx, hzs ) {
  var hzs = hzs || [ 440 ],
    osc = acx.createOscillator(),
    gainr = acx.createGain(),
    max_vol = 0.75;

  osc.type = 'sine';
  osc.frequency.value = hzs[ 0 ],
  gainr.gain.value = max_vol,
  osc.connect(gainr),
  gainr.connect(acx.destination);
  osc.start( 0 );
  return {
    set_nt: function( nt ) {
      osc.frequency.value = hzs[ nt ];
    },
    set_type: function( t ) {
      osc.type = [ 'sine', 'triangle', 'square', 'sawtooth' ][ t ];
    },
    surprise_type: function( l, h ) {
      this.set_type( utl.any( h - l + 1, 0 ) );
    },
    set_vol: function( v ) {
      gainr.gain.value = max_vol * v;
    }
  }
}

var Nz = function( acx, buff, max ) {
  var nz = acx.createBufferSource(),
    gainr = acx.createGain();
    nz.buffer = buff;
    nz.loop = true;
    gainr.gain.value = 0;
    var fltr = acx.createBiquadFilter();
    nz.connect( fltr );
    fltr.connect( gainr );
    fltr.type = 'lowpass';
    fltr.frequency.value = 500;
    fltr.gain.value = 25;
    gainr.connect( acx.destination );
    nz.start( 0 );
  return {
    set_vol: function( v ) {
      gainr.gain.value = max * v;
    }
  }
}

var Snds = function() {

  var stone = 1.0594630943592954,
    a0 = 440,
    cnt = 0,
    acx = new (window.AudioContext || window.webkitAudioContext)(),
    nts_bss = [ -36, -33, -31, -29 ],
    nts = [ 0, 3, 5, 6, 7 ],
    hrtz_bss = [],
    hrtz_trbl = [];

  var buff_sz = 50000,
    buff = acx.createBuffer( 1, buff_sz, acx.sampleRate),
    nz_arr = buff.getChannelData( 0 );
    for ( var n = 0; n < buff_sz; n++ ) {
      nz_arr[ n ] = utl.any( 21, 0 ) / 10 - 1;
    }

  var thrust = new Nz( acx, buff, 0.6 );

  function gt_hrtz( frm_a0 ) {
    return Math.round( 100 * a0 * Math.pow( stone, frm_a0 ) ) / 100;
  }

  for ( var n = 0, l = nts_bss.length; n < l; n++ ) {
    hrtz_bss.push( gt_hrtz( nts_bss[ n ] ) );
  }
  for ( var n = 0, l = nts.length; n < l; n++ ) {
    hrtz_trbl.push( gt_hrtz( nts[ n ] ) );
  }
  var snd_trb = 0,
    snd_bss = 0,
    chd_bs = 0,
    chd_tr = 0,
    sqk = 0;

  function chng() {
    window.setTimeout( chng, 216 );
    switch ( ( cnt++ / 16 ) ) {
      case 32 :
        snd_trb = new Snd( acx, hrtz_trbl );
        break;
      case 8 :
        snd_bss = new Snd( acx, hrtz_bss );
        break;
      case 0 :
        chd_bs = new Snd( acx, [ gt_hrtz( -24 ), gt_hrtz( -21 ) ] );
        break;
      case 24 :
        chd_tr = new Snd( acx, [ gt_hrtz( 0 ), gt_hrtz( 3 ) ] );
        break;
      case 16 :
        sqk = new Snd( acx, [ gt_hrtz( 24 ) ] );
        sqk.set_vol( 0 );
        break;
    }
    if ( cnt % 8 === 0 || 
      ( cnt % 2 === 0 && 
      utl.any( Math.min( ~~( cnt / 128 ) - 1, 3), 0 ) > 0 ) ) {
      kck_drm( acx )
    }
    if ( ( cnt % 2 === 1 ) ||
      ( cnt % 2 === 0 
      && utl.any( Math.min( ~~( cnt / 128 ) - 1, 3), 0 ) > 0 ) ) {
      bng( acx, buff, 30000, .2, .18 );
    }
    switch ( cnt % 16 ) {
      case 0:
      case 2:
        if ( utl.any( 9, 0 ) > 0 ) {
          if ( chd_tr ) {
            chd_tr.set_nt( !( utl.any( 4, 0 ) ) ? 1 : 0 );
            chd_tr.surprise_type( 1, 3 );
            chd_tr.set_vol( .6 + utl.infany( .4 ) );
          }
          if ( chd_bs ) {
            chd_bs.set_nt( !( utl.any( 6, 0 ) ) ? 1 : 0 );
            chd_bs.surprise_type( 2, 3 );
            chd_bs.set_vol( 1.3 + utl.infany( 1 ) );
          }
        }
        break;
      case 1:
      case 3:
        if ( chd_tr ) { chd_tr.set_vol( 0 ) };
        if ( chd_bs ) { chd_bs.set_vol( 0 ) };
        break;
      case 4 :
        if ( sqk ) {
          if ( utl.any( 3, 0 ) > 0 ) {
            var n = utl.any ( 4, 0 );
            sqk.set_type( n );
            sqk.set_vol( 0.03 + ( 3 - n ) / 3 );
          }
        }
        break;
      case 5 :
        if ( sqk ) { sqk.set_vol( 0 ); }
        break;
    }
    if ( snd_bss ) {
      if ( !( cnt % 2 ) && utl.any( 2, 0 ) ) {
        snd_bss.set_nt( utl.any( hrtz_bss.length, 0 ) );
        snd_bss.surprise_type( 2, 3 );
        snd_bss.set_vol( Math.random() + 1 );
      } else {
        if ( ~~( utl.any( 2, 0 ) ) ) {
          snd_bss.set_vol( 0 );
        }
      }
    }
    if ( snd_trb && !( cnt % 2 ) && utl.any( 2, 0 ) ) {
      snd_trb.set_nt( utl.any( hrtz_trbl.length, 0 ) );
      snd_trb.surprise_type( 0, 3 );
      snd_trb.set_vol( Math.random() / 12 + .1 );
    }
  }

  window.setTimeout( chng, 216 );

  return {
    thrust_start: function() {
      thrust.set_vol( 1 );
    },
    thrust_stop: function() {
      thrust.set_vol( 0 );
    },
    shoot: function( vol ) {
      bng( acx, buff, 400, 1.25 * vol, .5)
    },
    boom: function( vol ) {
      bng( acx, buff, 100, 16 * vol, 3 );
    },
    reset: function() {
      if ( snd_trb ) { snd_trb.set_vol( 0 ); };
      if ( snd_bss ) { snd_bss.set_vol( 0 ); };
      chd_bs.set_vol( 0 );
      if ( chd_tr ) { chd_tr.set_vol( 0 ); };
      if ( sqk ) { sqk.set_vol( 0 ) };
      snd_trb = 0;
      snd_bss = 0;
      chd_bs = 0;
      chd_tr = 0;
      sqk = 0;
      cnt = 0;
    },
    upgrade: function() {
      sldr( acx, 110, 0.8, 1760, 1.2, .4 );
    }
  }

}
var snds = new Snds();
