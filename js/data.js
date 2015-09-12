var cv = document.getElementById('cv'),
  cx = cv.getContext('2d'),
  pi = Math.PI,
  rgd = {},
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
    y: 2100,
    scrx: 0,
    scry: 0,
    bg_col: [ 0, 0, 0 ]
  },
  frame = 0,
  game_mode = 'init',
  mvs = 0,
  num_nmys = 0,
  uniqr = Math.random(),
  uniqg = Math.random(),
  uniqb = Math.random(),

  settings = {
    'amt_bg': 80
  }

  nmys = [];
  bgs = [];

