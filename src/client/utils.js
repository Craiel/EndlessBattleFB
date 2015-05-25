function FrozenUtils() {
    this.load = function(property, defaultValue) {
        loadedValue = localStorage[property];
        if (localStorage[property] == undefined) {
            return defaultValue;
        }

        return loadedValue;
    };

    this.loadBool = function(property, defaultValue) {
        loadedValue = localStorage[property];
        if (localStorage[property] == undefined) {
            return defaultValue;
        }

        return loadedValue == "true";
    };

    this.loadInt = function(property, defaultValue) {
        loadedValue = localStorage[property];
        if (localStorage[property] == undefined) {
            return defaultValue;
        }

        return parseInt(loadedValue);
    };

    this.loadFloat = function(property, defaultValue) {
        loadedValue = localStorage[property];
        if (localStorage[property] == undefined) {
            return defaultValue;
        }

        return parseFloat(loadedValue);
    };

    this.pad = function(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };

    this.timeDisplay = function(seconds, highPrecision) {
        if (seconds === 0 || seconds == Number.POSITIVE_INFINITY) {
            return '~~';
        }
        var milliSeconds = Math.floor(seconds);
        var days, hours, minutes, seconds;

        days = Math.floor(milliSeconds / (24 * 60 * 60 * 1000));
        days = (days > 0) ? days + 'd ' : '';

        milliSeconds %= (24 * 60 * 60 * 1000);
        hours = Math.floor(milliSeconds / (60 * 60 * 1000));
        hours = (hours > 0) ? this.pad(hours, 2) + 'h ' : '';

        milliSeconds %= (60 * 60 * 1000);
        minutes = Math.floor(milliSeconds / (60 * 1000));
        minutes = (minutes > 0) ? this.pad(minutes, 2) + 'm ' : '';

        milliSeconds %= (60 * 1000);
        seconds = Math.floor(milliSeconds / 1000);
        seconds = (seconds > 0) ? this.pad(seconds, 2) + 's ' : '';

        if (highPrecision == true) {
            milliSeconds %= 1000;
            milliSeconds = (milliSeconds > 0) ? this.pad(milliSeconds, 3) + 'ms'
                : '';

            return (days + hours + minutes + seconds + milliSeconds).trim();
        }

        return (days + hours + minutes + seconds).trim();
    };

    this.getDayTimeInSeconds = function() {
        var now = new Date();
        then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        return now.getTime() - then.getTime();
    };

    this.logFormat = function(message) {
        var time = '[' + this.timeDisplay(Date.now() - this.startTime, true) + ']: ';
        return time + ' ' + message;
    };

    this.log = function(message, allowNoty) {
        if (this.notyEnabled && (allowNoty == undefined || allowNoty)) {
            noty({
                text : this.logFormat(message),
                type : 'alert'
            });
        } else {
            console.log(this.logFormat(message));
        }
    };

    this.stackTrace = function() {
        var err = new Error();
        return err.stack;
    };

    this.logError = function(message) {
        if (this.notyEnabled) {
            noty({
                text : this.logFormat(message),
                type : 'error'
            });
        } else {
            alert('Error: ' + this.logFormat(message));
        }
    };

    this.formatEveryThirdPower = function(notations)
    {
        return function (value)
        {

            var base = 0;
            var notationValue = '';
            if (value >= 1000000 && Number.isFinite(value))
            {
                value /= 1000;
                while(Math.round(value) >= 1000)
                {
                    value /= 1000;
                    base++;
                }

                if (base > notations.length)
                {
                    return 'Infinity';
                }
                else
                {
                    notationValue = notations[base];
                }
            }

            return ( Math.round(value * 1000) / 1000.0 ) + notationValue;
        };
    }

    this.formatScientificNotation = function(value)
    {
        if (value === 0 || !Number.isFinite(value) || (Math.abs(value) > 1 && Math.abs(value) < 100))
        {
            return frozenUtils.formatRaw(value);
        }

        var sign = value > 0 ? '' : '-';
        value = Math.abs(value);
        var exp = Math.floor(Math.log(value)/Math.LN10);
        var num = Math.round((value/Math.pow(10, exp)) * 100) / 100;
        var output = num.toString();
        if (num === Math.round(num))
        {
            output += '.00';
        }
        else if (num * 10 === Math.round(num * 10))
        {
            output += '0';
        }

        return sign + output + '*10^' + exp;
    }

    this.formatRaw = function(value)
    {
        return Math.round(value * 1000) / 1000;
    }

    this.FormatterKeys = ['Off', 'Raw', 'Name', 'ShortName', 'ShortName2', 'Scientific'];
    this.Formatters = {
        'Off': undefined,
        'Raw': this.formatRaw,
        'Name': this.formatEveryThirdPower(['', ' million', ' billion', ' trillion', ' quadrillion',
            ' quintillion', ' sextillion', ' septillion', ' octillion',
            ' nonillion', ' decillion'
        ]),
        'ShortName': this.formatEveryThirdPower(['', ' M', ' B', ' T', ' Qa', ' Qi', ' Sx',' Sp', ' Oc', ' No', ' De' ]),
        'ShortName2': this.formatEveryThirdPower(['', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y']),
        'Scientific': this.formatScientificNotation
    }
}

frozenUtils = new FrozenUtils();