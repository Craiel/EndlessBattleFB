declare('GameSystems', function() {

    function GameSystems() {

        this.shardMultiplier = 0.02;
        this.resetMultiplier = 0.01;

        this.healthPerStamina = 5;
        this.armorPerStamina = 0.01;
        this.critPerAgility = 0.01;

        this.critCap = 0.75;

        this.evasionBaseRating = 100;
        this.evasionRatingPow = 1.06;
        this.evasionCap = 0.75;

        this.armorBaseRating = 150;
        this.armorRatingPow = 1.06;
        this.armorCap = 0.9;

        this.baseItemDropChance = 0.10;

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
        var baseValue = legacyGame.player.baseStats.hp5 + legacyGame.player.levelUpBonuses.hp5 + legacyGame.player.baseItemBonuses.hp5;
        baseValue += this.getStamina();
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
        var baseValue = 1 + legacyGame.player.baseStats.minDamage + legacyGame.player.baseItemBonuses.minDamage;
        baseValue += this.getStrength();
        var multiplier = 1 + this.getDamageBonusMultiplier() + legacyGame.player.buffs.getDamageMultiplier();

        return Math.floor(baseValue * multiplier);
    };

    GameSystems.prototype.getMaxDamage = function() {
        var baseValue = 1 + legacyGame.player.baseStats.maxDamage + legacyGame.player.baseItemBonuses.maxDamage;
        baseValue += this.getStrength();
        var multiplier = 1 + this.getDamageBonusMultiplier() + legacyGame.player.buffs.getDamageMultiplier();

        return Math.floor(baseValue * multiplier);
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
        var coefficient = this.armorBaseRating + Math.pow(this.armorRatingPow, legacyGame.player.level);
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
        var coefficient = this.evasionBaseRating + Math.pow(this.evasionRatingPow, legacyGame.player.level);
        var chance = (this.getEvasion() / coefficient);

        // Cap the dodge at 75%
        if (chance >= this.evasionCap) {
            chance = this.evasionCap;
        }

        return chance;
    }

    GameSystems.prototype.getCritChance = function() {
        var baseValue = legacyGame.player.baseStats.critChance + legacyGame.player.baseItemBonuses.critChance;
        baseValue += this.getAgility() * this.critPerAgility;

        var multiplier = 1;

        var value = baseValue * multiplier;
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

    return new GameSystems();

});