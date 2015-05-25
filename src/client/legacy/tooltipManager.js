function TooltipManager() {
    this.displayItemTooltip = function displayItemTooltip(item1, item2, item3, left, top, canSell) {
        // Get the item type
        var type = '';
        switch (item1.type) {
            case ItemType.HELM: type = "Helmet "; break;
            case ItemType.SHOULDERS: type = "Shoulders "; break;
            case ItemType.CHEST: type = "Chest "; break;
            case ItemType.LEGS: type = "Legs "; break;
            case ItemType.WEAPON: type = "Weapon "; break;
            case ItemType.GLOVES: type = "Gloves "; break;
            case ItemType.BOOTS: type = "Boots "; break;
            case ItemType.TRINKET: type = "Trinket "; break;
            case ItemType.OFF_HAND: type = "Off-Hand "; break;
        }

        // Get all the items stats
        var stats1 = '';
        var stats2 = '';
        if (item1.minDamage > 0) { stats1 += item1.minDamage + " - " + item1.maxDamage + " Damage"; }
        if (item1.armour > 0) { stats1 += (item1.armour + item1.armourBonus) + " Armour"; }
        if (item1.strength > 0) { stats2 += "<br>Strength: " + item1.strength; }
        if (item1.agility > 0) { stats2 += "<br>Agility: " + item1.agility; }
        if (item1.stamina > 0) { stats2 += "<br>Stamina: " + item1.stamina; }
        if (item1.health > 0) { stats2 += "<br>Health: " + item1.health; }
        if (item1.hp5 > 0) { stats2 += "<br>Hp5: " + item1.hp5; }
        if (item1.critChance > 0) { stats2 += "<br>Crit Chance: " + item1.critChance + "%"; }
        if (item1.critDamage > 0) { stats2 += "<br>Crit Damage: " + item1.critDamage + "%"; }
        if (item1.itemRarity > 0) { stats2 += "<br>Item Rarity: " + item1.itemRarity + "%"; }
        if (item1.goldGain > 0) { stats2 += "<br>Gold Gain: " + item1.goldGain + "%"; }
        if (item1.experienceGain > 0) { stats2 += "<br>Experience Gain: " + item1.experienceGain + "%"; }
        if (item1.evasion > 0) { stats2 += "<br>Evasion: " + item1.evasion; }
        var effect;
        var name;
        for (var x = 0; x < item1.effects.length; x++) {
            effect = item1.effects[x];
            stats2 += '<span class="yellowText">' + "<br>" + effect.getDescription();
        }

        // Set the item tooltip's colours to reflect the item's rarity
        if (item1.rarity == ItemRarity.COMMON) {
            $("#itemTooltip").css('border-color', '#fff'); $(".equipButton").css('border-color', '#fff');
            $("#itemTooltipTitle").html('<span class="whiteText">' + item1.name + '<br></span>');
        }
        if (item1.rarity == ItemRarity.UNCOMMON) {
            $("#itemTooltip").css('border-color', '#00ff05'); $(".equipButton").css('border-color', '#00ff05');
            $("#itemTooltipTitle").html('<span class="greenText">' + item1.name + '<br></span>');
        }
        if (item1.rarity == ItemRarity.RARE) {
            $("#itemTooltip").css('border-color', '#0005ff'); $(".equipButton").css('border-color', '#0005ff');
            $("#itemTooltipTitle").html('<span class="blueText">' + item1.name + '<br></span>');
        }
        if (item1.rarity == ItemRarity.EPIC) {
            $("#itemTooltip").css('border-color', '#b800af'); $(".equipButton").css('border-color', '#b800af');
            $("#itemTooltipTitle").html('<span class="purpleText">' + item1.name + '<br></span>');
        }
        if (item1.rarity == ItemRarity.LEGENDARY) {
            $("#itemTooltip").css('border-color', '#ff6a00'); $(".equipButton").css('border-color', '#ff6a00');
            $("#itemTooltipTitle").html('<span class="orangeText">' + item1.name + '<br></span>');
        }

        // Set the type
        $("#itemTooltipType").html(type + '<br>');
        // If there is an armour or damage bonus, change the armour/damage colour to green
        if (item1.armourBonus > 0) {
            $("#itemTooltipStats1").html('<span class="greenText">' + (item1.armour + item1.armourBonus) + '<span class="whiteText"> Armour<br></span></span>');
        }
        else if (item1.damageBonus > 0) {
            $("#itemTooltipStats1").html('<span class="greenText">' + (item1.minDamage + item1.damageBonus) + ' - ' + (item1.maxDamage + item1.damageBonus) + '<span class="whiteText"> Damage<br></span></span>');
        }
        else {
            $("#itemTooltipStats1").html(stats1 + '<br>');
        }
        // Set the rest of the tooltip
        $("#itemTooltipStats2").html(stats2);
        $("#itemTooltipSellValue").html(item1.sellValue);
        $("#itemTooltipLevel").html('Item Level ' + item1.level);
        $("#itemTooltipUseInfo").html('[Right-click to equip]');
        // If the player can sell this item from where it is then add that to the tooltip
        if (canSell) {
            $("#itemTooltipSellInfo").html('[Shift-click to sell]');
        }
        else { $("#itemTooltipSellInfo").html(''); }
        $("#itemTooltip").show();

        // Set the item tooltip's location
        var topReduction = document.getElementById("itemTooltip").scrollHeight;
        $("#itemTooltip").css('top', top - topReduction - 30);
        var leftReduction = document.getElementById("itemTooltip").scrollWidth;
        $("#itemTooltip").css('left', left - leftReduction - 30);

        // If there is another item then display the tooltip next to this one
        if (item2 != null) {
            // Set the text of the item tooltip
            var type2 = '';
            switch (item2.type) {
                case ItemType.HELM: type2 = "Helmet "; break;
                case ItemType.SHOULDERS: type2 = "Shoulders "; break;
                case ItemType.CHEST: type2 = "Chest "; break;
                case ItemType.LEGS: type2 = "Legs "; break;
                case ItemType.WEAPON: type2 = "Weapon "; break;
                case ItemType.GLOVES: type2 = "Gloves "; break;
                case ItemType.BOOTS: type2 = "Boots "; break;
                case ItemType.TRINKET: type2 = "Trinket "; break;
                case ItemType.OFF_HAND: type2 = "Off-Hand "; break;
            }
            stats1 = '';
            stats2 = '';
            if (item2.minDamage > 0) { stats1 += item2.minDamage + " - " + item2.maxDamage + " Damage"; }
            if (item2.armour > 0) { stats1 += (item2.armour + item2.armourBonus) + " Armour"; }
            if (item2.strength > 0) { stats2 += "<br>Strength: " + item2.strength; }
            if (item2.agility > 0) { stats2 += "<br>Agility: " + item2.agility; }
            if (item2.stamina > 0) { stats2 += "<br>Stamina: " + item2.stamina; }
            if (item2.health > 0) { stats2 += "<br>Health: " + item2.health; }
            if (item2.hp5 > 0) { stats2 += "<br>Hp5: " + item2.hp5; }
            if (item2.critChance > 0) { stats2 += "<br>Crit Chance: " + item2.critChance + "%"; }
            if (item2.critDamage > 0) { stats2 += "<br>Crit Damage: " + item2.critDamage + "%"; }
            if (item2.itemRarity > 0) { stats2 += "<br>Item Rarity: " + item2.itemRarity + "%"; }
            if (item2.goldGain > 0) { stats2 += "<br>Gold Gain: " + item2.goldGain + "%"; }
            if (item2.experienceGain > 0) { stats2 += "<br>Experience Gain: " + item2.experienceGain + "%"; }
            if (item2.evasion > 0) { stats2 += "<br>Evasion: " + item2.evasion; }
            var effect;
            var name;
            for (var x = 0; x < item2.effects.length; x++) {
                effect = item2.effects[x];
                stats2 += '<span class="yellowText">' + "<br>" + effect.getDescription();
            }

            $("#itemCompareTooltipExtra").html('Currently equipped');
            // Set the item tooltip's colours to reflect the item's rarity
            if (item2.rarity == ItemRarity.COMMON) {
                $("#itemCompareTooltip").css('border-color', '#fff'); $(".equipButton").css('border-color', '#fff');
                $("#itemCompareTooltipTitle").html('<span class="whiteText">' + item2.name + '<br></span>');
            }
            if (item2.rarity == ItemRarity.UNCOMMON) {
                $("#itemCompareTooltip").css('border-color', '#00ff05'); $(".equipButton").css('border-color', '#00ff05');
                $("#itemCompareTooltipTitle").html('<span class="greenText">' + item2.name + '<br></span>');
            }
            if (item2.rarity == ItemRarity.RARE) {
                $("#itemCompareTooltip").css('border-color', '#0005ff'); $(".equipButton").css('border-color', '#0005ff');
                $("#itemCompareTooltipTitle").html('<span class="blueText">' + item2.name + '<br></span>');
            }
            if (item2.rarity == ItemRarity.EPIC) {
                $("#itemCompareTooltip").css('border-color', '#b800af'); $(".equipButton").css('border-color', '#b800af');
                $("#itemCompareTooltipTitle").html('<span class="purpleText">' + item2.name + '<br></span>');
            }
            if (item2.rarity == ItemRarity.LEGENDARY) {
                $("#itemCompareTooltip").css('border-color', '#ff6a00'); $(".equipButton").css('border-color', '#ff6a00');
                $("#itemCompareTooltipTitle").html('<span class="orangeText">' + item2.name + '<br></span>');
            }

            $("#itemCompareTooltipType").html(type + '<br>');
            if (item2.armourBonus > 0) {
                $("#itemCompareTooltipStats1").html('<span class="greenText">' + (item2.armour + item2.armourBonus) + '<span class="whiteText"> Armour<br></span></span>');
            }
            else if (item2.damageBonus > 0) {
                $("#itemCompareTooltipStats1").html('<span class="greenText">' + (item2.minDamage + item2.damageBonus) + ' - ' + (item2.maxDamage + item2.damageBonus) + '<span class="whiteText"> Damage<br></span></span>');
            }
            else {
                $("#itemCompareTooltipStats1").html(stats1 + '<br>');
            }
            $("#itemCompareTooltipStats2").html(stats2);
            $("#itemCompareTooltipSellValue").html(item2.sellValue);
            $("#itemCompareTooltipLevel").html('Item Level ' + item2.level);
            $("#itemCompareTooltipUseInfo").html('');
            $("#itemCompareTooltipSellInfo").html('');
            $("#itemCompareTooltip").show();

            // Set the item tooltip's location
            $("#itemCompareTooltip").css('top', top - topReduction - 30);
            leftReduction += document.getElementById("itemCompareTooltip").scrollWidth;
            $("#itemCompareTooltip").css('left', (left - leftReduction - 40));

            // If there is a 3rd item display that tooltip next to the second one
            if (item3 != null) {
                // Set the text of the item tooltip
                var type3 = 'Trinket ';
                var item3 = legacyGame.equipment.trinket2();
                stats1 = '';
                stats2 = '';
                if (item3.minDamage > 0) { stats1 += item3.minDamage + " - " + item3.maxDamage + " Damage"; }
                if (item3.armour > 0) { stats1 += (item3.armour + item3.armourBonus) + " Armour"; }
                if (item3.strength > 0) { stats2 += "<br>Strength: " + item3.strength; }
                if (item3.agility > 0) { stats2 += "<br>Agility: " + item3.agility; }
                if (item3.stamina > 0) { stats2 += "<br>Stamina: " + item3.stamina; }
                if (item3.health > 0) { stats2 += "<br>Health: " + item3.health; }
                if (item3.hp5 > 0) { stats2 += "<br>Hp5: " + item3.hp5; }
                if (item3.critChance > 0) { stats2 += "<br>Crit Chance: " + item3.critChance + "%"; }
                if (item3.critDamage > 0) { stats2 += "<br>Crit Damage: " + item3.critDamage + "%"; }
                if (item3.itemRarity > 0) { stats2 += "<br>Item Rarity: " + item3.itemRarity + "%"; }
                if (item3.goldGain > 0) { stats2 += "<br>Gold Gain: " + item3.goldGain + "%"; }
                if (item3.experienceGain > 0) { stats2 += "<br>Experience Gain: " + item3.experienceGain + "%"; }
                if (item3.evasion > 0) { stats2 += "<br>Evasion: " + item3.evasion; }
                var effect;
                var name;
                for (var x = 0; x < item3.effects.length; x++) {
                    effect = item3.effects[x];
                    stats2 += '<span class="yellowText">' + "<br>" + effect.getDescription();
                }

                $("#itemCompareTooltip2Extra").html('Currently equipped');
                // Set the item tooltip's colours to reflect the item's rarity
                if (item3.rarity == ItemRarity.COMMON) {
                    $("#itemCompareTooltip2").css('border-color', '#fff'); $(".equipButton").css('border-color', '#fff');
                    $("#itemCompareTooltip2Title").html('<span class="whiteText">' + item3.name + '<br></span>');
                }
                if (item3.rarity == ItemRarity.UNCOMMON) {
                    $("#itemCompareTooltip2").css('border-color', '#00ff05'); $(".equipButton").css('border-color', '#00ff05');
                    $("#itemCompareTooltip2Title").html('<span class="greenText">' + item3.name + '<br></span>');
                }
                if (item3.rarity == ItemRarity.RARE) {
                    $("#itemCompareTooltip2").css('border-color', '#0005ff'); $(".equipButton").css('border-color', '#0005ff');
                    $("#itemCompareTooltip2Title").html('<span class="blueText">' + item3.name + '<br></span>');
                }
                if (item3.rarity == ItemRarity.EPIC) {
                    $("#itemCompareTooltip2").css('border-color', '#b800af'); $(".equipButton").css('border-color', '#b800af');
                    $("#itemCompareTooltip2Title").html('<span class="purpleText">' + item3.name + '<br></span>');
                }
                if (item3.rarity == ItemRarity.LEGENDARY) {
                    $("#itemCompareTooltip2").css('border-color', '#ff6a00'); $(".equipButton").css('border-color', '#ff6a00');
                    $("#itemCompareTooltip2Title").html('<span class="orangeText">' + item3.name + '<br></span>');
                }

                $("#itemCompareTooltip2Type").html(type + '<br>');
                if (item3.armourBonus > 0) {
                    $("#itemCompareTooltip2Stats1").html('<span class="greenText">' + (item3.armour + item3.armourBonus) + '<span class="whiteText"> Armour<br></span></span>');
                }
                else if (item3.damageBonus > 0) {
                    $("#itemCompareTooltip2Stats1").html('<span class="greenText">' + (item3.minDamage + item3.damageBonus) + ' - ' + (item3.maxDamage + item3.damageBonus) + '<span class="whiteText"> Damage<br></span></span>');
                }
                else {
                    $("#itemCompareTooltip2Stats1").html(stats1 + '<br>');
                }
                $("#itemCompareTooltip2Stats2").html(stats2);
                $("#itemCompareTooltip2SellValue").html(item3.sellValue);
                $("#itemCompareTooltip2Level").html('Item Level ' + item3.level);
                $("#itemCompareTooltip2UseInfo").html('');
                $("#itemCompareTooltip2SellInfo").html('');
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