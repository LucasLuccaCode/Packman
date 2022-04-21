function selectors(){
  this.canvas = document.querySelector("canvas")
  this.context = this.canvas.getContext("2d")
  this.c_message = document.querySelector("[data-c_message]")
  this.message = document.querySelector("[data-message]")
  this.c_buttons = document.querySelector("[data-control_buttons]")
  this.joystick = document.querySelector(`[data-joystick]`)
  this.c_joystick = document.querySelector(`[data-control_joystick]`)
  this.pause = document.querySelector(`[data-pause]`)
  this.c_settings = document.querySelector(`[data-settings]`)
  this.selectControl = document.querySelector(`[data-select_control]`)
}

function callbacks(){
  this.movePlayer = ({ target: el }) => {
    const value = el.getAttribute("data-position")
    if (!value) return
    control.direction = false
    window.navigator.vibrate(10)
    game.running = true
    if (value == "stop") {
      game.ghostsDisoriented = !game.ghostsDisoriented
      return
    }
    control.lastKey = value
  }
  this.handleMove = (event) => {
    if (!control.active) return;
    let touchmoveId = null;
    if (event.changedTouches) {

      for (let i = 0; i < event.changedTouches.length; i++) {
        if (control.touchId == event.changedTouches[i].identifier) {
          touchmoveId = i;
          event.clientX = event.changedTouches[i].clientX;
          event.clientY = event.changedTouches[i].clientY;
        }
      }

      if (touchmoveId == null) return;
    }

    const xDiff = event.clientX - control.dragStart.x;
    const yDiff = event.clientY - control.dragStart.y;
    let dir = false
    const horizontalMovement = Math.abs(xDiff) > Math.abs(yDiff)
    if (horizontalMovement) {
      // é horizontal
      if (xDiff < 0) {
        dir = "a"
      } else {
        dir = "d"
      }
    } else {
      // é vertical
      if (yDiff < 0) {
        dir = "w"
      } else {
        dir = "s"
      }
    }

    if (control.contDir < 1) {
      ++control.contDir
      return
    }
    running = true
    control.direction = dir

    const angle = Math.atan2(yDiff, xDiff);
    const distance = Math.min(control.maxDistance, Math.hypot(xDiff, yDiff));
    const xPosition = distance * Math.cos(angle);
    const yPosition = distance * Math.sin(angle);

    // move stick image to new position
    this.joystick.style.transform = `translate3d(${xPosition}px, ${yPosition}px, 0px)`;

    // deadzone adjustment
    const distance2 = (distance < control.deadzone) ? 0: control.maxDistance / (control.maxDistance - control.deadzone) * (distance - control.deadzone);
    const xPosition2 = distance2 * Math.cos(angle);
    const yPosition2 = distance2 * Math.sin(angle);
    const xPercent = parseFloat((xPosition2 / control.maxDistance).toFixed(4));
    const yPercent = parseFloat((yPosition2 / control.maxDistance).toFixed(4));

    control.value = {
      x: xPercent,
      y: yPercent
    };
  }
  this.handleUp = (event) => {
    if (!control.active) return
    // if this is a touch event, make sure it is the right one
    if (event.changedTouches && control.touchId != event.changedTouches[0].identifier) return;

    game.running = true
    control.direction = false
    control.contDir = 0

    // transition the joystick position back to center
    this.joystick.style.transition = '.2s';
    this.joystick.style.transform = `translate3d(0px, 0px, 0px)`;

    // reset everything
    control.value = {
      x: 0,
      y: 0
    };
    control.touchId = null;
    control.active = false;
  }
  this.handleDown = (event) => {
    control.active = true;
    game.running = true
    // all drag movements are instantaneous
    this.joystick.style.transition = '0s';

    // touch event fired before mouse event; prevent redundant mouse event from firing
    event.preventDefault();

    if (event.changedTouches) {
      control.dragStart = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      }
    } else {
      control.dragStart = {
        x: event.clientX,
        y: event.clientY
      }
    }

    // if this is a touch event, keep track of which one
    if (event.changedTouches)
      control.touchId = event.changedTouches[0].identifier;
  }
  this.removeMessage = () =>  { 
    this.c_message.classList.remove("active")
    if(game.message.innerText.includes("WIN")){
      if(!game.currentMapNumber == maps.length - 1){
        game.nextLevel()
        game.restartGame("next")
        return
      }
    }
    game.restartGame()
  }
  this.showSettings = () => {
    window.navigator.vibrate(12)
    this.cancelAnimation()
    this.c_settings.classList.add("active")
  }
  this.settigsActions = ({ target: el }) => {
    const data = el.dataset
    const key = Object.keys(data)[0]
    const value = data[key]
    
    if(key == "settings"){
       this.c_settings.classList.remove("active")
       game.animate() 
       return
    }
    if(key != "settings_card") return
    window.navigator.vibrate(12)
    const actions = {
      continueGame(){ game.animate() },
      restart(){ game.restartGame() },
      reset(){ 
        game.resetGame();
        game.restartGame("reset") },
    }
    
    const func = actions[value]
    setTimeout( () => {
      if(func) func()
      this.c_settings.classList.remove("active")
    }, 100 )
  }
  this.toggleControls = ({ target: el }) => {
    const value = el.value
    console.log(value)
    if(value == "Joystick"){
      this.c_buttons.classList.remove("active")
      this.c_joystick.classList.add("active")
      return
    }
    this.c_joystick.classList.remove("active")
    this.c_buttons.classList.add("active")
  }
}

function events(){
  this.c_buttons.addEventListener("click", this.movePlayer)
  this.c_message.onclick = this.removeMessage
  this.joystick.addEventListener('mousedown', this.handleDown)
  this.joystick.addEventListener('touchstart', this.handleDown)
  document.addEventListener('mousemove', this.handleMove, { passive: false })
  document.addEventListener('touchmove', this.handleMove, { passive: false })
  document.addEventListener('mouseup', this.handleUp)
  document.addEventListener('touchend', this.handleUp)
  this.pause.onclick = this.showSettings
  this.c_settings.addEventListener("click", this.settigsActions)
  this.selectControl.onchange = this.toggleControls
}