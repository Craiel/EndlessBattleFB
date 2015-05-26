declare('CombatLog', function() {
    include('Component');
    include('EventAggregate');
    include('StaticData');
    include('CoreUtils');

    // Events
    var eventsCombatHit = [];
    var receiveEventCombatHit = function(eventData) { eventsCombatHit.push(eventData); }

    var eventsCombatDeath = [];
    var receiveEventCombatDeath = function(eventData) { eventsCombatDeath.push(eventData); }

    var eventsXpGain = [];
    var eventsGoldGain = [];
    var eventsItemGain = [];
    var receiveEventXpGain = function(eventData) { eventsXpGain.push(eventData); }
    var receiveEventGoldGain = function(eventData) { eventsGoldGain.push(eventData); }
    var receiveEventItemGain = function(eventData) { eventsItemGain.push(eventData); }

    CombatLog.prototype = component.prototype();
    CombatLog.prototype.$super = parent;
    CombatLog.prototype.constructor = CombatLog;

    function CombatLog(id) {
        component.construct(this);

        this.id = "CombatLog";

        this.maxEventCount = 1000;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    CombatLog.prototype.componentInit = CombatLog.prototype.init;
    CombatLog.prototype.init = function(parent, attributes) {
        this.componentInit(parent, attributes);

        eventAggregate.subscribe(staticData.EventCombatHit, receiveEventCombatHit);
        eventAggregate.subscribe(staticData.EventCombatDeath, receiveEventCombatDeath);
        eventAggregate.subscribe(staticData.EventXpGain, receiveEventXpGain);
        eventAggregate.subscribe(staticData.EventGoldGain, receiveEventGoldGain);
        eventAggregate.subscribe(staticData.EventItemGain, receiveEventItemGain);
    };

    CombatLog.prototype.componentUpdate = CombatLog.prototype.update;
    CombatLog.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        this.currentTime = gameTime.currentLocale;

        var contentArea = $('#fbCombatLogContent');

        var eventAdded = false;
        var count = eventsCombatHit.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsCombatHit.shift();
            contentArea.append(this.getCombatEventText(eventData));
            eventAdded = true;
        }

        count = eventsCombatDeath.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsCombatDeath.shift();
            contentArea.append(this.getCombatDeathEventText(eventData));
            eventAdded = true;
        }

        count = eventsXpGain.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsXpGain.shift();
            contentArea.append(this.getXpEventText(eventData));
            eventAdded = true;
        }

        count = eventsGoldGain.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsGoldGain.shift();
            contentArea.append(this.getGoldEventText(eventData));
            eventAdded = true;
        }

        count = eventsItemGain.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsItemGain.shift();
            contentArea.append(this.getItemEventText(eventData));
            eventAdded = true;
        }

        this.trimEvents();

        if(eventAdded !== false) {
            // Scroll to bottom
            contentArea.scrollTop(1E10);
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    CombatLog.prototype.trimEvents = function() {
        var contentArea = $('#fbCombatLogContent');
        var count = contentArea.children().length;
        if(count <= this.maxEventCount) {
            return;
        }

        for(var i = this.maxEventCount; i < count; i++) {
            contentArea.children().first().remove();
        }
    };

    CombatLog.prototype.getBasicEventText = function(eventData) {
        var textElement = $('<div\>');
        textElement.append($('<span class="logEntryNormal">[' + coreUtils.getTimeDisplay(this.currentTime) + '] </span>'));
        return textElement;
    };

    CombatLog.prototype.getCombatEventText = function(eventData) {
        var textElement = this.getBasicEventText();
        textElement.append($('<span class="combatLogActor">' + eventData.sourceActorName + '</span>'));
        if(eventData.wasHit !== true) {
            textElement.append($('<span class="logEntryNormal"> missed</span>'));
            return textElement;
        }

        if(eventData.wasCrit !== true) {
            textElement.append($('<span class="logEntryNormal"> hit </span>'))
        } else {
            textElement.append($('<span class="combatLogCritical"> crit </span>'))
        }

        textElement.append($('<span class="combatLogActor">' + eventData.targetActorName + '</span>'));
        textElement.append($('<span class="logEntryNormal"> for </span>'));
        textElement.append($('<span class="combatLogDamage">' + eventData.damageTotal + '</span>'));
        textElement.append($('<span class="logEntryNormal"> damage</span>'));
        return textElement;
    };

    CombatLog.prototype.getCombatDeathEventText = function(eventData) {
        var textElement = this.getBasicEventText();
        textElement.append($('<span class="combatLogActor">' + eventData.actorName + ' was defeated!</span>'));
        return textElement;
    };

    CombatLog.prototype.getXpEventText = function(eventData) {
        var textElement = this.getBasicEventText();
        textElement.append($('<span class="logEntryNormal">earned </span>'));
        textElement.append($('<span class="logEntryXp">' + eventData.value + '</span>'));
        textElement.append($('<span class="logEntryNormal"> XP</span>'));
        return textElement;
    };

    CombatLog.prototype.getGoldEventText = function(eventData) {
        var textElement = this.getBasicEventText();
        textElement.append($('<span class="logEntryNormal">received </span>'));
        textElement.append($('<img class="logEntryGoldIcon" src="includes/images/goldCoin.png"></img>'));
        textElement.append($('<span class="logEntryGold"> ' + eventData.value + ' </span>'));
        textElement.append($('<span class="logEntryNormal"> Gold</span>'));
        return textElement;
    };

    CombatLog.prototype.getItemEventText = function(eventData) {
        var textElement = this.getBasicEventText();
        textElement.append($('<span class="logEntryNormal">ITEM RECEIVED TODO!!</span>'));
        return textElement;
    };

    var surrogate = function(){};
    surrogate.prototype = CombatLog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { CombatLog.call(self); },
        create: function(id) { return new CombatLog(id); }
    };
});