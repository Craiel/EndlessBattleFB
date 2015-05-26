function Player() {
    this.level = 1;
    this.health = 100;

    // Base values for all stats; these are static
    this.baseStats = new StatsSet();
    this.baseStats.health = this.health;
    this.baseStats.hp5 = 10;
    this.baseStats.minDamage = 1;
    this.baseStats.maxDamage = 1;
    this.baseStats.damageBonus = 0;
    this.baseStats.armour = 0;
    this.baseStats.evasion = 0;
    this.baseStats.strength = 0;
    this.baseStats.agility = 0;
    this.baseStats.stamina = 0;
    this.baseStats.critChance = 5;
    this.baseStats.critDamage = 200;
    this.baseStats.itemRarity = 0;
    this.baseStats.goldGain = 0;
    this.baseStats.experienceGain = 0;

    // Stat bonuses automatically gained when leveling up
    this.baseLevelUpBonuses = new StatsSet();
    this.baseLevelUpBonuses.health = 5;
    this.baseLevelUpBonuses.hp5 = 1;

    // The amount of stats the player has gained from leveling up
    this.levelUpBonuses = new StatsSet();

    // Stat bonuses chosen when leveling up
    this.chosenLevelUpBonuses = new StatsSet();

    // Item stat bonuses; this does not include increases to these stats
    this.baseItemBonuses = new StatsSet();

    // All the special effects from items the player has
    this.effects = new Array();

    // Combat
    this.lastDamageTaken = 0;
    this.alive = true;
    this.canAttack = true;
    this.attackType = AttackType.BASIC_ATTACK;

    // Resources
    this.gold = 0;
    this.lastGoldGained = 0;
    this.experience = 0;
    this.baseExperienceRequired = 10;
    this.experienceRequired = 0;
    this.lastExperienceGained = 0;
    this.powerShards = 0;

    // Death
    this.resurrecting = false;
    this.resurrectionTimer = 60;
    this.resurrectionTimeRemaining = 0;

    // Abilities
    this.skillPointsSpent = 0;
    this.skillPoints = 0;
    this.abilities = new Abilities();

    // Buffs/Debuffs
    this.buffs = new BuffManager();
    this.debuffs = new DebuffManager();

    // Stat calculation functions
    this.getMaxHealth = function getMaxHealth() {
        return Math.floor((this.getStrength() * 5) + (((this.baseStats.health + this.levelUpBonuses.health + this.baseItemBonuses.health) * (((legacyGame.mercenaryManager.getCommanderHealthPercentBonus() * legacyGame.mercenaryManager.commandersOwned) / 100) + 1)) * legacyGame.getPowerShardBonus()));
    }
    this.getHp5 = function getHp5() {
        return Math.floor(this.getStamina() + (((this.baseStats.hp5 + this.levelUpBonuses.hp5 + this.chosenLevelUpBonuses.hp5 + this.baseItemBonuses.hp5) * ((legacyGame.mercenaryManager.getClericHp5PercentBonus() * legacyGame.mercenaryManager.clericsOwned) / 100 + 1)) * legacyGame.getPowerShardBonus()));
    }
    this.getDamageBonusMultiplier = function() {
        return (this.getDamageBonus() + 100) / 100;
    }
    this.getMinDamage = function getMinDamage() {
        // If the player has a weapon equipped then remove the 1 unarmed damage
        if (legacyGame.equipment.weapon() != null) {
            return Math.floor((((this.baseStats.minDamage + this.baseItemBonuses.minDamage - 1) * this.getDamageBonusMultiplier()) * this.buffs.getDamageMultiplier()) * legacyGame.getPowerShardBonus());
        }
        else {
            return this.baseStats.strength + Math.floor((((this.baseStats.minDamage + this.baseItemBonuses.minDamage) * this.getDamageBonusMultiplier()) * this.buffs.getDamageMultiplier()) * legacyGame.getPowerShardBonus());
        }
    }
    this.getMaxDamage = function getMaxDamage() {
        // If the player has a weapon equipped then remove the 2 unarmed damage
        if (legacyGame.equipment.weapon() != null) {
            return Math.floor((((this.baseStats.maxDamage + this.baseItemBonuses.maxDamage - 1) * this.getDamageBonusMultiplier()) * this.buffs.getDamageMultiplier()) * legacyGame.getPowerShardBonus());
        }
        else {
            return this.baseStats.strength + Math.floor((((this.baseStats.maxDamage + this.baseItemBonuses.maxDamage) * this.getDamageBonusMultiplier()) * this.buffs.getDamageMultiplier()) * legacyGame.getPowerShardBonus());
        }
    }
    this.getDamageBonus = function getDamageBonus() {
        return this.getStrength() + ((this.baseStats.damageBonus + this.chosenLevelUpBonuses.damageBonus + this.baseItemBonuses.damageBonus + (legacyGame.mercenaryManager.getMageDamagePercentBonus() * legacyGame.mercenaryManager.magesOwned)) * legacyGame.getPowerShardBonus());
    }
    this.getAverageDamage = function getAverageDamage() {
        var average = this.getMaxDamage() - this.getMinDamage();
        average += this.getMinDamage();
        return average;
    }
    this.getArmour = function getArmour() {
        return Math.floor(((this.baseStats.armour + this.chosenLevelUpBonuses.armour + this.baseItemBonuses.armour) * ((this.getStamina() / 100) + 1)) * legacyGame.getPowerShardBonus());
    }
    this.getEvasion = function getEvasion() {
        return Math.floor(((this.baseStats.evasion + this.chosenLevelUpBonuses.evasion + this.baseItemBonuses.evasion) * (((this.getAgility() + (legacyGame.mercenaryManager.getAssassinEvasionPercentBonus() * legacyGame.mercenaryManager.assassinsOwned)) / 100) + 1)) * legacyGame.getPowerShardBonus());
    }
    this.getStrength = function getStrength() {
        return Math.floor((this.baseStats.strength + this.chosenLevelUpBonuses.strength + this.baseItemBonuses.strength) * legacyGame.getPowerShardBonus());
    }
    this.getStamina = function getStamina() {
        return Math.floor((this.baseStats.stamina + this.chosenLevelUpBonuses.stamina + this.baseItemBonuses.stamina) * legacyGame.getPowerShardBonus());
    }
    this.getAgility = function getAgility() {
        return Math.floor((this.baseStats.agility + this.chosenLevelUpBonuses.agility + this.baseItemBonuses.agility) * legacyGame.getPowerShardBonus());
    }
    this.getCritChance = function getCritChance() {
        return ((this.baseStats.critChance + this.chosenLevelUpBonuses.critChance + this.baseItemBonuses.critChance)) * legacyGame.getPowerShardBonus();
    }
    this.getCritDamage = function getCritDamage() {
        return ((this.baseStats.critDamage + this.chosenLevelUpBonuses.critDamage + this.baseItemBonuses.critDamage) + (this.getAgility() * 0.2) + (legacyGame.mercenaryManager.getWarlockCritDamageBonus() * legacyGame.mercenaryManager.warlocksOwned)) * legacyGame.getPowerShardBonus();
    }
    this.getItemRarity = function getItemRarity() {
        return (this.baseStats.itemRarity + this.chosenLevelUpBonuses.itemRarity + this.baseItemBonuses.itemRarity) * legacyGame.getPowerShardBonus();
    }
    this.getGoldGain = function getGoldGain() {
        return (this.baseStats.goldGain + this.chosenLevelUpBonuses.goldGain + this.baseItemBonuses.goldGain) * legacyGame.getPowerShardBonus();
    }
    this.getExperienceGain = function getExperienceGain() {
        return (this.baseStats.experienceGain + this.chosenLevelUpBonuses.experienceGain + this.baseItemBonuses.experienceGain) * legacyGame.getPowerShardBonus();
    }

    // Get the power of a certain special effect
    this.getEffectsOfType = function getEffectsOfType(type) {
        var allEffects = new Array();
        for (var x = 0; x < this.effects.length; x++) {
            if (this.effects[x].type == type) {
                allEffects.push(this.effects[x]);
            }
        }
        return allEffects;
    }

    // Increase the power of an ability
    this.increaseAbilityPower = function increaseAbilityPower(name) {
        // Increase the level for the ability
        switch (name) {
            case AbilityName.REND:
                this.abilities.baseRendLevel++;
                break;
            case AbilityName.REJUVENATING_STRIKES:
                this.abilities.baseRejuvenatingStrikesLevel++;
                break;
            case AbilityName.ICE_BLADE:
                this.abilities.baseIceBladeLevel++;
                break;
            case AbilityName.FIRE_BLADE:
                this.abilities.baseFireBladeLevel++;
                break;
        }

        // Alter the player's skill points
        this.skillPoints--;
        this.skillPointsSpent++;
    }

    // Use all the abilities the player has
    this.useAbilities = function useAbilities() {
        var monstersDamageTaken = 0;
        var criticalHappened = false;
        // Use the abilities
        // REND
        if (this.abilities.getRendLevel() > 0) {
            // Apply the bleed effect to the monster
            legacyGame.monster.addDebuff(DebuffType.BLEED, this.abilities.getRendDamage(0), this.abilities.rendDuration);
        }
        // REJUVENATING STRIKES
        if (this.abilities.getRejuvenatingStrikesLevel() > 0) {
            // Heal the player
            this.heal(this.abilities.getRejuvenatingStrikesHealAmount(0));
        }
        // ICE BLADE
        if (this.abilities.getIceBladeLevel() > 0) {
            // Calculate the damage
            var damage = this.abilities.getIceBladeDamage(0);
            // See if the player will crit
            if (this.getCritChance() >= (Math.random() * 100)) {
                damage *= (this.getCritDamage() / 100);
                criticalHappened = true;
            }
            // Damage the monster
            game.monsterTakeDamage(damage, criticalHappened, false);

            // Apply the chill effect to the monster
            legacyGame.monster.addDebuff(DebuffType.CHILL, 0, this.abilities.iceBladeChillDuration);
        }
        // FIRE BLADE
        if (this.abilities.getFireBladeLevel() > 0) {
            // Calculate the damage
            var damage = this.abilities.getFireBladeDamage(0);
            // See if the player will crit
            if (this.getCritChance() >= (Math.random() * 100)) {
                damage *= (this.getCritDamage() / 100);
                criticalHappened = true;
            }
            // Damage the monster
            game.monsterTakeDamage(damage, criticalHappened, false);

            // Apply the burn effect to the monster
            legacyGame.monster.addDebuff(DebuffType.BURN, this.abilities.getFireBladeBurnDamage(0), this.abilities.fireBladeBurnDuration);
        }
    }

    // Change the player's attack
    this.changeAttack = function changeAttack(type) {
        switch (type) {
            case AttackType.BASIC_ATTACK:
                this.attackType = AttackType.BASIC_ATTACK;
                $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 0');
                break;
            case AttackType.POWER_STRIKE:
                this.attackType = AttackType.POWER_STRIKE;
                $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 100px');
                break;
            case AttackType.DOUBLE_STRIKE:
                this.attackType = AttackType.DOUBLE_STRIKE;
                $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 50px');
                break;
        }
    }

    this.checkLevelUp = function() {
        // Give the player a level if enough experience was gained
        while (this.experience >= this.experienceRequired) {
            this.experience -= this.experienceRequired;
            this.level++;
            this.skillPoints++;
            this.experienceRequired = legacyGame.player.getExperienceRequired();

            // If this number is not divisible by 5 then add a random stat upgrade
            if (this.level % 5 != 0) {
                legacyGame.statUpgradesManager.addRandomUpgrades(this.level);
            }

            // Add stats to the player for leveling up
            this.levelUpBonuses.health += Math.floor(this.baseLevelUpBonuses.health * (Math.pow(1.01, this.level - 1)));
            this.levelUpBonuses.hp5 += Math.floor(this.baseLevelUpBonuses.hp5 * (Math.pow(1.01, this.level - 1)));
        }
    }

    // Take an amount of damage
    this.takeDamage = function takeDamage(damage) {
        // Reduce the damage based on the amount of armour
        var damageReduction = this.calculateDamageReduction();
        var newDamage = damage - Math.floor(damage * (damageReduction / 100));
        if (newDamage < 0) { newDamage = 0; }

        // Take the damage
        this.health -= newDamage;
        this.lastDamageTaken = newDamage;
        legacyGame.stats.damageTaken += newDamage;

        // Reflect a percentage of the damage if the player has any Barrier effects
        var reflectAmount = 0;
        var barrierEffects = this.getEffectsOfType(EffectType.BARRIER);
        for (var x = 0; x < barrierEffects.length; x++) {
            reflectAmount += barrierEffects[x].value;
        }
        reflectAmount = this.lastDamageTaken * (reflectAmount / 100);
        if (reflectAmount > 0) {
            game.monsterTakeDamage(reflectAmount, false, false);
        }

        // Check if the player is dead
        if (this.health <= 0) {
            this.alive = false;
        }

        // Create the monster's damage particle
        legacyGame.particleManager.createParticle(newDamage, ParticleType.MONSTER_DAMAGE);
        return newDamage;
    }

    // Calculate the amount of reduction granted by armour
    this.calculateDamageReduction = function calculateDamageReduction() {
        // Calculate the reduction
        var reduction = (this.getArmour() / Math.pow(1.055, legacyGame.player.level)) * 90

        // Cap the reduction at 90%
        if (reduction >= 90) {
            reduction = 90;
        }

        return reduction;
    }

    // Calculate the chance the player has of dodging an attack
    this.calculateEvasionChance = function calculateEvasionChance() {
        // Calculate the chance
        var chance = (this.getEvasion() / Math.pow(1.052, legacyGame.player.level)) * 75;

        // Cap the dodge at 75%
        if (chance >= 75) {
            chance = 75;
        }

        return chance;
    }

    // Heal the player for a specified amount
    this.heal = function heal(amount) {
        this.health += amount;
        if (this.health > this.getMaxHealth()) {
            this.health = this.getMaxHealth();
        }
    }

    // Regenerate the players health depending on how much time has passed
    this.regenerateHealth = function regenerateHealth(ms) {
        this.health += ((this.getHp5() / 5) * (ms / 1000));
        if (this.health >= this.getMaxHealth()) {
            this.health = this.getMaxHealth();
        }
    }

    // Gain the stats from an item
    this.gainItemsStats = function gainItemsStats(item) {
        this.baseItemBonuses.minDamage += item.minDamage + item.damageBonus;
        this.baseItemBonuses.maxDamage += item.maxDamage + item.damageBonus;

        this.baseItemBonuses.strength += item.strength;
        this.baseItemBonuses.agility += item.agility;
        this.baseItemBonuses.stamina += item.stamina;

        this.baseItemBonuses.health += item.health;
        this.baseItemBonuses.hp5 += item.hp5;
        this.baseItemBonuses.armour += item.armour + item.armourBonus;
        this.baseItemBonuses.evasion += item.evasion;

        this.baseItemBonuses.critChance += item.critChance;
        this.baseItemBonuses.critDamage += item.critDamage;

        this.baseItemBonuses.itemRarity += item.itemRarity;
        this.baseItemBonuses.goldGain += item.goldGain;
        this.baseItemBonuses.experienceGain += item.experienceGain;
        for (var x = 0; x < item.effects.length; x++) {
            this.effects.push(item.effects[x]);
        }
    }

    // Lose the stats from an item
    this.loseItemsStats = function loseItemsStats(item) {
        this.baseItemBonuses.minDamage -= item.minDamage + item.damageBonus;
        this.baseItemBonuses.maxDamage -= item.maxDamage + item.damageBonus;

        this.baseItemBonuses.strength -= item.strength;
        this.baseItemBonuses.agility -= item.agility;
        this.baseItemBonuses.stamina -= item.stamina;

        this.baseItemBonuses.health -= item.health;
        this.baseItemBonuses.hp5 -= item.hp5;
        this.baseItemBonuses.armour -= item.armour + item.armourBonus;
        this.baseItemBonuses.evasion -= item.evasion;

        this.baseItemBonuses.critChance -= item.critChance;
        this.baseItemBonuses.critDamage -= item.critDamage;

        this.baseItemBonuses.itemRarity -= item.itemRarity;
        this.baseItemBonuses.goldGain -= item.goldGain;
        this.baseItemBonuses.experienceGain -= item.experienceGain;
        for (var x = item.effects.length - 1; x >= 0; x--) {
            for (var y = this.effects.length - 1; y >= 0; y--) {
                if (this.effects[y].type == item.effects[x].type &&
                    this.effects[y].chance == item.effects[x].chance &&
                    this.effects[y].value == item.effects[x].value) {
                    this.effects.splice(y, 1);
                    break;
                }
            }
        }
    }

    // Add a debuff to the player of the specified type, damage and duration
    this.addDebuff = function addDebuff(type, damage, duration) {
        switch (type) {
            case DebuffType.BLEED:
                this.debuffs.bleeding = true;
                this.debuffs.bleedDamage = damage;
                this.debuffs.bleedDuration = 0;
                this.debuffs.bleedMaxDuration = duration;
                this.debuffs.bleedStacks++;
                break;
            case DebuffType.CHILL:
                this.debuffs.chilled = true;
                this.debuffs.chillDuration = 0;
                this.debuffs.chillMaxDuration = duration;
                break;
            case DebuffType.BURN:
                this.debuffs.burning = true;
                this.debuffs.burningDamage = damage;
                this.debuffs.burningDuration = 0;
                this.debuffs.burningMaxDuration = duration;
                break;
        }
    }

    this.update = function update(ms) {
        this.buffs.update(ms);
    }

    // Update all the debuffs on the player
    this.updateDebuffs = function updateDebuffs() {
        // If the player is bleeding
        if (this.debuffs.bleeding) {
            // Cause the player to take damage
            game.playerTakeDamage(this.debuffs.bleedDamage);
            // Increase the duration of this debuff
            this.debuffs.bleedDuration++;
            // If the debuff has expired then remove it
            if (this.debuffs.bleedDuration >= this.debuffs.bleedMaxDuration) {
                this.debuffs.bleeding = false;
                this.debuffs.bleedDamage = 0;
                this.debuffs.bleedDuration = 0;
                this.debuffs.bleedMaxDuration = 0;
                this.debuffs.bleedStacks = 0;
            }
        }

        // If the player is chilled
        if (this.debuffs.chilled) {
            // If the chill duration is even then the player can't attack this turn
            if (this.debuffs.chillDuration == 0 || (this.debuffs.chillDuration % 2 == 0)) {
                this.canAttack = false;
            }
            else { this.canAttack = true; }
            // Increase the duration of this debuff
            this.debuffs.chillDuration++;
            // If the debuff has expired then remove it
            if (this.debuffs.chillDuration >= this.debuffs.chillMaxDuration) {
                this.debuffs.chillDuration = 0;
                this.debuffs.chillMaxDuration = 0;
                this.debuffs.chilled = false;
            }
        }
        // If the player is not chilled then they can attack
        else { this.canAttack = true; }

        // If the player is burning
        if (this.debuffs.burning) {
            // Cause the player to take damage
            game.playerTakeDamage(this.debuffs.burningDamage);
            // Increase the duration of this debuff
            this.debuffs.burningDuration++;
            // If the debuff has expired then remove it
            if (this.debuffs.burningDuration >= this.debuffs.burningMaxDuration) {
                this.debuffs.burningDamage = 0;
                this.debuffs.burningDuration = 0;
                this.debuffs.burningMaxDuration = 0;
                this.debuffs.burning = false;
            }
        }
    }

    // Save all the player's data
    this.save = function save() {
        localStorage.playerSaved = true;
        localStorage.playerLevel = this.level;
        localStorage.playerHealth = this.health;

        localStorage.chosenLevelUpBonuses = JSON.stringify(this.chosenLevelUpBonuses);
        localStorage.baseItemBonuses = JSON.stringify(this.baseItemBonuses);

        localStorage.playerGold = this.gold;
        localStorage.playerLevel = this.level;
        localStorage.playerExperience = this.experience;

        localStorage.playerSkillPointsSpent = this.skillPointsSpent;
        localStorage.playerSkillPoints = this.skillPoints;
        this.abilities.save();

        localStorage.playerAlive = this.alive;
        localStorage.attackType = this.attackType;
        localStorage.playerEffects = JSON.stringify(this.effects);

        localStorage.powerShards = this.powerShards;
    }

    this.getExperienceRequired = function() {
        return Math.ceil(Sigma(legacyGame.player.level * 2) * Math.pow(1.055, legacyGame.player.level) + legacyGame.player.baseExperienceRequired);
    };

    // Load all the player's data
    this.load = function load() {
        if (localStorage.playerSaved != null) {
            this.level = parseInt(localStorage.playerLevel);
            this.health = parseFloat(localStorage.playerHealth);

            if (localStorage.version == null) {
                this.chosenLevelUpBonuses.health = parseFloat(localStorage.playerBaseHealthStatBonus);
                this.chosenLevelUpBonuses.hp5 = parseFloat(localStorage.playerBaseHp5StatBonus);
                this.chosenLevelUpBonuses.damageBonus = parseFloat(localStorage.playerBaseDamageBonusStatBonus);
                this.chosenLevelUpBonuses.armour = parseFloat(localStorage.playerBaseArmourStatBonus);
                this.chosenLevelUpBonuses.strength = parseFloat(localStorage.playerBaseStrengthStatBonus);
                this.chosenLevelUpBonuses.stamina = parseFloat(localStorage.playerBaseStaminaStatBonus);
                this.chosenLevelUpBonuses.agility = parseFloat(localStorage.playerBaseAgilityStatBonus);
                this.chosenLevelUpBonuses.critChance = parseFloat(localStorage.playerBaseCritChanceStatBonus);
                this.chosenLevelUpBonuses.critDamage = parseFloat(localStorage.playerBaseCritDamageStatBonus);
                this.chosenLevelUpBonuses.itemRarity = parseFloat(localStorage.playerBaseItemRarityStatBonus);
                this.chosenLevelUpBonuses.goldGain = parseFloat(localStorage.playerBaseGoldGainStatBonus);
                this.chosenLevelUpBonuses.experienceGain = parseFloat(localStorage.playerBaseExperienceGainStatBonus);

                this.baseItemBonuses.health = parseInt(localStorage.playerBaseHealthFromItems);
                this.baseItemBonuses.hp5 = parseInt(localStorage.playerBaseHp5FromItems);
                this.baseItemBonuses.minDamage = parseInt(localStorage.playerBaseMinDamageFromItems);
                this.baseItemBonuses.maxDamage = parseInt(localStorage.playerBaseMaxDamageFromItems);
                this.baseItemBonuses.damageBonus = parseFloat(localStorage.playerBaseDamageBonusFromItems);
                this.baseItemBonuses.armour = parseFloat(localStorage.playerBaseArmourFromItems);
                this.baseItemBonuses.strength = parseInt(localStorage.playerBaseStrengthFromItems);
                this.baseItemBonuses.stamina = parseInt(localStorage.playerBaseStaminaFromItems);
                this.baseItemBonuses.agility = parseInt(localStorage.playerBaseAgilityFromItems);
                this.baseItemBonuses.critChance = parseFloat(localStorage.playerBaseCritChanceFromItems);
                this.baseItemBonuses.critDamage = parseFloat(localStorage.playerBaseCritDamageFromItems);
                this.baseItemBonuses.itemRarity = parseFloat(localStorage.playerBaseItemRarityFromItems);
                this.baseItemBonuses.goldGain = parseFloat(localStorage.playerBaseGoldGainFromItems);
                this.baseItemBonuses.experienceGain = parseFloat(localStorage.playerBaseExperienceGainFromItems);
            }

            // Add stats to the player for leveling up
            for (var x = 1; x < this.level; x++) {
                this.levelUpBonuses.health += Math.floor(this.baseLevelUpBonuses.health * (Math.pow(1.01, x)));
                this.levelUpBonuses.hp5 += Math.floor(this.baseLevelUpBonuses.hp5 * (Math.pow(1.01, x)));
            }

            this.gold = parseFloat(localStorage.playerGold);
            this.level = parseInt(localStorage.playerLevel);
            this.experience = parseFloat(localStorage.playerExperience);

            this.skillPointsSpent = parseInt(localStorage.playerSkillPointsSpent);
            this.skillPoints = parseInt(localStorage.playerSkillPoints);
            this.abilities.load();
            this.changeAttack(localStorage.attackType);

            if (localStorage.version != null) {
                this.chosenLevelUpBonuses = JSON.parse(localStorage.chosenLevelUpBonuses);
                this.baseItemBonuses = JSON.parse(localStorage.baseItemBonuses);
                this.changeAttack(localStorage.attackType);
                var newEffects = JSON.parse(localStorage.playerEffects);
                if (newEffects != null && newEffects.length > 0) {
                    for (var x = 0; x < newEffects.length; x++) {
                        this.effects.push(new Effect(newEffects[x].type, newEffects[x].chance, newEffects[x].value));
                    }
                }
            }

            if (localStorage.powerShards != null) { this.powerShards = parseInt(localStorage.powerShards); }
        }

        if (localStorage.playerAlive != null) { this.alive = JSON.parse(localStorage.playerAlive); }

        // Update the required XP after load
        this.experienceRequired = legacyGame.player.getExperienceRequired();
    }
}