function BuffManager() {
    this.buffs = new Array();

    this.addBuff = function addBuff(buff) {
        buff.id = this.buffs.length + 1;
        this.buffs.push(buff);
        legacyGame.displayAlert(buff.name);

        var newDiv = document.createElement('div');
        newDiv.id = 'buffContainer' + buff.id;
        newDiv.className = 'buffContainer';
        var container = document.getElementById("buffsArea");
        container.appendChild(newDiv);

        var newDiv2 = document.createElement('div');
        newDiv2.id = 'buffIcon' + buff.id;
        newDiv2.className = 'buffIcon';
        newDiv2.style.background = 'url("includes/images/buffIcons.png") ' + buff.leftPos + 'px ' + buff.topPos + 'px';
        newDiv.appendChild(newDiv2);

        var newDiv3 = document.createElement('div');
        newDiv3.id = 'buffBar' + buff.id;
        newDiv3.className = 'buffBar';
        newDiv3.style.width = '175px';
        newDiv.appendChild(newDiv3);
    }

    this.getDamageMultiplier = function getDamageMultiplier() {
        var multiplier = 0;
        for (var x = 0; x < this.buffs.length; x++) {
            if (this.buffs[x].type == BuffType.DAMAGE) {
                multiplier += this.buffs[x].multiplier;
            }
        }
        if (multiplier == 0) { multiplier = 1; }
        return multiplier;
    }
    this.getGoldMultiplier = function getGoldMultiplier() {
        var multiplier = 0;
        for (var x = 0; x < this.buffs.length; x++) {
            if (this.buffs[x].type == BuffType.GOLD) {
                multiplier += this.buffs[x].multiplier;
            }
        }
        if (multiplier == 0) { multiplier = 1; }
        return multiplier;
    }
    this.getExperienceMultiplier = function getExperienceMultiplier() {
        var multiplier = 0;
        for (var x = 0; x < this.buffs.length; x++) {
            if (this.buffs[x].type == BuffType.EXPERIENCE) {
                multiplier += this.buffs[x].multiplier;
            }
        }
        if (multiplier == 0) { multiplier = 1; }
        return multiplier;
    }

    this.update = function update(ms) {
        // Update all the buff durations
        for (var x = this.buffs.length - 1; x >= 0; x--) {
            this.buffs[x].currentDuration -= ms;
            // If the buff has expired, remove it and its elements, then update the id of all the other buffs that need updating
            if (this.buffs[x].currentDuration <= 0) {
                var buffContainer = document.getElementById('buffContainer' + (this.buffs.length));
                buffContainer.parentNode.removeChild(buffContainer);
                this.buffs.splice(x, 1);

                for (var y = x; y < this.buffs.length; y++) {
                    this.buffs[x].id--;
                }
            }
            else {
                var buffBar = document.getElementById('buffBar' + (x + 1));
                buffBar.style.width = (175 * (this.buffs[x].currentDuration / this.buffs[x].maxDuration)) + 'px';
            }
        }
    }

    this.getRandomQuestRewardBuff = function getRandomQuestRewardBuff() {
        switch (Math.floor(Math.random() * 9)) {
            case 0: return new Buff("Damage x2", BuffType.DAMAGE, 2, 60, 0, 0); break;
            case 1: return new Buff("Damage x4", BuffType.DAMAGE, 4, 60, 30, 0); break;
            case 2: return new Buff("Damage x7", BuffType.DAMAGE, 7, 60, 15, 0); break;
            case 3: return new Buff("Gold x2", BuffType.GOLD, 2, 60, 0, 30); break;
            case 4: return new Buff("Gold x4", BuffType.GOLD, 4, 60, 30, 30); break;
            case 5: return new Buff("Gold x7", BuffType.GOLD, 7, 60, 15, 30); break;
            case 6: return new Buff("Experience x2", BuffType.EXPERIENCE, 2, 60, 0, 15); break;
            case 7: return new Buff("Experience x4", BuffType.EXPERIENCE, 4, 60, 30, 15); break;
            case 8: return new Buff("Experience x7", BuffType.EXPERIENCE, 7, 60, 15, 15); break;
        }
    }
}