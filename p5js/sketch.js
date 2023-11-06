function preload() {
  // console.log(`#preload`)

  // init random seed
  const seed = ~~($fx.rand() * 123456789)
  randomSeed(seed)
  noiseSeed(seed)
  
  // preload files
  // ...
}

function setup() {
  // console.log(`#setup`)
  createCanvas(windowWidth, windowHeight);

  // setup
  // ...

  // sample
  drawFxRandomButton()
  // /sample
}

function windowResized() {
  // console.log(`#windowResized (${windowWidth}, ${windowHeight})`)
  resizeCanvas(windowWidth, windowHeight);

  // window resized
  // ...
}

function draw() {
  // if (frameCount == 1) console.log(`#draw at frameCount ${frameCount}`)

  const bgcolor = $fx.getParam("color_id").hex.rgba
  background(bgcolor);

  // sample
  drawCounter()
  drawFxValues()
  // /sample

  // capture by fxhash
  if (frameCount == 1) {
    // console.log(`Call $fx.preview() at frameCount ${frameCount}`)
    $fx.preview()
  }
}

// --------------------
//  samples
// --------------------

function drawCounter() {
  const getContrastTextColor = backgroundColor =>
    ((parseInt(backgroundColor, 16) >> 16) & 0xff) > 0xaa
      ? "#000000"
      : "#ffffff"

  const bgcolor = $fx.getParam("color_id").hex.rgba
  const textcolor = getContrastTextColor(bgcolor.replace("#", ""))

  noStroke()
  fill(textcolor)

  text(`frameCount:${frameCount}`, 10, height - 20);
}

let btn;
function drawFxRandomButton() {
  btn = createButton("emit random params")
  btn.position(10, 10);
  btn.mousePressed(() => {
    // console.log("emit params:update")
    $fx.emit("params:update", {
      number_id: $fx.getRandomParam("number_id"),
      bigint_id: $fx.getRandomParam("bigint_id"),
      string_id_long: $fx.getRandomParam("string_id_long"),
      select_id: $fx.getRandomParam("select_id"),
      color_id: $fx.getRandomParam("color_id"),
      boolean_id: $fx.getRandomParam("boolean_id"),
      string_id: $fx.getRandomParam("string_id"),
    })
  })
}

function drawFxValues() {
  const getContrastTextColor = backgroundColor =>
    ((parseInt(backgroundColor, 16) >> 16) & 0xff) > 0xaa
      ? "#000000"
      : "#ffffff"

  const bgcolor = $fx.getParam("color_id").hex.rgba
  const textcolor = getContrastTextColor(bgcolor.replace("#", ""))

  noStroke()
  fill(textcolor)

  text(`
hash: ${$fx.hash}
minter: ${$fx.minter}
iteration: ${$fx.iteration}
inputBytes: ${$fx.inputBytes}
context: ${$fx.context}
params:${$fx.stringifyParams($fx.getRawParams())}
`, 10, 60)
}

$fx.on(
  "params:update",
  newRawValues => {
    // opt-out default behaviour
    if (newRawValues.number_id === 5) return false
    // opt-in default behaviour
    return true
  },
  (optInDefault, newValues) => {
    // 
  }
)
