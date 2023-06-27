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

  console.log(`logFxData fxParams`, $fx.stringifyParams($fx.getRawParams()))

  console.log(`logFxData fxFeatures`, $fx.stringifyParams($fx.getFeatures()))
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
let MAX
let objs

function prepareData() {
  console.log(`#prepareData`)

  // --------------------
  // set default fx params. (comment to set random)
  // --------------------
  // $fx.emit('params:update', {
  //   number_id: 5,
  //   // bigint_id: BigInt(1),
  //   // string_id_long: 'nothing',
  //   select_id: 'pear',
  //   color_id: '106090ff',
  //   boolean_id: true,
  //   string_id: 'boilerplate for fxhash p5.js :)',
  // })

  // --------------------
  // prepare data
  // --------------------

  // example: prepare objs, fx feature
  MAX = $fx.getFeature('A random feature') + 1
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

  // example: noisy color, fx iteration, fx feature, fx param number, boolean
  push()
  {
    colorMode(HSB)
    const step = Math.floor($fx.getParam('number_id') * 10)
    const scroll = $fx.getParam('boolean_id') ? frameCount * 0.001 : 0
    const scrollDirection = $fx.getFeature('A random boolean') ? 1 : -1
    const startY = $fx.iteration % 2 == 0 ? height / 2 : 0
    const endY = $fx.iteration % 2 == 0 ? height : height / 2
    for (let y = startY; y < endY; y += step) {
      for (let x = 0; x < width; x += step) {
        noStroke()
        fill(
          noise(
            x * 0.001 + scroll * scrollDirection,
            y * 0.001,
            Math.floor($fx.getParam('number_id'))
          ) * 360,
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
      const size = (o.l * width) / 5
      switch ($fx.getParam('select_id')) {
        case 'apple':
          noStroke()
          fill(o.c, 100, 100, 0.5)
          circle(o.x + size * nz, o.y, size)
          break
        case 'orange':
          noStroke()
          fill(o.c, 100, 100, 0.5)
          rectMode(CENTER)
          square(o.x, o.y + size * nz, size)
          break
        case 'pear':
          strokeWeight(4)
          stroke(o.c, 100, 100, 0.5)
          noFill()
          for (let i = 0; i < o.l * 10; i++) {
            const rad = nz * i * TAU * 2
            line(o.x, o.y, o.x + cos(rad) * size * 0.5, o.y + sin(rad) * size * 0.5)
          }
          break
      }
    }
  }
  pop()

  // example: fx featuer, fx param text bigint
  push()
  {
    noStroke()
    fill(255, 128)
    textSize(40)
    textAlign(CENTER)
    text($fx.getParam('string_id'), width / 2, height / 2)
    text($fx.getFeature('A random string') + $fx.getParam('bigint_id'), width / 2, height / 2 + 40)
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
