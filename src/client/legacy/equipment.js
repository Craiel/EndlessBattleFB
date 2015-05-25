function Equipment() {
    this.slots = new Array();
    for (var x = 0; x < 10; x++) {
        this.slots[x] = null;
    }

    this.helm = function helm() { return this.slots[0]; };
    this.shoulders = function shoulders() { return this.slots[1]; };
    this.chest = function chest() { return this.slots[2]; };
    this.legs = function legs() { return this.slots[3]; };
    this.weapon = function weapon() { return this.slots[4]; };

    this.gloves = function gloves() { return this.slots[5]; };
    this.boots = function boots() { return this.slots[6]; };
    this.trinket1 = function trinket1() { return this.slots[7]; };
    this.trinket2 = function trinket2() { return this.slots[8]; };
    this.off_hand = function off_hand() { return this.slots[9]; };

    this.equipItem = function equipItem(item, currentSlotIndex) {
        if (item == null) { return; }

        // Check that the item can be equipped
        var equippable = false;
        if (item.type == ItemType.HELM || item.type == ItemType.SHOULDERS || item.type == ItemType.CHEST ||
            item.type == ItemType.LEGS || item.type == ItemType.WEAPON || item.type == ItemType.GLOVES ||
            item.type == ItemType.BOOTS || item.type == ItemType.TRINKET || item.type == ItemType.TRINKET ||
            item.type == ItemType.OFF_HAND) {
            equippable = true;
        }

        // Calculate which slot this item will go into
        var newSlotIndex = 0;
        switch (item.type) {
            case ItemType.HELM: newSlotIndex = 0; break;
            case ItemType.SHOULDERS: newSlotIndex = 1; break;
            case ItemType.CHEST: newSlotIndex = 2; break;
            case ItemType.LEGS: newSlotIndex = 3; break;
            case ItemType.WEAPON: newSlotIndex = 4; break;
            case ItemType.GLOVES: newSlotIndex = 5; break;
            case ItemType.BOOTS: newSlotIndex = 6; break;
            case ItemType.TRINKET:
                // Either select the first empty trinket slot, or the first one if both arre occupied
                if (this.slots[7] == null) {
                    newSlotIndex = 7;
                }
                else if (this.slots[8] == null) {
                    newSlotIndex = 8;
                }
                else {
                    newSlotIndex = 7;
                }
                break;
            case ItemType.OFF_HAND: newSlotIndex = 9; break;
        }

        // If the item is equippable then equip it
        if (equippable) {
            // If the slot is empty then just equip it
            if (this.slots[newSlotIndex] == null) {
                this.slots[newSlotIndex] = item;
                legacyGame.inventory.removeItem(currentSlotIndex);

                legacyGame.player.gainItemsStats(item);
            }
            // If there is already an item in this slot, then swap the two items
            else {
                // Save the equipped item
                var savedItem = this.slots[newSlotIndex];

                // Change the equipped item
                this.slots[newSlotIndex] = item;
                legacyGame.player.gainItemsStats(item);

                // Change the inventory item
                legacyGame.inventory.addItemToSlot(savedItem, currentSlotIndex);
                legacyGame.player.loseItemsStats(savedItem);
            }

            // If there is a new item in the old slot, change the tooltip
            if (legacyGame.inventory.slots[currentSlotIndex] != null) {
                var item = legacyGame.inventory.slots[currentSlotIndex];
                // If there is already an item equipped in the slot this item would go into, then get that item
                // Get the slot Id if there is an item equipped
                var equippedSlot = -1
                var twoTrinkets = false;
                switch (item.type) {
                    case ItemType.HELM:         if (legacyGame.equipment.helm() != null) { equippedSlot = 0 } break;
                    case ItemType.SHOULDERS:    if (legacyGame.equipment.shoulders() != null) { equippedSlot = 1; } break;
                    case ItemType.CHEST:        if (legacyGame.equipment.chest() != null) { equippedSlot = 2; } break;
                    case ItemType.LEGS:         if (legacyGame.equipment.legs() != null) { equippedSlot = 3; } break;
                    case ItemType.WEAPON:       if (legacyGame.equipment.weapon() != null) { equippedSlot = 4; } break;
                    case ItemType.GLOVES:       if (legacyGame.equipment.gloves() != null) { equippedSlot = 5; } break;
                    case ItemType.BOOTS:        if (legacyGame.equipment.boots() != null) { equippedSlot = 6; } break;
                    case ItemType.TRINKET:      if (legacyGame.equipment.trinket1() != null || legacyGame.equipment.trinket2() != null) {
                        equippedSlot = 7;
                        // Check to see if there are two trinkets equipped, then we will need to show two compare tooltips
                        if (legacyGame.equipment.trinket1() != null && legacyGame.equipment.trinket2() != null) {
                            twoTrinkets = true;
                        }
                    }
                        break;
                    case ItemType.OFF_HAND:     if (legacyGame.equipment.off_hand() != null) { equippedSlot = 9; } break;
                }
                var item2 = legacyGame.equipment.slots[equippedSlot];

                // If the item type is a trinket and there are two trinkets equipped then we need to display two compare tooltips
                if (twoTrinkets) {
                    var item3 = legacyGame.equipment.trinket2();
                }

                // Get the item slot's location
                var slot = document.getElementById("inventoryItem" + (currentSlotIndex + 1));
                var rect = slot.getBoundingClientRect();

                // Display the tooltip
                legacyGame.tooltipManager.displayItemTooltip(item, item2, item3, rect.left, rect.top, true);
            }
            // Else hide the tooltip
            else {
                $("#itemTooltip").hide();
                $("#itemCompareTooltip").hide();
                $("#itemCompareTooltip2").hide();
            }
        }
    }

    // Equip a trinket into the second slot
    this.equipSecondTrinket = function equipSecondTrinket(item, itemSlot) {
        if (item.type == ItemType.TRINKET) {
            this.equipItemInSlot(item, 8, itemSlot);

            // If there is a new item in the old slot, change the tooltip
            if (legacyGame.inventory.slots[itemSlot] != null) {
                var item = legacyGame.inventory.slots[itemSlot];
                // If there is already an item equipped in the slot this item would go into, then get that item
                // Get the slot Id if there is an item equipped
                var equippedSlot = -1
                var twoTrinkets = false;
                switch (item.type) {
                    case ItemType.HELM: if (legacyGame.equipment.helm() != null) { equippedSlot = 0 } break;
                    case ItemType.SHOULDERS: if (legacyGame.equipment.shoulders() != null) { equippedSlot = 1; } break;
                    case ItemType.CHEST: if (legacyGame.equipment.chest() != null) { equippedSlot = 2; } break;
                    case ItemType.LEGS: if (legacyGame.equipment.legs() != null) { equippedSlot = 3; } break;
                    case ItemType.WEAPON: if (legacyGame.equipment.weapon() != null) { equippedSlot = 4; } break;
                    case ItemType.GLOVES: if (legacyGame.equipment.gloves() != null) { equippedSlot = 5; } break;
                    case ItemType.BOOTS: if (legacyGame.equipment.boots() != null) { equippedSlot = 6; } break;
                    case ItemType.TRINKET: if (legacyGame.equipment.trinket1() != null || legacyGame.equipment.trinket2() != null) {
                        equippedSlot = 7;
                        // Check to see if there are two trinkets equipped, then we will need to show two compare tooltips
                        if (legacyGame.equipment.trinket1() != null && legacyGame.equipment.trinket2() != null) {
                            twoTrinkets = true;
                        }
                    }
                        break;
                    case ItemType.OFF_HAND: if (legacyGame.equipment.off_hand() != null) { equippedSlot = 9; } break;
                }
                var item2 = legacyGame.equipment.slots[equippedSlot];

                // If the item type is a trinket and there are two trinkets equipped then we need to display two compare tooltips
                if (twoTrinkets) {
                    var item3 = legacyGame.equipment.trinket2();
                }

                // Get the item slot's location
                var slot = document.getElementById("inventoryItem" + (itemSlot + 1));
                var rect = slot.getBoundingClientRect();

                // Display the tooltip
                legacyGame.tooltipManager.displayItemTooltip(item, item2, item3, rect.left, rect.top, true);
            }
            // Else hide the tooltip
            else {
                $("#itemTooltip").hide();
                $("#itemCompareTooltip").hide();
                $("#itemCompareTooltip2").hide();
            }
        }
    }

    this.equipItemInSlot = function equipItemInSlot(item, newSlotIndex, currentSlotIndex) {
        // Check that the item can be equipped in this slot
        var equippable = false;
        switch (newSlotIndex) {
            case 0: if (item.type == ItemType.HELM) { equippable = true; } break;
            case 1: if (item.type == ItemType.SHOULDERS) { equippable = true; } break;
            case 2: if (item.type == ItemType.CHEST) { equippable = true; } break;
            case 3: if (item.type == ItemType.LEGS) { equippable = true; } break;
            case 4: if (item.type == ItemType.WEAPON) { equippable = true; } break;
            case 5: if (item.type == ItemType.GLOVES) { equippable = true; } break;
            case 6: if (item.type == ItemType.BOOTS) { equippable = true; } break;
            case 7: if (item.type == ItemType.TRINKET) { equippable = true; } break;
            case 8: if (item.type == ItemType.TRINKET) { equippable = true; } break;
            case 9: if (item.type == ItemType.OFF_HAND) { equippable = true; } break;
        }

        // If the item is equippable then equip it
        if (equippable) {
            // If the slot is empty then just equip it
            if (this.slots[newSlotIndex] == null) {
                this.slots[newSlotIndex] = item;
                legacyGame.inventory.removeItem(currentSlotIndex);

                legacyGame.player.gainItemsStats(item);
            }
            // If there is already an item in this slot, then swap the two items
            else {
                // Save the equipped item
                var savedItem = this.slots[newSlotIndex];

                // Change the equipped item
                this.slots[newSlotIndex] = item;
                legacyGame.player.gainItemsStats(item);

                // Change the inventory item
                legacyGame.inventory.addItemToSlot(savedItem, currentSlotIndex);
                legacyGame.player.loseItemsStats(savedItem);
            }
        }
    }

    this.removeItem = function removeItem(index) {
        legacyGame.player.loseItemsStats(this.slots[index]);
        this.slots[index] = null;
    }

    // Unequip an item to the first available slot
    this.unequipItem = function unequipItem(slot) {
        // Find the first available slot
        var newSlot = -1;
        for (var x = 0; x < legacyGame.inventory.slots.length; x++) {
            if (legacyGame.inventory.slots[x] == null) {
                newSlot = x;
                break;
            }
        }

        // If there was an available slot; unequip the item
        if (newSlot != -1) {
            legacyGame.inventory.addItemToSlot(this.slots[slot], newSlot);
            this.removeItem(slot);
        }
    }

    // Attempt to remove an item from the equipment into a designated inventory slot
    this.unequipItemToSlot = function unequipItemToSlot(currentSlotIndex, newSlotIndex) {
        var inventorySlotItem = legacyGame.inventory.slots[newSlotIndex];

        // If the inventory slot contains no item, just send the item to it
        if (inventorySlotItem == null) {
            legacyGame.inventory.addItemToSlot(this.slots[currentSlotIndex], newSlotIndex);
            this.removeItem(currentSlotIndex);
        }
        // Else; check to see if the items are the same type
        else if (this.slots[currentSlotIndex].type == inventorySlotItem.type) {
            // If they are then swap them
            // Save the equipped item
            var savedItem = this.slots[currentSlotIndex];

            // Change the equipped item
            this.slots[currentSlotIndex] = inventorySlotItem;
            legacyGame.player.gainItemsStats(inventorySlotItem);

            // Change the inventory item
            legacyGame.inventory.addItemToSlot(savedItem, newSlotIndex);
            legacyGame.player.loseItemsStats(savedItem);
        }
    }

    // Swap the two trinket items
    this.swapTrinkets = function swapTrinkets() {
        // Save the first trinket
        var savedItem = this.slots[7];

        // Change the first slot item
        this.slots[7] = this.slots[8];

        // Change the second slot item
        this.slots[8] = savedItem;
    }

    this.save = function save() {
        localStorage.equipmentSaved = true;
        localStorage.equipmentSlots = JSON.stringify(this.slots);
    }

    this.load = function load() {
        if (localStorage.equipmentSaved != null) {
            this.slots = JSON.parse(localStorage.equipmentSlots);
            for (var x = 0; x < this.slots.length; x++) {
                if (this.slots[x] != null) {
                    if (this.slots[x].effects != null) {
                        for (var y = 0; y < this.slots[x].effects.length; y++) {
                            this.slots[x].effects[y] = new Effect(this.slots[x].effects[y].type, this.slots[x].effects[y].chance, this.slots[x].effects[y].value);
                        }
                    }
                    else { this.slots[x].effects = new Array(); }
                    if (this.slots[x].evasion == null) {
                        this.slots[x].evasion = 0;
                    }
                }
            }
        }
    }
}