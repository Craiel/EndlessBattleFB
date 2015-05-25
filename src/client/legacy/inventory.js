function Inventory() {
    this.slots = new Array();
    this.maxSlots = 25;

    // Initialize the slots
    for (var x = 0; x < this.maxSlots; x++) {
        this.slots[x] = null;
    }

    // Loot an item if there is room
    this.lootItem = function lootItem(item) {
        for (var x = 0; x < this.maxSlots; x++) {
            if (this.slots[x] == null) {
                this.slots[x] = item;
                legacyGame.stats.itemsLooted++;
                break;
            }
        }
    }

    // Swap the location of two items in the inventory
    this.swapItems = function swapItems(index1, index2) {
        var savedItem = this.slots[index1];

        this.slots[index1] = this.slots[index2];

        this.slots[index2] = savedItem;
    }

    // Remove an item from the inventory
    this.removeItem = function removeItem(index) {
        this.slots[index] = null;
    }

    // Add an item to a specified slot
    this.addItemToSlot = function addItemToSlot(item, index) {
        this.slots[index] = item;
    }

    // Sell an item in a specified slot
    this.sellItem = function sellItem(slot) {
        if (this.slots[slot] != null) {
            // Get the sell value and give the gold to the player; don't use the gainGold function as it will include gold gain bonuses
            var value = this.slots[slot].sellValue;
            legacyGame.player.gold += value;
            // Remove the item and hide the tooltip
            this.removeItem(slot);

            legacyGame.stats.itemsSold++;
            legacyGame.stats.goldFromItems += value;
        }
    }

    // Sell every item in the player's inventory
    this.sellAll = function sellAll() {
        for (var x = 0; x < this.slots.length; x++) {
            this.sellItem(x);
        }
    }

    this.save = function save() {
        localStorage.inventorySaved = true;
        localStorage.inventorySlots = JSON.stringify(this.slots);
    }

    this.load = function load() {
        if (localStorage.inventorySaved != null) {
            this.slots = JSON.parse(localStorage.inventorySlots);
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