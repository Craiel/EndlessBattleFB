declare('StaticData', function () {
    include('Component');

    StaticData.prototype = component.prototype();
    StaticData.prototype.$super = parent;
    StaticData.prototype.constructor = StaticData;

    function StaticData() {
        component.construct(this);

        this.id = "StaticData";

        this.progressBarWidth = 300;

        this.versionFile = "version.txt";
        this.versionInfoFile = "versionInfo.txt";

        this.EventCombatHit = "eventCombatHit";
        this.EventCombatDeath = "eventCombatDeath";
        this.EventXpGain = "eventXpGain";
        this.EventGoldGain = "eventGoldGain";
        this.EventItemGain = "eventItemGain";

        this.GoldSourceLoot = 'goldSourceLoot';
        this.GoldSourceMercenary = 'goldSourceMercenary';

    }

    StaticData.prototype.setRoot = function(value) {
        this.imageRoot = value + 'images/';
        this.imageRootInterface = this.imageRoot + "interface/";
        this.imageRootIcon = this.imageRoot + 'icon/';
    };

    StaticData.prototype.getImagePath = function(fileName) {
        return this.imageRoot + fileName;
    };

    return new StaticData();
});
