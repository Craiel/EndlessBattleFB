/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                 HELPER FUNCTIONS                                                      
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
// Enumerator Function
function Sigma(number) {
    total = 0;
    for (var x = 1; x <= number; x++) {
        total += x;
    }
    return total;
}

// Mouse position tracking
var mouseX = 0;
var mouseY = 0;
(function () {
    window.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        event = event || window.event; // IE-ism
        // event.clientX and event.clientY contain the mouse position
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
})();

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      PLAYER                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
 AttackType = new Object();
 AttackType.BASIC_ATTACK = "BASIC_ATTACK";
 AttackType.POWER_STRIKE = "POWER_STRIKE";
 AttackType.DOUBLE_STRIKE = "DOUBLE_STRIKE";

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                     ABILITIES                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
AbilityName = new Object();
AbilityName.REND = "REND";
AbilityName.REJUVENATING_STRIKES = "REJUVENATING_STRIKES";
AbilityName.ICE_BLADE = "ICE_BLADE";
AbilityName.FIRE_BLADE = "FIRE_BLADE";

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                   STAT UPGRADES                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
StatUpgradeType = new Object();
StatUpgradeType.DAMAGE = "DAMAGE";
StatUpgradeType.STRENGTH = "STRENGTH";
StatUpgradeType.AGILITY = "AGILITY";
StatUpgradeType.STAMINA = "STAMINA";
StatUpgradeType.HP5 = "HP5";
StatUpgradeType.ARMOUR = "ARMOUR";
StatUpgradeType.EVASION = "EVASION";
StatUpgradeType.CRIT_DAMAGE = "CRIT_DAMAGE";
StatUpgradeType.ITEM_RARITY = "ITEM_RARITY";
StatUpgradeType.GOLD_GAIN = "GOLD_GAIN";
StatUpgradeType.EXPERIENCE_GAIN = "EXPERIENCE_GAIN";
StatUpgradeType.amount = 10;

// A random stat the player can choose when they level up


/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      DEBUFFS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
DebuffType = new Object();
DebuffType.BLEED = "BLEED";
DebuffType.CHILL = "CHILL";
DebuffType.BURN = "BURN";



/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                    MERCENARIES                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
MercenaryType = new Object();
MercenaryType.FOOTMAN = "FOOTMAN";
MercenaryType.CLERIC = "CLERIC";
MercenaryType.COMMANDER = "COMMANDER";
MercenaryType.MAGE = "MAGE";
MercenaryType.ASSASSIN = "ASSASSIN";
MercenaryType.WARLOCK = "WARLOCK";


/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      QUESTS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
QuestType = new Object();
QuestType.KILL = "KILL";
QuestType.MERCENARIES = "MERCENARIES";
QuestType.UPGRADE = "UPGRADE";

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                       BUFFS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
BuffType = new Object();
BuffType.DAMAGE = "DAMAGE";
BuffType.GOLD = "GOLD";
BuffType.EXPERIENCE = "EXPERIENCE";

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      EVENTS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
EventType = new Object();
EventType.QUEST = "QUEST";
EventType.amount = 1;

QuestNamePrefixes = new Array("Clearing", "Reaping", "Destroying", "Removing", "Obliterating");
QuestNameSuffixes = new Array("Threat", "Swarm", "Horde", "Pillagers", "Ravagers");

function clickEventButton(obj, id) {
    legacyGame.eventManager.startEvent(obj, id);
}

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                       STATS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */


/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      MONSTER                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
MonsterRarity = new Object();
MonsterRarity.COMMON = "COMMON";
MonsterRarity.RARE = "RARE";
MonsterRarity.ELITE = "ELITE";
MonsterRarity.BOSS = "BOSS";


/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      OPTIONS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */

function skullParticlesOptionClick() {
    legacyGame.options.displaySkullParticles = !legacyGame.options.displaySkullParticles;
    if (legacyGame.options.displaySkullParticles) {
        document.getElementById("skullParticlesOption").innerHTML = "Monster death particles: ON";
    }
    else { document.getElementById("skullParticlesOption").innerHTML = "Monster death particles: OFF"; }
}
function goldParticlesOptionClick() {
    legacyGame.options.displayGoldParticles = !legacyGame.options.displayGoldParticles;
    if (legacyGame.options.displayGoldParticles) {
        document.getElementById("goldParticlesOption").innerHTML = "Gold particles: ON";
    }
    else { document.getElementById("goldParticlesOption").innerHTML = "Gold particles: OFF"; }
}
function experienceParticlesOptionClick() {
    legacyGame.options.displayExpParticles = !legacyGame.options.displayExpParticles;
    if (legacyGame.options.displayExpParticles) {
        document.getElementById("experienceParticlesOption").innerHTML = "Experience particles: ON";
    }
    else { document.getElementById("experienceParticlesOption").innerHTML = "Experience particles: OFF"; }
}
function playerDamageParticlesOptionClick() {
    legacyGame.options.displayPlayerDamageParticles = !legacyGame.options.displayPlayerDamageParticles;
    if (legacyGame.options.displayPlayerDamageParticles) {
        document.getElementById("playerDamageParticlesOption").innerHTML = "Player damage particles: ON";
    }
    else { document.getElementById("playerDamageParticlesOption").innerHTML = "Player damage particles: OFF"; }
}
function monsterDamageParticlesOptionClick() {
    legacyGame.options.displayMonsterDamageParticles = !legacyGame.options.displayMonsterDamageParticles;
    if (legacyGame.options.displayMonsterDamageParticles) {
        document.getElementById("monsterDamageParticlesOption").innerHTML = "Monster damage particles: ON";
    }
    else { document.getElementById("monsterDamageParticlesOption").innerHTML = "Monster damage particles: OFF"; }
}

function playerHealthOptionClick() {
    legacyGame.options.alwaysDisplayPlayerHealth = !legacyGame.options.alwaysDisplayPlayerHealth;
    if (legacyGame.options.alwaysDisplayPlayerHealth) {
        document.getElementById("playerHealthOption").innerHTML = "Always display player health: ON";
    }
    else { 
        document.getElementById("playerHealthOption").innerHTML = "Always display player health: OFF";
    }
}
function monsterHealthOptionClick() {
    legacyGame.options.alwaysDisplayMonsterHealth = !legacyGame.options.alwaysDisplayMonsterHealth;
    if (legacyGame.options.alwaysDisplayMonsterHealth) {
        document.getElementById("monsterHealthOption").innerHTML = "Always display monster health: ON";
        legacyGame.displayMonsterHealth = true;
    }
    else { 
        document.getElementById("monsterHealthOption").innerHTML = "Always display monster health: OFF"; 
        legacyGame.displayMonsterHealth = false;
    }
}
function expBarOptionClick() {
    legacyGame.options.alwaysDisplayExp = !legacyGame.options.alwaysDisplayExp;
    if (legacyGame.options.alwaysDisplayExp) {
        document.getElementById("expBarOption").innerHTML = "Always display experience: ON";
    }
    else { 
        document.getElementById("expBarOption").innerHTML = "Always display experience: OFF";
    }
}

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                PARTICLE MANAGER                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
var ParticleType = new Object();
ParticleType.SKULL = "SKULL";
ParticleType.GOLD = "GOLD";
ParticleType.EXP_ORB = "EXP_ORB";
ParticleType.PLAYER_DAMAGE = "PLAYER_DAMAGE";
ParticleType.PLAYER_CRITICAL = "PLAYER_CRITICAL";
ParticleType.MONSTER_DAMAGE = "MONSTER_DAMAGE";

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                       ITEM                                                      
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
var Prefixes = new Array("DAMAGE", "HEALTH", "ARMOUR", "CRIT_CHANCE", "ITEM_RARITY", "GOLD_GAIN");
var PREFIX_AMOUNT = 6;
var Suffixes = new Array("STRENGTH", "AGILITY", "STAMINA", "HP5", "CRIT_DAMAGE", "EXPERIENCE_GAIN", "EVASION");
var SUFFIX_AMOUNT = 7;

