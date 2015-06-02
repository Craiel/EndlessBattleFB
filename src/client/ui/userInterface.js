declare('UserInterface', function () {
    include('Component');
    include('Save');
    include('SaveKeys');
    include('CombatLog');
    include('StaticData');

    UserInterface.prototype = component.prototype();
    UserInterface.prototype.$super = parent;
    UserInterface.prototype.constructor = UserInterface;

    function UserInterface() {
        component.construct(this);

        this.id = "UserInterface";

        this.needInventoryUpdate = true;
        this.needEquipmentUpdate = true;

        this.combatLog = undefined;
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    UserInterface.prototype.componentInit = UserInterface.prototype.init;
    UserInterface.prototype.init = function() {
        this.componentInit();

        this.initLegacyInterface();
        this.initUpgradeButtons();

        this.combatLog = combatLog.create();
        this.combatLog.init(this);
    };

    UserInterface.prototype.componentUpdate = UserInterface.prototype.update;
    UserInterface.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        this.updateLegacyInterface(gameTime);
        this.updateUpdateNotice(gameTime);

        this.combatLog.update(gameTime);

        return true;
    }

    // ---------------------------------------------------------------------------
    // init functions
    // ---------------------------------------------------------------------------
    UserInterface.prototype.initLegacyInterface = function() {
        $("#itemTooltip").hide();
        $("#itemCompareTooltip").hide();
        $("#itemCompareTooltip2").hide();
        $("#otherTooltip").hide();
        $("#abilityUpgradeTooltip").hide();
        $("#basicTooltip").hide();
        $("#mouseIcon").hide();
        $("#mercenaryArea").hide();

        $("#otherArea").hide();
        $("#inventoryArea").hide();

        $("#playerHealthBarText").hide();
        $("#resurrectionBarArea").hide();
        $("#monsterHealthBarArea").hide();
        $("#inventoryWindow").hide();
        $("#characterWindow").hide();
        $("#mercenariesWindow").hide();
        $("#upgradesWindow").hide();
        $("#questsWindow").hide();
        $("#questTextArea").hide();
        $("#mapWindow").hide();
        $("#leaveBattleButton").hide();
        $("#actionButtonsContainer").hide();
        $("#actionCooldownsArea").hide();
        $("#levelUpButton").hide();
        $("#expBarText").hide();
        $("#statUpgradesWindow").hide();
        $("#abilityUpgradesWindow").hide();
        $(".bleedingIcon").hide();
        $(".burningIcon").hide();
        $(".chilledIcon").hide();

        $("#attackButton").hide();
        $("#healButton").hide();
        $("#iceboltButton").hide();
        $("#fireballButton").hide();
        $("#powerStrikeButton").hide();
        $("#rendCooldownContainer").hide();
        $("#healCooldownContainer").hide();
        $("#iceboltCooldownContainer").hide();
        $("#fireballCooldownContainer").hide();
        $("#powerStrikeCooldownContainer").hide();

        $("#checkboxWhite").hide();
        $("#checkboxGreen").hide();
        $("#checkboxBlue").hide();
        $("#checkboxPurple").hide();
        $("#checkboxOrange").hide();

        $("#updatesWindow").hide();
        $("#statsWindow").hide();
        $("#optionsWindow").hide();
        $("#resetConfirmWindow").hide();

        $(".craftingWindowButton").hide();

        // Make the equipment slots draggable
        for (var x = 1; x < 11; x++) {
            $(".equipItem" + x).draggable({
                // When an equip item is no longer being dragged
                stop: function (event, ui) {
                    // Move the item to a different slot if it was dragged upon one
                    var top = ui.offset.top;
                    var left = ui.offset.left;

                    // Check if the mouse is over a inventory slot
                    var offset;
                    var itemMoved = false;
                    for (var y = 1; y < (legacyGame.inventory.maxSlots + 1); y++) {
                        offset = $("#inventoryItem" + y).offset();
                        // Check if the mouse is within the slot
                        if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                            // If it is; move the item
                            legacyGame.equipment.unequipItemToSlot(slotNumberSelected - 1, y - 1);
                            itemMoved = true;
                        }
                    }

                    // Check if the current slot is a trinket slot and the new slot is the other trinket slot
                    if (!itemMoved && (slotNumberSelected == 8 || slotNumberSelected == 9)) {
                        var otherSlot;
                        if (slotNumberSelected == 9) {
                            otherSlot = 8;
                        }
                        else {
                            otherSlot = 9;
                        }

                        offset = $(".equipItem" + otherSlot).offset();
                        // Check if the mouse is within the slot
                        if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                            // If it is; swap the items
                            legacyGame.equipment.swapTrinkets();
                            itemMoved = true;
                        }
                    }
                },
                revert: true,
                scroll: false,
                revertDuration: 0,
                cursorAt: { top: 0, left: 0 }
            });
        }

        // Make the inventory slots draggable
        for (var x = 1; x < (legacyGame.inventory.maxSlots + 1); x++) {
            $("#inventoryItem" + x).draggable({
                // When an inventory item is no longer being dragged
                stop: function (event, ui) {
                    // Move the item to a different slot if it was dragged upon one
                    var top = ui.offset.top;
                    var left = ui.offset.left;

                    // Check if the mouse is over a new inventory slot
                    var offset;
                    var itemMoved = false;
                    for (var y = 1; y < (legacyGame.inventory.maxSlots + 1); y++) {
                        // If this slot is not the one the item is already in
                        if (y != slotNumberSelected) {
                            offset = $("#inventoryItem" + y).offset();
                            // Check if the mouse is within the slot
                            if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                                // If it is; move the item
                                legacyGame.inventory.swapItems(slotNumberSelected - 1, y - 1);
                                itemMoved = true;
                            }
                        }
                    }

                    // Check if the mouse is over a new equip slot
                    if (!itemMoved) {
                        for (var y = 1; y < 11; y++) {
                            offset = $(".equipItem" + y).offset();
                            // Check if the mouse is within the slot
                            if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                                // If it is; move the item
                                legacyGame.equipment.equipItemInSlot(legacyGame.inventory.slots[slotNumberSelected - 1], y - 1, slotNumberSelected - 1);
                                itemMoved = true;
                            }
                        }
                    }

                    // Check if the mouse is over the character icon area
                    if (!itemMoved) {
                        offset = $("#characterIconArea").offset();
                        // Check if the mouse is within the area
                        if (left >= offset.left && left < offset.left + 124 && mouseY >= top.top && mouseY < top.top + 204) {
                            // If it is; move the item
                            legacyGame.equipment.equipItem(legacyGame.inventory.slots[slotNumberSelected - 1], slotNumberSelected - 1);
                            itemMoved = true;
                        }
                    }
                },
                revert: true,
                scroll: false,
                revertDuration: 0,
                cursorAt: { top: 0, left: 0 }
            });
        }
        // cursor: url("/includes/images/skull.png") 49 49, auto;

        // scroll bar width 17px

        $("#characterWindow").draggable({drag: function() { updateWindowDepths(document.getElementById("characterWindow")); }, cancel: '.globalNoDrag'});
        $("#mercenariesWindow").draggable({drag: function() { updateWindowDepths(document.getElementById("mercenariesWindow")); }, cancel: '.globalNoDrag'});
        $("#upgradesWindow").draggable({drag: function() { updateWindowDepths(document.getElementById("upgradesWindow")); }, cancel: '.globalNoDrag'});
        $("#questsWindow").draggable({drag: function() { updateWindowDepths(document.getElementById("questsWindow")); }, cancel: '.globalNoDrag'});
        $("#inventoryWindow").draggable({drag: function() { updateWindowDepths(document.getElementById("inventoryWindow")); }, cancel: '.globalNoDrag'});
    };

    UserInterface.prototype.initUpgradeButtons = function() {
        var upgradeArea = $('#upgradesBuyArea');
        for (var i = 0; i < legacyGame.upgradeManager.upgrades.length; i++) {
            var upgrade = legacyGame.upgradeManager.upgrades[i];

            var button = $('<div id="buyButton{0}" class="buyButton"></div>'.format(upgrade.id));
            button.mousedown({'id': upgrade.id}, function(args) { upgradeButtonMouseDown(args.data.id); });
            button.mouseup({'id': upgrade.id}, function(args) { upgradeButtonMouseOver(args.data.id); });
            button.mouseover({'id': upgrade.id}, function(args) { upgradeButtonMouseOver(args.data.id); });
            button.mouseout({'id': upgrade.id}, function(args) { upgradeButtonMouseOut(args.data.id); });

            var buttonArea = $('<div id="upgradePurchaseButton{0}" class="buyButtonArea"></div>'.format(upgrade.id));
            button.append(buttonArea);

            var icon = $('<div class="buyButtonIcon"></div>');
            icon.css({background: 'url("includes/images/bigIcons.png") ' + upgrade.iconSourceLeft + 'px ' + upgrade.iconSourceTop + 'px'});
            buttonArea.append(icon);

            var name = $('<div class="mercenaryName">{0}</div>'.format(upgrade.name));
            buttonArea.append(name);

            var cost = $('<div class="mercenaryAmount">{0}</div>'.format(upgrade.cost.formatMoney(0)));
            cost.css({left: '53px'});
            buttonArea.append(cost);

            var coinIcon = $('<div class="goldCoin"></div>');
            coinIcon.css({position: 'absolute', top: '28px', width: '12px', height: '12px', left: '41px'});
            buttonArea.append(coinIcon);

            upgradeArea.append(button);
        }
    }

    // ---------------------------------------------------------------------------
    // update functions
    // ---------------------------------------------------------------------------
    UserInterface.prototype.updateLegacyInterface = function(gameTime) {
        $('#version').text('Version ' + game.getCurrentVersion());

        if(this.needInventoryUpdate === true) {
            this.updateInventory(gameTime);
        }

        if(this.needEquipmentUpdate === true) {
            this.updateEquipment(gameTime);
        }

        this.updateGoldDisplay(gameTime);
        this.updatePlayerAndMonster(gameTime);
        this.updateBattleDisplay(gameTime);
        this.updateUpgrades(gameTime);
        this.updatePlayerStats(gameTime);
        this.updateMercenaries(gameTime);

        if(!legacyGame.player.alive) {
            // Update the resurrection bar
            var resurrectionPercentage = legacyGame.player.resurrectionTimeRemaining / legacyGame.player.resurrectionTimer;
            $("#resurrectionBar").css('width', (staticData.progressBarWidth * resurrectionPercentage));
            $("#resurrectionBar").css('height', '23');
            document.getElementById("resurrectionBarText").innerHTML = "Resurrecting: " + Math.floor(resurrectionPercentage * 100) + "%";
        } else {
            $("#resurrectionBarArea").hide();
        }

        legacyGame.FrozenBattle.updateUI();
    };

    UserInterface.prototype.updateBattleDisplay = function(gameTime) {
        $('#enterBattleButton').text("Enter Battle (Lvl {0})".format(legacyGame.battleLevel));
        $('#leaveBattleButton').text("Leave Battle (Lvl {0})".format(legacyGame.battleLevel));

        if(legacyGame.player.skillPoints > 0) {
            $('#levelUpButton').text("Level Up ({0})".format(legacyGame.player.skillPoints));
            $('#levelUpButton').show();
        } else {
            $('#levelUpButton').hide();
        }

        if(legacyGame.player.abilityPoints > 0) {
            $('#skillUpButton').text("Skill Up ({0})".format(legacyGame.player.abilityPoints));
            $('#skillUpButton').show();
        } else {
            $('#skillUpButton').hide();
        }

        if (legacyGame.inBattle == false && legacyGame.player.alive) {
            $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
        }

        if(legacyGame.inBattle === true) {
            $('#enterBattleButton').hide();
            $("#battleLevelDownButton").hide();
            $("#battleLevelUpButton").hide();
        } else {
            $('#enterBattleButton').show();
            $("#battleLevelDownButton").show();
            $("#battleLevelUpButton").show();
        }
    };

    UserInterface.prototype.updateInventory = function(gameTime) {
        var slots = legacyGame.inventory.slots;
        // Go through all the slots and show their image in the inventory
        for (var x = 0; x < slots.length; x++) {
            var control = $("#inventoryItem" + (x + 1));
            if (slots[x] != null) {
                control.css('background', 'url("includes/images/itemSheet3.png") ' + slots[x].iconSourceX + 'px ' + slots[x].iconSourceY + 'px');
            } else {
                control.css('background', 'url("includes/images/NULL.png")');
            }
        }
    };

    UserInterface.prototype.updateEquipment = function(gameTime) {
        var slots = legacyGame.equipment.slots;
        for (var x = 0; x < slots.length; x++) {
            var control = $(".equipItem" + (x + 1));
            if (slots[x] != null) {
                control.css('background', 'url("includes/images/itemSheet3.png") ' + slots[x].iconSourceX + 'px ' + slots[x].iconSourceY + 'px');
            } else  {
                control.css('background', 'url("includes/images/NULL.png")');
            }
        }
    };

    UserInterface.prototype.updateGoldDisplay = function(gameTime) {
        var gameAreaHalfWidth = ($("#gameArea").width() / 2);
        var element = $('#goldAmount');
        element.text(legacyGame.player.gold.formatMoney(2));

        // Move the gold icon and gold depending on the amount of gold the player has
        var leftReduction = element[0].scrollWidth / 2;
        element.css('left', (gameAreaHalfWidth - leftReduction) + 'px');
        $("#goldCoin").css('left', (gameAreaHalfWidth - leftReduction - 21) + 'px');

        var currentGoldPerSecond = legacyGame.mercenaryManager.getGps();
        element = $("#gps");
        element.text(currentGoldPerSecond + 'gps');
        var leftReduction = element[0].scrollWidth / 2;
        element.css('left', (gameAreaHalfWidth - leftReduction) + 'px');
        if(legacyGame.mercenaryManager.gpsReduction !== 0) {
            element.css('color', '#ff0000');
        } else {
            element.css('color', '#ffd800');
        }
    };

    UserInterface.prototype.updatePlayerStats = function(gameTime) {
        // Update the player's stats
        $('#levelValue').text(legacyGame.player.level);
        $('#healthValue').text(legacyGame.player.health.formatMoney(0) + ' / ' + game.systems.getMaxHealth().formatMoney(0));
        $('#hp5Value').text(game.systems.getHp5().formatMoney(0));
        $('#damageValue').text(game.systems.getMinDamage().formatMoney(0) + ' - ' + game.systems.getMaxDamage().formatMoney(0));
        $('#damageBonusValue').text(game.systems.getDamageBonusMultiplier().formatMultiplier());
        $('#armourValue').text(game.systems.getArmor().formatMoney(0) + ' (' + game.systems.getArmorDamageReduction().formatMultiplier() + ')');
        $('#evasionValue').text(game.systems.getEvasion().formatMoney(0) + ' (' + game.systems.getEvasionChance().formatMultiplier() + ')');

        $('#strengthValue').text(game.systems.getStrength().formatMoney(0));
        $('#staminaValue').text(game.systems.getStamina().formatMoney(0));
        $('#agilityValue').text(game.systems.getAgility().formatMoney(0));
        $('#critChanceValue').text(game.systems.getCritChance().formatMultiplier());
        $('#critDamageValue').text(game.systems.getCritDamageMultiplier().formatMultiplier());

        $('#itemRarityValue').text(game.systems.getRarityMultiplier().formatMultiplier());
        $('#goldGainValue').text(game.systems.getGoldMultiplier().formatMultiplier());
        $('#experienceGainValue').text(game.systems.getExperienceMultiplier().formatMultiplier());
    }

    UserInterface.prototype.updatePlayerAndMonster = function(gameTime) {
        // Update the player's health bar
        var hpBar = $("#playerHealthBar");
        hpBar.css('width', (staticData.progressBarWidth - 2) * (legacyGame.player.health / game.systems.getMaxHealth()));
        hpBar.css('height', '23');
        document.getElementById("playerHealthBarText").innerHTML = Math.floor(legacyGame.player.health).formatMoney(0) + ' / ' + Math.floor(game.systems.getMaxHealth()).formatMoney(0);

        if (legacyGame.options.alwaysDisplayPlayerHealth) {
            $("#playerHealthBarText").show();
        } else {
            $("#playerHealthBarText").hide();
        }

        // Update the player's exp bar
        var expBar = $("#expBar");
        expBar.css('width', 718 * (legacyGame.player.experience / legacyGame.player.experienceRequired));
        expBar.css('height', '13');
        document.getElementById("expBarText").innerHTML = Math.floor(legacyGame.player.experience).formatMoney(0) + ' / ' + legacyGame.player.experienceRequired.formatMoney(0);

        if (legacyGame.options.alwaysDisplayExp) {
            $("#expBarText").show();
        } else {
            $("#expBarText").hide();
        }

        // Update the monster's health bar
        hpBar = $("#monsterHealthBar");
        hpBar.css('width', (staticData.progressBarWidth - 2) * (legacyGame.monster.health / legacyGame.monster.maxHealth));
        hpBar.css('height', '23');
        hpBar.css('color', legacyGame.monsterCreator.getRarityColour(legacyGame.monster.rarity));

        // Set the monster's name or health on the screen
        if (legacyGame.displayMonsterHealth) {
            document.getElementById("monsterName").innerHTML = Math.floor(legacyGame.monster.health).formatMoney(0) + ' / ' + Math.floor(legacyGame.monster.maxHealth).formatMoney(0);
        }
        else {
            document.getElementById("monsterName").innerHTML = "(Lv" + legacyGame.monster.level + ") " + legacyGame.monster.name;
        }

        $("#monsterName").css('color', legacyGame.monsterCreator.getRarityColour(legacyGame.monster.rarity));
    };

    UserInterface.prototype.updateUpgrades = function(gameTime) {

        for (var i = 0; i < legacyGame.upgradeManager.upgrades.length; i++) {
            var upgrade = legacyGame.upgradeManager.upgrades[i];

            var element = $('#buyButton' + upgrade.id);
            if(element.length <= 0) {
                continue;
            }

            if(upgrade.available === true && upgrade.purchased === false) {
                element.show();
            } else {
                element.hide();
            }
        }
    };

    UserInterface.prototype.updateUpdateNotice = function(gameTime) {
        var currentVersion = game.getCurrentVersion();
        var versionData = game.getVersionCheckData();

        var control = $('#fbUpdate');
        if(versionData !== undefined && versionData.version > currentVersion) {
            //this.updateNotice.setVersionData(versionData);
            control.text('Update {0} Available!'.format(versionData.version));
            control.show();
            return;
        }

        control.hide();
    };

    UserInterface.prototype.updateMercenaries = function(gameTime) {
        document.getElementById("footmanCost").innerHTML = legacyGame.mercenaryManager.footmanPrice.formatMoney(0);
        document.getElementById("footmenOwned").innerHTML = legacyGame.mercenaryManager.footmenOwned;
        document.getElementById("clericCost").innerHTML = legacyGame.mercenaryManager.clericPrice.formatMoney(0);
        document.getElementById("clericsOwned").innerHTML = legacyGame.mercenaryManager.clericsOwned;
        document.getElementById("commanderCost").innerHTML = legacyGame.mercenaryManager.commanderPrice.formatMoney(0);
        document.getElementById("commandersOwned").innerHTML = legacyGame.mercenaryManager.commandersOwned;
        document.getElementById("mageCost").innerHTML = legacyGame.mercenaryManager.magePrice.formatMoney(0);
        document.getElementById("magesOwned").innerHTML = legacyGame.mercenaryManager.magesOwned;
        document.getElementById("assassinCost").innerHTML = legacyGame.mercenaryManager.assassinPrice.formatMoney(0);
        document.getElementById("assassinsOwned").innerHTML = legacyGame.mercenaryManager.assassinsOwned;
        document.getElementById("warlockCost").innerHTML = legacyGame.mercenaryManager.warlockPrice.formatMoney(0);
        document.getElementById("warlocksOwned").innerHTML = legacyGame.mercenaryManager.warlocksOwned;
    }

    // ---------------------------------------------------------------------------
    // utility functions
    // ---------------------------------------------------------------------------

    return new UserInterface();
});
