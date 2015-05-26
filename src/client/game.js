declare('Game', function() {
    include('Debug');
    include('Assert');
    include('Component');
    include('StaticData');
    include('Save');
    include('SaveKeys');
    include('CoreUtils');
    include('EventAggregate');

    Game.prototype = component.prototype();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;

    function Game() {
        component.construct(this);

        this.id = "Game";

        this.version = 0.71;

        this.autoSaveDelay = 30000; // 30s default
        this.autoSaveTime = undefined;

        this.versionCheckDelay = 30000;
        this.versionCheckTime = undefined;
        this.versionCheckData = undefined;
        this.versionCheckInfo = undefined;
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Game.prototype.componentInit = Game.prototype.init;
    Game.prototype.init = function() {
        this.componentInit();

        this.reset();
        this.load();

        legacyGame.initialize();
        legacyGame.finishLoading();

        // Frozen Battle
        legacyGame.FrozenBattle = new FrozenBattle();
        legacyGame.FrozenBattle.init();

        // Endless Improvement
        legacyGame.endlessImprovement = new ImprovementManager();
        questFix();
        statWindowImprovement();
        mercenaryHighlighting();
        monsterKillStats();
        monsterKillQuests();
        persistentGame();
    };

    Game.prototype.componentUpdate = Game.prototype.update;
    Game.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        // Update misc components
        this.updateAutoSave(gameTime);
        this.updateVersionCheck(gameTime);

        legacyGame.update();

        return true;
    };

    // ---------------------------------------------------------------------------
    // game functions
    // ---------------------------------------------------------------------------
    Game.prototype.getCurrentVersion = function() {
        return this.version;
    };

    Game.prototype.getVersionCheckData = function() {
        return this.versionCheckData;
    };

    Game.prototype.updateAutoSave = function(gameTime) {
        if(this.autoSaveTime  === undefined) {
            // Skip the first auto save cycle
            this.autoSaveTime = gameTime.current;
            return;
        }

        if (gameTime.current > this.autoSaveTime + this.autoSaveDelay) {
            this.save();
            this.autoSaveTime = gameTime.current;
        }
    };

    Game.prototype.updateVersionCheck = function(gameTime) {
        if(this.versionCheckTime  === undefined) {
            // Skip the first auto save cycle
            this.versionCheckTime = gameTime.current;
            return;
        }

        if (gameTime.current > this.versionCheckTime + this.versionCheckDelay) {
            $.ajax({
                url : staticData.versionInfoFile,
                success : this.handleVersionInfoResult(this),
                cache: false
            });

            this.versionCheckTime = gameTime.current;
        }
    };

    Game.prototype.handleVersionCheckResult = function(self) {
        return function(data, textStatus, jqXHR) {
            self.versionCheckData = JSON.parse(data);
        };
    };

    Game.prototype.handleVersionInfoResult = function(self) {
        return function(data, textStatus, jqXHR) {
            var version = parseFloat(data.trim());
            if(self.versionCheckInfo !== version) {
                self.versionCheckInfo = version;

                // Fetch the full version info
                $.ajax({
                    url : staticData.versionFile,
                    success : self.handleVersionCheckResult(self),
                    cache: false
                });
            }
        };
    };

    //version.info

    // ---------------------------------------------------------------------------
    // player functions
    // ---------------------------------------------------------------------------
    Game.prototype.gainGold = function(value, includeBonuses, silent) {
        if(value === undefined) {
            return;
        }

        var multiplier = 1;
        if (includeBonuses) {
            multiplier += legacyGame.player.getGoldGain() / 100;
            multiplier += legacyGame.player.buffs.getGoldMultiplier();
        }

        var gainedAmount = value * multiplier;
        legacyGame.player.gold += gainedAmount;
        legacyGame.player.lastGoldGained = gainedAmount;
        legacyGame.stats.goldEarned += gainedAmount;

        if(silent !== true) {
            eventAggregate.publish(staticData.EventGoldGain, {value: gainedAmount.formatMoney(0)});
        }
    };

    Game.prototype.gainExperience = function(value, includeBonuses) {
        if(value === undefined) {
            return;
        }

        var multiplier = 1;
        if(includeBonuses) {
            multiplier += legacyGame.player.getExperienceGain() / 100;
            multiplier += legacyGame.player.buffs.getExperienceMultiplier();
        }

        var gainedAmount = value * multiplier;

        legacyGame.player.experience += gainedAmount;
        legacyGame.player.lastExperienceGained = gainedAmount;
        legacyGame.stats.experienceEarned += gainedAmount;
        legacyGame.FrozenBattle.experienceSinceUpdate += gainedAmount;

        eventAggregate.publish(staticData.EventXpGain, {value: gainedAmount.formatMoney(0)});

        legacyGame.player.checkLevelUp();
    };

    Game.prototype.playerTakeDamage = function(value) {
        var takenAmount = legacyGame.player.takeDamage(value);

        // sourceActorName
        // targetActorName
        // damageTotal
        // wasCrit
        // wasHit
        if(takenAmount > 0) {
            var eventData = {
                wasHit: true,
                wasCrit: false,
                damageTotal: value.formatMoney(0),
                sourceActorName: legacyGame.monster.name,
                targetActorName: 'you'
            };

            eventAggregate.publish(staticData.EventCombatHit, eventData);
        }
    };

    Game.prototype.monsterTakeDamage = function(value, isCritical, displayParticle) {
        var takenAmount = legacyGame.monster.takeDamage(value, isCritical, displayParticle);

        legacyGame.FrozenBattle.damageDealtSinceUpdate += value;

        if(takenAmount > 0) {
            var eventData = {
                wasHit: true,
                wasCrit: isCritical,
                damageTotal: value.formatMoney(0),
                sourceActorName: 'you',
                targetActorName: legacyGame.monster.name
            };

            eventAggregate.publish(staticData.EventCombatHit, eventData);
        }
    };

    // ---------------------------------------------------------------------------
    // save / load functions
    // ---------------------------------------------------------------------------
    Game.prototype.save = function() {
        save.save();
    };

    Game.prototype.load = function() {
        save.load();
    };

    Game.prototype.reset = function() {
        save.reset();

        if(legacyGame.FrozenBattle !== undefined) {
            // Turn off auto-sell on reset
            legacyGame.FrozenBattle.settings.autoSellActive = false;
            legacyGame.FrozenBattle.updateUI();
        }
    };

    Game.prototype.onLoad = function() {
        // Perform some initial operation after being loaded
    };

    return new Game();

});