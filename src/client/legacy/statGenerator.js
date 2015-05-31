function StatGenerator() {
    var rand;
    // Random min damage
    this.getRandomMinDamage = function getRandomMinDamage(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil(level * Math.pow(1.001, level)); break;
            case 1: return Math.ceil(((level * Math.pow(1.001, level)) + (level / 10) + 1)); break;
            case 2: return Math.ceil(((level * Math.pow(1.001, level)) + (level / 5) + 2)); break;
        }
    }

    // Random max damage
    this.getRandomMaxDamage = function getRandomMaxDamage(level, minDamage) {
        return (minDamage + this.getRandomDamageBonus(level));
    }

    // Random damage bonus
    this.getRandomDamageBonus = function getRandomDamageBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil((2 * level) * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }

    // Random strength bonus
    this.getRandomPrimaryStatBonus = function(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil(level * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }

    // Random health bonus
    this.getRandomHealthBonus = function getRandomHealthBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil((10 * level) * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil(((10 * level) * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil(((10 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }

    // Random hp5 bonus
    this.getRandomHp5Bonus = function getRandomHp5Bonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil((2 * level) * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }

    // Random crit damage bonus
    this.getRandomCritDamageBonus = function getRandomCritDamageBonus(level) {
        rand = Math.floor(Math.random() * 3);
        switch (rand) {
            case 0: return parseFloat((((((0.2 * level) * Math.pow(1.001, level) * 0.75) + 0.00001) * 100) / 100).toFixed(2)); break;
            case 1: return parseFloat((((((0.2 * level) * Math.pow(1.001, level) * 0.8) + 0.00001) * 100) / 100).toFixed(2)); break;
            case 2: return parseFloat((((((0.2 * level) * Math.pow(1.001, level) * 0.85) + 0.00001) * 100) / 100).toFixed(2)); break;
        }
    }
}