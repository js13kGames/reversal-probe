var Scrbrd = function() {
  var you = 0,
    them = 0,
    size = 1,
    cnt = 0,
    mssgs = [
      'they got you.',
      'they scored.',
      'nearly good.',
      'oh dear.',
      'try plan b.'
    ],
    mssg = mssgs[ utl.any( mssgs.length, 0 ) ];

  function txt( tx, sz, y, mp, al, x ) {
    var add = mp ? cnt : 0,
      wbx = size * Math.sin( frame / 60 ) + size / 2,
      wby = size * Math.cos( frame / 51 ) / 2;
    x = x || 20;
    al = al || 'right';
    mp = mp || 0;
    cx.textAlign = al;
    cx.fillStyle = 'rgba(255,255,255,0.3)';
    cx.font = 'bold ' + ( size * ( sz + 1 ) + add ) + 'px sans-serif';
    cx.fillText( tx, cvw - ( (x - 20 / x ) ) + add / 4 - wbx, cvh - (y + 0.5) * size + add / 3  + wby );
    cx.fillStyle = 'rgba(255,255,255,0.6)';
    cx.font = 'bold ' + ( size * ( sz + 0.5 ) + add ) + 'px sans-serif';
    cx.fillText( tx, cvw - ( ( x - 10 /x ) ) + add / 4 - wbx, cvh - (y + 0.25) * size + add / 3 + wby );
    cx.fillStyle = 'white';
    cx.font = 'bold ' +  ( size * sz + add ) + 'px sans-serif';
    cx.fillText( tx, cvw - x + add / 4, cvh - y * size + add / 3 );
  }

  return {
    pt: function() {
      you++;
      cnt = 40;
    },
    drw: function() {
      if ( game_mode === 'end' || game_mode === 'init' || game_mode === 'pause' ) {
        size = cvh / 540 + 1.5;
      } else {
        size = 1;
      }
      if ( game_mode === 'end' ) {
        them = 1;
        txt( mssg, 36, cvh * 10 / 32 , 0, 'left', cvw - 20 );
        txt( 'again?', 36, cvh * 7 / 32, 0, 'left', cvw - 20 );
      }
      if ( game_mode === 'init' ) {
        txt( 'reversal', 36, cvh * 10 / 32, 0, 'left', cvw - 20 );
        txt( 'probe', 36, cvh * 7.5 / 32, 0, 'left', cvw - 20 );
      }
      if ( game_mode === 'pause' || game_mode === 'hint-end' || game_mode === 'hint-init' ) {
        // show hints
      }
      if ( game_mode === 'end' || game_mode === 'init' ) {
        txt( 'enter to play.', 16, cvh * 5 / 32, 0, 'left', cvw - 20 );
        txt( 'esc for hints.', 16, cvh* 3 / 32, 0, 'left', cvw - 20 );
      }
      cx.beginPath();
      txt( 'you:', 16, 115 );
      txt( you, 36, 76, 1 );
      txt( 'them:', 12, 56 );
      txt( them, 24, 32 );
      cx.closePath();
      if ( cnt > 0 ) { cnt--; };
    }
  }
}
var scrbrd = new Scrbrd();
