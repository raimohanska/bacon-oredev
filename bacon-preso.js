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
    return e.keyCode = keyCode && (!modifiers || _.all(knownModifiers, function(m) {
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
  var code = $("code:visible")
  code.blur()
  eval(code.text())
}

keyUps(10, ["alt"]).doAction(".preventDefault").onValue(runCode)
