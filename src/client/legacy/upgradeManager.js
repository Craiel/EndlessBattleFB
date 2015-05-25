function UpgradeManager() {
    this.upgradesButtonGlowing = false;

    this.footmanUpgradesPurchased = 0;
    this.clericUpgradesPurchased = 0;
    this.commanderUpgradesPurchased = 0;
    this.mageUpgradesPurchased = 0;
    this.assassinUpgradesPurchased = 0;
    this.warlockUpgradesPurchased = 0;

    this.clericSpecialUpgradesPurchased = 0;
    this.commanderSpecialUpgradesPurchased = 0;
    this.mageSpecialUpgradesPurchased = 0;
    this.assassinSpecialUpgradesPurchased = 0;
    this.warlockSpecialUpgradesPurchased = 0;

    this.upgrades = new Array();

    this.initialize = function initialize() {
        // Footman Basic Upgrades
        this.upgrades.push(new Upgrade("Footman Training", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 10, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training II", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 19)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 20, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training III", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 29)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 30, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training IV", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 50, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training V", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 74)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 75, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training VI", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 100, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training VII", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 150, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training VIII", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 199)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 200, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training IX", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 249)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 250, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training X", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 199)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 300, "Doubles the GPS of your Footmen", 0, 0));

        // Cleric Basic Upgrades
        this.upgrades.push(new Upgrade("Cleric Training", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 10, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(new Upgrade("Cleric Training II", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 25, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(new Upgrade("Cleric Training III", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 50, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(new Upgrade("Cleric Training IV", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 100, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(new Upgrade("Cleric Training V", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 150, "Doubles the GPS of your Clerics", 200, 0));

        // Commander Basic Upgrades
        this.upgrades.push(new Upgrade("Commander Training", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 10, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(new Upgrade("Commander Training II", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 25, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(new Upgrade("Commander Training III", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 50, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(new Upgrade("Commander Training IV", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 100, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(new Upgrade("Commander Training V", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 150, "Doubles the GPS of your Commanders", 160, 0));

        // Mage Basic Upgrades
        this.upgrades.push(new Upgrade("Mage Training", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 10, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(new Upgrade("Mage Training II", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 25, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(new Upgrade("Mage Training III", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 50, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(new Upgrade("Mage Training IV", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 100, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(new Upgrade("Mage Training V", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 150, "Doubles the GPS of your Mages", 120, 0));

        // Assassin Basic Upgrades
        this.upgrades.push(new Upgrade("Assassin Training", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 10, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(new Upgrade("Assassin Training II", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 25, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(new Upgrade("Assassin Training III", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 50, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(new Upgrade("Assassin Training IV", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 100, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(new Upgrade("Assassin Training V", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 150, "Doubles the GPS of your Assassin", 80, 0));

        // Warlock Basic Upgrades
        this.upgrades.push(new Upgrade("Warlock Training", ((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 10, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(new Upgrade("Warlock Training II", ((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 25, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(new Upgrade("Warlock Training III", ((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 50, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(new Upgrade("Warlock Training IV", ((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 100, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(new Upgrade("Warlock Training V", ((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 150, "Doubles the GPS of your Warlocks", 40, 0));

        // Cleric Ability Upgrades
        this.upgrades.push(new Upgrade("Holy Imbuement", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 50, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
        this.upgrades.push(new Upgrade("Holy Imbuement II", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 100, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
        this.upgrades.push(new Upgrade("Holy Imbuement III", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 150, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
        this.upgrades.push(new Upgrade("Holy Imbuement IV", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 200, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));

        // Commander Ability Upgrades
        this.upgrades.push(new Upgrade("Battle Morale", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 50, "Increases the health bonus from your Commanders by " + legacyGame.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));
        this.upgrades.push(new Upgrade("Battle Morale II", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 100, "Increases the health bonus from your Commanders by " + legacyGame.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));
        this.upgrades.push(new Upgrade("Battle Morale III", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 150, "Increases the health bonus from your Commanders by " + legacyGame.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));
        this.upgrades.push(new Upgrade("Battle Morale IV", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 200, "Increases the health bonus from your Commanders by " + legacyGame.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));

        // Mage Ability Upgrades
        this.upgrades.push(new Upgrade("Fire Mastery", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 50, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
        this.upgrades.push(new Upgrade("Fire Mastery II", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 100, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
        this.upgrades.push(new Upgrade("Fire Mastery III", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 150, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
        this.upgrades.push(new Upgrade("Fire Mastery IV", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 200, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));

        // Assassin Ability Upgrades
        this.upgrades.push(new Upgrade("Shadow Mastery", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 50, "Increases the evasion bonus from your assassins by " + legacyGame.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
        this.upgrades.push(new Upgrade("Shadow Mastery II", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 100, "Increases the evasion bonus from your assassins by " + legacyGame.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
        this.upgrades.push(new Upgrade("Shadow Mastery III", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 150, "Increases the evasion bonus from your assassins by " + legacyGame.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
        this.upgrades.push(new Upgrade("Shadow Mastery IV", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 200, "Increases the evasion bonus from your assassins by " + legacyGame.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));

        // Warlock Ability Upgrades
        this.upgrades.push(new Upgrade("Corruption", Math.floor((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 50, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
        this.upgrades.push(new Upgrade("Corruption II", Math.floor((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 100, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
        this.upgrades.push(new Upgrade("Corruption III", Math.floor((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 150, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
        this.upgrades.push(new Upgrade("Corruption IV", Math.floor((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 200, "Increases the crit damage bonus from Warlocks by 2.5%.", 40, 0));

        // Attack Upgrades
        this.upgrades.push(new Upgrade("Power Strike", legacyGame.monsterCreator.calculateMonsterGoldWorth(50, MonsterRarity.COMMON) * 400, UpgradeType.ATTACK, UpgradeRequirementType.LEVEL, 50, "Upgrades your attack to Power Strike", 0, 80));
        this.upgrades.push(new Upgrade("Double Strike", legacyGame.monsterCreator.calculateMonsterGoldWorth(100, MonsterRarity.COMMON) * 400, UpgradeType.ATTACK, UpgradeRequirementType.LEVEL, 100, "Upgrades your attack to Double Strike", 200, 80));
    }

    this.update = function update() {
        var currentUpgrade;
        var available = false;
        // Go through every upgrade
        for (var x = 0; x < this.upgrades.length; x++) {
            currentUpgrade = this.upgrades[x];
            // Check to see if this upgrade is already available
            if (!currentUpgrade.available && !currentUpgrade.purchased) {
                // If it isn't then see if it can be now
                available = false;

                // Find the matching requirement type, then see if it has been met
                switch (currentUpgrade.requirementType) {
                    case UpgradeRequirementType.FOOTMAN: if (legacyGame.mercenaryManager.footmenOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.CLERIC: if (legacyGame.mercenaryManager.clericsOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.COMMANDER: if (legacyGame.mercenaryManager.commandersOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.MAGE: if (legacyGame.mercenaryManager.magesOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.ASSASSIN: if (legacyGame.mercenaryManager.assassinsOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.WARLOCK: if (legacyGame.mercenaryManager.warlocksOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.ITEMS_LOOTED: if (legacyGame.stats.itemsLooted >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.LEVEL: if (legacyGame.player.level >= currentUpgrade.requirementAmount) { available = true; } break;
                }
            }

            // If the upgrade is now available, then add it to the interface
            if (available) {
                legacyGame.displayAlert("New upgrade available!");
                // Set the upgrade to available
                currentUpgrade.available = true;

                // Make the Upgrades Button glow to tell the player a new upgrade is available
                this.glowUpgradesButton();

                break;
            }
        }
    }

    this.purchaseUpgrade = function purchaseUpgrade(id) {
        // If the player can afford the upgrade
        if (legacyGame.player.gold >= this.upgrades[id].cost) {
            // Purchase the upgrade
            var upgrade = this.upgrades[id];
            legacyGame.player.gold -= upgrade.cost;
            upgrade.purchased = true;
            upgrade.available = false;

            // Apply the bonus
            switch (upgrade.type) {
                case UpgradeType.GPS:
                    switch (upgrade.requirementType) {
                        case UpgradeRequirementType.FOOTMAN: this.footmanUpgradesPurchased++; break;
                        case UpgradeRequirementType.CLERIC: this.clericUpgradesPurchased++; break;
                        case UpgradeRequirementType.COMMANDER: this.commanderUpgradesPurchased++; break;
                        case UpgradeRequirementType.MAGE: this.mageUpgradesPurchased++; break;
                        case UpgradeRequirementType.ASSASSIN: this.assassinUpgradesPurchased++; break;
                        case UpgradeRequirementType.WARLOCK: this.warlockUpgradesPurchased++; break;
                    }
                    break;
                case UpgradeType.SPECIAL:
                    switch (upgrade.requirementType) {
                        case UpgradeRequirementType.FOOTMAN: break;
                        case UpgradeRequirementType.CLERIC: this.clericSpecialUpgradesPurchased++; break;
                        case UpgradeRequirementType.COMMANDER: this.commanderSpecialUpgradesPurchased++; break;
                        case UpgradeRequirementType.MAGE: this.mageSpecialUpgradesPurchased++; break;
                        case UpgradeRequirementType.ASSASSIN: this.assassinSpecialUpgradesPurchased++; break;
                        case UpgradeRequirementType.WARLOCK: this.warlockSpecialUpgradesPurchased++; break;
                    }
                    break;
                case UpgradeType.ATTACK:
                    switch (upgrade.name) {
                        case "Power Strike": if (!this.upgrades[56].purchased) { legacyGame.player.changeAttack(AttackType.POWER_STRIKE); } break;
                        case "Double Strike": legacyGame.player.changeAttack(AttackType.DOUBLE_STRIKE); break;
                    }
            }

            // Hide the tooltip
            $("#otherTooltip").hide();
        }
    }

    this.stopGlowingUpgradesButton = function stopGlowingUpgradesButton() {
        this.upgradesButtonGlowing = false;
        $("#upgradesWindowButtonGlow").stop(true);
        $("#upgradesWindowButtonGlow").css('opacity', 0);
        $("#upgradesWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 78px 0');
    }
    this.glowUpgradesButton = function glowUpgradesButton() {
        this.upgradesButtonGlowing = true;
        $("#upgradesWindowButtonGlow").animate({ opacity:'+=0.5' }, 400);
        $("#upgradesWindowButtonGlow").animate({ opacity:'-=0.5' }, 400, function() { glowUpgradesButton(); });
    }

    this.save = function save() {
        localStorage.upgradesSaved = true;

        localStorage.footmanUpgradesPurchased = this.footmanUpgradesPurchased;
        localStorage.clericUpgradesPurchased = this.clericUpgradesPurchased;
        localStorage.commanderUpgradesPurchased = this.commanderUpgradesPurchased;
        localStorage.mageUpgradesPurchased = this.mageUpgradesPurchased;
        localStorage.assassinUpgradesPurchased = this.assassinUpgradesPurchased;
        localStorage.warlockUpgradesPurchased = this.warlockUpgradesPurchased;

        var upgradesPurchasedArray = new Array();
        var upgradesAvailableArray = new Array();

        for (var x = 0; x < this.upgrades.length; x++) {
            upgradesPurchasedArray.push(this.upgrades[x].purchased);
            upgradesAvailableArray.push(this.upgrades[x].available);
        }

        localStorage.upgradesPurchasedArray = JSON.stringify(upgradesPurchasedArray);
        localStorage.upgradesAvailableArray = JSON.stringify(upgradesAvailableArray);

        localStorage.clericSpecialUpgradesPurchased = this.clericSpecialUpgradesPurchased;
        localStorage.commanderSpecialUpgradesPurchased = this.commanderSpecialUpgradesPurchased;
        localStorage.mageSpecialUpgradesPurchased = this.mageSpecialUpgradesPurchased;
        localStorage.assassinSpecialUpgradesPurchased = this.assassinSpecialUpgradesPurchased;
        localStorage.warlockSpecialUpgradesPurchased = this.warlockSpecialUpgradesPurchased;
    }

    this.load = function load() {
        if (localStorage.upgradesSaved != null) {
            this.footmanUpgradesPurchased = parseInt(localStorage.footmanUpgradesPurchased);
            this.clericUpgradesPurchased = parseInt(localStorage.clericUpgradesPurchased);
            this.commanderUpgradesPurchased = parseInt(localStorage.commanderUpgradesPurchased);
            this.mageUpgradesPurchased = parseInt(localStorage.mageUpgradesPurchased);
            if (localStorage.version == null) {
                this.assassinUpgradesPurchased = parseInt(localStorage.thiefUpgradesPurchased);
            }
            else {
                this.assassinUpgradesPurchased = parseInt(localStorage.assassinUpgradesPurchased);
            }
            this.warlockUpgradesPurchased = parseInt(localStorage.warlockUpgradesPurchased);

            var upgradesPurchasedArray = JSON.parse(localStorage.upgradesPurchasedArray);
            var upgradesAvailableArray = JSON.parse(localStorage.upgradesAvailableArray);

            if (localStorage.clericSpecialUpgradesPurchased != null) { this.clericSpecialUpgradesPurchased = localStorage.clericSpecialUpgradesPurchased; }
            if (localStorage.commanderSpecialUpgradesPurchased != null) { this.commanderSpecialUpgradesPurchased = localStorage.commanderSpecialUpgradesPurchased; }
            if (localStorage.mageSpecialUpgradesPurchased != null) { this.mageSpecialUpgradesPurchased = localStorage.mageSpecialUpgradesPurchased; }
            if (localStorage.assassinSpecialUpgradesPurchased != null) { this.assassinSpecialUpgradesPurchased = localStorage.assassinSpecialUpgradesPurchased; }
            else if (localStorage.thiefSpecialUpgradesPurchased != null) { this.assassinSpecialUpgradesPurchased = localStorage.thiefSpecialUpgradesPurchased; }
            if (localStorage.warlockSpecialUpgradesPurchased != null) { this.warlockSpecialUpgradesPurchased = localStorage.warlockSpecialUpgradesPurchased; }

            for (var x = 0; x < upgradesPurchasedArray.length; x++) {
                if(this.upgrades[x] === undefined) {
                    continue;
                }

                if (upgradesPurchasedArray[x]) {
                    this.upgradesPurchased++;
                    this.upgrades[x].purchased = upgradesPurchasedArray[x];
                }
                else if (upgradesAvailableArray[x]) {
                    this.upgrades[x].available = upgradesAvailableArray[x];
                }
            }
        }
    }
}