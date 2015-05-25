function Quest(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.typeId = typeId;
    this.typeAmount = typeAmount;
    this.goldReward = goldReward;
    this.expReward = expReward;
    this.buffReward = buffReward;

    this.originalKillCount = 0;
    this.killCount = 0;

    this.complete = false;

    // The Id that this quest will use to display in the quests window
    this.displayId = legacyGame.questsManager.quests.length + 1;

    this.update = function update() {
        // Update this quest depending on the type that it is
        switch (this.type) {
            // Kill Quest - Check if the amount of monsters required has been met
            case QuestType.KILL:
                if (this.killCount >= this.typeAmount) {
                    this.complete = true;
                }
                break;
            // Mercenary Quest - Check if the amount of mercenaries required has been met
            case QuestType.MERCENARIES:
                switch (this.typeId) {
                    case 0:
                        if (legacyGame.mercenaryManager.footmenOwned >= this.typeAmount) {
                            this.complete = true;
                        }
                        break;
                    case 1:
                        if (legacyGame.mercenaryManager.clericsOwned >= this.typeAmount) {
                            this.complete = true;
                        }
                        break;
                    case 2:
                        if (legacyGame.mercenaryManager.commandersOwned >= this.typeAmount) {
                            this.complete = true;
                        }
                        break;
                    case 3:
                        if (legacyGame.mercenaryManager.magesOwned >= this.typeAmount) {
                            this.complete = true;
                        }
                        break;
                    case 4:
                        if (legacyGame.mercenaryManager.assassinsOwned >= this.typeAmount) {
                            this.complete = true;
                        }
                        break;
                    case 5:
                        if (legacyGame.mercenaryManager.warlocksOwned >= this.typeAmount) {
                            this.complete = true;
                        }
                        break;
                }
                break;
            // Upgrade Quest - Check if the required upgrade has been purchased
            case QuestType.UPGRADE:
                if (legacyGame.upgradeManager.upgrades[this.typeId].purchased) {
                    this.complete = true;
                }
                break;
        }
    }

    this.grantReward = function grantReward() {
        game.gainGold(this.goldReward, false);
        legacyGame.stats.goldFromQuests += legacyGame.player.lastGoldGained;
        game.gainExperience(this.expReward, false);
        legacyGame.stats.experienceFromQuests += legacyGame.player.lastExperienceGained;
        if (this.buffReward != null) {
            legacyGame.player.buffs.addBuff(this.buffReward);
        }
    }
}