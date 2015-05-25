function Stats() {
    this.getGold = function getGold() { return legacyGame.player.gold; }
    this.goldEarned = 0;
    this.startDate = new Date();
    this.getMercenariesOwned = function getMercenariesOwned() { return legacyGame.mercenaryManager.mercenaries.length; }
    this.getGps = function getGps() { return legacyGame.mercenaryManager.getGps(); }
    this.goldFromMonsters = 0;
    this.goldFromMercenaries = 0;
    this.goldFromQuests = 0;
    this.getExperience = function getExperience() { return legacyGame.player.experience; }
    this.experienceEarned = 0;
    this.experienceFromMonsters = 0;
    this.experienceFromQuests = 0;
    this.itemsLooted = 0;
    this.itemsSold = 0;
    this.goldFromItems = 0;
    this.questsCompleted = 0;
    this.monstersKilled = 0;
    this.damageDealt = 0;
    this.damageTaken = 0;

    this.getUpgradesUnlocked = function getUpgradesUnlocked() {
        var unlocked = 0;
        for(var i = 0; i < legacyGame.upgradeManager.upgrades.length; i++) {
            if(legacyGame.upgradeManager.upgrades[i].purchased === true) {
                unlocked++;
            }
        }

        return unlocked;
    }

    this.update = function update() {
        // Update the stats window
        document.getElementById("statsWindowPowerShardsValue").innerHTML = legacyGame.player.powerShards.formatMoney(2);
        document.getElementById("statsWindowGoldValue").innerHTML = this.getGold().formatMoney(2);
        document.getElementById("statsWindowGoldEarnedValue").innerHTML = this.goldEarned.formatMoney(2);
        document.getElementById("statsWindowStartDateValue").innerHTML = this.startDate.toDateString() + " " + this.startDate.toLocaleTimeString();
        document.getElementById("statsWindowMercenariesOwnedValue").innerHTML = this.getMercenariesOwned().formatMoney(0);
        document.getElementById("statsWindowGpsValue").innerHTML = this.getGps();
        document.getElementById("statsWindowGoldFromMonstersValue").innerHTML = this.goldFromMonsters.formatMoney(2);
        document.getElementById("statsWindowGoldFromMercenariesValue").innerHTML = this.goldFromMercenaries.formatMoney(2);
        document.getElementById("statsWindowGoldFromQuestsValue").innerHTML = this.goldFromQuests.formatMoney(0);
        document.getElementById("statsWindowUpgradesUnlockedValue").innerHTML = this.getUpgradesUnlocked().formatMoney(0);
        document.getElementById("statsWindowExperienceValue").innerHTML = this.getExperience().formatMoney(2);
        document.getElementById("statsWindowExperienceEarnedValue").innerHTML = this.experienceEarned.formatMoney(2);
        document.getElementById("statsWindowExperienceFromMonstersValue").innerHTML = this.experienceFromMonsters.formatMoney(2);
        document.getElementById("statsWindowExperienceFromQuestsValue").innerHTML = this.experienceFromQuests.formatMoney(0);
        document.getElementById("statsWindowItemsLootedValue").innerHTML = this.itemsLooted.formatMoney(0);
        document.getElementById("statsWindowItemsSoldValue").innerHTML = this.itemsSold.formatMoney(0);
        document.getElementById("statsWindowGoldFromItemsValue").innerHTML = this.goldFromItems.formatMoney(0);
        document.getElementById("statsWindowQuestsCompletedValue").innerHTML = this.questsCompleted.formatMoney(0);
        document.getElementById("statsWindowMonstersKilledValue").innerHTML = this.monstersKilled.formatMoney(0);
        document.getElementById("statsWindowDamageDealtValue").innerHTML = (Math.floor(this.damageDealt)).formatMoney(0);
        document.getElementById("statsWindowDamageTakenValue").innerHTML = (Math.floor(this.damageTaken)).formatMoney(0);
    }

    this.save = function save() {
        localStorage.StatsSaved = true;
        localStorage.statsGoldEarned = this.goldEarned;
        localStorage.statsStartDate = this.startDate;
        localStorage.statsGoldFromMonsters = this.goldFromMonsters;
        localStorage.statsGoldFromMercenaries = this.goldFromMercenaries;
        localStorage.statsGoldFromQuests = this.goldFromQuests;
        localStorage.statsExperienceEarned = this.experienceEarned;
        localStorage.statsExperienceFromMonsters = this.experienceFromMonsters;
        localStorage.statsExperienceFromQuests = this.experienceFromQuests;
        localStorage.statsItemsLooted = this.itemsLooted;
        localStorage.statsItemsSold = this.itemsSold;
        localStorage.statsGoldFromItems = this.goldFromItems;
        localStorage.statsQuestsCompleted = this.questsCompleted;
        localStorage.statsMonstersKilled = this.monstersKilled;
        localStorage.statsDamageDealt = this.damageDealt;
        localStorage.statsDamageTaken = this.damageTaken;
    }

    this.load = function load() {
        if (localStorage.StatsSaved != null) {
            this.goldEarned = parseFloat(localStorage.statsGoldEarned);
            this.startDate = new Date(localStorage.statsStartDate);
            this.goldFromMonsters = parseFloat(localStorage.statsGoldFromMonsters);
            this.goldFromMercenaries = parseFloat(localStorage.statsGoldFromMercenaries);
            this.goldFromQuests = parseInt(localStorage.statsGoldFromQuests);
            this.experienceEarned = parseFloat(localStorage.statsExperienceEarned);
            this.experienceFromMonsters = parseFloat(localStorage.statsExperienceFromMonsters);
            this.experienceFromQuests = parseInt(localStorage.statsExperienceFromQuests);
            this.itemsLooted = parseInt(localStorage.statsItemsLooted);
            this.itemsSold = parseInt(localStorage.statsItemsSold);
            this.goldFromItems = parseInt(localStorage.statsGoldFromItems);
            this.questsCompleted = parseInt(localStorage.statsQuestsCompleted);
            this.monstersKilled = parseInt(localStorage.statsMonstersKilled);
            this.damageDealt = parseFloat(localStorage.statsDamageDealt);
            this.damageTaken = parseFloat(localStorage.statsDamageTaken);
        }
    }
}