var DamageNames = new Array("Heavy", "Honed", "Fine", "Tempered", "Annealed", "Burnished", "Polished", "Shiny", "Glinting", "Shimmering",
"Sparkling", "Gleaming", "Dazzling", "Glistening", "Flaring", "Luminous", "Glowing", "Brilliant", "Radiant", "Glorious");
var HealthNames = new Array("Healthy", "Lively", "Athletic", "Brisk", "Tough", "Fecund", "Bracing", "Uplifting", "Stimulating", "Invigorating",
"Exhilarating", "Virile", "Stout", "Stalwart", "Sanguine", "Robust", "Rotund", "Spirited", "Potent", "Vigorous");
var ArmourNames = new Array("Lacquered", "Studded", "Ribbed", "Fortified", "Plated", "Carapaced", "Reinforced", "Strengthened", "Backed",
"Banded", "Bolstered", "Braced", "Thickened", "Spiked", "Barbed", "Layered", "Scaled", "Tightened", "Chained", "Supported");
var CritChanceNames = new Array("Dark", "Shadow", "Wilderness", "Night", "Bloodthirsty", "Black", "Cloudy", "Dim", "Grim", "Savage", "Deadly",
"Sharpened", "Razor Sharp", "Pincer", "Bloody", "Cruel", "Dangerous", "Fatal", "Harmful", "Lethal");
var ItemRarityNames = new Array("Bandit's", "Pillager's", "Thug's", "Magpie's", "Pirate's", "Captain's", "Raider's", "Corsair's", "Filibuster's",
"Freebooter's", "Marauder's", "Privateer's", "Rover's", "Criminal's", "Hooligan's", "Mobster's", "Outlaw's", "Robber's", "Crook's",
"Forager's");
var GoldGainNames = new Array("King's", "Queen's", "Prince's", "Emperor's", "Monarch's", "Sultan's", "Baron's", "Caeser's", "Caliph's",
"Czar's", "Kaiser's", "Khan's", "Magnate's", "Overlord's", "Lord's", "Ruler's", "Leader's", "Sovereign's", "Tycoon's", "Duke's");

var StrengthNames = new Array("of the Hippo", "of the Seal", "of the Bear", "of the Lion", "of the Gorrilla", "of the Goliath",
"of the Leviathan", "of the Titan", "of the Shark", "of the Yeti", "of the Tiger", "of the Elephant", "of the Beetle", "of the Ancient",
"of the Strong", "of the Rhino", "of the Whale", "of the Crocodile", "of the Aligator", "of the Tortoise");
var AgilityNames = new Array("of the Mongoose", "of the Lynx", "of the Fox", "of the Falcon", "of the Panther", "of the Leopard",
"of the Jaguar", "of the Phantasm", "of the Cougar", "of the Owl", "of the Eagle", "of the Cheetah", "of the Antelope", "of the Greyhound",
"of the Wolf", "of the Kangaroo", "of the Horse", "of the Coyote", "of the Zebra", "of the Hyena");
var StaminaNames = new Array("of the Guardian", "of the Protector", "of the Defender", "of the Keeper", "of the Overseer", "of the Paladin",
"of the Preserver", "of the Sentinel", "of the Warden", "of the Crusader", "of the Patron", "of the Savior", "of the Liberator",
"of the Zealot", "of the Safeguard", "of the Monk", "of the Vigilante", "of the Bodyguard", "of the Hero", "of the Supporter");
var Hp5Names = new Array("of Regeneration", "of Restoration", "of Healing", "of Rebirth", "of Resurrection", "of Reclamation", "of Growth",
"of Nourishment", "of Warding", "of Rejuvenation", "of Revitalisation", "of Recovery", "of Renewal", "of Revival", "of Curing",
"of Resurgance", "of Replenishment", "of Holyness", "of Prayer", "of Meditation");
var CritDamageNames = new Array("of the Berserker", "of the Insane", "of the Psychopath", "of the Ravager", "of the Breaker",
"of the Warrior", "of the Warlord", "of the Destructor", "of the Crazy", "of the Mad", "of the Champion", "of the Mercenary",
"of the Militant", "of the Assailent", "of the Gladiator", "of the Assassin", "of the Rogue", "of the Guerilla", "of the Destroyer",
"of the Hunter");
var ExperienceGainNames = new Array("of Wisdom", "of Experience", "of Foresight", "of Intelligence", "of Knowledge", "of Mastery",
"of Evolution", "of Brilliance", "of Perception", "of Senses", "of Understanding", "of Expansion", "of Growth", "of Progression",
"of Transformation", "of Advancement", "of Gain", "of Improvement", "of Success", "of Development");
var EvasionNames = new Array("of Dodging", "of Reflexes", "of Shadows", "of Acrobatics", "of Avoidance", "of Eluding",
"of Swerving", "of Deception", "of Juking", "of Reaction", "of Response", "of Elusion", "of Escape", "of Ducking",
"of Avoiding", "of Swerving", "of Trickery", "of Darkness", "of Blinding", "of Shuffling");
var namesAmount = 20;

var LevelOneNames = new Array("Leather Spaulders", "Leather Tunic", "Leather Trousers", "Wooden Club",
"Leather Gloves", "Leather Boots", "Talisman");

var itemBonusesAmount = 14;

var ItemRarity = new Object();
ItemRarity.COMMON = "COMMON";
ItemRarity.UNCOMMON = "UNCOMMON";
ItemRarity.RARE = "RARE";
ItemRarity.EPIC = "EPIC";
ItemRarity.LEGENDARY = "LEGENDARY";
ItemRarity.count = 5;

var ItemType = new Object();
ItemType.HELM = "HELM";
ItemType.SHOULDERS = "SHOULDERS";
ItemType.CHEST = "CHEST";
ItemType.LEGS = "LEGS";
ItemType.WEAPON = "WEAPON";
ItemType.TRINKET = "TRINKET";
ItemType.OFF_HAND = "OFF_HAND";
ItemType.GLOVES = "GLOVES";
ItemType.BOOTS = "BOOTS";
ItemType.count = 9;

var EffectType = new Object();
EffectType.CRUSHING_BLOWS = "CRUSHING_BLOWS";
EffectType.COMBUSTION = "COMBUSTION";
EffectType.RUPTURE = "RUPTURE";
EffectType.WOUNDING = "WOUNDING";
EffectType.CURING = "CURING";
EffectType.FROST_SHARDS = "FROST_SHARDS";
EffectType.FLAME_IMBUED = "FLAME_IMBUED";
EffectType.BARRIER = "BARRIER";
EffectType.SWIFTNESS = "SWIFTNESS";
EffectType.PILLAGING = "PILLAGING";
EffectType.NOURISHMENT = "NOURISHMENT";
EffectType.BERSERKING = "BERSERKING";

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                     UPGRADES                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
var UpgradeType = new Object();
UpgradeType.GPS = "GPS";
UpgradeType.SPECIAL = "SPECIAL";
UpgradeType.ATTACK = "ATTACK";

