
const path = typeof tasker === "undefined" ? "." : tasker

const game = {
  maps: false,
  width: 0,
  height: 0,
  currentMapNumber: 0,
  currentMap: maps[0],
  totalScore: 0,
  running: false,
  animationID: 0,
  player: false,
  ghostsDisoriented: false,
  ghostsSpeed: 2,
  numberGhosts: 50,
  sizeBarriers: 0,
  interval: 0,
  
  path,
  barriers: [],
  ghosts: [],
  pellets: [],
  powerUps: [],
  pelletsBackup: [],
  powerUpsBackup: [],
  sizeBarriers: [],
  
  setContexts(){
    factory.call(this)
    draw.call(this)
    selectors.call(this)
    callbacks.call(this)
    utils.call(this)
    events.call(this)
  },
  start(){
    this.resizeMap()
    this.separateMap()
    this.drawPlayer()
    this.createGhosts()
  },
  resizeMap(){
    const cs = getComputedStyle(this.canvas)
    let width = parseInt(cs.getPropertyValue('width'))
    this.sizeBarriers = Math.floor(width / this.currentMap[0].length)
    this.width = this.sizeBarriers * this.currentMap[0].length
    this.height = this.sizeBarriers * this.currentMap.length
    this.canvas.width = this.width
    this.canvas.height = this.height
  },
  animate(){
    game.animationID = requestAnimationFrame(game.animate)
    game.context.clearRect(0, 0, game.canvas.width, game.canvas.height)
  
    if (control.direction) control.lastKey = control.direction
    if (control.lastKey) game.actionsCollision(control.lastKey)
    
    game.drawBarriers()
    game.drawPellets()
    game.drawPowerUps()
    game.drawGhosts()
    game.player.update()
    
    game.rotateAnimationPlayer()
    
    const w = 1
    const h = (game.sizeBarriers / 3) * 2
    game.context.font = '4vw sans-serif';
    game.context.fillStyle = "white"
    game.context.fillText(`Score: ${game.totalScore}`, game.sizeBarriers * w, h);
    
    game.drawLife(h)
  },
  resetGame(){
    console.log("reset")
    this.currentMapNumber = 0
    this.currentMap = maps[0]
    this.resizeMap()
    this.numberGhosts = 2
  },
  nextLevel(){
    ++this.currentMapNumber
    this.currentMap = maps[this.currentMapNumber]
    this.resizeMap()
    this.numberGhosts += 2
  },
  restartGame(action){
    control.direction = false
    control.contDir = 0
    control.lastKey = false
    this.joystick.style.transform = `translate3d(0px, 0px, 0px)`;
    this.running = false
    this.ghostsDisoriented = false
    this.totalScore = 0
    this.ghosts = []
    if(action == "next" || action == "reset"){
      this.barriers = []
      this.pellets = []
      this.powerUps = []
      this.separateMap()
    } else {
      this.pellets = [...this.pelletsBackup]
      this.powerUps = [...this.powerUpsBackup]
    }
    this.createGhosts()
    this.drawPlayer()
    this.animate()
  }
}

game.setContexts()
game.start()
game.animate()