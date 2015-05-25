declare('Debug', function () {
    include('Log');
    include('GameTime');
    include('Component');
    include('Settings');
    include('StaticData');
    include('EventAggregate');

    Debug.prototype = component.prototype();
    Debug.prototype.$super = parent;
    Debug.prototype.constructor = Debug;

    function Debug() {
        component.construct(this);

        this.id = "Debug";

        this.currentTime = gameTime.getCurrentLocalTime();

        this.entries = {};
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Debug.prototype.componentInit = Debug.prototype.init;
    Debug.prototype.init = function(baseStats) {
        this.componentInit();
    };

    Debug.prototype.componentUpdate = Debug.prototype.update;
    Debug.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        this.currentTime = gameTime.currentLocale;

        return true;
    };

    // ---------------------------------------------------------------------------
    // setting functions
    // ---------------------------------------------------------------------------
    Debug.prototype.clear = function(level) {
        this.entries[level] = [];
    };

    Debug.prototype.logDebug = function(message, context) {
        this.log(log.level.debug, message, context);
    }

    Debug.prototype.logInfo = function(message, context) {
        this.log(log.level.info, message, context);
    }

    Debug.prototype.logError = function(message, context) {
        this.log(log.level.error, message, context);
    };

    Debug.prototype.logWarning = function(message, context) {
        this.log(log.level.warning, message, context);
    };

    Debug.prototype.log = function(level, message, context) {
        // #IfDebug
        if(this.isActiveContext(context) !== true) {
            return;
        }

        if(this.entries[level] === undefined)
        {
            this.entries[level] = [];
        }

        this.entries[level].push(message);
        log.log(message, level);
        eventAggregate.publish(staticData.EventDebugLog, { time: this.currentTime, level: level, context: context, message: message });
        // #EndIf
    };

    Debug.prototype.popMessages = function(level) {
        var result = this.entries[level];
        this.clear(level);
        return result;
    };

    Debug.prototype.isActiveContext = function(context) {
        if(context === undefined) {
            context = "none";
        }

        var contextEnabled = settings.getLogContextEnabled(context);
        return contextEnabled === true;
    };

    return new Debug();

});