function setup() {
  // console.log("setup()")

  createCanvas(windowWidth, windowHeight);

  const bgcolor = $fx.getParam("color_id").hex.rgba
  background(bgcolor);

  // sample
  drawFxRandomButton()
}

function draw() {
  // console.log("draw()")

  const bgcolor = $fx.getParam("color_id").hex.rgba
  background(bgcolor);

  // sample
  drawFxValues()
}

// --------------------
//  samples
// --------------------

function drawFxValues() {
  const getContrastTextColor = backgroundColor =>
    ((parseInt(backgroundColor, 16) >> 16) & 0xff) > 0xaa
      ? "#000000"
      : "#ffffff"

  const bgcolor = $fx.getParam("color_id").hex.rgba
  const textcolor = getContrastTextColor(bgcolor.replace("#", ""))

  noStroke()
  fill(textcolor)

  const valueTexts = [
    `hash: ${$fx.hash}`,
    `minter: ${$fx.minter}`,
    `iteration: ${$fx.iteration}`,
    `inputBytes: ${$fx.inputBytes}`,
    `context: ${$fx.context}`,
    `params:${$fx.stringifyParams($fx.getRawParams())}`
  ]

  for(let i = 0; i < valueTexts.length; i++) {
    text(valueTexts[i], 10, i * 20 + 60);
  }
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

$fx.on(
  "params:update",
  newRawValues => {
    // opt-out default behaviour
    if (newRawValues.number_id === 5) return false
    // opt-in default behaviour
    return true
  },
  (optInDefault, newValues) => {
    // console.log("on params:update", [optInDefault, newValues])
  }
)
