
function factory(){
  this.Barrier = function({ position, image }){
    return {
      position,
      width: game.sizeBarriers,
      height: game.sizeBarriers,
      image,
      draw() {
        // game.context.fillStyle = "blue"
        // game.context.fillRect(
        //   this.position.x, this.position.y,
        //   this.width, this.height
        // )
        game.context.drawImage(
          this.image, this.position.x, this.position.y,
          game.sizeBarriers, game.sizeBarriers
        )
      }
    }
  }
  this.Player = function({ position, velocity }){
    
    return {
      position,
      velocity,
      radius: game.sizeBarriers / 3 + 2,
      speed: 2.5,
      life: 5,
      radians: 0.75,
      openRate: 0.12,
      rotation: 0,
      
      draw(){
        game.context.save()
        game.context.translate(this.position.x, this.position.y)
        game.context.rotate(this.rotation)
        game.context.translate(-this.position.x, -this.position.y)
        game.context.beginPath()
        game.context.arc(
          this.position.x, this.position.y,
          this.radius, this.radians, Math.PI * 2 - this.radians
        )
        game.context.lineTo(this.position.x, this.position.y)
        game.context.fillStyle = "yellow"
        game.context.fill()
        game.context.closePath()
        game.context.restore()
      },
      update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        if(this.radians < 0 || this.radians > .75) this.openRate = -this.openRate
        this.radians += this.openRate
      }
    }
  }
  this.Ghost = function({ position, velocity, color = "red", image }){
    return {
      position,
      velocity,
      radius: game.sizeBarriers / 3 + 2,
      speed: 2,
      color,
      playerCollision: false,
      prevCollisions: [],
      image,
      
      draw(){
        const img = game.ghostsDisoriented ? game.createImage(`${game.path}/src/ghosts/ghost-disoriented.png`) : this.image
        game.context.drawImage(
          img, this.position.x - game.sizeBarriers / 2, this.position.y - game.sizeBarriers / 2,
          game.sizeBarriers, game.sizeBarriers
        )
      },
      update() {
        this.draw()
        if( game.running ){
          this.position.x += this.velocity.x
          this.position.y += this.velocity.y
        }
      }
    }
  }
  this.Pellet = function({ position }){
    return {
      position,
      radius: 3,
      
      draw(){
        game.context.beginPath()
        game.context.arc(
          this.position.x, this.position.y,
          this.radius, 0, Math.PI * 2
        )
        game.context.fillStyle = "white"
        game.context.fill()
        game.context.closePath()
      },
    }
  }
  this.PowerUp = function({ position }){
    return {
      position,
      radius: 10,
      
      draw() {
        game.context.beginPath()
        game.context.arc(
          this.position.x, this.position.y,
          this.radius, 0, Math.PI * 2
        )
        game.context.fillStyle = "white"
        game.context.fill()
        game.context.closePath()
      }
    }
  }
}
