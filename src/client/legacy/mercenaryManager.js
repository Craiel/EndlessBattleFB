function mercenaryManager() {
    // The interval at which mercenaries give gold, in miliseconds
    var gpsUpdateDelay = 100;
    var gpsUpdateTime = 0;

    // The base Gps values for each mercenary, these are static
    this.baseFootmanGps = 0.1;
    this.baseClericGps = 0.94;
    this.baseCommanderGps = 8.8;
    this.baseMageGps = 83;
    this.baseAssassinGps = 780;
    this.baseWarlockGps = 7339;

    // The amount of gps mercenaries will give without any buffs
    this.footmanGps = this.baseFootmanGps;
    this.clericGps = this.baseClericGps;
    this.commanderGps = this.baseCommanderGps;
    this.mageGps = this.baseMageGps;
    this.assassinGps = this.baseAssassinGps;
    this.warlockGps = this.baseWarlockGps;

    // Base prices for each mercenary
    this.baseFootmanPrice = 10;
    this.baseClericPrice = 200;
    this.baseCommanderPrice = 4000;
    this.baseMagePrice = 80000;
    this.baseAssassinPrice = 1600000;
    this.baseWarlockPrice = 32000000;

    // Current prices of mercenaries and how many of each the player owns
    this.footmanPrice = this.baseFootmanPrice;
    this.footmenOwned = 0;
    this.clericPrice = this.baseClericPrice;
    this.clericsOwned = 0;
    this.commanderPrice = this.baseCommanderPrice;
    this.commandersOwned = 0;
    this.magePrice = this.baseMagePrice;
    this.magesOwned = 0;
    this.assassinPrice = this.baseAssassinPrice;
    this.assassinsOwned = 0;
    this.warlockPrice = this.baseWarlockPrice;
    this.warlocksOwned = 0;

    // Gps reduction when dead
    this.deathGpsReductionAmount = 50;
    this.deathGpsReductionDuration = 60;
    this.gpsReductionTimeRemaining = 0;
    this.gpsReduction = 0;

    // All the mercenaries the player owns
    this.mercenaries = new Array();

    // Add a new mercenary of a specified type for the player
    this.addMercenary = function addMercenary(type) {
        switch (type) {
            case MercenaryType.FOOTMAN: this.mercenaries.push(new mercenary(MercenaryType.FOOTMAN)); break;
            case MercenaryType.CLERIC: this.mercenaries.push(new mercenary(MercenaryType.CLERIC)); break;
            case MercenaryType.COMMANDER: this.mercenaries.push(new mercenary(MercenaryType.COMMANDER)); break;
            case MercenaryType.MAGE: this.mercenaries.push(new mercenary(MercenaryType.MAGE)); break;
            case MercenaryType.ASSASSIN: this.mercenaries.push(new mercenary(MercenaryType.ASSASSIN)); break;
            case MercenaryType.WARLOCK: this.mercenaries.push(new mercenary(MercenaryType.WARLOCK)); break;
        }
    }

    // Get the amount that a mercenary's special effect gives
    this.getClericHp5PercentBonus = function getClericHp5PercentBonus() {
        return this.baseClericHp5PercentBonus + (this.clericHp5PercentUpgradeValue * legacyGame.upgradeManager.clericSpecialUpgradesPurchased);
    }

    this.getMageDamagePercentBonus = function getMageDamagePercentBonus() {
        return this.baseMageDamagePercentBonus + (this.mageDamagePercentUpgradeValue * legacyGame.upgradeManager.mageSpecialUpgradesPurchased);
    }
    this.getAssassinEvasionPercentBonus = function getAssassinEvasionPercentBonus() {
        return this.baseAssassinEvasionPercentBonus + (this.assassinEvasionPercentUpgradeValue * legacyGame.upgradeManager.assassinSpecialUpgradesPurchased);
    }
    this.getWarlockCritDamageBonus = function getWarlockCritDamageBonus() {
        return this.baseWarlockCritDamageBonus + (this.warlockCritDamageUpgradeValue * legacyGame.upgradeManager.warlockSpecialUpgradesPurchased);
    }

    this.getMercenaryBaseGps = function getMercenaryBaseGps(type) {
        switch (type) {
            case MercenaryType.FOOTMAN:
                return (this.baseFootmanGps * Math.pow(2, legacyGame.upgradeManager.footmanUpgradesPurchased));
                break;
            case MercenaryType.CLERIC:
                return (this.baseClericGps * Math.pow(2, legacyGame.upgradeManager.clericUpgradesPurchased));
                break;
            case MercenaryType.COMMANDER:
                return (this.baseCommanderGps * Math.pow(2, legacyGame.upgradeManager.commanderUpgradesPurchased));
                break;
            case MercenaryType.MAGE:
                return (this.baseMageGps * Math.pow(2, legacyGame.upgradeManager.mageUpgradesPurchased));
                break;
            case MercenaryType.ASSASSIN:
                return (this.baseAssassinGps * Math.pow(2, legacyGame.upgradeManager.assassinUpgradesPurchased));
                break;
            case MercenaryType.WARLOCK:
                return (this.baseWarlockGps * Math.pow(2, legacyGame.upgradeManager.warlockUpgradesPurchased));
                break;
        }
    }

    // Get the Gps
    this.getGps = function getGps() {
        var gps = 0;
        var gold = 0;

        // Go through all the mercenaries and add the gold they would generate to the gps
        for (var x = 0; x < this.mercenaries.length; x++) {
            // Reset the values
            gold = 0;

            // Get the gold gained from each mercenary
            gold += game.systems.getMercenariesGps(this.mercenaries[x].type);

            // Add this mercenary's gold to the gps
            gps += gold;
        }

        return gps.formatMoney(2);
    }

    this.update = function update(ms) {
        // Update the gps reduction if there is a reduction active
        if (this.gpsReduction > 0) {
            this.gpsReductionTimeRemaining -= ms;

            if (this.gpsReductionTimeRemaining <= 0) {
                this.gpsReduction = 0;
            }
        }

        // Give the player gold from each mercenary if enough time has passed
        gpsUpdateTime += ms;
        if (gpsUpdateTime >= gpsUpdateDelay) {
            var gainTimes = 0;
            while (gpsUpdateTime >= gpsUpdateDelay) {
                gpsUpdateTime -= gpsUpdateDelay;
                gainTimes++;
            }

            for (var x = 0; x < this.mercenaries.length; x++) {
                var amount = ((game.systems.getMercenariesGps(this.mercenaries[x].type) / 1000) * gpsUpdateDelay) * gainTimes;
                game.gainGold(amount, false, true);
                legacyGame.stats.goldFromMercenaries += legacyGame.player.lastGoldGained;
            }
        }
    }

    // Purchasing a new Footman
    this.purchaseMercenary = function purchaseMercenary(type) {
        var price;
        switch (type) {
            case MercenaryType.FOOTMAN: price = this.footmanPrice; break;
            case MercenaryType.CLERIC: price = this.clericPrice; break;
            case MercenaryType.COMMANDER: price = this.commanderPrice; break;
            case MercenaryType.MAGE: price = this.magePrice; break;
            case MercenaryType.ASSASSIN: price = this.assassinPrice; break;
            case MercenaryType.WARLOCK: price = this.warlockPrice; break;
        }
        // Can the player afford it?
        if (legacyGame.player.gold >= price) {
            // Remove the gold from the player
            legacyGame.player.gold -= price;

            // Add the mercenary
            this.addMercenary(type);
            switch (type) {
                case MercenaryType.FOOTMAN: this.footmenOwned++; break;
                case MercenaryType.CLERIC: this.clericsOwned++; break;
                case MercenaryType.COMMANDER: this.commandersOwned++; break;
                case MercenaryType.MAGE: this.magesOwned++; break;
                case MercenaryType.ASSASSIN: this.assassinsOwned++; break;
                case MercenaryType.WARLOCK: this.warlocksOwned++; break;
            }

            // Increase the price of the mercenary
            switch (type) {
                case MercenaryType.FOOTMAN: this.footmanPrice = Math.floor(this.baseFootmanPrice * Math.pow(1.15, this.footmenOwned)); break;
                case MercenaryType.CLERIC: this.clericPrice = Math.floor(this.baseClericPrice * Math.pow(1.15, this.clericsOwned)); break;
                case MercenaryType.COMMANDER: this.commanderPrice = Math.floor(this.baseCommanderPrice * Math.pow(1.15, this.commandersOwned)); break;
                case MercenaryType.MAGE: this.magePrice = Math.floor(this.baseMagePrice * Math.pow(1.15, this.magesOwned)); break;
                case MercenaryType.ASSASSIN: this.assassinPrice = Math.floor(this.baseAssassinPrice * Math.pow(1.15, this.assassinsOwned)); break;
                case MercenaryType.WARLOCK: this.warlockPrice = Math.floor(this.baseWarlockPrice * Math.pow(1.15, this.warlocksOwned)); break;
            }
        }
    }

    // Add a Gps reduction of a specified amount and duration
    this.addGpsReduction = function addGpsReduction(percentage, duration) {
        this.gpsReduction = percentage;
        this.gpsReductionTimeRemaining = (duration * 1000);
    }

    this.save = function save() {
        localStorage.mercenaryManagerSaved = true;

        localStorage.footmenOwned = this.footmenOwned;
        localStorage.clericsOwned = this.clericsOwned;
        localStorage.commandersOwned = this.commandersOwned;
        localStorage.magesOwned = this.magesOwned;
        localStorage.assassinsOwned = this.assassinsOwned;
        localStorage.warlocksOwned = this.warlocksOwned;

        localStorage.mercenaries = JSON.stringify(this.mercenaries);
    }

    this.load = function load() {
        if (localStorage.mercenaryManagerSaved != null) {
            this.footmenOwned = parseInt(localStorage.footmenOwned);
            this.clericsOwned = parseInt(localStorage.clericsOwned);
            this.commandersOwned = parseInt(localStorage.commandersOwned);
            this.magesOwned = parseInt(localStorage.magesOwned);
            if (localStorage.version == null) {
                this.assassinsOwned = parseInt(localStorage.thiefsOwned);
            }
            else { this.assassinsOwned = parseInt(localStorage.assassinsOwned); }
            this.warlocksOwned = parseInt(localStorage.warlocksOwned);

            this.footmanPrice = Math.floor(this.baseFootmanPrice * Math.pow(1.15, this.footmenOwned));
            this.clericPrice = Math.floor(this.baseClericPrice * Math.pow(1.15, this.clericsOwned));
            this.commanderPrice = Math.floor(this.baseCommanderPrice * Math.pow(1.15, this.commandersOwned));
            this.magePrice = Math.floor(this.baseMagePrice * Math.pow(1.15, this.magesOwned));
            this.assassinPrice = Math.floor(this.baseAssassinPrice * Math.pow(1.15, this.assassinsOwned));
            this.warlockPrice = Math.floor(this.baseWarlockPrice * Math.pow(1.15, this.warlocksOwned));

            this.mercenaries = JSON.parse(localStorage.mercenaries);
            for (var x = 0; x < this.mercenaries.length; x++) {
                if (this.mercenaries[x].type == MercenaryType.THIEF) {
                    this.mercenaries[x].type = MercenaryType.ASSASSIN;
                }
            }
        }
    }
}