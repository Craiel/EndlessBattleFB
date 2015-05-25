function NameGenerator() {
    var rand;
    // ----- Prefixes -----
    // Damage Bonus
    this.getRandomDamageBonusName = function getRandomDamageBonusName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return DamageNames[rand];
    }
    // Health
    this.getRandomHealthName = function getRandomHealthName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return HealthNames[rand];
    }
    // Armour Bonus
    this.getRandomArmourBonusName = function getRandomArmourBonusName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return ArmourNames[rand];
    }
    // Crit Chance
    this.getRandomCritChanceName = function getRandomCritChanceName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return CritChanceNames[rand];
    }
    // Item Rarity
    this.getRandomItemRarityName = function getRandomItemRarityName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return ItemRarityNames[rand];
    }
    // Gold Gain
    this.getRandomGoldGainName = function getRandomGoldGainName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return GoldGainNames[rand];
    }

    // ----- Suffixes -----
    // Strength
    this.getRandomStrengthName = function getRandomStrengthName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return StrengthNames[rand];
    }
    // Agility
    this.getRandomAgilityName = function getRandomAgilityName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return AgilityNames[rand];
    }
    // Stamina
    this.getRandomStaminaName = function getRandomStaminaName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return StaminaNames[rand];
    }
    // Hp5
    this.getRandomHp5Name = function getRandomHp5Name() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return Hp5Names[rand];
    }
    // Crit Damage
    this.getRandomCritDamageName = function getRandomCritDamageName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return CritDamageNames[rand];
    }
    // Experience Gain
    this.getRandomExperienceGainName = function getRandomExperienceGainName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return ExperienceGainNames[rand];
    }
    // Evasion
    this.getRandomEvasionName = function getRandomEvasionName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return EvasionNames[rand];
    }
}