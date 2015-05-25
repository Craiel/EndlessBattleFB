// duration in ms
function Particle(image, text, textColour, x, y, width, height, velocityX, velocityY, duration) {
    this.image = image;
    this.text = text;
    this.textColour = textColour;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.duration = duration;
    this.maxDuration = duration;

    this.update = function update(ms) {
        this.duration -= ms;
        var velX = (this.velocityX * (ms / 1000));
        var velY = (this.velocityY * (ms / 1000));
        this.x += velX;
        this.y += velY;
    }

    this.draw = function draw() {
        var canvas = document.getElementById("particleCanvas");
        var context = canvas.getContext("2d");
        if (this.duration <= this.maxDuration / 5) {
            var newAlpha = this.duration / (this.maxDuration / 5);
            if (newAlpha < 0) { newAlpha = 0; }
            context.globalAlpha = newAlpha;
        }
        if (this.image != null) {
            context.drawImage(this.image, this.x, this.y, 25, 25);
        }
        if (this.text != null) {
            context.shadowColor = "black";
            context.lineWidth = 3;
            context.strokeText(this.text, this.x + 12, this.y + 19);
            context.fillStyle = this.textColour;
            context.fillText(this.text, this.x + 12, this.y + 19);
        }
        context.globalAlpha = 1;
    }

    this.expired = function expired() {
        return this.duration <= 0;
    }
}