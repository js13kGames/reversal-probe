var Snd = function( acx, hzs ) {
  var hzs = hzs || [ 440 ],
    osc = acx.createOscillator(),
    gainr = acx.createGain(),
    max_vol = 0.75;

  osc.type = 'sine';
  osc.frequency.value = hzs[ 0 ],
  gainr.gain.value = max_vol,
  osc.start( 0 );
  osc.connect(gainr),
  gainr.connect(acx.destination);
  return{
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

var Snds = function() {

  var stone = 1.0594630943592954,
    a0 = 440,
    cnt = 0,
    acx = new (window.AudioContext || window.webkitAudioContext)(),
    nts_bss = [ -36, -33, -31, -29 ],
    nts = [ 0, 3, 5, 6, 7 ],
    hrtz_bss = [],
    hrtz_trbl = [];
    
  function gt_hrtz( frm_a0 ) {
    return Math.round( 100 * a0 * Math.pow( stone, frm_a0 ) ) / 100;
  }
  
  for ( var n = 0, l = nts_bss.length; n < l; n++ ) {
    hrtz_bss.push( gt_hrtz( nts_bss[ n ] ) );
  }
  for ( var n = 0, l = nts.length; n < l; n++ ) {
    hrtz_trbl.push( gt_hrtz( nts[ n ] ) );
  }
  var snd_bss = new Snd( acx, hrtz_bss );
  var snd_trb = new Snd( acx, hrtz_trbl );

  function chng() {
    window.setTimeout( chng, 200 );
    if ( cnt++ % 2 && ~~( utl.any( 2, 0 ) ) ) {
      snd_bss.set_nt( utl.any( hrtz_bss.length, 0 ) );
      snd_bss.surprise_type( 0, 1 );
      snd_bss.set_vol( Math.random() / 2 + .5 );
    } else {
      if ( ~~( utl.any( 2, 0 ) ) ) {
        snd_bss.set_vol( 0 );
      }
    }
    if ( ~~( utl.any( 2, 0 ) ) ) {
      snd_trb.set_nt( utl.any( hrtz_trbl.length, 0 ) );
      snd_trb.surprise_type( 0, 4 );
      snd_trb.set_vol( Math.random() / 8 + .125 );
    }
  }

  window.setTimeout( chng, 200 );

}
var snds = new Snds();
