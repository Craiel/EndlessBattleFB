function FrozenBattle() {

    this.settings = undefined;
    this.version = 1.7;

    this.moduleActive = true;

    this.lastUpdateTime = Date.now();
    this.lastAttackTime = Date.now();
    this.lastStatsUpdate = Date.now();

    this.damageDealtSinceUpdate = 0;
    this.experienceSinceUpdate = 0;

    this.updateTimePassed = 0;

    // ---------------------------------------------------------------------------
    // main code
    // ---------------------------------------------------------------------------
    this.init = function() {
        if (game == undefined || legacyGame.itemCreator == undefined
                || legacyGame.itemCreator.createRandomItem == undefined) {
            frozenUtils.log("Endless battle was not detected, disabling module!");
            this.moduleActive = false;
            return;
        }

        legacyGame.FrozenBattle = this;

        // Load the settings
        this.settings = new FrozenBattleData();
        this.settings.load();

        this.registerHooks();
        this.applyLevelResetBonus();
        
        // Apply bought stats
        this.applyStatIncrease();

        // Store some other variables from the core game
        this.minRarity = ItemRarity.COMMON;
        this.maxRarity = ItemRarity.LEGENDARY;

        this.initializeUI();

        this.temp_fixPlayerHealth();

        frozenUtils.log("Frozen battle module version " + this.getFullVersionString() + " loaded");
    }

    this.registerHooks = function() {
        // Store the native methods
        legacyGame.native_update = legacyGame.update;
        legacyGame.native_createRandomItem = legacyGame.itemCreator.createRandomItem;
        legacyGame.native_save = legacyGame.save;
        legacyGame.native_load = legacyGame.load;
        legacyGame.native_reset = legacyGame.reset;
        legacyGame.player.native_getCritChance = legacyGame.player.getCritChance;
        legacyGame.mercenaryManager.native_purchaseMercenary = legacyGame.mercenaryManager.purchaseMercenary;
        legacyGame.monsterCreator.native_createRandomMonster = legacyGame.monsterCreator.createRandomMonster;

        // Override with our own
        legacyGame.update = this.onUpdate;
        legacyGame.itemCreator.createRandomItem = this.onCreateRandomItem;
        legacyGame.save = this.onSave;
        legacyGame.load = this.onLoad;
        legacyGame.reset = this.onReset;
        legacyGame.player.getCritChance = this.onGetCritChance;
        legacyGame.mercenaryManager.purchaseMercenary = this.onPurchaseMercenary;
        legacyGame.monsterCreator.createRandomMonster = this.onCreateMonster;
        
        // Override item tooltips
        this.native_equipItemHover = equipItemHover;
        this.native_inventoryItemHover = inventoryItemHover;
        equipItemHover = this.onEquipItemHover;
        inventoryItemHover = this.onInventoryItemHover;
        
        // Override the formatter
        this.native_formatMoney = Number.prototype.formatMoney;
        Number.prototype.formatMoney = this.onFormatNumber;
        Number.prototype.formatNumber = this.onFormatNumber;
    }

    this.releaseHooks = function() {
        legacyGame.update = legacyGame.native_update;
        legacyGame.itemCreator.createRandomItem = legacyGame.native_createRandomItem;
        legacyGame.save = legacyGame.native_save;
        legacyGame.load = legacyGame.native_load;
        legacyGame.reset = legacyGame.native_reset;
        legacyGame.player.getCritChance = legacyGame.player.native_getCritChance;
        legacyGame.mercenaryManager.purchaseMercenary = legacyGame.mercenaryManager.native_purchaseMercenary;
        legacyGame.monsterCreator.createRandomMonster = legacyGame.monsterCreator.native_createRandomMonster;
        
        Number.prototype.formatMoney = this.native_formatMoney;
        equipItemHover = this.native_equipItemHover;
        inventoryItemHover = this.native_inventoryItemHover;
    }

    this.onReset = function() {
        var self = legacyGame.FrozenBattle;

        self.releaseHooks();
        self.settings.levelsReset += legacyGame.player.level - 1;
        frozenUtils.log("Resetting");

        legacyGame.native_reset();

        self.applyLevelResetBonus();
        self.settings.autoCombatMaxLevelDifference = 0;
        self.settings.autoCombatLevel = 1;
        self.settings.statIncreaseAgi = 0;
        self.settings.statIncreaseStamina = 0;
        self.settings.statIncreaseStrength = 0;
        self.settings.statsBought = 0;
        self.settings.save();

        self.registerHooks();

        self.updateUI();
    }

    this.onCreateMonster = function(level, rarity) {
        var newMonster = legacyGame.monsterCreator.native_createRandomMonster(level, rarity);
        return newMonster;
    }

    this.onPurchaseMercenary = function(type) {
        legacyGame.mercenaryManager.native_purchaseMercenary(type);
        legacyGame.FrozenBattle.updateUI();
    }

    this.onGetCritChance = function() {
        var chance = legacyGame.player.native_getCritChance();
        if (chance > 90) {
            return 90;
        }

        return chance;
    }

    this.onUpdate = function() {
        legacyGame.FrozenBattle.update();
    }

    this.onSave = function() {
        legacyGame.FrozenBattle.save();
    }

    this.onLoad = function() {
        legacyGame.FrozenBattle.load();
    }
    
    this.onFormatNumber = function(d) {
        var self = legacyGame.FrozenBattle;
        var formatterKey = frozenUtils.FormatterKeys[self.settings.numberFormatter];
        if (frozenUtils.Formatters[formatterKey] != undefined) {
            var formatter = frozenUtils.Formatters[formatterKey];
            return formatter(parseInt(this)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return self.nativeFormatMoney(this, d || 0);
        }
    }

    this.onEquipItemHover = function(obj, index) {
        var self = legacyGame.FrozenBattle;
        self.native_equipItemHover(obj, index);

        var item = legacyGame.inventory.slots[index - 1];
        if (!item) {
            return;
        }

        $("#itemTooltipSellValue").html(item.sellValue.formatNumber());
    }

    this.onInventoryItemHover = function(obj, index) {
        var self = legacyGame.FrozenBattle;
        self.native_inventoryItemHover(obj, index);

        var item = legacyGame.inventory.slots[index - 1];
        if (!item) {
            return;
        }

        $("#itemTooltipSellValue").html(item.sellValue.formatNumber());
        var equippedSlot = self.getItemSlotNumber(item.type);
        var item2 = legacyGame.equipment.slots[equippedSlot];
        if (item2) {
            $("#itemCompareTooltipSellValue").html(item2.sellValue.formatNumber());
        }
    }

    this.save = function() {
        legacyGame.native_save();

        this.settings.save();

        localStorage.fb_version = this.version;
    }

    this.load = function() {
        legacyGame.native_load();

        this.settings.load();
    }

    this.update = function() {
        legacyGame.native_update();

        if (!this.moduleActive || this.settings.disabled) {
            return;
        }

        var currentTime = Date.now();

        // Auto combat uses it's own timing
        this.autoCombat(currentTime);

        this.updateTimePassed += (currentTime - this.lastUpdateTime);
        if (this.updateTimePassed >= this.settings.updateInterval) {
            this.finishMonster(currentTime);
            this.autoSell(currentTime);
            this.updateTimePassed -= this.settings.updateInterval;
        }

        var timeSinceStatUpdate = currentTime - this.lastStatsUpdate;
        if (timeSinceStatUpdate > 1000) {
            this.updateStats();
            this.lastStatsUpdate = currentTime;
        }

        this.updateInterfaceOverrides();

        lastUpdateTime = currentTime;
    }

    this.finishMonster = function(time) {
        // This will only go into effect if the monster shows as 0 health to fix
        // floating health issues
        if (!legacyGame.inBattle || !legacyGame.monster.alive || legacyGame.monster.health >= 1) {
            return;
        }

        // Force the game to attack to resolve the dead monster
        legacyGame.monster.alive = false;
        legacyGame.attack();
    }

    this.autoCombat = function(time) {
        if (!this.settings.autoCombatActive) {
            return;
        }

        var autoAttackTime = this.getAutoAttackTime();
        if (time - this.lastAttackTime < autoAttackTime) {
            return;
        }

        this.lastAttackTime = time;

        // If we don't have enough health don't auto attack
        var healthThreshold = legacyGame.player.getMaxHealth() / 2;
        if (legacyGame.player.health < healthThreshold) {
            return;
        }

        // Ensure that we fight on the minimum level
        var targetLevel = legacyGame.player.level;
        if (this.settings.autoCombatKeepLevelDifference) {
            targetLevel = legacyGame.player.level - this.settings.autoCombatMaxLevelDifference;
        }
        else {
            targetLevel = this.settings.autoCombatLevel;
        }

        legacyGame.battleLevel = targetLevel;

        // Enter battle
        if (legacyGame.inBattle == false && legacyGame.player.alive) {
            legacyGame.enterBattle();
        }

        var doubleHitChance = this.getDoubleHitChance();
        var attacks = 1;
        if (Math.random() < doubleHitChance) {
            attacks++;
        }

        while (attacks >= 1) {
            this.addStat("Auto attacks");
            legacyGame.attack();
            attacks--;
        }
    };

    this.getAutoAttackTime = function() {
        // Base time is 10s and increasing by 5% of the player level in ms
        var time = 10000 + (legacyGame.player.level * 100);
        var deduction = 0;
        deduction += legacyGame.mercenaryManager.footmenOwned * 10;
        deduction += legacyGame.mercenaryManager.clericsOwned * 20;
        deduction += legacyGame.mercenaryManager.magesOwned * 75;
        deduction += legacyGame.mercenaryManager.assassinsOwned * 150;
        deduction += legacyGame.mercenaryManager.warlocksOwned * 250;
        var multiplier = 1.0;
        if(this.settings.applyLevelResetBonus) {
            multiplier += this.settings.levelsReset * 0.001;
        }
        
        deduction *= multiplier;
        time -= deduction;
        if (time < 25) {
            return 25;
        }

        return time;
    };

    this.getDoubleHitChance = function() {
        var baseChance = 0.01;
        var chance = legacyGame.player.native_getCritChance();
        if (chance > 90) {
            baseChance += (chance - 90) / 1000;
        }

        return baseChance;
    };

    this.autoSell = function(time) {
        if (!this.settings.autoSellActive) {
            return;
        }

        // Check the inventory
        var freeSlots = 0;
        for (var slot = 0; slot < legacyGame.inventory.slots.length; slot++) {
            if (legacyGame.inventory.slots[slot] != null) {
                var item = legacyGame.inventory.slots[slot];
                var rarity = this.getRarityNumber(item.rarity);
                if (rarity >= this.settings.autoSellThreshold) {
                    continue;
                }

                if (this.settings.detailedLogging) {
                    frozenUtils.log("sold " + this.getRarityString(rarity) + " " + item.name
                            + " for " + item.sellValue.formatNumber());
                }

                this.addStat("Items sold");
                this.addStat("Items sold for", item.sellValue);
                legacyGame.inventory.sellItem(slot);
            }
            else {
                freeSlots++;
            }
        }

        if (freeSlots == 0) {
            frozenUtils.log("Inventory full, selling all items!");
            legacyGame.inventory.sellAll();
        }
    }

    this.onCreateRandomItem = function(level, rarity) {
        return legacyGame.FrozenBattle.createRandomItem(level, rarity);
    }

    this.createRandomItem = function(level, rarity) {
        var item = legacyGame.native_createRandomItem(level, rarity);
        if (item == null) {
            return null;
        }

        if (this.settings.enchantingEnabled) {
            this.enchantItem(item);
        }

        if (this.settings.improvedSalePriceEnabled) {
            this.updateSalePrice(item);
        }

        if (this.settings.detailedLogging) {
            frozenUtils.log("Found "+item.rarity+" " + item.name);
        }

        return item;
    }

    this.addStat = function(key, value) {
        if (value == undefined)
            value = 1;
        if (!this.settings.stats[key]) {
            this.settings.stats[key] = 0;
        }

        this.settings.stats[key] += value;
        this.updateInterfaceStats();
    }

    this.enchantItem = function(item) {
        var enchantChance = this.settings.enchantingBaseChance;
        var bonus = 0;
        while (Math.random() <= enchantChance) {
            bonus++;
            enchantChance /= 1.5;
        }

        if (bonus > 0) {
            this.addStat("Items enchanted");
            item.name += " +" + bonus;
            item.enchantLevel = bonus;
            var multiplier = 1 + (this.settings.enchantingBaseMultiplier * bonus);

            item.minDamage = parseInt(item.minDamage * multiplier);
            item.maxDamage = parseInt(item.maxDamage * multiplier);
            item.damageBonus = parseInt(item.damageBonus * multiplier);

            item.strength = parseInt(item.strength * multiplier);
            item.agility = parseInt(item.agility * multiplier);
            item.stamina = parseInt(item.stamina * multiplier);

            item.health = parseInt(item.health * multiplier);
            item.hp5 = parseInt(item.hp5 * multiplier);
            item.armour = parseInt(item.armour * multiplier);
            item.armourBonus = parseInt(item.armourBonus * multiplier);

            item.critChance = parseInt(item.critChance * multiplier);
            item.critDamage = parseInt(item.critDamage * multiplier);

            item.goldGain = parseInt(item.goldGain * multiplier);
            item.experienceGain = parseInt(item.experienceGain * multiplier);
        }
    }

    this.updateSalePrice = function(item) {
        baseSaleValue = Math.pow(item.level / 2, 3);
        item.sellValue = 0;

        var multiplier = 1;
        multiplier += this.updateSalePriceFor(item, item.damageBonus, 1, 0.15);

        multiplier += this.updateSalePriceFor(item, item.strength, 0.1, 0.1);
        multiplier += this.updateSalePriceFor(item, item.agility, 0.1, 0.1);
        multiplier += this.updateSalePriceFor(item, item.stamina, 0.1, 0.05);

        multiplier += this.updateSalePriceFor(item, item.health, 0.05, 0.01);
        multiplier += this.updateSalePriceFor(item, item.hp5, 0.05, 0.02);
        multiplier += this.updateSalePriceFor(item, item.armour, 0.05, 0.01);
        multiplier += this.updateSalePriceFor(item, item.armourBonus, 0.1, 0.05);

        multiplier += this.updateSalePriceFor(item, item.critChance, 1, 0.15);
        multiplier += this.updateSalePriceFor(item, item.critDamage, 0.5, 0.05);

        multiplier += this.updateSalePriceFor(item, item.goldGain, 0.01, 0.01);
        multiplier += this.updateSalePriceFor(item, item.experienceGain, 0.01, 0.01);

        multiplier += this.updateSalePriceFor(item, item.enchantLevel, 0, 0.2);

        if (multiplier == NaN) {
            return;
        }

        var multipliedBaseValue = parseInt(baseSaleValue * multiplier);
        item.sellValue += multipliedBaseValue;
    }

    this.updateSalePriceFor = function(item, value, multiplierAdd, multiplierQuality) {
        var current = item.sellValue;
        if (value == NaN || value == undefined || value == 0) {
            return 0;
        }

        current += parseInt(value * multiplierAdd);
        item.sellValue = current;
        return multiplierQuality;
    }

    this.getRarityNumber = function(rarity) {
        switch (rarity) {
            case ItemRarity.COMMON:
                return 0;
            case ItemRarity.UNCOMMON:
                return 1;
            case ItemRarity.RARE:
                return 2;
            case ItemRarity.EPIC:
                return 3;
            case ItemRarity.LEGENDARY:
                return 4;
        }
    }

    this.getRarityString = function(rarityNumber) {
        switch (rarityNumber) {
            case 0:
                return "Common";
            case 1:
                return "Uncommon";
            case 2:
                return "Rare";
            case 3:
                return "Epic";
            case 4:
                return "Legendary";
        }
    }

    this.getItemSlotNumber = function(type) {
        switch (type) {
            case ItemType.HELM:
                return 0;
            case ItemType.SHOULDERS:
                return 1;
            case ItemType.CHEST:
                return 2;
            case ItemType.LEGS:
                return 3;
            case ItemType.WEAPON:
                return 4;
            case ItemType.GLOVES:
                return 5;
            case ItemType.BOOTS:
                return 6;
            case ItemType.TRINKET:
                return 7;
            case ItemType.OFF_HAND:
                return 9;
        }
    }

    this.getFullVersionString = function() {
        return this.version;
    }

    // thanks to feildmaster @
    // http://feildmaster.com/feildmaster/scripts/EndlessImprovement/1.1/
    this.temp_fixPlayerHealth = function() {
        frozenUtils.log("Applying player health fix (thanks to feildmaster)");

        legacyGame.player.baseHealthLevelUpBonus = 0;
        legacyGame.player.baseHp5LevelUpBonus = 0;

        // Add stats to the player for leveling up
        for (var x = 1; x < legacyGame.player.level; x++) {
            legacyGame.player.baseHealthLevelUpBonus += Math.floor(legacyGame.player.healthLevelUpBonusBase
                    * (Math.pow(1.15, x)));
            legacyGame.player.baseHp5LevelUpBonus += Math.floor(legacyGame.player.hp5LevelUpBonusBase
                    * (Math.pow(1.15, x)));
        }

        legacyGame.player.health = legacyGame.player.getMaxHealth();
    }

    this.sortInventory = function() {
        var order = {}
        for (var slot = 0; slot < legacyGame.inventory.slots.length; slot++) {
            if (legacyGame.inventory.slots[slot] != null) {
                var item = legacyGame.inventory.slots[slot];
                var orderValue = (this.getItemSlotNumber(item.type) * 100)
                        + this.getRarityNumber(item.rarity);
                if (!order[orderValue]) {
                    order[orderValue] = [];
                }

                order[orderValue].push(item);
            }
        }

        var keys = Object.keys(order);
        keys.sort();
        var currentSlot = 0;
        for (var i = 0; i < keys.length; i++) {
            for (var n = 0; n < order[keys[i]].length; n++) {
                legacyGame.inventory.slots[currentSlot++] = order[keys[i]][n];
            }
        }

        for (var slot = currentSlot; slot < legacyGame.inventory.slots.length; slot++) {
            legacyGame.inventory.slots[slot] = null;
        }
    }

    this.nativeFormatMoney = function(n, c, d, t) {
        var c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? ","
                : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3
                : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t)
                + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }

    this.updateStats = function() {
        this.settings.stats['Damage/s'] = this.damageDealtSinceUpdate;
        this.damageDealtSinceUpdate = 0;

        this.settings.stats['XP/s'] = this.experienceSinceUpdate;
        this.experienceSinceUpdate = 0;

        // Set some special stats directly
        this.settings.stats["Levels reset"] = this.settings.levelsReset;
        this.settings.stats["Str bought"] = this.settings.statIncreaseStrength;
        this.settings.stats["Sta bought"] = this.settings.statIncreaseStamina;
        this.settings.stats["Agi bought"] = this.settings.statIncreaseAgi;

        this.updateInterfaceStats();
    }
    
    this.applyLevelResetBonus = function() {
        if (this.settings.applyLevelResetBonus) {
            legacyGame.player.baseStats.damageBonus += this.settings.levelsReset;
            legacyGame.player.baseStats.goldGain += this.settings.levelsReset;
            legacyGame.player.baseStats.experienceGain += this.settings.levelsReset;
        } else {
            legacyGame.player.baseStats.damageBonus -= this.settings.levelsReset;
            legacyGame.player.baseStats.goldGain -= this.settings.levelsReset;
            legacyGame.player.baseStats.experienceGain -= this.settings.levelsReset;
        }
    }
    
    this.applyStatIncrease = function() {
        legacyGame.player.baseStats.strength += this.settings.statIncreaseStrength;
        legacyGame.player.baseStats.stamina += this.settings.statIncreaseStamina;
        legacyGame.player.baseStats.agility += this.settings.statIncreaseAgi;
    }
    
    this.removeStatIncrease = function() {
        legacyGame.player.baseStats.strength -= this.settings.statIncreaseStrength;
        legacyGame.player.baseStats.stamina -= this.settings.statIncreaseStamina;
        legacyGame.player.baseStats.agility -= this.settings.statIncreaseAgi;
    }
    
    this.gamble = function() {
        var cost = this.getGambleCost();
        if(legacyGame.player.gold < cost) {
            frozenUtils.logError("Not enough gold!");
            return false;
        }
        
        var targetLevel = legacyGame.player.level;
        var depth = 2 + Math.random() * 10;
        var modifier = Math.random();
        var gambleResult = "average";
        if(modifier < 0.2) {
            targetLevel -= 2;
            gambleResult = "mediocre";
            depth -= 5;
        }
        if(modifier > 0.8) {
            targetLevel++;
            gambleResult = "good";
            depth += 10;
        }
        if(modifier > 0.9) {
            targetLevel += 2;
            gambleResult = "great";
            depth += 10;
        }
                
        var rarity = legacyGame.monsterCreator.calculateMonsterRarity(targetLevel, Math.floor(depth))
        var item = undefined;
        while(item == undefined) {
            item = legacyGame.itemCreator.createRandomItem(targetLevel, rarity);
        }
        
        legacyGame.inventory.lootItem(item);
        legacyGame.player.gold -= cost;
        this.addStat('Gambled');
        this.addStat('Gamble cost', cost);
        frozenUtils.log("Gambled an "+gambleResult+" reward!");
        return true;
    }
    
    this.increaseStat = function(key) {
        var cost = this.getStatIncreaseCost();
        if(legacyGame.player.gold < cost) {
            frozenUtils.logError("Not enough gold!");
            return false;
        }
        
        this.removeStatIncrease();
        this.settings[key]++;
        this.settings.statsBought++;
        this.applyStatIncrease();
        
        legacyGame.player.gold -= cost;
        
        this.addStat('Stat cost', cost);
        
        return true;
    }
    
    this.getGps = function() {
        var gps = 0;

        for (var x = 0; x < legacyGame.mercenaryManager.mercenaries.length; x++) {
            gps += legacyGame.mercenaryManager.getMercenariesGps(legacyGame.mercenaryManager.mercenaries[x].type);
        }
        
        return gps;
    }
    
    this.getGambleCost = function() {
        var cost = Math.pow(1.3, legacyGame.player.level) * 340;
        return cost;
    }
    
    this.getStatIncreaseCost = function() {
        var cost = Math.pow(1.15, this.settings.statsBought) * 240;
        return cost;
    }

    // ---------------------------------------------------------------------------
    // User interface
    // ---------------------------------------------------------------------------
    this.initializeUI = function() {
        $('#version')
                .after(
                        $(
                                '<div id="fbVersion" style="color: #808080; padding: 5px 0px 5px 10px; float: left"/>')
                                .html('FB ' + this.getFullVersionString()));

        $('#inventoryWindowSellAllButton')
                .after(
                        $(
                                '<div id="inventoryWindowSortButton" class="button" style="font-family: \'Gentium Book Basic\'; position: absolute; left: 5px; top: 202px; line-height: 16px; color: #fff; font-size: 16px; text-shadow: 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;"/>')
                                .addClass('button').html('Sort').click(this.onSortInventory));

        // Extended options
        $('#expBarOption').after(
                $('<div id="fbOptionNumberFormatting" class="optionsWindowOption"/>').click(
                        this.onToggleOptionNumberFormatting));
        $('#fbOptionNumberFormatting').after(
                $('<div id="fbOptionDetailedLogging" class="optionsWindowOption"/>').click(
                        function() {
                            legacyGame.FrozenBattle.onToggleBoolSetting("detailedLogging")
                        }));
        $('#fbOptionDetailedLogging').after(
                $('<div id="fbOptionEnchanting" class="optionsWindowOption"/>').click(function() {
                    legacyGame.FrozenBattle.onToggleBoolSetting("enchantingEnabled")
                }));
        $('#fbOptionEnchanting').after(
                $('<div id="fbOptionImprovedSalePrice" class="optionsWindowOption"/>').click(
                        function() {
                            legacyGame.FrozenBattle
                                    .onToggleBoolSetting("improvedSalePriceEnabled")
                        }));
        $('#fbOptionImprovedSalePrice').after(
                $('<div id="fbOptionFormatHealthBars" class="optionsWindowOption"/>').click(
                        function() {
                            legacyGame.FrozenBattle
                                    .onToggleBoolSetting("formatHealthBarNumbers")
                        }));
        $('#fbOptionFormatHealthBars').after(
                $('<div id="fbOptionApplyLevelResetBonus" class="optionsWindowOption"/>').click(this.onToggleApplyLevelResetBonus));
        $('#fbOptionApplyLevelResetBonus').after(
                $('<div id="fbOptionSkipTutorial" class="optionsWindowOption"/>').click(
                        function() {
                            legacyGame.FrozenBattle
                                    .onToggleBoolSetting("skipTutorial")
                        }));

        // Auto combat screen
        var ondemandOptions = $('<div id="fbOnDemandOptions" class="navBarWindow" style="width:300px; height:320px; position: absolute; left:10px;top: 150px;margin: 0;"/>');
        $(document.body).append(ondemandOptions);
        ondemandOptions
                .append("<div class=\"navBarText\" style=\"padding: 5px 10px 5px 10px\">Frozen Battle Options</div");

        ondemandOptions
                .append($(
                        '<div id="autoCombatButton" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
                        .addClass('button').click(function() {
                            legacyGame.FrozenBattle.onToggleBoolSetting("autoCombatActive")
                        }));

        ondemandOptions
                .append($(
                        '<div id="autoCombatKeepLevelDifferenceButton" class="navBarText" style="padding: 2px 10px 2px 20px"/>')
                        .addClass('button').click(
                                function() {
                                    legacyGame.FrozenBattle
                                            .onToggleBoolSetting("autoCombatKeepLevelDifference")
                                }));

        ondemandOptions.append($('<div id="fbOnDemandOptionsCloseButton" class="closeButton button" onmouseover="closeButtonHover(this)" onmouseout="closeButtonReset(this)" onmousedown="closeButtonClick(this)" onmouseup="closeButtonReset(this)"></div>'));

        var autoCombatLevelDifference = $('<div id="autoCombatLevelDifference" style="padding: 2px 10px 2px 10px;">');
        ondemandOptions.append(autoCombatLevelDifference);

        autoCombatLevelDifference
                .append(
                        $('<div class="navBarText" style="padding: 2px 10px 2px 10px;float:left">- Level range: </div>'))
                .append(
                        $(
                                '<div id="autoCombatLevelDifferenceDown" class="battleLevelButton button" style="margin:0;position: relative;left:0px; top:0px; float:left; background: url(\'includes/images/battleLevelButton.png\') 0 25px">-</button>')
                                .click(function() {
                                    legacyGame.FrozenBattle.onModifyBattleLevelDifference(-1);
                                }))
                .append(
                        $('<div id="autoCombatLevelDifferenceText" class="navBarText" style="padding: 2px 10px 2px 10px;float:left">N/A</div>'))
                .append(
                        $(
                                '<div id="autoCombatLevelDifferenceUp" class="battleLevelButton button" style="margin:0;position: relative;left:0px; top:0px;float:left">+</button>')
                                .click(function() {
                                    legacyGame.FrozenBattle.onModifyBattleLevelDifference(1);
                                })).append($('<div style="clear:both;"/>'));

        var autoCombatLevel = $('<div id="autoCombatLevel" style="padding: 2px 10px 2px 10px;">');
        ondemandOptions.append(autoCombatLevel);

        autoCombatLevel
                .append(
                        $('<div class="navBarText" style="padding: 2px 10px 2px 10px;float:left">- Level: </div>'))
                .append(
                        $(
                                '<div id="autoCombatLevelDown" class="battleLevelButton button" style="margin:0;position: relative;left:0px; top:0px; float:left; background: url(\'includes/images/battleLevelButton.png\') 0 25px">-</button>')
                                .click(function() {
                                    legacyGame.FrozenBattle.onModifyBattleLevel(-1);
                                }))
                .append(
                        $('<div id="autoCombatLevelText" class="navBarText" style="padding: 2px 10px 2px 10px;float:left">N/A</div>'))
                .append(
                        $(
                                '<div id="autoCombatLevelUp" class="battleLevelButton button" style="margin:0;position: relative;left:0px; top:0px;float:left">+</button>')
                                .click(function() {
                                    legacyGame.FrozenBattle.onModifyBattleLevel(1);
                                })).append($('<div style="clear:both;"/>'));

        ondemandOptions.append($(
                '<div id="autoSellButton" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
                .addClass('button').click(function() {
                    legacyGame.FrozenBattle.onToggleBoolSetting("autoSellActive")
                }));
        
        ondemandOptions
                .append($(
                        '<div id="autoSellThresholdButton" class="navBarText" style="padding: 2px 10px 2px 20px"/>')
                        .addClass('button').click(this.onToggleAutoSellThreshold));
        
        ondemandOptions.append($(
        '<div id="gambleButton" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
        .addClass('button').click(this.onGamble));
        
        ondemandOptions.append($(
        '<div id="statIncreaseStr" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
        .addClass('button').click(function() {
            legacyGame.FrozenBattle.onIncreaseStat('statIncreaseStrength');
        }));
        
        ondemandOptions.append($(
        '<div id="statIncreaseSta" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
        .addClass('button').click(function() {
            legacyGame.FrozenBattle.onIncreaseStat('statIncreaseStamina');
        }));
        
        ondemandOptions.append($(
        '<div id="statIncreaseAgi" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
        .addClass('button').click(function() {
            legacyGame.FrozenBattle.onIncreaseStat('statIncreaseAgi');
        }));

        ondemandOptions.draggable({drag: function() { updateWindowDepths(document.getElementById("fbOnDemandOptions")); }, cancel: '.globalNoDrag'});
        ondemandOptions.hide();

        // Extra Stats screen
        var extraStats = $('<div id="fbExtraStatsWindow" class="navBarWindow" style="width:300px; height:500px; position: absolute; left:10px;top: 150px;margin: 0;"/>');
        $(document.body).append(extraStats);
        extraStats.append('<div class="navBarText" style="padding: 5px 100px 5px 10px; float: left">Frozen Battle Stats</div>');

        var clearButton = $('<div class="navBarText" style="padding: 5px 10px 5px 20px">Clear</div>');
        clearButton.click(this.onClearStats);
        extraStats.append(clearButton);

        extraStats.append('<div id="fbExtraStats" style="padding: 5px 10px 5px 10px"/>');

        extraStats.append($('<div id="fbExtraStatsCloseButton" class="closeButton button" onmouseover="closeButtonHover(this)" onmouseout="closeButtonReset(this)" onmousedown="closeButtonClick(this)" onmouseup="closeButtonReset(this)"></div>'));
        extraStats.draggable({drag: function() { updateWindowDepths(document.getElementById("fbExtraStatsWindow")); }, cancel: '.globalNoDrag'});
        extraStats.hide();

        // Extra Stats screen
        var combatLog = $('<div id="fbCombatLogWindow" class="navBarWindow" style="width:500px; height:250px; position: absolute; left:5px;bottom: 5px; top:initial;margin: 0"/>');
        $('#gameArea').append(combatLog);
        combatLog.append('<div class="navBarText" style="padding: 5px 300px 5px 10px; float: left">Combat Log</div>');

        combatLog.append('<div id="fbCombatLogContent" style="padding: 5px 10px 5px 10px; height: 85%; width: 95%; overflow: auto"/>');

        combatLog.append($('<div id="fbCombatLogCloseButton" class="closeButton button" onmouseover="closeButtonHover(this)" onmouseout="closeButtonReset(this)" onmousedown="closeButtonClick(this)" onmouseup="closeButtonReset(this)"></div>'));
        combatLog.draggable({drag: function() { updateWindowDepths(document.getElementById("fbCombatLogWindow")); }, cancel: '.globalNoDrag'});

        frozenUtils.logCallback = this.onLog;

        this.updateUI();
        this.updateInterfaceStats();
    }

    this.onClearStats = function(value) {
        var self = legacyGame.FrozenBattle;
        self.settings.stats = {};
        self.updateInterfaceStats();
    }

    this.onModifyBattleLevel = function(value) {
        var self = legacyGame.FrozenBattle;
        self.settings.autoCombatLevel += value;
        if (self.settings.autoCombatLevel < 0) {
            self.settings.autoCombatLevel = 0;
        }
        if (self.settings.autoCombatLevel >= legacyGame.player.level) {
            self.settings.autoCombatLevel = legacyGame.player.level - 1;
        }
        self.updateUI();
    }

    this.onModifyBattleLevelDifference = function(value) {
        var self = legacyGame.FrozenBattle;
        self.settings.autoCombatMaxLevelDifference += value;
        if (self.settings.autoCombatMaxLevelDifference < 0) {
            self.settings.autoCombatMaxLevelDifference = 0;
        }
        if (self.settings.autoCombatMaxLevelDifference >= legacyGame.player.level) {
            self.settings.autoCombatMaxLevelDifference = legacyGame.player.level - 1;
        }
        self.updateUI();
    }

    this.onToggleBoolSetting = function(setting) {
        var self = legacyGame.FrozenBattle;
        self.settings[setting] = !self.settings[setting];
        self.updateUI();
    }
    
    this.onIncreaseStat = function(key) {
        var self = legacyGame.FrozenBattle;
        if(self.increaseStat(key)) {
            self.updateUI();
        }
    }
    
    this.onToggleApplyLevelResetBonus = function() {
        var self = legacyGame.FrozenBattle;
        self.settings.applyLevelResetBonus = !self.settings.applyLevelResetBonus;
        self.applyLevelResetBonus();
        self.updateUI();
    }

    this.onToggleAutoSellThreshold = function() {
        var self = legacyGame.FrozenBattle;
        if (self.settings.autoSellThreshold <= self.getRarityNumber(self.maxRarity)) {
            self.settings.autoSellThreshold++;
        }
        else {
            self.settings.autoSellThreshold = self.getRarityNumber(self.minRarity);
        }
        self.updateUI();
    }

    this.onToggleOptionNumberFormatting = function() {
        var self = legacyGame.FrozenBattle;
        if (self.settings.numberFormatter >= frozenUtils.FormatterKeys.length - 1) {
            self.settings.numberFormatter = 0;
        }
        else {
            self.settings.numberFormatter++;
        }

        self.updateMercenarySalePrices();
        self.updateUI();
    }

    this.onSortInventory = function() {
        legacyGame.FrozenBattle.sortInventory();
    }
    
    this.onGamble = function() {
        legacyGame.FrozenBattle.gamble();
    }

    this.updateMercenarySalePrices = function() {
        $("#footmanCost").text(legacyGame.mercenaryManager.footmanPrice.formatNumber());
        $("#clericCost").text(legacyGame.mercenaryManager.clericPrice.formatNumber());
        $("#commanderCost").text(legacyGame.mercenaryManager.commanderPrice.formatNumber());
        $("#mageCost").text(legacyGame.mercenaryManager.magePrice.formatNumber());
        $("#assassinCost").text(legacyGame.mercenaryManager.assassinPrice.formatNumber());
        $("#warlockCost").text(legacyGame.mercenaryManager.warlockPrice.formatNumber());
    }

    this.updateUI = function() {
        if (this.settings.autoCombatActive) {
            var attackTime = frozenUtils.timeDisplay(this.getAutoAttackTime(), true);
            $("#autoCombatButton").text(
                    'Auto combat: ' + this.getBoolDisplayText(this.settings.autoCombatActive)
                            + ' (every ' + attackTime + ')');
            $("#autoCombatKeepLevelDifferenceButton").show();
            $("#autoCombatKeepLevelDifferenceButton").text(
                    '- Keep combat level in range: '
                            + this.getBoolDisplayText(this.settings.autoCombatKeepLevelDifference));
            if (this.settings.autoCombatKeepLevelDifference) {
                $("#autoCombatLevel").hide();
                $("#autoCombatLevelDifference").show();
                $("#autoCombatLevelDifferenceText")
                        .text(this.settings.autoCombatMaxLevelDifference);
            }
            else {
                $("#autoCombatLevel").show();
                $("#autoCombatLevelDifference").hide();
                $("#autoCombatLevelText").text(this.settings.autoCombatLevel);
            }
        }
        else {
            $("#autoCombatButton").text(
                    'Auto combat: ' + this.getBoolDisplayText(this.settings.autoCombatActive));
            $("#autoCombatKeepLevelDifferenceButton").hide();
            $("#autoCombatLevelDifference").hide();
            $("#autoCombatLevel").hide();
        }

        $("#autoSellButton").text(
                'Auto sell: ' + this.getBoolDisplayText(this.settings.autoSellActive));
        $("#fbOptionDetailedLogging").text(
                "Detailed logging: " + this.getBoolDisplayText(this.settings.detailedLogging));
        $("#fbOptionEnchanting").text(
                "Enchanting: " + this.getBoolDisplayText(this.settings.enchantingEnabled));
        $("#fbOptionImprovedSalePrice").text(
                "Improved sale price: "
                        + this.getBoolDisplayText(this.settings.improvedSalePriceEnabled));
        $("#fbOptionNumberFormatting").text(
                "Format numbers: " + frozenUtils.FormatterKeys[this.settings.numberFormatter]);
        $("#fbOptionFormatHealthBars").text(
                "Format health bars: "
                        + this.getBoolDisplayText(this.settings.formatHealthBarNumbers));
        $("#fbOptionApplyLevelResetBonus").text(
                "Apply level reset bonus: "
                        + this.getBoolDisplayText(this.settings.applyLevelResetBonus));
        
        $("#gambleButton").text("Gamble for "+ this.getGambleCost().formatNumber());
        
        var statCost = this.getStatIncreaseCost();
        $("#statIncreaseStr").text("Buy str for "+statCost.formatNumber());
        $("#statIncreaseSta").text("Buy sta for "+statCost.formatNumber());
        $("#statIncreaseAgi").text("Buy agi for "+statCost.formatNumber());

        var autoSellThresholdText = "";
        if (this.settings.autoSellActive) {
            if (this.settings.autoSellThreshold > this.getRarityNumber(this.maxRarity)) {
                autoSellThresholdText = "All";
            }
            else {
                autoSellThresholdText = '- Sell below '
                        + this.getRarityString(this.settings.autoSellThreshold);
            }

            $("#autoSellThresholdButton").show();
            $("#autoSellThresholdButton").text(autoSellThresholdText);
        }
        else {
            $("#autoSellThresholdButton").hide();
        }
    }

    this.updateInterfaceStats = function() {
        $("#fbExtraStats").empty();
        for (key in this.settings.stats) {
            $("#fbExtraStats").append(
                    '<div class="navBarText" style="padding: 5px 70px 5px 10px; float:left;width:100px">'
                            + key + '</div>');
            $("#fbExtraStats").append(
                    '<div class="navBarText" style="padding: 5px 10px 5px 10px">'
                            + this.settings.stats[key].formatNumber() + '</div>');
        }
    }

    this.updateInterfaceOverrides = function(value) {
        if (this.settings.formatHealthBarNumbers) {
            // Set player HP with formatting
            var playerHp = Math.floor(legacyGame.player.health).formatNumber();
            var playerMaxHp = Math.floor(legacyGame.player.getMaxHealth()).formatNumber();
            $("#playerHealthBarText").text(playerHp + '/' + playerMaxHp);

            // Set monster HP with formatting
            if (legacyGame.displayMonsterHealth && legacyGame.monster) {
                var monsterHp = Math.floor(legacyGame.monster.health).formatNumber();
                var monsterMaxHp = Math.floor(legacyGame.monster.maxHealth).formatNumber();
                $("#monsterName").text(monsterHp + '/' + monsterMaxHp);
            }
        }
    }

    this.getBoolDisplayText = function(value) {
        return value ? 'ON' : 'OFF';
    }
}