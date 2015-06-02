function TooltipManager() {
    this.getItemTooltipInfo = function(item) {
        var result = {
            name: item.name,
            rarity: item.rarity,
            level: item.level,
            sellValue: item.sellValue,
            type: '',
            stats1: '',
            stats2: '',
            effect: '',
            fullArmorBonus: 0,
            fullDamageBonusMin: 0,
            fullDamageBonusMax: 0
        };

        // Todo: Remove when fixed
        if(result.sellValue === null) {
            result.sellValue = -1;
        }

        switch (item.type) {
            case ItemType.HELM: result.type = "Helmet "; break;
            case ItemType.SHOULDERS: result.type = "Shoulders "; break;
            case ItemType.CHEST: result.type = "Chest "; break;
            case ItemType.LEGS: result.type = "Legs "; break;
            case ItemType.WEAPON: result.type = "Weapon "; break;
            case ItemType.GLOVES: result.type = "Gloves "; break;
            case ItemType.BOOTS: result.type = "Boots "; break;
            case ItemType.TRINKET: result.type = "Trinket "; break;
            case ItemType.OFF_HAND: result.type = "Off-Hand "; break;
        }

        // Get all the items stats
        if (item.minDamage > 0) { result.stats1 += item.minDamage + " - " + item.maxDamage + " Damage"; }
        if (item.armour > 0) { result.stats1 += Math.floor(item.armour + item.armourBonus).formatMoney() + " Armour"; }
        if (item.strength > 0) { result.stats2 += "<br>Strength: " + item.strength; }
        if (item.agility > 0) { result.stats2 += "<br>Agility: " + item.agility; }
        if (item.stamina > 0) { result.stats2 += "<br>Stamina: " + item.stamina; }
        if (item.health > 0) { result.stats2 += "<br>Health: " + item.health; }
        if (item.hp5 > 0) { result.stats2 += "<br>Hp5: " + item.hp5; }
        if (item.critChance > 0) { result.stats2 += "<br>Crit Chance: " + item.critChance.formatMultiplier(); }
        if (item.critDamage > 0) { result.stats2 += "<br>Crit Damage: " + item.critDamage.formatMultiplier(); }
        if (item.itemRarity > 0) { result.stats2 += "<br>Item Rarity: " + item.itemRarity.formatMultiplier(); }
        if (item.goldGain > 0) { result.stats2 += "<br>Gold Gain: " + item.goldGain.formatMultiplier(); }
        if (item.experienceGain > 0) { result.stats2 += "<br>Experience Gain: " + item.experienceGain.formatMultiplier(); }
        if (item.evasion > 0) { result.stats2 += "<br>Evasion: " + item.evasion; }


        for (var x = 0; x < item.effects.length; x++) {
            result.effect = item.effects[x];
            result.stats2 += '<span class="yellowText">' + "<br>" + effect.getDescription();
        }

        if (item.armourBonus > 0) {
            result.fullArmorBonus = item.armour + item.armourBonus;
        }
        else if (item.damageBonus > 0) {
            result.fullDamageBonusMin = item.minDamage + item.damageBonus;
            result.fullDamageBonusMax = item.maxDamage + item.damageBonus;
        }

        return result;
    };

    this.setItemTooltip = function(info, controlPrefix) {
        switch(info.rarity) {
            case ItemRarity.COMMON: {
                this.applyRarityTooltipColor(controlPrefix, info, '#fff', 'whiteText');
                break;
            }
            case ItemRarity.UNCOMMON: {
                this.applyRarityTooltipColor(controlPrefix, info, '#00ff05', 'greenText');
                break;
            }
            case ItemRarity.RARE: {
                this.applyRarityTooltipColor(controlPrefix, info, '#0005ff', 'blueText');
                break;
            }
            case ItemRarity.EPIC: {
                this.applyRarityTooltipColor(controlPrefix, info, '#b800af', 'purpleText');
                break;
            }
            case ItemRarity.LEGENDARY: {
                this.applyRarityTooltipColor(controlPrefix, info, '#ff6a00', 'orangeText');
            }
        }

        $("#item" + controlPrefix + "Type").html(info.type + '<br>');

        // If there is an armour or damage bonus, change the armour/damage colour to green
        var stats1Control = $("#item" + controlPrefix + "Stats1");
        if (info.fullArmorBonus > 0) {
            stats1Control.html('<span class="greenText">' + info.fullArmorBonus.formatMoney() + '<span class="whiteText"> Armour<br></span></span>');
        }
        else if (info.fullDamageBonusMin > 0) {
            stats1Control.html('<span class="greenText">' + info.fullDamageBonusMin.formatMoney() + ' - ' + info.fullDamageBonusMax.formatMoney() + '<span class="whiteText"> Damage<br></span></span>');
        }
        else {
            stats1Control.html(info.stats1 + '<br>');
        }

        // Set the rest of the tooltip
        $("#item" + controlPrefix + "Stats2").html(info.stats2);
        $("#item" + controlPrefix + "SellValue").html(info.sellValue);
        $("#item" + controlPrefix + "Level").html('Item Level ' + info.level);
        $("#item" + controlPrefix + "UseInfo").html('[Right-click to equip]');

        // If the player can sell this item from where it is then add that to the tooltip
        if (info.canSell) {
            $("#item" + controlPrefix + "SellInfo").html('[Shift-click to sell]');
        }
        else {
            $("#item" + controlPrefix + "SellInfo").html('');
        }
    };

    this.applyRarityTooltipColor = function(controlPrefix, info, borderColor, textClass) {
        $("#item" + controlPrefix).css('border-color', borderColor); $(".equipButton").css('border-color', borderColor);
        $("#item" + controlPrefix + "Title").html('<span class="' + textClass + '">' + info.name + '<br></span>');
    };

    this.displayItemTooltip = function displayItemTooltip(item1, item2, item3, left, top, canSell) {
        // Get the item type

        var info = this.getItemTooltipInfo(item1);
        info.canSell = canSell;

        this.setItemTooltip(info, 'Tooltip');

        $("#itemTooltip").show();
        // Set the item tooltip's location
        var topReduction = document.getElementById("itemTooltip").scrollHeight;
        $("#itemTooltip").css('top', top - topReduction - 30);
        var leftReduction = document.getElementById("itemTooltip").scrollWidth;
        $("#itemTooltip").css('left', left - leftReduction - 30);


        // If there is another item then display the tooltip next to this one
        if (item2 != null) {
            var info2 = this.getItemTooltipInfo(item2);
            info2.isCompareItem = true;

            $("#itemCompareTooltipExtra").html('Currently equipped');
            this.setItemTooltip(info2, 'CompareTooltip');

            $("#itemCompareTooltip").show();

            // Set the item tooltip's location
            $("#itemCompareTooltip").css('top', top - topReduction - 30);
            leftReduction += document.getElementById("itemCompareTooltip").scrollWidth;
            $("#itemCompareTooltip").css('left', (left - leftReduction - 40));

            // If there is a 3rd item display that tooltip next to the second one
            if (item3 != null) {
                var info3 = this.getItemTooltipInfo(legacyGame.equipment.trinket2(), '');
                info3.isCompareItem = true;
                // Set the text of the item tooltip

                $("#itemCompareTooltip2Extra").html('Currently equipped');
                this.setItemTooltip(info3, 'CompareTooltip2');
                $("#itemCompareTooltip2").show();

                // Set the item tooltip's location
                $("#itemCompareTooltip2").css('top', top - topReduction - 30);
                leftReduction += document.getElementById("itemCompareTooltip2").scrollWidth;
                $("#itemCompareTooltip2").css('left', left - leftReduction - 50);
            }
        }
    }

    this.displayBasicTooltip = function displayBasicTooltip(obj, text) {
        $("#basicTooltipText").html(text);
        $("#basicTooltip").show();

        // Set the tooltip's location
        var rect = obj.getBoundingClientRect();
        $("#basicTooltip").css('top', rect.top - 70);
        var leftReduction = document.getElementById("basicTooltip").scrollWidth;
        $("#basicTooltip").css('left', (rect.left - leftReduction - 40));
    }
}