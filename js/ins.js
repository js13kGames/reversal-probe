var Ins = function() {
  var ins = this;
  ins.keys = {
    ntr: 13,
    left: 37,
    up: 38,
    right: 39,
    space: 32
  };
  ins.keysDown = { left: false, up: false, right: false };
    ins.kDown = function(evt) {
      var KeyID = evt.keyCode;
      switch (KeyID) {
        case ins.keys.up: case ins.keys.w:
          if(!ins.keysDown.up) {
            ins.keysDown.up = true;
          }
          break;
        case ins.keys.space: case ins.keys.ntr:
          con = Math.min( con + 6, 74 );
          break;
        case ins.keys.left: case ins.keys.a:
          if(!ins.keysDown.left) {
            ins.keysDown.left = true;
          }
          break;
        case ins.keys.right: case ins.keys.d:
          if(!ins.keysDown.right) {
            ins.keysDown.right = true;
          }
          break;
      }
    }
    ins.kUp = function(evt) {
      var KeyID = evt.keyCode;
      switch (KeyID) {
        case ins.keys.up: case ins.keys.w:
          ins.keysDown.up = false;
          break;
        case ins.keys.left: case ins.keys.a:
          ins.keysDown.left = false;
          break;
        case ins.keys.right: case ins.keys.d:
          ins.keysDown.right = false;
          break;
      }
    }
  window.addEventListener( 'keydown', ins.kDown );
  window.addEventListener( 'keyup', ins.kUp );
}
var ins = new Ins();

