class CustomAnimatedSprite extends PIXI.extras.AnimatedSprite {
  constructor(position, textures) {
    super(textures, true);
    this.position = position;
    this.anchor.set(0.5);
    this.animationSpeed = 0.2;
    this.loop = false;
  }

  addToStage(stage) {
    stage.addChild(this);

    this.onComplete = () => {
      if (this.parent) {
        this.parent.removeChild(this);
      }
    }
    this.play();
  }
}
