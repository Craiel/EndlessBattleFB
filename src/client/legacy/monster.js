function Monster(name, level, rarity, health, damage, armour, goldWorth, experienceWorth) {
    this.name = name;
    this.level = level;
    this.rarity = rarity;
    this.health = health;
    this.maxHealth = health;
    this.canAttack = true;
    this.damage = damage;
    this.armour = armour;
    this.goldWorth = goldWorth;
    this.experienceWorth = experienceWorth;

    this.debuffs = new DebuffManager();
    this.debuffIconLeftPositionBase = 325;
    this.debuffIconTopPosition = 0;
    this.debuffLeftPositionIncrement = 30;

    this.lastDamageTaken = 0;
    this.alive = true;

    this.getRandomLoot = function getRandomLoot() {
        var loot = new Loot();
        loot.gold = this.goldWorth;
        loot.item = legacyGame.itemCreator.createRandomItem(this.level, legacyGame.itemCreator.getRandomItemRarity(this.rarity));
        return loot;
    }

    this.takeDamage = function takeDamage(damage, isCritical, displayParticle) {
        this.health -= damage;
        this.lastDamageTaken = damage;
        legacyGame.stats.damageDealt += damage;

        // Create the player's damage particle
        if (displayParticle) {
            if (isCritical) {
                legacyGame.particleManager.createParticle(Math.round(this.lastDamageTaken), ParticleType.PLAYER_CRITICAL);
            }
            else {
                legacyGame.particleManager.createParticle(Math.round(this.lastDamageTaken), ParticleType.PLAYER_DAMAGE);
            }
        }

        if (this.health <= 0) {
            this.alive = false;
            legacyGame.stats.monstersKilled++;
        }

        return damage;
    }

    // Add a debuff to this monster of the specified type, damage and duration
    this.addDebuff = function addDebuff(type, damage, duration) {
        switch (type) {
            case DebuffType.BLEED:
                // If the monster is not currently bleeding then show the bleeding icon
                if (this.debuffs.bleeding == false) {
                    $("#monsterBleedingIcon").show();

                    // Calculate the position of the icon depending on how many debuffs the monster has
                    var left = this.debuffIconLeftPositionBase;
                    if (this.debuffs.burning) { left += this.debuffLeftPositionIncrement; }
                    if (this.debuffs.chilled) { left += this.debuffLeftPositionIncrement; }

                    // Set the position
                    $("#monsterBleedingIcon").css('left', left + 'px');
                }
                // Check to see if the player has any Rupture effects
                var effects = legacyGame.player.getEffectsOfType(EffectType.RUPTURE);
                var maxStacks = 5;
                if (effects.length > 0) {
                    for (var x = 0; x < effects.length; x++) {
                        maxStacks += effects[x].value;
                    }
                }
                this.debuffs.bleeding = true;
                this.debuffs.bleedDamage = damage;
                this.debuffs.bleedDuration = 0;
                this.debuffs.bleedMaxDuration = duration;
                this.debuffs.bleedStacks += effects.length + 1
                if (this.debuffs.bleedStacks > maxStacks) { this.debuffs.bleedStacks = maxStacks; }
                document.getElementById("monsterBleedingStacks").innerHTML = this.debuffs.bleedStacks;
                break;
            case DebuffType.BURN:
                // If the monster is not currently burning then show the burning icon
                if (this.debuffs.burning == false) {
                    $("#monsterBurningIcon").show();

                    // Calculate the position of the icon depending on how many debuffs the monster has
                    var left = this.debuffIconLeftPositionBase;
                    if (this.debuffs.bleeding) { left += this.debuffLeftPositionIncrement; }
                    if (this.debuffs.chilled) { left += this.debuffLeftPositionIncrement; }

                    // Set the position
                    $("#monsterBurningIcon").css('left', left + 'px');
                }
                this.debuffs.burning = true;
                this.debuffs.burningDamage = damage;
                this.debuffs.burningDuration = 0;
                this.debuffs.burningMaxDuration = duration;
                // Check to see if the player has any Combustion effects allowing them to stack burning
                var effects = legacyGame.player.getEffectsOfType(EffectType.COMBUSTION);
                var maxStacks = 0;
                if (effects.length > 0) {
                    for (var x = 0; x < effects.length; x++) {
                        maxStacks += effects[x].value;
                    }
                }
                // Add a stack if possible
                if (maxStacks > this.debuffs.burningStacks) {
                    this.debuffs.burningStacks++;
                }
                if (this.debuffs.burningStacks == 0) { this.debuffs.burningStacks = 1; }
                document.getElementById("monsterBurningStacks").innerHTML = this.debuffs.burningStacks;
                break;
            case DebuffType.CHILL:
                // If the monster is not currently chilled then show the chilled icon
                if (this.debuffs.chilled == false) {
                    $("#monsterChilledIcon").show();

                    // Calculate the position of the icon depending on how many debuffs the monster has
                    var left = this.debuffIconLeftPositionBase;
                    if (this.debuffs.bleeding) { left += this.debuffLeftPositionIncrement; }
                    if (this.debuffs.burning) { left += this.debuffLeftPositionIncrement; }

                    // Set the position
                    $("#monsterChilledIcon").css('left', left + 'px');
                }
                this.debuffs.chilled = true;
                this.debuffs.chillDuration = 0;
                this.debuffs.chillMaxDuration = duration;
                break;
        }
    }

    // Update all the debuffs on this monster
    this.updateDebuffs = function updateDebuffs() {
        // Update all the debuffs on this monster
        // If there are bleed stacks on this monster
        if (this.debuffs.bleeding) {
            // Cause the monster to take damage
            game.monsterTakeDamage(this.debuffs.bleedDamage * this.debuffs.bleedStacks, false, false);
            // Increase the duration of this debuff
            this.debuffs.bleedDuration++;
            // If the debuff has expired then remove it
            if (this.debuffs.bleedDuration >= this.debuffs.bleedMaxDuration) {
                // Hide the icon and decrease the left position of the other icons
                $("#monsterBleedingIcon").hide();
                $("#monsterBurningIcon").css('left', ($("#monsterBurningIcon").position().left - this.debuffLeftPositionIncrement) + 'px');
                $("#monsterChilledIcon").css('left', ($("#monsterChilledIcon").position().left - this.debuffLeftPositionIncrement) + 'px');

                this.debuffs.bleeding = false;
                this.debuffs.bleedDamage = 0;
                this.debuffs.bleedDuration = 0;
                this.debuffs.bleedMaxDuration = 0;
                this.debuffs.bleedStacks = 0;
            }
        }

        // If this monster is burning
        if (this.debuffs.burning) {
            game.monsterTakeDamage(this.debuffs.burningDamage * this.debuffs.burningStacks, false, false);
            // Increase the duration of this debuff
            this.debuffs.burningDuration++;
            // If the debuff has expired then remove it
            if (this.debuffs.burningDuration >= this.debuffs.burningMaxDuration) {
                $("#monsterBurningIcon").hide();
                $("#monsterBleedingIcon").css('left', ($("#monsterBleedingIcon").position().left - this.debuffLeftPositionIncrement) + 'px');
                $("#monsterChilledIcon").css('left', ($("#monsterChilledIcon").position().left - this.debuffLeftPositionIncrement) + 'px');

                this.debuffs.burningStacks = 0;
                this.debuffs.burningDamage = 0;
                this.debuffs.burningDuration = 0;
                this.debuffs.burningMaxDuration = 0;
                this.debuffs.burning = false;
            }
        }

        // If this monster is chilled
        if (this.debuffs.chilled) {
            // If the chill duration is even then the monster can't attack this turn
            if (this.canAttack) {
                this.canAttack = false;
            }
            else { this.canAttack = true; }
            // Increase the duration of this debuff
            this.debuffs.chillDuration++;
            // If the debuff has expired then remove it
            if (this.debuffs.chillDuration >= this.debuffs.chillMaxDuration) {
                // Hide the icon and decrease the left position of the other icons
                $("#monsterChilledIcon").hide();
                $("#monsterBleedingIcon").css('left', ($("#monsterBleedingIcon").position().left - this.debuffLeftPositionIncrement) + 'px');
                $("#monsterBurningIcon").css('left', ($("#monsterBurningIcon").position().left - this.debuffLeftPositionIncrement) + 'px');

                this.debuffs.chillDuration = 0;
                this.debuffs.chillMaxDuration = 0;
                this.debuffs.chilled = false;
            }
        }
        // If the monster is not chilled then it can attack
        else { this.canAttack = true; }
    }
}