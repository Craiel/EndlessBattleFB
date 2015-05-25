// ==UserScript==
// @name        Endless Improvement
// @author      feildmaster
// @description Script dedicated to improving kruv's endless battle browser legacyGame
// @namespace   http://feildmaster.com/
// @include     http://www.kruv.net/endlessBattle.html
// @version     1.4.3pre
// @updateURL   https://raw.githubusercontent.com/feildmaster/EndlessImprovement/release/Endless_Improvement.meta.js
// @downloadURL https://raw.githubusercontent.com/feildmaster/EndlessImprovement/release/Endless_Improvement.user.js
// @source      https://github.com/feildmaster/EndlessImprovement/
// @grant       none
// ==/UserScript==

// Start core infrastructure - Everything is an improvement!
function ImprovementManager() {
    var currentTime = 0; // Is updated on updates
    var improvements = new Array(); // PRIVATE-NESS
    var pending = new Array();

    this.add = function(improvement) {
        if (improvement instanceof Improvement) {
            pending.push(improvement);
        }
    }

    this.getCurrentTime = function() {
        return currentTime;
    }

    function doInit() {
        for (var i in pending) {
            try {
                pending[i].onInit();
            } catch (e) {
                logError("init", e);
            }
        }
        // EndlessGame loads after initializing... Do the same here (we don't hook into their initialize, yet!)
        doLoad();
    }

    function doLoad() {
        while (pending.length > 0) {
            var improvement = pending.pop();
            try {
                improvement.onLoad();
                improvements.push(improvement);
            } catch (e) {
                logError("load", e);
            }
        }
    }

    function doSave() {
        for (var i in improvements) {
            try {
                improvements[i].onSave();
            } catch (e) {
                logError("save", e);
            }
        }
    }

    function doUpdate() {
        for (var i in improvements) {
            try {
                improvements[i].onUpdate();
            } catch (e) {
                logError("update", e);
            }
        }
        // Check for pending improvements
        if (pending.length > 0) {
            doInit();
        }
    }

    function doReset() {
        for (var i in improvements) {
            try {
                improvements[i].onReset();
            } catch (e) {
                logError("reset", e);
            }
        }
    }

    function logError(type, error) {
        var fileName = "undefined";
        if(error.fileName !== undefined) {
            fileName = error.fileName.slice(error.fileName.lastIndexOf("/") + 1);
        }

        console.log("Error when handling %s: [%s (%s:%d)]", type, error, fileName, error.lineNumber);
    }

    // Initiallize on page ready
    $(doInit);

    // Add save hook
    var originalSave = legacyGame.save;
    legacyGame.save = function() {
        originalSave.apply(this);
        doSave();
    }

    // Add update hook
    var originalUpdate = legacyGame.update;
    legacyGame.update = function() {
        currentTime = Date.now();
        originalUpdate.apply(this);
        doUpdate();
    }

    // Add reset hook
    var originalReset = legacyGame.reset;
    legacyGame.reset = function() {
        originalReset.apply(this);
        doReset();
    }
}

function Improvement(init, load, save, update, reset) {
    this.onInit = function() {
        if (typeof init === 'function') {
            init();
        }
    }
    this.onLoad = function() {
        if (typeof load === 'function') {
            load();
        }
    }
    this.onSave = function() {
        if (typeof save === 'function') {
            save();
        }
    }
    this.onUpdate = function() {
        if (typeof update === 'function') {
            update();
        }
    }
    this.onReset = function() {
        if (typeof reset === 'function') {
            reset();
        }
    }
}

Improvement.prototype.register = function() {
    legacyGame.endlessImprovement.add(this);
}
// End core infrastructure

