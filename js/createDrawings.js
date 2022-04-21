
function draw(){
  this.drawBarriers = function(){
    this.barriers.forEach( barrier => {
      barrier.draw()
      const hasCollision = this.isCollidedCircle({
        circle: game.player,
        rectangle: barrier
      })
      if(hasCollision) {
        game.player.velocity.y = 0
        game.player.velocity.x = 0
      }
    })
  }
  this.drawPlayer = function(){
    game.player = this.Player({
      position: {
        x: game.sizeBarriers + (game.sizeBarriers / 2),
        y: game.sizeBarriers + (game.sizeBarriers / 2)
      },
      velocity: {
        x: 0,
        y: 0
      }
    })
    game.player.draw()
  }
  this.drawPellets = function(){
    for(let i = this.pellets.length - 1; 0 <= i; i--){
      const pellet = this.pellets[i]
      pellet.draw()
      
      if (Math.hypot(pellet.position.x - game.player.position.x, pellet.position.y - game.player.position.y) < pellet.radius + game.player.radius) {
    
          game.totalScore += 10
          this.pellets.splice(i, 1)
          if(!this.pellets.length) {
            this.showMessage("win")
          }
      }
    }
  }
  this.drawPowerUps = function(){
    for(let i = this.powerUps.length - 1; 0 <= i; i--){
      const powerUp = this.powerUps[i]
      powerUp.draw()
      
      if (Math.hypot(powerUp.position.x - game.player.position.x, powerUp.position.y - game.player.position.y) < powerUp.radius + game.player.radius) {
          this.powerUps.splice(i, 1)
          this.ghostsDisoriented = true 
          clearInterval(game.interval)
          
          game.interval = setTimeout(()=>{
            this.ghostsDisoriented = false
          }, 5000);
      }
    }
  }
  this.drawGhosts = function(){
    for(let i = this.ghosts.length - 1; 0 <= i; i--){
      const ghost = this.ghosts[i]
      ghost.update()
      
      if(Math.hypot(ghost.position.x - game.player.position.x, ghost.position.y - game.player.position.y) < ghost.radius + game.player.radius) {
          if(this.ghostsDisoriented){
            this.ghosts.splice(i, 1)
          } else {
            if(!ghost.playerCollision){
              window.navigator.vibrate(13)
              --game.player.life
              if(game.player.life == 0){
                this.showMessage("gameover")
              }
            }
            ghost.playerCollision = true
          }
      } else {
        ghost.playerCollision = false
      }
      
      const directionsSpeeds = {
        "right": { x: game.ghostsSpeed, y: 0 },
        "left": { x: -game.ghostsSpeed, y: 0 },
        "up": { x: 0, y: -game.ghostsSpeed },
        "down": { x: 0, y: game.ghostsSpeed },
      }
      
      let collisions = []  
      
      this.barriers.forEach( barrier => {
        ["right","left","up","down"].forEach( dir => {
          const velocity = directionsSpeeds[dir]
          if(!collisions.includes(dir) && this.isCollidedCircle(
            {
              circle: {
                ...ghost,
                velocity: {...velocity}
              },
              rectangle: barrier
            }
          )){
            collisions.push(dir)
          }
        })
      })
      
      if(collisions.length > ghost.prevCollisions.length)
        ghost.prevCollisions = collisions
        
      if( ghost.position.x + ghost.radius > game.width || ghost.position.x - ghost.radius < 0 ){
        ghost.velocity.x = ghost.velocity.x > 0 ? -game.ghostsSpeed : game.ghostsSpeed
        return
      } else if( ghost.position.y + ghost.radius > game.height || ghost.position.y - ghost.radius < 0 ){
        ghost.velocity.y = ghost.velocity.y > 0 ? -game.ghostsSpeed : game.ghostsSpeed
        return
      }
        
      if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions) ){
        if(ghost.velocity.x > 0) ghost.prevCollisions.push("right")
        else if(ghost.velocity.x < 0) ghost.prevCollisions.push("left")
        else if(ghost.velocity.y < 0) ghost.prevCollisions.push("up")
        else if(ghost.velocity.y > 0) ghost.prevCollisions.push("down")
        
        const pathways = ghost.prevCollisions.filter( collision => !collisions.includes(collision) )
        
        const direction = pathways[Math.floor(Math.random() * pathways.length)]
        
        switch (direction) {
          case 'left':
            ghost.velocity.x = -game.ghostsSpeed; 
            ghost.velocity.y = 0
            break;
          case 'right':
            ghost.velocity.x = game.ghostsSpeed;
            ghost.velocity.y = 0 
            break;
          case 'up':
            ghost.velocity.x = 0;
            ghost.velocity.y = -game.ghostsSpeed
            break;
          case 'down':
            ghost.velocity.x = 0;
            ghost.velocity.y = game.ghostsSpeed
            break;
        }
        
        ghost.prevCollisions = []
      }
    }
  }
  this.drawLife = function(h){
    let text = "";
    for(let i=1; i<=game.player.life; i++){
      text += `❤️`
    }
    game.context.font = '3.5vw sans-serif';
    game.context.fillStyle = "red"
    game.context.fillText(text, game.sizeBarriers * (game.currentMap.length - 6), h);
  }
}