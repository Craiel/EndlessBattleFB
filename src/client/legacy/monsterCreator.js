function MonsterCreator() {
    this.names = ["Zombie", "Skeleton", "Goblin", "Spider", "Troll", "Lizardman", "Ogre", "Orc"];
    this.monsterBaseHealth = 5;
    this.monsterBaseDamage = 0;
    this.monsterBaseGoldWorth = 1;
    this.monsterBaseExperienceWorth = 1;

    // Create a random monster of a specified level and rarity
    this.createRandomMonster = function createRandomMonster(level, rarity) {
        var name = this.names[Math.floor(Math.random() * this.names.length)];
        var health = game.systems.getMonsterHealth(rarity, level);
        var damage = game.systems.getMonsterDamage(rarity, level);
        var goldWorth = game.systems.getMonsterGoldWorth(rarity, level);
        var experienceWorth = game.systems.getMonsterExperienceWorth(rarity, level);

        return new Monster(name, level, rarity, health, damage, 0, goldWorth, experienceWorth);
    }

    // Calculate how much gold a monster would give of a certain level and rarity
    this.calculateMonsterGoldWorth = function calculateMonsterGoldWorth(level, rarity) {
        var goldWorth = (Sigma(level) * Math.pow(1.008, level)) / 4 + this.monsterBaseGoldWorth;
        goldWorth = Math.ceil(goldWorth);
        switch (rarity) {
            case "COMMON":
                break;
            case "RARE":
                goldWorth *= 1.5;
                break;
            case "ELITE":
                goldWorth *= 3;
                break;
            case "BOSS":
                goldWorth *= 6;
                break;
        }
        return goldWorth;
    }

    // Calculate how much experience a monster would give of a certain level and rarity
    this.calculateMonsterExperienceWorth = function calculateMonsterExperienceWorth(level, rarity) {
        var experienceWorth = (Sigma(level) * Math.pow(1.008, level)) / 5 + this.monsterBaseExperienceWorth;
        experienceWorth = Math.ceil(experienceWorth);
        switch (rarity) {
            case "COMMON":
                break;
            case "RARE":
                experienceWorth *= 1.5;
                break;
            case "ELITE":
                experienceWorth *= 3;
                break;
            case "BOSS":
                experienceWorth *= 6;
                break;
        }
        return experienceWorth;
    }

    // Calculate the rarity of a monster on a certain battle level at a certain battle depth
    this.calculateMonsterRarity = function calculateMonsterRarity(battleLevel, battleDepth) {
        // Calculate the chances for each monster rarity other than normal
        var rareChance = 0.001 + (battleLevel / 500);
        if (rareChance > 0.1) { rareChance = 0.1; }
        var eliteChance = 0;
        if (battleLevel >= 10) {
            eliteChance = 0.03 + (battleLevel / 12000);
            if (eliteChance > 0.05) { eliteChance = 0.05; }
        }
        var bossChance = 0;
        if (battleLevel >= 30) {
            bossChance = 0.03 + (battleLevel / 24000);
            if (bossChance > 0.01) { bossChance = 0.01; }
        }
        rareChance += eliteChance + bossChance;
        eliteChance += bossChance;

        // Choose the rarity randomly and return it
        var rand = Math.random();
        if (rand <= bossChance) {
            return MonsterRarity.BOSS;
        }
        else if (rand <= eliteChance) {
            return MonsterRarity.ELITE;
        }
        else if (rand <= rareChance) {
            return MonsterRarity.RARE;
        }
        else return MonsterRarity.COMMON;
    }

    // Get the name colour of a rarity
    this.getRarityColour = function getRarityColour(rarity) {
        switch (rarity) {
            case MonsterRarity.COMMON: return '#ffffff'; break;
            case MonsterRarity.RARE: return '#00fff0'; break;
            case MonsterRarity.ELITE: return '#ffd800'; break;
            case MonsterRarity.BOSS: return '#ff0000'; break;
        }
    }
}