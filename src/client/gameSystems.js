declare('GameSystems', function() {

    function GameSystems() {

        // Checked values
        this.shardMultiplier = 0.02;
        this.resetMultiplier = 0.01;

        this.playerBaseHealth = 250;

        this.playerBaseExperienceRequired = 20;
        this.playerExperiencePow = 2.5; // Needs sync with monsterExperiencePow

        this.monsterBaseHealth = 20;
        this.monsterHealthPow = 2.2;
        this.monsterBaseDamage = 5;
        this.monsterDamagePow = 2.1;

        this.monsterBaseGoldWorth = 10;
        this.monsterBaseExperienceWorth = 10;
        this.monsterGoldPow = 2;
        this.monsterExperiencePow = 2;

        this.evasionBaseRating = 100;
        this.evasionRatingPow = 1.5;
        this.evasionMin = 0.00;
        this.evasionCap = 0.75;

        this.armorBaseRating = 150;
        this.armorRatingPow = 1.5;
        this.armorCap = 0.9;

        this.critMin = 0.05;
        this.critCap = 0.75;

        this.weaponRangeMinStart = 0.01;
        this.weaponRangeMinEnd = 0.05;
        this.weaponRangeMaxStart = 0.08;
        this.weaponRangeMaxEnd = 0.1;

        // Unchecked values


        this.healthPerStamina = 5;
        this.armorPerStamina = 0.01;
        this.critPerAgility = 0.01;



        this.baseItemDropChance = 0.10;

        this.basePlayerStatPow = 1.001;


        this.baseHealthPow = 1.02;
        this.baseItemHealthPow = this.baseHealthPow = 1.00167; // ~baseHealthPow / 12
        this.baseHp5Percentage = 0.01;
        this.baseLevelupStatMultiplier = 0.1;

        this.dropRateLEgendary = 0.001;
        this.dropRateEpic = 0.025;
        this.dropRateRare = 0.1;
        this.dropRateUncommon = 0.3;

        // The base effect levels of each mercenaries special effects
        this.baseClericHp5PercentBonus = 0.05;
        this.baseCommanderHealthPercentBonus = 0.05;
        this.baseMageDamagePercentBonus = 0.05;
        this.baseAssassinEvasionPercentBonus = 0.05;
        this.baseWarlockCritDamageBonus = 0.05;

        // The amount an upgrade to a mercenary's special effect will do
        this.clericHp5PercentUpgradeValue = 0.025;
        this.commanderHealthPercentUpgradeValue = 0.025;
        this.mageDamagePercentUpgradeValue = 0.025;
        this.assassinEvasionPercentUpgradeValue = 0.025;
        this.warlockCritDamageUpgradeValue = 0.025;

        // Cap the multipliers
        this.itemCapRarity = 0.1;
        this.itemCapGoldGain = 0.1;
        this.itemCapExperienceGain = 0.1;
        this.itemCapCrit = 0.1;
        this.itemCapArmorBonus = 0.1;

        // These are fixed cap so we get only a certain max amount of these stats
        this.itemCapCritDmg = 0.15; // will be max 150% extra with optimal item distribution

        // Evasion is 1/6th of the required rating so in optimal conditions you need 6 slots with the stat to get maxed out
        this.itemBaseEvasion = Math.floor(this.evasionBaseRating / 6);
        this.itemPowEvasion = 1.01;

        // Armor we give 1/9th since it's on all items except the weapon
        this.itemBaseArmor = Math.floor(this.armorBaseRating / 9);
        this.itemPowArmor = 1.0066;
    }

    // ---------------------------------------------------------------------------
    // combat
    // ---------------------------------------------------------------------------
    GameSystems.prototype.isCriticalHit = function() {
        return this.getCritChance() >= Math.random();
    };

    // ---------------------------------------------------------------------------
    // overall calculations
    // ---------------------------------------------------------------------------
    GameSystems.prototype.getExperienceRequired = function() {
        var level = legacyGame.player.level;
        var baseValue = this.playerBaseExperienceRequired + Math.pow(level, this.playerExperiencePow);
        return baseValue;
    };

    GameSystems.prototype.getItemRarity = function(monsterRarity) {
        var multiplier = 1 + this.getRarityMultiplier();

        switch (monsterRarity) {
            case MonsterRarity.RARE:
                multiplier *= 1.1;
                break;
            case MonsterRarity.ELITE:
                multiplier *= 1.5;
                break;
            case MonsterRarity.BOSS:
                multiplier *= 2;
                break;
        }

        rand = Math.random();
        if (rand <= this.dropRateLEgendary * multiplier) { return ItemRarity.LEGENDARY; }
        else if (rand <= this.dropRateEpic * multiplier) { return ItemRarity.EPIC; }
        else if (rand <= this.dropRateRare * multiplier) { return ItemRarity.RARE; }
        else if (rand <= this.dropRateUncommon * multiplier) { return ItemRarity.UNCOMMON; }
        else { return ItemRarity.COMMON; }
    };

    GameSystems.prototype.getDropItem = function() {
        return Math.random() <= this.baseItemDropChance;
    };

    GameSystems.prototype.getRarityMultiplier = function(rarity) {
        switch (rarity) {
            case ItemRarity.UNCOMMON:
                return 1.1;
            case ItemRarity.RARE:
                return 1.3;
            case ItemRarity.EPIC:
                return 1.6;
            case ItemRarity.LEGENDARY:
                return 2;
        }

        return 1;
    };

    GameSystems.prototype.getOverallMultiplier = function() {
        var multiplier = legacyGame.player.powerShards * this.shardMultiplier;

        if(legacyGame.FrozenBattle.settings.applyLevelResetBonus === true) {
            multiplier += legacyGame.FrozenBattle.settings.levelsReset * this.resetMultiplier;
        }

        return multiplier;
    };

    GameSystems.prototype.getGoldMultiplier = function() {
        var baseValue = legacyGame.player.baseStats.goldGain + legacyGame.player.baseItemBonuses.goldGain;
        var multiplier = 1 + this.getOverallMultiplier() + legacyGame.player.buffs.getGoldMultiplier();

        return (baseValue / 100) * multiplier;
    };

    GameSystems.prototype.getExperienceMultiplier = function() {
        var baseValue = legacyGame.player.baseStats.experienceGain + legacyGame.player.baseItemBonuses.experienceGain;
        var multiplier = 1 + this.getOverallMultiplier() + legacyGame.player.buffs.getExperienceMultiplier();

        return (baseValue / 100) * multiplier;
    };

    GameSystems.prototype.getRarityMultiplier = function() {
        var baseValue = legacyGame.player.baseStats.itemRarity + legacyGame.player.baseItemBonuses.itemRarity;
        var multiplier = 1 + this.getOverallMultiplier();

        return (baseValue / 100) * multiplier;
    };

    // ---------------------------------------------------------------------------
    // stats
    // ---------------------------------------------------------------------------
    GameSystems.prototype.getMaxHealth = function() {
        var baseValue = legacyGame.player.baseStats.health + legacyGame.player.baseItemBonuses.health;
        baseValue += game.systems.getStamina() * this.healthPerStamina;

        var multiplier = 1 + this.getCommanderHealthMultiplier();

        return Math.floor(baseValue * multiplier);
    };

    GameSystems.prototype.getHp5 = function() {
        //var baseValue = legacyGame.player.baseStats.hp5 + legacyGame.player.levelUpBonuses.hp5 + legacyGame.player.baseItemBonuses.hp5;
        //baseValue += this.getStamina();
        var baseValue = (this.getMaxHealth() * 5) * this.baseHp5Percentage;
        var multiplier = 1 + this.getClericHp5Multiplier();

        return Math.floor(baseValue * multiplier);
    };

    GameSystems.prototype.getStrength = function() {
        var baseValue = legacyGame.player.baseStats.strength + legacyGame.player.chosenLevelUpBonuses.strength + legacyGame.player.baseItemBonuses.strength;
        var multiplier = 1 + this.getOverallMultiplier();

        return Math.floor(baseValue * multiplier);
    };

    GameSystems.prototype.getStamina = function() {
        var baseValue = legacyGame.player.baseStats.stamina + legacyGame.player.chosenLevelUpBonuses.stamina + legacyGame.player.baseItemBonuses.stamina;
        var multiplier = 1 + this.getOverallMultiplier();

        return Math.floor(baseValue * multiplier);
    };

    GameSystems.prototype.getAgility = function() {
        var baseValue = legacyGame.player.baseStats.agility + legacyGame.player.chosenLevelUpBonuses.agility + legacyGame.player.baseItemBonuses.agility;
        var multiplier = 1 + this.getOverallMultiplier();

        return baseValue * multiplier;
    };

    GameSystems.prototype.getDamageBonusMultiplier = function() {
        var baseValue = legacyGame.player.baseStats.damageBonus + legacyGame.player.baseItemBonuses.damageBonus;
        var multiplier = 1 + this.getMageDamageMultiplier();

        return baseValue * multiplier;
    };

    GameSystems.prototype.getMinDamage = function() {
        var baseValue = legacyGame.player.baseStats.minDamage + legacyGame.player.baseItemBonuses.minDamage;
        baseValue += this.getStrength();
        var multiplier = 1 + this.getDamageBonusMultiplier() + legacyGame.player.buffs.getDamageMultiplier();

        return 1 + Math.floor(baseValue * multiplier);
    };

    GameSystems.prototype.getMaxDamage = function() {
        var baseValue = legacyGame.player.baseStats.maxDamage + legacyGame.player.baseItemBonuses.maxDamage;
        baseValue += this.getStrength();
        var multiplier = 1 + this.getDamageBonusMultiplier() + legacyGame.player.buffs.getDamageMultiplier();

        return 1 + Math.floor(baseValue * multiplier);
    };

    GameSystems.prototype.getAverageDamage = function() {
        var min = this.getMinDamage();
        var max = this.getMaxDamage();

        return Math.floor(min + ((max - min) / 2));
    };

    GameSystems.prototype.getArmor = function() {
        var baseValue = legacyGame.player.baseStats.armour + legacyGame.player.baseItemBonuses.armour;
        baseValue += this.getStamina() * this.armorPerStamina;
        var multiplier = 1;

        return Math.floor(baseValue * multiplier);
    };

    GameSystems.prototype.getArmorDamageReduction = function() {
        var level = legacyGame.player.level;
        var coefficient = this.armorBaseRating + Math.pow(level, this.armorRatingPow);
        var reduction = this.getArmor() / coefficient

        if (reduction >= this.armorCap) {
            reduction = this.armorCap;
        }

        return reduction;
    };

    GameSystems.prototype.getEvasion = function() {
        var baseValue = legacyGame.player.baseStats.evasion + legacyGame.player.baseItemBonuses.evasion;
        baseValue += this.getAgility();
        var multiplier = 1 + this.getAssassinEvasionMultiplier();

        return Math.floor(baseValue * multiplier);
    };

    GameSystems.prototype.getEvasionChance = function() {
        // Calculate the chance
        var level = legacyGame.player.level;
        var coefficient = this.evasionBaseRating + Math.pow(level, this.evasionRatingPow);
        var chance = this.evasionMin + (this.getEvasion() / coefficient);

        // Cap the dodge at 75%
        if (chance >= this.evasionCap) {
            chance = this.evasionCap;
        }

        return chance;
    };

    GameSystems.prototype.getCritChance = function() {
        var baseValue = legacyGame.player.baseStats.critChance + legacyGame.player.baseItemBonuses.critChance;
        baseValue += this.getAgility() * this.critPerAgility;

        var multiplier = 1;

        var value = this.critMin + (baseValue * multiplier);
        if(value > this.critCap) {
            value = this.critCap;
        }

        return value;
    };

    GameSystems.prototype.getCritDamageMultiplier = function() {
        var baseValue = legacyGame.player.baseStats.critDamage + legacyGame.player.baseItemBonuses.critDamage;
        var multiplier = 1 + this.getWarlockCritDamageMultiplier();

        return baseValue * multiplier;
    };

    // ---------------------------------------------------------------------------
    // mercenaries
    // ---------------------------------------------------------------------------
    GameSystems.prototype.getGpsReductionMultiplier = function() {
        return ((100 - this.gpsReduction) / 100);
    };

    GameSystems.prototype.getMercenariesGps = function(type) {
        var multiplier = 1 + this.getGoldMultiplier();
        return (legacyGame.mercenaryManager.getMercenaryBaseGps(type) * multiplier) * this.getGpsReductionMultiplier();
    };

    GameSystems.prototype.getCommanderHealthMultiplier = function() {
        var owned = legacyGame.mercenaryManager.commandersOwned;
        var multiplier = 1 + this.baseCommanderHealthPercentBonus + this.getCommanderHealthUpgradeMultiplier();
        return owned * multiplier;
    };

    GameSystems.prototype.getCommanderHealthUpgradeMultiplier = function() {
        var ownedUpgrades = legacyGame.upgradeManager.commanderSpecialUpgradesPurchased;
        return ownedUpgrades * this.commanderHealthPercentUpgradeValue;
    };

    GameSystems.prototype.getClericHp5Multiplier = function() {
        var owned = legacyGame.mercenaryManager.clericsOwned;
        var multiplier = 1 + this.baseClericHp5PercentBonus + this.getClericHp5UpgradeMultiplier();

        return owned * multiplier;
    };

    GameSystems.prototype.getClericHp5UpgradeMultiplier = function() {
        var ownedUpgrades = legacyGame.upgradeManager.clericSpecialUpgradesPurchased;
        return ownedUpgrades * this.clericHp5PercentUpgradeValue;
    };

    GameSystems.prototype.getMageDamageMultiplier = function() {
        var owned = legacyGame.mercenaryManager.magesOwned;
        var multiplier = 1 + this.baseMageDamagePercentBonus + this.getMageDamageUpgradeMultiplier();

        return owned * multiplier;
    };

    GameSystems.prototype.getMageDamageUpgradeMultiplier = function() {
        var ownedUpgrades = legacyGame.upgradeManager.mageSpecialUpgradesPurchased;
        return ownedUpgrades * this.mageDamagePercentUpgradeValue;
    };

    GameSystems.prototype.getAssassinEvasionMultiplier = function() {
        var owned = legacyGame.mercenaryManager.assassinsOwned;
        var multiplier = 1 + this.baseAssassinEvasionPercentBonus + this.getAssassinEvasionUpgradeMultiplier();

        return owned * multiplier;
    };

    GameSystems.prototype.getAssassinEvasionUpgradeMultiplier = function() {
        var ownedUpgrades = legacyGame.upgradeManager.assassinSpecialUpgradesPurchased;
        return ownedUpgrades * this.assassinEvasionPercentUpgradeValue;
    };

    GameSystems.prototype.getWarlockCritDamageMultiplier = function() {
        var owned = legacyGame.mercenaryManager.warlocksOwned;
        var multiplier = 1 + this.baseWarlockCritDamageBonus + this.getWarlockCritDamageUpgradeMultiplier();

        return owned * multiplier;
    };

    GameSystems.prototype.getWarlockCritDamageUpgradeMultiplier = function() {
        var ownedUpgrades = legacyGame.upgradeManager.warlockSpecialUpgradesPurchased;
        return ownedUpgrades * this.warlockCritDamageUpgradeValue;
    };

    // ---------------------------------------------------------------------------
    // stat generation
    // ---------------------------------------------------------------------------
    GameSystems.prototype.getRandomItemRarityBonus = function(maxValue) {
        if(maxValue === undefined) {
            maxValue = this.itemCapRarity;
        }

        return Math.random() * maxValue;
    };

    GameSystems.prototype.getRandomGoldGainBonus = function(maxValue) {
        if(maxValue === undefined) {
            maxValue = this.itemCapGoldGain;
        }

        return Math.random() * maxValue;
    };

    GameSystems.prototype.getRandomExperienceGainBonus = function(maxValue) {
        if(maxValue === undefined) {
            maxValue = this.itemCapExperienceGain;
        }

        return Math.random() * maxValue;
    };

    GameSystems.prototype.getRandomArmorBonus = function(maxValue) {
        if(maxValue === undefined) {
            maxValue = this.itemCapArmorBonus;
        }

        return Math.random() * maxValue;
    };

    GameSystems.prototype.getRandomEvasion = function(level) {
        return 1 + Math.floor(Math.random() * (this.itemBaseEvasion + level + Math.pow(this.itemPowEvasion, level)));
    };

    GameSystems.prototype.getRandomArmor = function(level) {
        return 1 + Math.floor(Math.random() * (this.itemBaseArmor + level + Math.pow(this.itemPowArmor, level)));
    };

    GameSystems.prototype.getRandomCritChanceBonus = function(maxValue) {
        if(maxValue === undefined) {
            maxValue = this.itemCapCrit;
        }

        return Math.random() * maxValue;
    };

    GameSystems.prototype.getRandomCritDamageBonus = function(maxValue) {
        if(maxValue === undefined) {
            maxValue = this.itemCapCritDmg;
        }

        return Math.random() * maxValue;
    };

    GameSystems.prototype.getRandomPrimaryStatBonus = function(level) {
        return 1 + Math.floor(this.getRandomLevelBonusValue() + Math.pow(this.basePlayerStatPow, level));
    };

    GameSystems.prototype.getPrimaryStatBonusForLevelup = function(level) {
        return 1 + Math.floor(Math.pow(this.basePlayerStatPow, level) * this.baseLevelupStatMultiplier);
    };

    GameSystems.prototype.getRandomLevelBonusValue = function(level) {
        return Math.floor(Math.random() * level);
    };

    GameSystems.prototype.getRandomDamageRarityMultiplier = function(rarity) {
        switch (rarity) {
            case ItemRarity.UNCOMMON:
                return 1.1;
            case ItemRarity.RARE:
                return 1.3;
                break;
            case ItemRarity.EPIC:
                return 1.6;
                break;
            case ItemRarity.LEGENDARY:
                return 2;
                break;
        }

        return 1;
    };

    GameSystems.prototype.getRandomMinDamage = function(rarity, level) {
        var monsterHealth = this.getMonsterHealth(MonsterRarity.COMMON, level);
        var min = monsterHealth * this.weaponRangeMinStart;
        var max = monsterHealth * this.weaponRangeMinEnd;
        var range = max - min;
        var multiplier = this.getRandomDamageRarityMultiplier();
        return 1 + Math.floor((min + (Math.random() * range)) * multiplier);
    };

    GameSystems.prototype.getRandomMaxDamage = function(rarity, level, min) {
        var monsterHealth = this.getMonsterHealth(MonsterRarity.COMMON, level);
        var min = monsterHealth * this.weaponRangeMaxStart;
        var max = monsterHealth * this.weaponRangeMaxEnd;
        var range = max - min;
        var multiplier = this.getRandomDamageRarityMultiplier();
        var value = 1 + Math.floor((min + (Math.random() * range)) * multiplier);
        if(value < min) {
            value = min;
        }

        return value;
    };

    // ---------------------------------------------------------------------------
    // monsters
    // ---------------------------------------------------------------------------
    GameSystems.prototype.getMonsterRarityMultiplier = function(rarity) {
        switch (rarity) {
            case MonsterRarity.RARE:
                return 1.2;
                break;
            case MonsterRarity.ELITE:
                return 1.5;
                break;
            case MonsterRarity.BOSS:
                return 2;
                break;
        }

        return 1;
    };

    GameSystems.prototype.getMonsterHealth = function(rarity, level) {
        var baseValue = this.monsterBaseHealth + Math.floor(Math.pow(level, this.monsterHealthPow));
        var multiplier = this.getMonsterRarityMultiplier(rarity);

        return Math.floor(baseValue * multiplier);
    };

    GameSystems.prototype.getMonsterDamage = function(rarity, level) {
        var baseValue = this.monsterBaseDamage + Math.floor(Math.pow(level, this.monsterDamagePow));
        var multiplier = this.getMonsterRarityMultiplier(rarity);

        return Math.floor(baseValue * multiplier);
    };


    GameSystems.prototype.getMonsterGoldWorth = function(rarity, level) {
        var baseValue = this.monsterBaseGoldWorth + this.getRandomLevelBonusValue(level) + Math.pow(level, this.monsterGoldPow);
        var diff = (baseValue * 1.1) - (baseValue * 0.9);
        var value = baseValue + (Math.random() * diff);
        var multiplier = this.getMonsterRarityMultiplier(rarity);
        return Math.floor(value * multiplier);
    };

    GameSystems.prototype.getMonsterExperienceWorth = function(rarity, level) {
        var baseValue = this.monsterBaseExperienceWorth + this.getRandomLevelBonusValue(level) + Math.pow(level, this.monsterExperiencePow);
        var diff = (baseValue * 1.1) - (baseValue * 0.9);
        var value = baseValue + (Math.random() * diff);
        var multiplier = this.getMonsterRarityMultiplier(rarity);
        return Math.floor(value * multiplier);
    };

    return new GameSystems();

});