// Start quest fix
function questFix() {
    new Improvement(init, load, null, null, reset).register();

    function init() {
        addHooks();
    }

    function load() {
        // Fix quest buffs
        if (localStorage.questBuffRewards) {
            var buffs = JSON.parse(localStorage.getItem("questBuffRewards"));
            for (var x = 0; x < legacyGame.questsManager.quests.length; x++) {
                if (buffs.length > x) {
                    legacyGame.questsManager.quests[x].buffReward = buffs[x];
                }
            }
        }
    }

    function reset() {
        addHooks();
    }

    function addHooks() {
        legacyGame.questsManager.getSelectedQuest = function() {
            if (this.quests.length > this.selectedQuest) {
                return this.quests[this.selectedQuest];
            } else {
                return null;
            }
        }

        var originalAddQuest = legacyGame.questsManager.addQuest;
        legacyGame.questsManager.addQuest = function(quest) {
            // Fix quest display id
            quest.displayId = this.quests.length + 1;
            originalAddQuest.apply(this, arguments);
        }

        var originalRemoveQuest = legacyGame.questsManager.removeQuest;
        legacyGame.questsManager.removeQuest = function(id) {
            var removed = this.selectedQuest == id;
            originalRemoveQuest.apply(this, arguments);

            // Selected quest exists! Show the quest area. this.selectedQuest = 0;
            if (removed && this.selectedQuest < this.quests.length) {
                $("#questTextArea").show();
            }
        }
    }
}
// End quest fix

// Start stats window improvement - only update when the window is open!
function statWindowImprovement() {
    new Improvement(init, null, null, null, reset).register();

    var originalStatsUpdate = legacyGame.stats.update;

    function init() {
        legacyGame.stats.update = newUpdate;
    }

    function reset() {
        originalStatsUpdate = legacyGame.stats.update;
    }

    function newUpdate() {
        if (statsWindowShown) {
            originalStatsUpdate.apply(this);
        }
    }
}
// End stats window improvement

// Start mercenary highlighting
function mercenaryHighlighting() {
    var enableHighlight = true;
    var currentMercenary = null;

    new Improvement(init, load, save, null, reset).register();

    function init() {
        addHooks();

        // Add function to toggle mercenary highlighting
        legacyGame.highlightBestMercenaryClick = function() {
            enableHighlight = !enableHighlight;
            highlightMostEfficientMercenary();
            updateOption();
        }

        // Add option to toggle mercenary highlighting
        $("#optionsWindowOptionsArea").append('<div class="optionsWindowOption" onmousedown="legacyGame.highlightBestMercenaryClick()">' +
            '<span style="color: #ffff00;">Highlight</span> most cost efficient mercenary: <span id="highlightMercenaryValue">ON</span></div>');
    }

    function load() {
        if (localStorage.endlessEnableHighlight) {
            enableHighlight = localStorage.endlessEnableHighlight === 'true';
        }
        updateOption(); // Lets update on load, for lack of better place (only needs to do this once...)
        highlightMostEfficientMercenary(); // Run once on load
    }

    function save() {
        localStorage.endlessEnableHighlight = enableHighlight;
    }

    function reset() {
        addHooks();
    }

    function addHooks() {
        var originalPurchaseMercenary = legacyGame.mercenaryManager.purchaseMercenary;
        legacyGame.mercenaryManager.purchaseMercenary = function() {
            originalPurchaseMercenary.apply(this, arguments);
            highlightMostEfficientMercenary();
        }

        // Re-calculate after buying an upgrade
        var originalPurchaseUpgrade = legacyGame.upgradeManager.purchaseUpgrade;
        legacyGame.upgradeManager.purchaseUpgrade = function() {
            originalPurchaseUpgrade.apply(this, arguments);
            highlightMostEfficientMercenary();
        }
    }

    function updateOption() {
        $("#highlightMercenaryValue").html(enableHighlight?"ON":"OFF");
    }

    function highlightMostEfficientMercenary() {
        if (!enableHighlight) {
            removeHighlight();
            currentMercenary = null;
            return;
        }
        var newMercenary;
        var newValue = 0;

        for (var curMercenary in MercenaryType) {
            var curValue = legacyGame.mercenaryManager[curMercenary.toLowerCase() + 'Price'] / legacyGame.mercenaryManager.getMercenaryBaseGps(curMercenary);

            if (newMercenary == null || curValue < newValue) {
                newMercenary = curMercenary;
                newValue = curValue;
            }
        }

        // Only update if changed
        if (currentMercenary != newMercenary) {
            removeHighlight();
            currentMercenary = newMercenary;
            getMercenaryElement(newMercenary).css('color', '#ffff00');
        }
    }

    function removeHighlight() {
        if (currentMercenary) {
            getMercenaryElement(currentMercenary).css('color', '#fff');
        }
    }

    function getMercenaryElement(type) {
        return $("#"+ type.toLowerCase() +"Name");
    }
}
// End mercenary highlighting

