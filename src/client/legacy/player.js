function Player() {
    this.level = 1;
    this.health = 250;

    // Base values for all stats; these are static
    this.baseStats = new StatsSet();
    this.baseStats.health = this.health;
    this.baseStats.hp5 = 0;
    this.baseStats.minDamage = 1;
    this.baseStats.maxDamage = 1;
    this.baseStats.damageBonus = 0;
    this.baseStats.armour = 0;
    this.baseStats.evasion = 0;
    this.baseStats.strength = 0;
    this.baseStats.agility = 0;
    this.baseStats.stamina = 0;
    this.baseStats.critChance = 0.05;
    this.baseStats.critDamage = 1.5;
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
    this.abilityPoints = 0;
    this.abilityPointsSpent = 0;
    this.abilities = new Abilities();

    // Buffs/Debuffs
    this.buffs = new BuffManager();
    this.debuffs = new DebuffManager();

    // Stat calculation functions













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
        this.abilityPoints--;
        this.abilityPointsSpent++;
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
            if (game.systems.isCriticalHit()) {
                damage *= game.systems.getCritDamageMultiplier();
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
            if (game.systems.isCriticalHit()) {
                damage *= game.systems.getCritDamageMultiplier();
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
            if(this.level % 5 == 0) {
                this.abilityPoints++;
            }

            this.experienceRequired = game.systems.getExperienceRequired();

            // Add a set of upgrades
            legacyGame.statUpgradesManager.addRandomUpgrades(this.level);

            // Add stats to the player for leveling up
            this.levelUpBonuses.health += Math.floor(this.baseLevelUpBonuses.health * (Math.pow(1.01, this.level - 1)));
            this.levelUpBonuses.hp5 += Math.floor(this.baseLevelUpBonuses.hp5 * (Math.pow(1.01, this.level - 1)));
        }
    }

    // Take an amount of damage
    this.takeDamage = function takeDamage(damage) {
        // Reduce the damage based on the amount of armour
        var damageReduction = game.systems.getArmorDamageReduction();
        var newDamage = damage - Math.floor(damage * damageReduction);
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

    // Heal the player for a specified amount
    this.heal = function heal(amount) {
        this.health += amount;
        if (this.health > game.systems.getMaxHealth()) {
            this.health = game.systems.getMaxHealth();
        }
    }

    // Regenerate the players health depending on how much time has passed
    this.regenerateHealth = function regenerateHealth(ms) {
        var value = ((game.systems.getHp5() / 5) * (ms / 1000));
        this.heal(value);
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
        localStorage.playerAbilityPointsSpent = this.abilityPointsSpent;
        localStorage.playerAbilityPoints = this.abilityPoints;
        this.abilities.save();

        localStorage.playerAlive = this.alive;
        localStorage.attackType = this.attackType;
        localStorage.playerEffects = JSON.stringify(this.effects);

        localStorage.powerShards = this.powerShards;
    }



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
            this.abilityPointsSpent = parseInt(localStorage.playerAbilityPointsSpent);
            this.abilityPoints = parseInt(localStorage.playerAbilityPoints);
            if(isNaN(this.abilityPoints)) {
                this.abilityPoints = 0;
            }
            if(isNaN(this.abilityPointsSpent)) {
                this.abilityPointsSpent = 0;
            }
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
        this.experienceRequired = game.systems.getExperienceRequired();
    }
}