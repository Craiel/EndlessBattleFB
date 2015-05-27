function StatUpgradesManager() {
    // The current possible stat upgrades
    this.upgrades = new Array();

    // Add 3 new stat upgrades for the player to choose from
    this.addNewUpgrades = function addNewUpgrades(upgrade1Type, upgrade1Amount, upgrade2Type, upgrade2Amount, upgrade3Type, upgrade3Amount) {
        var newUpgrades = new Array();
        newUpgrades.push(new StatUpgrade(upgrade1Type, upgrade1Amount));
        newUpgrades.push(new StatUpgrade(upgrade2Type, upgrade2Amount));
        newUpgrades.push(new StatUpgrade(upgrade3Type, upgrade3Amount));
        this.upgrades.push(newUpgrades);
    }

    // Add 3 random stat upgrades
    this.addRandomUpgrades = function addRandomUpgrades(level) {
        var upgradeTypes = new Array();
        var upgradeIds = new Array();
        var upgradeAmounts = new Array();

        // Assign 3 random stat upgrade types
        var idsRemaining = 3;
        var newId;
        while (idsRemaining >= 0) {
            // Create a random Id
            newId = Math.floor(Math.random() * (StatUpgradeType.amount + 1));

            // Check that the new Id hasn't already been generated
            if (upgradeIds.indexOf(newId) == -1) {
                // If it hasn't, add it to the array and reduce the amount of Ids we need to create
                upgradeIds.push(newId);
                idsRemaining--;
            }
        }

        var value = legacyGame.statGenerator.getRandomPrimaryStatBonus(level);
        upgradeTypes.push(StatUpgradeType.STRENGTH);
        upgradeAmounts.push(value);

        upgradeTypes.push(StatUpgradeType.AGILITY);
        upgradeAmounts.push(value);

        upgradeTypes.push(StatUpgradeType.STAMINA);
        upgradeAmounts.push(value);

        // Asign the types and the amounts for all the Ids
        /*for (var x = 0; x < upgradeIds.length; x++) {
            switch (upgradeIds[x]) {
                case 0:
                    upgradeTypes.push(StatUpgradeType.DAMAGE);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomDamageBonus(level));
                    break;
                case 1:
                    upgradeTypes.push(StatUpgradeType.STRENGTH);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomStrengthBonus(level));
                    break;
                case 2:
                    upgradeTypes.push(StatUpgradeType.AGILITY);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomAgilityBonus(level));
                    break;
                case 3:
                    upgradeTypes.push(StatUpgradeType.STAMINA);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomStaminaBonus(level));
                    break;
                case 4:
                    upgradeTypes.push(StatUpgradeType.ARMOUR);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomArmourBonus(level));
                    break;
                case 5:
                    upgradeTypes.push(StatUpgradeType.HP5);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomHp5Bonus(level));
                    break;
                case 6:
                    upgradeTypes.push(StatUpgradeType.CRIT_DAMAGE);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomCritDamageBonus(level));
                    break;
                case 7:
                    upgradeTypes.push(StatUpgradeType.ITEM_RARITY);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomItemRarityBonus(level));
                    break;
                case 8:
                    upgradeTypes.push(StatUpgradeType.GOLD_GAIN);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomGoldGainBonus(level));
                    break;
                case 9:
                    upgradeTypes.push(StatUpgradeType.EXPERIENCE_GAIN);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomExperienceGainBonus(level));
                    break;
            }
        }*/

        // Add this new set of upgrades
        this.addNewUpgrades(upgradeTypes[0], upgradeAmounts[0], upgradeTypes[1], upgradeAmounts[1], upgradeTypes[2], upgradeAmounts[2]);
    }

    this.save = function save() {
        localStorage.statUpgradesSaved = true;
        localStorage.statUpgrades = JSON.stringify(this.upgrades);
    }

    this.load = function load() {
        if (localStorage.statUpgradesSaved != null) {
            this.upgrades = JSON.parse(localStorage.statUpgrades);
        }
    }
}
