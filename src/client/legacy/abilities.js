function Abilities() {
    this.baseRendLevel = 0;
    this.getRendLevel = function getRendLevel() {
        var level = this.baseRendLevel;
        var effects = legacyGame.player.getEffectsOfType(EffectType.WOUNDING);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }
    this.rendDuration = 5;
    this.getRendDamage = function getRendDamage(levelBonus) {
        return Math.ceil((game.systems.getAverageDamage() / 17) + (legacyGame.player.level / 1.5)) * (this.getRendLevel() + levelBonus);
    }

    this.baseRejuvenatingStrikesLevel = 0;
    this.getRejuvenatingStrikesLevel = function getRejuvenatingStrikesLevel() {
        var level = this.baseRejuvenatingStrikesLevel;
        var effects = legacyGame.player.getEffectsOfType(EffectType.CURING);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }
    this.getRejuvenatingStrikesHealAmount = function getRejuvenatingStrikesHealAmount(levelBonus) {
        return Math.ceil((game.systems.getAverageDamage() / 54) + (legacyGame.player.level / 2)) * (this.getRejuvenatingStrikesLevel() + levelBonus);
    }

    this.baseIceBladeLevel = 0;
    this.getIceBladeLevel = function getIceBladeLevel() {
        var level = this.baseIceBladeLevel;
        var effects = legacyGame.player.getEffectsOfType(EffectType.FROST_SHARDS);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }
    this.iceBladeChillDuration = 5;
    this.getIceBladeDamage = function getIceBladeDamage(levelBonus) {
        return Math.ceil((game.systems.getAverageDamage() / 12) + legacyGame.player.level) * (this.getIceBladeLevel() + levelBonus);
    }

    this.baseFireBladeLevel = 0;
    this.getFireBladeLevel = function getFireBladeLevel() {
        var level = this.baseFireBladeLevel;
        var effects = legacyGame.player.getEffectsOfType(EffectType.FLAME_IMBUED);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }
    this.fireBladeBurnDuration = 5;
    this.getFireBladeDamage = function getFireBladeDamage(levelBonus) {
        return Math.ceil((game.systems.getAverageDamage() / 12) + legacyGame.player.level) * (this.getFireBladeLevel() + levelBonus);
    }
    this.getFireBladeBurnDamage = function getFireBladeBurnDamage(levelBonus) {
        return Math.ceil((game.systems.getAverageDamage() / 9) + legacyGame.player.level) * (this.getFireBladeLevel() + levelBonus);
    }

    this.save = function save() {
        localStorage.playerRendLevel = this.baseRendLevel;
        localStorage.playerRejuvenatingStrikesLevel = this.baseRejuvenatingStrikesLevel;
        localStorage.playerIceBladeLevel = this.baseIceBladeLevel;
        localStorage.playerFireBladeLevel = this.baseFireBladeLevel;
    }

    this.load = function load() {
        if (localStorage.playerRendLevel != null) { this.baseRendLevel = parseInt(localStorage.playerRendLevel); }
        if (localStorage.playerRejuvenatingStrikesLevel != null) { this.baseRejuvenatingStrikesLevel = parseInt(localStorage.playerRejuvenatingStrikesLevel); }
        if (localStorage.playerIceBladeLevel != null) { this.baseIceBladeLevel = parseInt(localStorage.playerIceBladeLevel); }
        if (localStorage.playerFireBladeLevel != null) { this.baseFireBladeLevel = parseInt(localStorage.playerFireBladeLevel); }
    }
}