function ParticleManager() {
    this.maxParticles = 50;
    this.particles = new Array();
    this.particleSources = new Object();
    this.particleSources.SKULL = "includes/images/skull.png";
    this.particleSources.GOLD = "includes/images/goldCoin.png";
    this.particleSources.EXP_ORB = "includes/images/expOrb.png";
    this.particleSources.PLAYER_DAMAGE = "includes/images/sword.png";
    this.particleSources.PLAYER_CRITICAL = "includes/images/sword.png";

    this.initialize = function initialize() {
        var canvas = document.getElementById("particleCanvas");
        var context = canvas.getContext("2d");
        context.font = "20px Gentium Book Basic";
        context.textAlign = 'center';
    }

    this.createParticle = function createParticle(text, imageType) {
        // If the type should not be displayed, end this function
        switch (imageType) {
            case ParticleType.SKULL: if (legacyGame.options.displaySkullParticles == false) { return; } break;
            case ParticleType.GOLD: if (legacyGame.options.displayGoldParticles == false) { return; } break;
            case ParticleType.EXP_ORB: if (legacyGame.options.displayExpParticles == false) { return; } break;
            case ParticleType.PLAYER_DAMAGE: if (legacyGame.options.displayPlayerDamageParticles == false) { return; } break;
            case ParticleType.PLAYER_CRITICAL: if (legacyGame.options.displayPlayerDamageParticles == false) { return; } break;
            case ParticleType.MONSTER_DAMAGE: if (legacyGame.options.displayMonsterDamageParticles == false) { return; } break;
        }

        // Calculate the left and top positions
        var left = Math.random() * 325 + 175;
        var top = Math.random() * 425 + 100;
        var textColour;
        var source = null;

        // Set the text colour and image source
        switch (imageType) {
            case ParticleType.SKULL: source = this.particleSources.SKULL; break;
            case ParticleType.GOLD: textColour = '#fcd200'; source = this.particleSources.GOLD; break;
            case ParticleType.EXP_ORB: textColour = '#00ff00'; source = this.particleSources.EXP_ORB; break;
            case ParticleType.PLAYER_DAMAGE: textColour = '#ffffff'; source = this.particleSources.PLAYER_DAMAGE; break;
            case ParticleType.PLAYER_CRITICAL: textColour = '#fcff00'; source = this.particleSources.PLAYER_CRITICAL; break;
            case ParticleType.MONSTER_DAMAGE: textColour = '#ff0000'; source = this.particleSources.MONSTER_DAMAGE; break;
        }

        // If there is text; create it
        var finalText = null;
        if (text != null) {
            // Calcuate the final text and set it
            finalText = '';
            if (imageType == ParticleType.GOLD || imageType == ParticleType.EXP_ORB) {
                finalText += '+';
            }
            else if (imageType == ParticleType.MONSTER_DAMAGE) {
                finalText += '-';
            }
            finalText += text;

            // If this was a player critical add an exclamation on the end
            if (imageType == ParticleType.PLAYER_CRITICAL) {
                finalText += '!';
            }
        }

        // If there is an image; create one
        var image = null;
        if (source != null) {
            var image = new Image();
            image.src = source;
        }

        var canvas = document.getElementById("particleCanvas");
        var context = canvas.getContext("2d");

        var particle = new Particle(image, finalText, textColour, left, top, 25, 25, 0, -50, 2000);
        this.particles.push(particle);
        // If the maximum amount of particles has been exceeded, remove the first particle
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, 1);
        }
    }

    this.update = function update(ms) {
        var canvas = document.getElementById("particleCanvas");
        var context = canvas.getContext("2d");
        var image;
        var p;
        context.clearRect(0, 0, 675, 550);
        for (var x = this.particles.length - 1; x >= 0; x--) {
            p = this.particles[x];
            p.update(ms);
            p.draw();
            if (p.expired()) {
                this.particles.splice(x, 1);
            }
        }
    }
}