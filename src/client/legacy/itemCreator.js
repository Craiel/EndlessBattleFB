function ItemCreator() {
    this.createRandomItem = function createRandomItem(level, rarity) {
        // If there is no rarity; do nothing
        if (rarity == null) {
            return null;
        }

        // Get a random item type
        var rand = Math.floor(Math.random() * ItemType.count);
        var type;
        switch (rand) {
            case 0: type = ItemType.HELM; break;
            case 1: type = ItemType.SHOULDERS; break;
            case 2: type = ItemType.CHEST; break;
            case 3: type = ItemType.LEGS; break;
            case 4: type = ItemType.WEAPON; break;
            case 5: type = ItemType.GLOVES; break;
            case 6: type = ItemType.BOOTS; break;
            case 7: type = ItemType.TRINKET; break;
            case 8: type = ItemType.OFF_HAND; break;
        }

        // Get a random rarity
        var prefixAmount;
        var suffixAmount;
        switch (rarity) {
            case ItemRarity.COMMON: prefixAmount = 1; suffixAmount = 0; break;
            case ItemRarity.UNCOMMON: prefixAmount = 1; suffixAmount = 1; break;
            case ItemRarity.RARE: prefixAmount = 2; suffixAmount = 1; break;
            case ItemRarity.EPIC: prefixAmount = 2; suffixAmount = 2; break;
            case ItemRarity.LEGENDARY: prefixAmount = 3; suffixAmount = 3; break;
        }

        // Add random item bonuses
        var itemBonuses = new ItemBonuses();
        var randBonus;
        var prefix = "";
        var suffix = "";

        // Create the prefixes
        var amount = prefixAmount;

        while (amount > 0) {
            // Get the ID of the bonuses; randomly
            randBonus = Math.floor(Math.random() * PREFIX_AMOUNT);
            var statGenerator = new StatGenerator();
            var nameGenerator = new NameGenerator();

            // Add the bonus to the item bonuses
            switch (randBonus) {
                case 0:
                    if (itemBonuses.damageBonus == 0 && type == ItemType.WEAPON) {
                        itemBonuses.damageBonus = statGenerator.getRandomDamageBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomDamageBonusName(); }
                        amount--;
                    }
                    break;
                case 1:
                    if (itemBonuses.health == 0) {
                        itemBonuses.health = statGenerator.getRandomHealthBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomHealthName(); }
                        amount--;
                    }
                    break;
                case 2:
                    if (itemBonuses.armourBonus == 0 && type != ItemType.WEAPON) {
                        itemBonuses.armourBonus = statGenerator.getRandomArmourBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomArmourBonusName(); }
                        amount--;
                    }
                    break;
                case 3:
                    if (itemBonuses.critChance == 0) {
                        itemBonuses.critChance = statGenerator.getRandomCritChanceBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomCritChanceName(); }
                        amount--;
                    }
                    break;
                case 4:
                    if (itemBonuses.itemRarity == 0) {
                        itemBonuses.itemRarity = statGenerator.getRandomItemRarityBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomItemRarityName(); }
                        amount--;
                    }
                    break;
                case 5:
                    if (itemBonuses.goldGain == 0) {
                        itemBonuses.goldGain = statGenerator.getRandomGoldGainBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomGoldGainName(); }
                        amount--;
                    }
                    break;
            }
        }

        // Create the suffixes
        amount = suffixAmount;
        while (amount > 0) {
            // Get the ID of the bonuses; randomly
            randBonus = Math.floor(Math.random() * SUFFIX_AMOUNT);

            // Add the bonus to the item bonuses
            switch (randBonus) {
                case 0:
                    if (itemBonuses.strength == 0) {
                        itemBonuses.strength = statGenerator.getRandomPrimaryStatBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomStrengthName(); }
                        amount--;
                    }
                    break;
                case 1:
                    if (itemBonuses.agility == 0) {
                        itemBonuses.agility = statGenerator.getRandomPrimaryStatBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomAgilityName(); }
                        amount--;
                    }
                    break;
                case 2:
                    if (itemBonuses.stamina == 0) {
                        itemBonuses.stamina = statGenerator.getRandomPrimaryStatBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomStaminaName(); }
                        amount--;
                    }
                    break;
                case 3:
                    if (itemBonuses.hp5 == 0) {
                        itemBonuses.hp5 = statGenerator.getRandomHp5Bonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomHp5Name(); }
                        amount--;
                    }
                    break;
                case 4:
                    if (itemBonuses.critDamage == 0) {
                        itemBonuses.critDamage = statGenerator.getRandomCritDamageBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomCritDamageName(); }
                        amount--;
                    }
                    break;
                case 5:
                    if (itemBonuses.experienceGain == 0) {
                        itemBonuses.experienceGain = statGenerator.getRandomExperienceGainBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomExperienceGainName(); }
                        amount--;
                    }
                    break;
                case 6:
                    if (itemBonuses.evasion == 0) {
                        itemBonuses.evasion = statGenerator.getRandomEvasionBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomEvasionName(); }
                        amount--;
                    }
                    break;
            }
        }

        // If it's a weapon; add weapon damage
        if (type == ItemType.WEAPON) {
            var min = statGenerator.getRandomMinDamage(level);
            var max = statGenerator.getRandomMaxDamage(level, min);
            // Add damage depending on the rarity
            var multiplier = 1;
            switch (rarity) {
                case ItemRarity.UNCOMMON:
                    multiplier = 1.1;
                case ItemRarity.RARE:
                    multiplier = 1.3;
                    break;
                case ItemRarity.EPIC:
                    multiplier = 1.6;
                    break;
                case ItemRarity.LEGENDARY:
                    multiplier = 2;
                    break;
            }

            itemBonuses.maxDamage = Math.ceil(min * multiplier);
            itemBonuses.maxDamage = Math.ceil(max * multiplier);
        }
        // Else; add armour
        else {
            itemBonuses.armour = statGenerator.getRandomArmour(level);
        }

        // Create the name
        var name = prefix;
        switch (type) {
            case ItemType.HELM: name += " Helmet "; break;
            case ItemType.SHOULDERS: name += " Shoulders "; break;
            case ItemType.CHEST: name += " Chest "; break;
            case ItemType.LEGS: name += " Legs "; break;
            case ItemType.WEAPON: name += " Weapon "; break;
            case ItemType.GLOVES: name += " Gloves "; break;
            case ItemType.BOOTS: name += " Boots "; break;
            case ItemType.TRINKET: name += " Trinket "; break;
            case ItemType.OFF_HAND: name += " Shield "; break;
        }
        name += suffix;

        // Calculate the icon coordinates
        var iconSourceX = 0;
        var iconSourceY = 0;
        // x coordinate
        switch (type) {
            case ItemType.HELM: iconSourceX = 0; break;
            case ItemType.SHOULDERS: iconSourceX = 280; break;
            case ItemType.CHEST: iconSourceX = 245; break;
            case ItemType.LEGS: iconSourceX = 210; break;
            case ItemType.WEAPON: iconSourceX = 175; break;
            case ItemType.GLOVES: iconSourceX = 140; break;
            case ItemType.BOOTS: iconSourceX = 105; break;
            case ItemType.TRINKET: iconSourceX = 70; break;
            case ItemType.OFF_HAND: iconSourceX = 35; break;
        }
        // y coordinate
        switch (rarity) {
            case ItemRarity.UNCOMMON: iconSourceY = 140; break;
            case ItemRarity.RARE: iconSourceY = 105; break;
            case ItemRarity.EPIC: iconSourceY = 70; break;
            case ItemRarity.LEGENDARY: iconSourceY = 35; break;
        }

        // Calculate the sell value
        var multiple = 0;
        switch (type) {
            case ItemType.HELM: multiple = 2.3; break;
            case ItemType.SHOULDERS: multiple = 2.5; break;
            case ItemType.CHEST: multiple = 3.3; break;
            case ItemType.LEGS: multiple = 3.1; break;
            case ItemType.WEAPON: multiple = 2.9; break;
            case ItemType.GLOVES: multiple = 2.1; break;
            case ItemType.BOOTS: multiple = 2.1; break;
            case ItemType.TRINKET: multiple = 2.9; break;
            case ItemType.OFF_HAND: multiple = 2.7; break;
        }
        var sellValue = Math.floor(level * multiple);

        // Add any special effects
        var effects = new Array();
        var newEffect = null;
        var effectOwned = false;
        var effectsAmount = 0;
        switch (rarity) {
            case ItemRarity.EPIC: effectsAmount = Math.floor(Math.random() * 2); break;
            case ItemRarity.LEGENDARY: effectsAmount = Math.floor(Math.random() * 2) + 1; break;
        }
        while (effectsAmount > 0) {
            effectOwned = false;
            // Get a new random effect
            switch (type) {
                case ItemType.WEAPON:
                    switch (Math.floor(Math.random() * 3)) {
                        case 0: newEffect = new Effect(EffectType.CRUSHING_BLOWS, 100, 5); break;
                        case 1: newEffect = new Effect(EffectType.COMBUSTION, 100, 5); break;
                        case 2: newEffect = new Effect(EffectType.RUPTURE, 100, 5); break;
                    }
                    break;
                case ItemType.TRINKET:
                    switch (Math.floor(Math.random() * 4)) {
                        case 0: newEffect = new Effect(EffectType.SWIFTNESS, 10, 0); break;
                        case 1: newEffect = new Effect(EffectType.PILLAGING, 10, Math.floor(((Sigma(level) * Math.pow(1.01, level)) / 4 + 1) * 15)); break;
                        case 2: newEffect = new Effect(EffectType.NOURISHMENT, 10, Math.floor((10 * level) * Math.pow(1.001, level) * 0.75)); break;
                        case 3: newEffect = new Effect(EffectType.BERSERKING, 10, Math.floor((level) * Math.pow(1.001, level) * 3)); break;
                    }
                    break;
                default:
                    switch (Math.floor(Math.random() * 5)) {
                        case 0: newEffect = new Effect(EffectType.WOUNDING, 100, Math.ceil(level / 35)); break;
                        case 1: newEffect = new Effect(EffectType.CURING, 100, Math.ceil(level / 35)); break;
                        case 2: newEffect = new Effect(EffectType.FROST_SHARDS, 100, Math.ceil(level / 35)); break;
                        case 3: newEffect = new Effect(EffectType.FLAME_IMBUED, 100, Math.ceil(level / 35)); break;
                        case 4: newEffect = new Effect(EffectType.BARRIER, 100, Math.floor((Math.random() * 15) + 20)); break;
                    }
                    break;
            }
            // Check to see if the item will already have this effect
            for (var x = 0; x < effects.length; x++) {
                if (effects[x].type == newEffect.type) {
                    effectOwned = true;
                }
            }
            // If it won't, add it to the effects
            if (!effectOwned) {
                effects.push(newEffect);
                effectsAmount--;
            }
        }
        itemBonuses.effects = effects;

        var newItem = new Item(name, level, rarity, type, sellValue, iconSourceX, iconSourceY, itemBonuses);
        return newItem;
    }
}