var UpgradeRequirementType = new Object();
UpgradeRequirementType.FOOTMAN = "FOOTMAN";
UpgradeRequirementType.CLERIC = "CLERIC";
UpgradeRequirementType.COMMANDER = "COMMANDER";
UpgradeRequirementType.MAGE = "MAGE";
UpgradeRequirementType.ASSASSIN = "ASSASSIN";
UpgradeRequirementType.WARLOCK = "WARLOCK";
UpgradeRequirementType.LEVEL = "LEVEL";
UpgradeRequirementType.ITEMS_LOOTED = "ITEMS_LOOTED";

function upgradeButtonMouseOver(upgradeId) {
    var upgrade = legacyGame.upgradeManager.upgrades[upgradeId];
    $("#upgradePurchaseButton" + upgradeId).css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

    $("#otherTooltipTitle").html(upgrade.name);
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html(upgrade.description);
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = document.getElementById('buyButton' + upgradeId).getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top - 70);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
}

function upgradeButtonMouseDown(upgradeId) {
    var upgrade = legacyGame.upgradeManager.upgrades[upgradeId];
    $("#upgradePurchaseButton" + upgradeId).css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
    legacyGame.upgradeManager.purchaseUpgrade(upgradeId);
}

function upgradeButtonMouseOut(upgradeId) {
    var upgrade = legacyGame.upgradeManager.upgrades[upgradeId];
    $("#upgradePurchaseButton" + upgradeId).css('background', 'url("includes/images/buyButtonBase.png") 0 0');
    $("#otherTooltip").hide();
}

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                     TOOLTIPS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */


/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                       GAME                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
var legacyGame = new Game();
/*var game = new Game();

var intervalMS = 1000 / 60;
var oldDate = new Date();
setInterval(function () {
    legacyGame.update();
}, intervalMS);*/

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      BUTTONS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
var itemTooltipButtonHovered = false;

this.SLOT_TYPE = new Object();
SLOT_TYPE.EQUIP = "EQUIP";
SLOT_TYPE.INVENTORY = "INVENTORY";
SLOT_TYPE.SELL = "SELL";

var slotTypeSelected;
var slotNumberSelected;

function attackButtonHover(obj) {
    // Display a different tooltip depending on the player's attack
    switch (legacyGame.player.attackType) {
        case AttackType.BASIC_ATTACK:
            $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 150px 0');
            $("#otherTooltipTitle").html('Attack');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('A basic attack.');
            $("#otherTooltip").show();
            break;
        case AttackType.POWER_STRIKE:
            $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 150px 100px');
            $("#otherTooltipTitle").html('Power Strike');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('Strike your target with a powerful blow, dealing 1.5x normal damage.');
            $("#otherTooltip").show();
            break;
        case AttackType.DOUBLE_STRIKE:
            $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 150px 50px');
            $("#otherTooltipTitle").html('Double Strike');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('Attack your target with two fast strikes.');
            $("#otherTooltip").show();
            break;
    }

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
}
function attackButtonReset() {
    switch (legacyGame.player.attackType) {
        case AttackType.BASIC_ATTACK: $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 0'); break;
        case AttackType.POWER_STRIKE: $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 100px'); break;
        case AttackType.DOUBLE_STRIKE: $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 50px'); break;
    }
    $("#otherTooltip").hide();
}
function attackButtonClick() {
    switch (legacyGame.player.attackType) {
        case AttackType.BASIC_ATTACK: $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 100px 0'); break;
        case AttackType.POWER_STRIKE: $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 100px 100px'); break;
        case AttackType.DOUBLE_STRIKE: $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 100px 50px'); break;
    }
    if (legacyGame.inBattle == true) {
        legacyGame.attack();
    }
}

function enterBattleButtonHover(obj) {
    if (legacyGame.inBattle == false && legacyGame.player.alive) {
        $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 75px');
    }
}
function enterBattleButtonReset(obj) {
    if (legacyGame.inBattle == false && legacyGame.player.alive) {
        $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
    }
}
function enterBattleButtonClick(obj) {
    if (legacyGame.inBattle == false && legacyGame.player.alive) {
        legacyGame.enterBattle();
    }
}

