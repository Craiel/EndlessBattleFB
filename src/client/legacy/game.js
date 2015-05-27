function Game() {
    this.version = 0.2;
    this.loading = false;
    this.loadingTextInterval = 0;
    this.loadInterval = 0;

    this.oldDate = new Date();

    // Player
    this.player = new Player();
    this.inventory = new Inventory();
    this.equipment = new Equipment();
    this.statGenerator = new StatGenerator();
    this.nameGenerator = new NameGenerator();
    this.statUpgradesManager = new StatUpgradesManager();

    // Other
    this.tooltipManager = new TooltipManager();
    this.questsManager = new QuestsManager();
    this.eventManager = new EventManager();
    this.stats = new Stats();
    this.options = new Options();

    // Combat
    this.inBattle = false;
    this.battleLevel = 1;
    this.battleDepth = 1;

    // Mercenaries
    this.mercenaryManager = new mercenaryManager();

    // Upgrades
    this.upgradeManager = new UpgradeManager();

    // Particles
    this.particleManager = new ParticleManager();

    // Monsters
    this.monsterCreator = new MonsterCreator();
    this.monster = this.monsterCreator.createRandomMonster(
        this.battleLevel,
        this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));
    this.displayMonsterHealth = false;

    // Items
    this.itemCreator = new ItemCreator();

    // Saving/Loading
    this.saveDelay = 10000;
    this.saveTimeRemaining = this.saveDelay;

    this.initialize = function initialize() {
        this.beginLoading();
        this.mercenaryManager.initialize();
        this.upgradeManager.initialize();
        this.particleManager.initialize();

        this.load();

        document.getElementById("version").innerHTML = "Version " + this.version;
    }

    this.getPowerShardBonus = function() {
        return (this.player.powerShards / 100) + 1;
    };

    this.beginLoading = function beginLoading() {
        this.loading = true;
        this.loadingTextInterval = setInterval(function () {
            this.loadingInterval++;
            if (this.loadingInterval > 2) {
                this.loadingInterval = 0;
                $("#loadingText").html('Loading.');
            }
            else {
                $("#loadingText").append('.');
            }
        }, 500);
    }

    this.finishLoading = function finishLoading() {
        this.loading = false;
        clearInterval(this.loadingTextInterval);
        $("#loadingArea").hide();
    }

    this.allowBattle = function allowBattle() {
        enterBattleButtonReset();
    }

    this.disallowBattle = function disallowBattle() {
        this.leaveBattle();
        $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 25px');
    }

    this.enterBattle = function enterBattle() {
        this.inBattle = true;
        // Create a new monster
        this.monster = this.monsterCreator.createRandomMonster(
            this.battleLevel,
            this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));

        $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 50px');
        $("#leaveBattleButton").show();
        $("#leaveBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
        $("#monsterHealthBarArea").show();

        // Hide the battle level buttons


        // Show the action buttons
        $("#attackButton").show();
    }

    this.leaveBattle = function leaveBattle() {
        // Leave the battle and update the interface
        $("#leaveBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 50px');
        this.inBattle = false;
        $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
        $("#monsterHealthBarArea").hide();
        $("#leaveBattleButton").hide();

        // Reset the battle depth
        this.resetBattle();

        // Hide the attack button and debuffs
        $("#attackButton").hide();
        $("#monsterBleedingIcon").hide();
        $("#monsterBurningIcon").hide();
        $("#monsterChilledIcon").hide();
    }

    this.attack = function attack() {
        // Update the player and monster
        this.player.updateDebuffs();
        this.monster.updateDebuffs();

        // Attack the monster if the player can attack
        var monstersDamageTaken = 0;
        if (legacyGame.player.canAttack) {
            // Calculate how many attacks the player will do
            var attackAmount = 1;
            var successfulAttacks = 0;
            if (this.player.attackType == AttackType.DOUBLE_STRIKE) { attackAmount++; }

            for (var x = 0; x < attackAmount; x++) {
                // Calculate the damage
                var playerMinDamage = this.player.getMinDamage();
                var playerMaxDamage = this.player.getMaxDamage();
                var playerDamage = playerMinDamage + (Math.random() * (playerMaxDamage - playerMinDamage));

                // If the player is using power strike, multiply the damage
                if (this.player.attackType == AttackType.POWER_STRIKE) {
                    playerDamage *= 1.5;
                }

                // See if the player will crit
                var criticalHappened = false;
                if (this.player.getCritChance() >= (Math.random() * 100)) {
                    playerDamage *= (this.player.getCritDamage() / 100);
                    criticalHappened = true;
                }

                // If the player has any crushing blows effects then deal the damage from those effects
                var crushingBlowsEffects = legacyGame.player.getEffectsOfType(EffectType.CRUSHING_BLOWS);
                var crushingBlowsDamage = 0;
                if (crushingBlowsEffects.length > 0) {
                    for (var y = 0; y < crushingBlowsEffects.length; y++) {
                        crushingBlowsDamage += crushingBlowsEffects[y].value;
                    }
                    if (crushingBlowsDamage > 0) {
                        game.monsterTakeDamage((crushingBlowsDamage / 100) * this.monster.health, false, false);
                    }
                }
                game.monsterTakeDamage(playerDamage, criticalHappened, true);
                this.player.useAbilities();
                successfulAttacks++;

                // If the player has any Swiftness effects, see if the player generates any extra attacks
                var swiftnessEffects = legacyGame.player.getEffectsOfType(EffectType.SWIFTNESS);
                for (var z = 0; z < swiftnessEffects.length; z++) {
                    // Try to generate an extra attack
                    if (Math.random() < swiftnessEffects[z].chance / 100) {
                        // Calculate the damage
                        playerMinDamage = this.player.getMinDamage();
                        playerMaxDamage = this.player.getMaxDamage();
                        playerDamage = playerMinDamage + (Math.random() * (playerMaxDamage - playerMinDamage));

                        // If the player is using power strike, multiply the damage
                        if (this.player.attackType == AttackType.POWER_STRIKE) {
                            playerDamage *= 1.5;
                        }

                        // See if the player will crit
                        criticalHappened = false;
                        if (this.player.getCritChance() >= (Math.random() * 100)) {
                            playerDamage *= (this.player.getCritDamage() / 100);
                            criticalHappened = true;
                        }

                        // If the player has any crushing blows effects then deal the damage from those effects
                        crushingBlowsEffects = legacyGame.player.getEffectsOfType(EffectType.CRUSHING_BLOWS);
                        crushingBlowsDamage = 0;
                        if (crushingBlowsEffects.length > 0) {
                            for (var y = 0; y < crushingBlowsEffects.length; y++) {
                                crushingBlowsDamage += crushingBlowsEffects[y].value;
                            }
                            if (crushingBlowsDamage > 0) {
                                game.monsterTakeDamage((crushingBlowsDamage / 100) * this.monster.health, false, false);
                            }
                        }
                        game.monsterTakeDamage(playerDamage, criticalHappened, true);
                        this.player.useAbilities();
                        successfulAttacks++;
                    }
                }
            }

            // Try to trigger on-hit effects for every attack
            var pillagingEffects = this.player.getEffectsOfType(EffectType.PILLAGING);
            var nourishmentEffects = this.player.getEffectsOfType(EffectType.NOURISHMENT);
            var berserkingEffects = this.player.getEffectsOfType(EffectType.BERSERKING);
            for (var x = 0; x < successfulAttacks; x++) {
                for (var y = 0; y < pillagingEffects.length; y++) {
                    if (Math.random() < pillagingEffects[y].chance / 100) {
                        game.gainGold(pillagingEffects[y].value, true);
                    }
                }
                for (var y = 0; y < nourishmentEffects.length; y++) {
                    if (Math.random() < nourishmentEffects[y].chance / 100) {
                        legacyGame.player.heal(nourishmentEffects[y].value);
                    }
                }
                for (var y = 0; y < berserkingEffects.length; y++) {
                    if (Math.random() < berserkingEffects[y].chance / 100) {
                        game.monsterTakeDamage(berserkingEffects[y].value, false, false);
                    }
                }
            }
        }

        // Have the monster attack if it can and did not die
        var playersDamageTaken = 0;
        if (this.monster.canAttack && this.monster.alive) {
            // See if the player will dodge the attack
            if (Math.random() >= (this.player.calculateEvasionChance() / 100)) {
                var monsterDamage = this.monster.damage;
                game.playerTakeDamage(monsterDamage);
                playersDamageTaken = monsterDamage;
            }
        }

        if (this.monster.alive == false) {
            // Add the kill to any quests that require it
            this.questsManager.updateKillCounts(this.monster.level);

            // Get the loot and experience from the monster and reward it to the player
            var loot = this.monster.getRandomLoot();
            game.gainGold(loot.gold, true);
            this.stats.goldFromMonsters += this.player.lastGoldGained;
            game.gainExperience(this.monster.experienceWorth, true);
            this.stats.experienceFromMonsters += this.player.lastExperienceGained;
            if (loot.item != null) {
                this.inventory.lootItem(loot.item);
            }

            // Create particles for the loot, experience and kill
            this.particleManager.createParticle(this.player.lastGoldGained.toFixed(2), ParticleType.GOLD);
            this.particleManager.createParticle(this.player.lastExperienceGained.toFixed(2), ParticleType.EXP_ORB);
            this.particleManager.createParticle(null, ParticleType.SKULL);

            // Create a new monster
            this.monster = this.monsterCreator.createRandomMonster(
                this.battleLevel,
                this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));

            // Hide the debuff icons for the monster
            $("#monsterBleedingIcon").hide();
            $("#monsterBurningIcon").hide();
            $("#monsterChilledIcon").hide();

            // Increase the depth of the battle
            this.battleDepth++;
        }
    }

    this.maxBattleLevelReached = function maxBattleLevelReached() {
        if (this.player.level == this.battleLevel) {
            return true;
        }
        else { return false; }
    }

    this.increaseBattleLevel = function increaseBattleLevel() {
        if (this.player.level > this.battleLevel) {
            this.battleLevel++;
            this.displayAlert("Battle Level " + legacyGame.battleLevel);
        }
    }

    this.decreaseBattleLevel = function decreaseBattleLevel() {
        if (this.battleLevel != 1) {
            this.battleLevel--;
            this.displayAlert("Battle Level " + legacyGame.battleLevel);
        }
    }

    this.resetBattle = function resetBattle() {
        this.battleDepth = 1;
    }

    this.displayAlert = function displayAlert(text) {
        $("#battleLevelText").stop(true);
        var battleLevelText = document.getElementById("battleLevelText");
        battleLevelText.style.opacity = '1';
        battleLevelText.style.top = '600px';
        battleLevelText.innerHTML = text;
        $("#battleLevelText").animate({ top:'-=50px', opacity:'0' }, 1000);
    }

    this.displaySkillUpWindow = function() {
        if(this.player.abilityPoints > 0) {
            $("#abilityUpgradesWindow").show();
        }
    }

    // Triggered when the Level Up button is clicked
    this.displayLevelUpWindow = function displayLevelUpWindow() {

        // Display the stat upgrade window or the ability upgrade window depending on the level
        // If the number is divisible by 5 then the player can choose an ability
        /*if ((this.player.skillPointsSpent + 2) % 5 == 0) {
            $("#abilityUpgradesWindow").show();
        }
        // Else the player can upgrade a stat
        else {*/
            // Set the upgrade names on the window's buttons
            var upgrades = this.statUpgradesManager.upgrades[0];
            if(upgrades === undefined && this.player.skillPoints > 0) {
                this.player.skillPoints--;
                return;
            }

            $("#statUpgradesWindow").show();

            switch (upgrades[0].type) {
                case StatUpgradeType.DAMAGE:            document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Damage"; break;
                case StatUpgradeType.STRENGTH:          document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Strength"; break;
                case StatUpgradeType.AGILITY:           document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Agility"; break;
                case StatUpgradeType.STAMINA:           document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Stamina"; break;
                case StatUpgradeType.ARMOUR:            document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Armour"; break;
                case StatUpgradeType.HP5:               document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Hp5"; break;
                case StatUpgradeType.CRIT_DAMAGE:       document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Crit Damage"; break;
                case StatUpgradeType.ITEM_RARITY:         document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Item Rarity"; break;
                case StatUpgradeType.GOLD_GAIN:         document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Gold Gain"; break;
                case StatUpgradeType.EXPERIENCE_GAIN:   document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Experience Gain"; break;
            }

            switch (upgrades[1].type) {
                case StatUpgradeType.DAMAGE:            document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Damage"; break;
                case StatUpgradeType.STRENGTH:          document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Strength"; break;
                case StatUpgradeType.AGILITY:           document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Agility"; break;
                case StatUpgradeType.STAMINA:           document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Stamina"; break;
                case StatUpgradeType.ARMOUR:            document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Armour"; break;
                case StatUpgradeType.HP5:               document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Hp5"; break;
                case StatUpgradeType.CRIT_DAMAGE:       document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Crit Damage"; break;
                case StatUpgradeType.ITEM_RARITY:         document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Item Rarity"; break;
                case StatUpgradeType.GOLD_GAIN:         document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Gold Gain"; break;
                case StatUpgradeType.EXPERIENCE_GAIN:   document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Experience Gain"; break;
            }

            switch (upgrades[2].type) {
                case StatUpgradeType.DAMAGE:            document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Damage"; break;
                case StatUpgradeType.STRENGTH:          document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Strength"; break;
                case StatUpgradeType.AGILITY:           document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Agility"; break;
                case StatUpgradeType.STAMINA:           document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Stamina"; break;
                case StatUpgradeType.ARMOUR:            document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Armour"; break;
                case StatUpgradeType.HP5:               document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Hp5"; break;
                case StatUpgradeType.CRIT_DAMAGE:       document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Crit Damage"; break;
                case StatUpgradeType.ITEM_RARITY:         document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Item Rarity"; break;
                case StatUpgradeType.GOLD_GAIN:         document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Gold Gain"; break;
                case StatUpgradeType.EXPERIENCE_GAIN:   document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Experience Gain"; break;
            }
        //}
    }

    this.calculatePowerShardReward = function calculatePowerShardReward() {
        var powerShardsTotal = Math.floor((Math.sqrt(1 + 8 * (this.stats.goldEarned / 1000000000000)) - 1) / 2);
        var powerShardsReward = powerShardsTotal - this.player.powerShards;
        if (powerShardsReward < 0) { powerShardsReward = 0; }
        return powerShardsReward;
    }

    this.save = function save() {
        if (typeof (Storage) !== "undefined") {
            localStorage.version = this.version;
            this.inventory.save();
            this.equipment.save();
            this.player.save();
            this.questsManager.save();
            this.mercenaryManager.save();
            this.upgradeManager.save();
            this.statUpgradesManager.save();
            this.stats.save();
            this.options.save();

            localStorage.battleLevel = this.battleLevel;
        }
    }

    this.load = function load() {
        if (typeof (Storage) !== "undefined") {
            this.inventory.load();
            this.equipment.load();
            this.player.load();
            this.questsManager.load();
            this.mercenaryManager.load();
            this.upgradeManager.load();
            this.statUpgradesManager.load();
            this.stats.load();
            this.options.load();


            if (localStorage.battleLevel != null) { this.battleLevel = parseInt(localStorage.battleLevel); }
            if (this.battleLevel > 1) {
                $("#battleLevelDownButton").css('background', 'url("includes/images/battleLevelButton.png") 0 0px');
            }
            if (this.maxBattleLevelReached()) {
                $("#battleLevelUpButton").css('background', 'url("includes/images/battleLevelButton.png") 0 25px');
            }

            this.monster = this.monsterCreator.createRandomMonster(
                this.battleLevel,
                this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));
        }
    }

    this.reset = function reset() {
        game.reset();

        localStorage.clear();
        // Player
        this.player = new Player();
        this.inventory = new Inventory();
        this.equipment = new Equipment();
        this.statGenerator = new StatGenerator();
        this.nameGenerator = new NameGenerator();
        this.statUpgradesManager = new StatUpgradesManager();

        // Other
        this.questsManager = new QuestsManager();
        this.eventManager = new EventManager();
        this.stats = new Stats();

        // Combat
        this.inBattle = false;
        this.battleLevel = 1;
        this.battleDepth = 1;

        // Mercenaries
        this.mercenaryManager = new mercenaryManager();

        // Upgrades
        this.upgradeManager = new UpgradeManager();

        // Particles
        this.particleManager = new ParticleManager();

        // Monsters
        this.monsterCreator = new MonsterCreator();
        this.monster = this.monsterCreator.createRandomMonster(
            this.battleLevel,
            this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));

        // Items
        this.itemCreator = new ItemCreator();

        this.initialize();

        $("#leaveBattleButton").hide();
        $("#monsterHealthBarArea").hide();
        $("#attackButton").hide();
        $("#powerStrikeButton").hide();

        $("#inventoryWindow").hide();
        $("#characterWindow").hide();
        $("#upgradesWindow").hide();
        $("#mercenariesWindow").hide();
        $("#questsWindow").hide();

        $("#resurrectionBarArea").hide();
        $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');

        $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 150px 0');

        // Reset the mercenary amounts and prices to default
        document.getElementById("footmanCost").innerHTML = this.mercenaryManager.footmanPrice.formatMoney(0);
        document.getElementById("footmenOwned").innerHTML = this.mercenaryManager.footmenOwned;
        document.getElementById("clericCost").innerHTML = this.mercenaryManager.clericPrice.formatMoney(0);
        document.getElementById("clericsOwned").innerHTML = this.mercenaryManager.clericsOwned;
        document.getElementById("commanderCost").innerHTML = this.mercenaryManager.commanderPrice.formatMoney(0);
        document.getElementById("commandersOwned").innerHTML = this.mercenaryManager.commandersOwned;
        document.getElementById("mageCost").innerHTML = this.mercenaryManager.magePrice.formatMoney(0);
        document.getElementById("magesOwned").innerHTML = this.mercenaryManager.magesOwned;
        document.getElementById("assassinCost").innerHTML = this.mercenaryManager.assassinPrice.formatMoney(0);
        document.getElementById("assassinsOwned").innerHTML = this.mercenaryManager.assassinsOwned;
        document.getElementById("warlockCost").innerHTML = this.mercenaryManager.warlockPrice.formatMoney(0);
        document.getElementById("warlocksOwned").innerHTML = this.mercenaryManager.warlocksOwned;
    }

    this.update = function update() {
        var newDate = new Date();
        var ms = (newDate.getTime() - this.oldDate.getTime());

        // Check if the player is dead
        if (!this.player.alive) {
            // If the player is not already resurrecting then start resurrection
            if (!this.player.resurrecting) {
                $("#resurrectionBarArea").show();
                this.player.resurrecting = true;
                this.player.resurrectionTimeRemaining = this.player.resurrectionTimer;
                this.disallowBattle();
                this.player.health = 0;
                this.mercenaryManager.addGpsReduction(this.mercenaryManager.deathGpsReductionAmount, this.mercenaryManager.deathGpsReductionDuration);
            }
            // Else update the resurrecting
            else {
                // Update the timer
                this.player.resurrectionTimeRemaining -= (ms / 1000);

                // Check if the player is now alive
                if (this.player.resurrectionTimeRemaining <= 0) {
                    // Make the player alive
                    this.player.resurrecting = false;
                    this.player.health = this.player.getMaxHealth();
                    this.player.alive = true;

                    // Display the other elements
                    this.allowBattle();
                }
            }
        }
        // Else if the player is alive
        else {
            // Regenerate the player's health
            this.player.regenerateHealth(ms);
        }

        this.mercenaryManager.update(ms);
        this.updateInterface(ms);
        this.questsManager.update();
        this.eventManager.update(ms);
        this.player.update(ms);

        // Save the progress if enough time has passed
        legacyGame.saveTimeRemaining -= ms;
        if (legacyGame.saveTimeRemaining <= 0) {
            legacyGame.saveTimeRemaining = legacyGame.saveDelay;
            legacyGame.save();
        }

        this.oldDate = newDate;
    }

    this.updateInterface = function updateInterface(ms) {

        // Update the upgrades
        this.upgradeManager.update();

        // Update the particles
        this.particleManager.update(ms);

        // Update the select quest display
        var quest = this.questsManager.getSelectedQuest();
        if (quest != null) {
            var newText = '';
            // Name
            document.getElementById("questTitle").innerHTML = quest.name;
            // Create the quest goal
            switch (quest.type) {
                case QuestType.KILL:
                    if (quest.typeAmount == 1) {
                        newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monster.";
                    }
                    else {
                        newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monsters.";
                    }
                    break;
                case QuestType.MERCENARIES:
                    switch (quest.typeId) {
                        case 0:
                            newText = "Own " + quest.typeAmount + " Footmen.";
                            break;
                        case 1:
                            newText = "Own " + quest.typeAmount + " Clerics.";
                            break;
                        case 2:
                            newText = "Own " + quest.typeAmount + " Commanders.";
                            break;
                        case 3:
                            newText = "Own " + quest.typeAmount + " Mages.";
                            break;
                        case 4:
                            newText = "Own " + quest.typeAmount + " Assassins.";
                            break;
                        case 5:
                            newText = "Own " + quest.typeAmount + " Warlocks.";
                            break;
                    }
                    break;
                case QuestType.UPGRADE:
                    newText = "Purchase the " + this.upgradeManager.upgrades[quest.typeId].name + " upgrade.";
                    break;
            }
            document.getElementById("questGoal").innerHTML = newText;
            // Create the quest progress text
            switch (quest.type) {
                case QuestType.KILL:
                    newText = quest.killCount + "/" + quest.typeAmount + " Monsters slain.";
                    break;
                case QuestType.MERCENARIES:
                    switch (quest.typeId) {
                        case 0:
                            newText = this.mercenaryManager.footmenOwned + "/" + quest.typeAmount + " Footmen owned.";
                            break;
                        case 1:
                            newText = this.mercenaryManager.clericsOwned + "/" + quest.typeAmount + " Clerics owned.";
                            break;
                        case 2:
                            newText = this.mercenaryManager.commandersOwned + "/" + quest.typeAmount + " Commanders owned.";
                            break;
                        case 3:
                            newText = this.mercenaryManager.magesOwned + "/" + quest.typeAmount + " Mages owned.";
                            break;
                        case 4:
                            newText = this.mercenaryManager.assassinsOwned + "/" + quest.typeAmount + " Assassins owned.";
                            break;
                        case 5:
                            newText = this.mercenaryManager.warlocksOwned + "/" + quest.typeAmount + " Warlocks owned.";
                            break;
                    }
                    break;
                case QuestType.UPGRADE:
                    break;
            }
            document.getElementById("questProgress").innerHTML = newText;
            // Add the description
            document.getElementById("questDescription").innerHTML = "<br>" + quest.description;
            // Add the reward
            document.getElementById("questReward").innerHTML = "<br>Reward:";
            if (quest.buffReward != null) { document.getElementById("questRewardText").innerHTML = "Completing this quest will empower you with a powerful buff."; }
            document.getElementById("questGold").innerHTML = quest.goldReward;
            document.getElementById("questExperience").innerHTML = quest.expReward;
        }
        else {
            $("#questNamesArea").hide();
            $("#questTextArea").hide();
        }

        // Update the stats window
        this.stats.update();
    }
}