
function utils(){
  this.separateMap = function(){
    game.currentMap.forEach((row, c) => {
      row.forEach((symbol, l) => {
        if(symbol === "."){
          game.pellets.push(
            this.Pellet({
              position: {
                x: l * game.sizeBarriers + game.sizeBarriers / 2,
                y: c * game.sizeBarriers + game.sizeBarriers / 2
              }
            })
          )
        } else if(symbol === "p"){
          game.powerUps.push(
            this.PowerUp({
              position: {
                x: l * game.sizeBarriers + game.sizeBarriers / 2,
                y: c * game.sizeBarriers + game.sizeBarriers / 2
              }
            })
          )
        } else {
          const pathImage = this.getImageBarrier(symbol)
          if(!pathImage) return
          game.barriers.push(
            this.Barrier({
              position: {
                x: l * game.sizeBarriers,
                y: c * game.sizeBarriers
              },
              image: this.createImage(pathImage)
            })
          )
        }
      })
    })
    game.pelletsBackup = [...game.pellets]
    game.powerUpsBackup = [...game.powerUps]
  }
  this.createGhosts = function(){
    for(let i=1; i <= game.numberGhosts; i++){
      let posXY, posY, posX, velocity
      while(posXY != "."){
        posY = this.getNumberRandom(3,game.currentMap.length - 1)
        posX = this.getNumberRandom(3,game.currentMap[0].length -1)
        posXY = game.currentMap[posY][posX]
      }
  
      if(game.currentMap[posY-1][posX] == "."){
        velocity = { x: 0, y: -game.ghostsSpeed }
      } else if(game.currentMap[posY+1][posX] == "."){
        velocity = { x: 0, y: game.ghostsSpeed }
      } else if(game.currentMap[posY][posX-1] == "."){
        velocity = { x: -game.ghostsSpeed, y: 0 }
      } else if(game.currentMap[posY][posX+1] == "."){
        velocity = { x: game.ghostsSpeed, y: 0 }
      }
      
      const color = `rgba(
      ${this.getNumberRandom(0,255)},
      ${this.getNumberRandom(0,255)},
      ${this.getNumberRandom(0,255)},
      1)`
      
      const srcGhostsImages = {
        0: `${path}/src/ghosts/ghost-blue.png`,
        1: `${path}/src/ghosts/ghost-red.png`,
        2: `${path}/src/ghosts/ghost-green.png`,
        3: `${path}/src/ghosts/ghost-yellow.png`,
      }
      
      const image = srcGhostsImages[Math.floor(Math.random() * 4)]
      
      this.ghosts.push(
        this.Ghost({
          position: {
            x: game.sizeBarriers * posX + ( game.sizeBarriers / 2 ),
            y: game.sizeBarriers * posY + ( game.sizeBarriers / 2 )
          },
          velocity,
          color,
          image: this.createImage(image)
        })
      )
    }
  }
  this.getNumberRandom = function(min, max){
    return Math.floor(Math.random() * (max - min +1) + min)
  }
  this.getImageBarrier = function(symbol){
    return {
      '-': `${path}/src/barriers/pipeHorizontal.png`,
      'o': `${path}/src/barriers/pipeHorizontal.png`,
      '|': `${path}/src/barriers/pipeVertical.png`,
      '1': `${path}/src/barriers/pipeCorner1.png`,
      '2': `${path}/src/barriers/pipeCorner2.png`,
      '3': `${path}/src/barriers/pipeCorner3.png`,
      '4': `${path}/src/barriers/pipeCorner4.png`,
      'b': `${path}/src/barriers/block.png`,
      '[': `${path}/src/barriers/capLeft.png`,
      ']': `${path}/src/barriers/capRight.png`,
      '_': `${path}/src/barriers/capBottom.png`,
      '^': `${path}/src/barriers/capTop.png`,
      '+': `${path}/src/barriers/pipeCross.png`,
      '5': `${path}/src/barriers/pipeConnectorTop.png`,
      '6': `${path}/src/barriers/pipeConnectorRight.png`,
      '7': `${path}/src/barriers/pipeConnectorBottom.png`,
      '8': `${path}/src/barriers/pipeConnectorLeft.png`,
    }[symbol] || false
  }
  this.createImage = function(src){
    const image = new Image()
    image.src = src
    return image
  }
  this.isCollidedCircle = function({ circle, rectangle }){
    const padding = this.sizeBarriers / 2 - circle.radius - 2
    return(
         circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding 
      && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding 
      && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding 
      && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
  }
  this.actionsCollision = function(direction){
    const speeds = {
      a: { x: -game.player.speed, y: 0 },
      w: { x: 0, y: -game.player.speed },
      d: { x: game.player.speed, y: 0 },
      s: { x: 0, y: game.player.speed },
    }
    const velocity = speeds[direction]
    
    for(let i = 0; i < game.barriers.length; i++) {
      const barrier = game.barriers[i]
      const hasCollision = this.isCollidedCircle({
        circle: {
          ...game.player, 
          velocity
        },
        rectangle: barrier
      })
  
      if(hasCollision) {
        if(["a","d"].includes(direction)) 
          game.player.velocity.x = 0
        if(["w","s"].includes(direction))
          game.player.velocity.y = 0
        break
      } else {
        if(["a","d"].includes(direction)) 
          game.player.velocity.x = velocity.x
        if(["w","s"].includes(direction))
          game.player.velocity.y = velocity.y
      }
    }
  }
  this.rotateAnimationPlayer = function(){
    if(game.player.velocity.x > 0 ) {
      game.player.rotation = 0
    } else if(game.player.velocity.x < 0 ){
      game.player.rotation = Math.PI
    } else if(game.player.velocity.y > 0 ){
      game.player.rotation = Math.PI / 2
    } else if(game.player.velocity.y < 0 ){ 
      game.player.rotation = Math.PI * 1.5
    }
  }
  this.debounce = function(func, wait, immediate){
    let timeout;
    return function(...args) {
      const context = this;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }
  this.cancelAnimation = function(){
    window.cancelAnimationFrame(game.animationID)
  }
  this.showMessage = function(type){
    this.cancelAnimation()
    this.c_message.classList.add("active")
    this.message.textContent = type == "win" ? "YOU WIN!!" : "GAME OVER"
    
  }
}