// Start bonus kill stats
function monsterKillStats() {
    var bossKills = 0;
    var bossLevel = 0;
    var isUpdated = false;

    new Improvement(init, load, save, update, reset).register();

    // Add a global getter
    legacyGame.endlessImprovement.getBossKills = function() {
        return bossKills;
    }

    function init() {
        addHooks();
    }

    function load() {
        if (localStorage.endlessBossKills) {
            bossKills = parseInt(localStorage.endlessBossKills);
            bossLevel = parseInt(localStorage.endlessBossLevel);
        }

        $("#statsWindowStatsArea").append('<div class="statsWindowText"><span style="color: #F00;">Boss</span> kills at player level:</div>');
        $("#statsWindowStatValuesArea").append('<div id="statsWindowBossKills" class="statsWindowText"></div>');
        $("#statsWindowStatsArea").append('<div class="statsWindowText">Highest level <span style="color: #F00;">Boss</span> kill:</div>');
        $("#statsWindowStatValuesArea").append('<div id="statsWindowBossLevel" class="statsWindowText"></div>');
    }

    function save() {
        localStorage.endlessBossKills = bossKills;
        localStorage.endlessBossLevel = bossLevel;
    }

    function update() {
        if (isUpdated) {
            return;
        }
        $("#statsWindowBossKills").html(bossKills.formatMoney(0));
        $("#statsWindowBossLevel").html(bossLevel.formatMoney(0));
        isUpdated = true;
    }

    function reset() {
        bossKills = 0;
        bossLevel = 0;
        isUpdated = false;
        addHooks();
    }

    function monsterKilled(monster) {
        if (monster.rarity == MonsterRarity.BOSS) {
            if (monster.level > bossLevel) {
                bossLevel = monster.level;
                isUpdated = false;
            }

            if (monster.level === legacyGame.player.level) {
                bossKills++;
                isUpdated = false;
            }
        }
    }

    function addHooks() {
        // hook into monster damage function, has to be done every time a monster is created!
        var originalMonsterCreator = legacyGame.monsterCreator.createRandomMonster;
        legacyGame.monsterCreator.createRandomMonster = function() {
            // Create a monster
            var newMonster = originalMonsterCreator.apply(this, arguments);
            // Override it's takeDamage function
            var originalDamageFunction = newMonster.takeDamage;
            newMonster.takeDamage = function() {
                // Lets not continue if they're already dead
                if (!this.alive) {
                    return;
                }
                var value = originalDamageFunction.apply(this, arguments);
                // Yay, it was killed!
                if (!this.alive) {
                    monsterKilled(this);
                }

                return value;
            }

            return newMonster;
        }
    }
}
// End bonus kill stats

