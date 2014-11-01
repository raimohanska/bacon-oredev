var drums = Drums("drums/audio")
document.addEventListener("drumsloaded", function() {
  console.log("drums ready")
})

function keyUps(keyCode, modifiers) { 
  return $(document).asEventStream("keyup")
                    .filter(filterKeys(keyCode, modifiers)) 
}

function keyDowns(keyCode, modifiers) { 
  return $(document).asEventStream("keydown")
                    .filter(filterKeys(keyCode, modifiers)) 
}

function filterKeys(keyCode, modifiers) {
  var knownModifiers = ["alt", "shift", "meta"]
  return function(e) {
    return e.keyCode == keyCode && (!modifiers || _.all(knownModifiers, function(m) {
      var modifierActive = e[m + "Key"]
      var expectedActive = _.contains(modifiers, m)
      return modifierActive == expectedActive
    }))
  }
}

function keyState(keyCode, value) {
  return keyDowns(keyCode).map([value]).merge(keyUps(keyCode).map([])).toProperty([]).skipDuplicates()
}

function runCode() {
  var code = $(".present code:visible")
  code.blur()
  eval(code.text())
}

function bubble(text) {
  var vmargin = $(window).height() * 0.1
  var vspace = $(window).height() - 100 - vmargin*2
  makeBubble(2, 10, 1.0, 1.0)
  makeBubble(1, -1, 0.3, 0.7)
  makeBubble(0.5, -2, 0.15, 0.5)
  function makeBubble(fs, zind, op, hscale) {
    var top = (typeof text == "string") 
      ? (text.charCodeAt(0) % 5) * vspace / 5 + vmargin
      : vmargin + Math.random()*vspace
    var bsize = fs*2
    var bubble = $("<div>").text(text).addClass("bubble")
    var winWidth = $(window).width()
    var startX = (1-hscale)/2*winWidth
    var endX = startX + (winWidth+100)*hscale
    bubble.css({
      opacity: op,
      "font-size": fs + "em",
      background: "linear-gradient(rgb(100, 169, 150), rgb(116, 133, 141))", color: "white",
      "border-radius": bsize/2 + "em", "z-index": zind,
      width:bsize+"em", height:bsize+"em", "line-height":bsize+"em",
      "text-align": "center",
      "text-transform": "uppercase", "font-family": "Helvetica, Arial, SansSerif",
      position:"fixed", top: top, 
      right: startX
    })
    $("body").append(bubble)
    bubble.css({transition: "all 5s linear"})
    Bacon.later(0).onValue(function() {
        bubble.css({right: endX, opacity: 0})
    })
  }
}

Bacon.Observable.prototype.show = function() {
  this.onValue(bubble)
  return this
}

Bacon.fromString = function(sting, delay) { 
  if (!delay) delay = 200
  var values = sting.split("")
  return Bacon.later(0, values[0])
   .concat(
     Bacon.sequentially(delay, values.slice(1))
   )
   .filter(function(x) { return x != "-" })
}

function toDrum(s) {
  var drums = {
    k: "kick",
    s: "snare",
    h: "hihat",
    1: "tom1",
    2: "tom2",
    3: "tom3"
  };
  return drums[s]
}

keyUps(13, ["alt"]).doAction(".preventDefault").onValue(runCode)
