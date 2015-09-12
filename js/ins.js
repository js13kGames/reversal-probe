var Ins = function() {
  var ins = this;
  ins.keys = {
    ntr: 13,
    left: 37,
    up: 38,
    right: 39,
    space: 32,
    w: 87,
    a: 65,
    d: 68,
    esc: 27
  };
  ins.keysDown = { left : 0, up : 0, right : 0 };
  ins.kDown = function(evt) {
    var KeyID = evt.keyCode;
    switch (KeyID) {
      case ins.keys.up : case ins.keys.w :
        ins.keysDown.up = 1;
        break;
      case ins.keys.left : case ins.keys.a :
        ins.keysDown.left = 1;
        break;
      case ins.keys.right : case ins.keys.d :
        ins.keysDown.right = 1;
        break;
      case ins.keys.ntr :
        ngn.go();
        break;
      case ins.keys.esc :
        ngn.esc();
        break;
    }
  }
  ins.kUp = function(evt) {
    var KeyID = evt.keyCode;
    switch (KeyID) {
      case ins.keys.up: case ins.keys.w:
        ins.keysDown.up = 0;
        snds.thrust_stop();
        break;
      case ins.keys.left: case ins.keys.a:
        ins.keysDown.left = 0;
        break;
      case ins.keys.right: case ins.keys.d:
        ins.keysDown.right = 0;
        break;
    }
  }
  window.addEventListener( 'keydown', ins.kDown );
  window.addEventListener( 'keyup', ins.kUp );
}
var ins = new Ins();