function leaveBattleButtonHover(obj) {
    if (legacyGame.inBattle == true) {
        $("#leaveBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 75px');
    }
}
function leaveBattleButtonReset(obj) {
    if (legacyGame.inBattle == true) {
        $("#leaveBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
    }
}
function leaveBattleButtonClick(obj) {
    // If a battle is active
    if (legacyGame.inBattle == true) {
        legacyGame.leaveBattle();
    }
}

function battleLevelUpButtonHover(obj) {
    if (!legacyGame.maxBattleLevelReached()) {
        obj.style.background = 'url("includes/images/battleLevelButton.png") 0 75px';
    }
}
function battleLevelUpButtonClick(obj) {
    obj.style.background = 'url("includes/images/battleLevelButton.png") 0 50px';

    if (!legacyGame.maxBattleLevelReached()) { 
        legacyGame.increaseBattleLevel();
        $("#battleLevelDownButton").css('background', 'url("includes/images/battleLevelButton.png") 0 0px');
        if (legacyGame.maxBattleLevelReached()) {
            obj.style.background = 'url("includes/images/battleLevelButton.png") 0 25px';
        }
    }
}
function battleLevelUpButtonReset(obj) {
    if (!legacyGame.maxBattleLevelReached()) {
        obj.style.background = 'url("includes/images/battleLevelButton.png") 0 0px';
    }
}

function battleLevelDownButtonHover(obj) {
    if (legacyGame.battleLevel != 1) {
        obj.style.background = 'url("includes/images/battleLevelButton.png") 0 75px';
    }
}
function battleLevelDownButtonClick(obj) {
    obj.style.background = 'url("includes/images/battleLevelButton.png") 0 50px';

    if (legacyGame.battleLevel != 1) { 
        legacyGame.decreaseBattleLevel();
        $("#battleLevelUpButton").css('background', 'url("includes/images/battleLevelButton.png") 0 0px');
        if (legacyGame.battleLevel == 1) {
            obj.style.background = 'url("includes/images/battleLevelButton.png") 0 25px';
        }
    }
}
function battleLevelDownButtonReset(obj) {
    if (legacyGame.battleLevel != 1) {
        obj.style.background = 'url("includes/images/battleLevelButton.png") 0 0px';
    }
}

function equipItemHover(obj, index) {
    var item = legacyGame.equipment.slots[index - 1];
    // If there is an item in this slot then show the item tooltip
    if (item != null) {
        var rect = obj.getBoundingClientRect();
        legacyGame.tooltipManager.displayItemTooltip(item, null, null, rect.left, rect.top, false);
    }
}
function equipItemReset(obj, index) {
    $("#itemTooltip").hide();
    $(".equipItem" + index).css('z-index', '1');
}
function equipItemClick(obj, index) {
    // If the left mouse button was clicked
    if (event.which == 1) {
        // Store the information about this item
        slotTypeSelected = SLOT_TYPE.EQUIP;
        slotNumberSelected = index;

        var rect = $(".equipItem" + index).position();
        $(".equipItem" + index).css('z-index', '200');
    }
}

function inventoryItemHover(obj, index) {
    var item = legacyGame.inventory.slots[index - 1];
    // If there is an item in this slot then show the item tooltip
    if (item != null) {
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
        var rect = obj.getBoundingClientRect();

        // Display the tooltip
        legacyGame.tooltipManager.displayItemTooltip(item, item2, item3, rect.left, rect.top, true);
    }
}
function inventoryItemReset(obj, index) {
    $("#itemTooltip").hide();
    $("#itemCompareTooltip").hide();
    $("#itemCompareTooltip2").hide();
    $("#inventoryItem" + index).css('z-index', '1');
}
function inventoryItemClick(obj, index, event) {
    // If the shift key is down then sell this item
    if (event.shiftKey == 1) {
        legacyGame.inventory.sellItem(index - 1);
        $('#itemTooltip').hide();
    }
    // If the left mouse button was clicked
    else if (event.which == 1) {
        // Store the information about this item
        slotTypeSelected = SLOT_TYPE.INVENTORY;
        slotNumberSelected = index;

        var rect = $("#inventoryItem" + index).position();
        $("#inventoryItem" + index).css('z-index', '200');
    }
}
function sellAllButtonClick() {
    legacyGame.inventory.sellAll();
}

function equipInventoryItem(event, index) {
    // If the alt key was pressed try to equip this item as a second trinket
    if (event.altKey == 1) {
        legacyGame.equipment.equipSecondTrinket(legacyGame.inventory.slots[index - 1], index - 1);
    }
    else {
        legacyGame.equipment.equipItem(legacyGame.inventory.slots[index - 1], index - 1);
    }
}
function equipItemRightClick(event, index) {
    legacyGame.equipment.unequipItem(index - 1);
}

var sellButtonActive = false;
function sellButtonHover(obj) {
    // If the button is not active, then highlight it
    if (!sellButtonActive) {
        obj.setAttribute("src", "includes/images/sellButtonHover.png");
    }
}
function sellButtonReset(obj) {
    // If the button is not active then reset it
    if (!sellButtonActive) {
        obj.setAttribute("src", "includes/images/sellButton.png");
    }
}
function sellButtonClick(obj) {
    // If the button is not active, then make it active
    if (!sellButtonActive) {
        sellButtonActive = true;
        obj.setAttribute("src", "includes/images/sellButtonDown.png");
    }
    // Else; make it not active
    else {
        sellButtonActive = false;
        obj.setAttribute("src", "includes/images/sellButtonHover.png");
    }
}

// Level Up Button
function levelUpButtonHover() {
    $("#levelUpButton").css('background', 'url("includes/images/stoneButton1.png") 0 75px');
}
function levelUpButtonReset() {
    $("#levelUpButton").css("background", 'url("includes/images/stoneButton1.png") 0 0px');
}
function levelUpButtonClick() {
    $("#levelUpButton").css("background", 'url("includes/images/stoneButton1.png") 0 50px');

    legacyGame.displayLevelUpWindow();
}

// Skill Up Button
function skillUpButtonHover() {
    $("#skillUpButton").css('background', 'url("includes/images/stoneButton1.png") 0 75px');
}
function skillUpButtonReset() {
    $("#skillUpButton").css("background", 'url("includes/images/stoneButton1.png") 0 0px');
}
function skillUpButtonClick() {
    $("#skillUpButton").css("background", 'url("includes/images/stoneButton1.png") 0 50px');

    legacyGame.displaySkillUpWindow();
}

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                  WINDOW BUTTONS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
var characterWindowShown = false;
var mercenariesWindowShown = false;
var upgradesWindowShown = false;
var questsWindowShown = false;
var inventoryWindowShown = false;
var fbOnDemandOptionsShown = false;
var fbExtraStatsWindowShown = false;
var fbCombatLogWindowShown = false;

function characterWindowButtonHover(obj) {
    $(".characterWindowButton").css('background', 'url("includes/images/windowButtons.png") 117px 78px');
    legacyGame.tooltipManager.displayBasicTooltip(obj, "Character");
}
function characterWindowButtonClick(obj) {
    if (characterWindowShown) { $("#characterWindow").hide(); characterWindowShown = false; }
    else {
        updateWindowDepths(document.getElementById("characterWindow"));
        $("#characterWindow").show();
        characterWindowShown = true;
    }
}
function characterWindowButtonReset(obj) {
    $(".characterWindowButton").css('background', 'url("includes/images/windowButtons.png") 0px 78px');
    $("#basicTooltip").hide();
}

function mercenariesWindowButtonHover(obj) {
    $(".mercenariesWindowButton").css('background', 'url("includes/images/windowButtons.png") 117px 117px');
    legacyGame.tooltipManager.displayBasicTooltip(obj, "Mercenaries");
}
function mercenariesWindowButtonClick(obj) {
    if (mercenariesWindowShown) { $("#mercenariesWindow").hide(); mercenariesWindowShown = false; }
    else { 
        $("#mercenariesWindow").show(); 
        mercenariesWindowShown = true; 
        updateWindowDepths(document.getElementById("mercenariesWindow")); 
    }
}
function mercenariesWindowButtonReset(obj) {
    $(".mercenariesWindowButton").css('background', 'url("includes/images/windowButtons.png") 0px 117px');
    $("#basicTooltip").hide();
}

function upgradesWindowButtonHover(obj) {
    $("#upgradesWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 39px 0');
    $(".upgradesWindowButton").css('background', 'url("includes/images/windowButtons.png") 117px 0');
    legacyGame.tooltipManager.displayBasicTooltip(obj, "Upgrades");
}
function upgradesWindowButtonClick(obj) {
    legacyGame.upgradeManager.stopGlowingUpgradesButton();
    if (upgradesWindowShown) { $("#upgradesWindow").hide(); upgradesWindowShown = false; }
    else { 
        $("#upgradesWindow").show(); 
        upgradesWindowShown = true; 
        updateWindowDepths(document.getElementById("upgradesWindow"));
    }
}
function upgradesWindowButtonReset(obj) {
    $("#upgradesWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 78px 0');
    $(".upgradesWindowButton").css('background', 'url("includes/images/windowButtons.png") 0px 0');
    $("#basicTooltip").hide();
}

function questsWindowButtonHover(obj) {
    $("#questsWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 39px 195px');
    $(".questsWindowButton").css('background', 'url("includes/images/windowButtons.png") 117px 195px');
    legacyGame.tooltipManager.displayBasicTooltip(obj, "Quests");
}
function questsWindowButtonClick(obj) {
    legacyGame.questsManager.stopGlowingQuestsButton();
    if (questsWindowShown) { $("#questsWindow").hide(); questsWindowShown = false; }
    else { 
        $("#questsWindow").show(); 
        questsWindowShown = true; 
        updateWindowDepths(document.getElementById("questsWindow")); 
    }
}
function questsWindowButtonReset(obj) {
    $("#questsWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 78px 195px');
    $(".questsWindowButton").css('background', 'url("includes/images/windowButtons.png") 0px 195px');
    $("#basicTooltip").hide();
}

function questNameClick(id) {
    legacyGame.questsManager.selectedQuest = id;
}

var inventoryWindowVisible = false;
function inventoryWindowButtonHover(obj) {
    $(".inventoryWindowButton").css('background', 'url("includes/images/windowButtons.png") 117px 39px');
    legacyGame.tooltipManager.displayBasicTooltip(obj, "Inventory");
}
function inventoryWindowButtonClick(obj) {
    if (inventoryWindowShown) { $("#inventoryWindow").hide(); inventoryWindowShown = false; }
    else { 
        updateWindowDepths(document.getElementById("inventoryWindow"));
        $("#inventoryWindow").show(); 
        inventoryWindowShown = true;
    }
}
function inventoryWindowButtonReset(obj) {
    $(".inventoryWindowButton").css('background', 'url("includes/images/windowButtons.png") 0px 39px');
    $("#basicTooltip").hide();
}

function closeButtonHover(obj) {
    obj.style.background = 'url("includes/images/closeButton.png") 14px 0';
}
function closeButtonClick(obj) {
    switch (obj.id) {
        case "statUpgradesWindowCloseButton": $("#statUpgradesWindow").hide(); $("#levelUpButton").show(); break;
        case "abilityUpgradesWindowCloseButton": $("#abilityUpgradesWindow").hide(); $("#levelUpButton").show(); break;
        case "updatesWindowCloseButton": $("#updatesWindow").hide(); break;
        case "statsWindowCloseButton": $("#statsWindow").hide(); break;
        case "optionsWindowCloseButton": $("#optionsWindow").hide(); break;
        case "characterWindowCloseButton": $("#characterWindow").hide(); characterWindowShown = false; break;
        case "mercenariesWindowCloseButton": $("#mercenariesWindow").hide(); mercenariesWindowShown = false; break;
        case "upgradesWindowCloseButton": $("#upgradesWindow").hide(); upgradesWindowShown = false; break;
        case "questsWindowCloseButton": $("#questsWindow").hide(); questsWindowShown = false; break;
        case "inventoryWindowCloseButton": $("#inventoryWindow").hide(); inventoryWindowShown = false; break;
        case "fbOnDemandOptionsCloseButton": $("#fbOnDemandOptions").hide(); fbOnDemandOptionsShown = false; break;
        case "fbExtraStatsCloseButton": $("#fbExtraStatsWindow").hide(); fbExtraStatsWindowShown = false; break;
        case "fbCombatLogCloseButton": $("#fbCombatLogWindow").hide(); fbCombatLogWindowShown = false; break;
    }
}
function closeButtonReset(obj) {
    obj.style.background = 'url("includes/images/closeButton.png") 0 0';
}

var WindowOrder = new Array("characterWindow", "mercenariesWindow", "upgradesWindow", "questsWindow", "inventoryWindow");
var WindowIds = new Array("characterWindow", "mercenariesWindow", "upgradesWindow", "questsWindow", "inventoryWindow");
function updateWindowDepths(obj) {
    // Go through the window order and remove the id
    for (var x = 0; x < WindowOrder.length; x++) {
        if (WindowOrder[x] == obj.id) {
            WindowOrder.splice(x, 1);
            break;
        }
    }

    // Add the id again
    WindowOrder.push(obj.id);

    // Order the window depths
    for (var x = 0; x < WindowOrder.length; x++) {
        document.getElementById(WindowOrder[x]).style.zIndex = 5 + x;
    }
}


function footmanBuyButtonMouseOver(obj) {
    $("#footmanBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

    $("#otherTooltipTitle").html('Footman');
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('GPS: ' + legacyGame.mercenaryManager.getMercenaryBaseGps(MercenaryType.FOOTMAN));
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top - 70);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
}
function footmanBuyButtonMouseDown(obj) {
    $("#footmanBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
    legacyGame.mercenaryManager.purchaseMercenary(MercenaryType.FOOTMAN);
}
function footmanBuyButtonMouseOut(obj) {
    $("#footmanBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
    $("#otherTooltip").hide();
}

function clericBuyButtonMouseOver(obj) {
    $("#clericBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

    $("#otherTooltipTitle").html('Cleric');
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('GPS: ' + legacyGame.mercenaryManager.getMercenaryBaseGps(MercenaryType.CLERIC).formatMoney() + 
        '<br>Clerics increase your hp5 by ' + legacyGame.mercenaryManager.getClericHp5PercentBonus() + '%.');
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top - 70);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
}
function clericBuyButtonMouseDown(obj) {
    $("#clericBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
    legacyGame.mercenaryManager.purchaseMercenary(MercenaryType.CLERIC);
}
function clericBuyButtonMouseOut(obj) {
    $("#clericBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
    $("#otherTooltip").hide();
}

function commanderBuyButtonMouseOver(obj) {
    $("#commanderBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

    $("#otherTooltipTitle").html('Commander');
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('GPS: ' + legacyGame.mercenaryManager.getMercenaryBaseGps(MercenaryType.COMMANDER).formatMoney() +
        '<br>Commanders increase your health by ' + game.systems.getCommanderHealthUpgradeMultiplier().formatMultiplier() + '.');
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top - 70);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
}
function commanderBuyButtonMouseDown(obj) {
    $("#commanderBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
    legacyGame.mercenaryManager.purchaseMercenary(MercenaryType.COMMANDER);
}
function commanderBuyButtonMouseOut(obj) {
    $("#commanderBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
    $("#otherTooltip").hide();
}

function mageBuyButtonMouseOver(obj) {
    $("#mageBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

    $("#otherTooltipTitle").html('Mage');
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('GPS: ' + legacyGame.mercenaryManager.getMercenaryBaseGps(MercenaryType.MAGE).formatMoney() +
        '<br>Mages increase your damage by ' + legacyGame.mercenaryManager.getMageDamagePercentBonus() + '%.');
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top - 70);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
}
function mageBuyButtonMouseDown(obj) {
    $("#mageBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
    legacyGame.mercenaryManager.purchaseMercenary(MercenaryType.MAGE);
}
function mageBuyButtonMouseOut(obj) {
    $("#mageBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
    $("#otherTooltip").hide();
}

function assassinBuyButtonMouseOver(obj) {
    $("#assassinBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

    $("#otherTooltipTitle").html('Assassin');
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('GPS: ' + legacyGame.mercenaryManager.getMercenaryBaseGps(MercenaryType.ASSASSIN).formatMoney() + 
        '<br>Assassins increase your evasion by ' + legacyGame.mercenaryManager.getAssassinEvasionPercentBonus() + '%.');
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top - 70);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
}
function assassinBuyButtonMouseDown(obj) {
    $("#assassinBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
    legacyGame.mercenaryManager.purchaseMercenary(MercenaryType.ASSASSIN);
}
function assassinBuyButtonMouseOut(obj) {
    $("#assassinBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
    $("#otherTooltip").hide();
}

function warlockBuyButtonMouseOver(obj) {
    $("#warlockBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

    $("#otherTooltipTitle").html('Warlock');
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('GPS: ' + legacyGame.mercenaryManager.getMercenaryBaseGps(MercenaryType.WARLOCK).formatMoney() +
        '<br>Warlocks increase your critical strike damage by ' + legacyGame.mercenaryManager.getWarlockCritDamageBonus() + '%.');
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top - 70);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
}
function warlockBuyButtonMouseDown(obj) {
    $("#warlockBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
    legacyGame.mercenaryManager.purchaseMercenary(MercenaryType.WARLOCK);
}
function warlockBuyButtonMouseOut(obj) {
    $("#warlockBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
    $("#otherTooltip").hide();
}

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                          STAT & ABILITY UPGRADE BUTTONS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
function statUpgradeButtonHover(obj, index) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 92px';

    // Show a tooltip describing what the hovered stat does if neccessary
    var upgrade = legacyGame.statUpgradesManager.upgrades[0][index - 1];

    switch (upgrade.type) {
        case StatUpgradeType.DAMAGE:
            $("#otherTooltipTitle").html("Damage");
            $("#otherTooltipDescription").html("Increases the damage you deal with basic attacks.");
            break;
        case StatUpgradeType.STRENGTH:
            $("#otherTooltipTitle").html("Strength");
            $("#otherTooltipDescription").html("Increases your Min and Max Damage by 1 and overall Damage by 1%.");
            break;
        case StatUpgradeType.AGILITY:
            $("#otherTooltipTitle").html("Agility");
            $("#otherTooltipDescription").html("Increases your Crit Chance by 0.01% and Evasion by 1%.");
            break;
        case StatUpgradeType.STAMINA:
            $("#otherTooltipTitle").html("Stamina");
            $("#otherTooltipDescription").html("Increases your Max HP by 5, Hp5 by 1 and Armour by 1%.");
            break;
        case StatUpgradeType.ARMOUR:
            $("#otherTooltipTitle").html("Armour");
            $("#otherTooltipDescription").html("Reduces the damage you take from monsters.");
            break;
        case StatUpgradeType.EVASION:
            $("#otherTooltipTitle").html("Evasion");
            $("#otherTooltipDescription").html("Increases your chance to dodge a monster's attack.");
            break;
        case StatUpgradeType.HP5:
            $("#otherTooltipTitle").html("Hp5");
            $("#otherTooltipDescription").html("The amount of health you regenerate over 5 seconds.");
            break;
        case StatUpgradeType.CRIT_DAMAGE:
            $("#otherTooltipTitle").html("Crit Damage");
            $("#otherTooltipDescription").html("The amount of damage your critical strikes will cause");
            break;
        case StatUpgradeType.ITEM_RARITY:
            $("#otherTooltipTitle").html("Item Rarity");
            $("#otherTooltipDescription").html("Increases the chance that rarer items will drop from monsters");
            break;
        case StatUpgradeType.EXPERIENCE_GAIN:
            $("#otherTooltipTitle").html("Experience Gain");
            $("#otherTooltipDescription").html("Increases the experience earned from killing monsters");
            break;
        case StatUpgradeType.GOLD_GAIN:
            $("#otherTooltipTitle").html("Gold Gain");
            $("#otherTooltipDescription").html("Increases the gold gained from monsters and mercenaries");
            break;
    }

    // Set the item tooltip's location
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltip").show();
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top - 70);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
}
function statUpgradeButtonClick(obj, index) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 46px';

    // Upgrade a player's stat depending on which button was clicked
    var upgrade = legacyGame.statUpgradesManager.upgrades[0][index - 1];
    switch (upgrade.type) {
        case StatUpgradeType.DAMAGE:            legacyGame.player.chosenLevelUpBonuses.damageBonus += upgrade.amount;         break;
        case StatUpgradeType.STRENGTH:          legacyGame.player.chosenLevelUpBonuses.strength += upgrade.amount;            break;
        case StatUpgradeType.AGILITY:           legacyGame.player.chosenLevelUpBonuses.agility += upgrade.amount;             break;
        case StatUpgradeType.STAMINA:           legacyGame.player.chosenLevelUpBonuses.stamina += upgrade.amount;             break;
        case StatUpgradeType.ARMOUR:            legacyGame.player.chosenLevelUpBonuses.armour += upgrade.amount;              break;
        case StatUpgradeType.EVASION:           legacyGame.player.chosenLevelUpBonuses.evasion += upgrade.amount;             break;
        case StatUpgradeType.HP5:               legacyGame.player.chosenLevelUpBonuses.hp5 += upgrade.amount;                 break;
        case StatUpgradeType.CRIT_DAMAGE:       legacyGame.player.chosenLevelUpBonuses.critDamage += upgrade.amount;          break;
        case StatUpgradeType.ITEM_RARITY:       legacyGame.player.chosenLevelUpBonuses.itemRarity += upgrade.amount;          break;
        case StatUpgradeType.EXPERIENCE_GAIN:   legacyGame.player.chosenLevelUpBonuses.experienceGain += upgrade.amount;      break;
        case StatUpgradeType.GOLD_GAIN:         legacyGame.player.chosenLevelUpBonuses.goldGain += upgrade.amount;            break;
    }

    // Remove the upgrade
    legacyGame.statUpgradesManager.upgrades.splice(0, 1);

    // Alter the player's skill points
    legacyGame.player.skillPoints--;
    legacyGame.player.skillPointsSpent++;

    $("#statUpgradesWindow").hide();
    if(legacyGame.player.skillPoints > 0) {
        // Re-open the upgrade window if there are still points to spend
        legacyGame.displayLevelUpWindow();
    }
}
function statUpgradeButtonReset(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 0';
    $("#otherTooltip").hide();
}

function rendUpgradeButtonHover(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 92px';

    $("#abilityUpgradeTooltipTitle").html('Rend');
    $("#abilityUpgradeTooltipCooldown").html('');
    // If there is already a level in this ability then show the current version as well
    if (legacyGame.player.abilities.getRendLevel() > 0) {
        $("#abilityUpgradeTooltipLevel").html('Level ' + legacyGame.player.abilities.getRendLevel());
        $("#abilityUpgradeTooltipDescription").html('Your attacks cause your opponent to bleed for <span class="yellowText">' + legacyGame.player.abilities.getRendDamage(0).formatMoney(0) +
            '</span> damage after every round for ' + legacyGame.player.abilities.rendDuration + ' rounds. Stacks up to 5 times.');
        $("#abilityUpgradeTooltipLevel2").html('Next Level');
    }
    else {
        $("#abilityUpgradeTooltipLevel").html('');
        $("#abilityUpgradeTooltipDescription").html('');
        $("#abilityUpgradeTooltipLevel2").html('Level 1');
    }
    $("#abilityUpgradeTooltipDescription2").html('Your attacks cause your opponent to bleed for <span class="yellowText">' + legacyGame.player.abilities.getRendDamage(1).formatMoney(0) +
        '</span> damage after every round for ' + legacyGame.player.abilities.rendDuration + ' rounds. Stacks up to 5 times.');
    $("#abilityUpgradeTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#abilityUpgradeTooltip").css('top', rect.top - 70);
    var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
    $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 40));
}
function rendUpgradeButtonClick(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 46px';
    $("#abilityUpgradesWindow").hide();
    legacyGame.player.increaseAbilityPower(AbilityName.REND);

    if(legacyGame.player.abilityPoints > 0) {
        // Re-open the upgrade window if there are still points to spend
        legacyGame.displaySkillUpWindow();
    }
}
function rendUpgradeButtonReset(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 0';
    $("#abilityUpgradeTooltip").hide();
}

function rejuvenatingStrikesUpgradeButtonHover(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 92px';

    $("#abilityUpgradeTooltipTitle").html('Rejuvenating Strikes');
    $("#abilityUpgradeTooltipCooldown").html('');
    // If there is already a level in this ability then show the current version as well
    if (legacyGame.player.abilities.getRejuvenatingStrikesLevel() > 0) {
        $("#abilityUpgradeTooltipLevel").html('Level ' + legacyGame.player.abilities.getRejuvenatingStrikesLevel());
        $("#abilityUpgradeTooltipDescription").html('Your attacks heal you for <span class="greenText">' + legacyGame.player.abilities.getRejuvenatingStrikesHealAmount(0).formatMoney(0) +
            '</span> health.');
        $("#abilityUpgradeTooltipLevel2").html('Next Level');
    }
    else {
        $("#abilityUpgradeTooltipLevel").html('');
        $("#abilityUpgradeTooltipDescription").html('');
        $("#abilityUpgradeTooltipLevel2").html('Level 1');
    }
    $("#abilityUpgradeTooltipDescription2").html('Your attacks heal you for <span class="greenText">' + legacyGame.player.abilities.getRejuvenatingStrikesHealAmount(1).formatMoney(0) +
        '</span> health.');
    $("#abilityUpgradeTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#abilityUpgradeTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
    $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 10));
}
function rejuvenatingStrikesUpgradeButtonClick(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 46px';
    $("#abilityUpgradesWindow").hide();
    legacyGame.player.increaseAbilityPower(AbilityName.REJUVENATING_STRIKES);
}
function rejuvenatingStrikesUpgradeButtonReset(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 0';
    $("#abilityUpgradeTooltip").hide();

    if(legacyGame.player.abilityPoints > 0) {
        // Re-open the upgrade window if there are still points to spend
        legacyGame.displaySkillUpWindow();
    }
}

function iceBladeUpgradeButtonHover(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 92px';

    $("#abilityUpgradeTooltipTitle").html('Ice Blade');
    $("#abilityUpgradeTooltipCooldown").html('');
    // If there is already a level in this ability then show the current version as well
    if (legacyGame.player.abilities.getIceBladeLevel() > 0) {
        $("#abilityUpgradeTooltipLevel").html('Level ' + legacyGame.player.abilities.getIceBladeLevel());
        $("#abilityUpgradeTooltipDescription").html('Your attacks deal <span class="yellowText">' + legacyGame.player.abilities.getIceBladeDamage(0).formatMoney(0) +
            '</span> bonus damage and chill them for ' + legacyGame.player.abilities.iceBladeChillDuration + ' rounds.');
        $("#abilityUpgradeTooltipLevel2").html('Next Level');
    }
    else {
        $("#abilityUpgradeTooltipLevel").html('');
        $("#abilityUpgradeTooltipDescription").html('');
        $("#abilityUpgradeTooltipLevel2").html('Level 1');
    }
    $("#abilityUpgradeTooltipDescription2").html('Your attacks deal <span class="yellowText">' + legacyGame.player.abilities.getIceBladeDamage(1).formatMoney(0) +
        '</span> damage and chill them for ' + legacyGame.player.abilities.iceBladeChillDuration + ' rounds.');
    $("#abilityUpgradeTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#abilityUpgradeTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
    $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 10));
}
function iceBladeUpgradeButtonClick(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 46px';
    $("#abilityUpgradesWindow").hide();
    legacyGame.player.increaseAbilityPower(AbilityName.ICE_BLADE);

    if(legacyGame.player.abilityPoints > 0) {
        // Re-open the upgrade window if there are still points to spend
        legacyGame.displaySkillUpWindow();
    }
}
function iceBladeUpgradeButtonReset(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 0';
    $("#abilityUpgradeTooltip").hide();
}

function fireBladeUpgradeButtonHover(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 92px';

    $("#abilityUpgradeTooltipTitle").html('Fire Blade');
    $("#abilityUpgradeTooltipCooldown").html('');
    // If there is already a level in this ability then show the current version as well
    if (legacyGame.player.abilities.getFireBladeLevel() > 0) {
        $("#abilityUpgradeTooltipLevel").html('Level ' + legacyGame.player.abilities.getFireBladeLevel());
        $("#abilityUpgradeTooltipDescription").html('Your attacks deal <span class="yellowText">' + legacyGame.player.abilities.getFireBladeDamage(0).formatMoney(0) +
            '</span> bonus damage and burn them for <span class="yellowText">' + legacyGame.player.abilities.getFireBladeBurnDamage(0).formatMoney(0) +
            '</span> damage after every round for ' + legacyGame.player.abilities.fireBladeBurnDuration + ' rounds.');
        $("#abilityUpgradeTooltipLevel2").html('Next Level');
    }
    else {
        $("#abilityUpgradeTooltipLevel").html('');
        $("#abilityUpgradeTooltipDescription").html('');
        $("#abilityUpgradeTooltipLevel2").html('Level 1');
    }
    $("#abilityUpgradeTooltipDescription2").html('Your attacks deal <span class="yellowText">' + legacyGame.player.abilities.getFireBladeDamage(1).formatMoney(0) +
        '</span> bonus damage and burn them for <span class="yellowText">' + legacyGame.player.abilities.getFireBladeBurnDamage(1).formatMoney(0) +
        '</span> damage after every round for ' + legacyGame.player.abilities.fireBladeBurnDuration + ' rounds.');
    $("#abilityUpgradeTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#abilityUpgradeTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
    $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 10));
}
function fireBladeUpgradeButtonClick(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 46px';
    $("#abilityUpgradesWindow").hide();
    legacyGame.player.increaseAbilityPower(AbilityName.FIRE_BLADE);

    if(legacyGame.player.abilityPoints > 0) {
        // Re-open the upgrade window if there are still points to spend
        legacyGame.displaySkillUpWindow();
    }
}
function fireBladeUpgradeButtonReset(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 0';
    $("#abilityUpgradeTooltip").hide();
}

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                       OTHER                                                      
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
// Exp bar
function expBarAreaMouseOver() {
    $("#expBarText").show();
}
function expBarAreaMouseOut() {
    if (!legacyGame.options.alwaysDisplayExp) {
        $("#expBarText").hide();
    }
}

// Player health bar
function playerHealthBarAreaMouseOver() {
    $("#playerHealthBarText").show();
}
function playerHealthBarAreaMouseOut() {
    if (!legacyGame.options.alwaysDisplayPlayerHealth) {
        $("#playerHealthBarText").hide();
    }
}

// Monster health bar
function monsterHealthBarAreaMouseOver() {
    legacyGame.displayMonsterHealth = true;
}
function monsterHealthBarAreaMouseOut() {
    if (!legacyGame.options.alwaysDisplayMonsterHealth) {
        legacyGame.displayMonsterHealth = false;
    }
}

// Debuffs
// Bleeding
function bleedingIconMouseOver(obj) {
    $("#otherTooltipTitle").html("Bleeding");
    $("#otherTooltipCooldown").html((legacyGame.monster.debuffs.bleedMaxDuration - legacyGame.monster.debuffs.bleedDuration) + ' rounds remaining');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('This monster is bleeding, causing damage at the end of every round');
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
}
function bleedingIconMouseOut() {
    $("#otherTooltip").hide();
}
// Burning
function burningIconMouseOver(obj) {
    $("#otherTooltipTitle").html("Burning");
    $("#otherTooltipCooldown").html((legacyGame.monster.debuffs.burningMaxDuration - legacyGame.monster.debuffs.burningDuration) + ' rounds remaining');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('This monster is burning, causing damage at the end of every round');
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
}
function burningIconMouseOut() {
    $("#otherTooltip").hide();
}
// Chilled
function chilledIconMouseOver(obj) {
    $("#otherTooltipTitle").html("Chilled");
    $("#otherTooltipCooldown").html((legacyGame.monster.debuffs.chillMaxDuration - legacyGame.monster.debuffs.chillDuration) + ' rounds remaining');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('This monster is chilled, causing it to attack twice as slow');
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
}
function chilledIconMouseOut() {
    $("#otherTooltip").hide();
}

// Stat Hover Tooltips
function damageBonusStatHover(obj) {
    $("#otherTooltipTitle").html("Damage Bonus");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases the damage you deal with basic attacks.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function hp5StatHover(obj) {
    $("#otherTooltipTitle").html("Hp5");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("The amount of health you regenerate over 5 seconds.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function armourStatHover(obj) {
    $("#otherTooltipTitle").html("Armour");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Reduces the damage you take from monsters.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function evasionStatHover(obj) {
    $("#otherTooltipTitle").html("Evasion");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases your chance to dodge a monster's attack.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function strengthStatHover(obj) {
    $("#otherTooltipTitle").html("Strength");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases your Min and Max Damage by 1 and overall Damage by 1%.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function agilityStatHover(obj) {
    $("#otherTooltipTitle").html("Agility");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases your Crit Chance by 0.01% and Evasion by 1%.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function staminaStatHover(obj) {
    $("#otherTooltipTitle").html("Stamina");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases your Max HP by 5, Hp5 by 1 and Armour by 1%.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function critChanceStatHover(obj) {
    $("#otherTooltipTitle").html("Crit Chance");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases your chance to get a critical strike.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function critDamageStatHover(obj) {
    $("#otherTooltipTitle").html("Crit Damage");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("The amount of damage your critical strikes will cause.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function itemRarityStatHover(obj) {
    $("#otherTooltipTitle").html("Item Rarity");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases the chance that rarer items will drop from monsters.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function goldGainStatHover(obj) {
    $("#otherTooltipTitle").html("Gold Gain");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases the gold gained from monsters and mercenaries.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function expGainStatHover(obj) {
    $("#otherTooltipTitle").html("Experience Gain");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases the experience earned from killing monsters.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function setTooltipLocation(obj) {
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
}
function statTooltipReset() {
    $("#otherTooltip").hide();
}

var updatesWindowShown = false;
var statsWindowShown = false;
var optionsWindowShown = false;
// Updates Window
function updatesWindowButtonClick() {
    if (!updatesWindowShown) {
        updatesWindowShown = true;
        statsWindowShown = false;
        optionsWindowShown = false;
        $("#updatesWindow").show();
        $("#statsWindow").hide();
        $("#optionsWindow").hide();
    }
    else {
        updatesWindowShown = false;
        $("#updatesWindow").hide();
    }
}

// Stats Window
function statsWindowButtonClick() {
    if (!statsWindowShown) {
        updatesWindowShown = false;
        statsWindowShown = true;
        optionsWindowShown = false;
        $("#updatesWindow").hide();
        $("#statsWindow").show();
        $("#optionsWindow").hide();
    }
    else {
        statsWindowShown = false;
        $("#statsWindow").hide();
    }
}

function fbOptionsWindowButtonClick() {
    if (!fbOnDemandOptionsShown) {
        fbOnDemandOptionsShown = true;
        $("#fbOnDemandOptions").show();
    }
    else {
        fbOnDemandOptionsShown = false;
        $("#fbOnDemandOptions").hide();
    }
}

function fbStatsWindowButtonClick() {
    if (!fbExtraStatsWindowShown) {
        fbExtraStatsWindowShown = true;
        $("#fbExtraStatsWindow").show();
    }
    else {
        fbExtraStatsWindowShown = false;
        $("#fbExtraStatsWindow").hide();
    }
}

function fbCombatLogWindowButtonClick() {
    if(!fbCombatLogWindowShown) {
        fbCombatLogWindowShown = true;
        $('#fbCombatLogWindow').show();
    } else {
        fbCombatLogWindowShown = false;
        $('#fbCombatLogWindow').hide();
    }
}

// Options Window
function optionsWindowButtonClick() {
    if (!optionsWindowShown) {
        updatesWindowShown = false;
        statsWindowShown = false;
        optionsWindowShown = true;
        $("#updatesWindow").hide();
        $("#statsWindow").hide();
        $("#optionsWindow").show();
    }
    else {
        optionsWindowShown = false;
        $("#optionsWindow").hide();
    }
}

// Save Button
function saveButtonClick() {
    legacyGame.save();
}

// Reset Button
var fullReset = false;
function resetButtonClick() {
    fullReset = false;
    var powerShardsAvailable = legacyGame.calculatePowerShardReward();
    document.getElementById('resetDescription').innerHTML = 'This will erase all progress and not be recoverable. Are you sure you want to reset?';
    $("#resetConfirmWindowPowerShard").show();
    document.getElementById('powerShardsDescription').innerHTML = "You will earn {0} Power Shards and {1}% overall bonus from resetting.".format(powerShardsAvailable, legacyGame.player.level - 1);
    $("#powerShardsDescription").show();
    $("#resetConfirmWindow").show();
}
function resetConfirmWindowYesButtonClick() {
    $("#resetConfirmWindow").hide();
    if (fullReset) {
        legacyGame.reset();
    }
    else {
        var powerShards = legacyGame.player.powerShards + legacyGame.calculatePowerShardReward();
        legacyGame.reset();
        legacyGame.player.powerShards = powerShards;
    }
}
function resetConfirmWindowNoButtonClick() {
    $("#resetConfirmWindow").hide();
}

function fullResetButtonClick() {
    fullReset = true;
    document.getElementById('resetDescription').innerHTML = 'This will erase all progress and not be recoverable, including Power Shards. Are you sure you want to reset?';
    $("#resetConfirmWindowPowerShard").hide();
    $("#powerShardsDescription").hide();

    $("#resetConfirmWindow").show();
}

// Options Menu
function optionsWindowExitButtonClick() {
    $("#optionsWindow").hide();
}

function fbUpdateMouseOver() {
    var data = game.getVersionCheckData();
    if(data === undefined) {
        return;
    }

    $("#otherTooltipTitle").html(data.changeTitle);
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html(data.changeDetails);
    $("#otherTooltip").show();

    // Set the item tooltip's location
    var rect = document.getElementById('fbUpdate').getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
}

function fbUpdateMouseOut() {
    $("#otherTooltip").hide();
}

/*window.onload = function() {
    $("body").css('zoom', $(window).width() / 1280);
}
window.onresize = function () {
    $("body").css('zoom', $(window).width() / 1280);
}*/