// Start monster kill quests
function monsterKillQuests() {
    var bossKillPercentage = 10;

    new Improvement(null, load, save, update, reset).register();
    QuestType.ENDLESS_BOSSKILL  = "EndlessBossKill";

    // Last level it was awarded (Updates to current level even if it was rolled over from past level)
    var killLevelAwarded = 0;

    function load() {
        if (localStorage.endlessKillLevelAwarded) {
            killLevelAwarded = parseInt(localStorage.endlessKillLevelAwarded);
        }
    }

    function save() {
        localStorage.endlessKillLevelAwarded = killLevelAwarded;
    }

    function update() {
        // You can't gain this quest if you aren't at least level 30
        if (legacyGame.player.level < 30) {
            return;
        }
        // Create if needed
        findOrCreate();
    }

    function reset() {
        killLevelAwarded = 0;
    }

    function findOrCreate() {
        var quest;
        for (var x = legacyGame.questsManager.quests.length - 1; x >= 0; x--) {
            var c = legacyGame.questsManager.quests[x];
            if (c.type == QuestType.ENDLESS_BOSSKILL) {
                quest = c;
                hookBossKillQuest(quest);
                break;
            }
        }

        if (!quest) { // Give the quest... if we can
            addBossKillQuest();
        }

        // Always set to current level
        if (killLevelAwarded != legacyGame.player.level) {
            killLevelAwarded = legacyGame.player.level;
        }
    }

    function addBossKillQuest() {
        if (legacyGame.player.level >= 30 && killLevelAwarded < legacyGame.player.level) {
            var name = "Kill a boss";
            var description = "Kill a boss equal to your level, prove your worth!";
            var quest = new Quest(name, description, QuestType.ENDLESS_BOSSKILL, 0, legacyGame.endlessImprovement.getBossKills(), 0, bossKillPercentage + '%');
            hookBossKillQuest(quest);
            legacyGame.questsManager.addQuest(quest);
        }
    }

    // The quest will be completely broken if this is NOT called correctly
    function hookBossKillQuest(quest) {
        if (quest.hooked) {
            return;
        }
        // overrides update and reward
        quest.update = updateBossKillQuest;
        quest.grantReward = rewardBossKillQuest;
        // mark as hooked, so we don't do hook again
        quest.hooked = true;
    }

    function updateBossKillQuest() {
        // Complete if we have more kills than when this quest was made
        this.complete = legacyGame.endlessImprovement.getBossKills() > this.typeAmount;
    }

    function rewardBossKillQuest() {
        legacyGame.player.gainExperience(Math.ceil(legacyGame.player.experienceRequired * bossKillPercentage / 100), false);
        legacyGame.stats.experienceFromQuests += legacyGame.player.lastExperienceGained;
    }
}
// End monster kill quests

// Start persisting variables in the legacyGame
function persistentGame() {
    new Improvement(null, load, save).register();

    function load() {
        // Persist event time
        if (localStorage.endlessEventTime) {
            legacyGame.eventManager.eventSpawnTimeRemaining = parseInt(localStorage.endlessEventTime);
        }
        // Persist buffs
        if (localStorage.endlessBuffs) {
            var buffs = JSON.parse(localStorage.endlessBuffs);
            for (var x = 0; x < buffs.length; x++) {
                var buff = new Buff(buffs[x].name, buffs[x].type, buffs[x].multiplier, 1, buffs[x].leftPos, buffs[x].topPos);
                buff.maxDuration = buffs[x].maxDuration;
                buff.currentDuration = buffs[x].currentDuration;
                // TODO: Do this in a way that doesn't notify?
                legacyGame.player.buffs.addBuff(buff);
            }
        }
        // Persist death
        if (localStorage.endlessDeath) {
            legacyGame.player.resurrectionTimeRemaining = parseInt(localStorage.endlessDeath);
        }
    }

    function save() {
        // Persist event time
        localStorage.endlessEventTime = legacyGame.eventManager.eventSpawnTimeRemaining;
        // TODO: Persist existing events
        // Persist buffs
        localStorage.endlessBuffs = JSON.stringify(legacyGame.player.buffs.buffs);
        // Persist death
        localStorage.endlessDeath = legacyGame.player.resurrectionTimeRemaining;
    }
}
// End persisting variables in the legacyGame

$("#optionsWindowOptionsArea").append('<div id="improvementOptionsTitle" class="optionsWindowOptionsTitle">Endless Improvement Options</div>');

String.prototype.formatCapitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
// End MISC
