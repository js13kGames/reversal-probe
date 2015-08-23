var cv = document.getElementById('cv'),
  cx = cv.getContext('2d'),
  pi = Math.PI,
  rgd = {
    lin: {
      vx: 0,
      vy: 0,
      x: 100,
      y: 100
    },
    ang: {
      vel: 0,
      rad: Math.random()*2*pi
    },
    ply: {
      ang: 0,
      rot: 0,
      r: 20
    }
  },
  toa,
  tof,
  con = 8,
  lasttows = [],
  cvw = ( cv.width = Math.min(window.innerWidth * 0.98, 1920) )  / 2,
  cvh = ( cv.height = Math.min(window.innerHeight * 0.98, 1200 ) ) / 2,
  env = {
    w: 3000,
    h: 2000,
    x: 1500,
    y: 1000,
    scrx: 0,
    scry: 0
  },
  frame = 0,
  lastframe = 0,
  log = 'Log message',
  game_mode = 'start';
