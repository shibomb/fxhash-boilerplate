// ========================================
// utilities
// ========================================

function termlog(term, msg, param = undefined) {
  if (frameCount % term == 0 || frameCount == 1) {
    if (param == undefined) {
      console.log(msg)
    } else {
      console.log(msg, param)
    }
  }
}

function logFxData() {
  console.log(`#logFxData`)

  console.log(
    `logFxData data`,
    JSON.stringify({
      fxrand: fxrand(),
      hash: $fx.hash,
      minter: $fx.minter,
      iteration: $fx.iteration,
      inputBytes: $fx.inputBytes,
      context: $fx.context,
    })
  )

  console.log(`logFxData fxparams`, $fx.stringifyParams($fx.getRawParams()))
}

// ========================================
// start up funcitons
// ========================================

function preload() {
  console.log(`#preload`)

  // --------------------
  // init random seed
  // --------------------
  const seed = ~~(fxrand() * 123456789)
  randomSeed(seed)
  noiseSeed(seed)

  // --------------------
  // preload files
  // --------------------

  // ...
}

function setup() {
  console.log(`#setup`)
  start(true)
}

function windowResized() {
  console.log(`#windowResized (${windowWidth}, ${windowHeight})`)
  start(false)
}

let W
let H
let DRAW_ONCE = false

function start(isSetup = true) {
  console.log(`#start`)

  // --------------------
  // setup canvas
  // --------------------
  W = windowWidth
  H = windowHeight
  if (isSetup) {
    createCanvas(W, H)
  } else {
    resizeCanvas(W, H)
  }

  // --------------------
  // prepare data
  // --------------------
  prepareData()

  // --------------------
  // draw
  // --------------------
  if (DRAW_ONCE) {
    noLoop()
    redraw()
  }
}

// ========================================
// drawing functions
// ========================================

// example: objs
const MAX = 12
let objs

function prepareData() {
  console.log(`#prepareData`)

  // --------------------
  // set default fx params. (comment to set random)
  // --------------------
  $fx.emit('params:update', {
    number_id: 5,
    bigint_id: BigInt(1),
    // string_id_long: 'nothing',
    select_id: 'pear',
    color_id: '106090ff',
    boolean_id: true,
    string_id: 'this is the boilerplate for fxhash p5.js :)',
  })

  // --------------------
  // prepare data
  // --------------------

  // example: prepare objs
  objs = []
  for (let i = 0; i < MAX; i++) {
    objs.push({ x: random(width), y: random(height), l: random(), c: noise(i) * 360 })
  }
}

function draw() {
  termlog(360, `#draw ${frameCount}`)

  // example: fx param color
  colorMode(RGB)
  background($fx.getParam('color_id').hex.rgba)

  // example: noisy color, fx param number, boolean
  push()
  {
    colorMode(HSB)
    const step = Math.floor($fx.getParam('number_id') * 10)
    const scroll = $fx.getParam('boolean_id') ? frameCount * 0.001 : 0

    for (let y = height / 2; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        noStroke()
        fill(
          noise(x * 0.001 + scroll, y * 0.001, Math.floor($fx.getParam('number_id'))) * 360,
          100,
          100
        )
        rect(x, y, step, step)
      }
    }
  }
  pop()

  // example: fx param selection
  push()
  {
    colorMode(HSB)
    for (const o of objs) {
      const nz = noise(o.x * o.y + frameCount * 0.001)
      switch ($fx.getParam('select_id')) {
        case 'apple':
          noStroke()
          fill(o.c, 100, 100, 0.5)
          circle(o.x * nz, o.y, (o.l * width) / 5)
          break
        case 'orange':
          noStroke()
          fill(o.c, 100, 100, 0.5)
          rectMode(CENTER)
          square(o.x, o.y * nz, (o.l * width) / 5)
          break
        case 'pear':
          strokeWeight(4)
          stroke(o.c, 100, 100, 0.5)
          noFill()
          for (let i = 0; i < o.l * 10; i++) {
            const rad = nz * i * TAU * 2
            line(
              o.x,
              o.y,
              o.x + (cos(rad) * (o.l * width)) / 10,
              o.y + (sin(rad) * (o.l * width)) / 10
            )
          }
          break
      }
    }
  }
  pop()

  // example: fx param text bigint
  push()
  {
    noStroke()
    fill(255, 128)
    textSize(40)
    text($fx.getParam('string_id'), 0, height / 2)
    text($fx.getParam('bigint_id') / BigInt(2), 0, height / 2 + 40)
  }
  pop()

  // --------------------
  // preview
  // --------------------
  if (frameCount === 1) fxpreview()
}

function keyTyped() {
  console.log(`#keyTyped ${key}`)
  if (key === 's') {
    save(fxhash)
  } else if (key === 'l') {
    logFxData()
  } else if (key === 'r') {
    start(false)
  }

  return false
}
