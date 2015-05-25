if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj) {
        return Object.toString.call(obj) === '[object Array]';
    };
};
String.prototype.format = function() {
	var formatted = this;
	for (var i = 0; i < arguments.length; i++) {
		var key = '{' + i.toString() + '}';
		if(formatted.indexOf(key) < 0) {
			throw new Error(StrLoc("Index {0} was not defined in string: {1}").format(i, formatted));
		}
		
    	formatted = formatted.replace(key, arguments[i]);
	}
	
	return formatted;
};
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
$.fn.textWidth = function(text, font) {
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').appendTo(document.body);
    var htmlText = text || this.val() || this.text();
    htmlText = $.fn.textWidth.fakeEl.text(htmlText).html(); //encode to Html
    htmlText = htmlText.replace(/\s/g, "&nbsp;"); //replace trailing and leading spaces
    $.fn.textWidth.fakeEl.html(htmlText).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};

var loader = new Loader();
declare = function(name, content) { loader.declare(name, content); };
include = function(name, source) { return loader.include(name, source); };
/** @constructor */
function Loader(nameSpace) {
	
	this.instances = {};
	this.declarations = {};
	this.refCount = {};
    this.includeThreshold = 1000;
    this.includeCounter = []
	this.include = function(name, source) {
		if(this.includeCounter === undefined) {
			return;
		}
        this.includeCounter.push(source + " -> " + name);
        if(this.includeCounter.length > this.includeThreshold) {
            this.includeCounter.shift();
        }
        if(name === undefined || typeof(name) == "function") {
			throw "Invalid arguments for include!";
		}
		if(this.instances[name] === undefined) {
			if(this.declarations[name] === undefined) {
				throw "No declaration for include " + name;
			}
			if(name === '$') {
				this.instances[name] = this.declarations[name](this.include);
			} else {
				this.instances[name] = new this.declarations[name](this.include);				
			}
		}
		
		if(this.refCount[name] === undefined) {
			this.refCount[name] = 0;
		}
		
		this.refCount[name]++;
		
		return this.instances[name];
	};
	
	this.declare = function(name, content) {
		if(this.declarations[name] !== undefined) {
			throw name + " was already declared!";
		}
		
		this.declarations[name] = content;
	};
	
	this.diagnostics = function() {
		var declarationKeys = "";
		for(var key in this.declarations) {
			declarationKeys += " " + key;
		}
		
		console.log("Declarations: " + declarationKeys);
		
		var instanceKeys = "";
		for(var key in this.instances) {
			instanceKeys += " " + key;
		}
		
		console.log("Instances: " + this.instances);
	};
};

Endless = {
		isDebug: false,
        isVerboseDebug: false,
        componentUpdateList: [],
        componentUpdateCount: 0,
        componentInitCount: 0,
        currentUpdateTick: 0,
        resetFrame: function() {
            Endless.componentUpdateList = [];
            Endless.componentUpdateCount = 0;
        }
};
Number.prototype.formatMoney = function (c, d, t) {
    var n = this;
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d == undefined ? "." : d;
    t = t == undefined ? "," : t;
    var ab;
    s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
var StrLoc = function(str) {
	return str;
};
if (typeof window !== 'undefined') {
    declare("$", jQuery);
} else {
    console.log("Running in non-browser mode, exiting...");
}

declare("Assert", function() {
    function Assert() {
        this.assertCount = 0;
        this.isDefined = function(arg, msg) {
            if(Endless.isDebug === false){
                return;
            }
            if(arg === undefined) {
                this.assertCount++;
                console.assert(false, msg);
            }
        };
        
        this.isUndefined = function(arg, msg) {
            if(Endless.isDebug === false){
                return;
            }
            if(arg !== undefined) {
                this.assertCount++;
                console.assert(false, msg);
            }
        };
        this.isNotNaN = function(arg, msg) {
            if(Endless.isDebug === false) {
                return;
            }
            if(isNaN(arg)) {
                this.assertCount++;
                console.assert(false, msg);
            }
        }
        this.isNaN = function(arg, msg) {
            if(Endless.isDebug === false) {
                return;
            }
            if(!isNaN(arg)) {
                this.assertCount++;
                console.assert(false, msg);
            }
        }
        
        this.isTrue = function(eval, msg) {
            if(Endless.isDebug === false){
                return;
            }
            if(eval === false) {
                this.assertCount++;
                console.assert(false, msg);
            }
        };
        
        this.isFalse = function(eval, msg) {
            if(Endless.isDebug === false){
                return;
            }
            if(eval === true) {
                this.assertCount++;
                console.assert(false, msg);
            }
        };
        
        this.isNumber = function(arg, msg) {
            if($.isNumeric(arg)) {
                return;
            }
            this.assertCount++;
            console.assert(false, msg);
        };
        this.hasAsserted = function() {
            return this.assertCount > 0;
        };
    }
    
    return new Assert();
    
});
manualFailAssert = function() {
    var assert = include('Assert','assert');
    assert.assertCount = 1;
}

/*
Copyright (c) 2008 Fred Palmer fred.palmer_at_gmail.com
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
declare('Base64', function() {
    function StringBuffer() {
        this.buffer = [];
    }
    StringBuffer.prototype.append = function append(string) {
        this.buffer.push(string);
        return this;
    };
    StringBuffer.prototype.toString = function toString() {
        return this.buffer.join("");
    };
    function Utf8EncodeEnumerator(input) {
        this._input = input;
        this._index = -1;
        this._buffer = [];
    }
    Utf8EncodeEnumerator.prototype = {
        current: Number.NaN,
        moveNext: function()
        {
            if (this._buffer.length > 0)
            {
                this.current = this._buffer.shift();
                return true;
            }
            else if (this._index >= (this._input.length - 1))
            {
                this.current = Number.NaN;
                return false;
            }
            else
            {
                var charCode = this._input.charCodeAt(++this._index);
                if ((charCode == 13) && (this._input.charCodeAt(this._index + 1) == 10))
                {
                    charCode = 10;
                    this._index += 2;
                }
                if (charCode < 128)
                {
                    this.current = charCode;
                }
                else if ((charCode > 127) && (charCode < 2048))
                {
                    this.current = (charCode >> 6) | 192;
                    this._buffer.push((charCode & 63) | 128);
                }
                else
                {
                    this.current = (charCode >> 12) | 224;
                    this._buffer.push(((charCode >> 6) & 63) | 128);
                    this._buffer.push((charCode & 63) | 128);
                }
                return true;
            }
        }
    }
    function Base64DecodeEnumerator(input) {
        this._input = input;
        this._index = -1;
        this._buffer = [];
    }
    Base64DecodeEnumerator.prototype = {
        current: 64,
        moveNext: function()
        {
            if (this._buffer.length > 0)
            {
                this.current = this._buffer.shift();
                return true;
            }
            else if (this._index >= (this._input.length - 1))
            {
                this.current = 64;
                return false;
            }
            else
            {
                var enc1 = Base64.codex.indexOf(this._input.charAt(++this._index));
                var enc2 = Base64.codex.indexOf(this._input.charAt(++this._index));
                var enc3 = Base64.codex.indexOf(this._input.charAt(++this._index));
                var enc4 = Base64.codex.indexOf(this._input.charAt(++this._index));
                var chr1 = (enc1 << 2) | (enc2 >> 4);
                var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                var chr3 = ((enc3 & 3) << 6) | enc4;
                this.current = chr1;
                if (enc3 != 64)
                    this._buffer.push(chr2);
                if (enc4 != 64)
                    this._buffer.push(chr3);
                return true;
            }
        }
    };
    return {
        codex : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode : function (input)
        {
            var output = new StringBuffer();
            var enumerator = new Utf8EncodeEnumerator(input);
            while (enumerator.moveNext())
            {
                var chr1 = enumerator.current;
                enumerator.moveNext();
                var chr2 = enumerator.current;
                enumerator.moveNext();
                var chr3 = enumerator.current;
                var enc1 = chr1 >> 2;
                var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                var enc4 = chr3 & 63;
                if (isNaN(chr2))
                {
                    enc3 = enc4 = 64;
                }
                else if (isNaN(chr3))
                {
                    enc4 = 64;
                }
                output.append(this.codex.charAt(enc1) + this.codex.charAt(enc2) + this.codex.charAt(enc3) + this.codex.charAt(enc4));
            }
            return output.toString();
        },
        decode : function (input)
        {
            var output = new StringBuffer();
            var enumerator = new Base64DecodeEnumerator(input);
            while (enumerator.moveNext())
            {
                var charCode = enumerator.current;
                if (charCode < 128)
                    output.append(String.fromCharCode(charCode));
                else if ((charCode > 191) && (charCode < 224))
                {
                    enumerator.moveNext();
                    var charCode2 = enumerator.current;
                    output.append(String.fromCharCode(((charCode & 31) << 6) | (charCode2 & 63)));
                }
                else
                {
                    enumerator.moveNext();
                    var charCode2 = enumerator.current;
                    enumerator.moveNext();
                    var charCode3 = enumerator.current;
                    output.append(String.fromCharCode(((charCode & 15) << 12) | ((charCode2 & 63) << 6) | (charCode3 & 63)));
                }
            }
            return output.toString();
        }
    }
})

declare("Component", function() {
    var assert = include("Assert",'component');
    
    if(Endless.isDebug === true) {
        idCheck = {};
    }
    
    function Component() {
        this.initDone = false;
        this.updateTime = undefined;
        this.updateInterval = 0;
        
        this.enabled = true;
        this.invalidated = true;
        this.updateWhenNeededOnly = false;
    }
    Component.prototype.init = function() {
        assert.isDefined(this.id, "Component needs valid Id");
        if(Endless.isDebug === true) {
            assert.isUndefined(idCheck[this.id], "Duplicate ID: {0}".format(this.id));
            idCheck[this.id] = true;
        }
        Endless.componentInitCount++;
        this.initDone = true;
    };
    Component.prototype.update = function(currentTime) {
        assert.isTrue(this.initDone, "Init must be called before update on {0}".format(this.id));
        if(this.enabled === false) {
            return false;
        }
        if(this.invalidated === false && this.updateWhenNeededOnly === true) {
            return false;
        }
        if(this.invalidated === false && this.updateInterval > 0 && currentTime.getElapsed() < this.updateInterval) {
            return false;
        }
        Endless.componentUpdateList.push(this.id);
        Endless.componentUpdateCount++;
        this.updateTime = currentTime.getTime();
        this.invalidated = false;
        return true;
    };
    Component.prototype.remove = function() {
        if(Endless.isDebug) {
            delete idCheck[this.id];
        }
    };
    Component.prototype.invalidate = function() {
        this.invalidated = true;
    };
    var surrogate = function(){};
    surrogate.prototype = Component.prototype;
    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Component.call(self); }
    };
    
});

declare('CoreSave', function(require) {
    var log = include('Log','coreSave');
    var assert = include('Assert','coreSave');
    var type = include('Type','coreSave');
    var lzw = include('Lzw','coreSave');
    
    function SaveMapping(host, name) {
        this.host = host;
        this.name = name;
        this.type = type.EnumDataTypeString;
        this.defaultValue = undefined;
        this.isPersistent = false;
        this.saveCallback = false;
        this.loadCallback = false;
        this.resetCallback = false;
    };
    SaveMapping.prototype.asNumber = function(defaultValue) {
        this.type = type.EnumDataTypeNumber;
        if(defaultValue !== undefined) {
            return this.withDefault(defaultValue);
        }
        this._updateDefaultByType();
        return this;
    };
    SaveMapping.prototype.asFloat = function(defaultValue) {
        this.type = type.EnumDataTypeFloat;
        if(defaultValue !== undefined) {
            return this.withDefault(defaultValue);
        }
        this._updateDefaultByType();
        return this;
    };
    SaveMapping.prototype.asBool = function(defaultValue) {
        this.type = type.EnumDataTypeBool;
        if(defaultValue !== undefined) {
            return this.withDefault(defaultValue);
        }
        this._updateDefaultByType();
        return this;
    };
    SaveMapping.prototype.asJson = function(defaultValue) {
        this.type = type.EnumDataTypeJson;
        if(defaultValue !== undefined) {
            return this.withDefault(defaultValue);
        }
        this._updateDefaultByType();
        return this;
    };
    SaveMapping.prototype.asJsonArray = function(defaultValue) {
        this.type = type.EnumDataTypeJsonArray;
        if(defaultValue !== undefined) {
            return this.withDefault(defaultValue);
        }
        this._updateDefaultByType();
        return this;
    };
    SaveMapping.prototype.withDefault = function(value) {
        assert.isDefined(value);
        var formattedValue = type.getReadValueByType(value, this.type);
        assert.isDefined(formattedValue, "Default value {0} did not match the selected mapping type {1}".format(value, this.type));
        this.defaultValue = type.getReadValueByType(value, this.type);
        this.host[this.name] = value;
        return this;
    };
    SaveMapping.prototype.persistent = function(value) {
        if(value !== undefined && value !== true && value !== false) {
            throw new Error(StrLoc("Invalid argument for persistent: {0}").format(value));
        }
        this.isPersistent = value || true;
        return this;
    };
    SaveMapping.prototype.withCallback = function(saveCallback, loadCallback, resetCallback) {
        this.saveCallback = saveCallback;
        this.loadCallback = loadCallback;
        this.resetCallback = resetCallback;
    };
    SaveMapping.prototype.getKey = function() {
        return this.host.id + '_' + this.name;
    };
    SaveMapping.prototype.getValue = function() {
        return this.host[this.name];
    };
    SaveMapping.prototype.setValue = function(value) {
        assert.isDefined(value);
        var formattedValue = type.getReadValueByType(value, this.type);
        assert.isDefined(formattedValue, "Value {0} did not match the selected mapping type {1}".format(value, this.type));
        this.host[this.name] = formattedValue;
    };
    SaveMapping.prototype.resetToDefault = function(ignorePersistent) {
        if(ignorePersistent !== true && this.isPersistent) {
            return;
        }
        this.host[this.name] = this.defaultValue;
    };
    SaveMapping.prototype.callbackSave = function() {
        if(this.saveCallback === false) {
            return;
        }
        if(this.host.onSave === undefined) {
            log.error(StrLoc("Host declared callback but did not define onSave: {0}").format(this.host.id));
            return;
        }
        this.host.onSave();
    };
    SaveMapping.prototype.callbackLoad = function() {
        if(this.loadCallback === false) {
            return;
        }
        if(this.host.onLoad === undefined) {
            log.error(StrLoc("Host declared callback but did not define onLoad: {0}").format(this.host.id));
            return;
        }
        this.host.onLoad();
    };
    SaveMapping.prototype.callbackReset = function() {
        if(this.resetCallback === false) {
            return;
        }
        if(this.host.onReset === undefined) {
            log.error(StrLoc("Host declared callback but did not define onReset: {0}").format(this.host.id));
            return;
        }
        this.host.onReset();
    };
    SaveMapping.prototype._updateDefaultByType = function() {
        this.defaultValue = type.getDefaultValueByType(this.type);
        this.host[this.name] = this.defaultValue;
    };
    function CoreSave() {
        this.mappings = [];
        this.stateName = "undefined";
        this.stateSlot = 1;
    }
    CoreSave.prototype.save = function() {
        var data = {};
        for(var i = 0; i < this.mappings.length; i++) {
            var mapping = this.mappings[i];
            var key = mapping.getKey();
            var value = undefined;
            try
            {
                value = type.getWriteValueByType(mapping.getValue(), mapping.type);
            } catch(e) {
                log.error(StrLoc("Could not get write value for {0}").format(key));
                throw e;
            }
            data[key] = value;
            mapping.callbackSave();
        }
        var compressedData = lzw.compress(encodeURIComponent(JSON.stringify(data)));
        if(this.doSave(compressedData) === true)
        {
        } else {
            log.error(StrLoc("Saving failed!"));
        }
    };
    CoreSave.prototype.load = function() {
        var data = {};
        var compressedData = this.doLoad();
        if(compressedData !== undefined) {
            log.debug(StrLoc("Loaded {0} bytes").format(compressedData.length));
            data = JSON.parse(decodeURIComponent(lzw.decompress(compressedData)));
        }
        for(var i = 0; i < this.mappings.length; i++) {
            var mapping = this.mappings[i];
            var key = mapping.getKey();
            if(data[key] === undefined) {
                continue;
            }
            var value = type.getReadValueByType(data[key], mapping.type);
            mapping.setValue(value);
            mapping.callbackLoad();
        }
        log.debug(StrLoc("Loaded {0} bytes").format(this.doGetSize()));
    };
    CoreSave.prototype.reset = function(fullReset) {
        for(var i = 0; i < this.mappings.length; i++) {
            var mapping = this.mappings[i];
            mapping.resetToDefault(fullReset);
            mapping.callbackReset();
        }
        log.debug(StrLoc("Reset done, full={0}").format(fullReset));
    };
    CoreSave.prototype.doLoad = function() { log.error("doLoad not implemented!"); return undefined; };
    CoreSave.prototype.doSave = function(data) { log.error("doSave not implemented!"); return false; };
    CoreSave.prototype.doGetSize = function() { log.error("doGetSize not implemented!"); return 0; };
    CoreSave.prototype.getStorageKey = function() {
        return this.stateName + "_" + this.stateSlot.toString();
    };
    CoreSave.prototype.register = function(host, name) {
        assert.isDefined(host);
        assert.isDefined(host.id, "Host needs to have an id for saving state");
        assert.isDefined(name);
        host[name] = undefined;
        var mapping = new SaveMapping(host, name);
        this.mappings.push(mapping);
        return mapping;
    };
    var surrogate = function(){};
    surrogate.prototype = CoreSave.prototype;
    
    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { CoreSave.call(self); }
	};
    
});

declare('CoreUtils', function() {
    var assert = include('Assert','coreUtils');
    var global = Function('return this')() || (42, eval)('this');
    function CoreUtils() {
        this.rgba = function(r, g, b, a) {
              r = ~~r || 0;
              g = ~~g || 0;
              b = ~~b || 0;
              a = a || 1;
              return ["rgba(", r, ",", g,",", b, ",", a,")"].join("");
        };
        
        this.pad = function(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        };
        
        this.getRandom = function(min, max) {
            return Math.random() * (max - min) + min;
        };
        
        this.getRandomInt = function(min, max) {
            return ~~(Math.random() * (max - min + 1)) + min;
        };
        this.getSigma = function(number) {
            return (number*(number+1))/2;
        }
        
        this.getGlobal = function() {
            return global;
        };
        
        this.isJsonString = function(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            
            return true;
        };
        
        this.enumIsDefined = function(enumObject, value) {
            for(var key in enumObject) {
                if(enumObject[key] === value) {
                    return true;
                }
            }
            
            return false;
        };
        
        this.mergeObjects = function(objectA, objectB) {
            var result = {};
            if(objectA !== undefined) {
                for(var key in objectA) {
                    result[key] = objectA[key];
                };
            }
            
            if(objectB !== undefined) {
                for(var key in objectB) {
                    result[key] = objectB[key];
                };
            }
            
            return result;
        };
        
        this.getStackTrace = function() {
            return new Error().stack;
        };
        
        this.capitalizeString = function(value) {
        	return value.charAt(0).toUpperCase() + value.slice(1);
        };
        this.pickRandomProperty = function(obj) {
            var keys = Object.keys(obj)
            return obj[keys[ keys.length * Math.random() << 0]];
        }
        this.getImageUrl = function(imagePath) {
            return 'url("' + imagePath + '")';
        };
        this.setBackgroundImage = function(target, resource, repeat) {
            assert.isTrue(target.length > 0, "Target for background image was null!");
            if(repeat === undefined) {
                target.css({'background-image': this.getImageUrl(resource), 'background-size': '100% 100%', 'background-repeat': 'no-repeat'});
            } else {
                target.css({'background-image': this.getImageUrl(resource), 'background-repeat': repeat});
            }
        }
                
        this.splitDateTime = function(seconds) {
            var result = [0, 0, 0, 0, 0, 0];
            var milliSeconds = Math.floor(seconds);
            
            result[0] = Math.floor(milliSeconds / (365 * 24 * 60 * 60 * 1000));
            
            milliSeconds %= (365 * 24 * 60 * 60 * 1000);
            result[1] = Math.floor(milliSeconds / (24 * 60 * 60 * 1000));
            
            milliSeconds %= (24 * 60 * 60 * 1000);
            result[2] = Math.floor(milliSeconds / (60 * 60 * 1000));
        
            milliSeconds %= (60 * 60 * 1000);
            result[3] = Math.floor(milliSeconds / (60 * 1000));
        
            milliSeconds %= (60 * 1000);
            result[4] = Math.floor(milliSeconds / 1000);
            result[5] = milliSeconds;
            
            return result;
        };
        
        this.getDurationDisplay = function(seconds) {
        	if (seconds === 0 || seconds === Number.POSITIVE_INFINITY) {
                return '~~';
            }
            
            var timeSplit = this.splitDateTime(seconds);
            years = timeSplit[0] > 0 ? timeSplit[0] + 'y ' : '';
            days = timeSplit[1] > 0 ? timeSplit[1] + 'd ' : '';
            time = this.getTimeDisplay(seconds);
            
            return years + days + time;
        };
        
        this.getTimeDisplay = function(seconds, use24hourTime) {
            if (seconds === 0 || seconds === Number.POSITIVE_INFINITY) {
                return '~~';
            }
            
            var timeSplit = this.splitDateTime(seconds);
            var suffix = '';
            if (use24hourTime === false) {
            	if (timeSplit[2] > 12) {
            		timeSplit[2] -= 12;
            		suffix = ' ' + "pm";
            	} else {
            		suffix = ' ' + "am";
            	}
            }
            
            var hourResult = this.pad(timeSplit[2], 2) + ':';
            var minuteResult = this.pad(timeSplit[3], 2) + ':';
            var secondResult = this.pad(timeSplit[4], 2);
            return hourResult + minuteResult + secondResult + suffix;
        };
        this.processInterval = function(gameTime, tickTime, delay, target, callback, value) {
            assert.isDefined(callback);
            if(tickTime === 0) {
                return gameTime.current;
            }
            var timeMissed = Math.floor(Math.abs(gameTime.current - (tickTime + delay)) / delay);
            if(timeMissed > 0) {
                for (var i = 0; i < timeMissed; i++) {
                    callback(target, value);
                }
                return gameTime.current;
            } else {
                return tickTime;
            }
        }
        
        this.formatEveryThirdPower = function(notations) 
        {
          return function (value)
          {
            var base = 0;
            var notationValue = '';
            if (value >= 1000000 && Number.isFinite(value))
            {
              value /= 1000;
              while(Math.round(value) >= 1000) {
                value /= 1000;
                base++;
              }
              
              if (base > notations.length) {
                return "Infinity";
              } else {
                notationValue = notations[base];
              }
            }
        
            return ( Math.round(value * 1000) / 1000.0 ).toLocaleString() + notationValue;
          };
        };
        
        this.formatScientificNotation = function(value)
        {
          if (value === 0 || !Number.isFinite(value) || (Math.abs(value) > 1 && Math.abs(value) < 100))
          {
            return this.formatRaw(value);
          }
          
          var sign = value > 0 ? '' : '-';
          value = Math.abs(value);
          var exp = ~~(Math.log(value)/Math.LN10);
          var num = Math.round((value/Math.pow(10, exp)) * 100) / 100;
          var output = num.toString();
          if (num === Math.round(num)) {
            output += '.00';
          } else if (num * 10 === Math.round(num * 10)) {
            output += '0';
          }
          
          return sign + output + '*10^' + exp;
        };
        
        this.formatRounded = function(value)
        {
          return (Math.round(value * 1000) / 1000).toString();
        };
        
        this.formatRaw = function(value) {
            if(value === undefined || value === null) {
                return "";
            }
            
            return value.toString();
        };
        
        this.formatters = {
                'raw': this.formatRaw,
                'rounded': this.formatRaw,
                'name': this.formatEveryThirdPower(['', " million", StrLoc(' billion'), StrLoc(' trillion'), StrLoc(' quadrillion'),
                                                    " quintillion", StrLoc(' sextillion'), StrLoc(' septillion'), StrLoc(' octillion'),
                                                    " nonillion", StrLoc(' decillion')
                                                        ]),
                'shortName': this.formatEveryThirdPower(['', " M", StrLoc(' B'), StrLoc(' T'), StrLoc(' Qa'), StrLoc(' Qi'), StrLoc(' Sx'),StrLoc(' Sp'), StrLoc(' Oc'), StrLoc(' No'), StrLoc(' De') ]),
                'shortName2': this.formatEveryThirdPower(['', " M", StrLoc(' G'), StrLoc(' T'), StrLoc(' P'), StrLoc(' E'), StrLoc(' Z'), StrLoc(' Y')]),
                'scientific': this.formatScientificNotation
        };
    };
        
    return new CoreUtils();
});

declare('EventAggregate', function () {
    var log = include('Log','eventAggregate');
    function EventAggregate() {
        this.registry = {};
    }
    EventAggregate.prototype.subscribe = function(type, callback) {
        if(this.registry[type] === undefined) {
            this.registry[type] = [];
        }
        this.registry[type].push(callback);
    }
    EventAggregate.prototype.unsubscribe = function(type, callback) {
        if(this.registry[type] === undefined) {
            log.error("Unsubscribe failed, event not registered");
            return;
        }
        for(var i = 0; i < this.registry[type].length; i++) {
            if(this.registry[type][i] === callback) {
                this.registry[type].splice(i, 1);
                break;
            }
        }
    }
    EventAggregate.prototype.publish = function(type, eventData) {
        if(this.registry[type] === undefined) {
            return;
        }
        for(var i = 0; i < this.registry[type].length; i++) {
            this.registry[type][i](eventData);
        }
    }
    return new EventAggregate();
});

declare("GameTime", function() {
    var assert = include("Assert",'gameTime');
    
    var timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    function GameTime() {
    	this.start = undefined;
    	this.current = undefined;
    	this.currentLocale = undefined;
    	this.elapsed = undefined;
    };
    GameTime.prototype.update = function() {
        this.current = Date.now();
        this.currentLocale = this.current - timeZoneOffset;
        this.elapsed = this.current - this.start;
        assert.isTrue(this.current >= this.start, "GameTime may not be initialized properly!");
    };
    GameTime.prototype.reset = function() {
        this.start = Date.now();
        this.update();
    };
    GameTime.prototype.getTime = function(useLocalTime) {
        if (useLocalTime === true) {
            return this.currentLocale;
        }
        return this.current;
    };
    GameTime.prototype.getElapsed = function() {
        return this.elapsed;
    };
    GameTime.prototype.getElapsedSinceUpdate = function() {
        return Date.now() - this.current;
    };
    GameTime.prototype.getStartTime = function() {
        return this.start;
    };
    
    return {
        getCurrentLocalTime: function() { return Date.now() - timeZoneOffset; },
        create: function() {
        	var time = new GameTime();
        	time.reset();
        	return time; 
        }
    };
});

declare("Log", function() {
	var coreUtils = include("CoreUtils",'log');
    var level = {
        debug : 1,
        info : 2,
        error : 3,
        warning: 4
    };
    
    var getLevelDisplay = function(targetLevel) {
        switch(targetLevel) {
            case level.info: {
                return "INFO";
                break;
            };
            
            case level.error: {
                return "ERROR";
                break;
            };
            
            case level.warning: {
                return "WARNING";
                break;
            };
            
            case level.debug: {
                return "DEBUG";
                break;
            };
        };
        
        throw new Error(StrLoc("Unknown Error Level: {0}").format(targetLevel));
    };
    
    var logFormat = function(time, level, message) {
        var timeDisplay = '[' + coreUtils.getTimeDisplay(time || Date.now()) + ']: ';
        var fullMessage = timeDisplay + getLevelDisplay(level) + ' ' + message;
    
        switch(level) {
            case level.error: {
                throw new Error(fullMessage);
                break;
            }
            
            default: {
                console.log(fullMessage);
                break;
            }
        }
    };
    
    function Log() {
        this.startTime = Date.now();
        this.lastLogTime = Date.now();
        this.level = level;
        
        this.log = function(message, level) {
            logFormat(Date.now() - this.startTime, level, message);
        };
        this.info = function(message, silent) {
            logFormat(Date.now() - this.startTime, level.info, message);
        };
        
        this.error = function(message) {
            logFormat(Date.now() - this.startTime, level.error, message);
        };
        
        this.warning = function(message) {
            logFormat(Date.now() - this.startTime, level.warning, message);
        };
        
        this.debug = function(message) {
            if(Endless.isDebug === false) {
                return;
            }
            
            logFormat(Date.now() - this.startTime, level.debug, message);
        };
    };
    
    return new Log();
});

/*
 * The MIT License
 *
 * Copyright (c) 2009 Olle Törnström studiomediatech.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * CREDIT: Initially implemented by Diogo Kollross and made publicly available
 *         on the website http://www.geocities.com/diogok_br/lz77.
 */
/**
 * This class provides simple LZ77 compression and decompression.
 *
 * @author Olle Törnström olle[at]studiomediatech[dot]com
 * @created 2009-02-18
 */
declare("Lzw", function() {
    function LZW() {
        var settings = {};
        var referencePrefix = "`";
        var referenceIntBase = settings.referenceIntBase || 96;
        var referenceIntFloorCode = " ".charCodeAt(0);
        var referenceIntCeilCode = referenceIntFloorCode + referenceIntBase - 1;
        var maxStringDistance = Math.pow(referenceIntBase, 2) - 1;
        var minStringLength = settings.minStringLength || 5;
        var maxStringLength = Math.pow(referenceIntBase, 1) - 1 + minStringLength;
        var defaultWindowLength = settings.defaultWindowLength || 144;
        var maxWindowLength = maxStringDistance + minStringLength;
        var encodeReferenceInt = function (value, width) {
            if ((value >= 0) && (value < (Math.pow(referenceIntBase, width) - 1))) {
                var encoded = "";
                while (value > 0) {
                    encoded = (String.fromCharCode((value % referenceIntBase) + referenceIntFloorCode)) + encoded;
                    value = Math.floor(value / referenceIntBase);
                }
                var missingLength = width - encoded.length;
                for (var i = 0; i < missingLength; i++) {
                    encoded = String.fromCharCode(referenceIntFloorCode) + encoded;
                }
                return encoded;
            } else {
                throw "Reference int out of range: " + value + " (width = " + width + ")";
            }
        };
        var encodeReferenceLength = function (length) {
            return encodeReferenceInt(length - minStringLength, 1);
        };
        var decodeReferenceInt = function (data, width) {
            var value = 0;
            for (var i = 0; i < width; i++) {
                value *= referenceIntBase;
                var charCode = data.charCodeAt(i);
                if ((charCode >= referenceIntFloorCode) && (charCode <= referenceIntCeilCode)) {
                    value += charCode - referenceIntFloorCode;
                } else {
                    throw "Invalid char code in reference int: " + charCode;
                }
            }
            return value;
        };
        var decodeReferenceLength = function (data) {
            return decodeReferenceInt(data, 1) + minStringLength;
        };
        /**
         * Compress data using the LZ77 algorithm.
         *
         * @param data
         * @param windowLength
         */
        this.compress = function (data, windowLength) {
            windowLength = windowLength || defaultWindowLength;
            if (windowLength > maxWindowLength) {
                throw "Window length too large";
            }
            var compressed = "";
            var pos = 0;
            var lastPos = data.length - minStringLength;
            while (pos < lastPos) {
                var searchStart = Math.max(pos - windowLength, 0);
                var matchLength = minStringLength;
                var foundMatch = false;
                var bestMatch = {distance:maxStringDistance, length:0};
                var newCompressed = null;
                while ((searchStart + matchLength) < pos) {
                    var isValidMatch = ((data.substr(searchStart, matchLength) == data.substr(pos, matchLength)) && (matchLength < maxStringLength));
                    if (isValidMatch) {
                        matchLength++;
                        foundMatch = true;
                    } else {
                        var realMatchLength = matchLength - 1;
                        if (foundMatch && (realMatchLength > bestMatch.length)) {
                            bestMatch.distance = pos - searchStart - realMatchLength;
                            bestMatch.length = realMatchLength;
                        }
                        matchLength = minStringLength;
                        searchStart++;
                        foundMatch = false;
                    }
                }
                if (bestMatch.length) {
                    newCompressed = referencePrefix + encodeReferenceInt(bestMatch.distance, 2) + encodeReferenceLength(bestMatch.length);
                    pos += bestMatch.length;
                } else {
                    if (data.charAt(pos) != referencePrefix) {
                        newCompressed = data.charAt(pos);
                    } else {
                        newCompressed = referencePrefix + referencePrefix;
                    }
                    pos++;
                }
                compressed += newCompressed;
            }
            return compressed + data.slice(pos).replace(/`/g, "``");
        };
        /**
         * Decompresses LZ77 compressed data.
         *
         * @param data
         */
        this.decompress = function (data) {
            var decompressed = "";
            var pos = 0;
            while (pos < data.length) {
                var currentChar = data.charAt(pos);
                if (currentChar != referencePrefix) {
                    decompressed += currentChar;
                    pos++;
                } else {
                    var nextChar = data.charAt(pos + 1);
                    if (nextChar != referencePrefix) {
                        var distance = decodeReferenceInt(data.substr(pos + 1, 2), 2);
                        var length = decodeReferenceLength(data.charAt(pos + 3));
                        decompressed += decompressed.substr(decompressed.length - distance - length, length);
                        pos += minStringLength - 1;
                    } else {
                        decompressed += referencePrefix;
                        pos += 2;
                    }
                }
            }
            return decompressed;
        };
    }
    return new LZW();
})

declare("MathExtension", function() {
    var log = include("Log",'mathExtension');
    var assert = include("Assert",'mathExtension');
    
    function Point(x, y) {
        this.x = x;
        this.y = y;
        
        this.isValid = function() {
            return this.x !== undefined && this.y !== undefined;
        };
    }
    
    function Rect(x, y, w, h) {
        this.position = new Point(x, y);
        this.size = new Point(w, h);
        
        this.isValid = function() {
            return this.position.isValid() && this.size.isValid();
        };
    }
    
    function MathExtension() {
    	
    	this.maxInteger = 1000000000000000;
    	this.minInteger = -this.maxInteger;
    	
    	this.maxNumber = Number.MAX_VALUE;
    	this.minNumber = Number.MIN_VALUE;
    	    	
        this.point = function(x, y) {
            return new Point(x, y);
        };
        
        this.rect = function(x, y, w, h) {
            return new Rect(x, y, w, h);
        };
        
        this.safeAdd = function(originalValue, addValue, obeyLimit, decimals) {
        	assert.isDefined(addValue);
        	assert.isDefined(originalValue);
        	assert.isTrue(isNaN(addValue) === false, "Value to add can't be NaN");
        	assert.isTrue(addValue > 0, "Value to add needs to be positive, use safeRemove otherwise");
        	
        	var newValue = originalValue + addValue;
        	if(obeyLimit === true && newValue > this.maxInteger) {
        		log.warning(StrLoc("SafeAdd: Lost value in add, number exceeded max!"));
        		return this.maxInteger;
        	}
        	
        	if(decimals === undefined) {
        		decimals = 2;
        	}
        	
        	return this.roundDecimals(newValue, decimals);
        };
        
        this.safeRemove = function(originalValue, removeValue, obeyLimit, decimals) {
        	assert.isDefined(removeValue);
        	assert.isDefined(originalValue);
        	assert.isTrue(isNaN(removeValue) === false, "Value to remove can't be NaN");
        	assert.isTrue(removeValue < 0, "Value to remove needs to be negative, use safeAdd otherwise");
        	
        	var newValue = originalValue - removeValue;
        	if(obeyLimit === true && newValue < this.minInteger) {
        		log.warning(StrLoc("SafeRemove: Lost value in remove, number exceeded min!"));
        		return this.minInteger;
        	}
        	
        	if(decimals === undefined) {
        		decimals = 2;
        	}
        	
        	return this.roundDecimals(newValue, decimals);
        };
        
        this.roundDecimals = function(number, decimals) {
        	var multiplier = Math.pow(10, decimals);
            return Math.round(number * multiplier) / multiplier;
        };
    };
    
    return new MathExtension();
    
});

declare("Type", function() {
	include("$");
	var log = include("Log",'type');
	var assert = include("Assert",'type');
    
    var objectConstructor = {}.constructor;    
    
    function Type() {
    	this.EnumDataTypeString = 1;
    	this.EnumDataTypeNumber = 2;
    	this.EnumDataTypeFloat = 3;
    	this.EnumDataTypeBool = 4;
    	this.EnumDataTypeJson = 5;
    	this.EnumDataTypeJsonArray = 6;
        
        this.determineDataType = function(value) {
        	var internalType = typeof value;
        	if(internalType === "string") {
        		return this.EnumDataTypeString;
        	} else if (internalType === "boolean") {
        		return this.EnumDataTypeBool;
        	}
        	
        	if($.isNumeric(value)) {
            	if(value %1 === 0) {
            		return this.EnumDataTypeNumber;
            	} else {
            		return this.EnumDataTypeFloat;
            	}
        	}
        	if(value.constructor === objectConstructor) {
        		return this.EnumDataTypeJson;
        	}
        	
        	if(Array.isArray(value)) {
        		return this.EnumDataTypeJsonArray;
        	}
        	
        	return undefined;
        };
        
        this.isValueOfType = function(value, type) {
        	var valueType = this.determineDataType(value);
        	
        	if(type === this.EnumDataTypeFloat && valueType === this.EnumDataTypeNumber) {
        		return true;
        	}
        	
            return valueType === type;
        };
        
        this.getDefaultValueByType = function(type) {
            switch(type) {
                case this.EnumDataTypeString: return undefined;
                case this.EnumDataTypeNumber: return 0;
                case this.EnumDataTypeFloat: return 0.0;
                case this.EnumDataTypeBool: return false;
                case this.EnumDataTypeJson: return {};
                case this.EnumDataTypeJsonArray: return [];
                
                default: throw new Error(StrLoc("getDefaultValueByType not implemented for {0}").format(type));
            }
        };
        
        this.getReadValueByType = function(value, type) {
            if(this.isValueOfType(value, type) === true) {
                return value;
            }
            
            var result = undefined;
            switch(type) {
                case this.EnumDataTypeString: {
                	result = value.toString(); 
                	break;
                }
                
                case this.EnumDataTypeNumber: {
                	result = parseInt(value, 10);
                	break;
                }
                
                case this.EnumDataTypeFloat: {
                	result = parseFloat(value);
                	break;
                }
                
                case this.EnumDataTypeBool: {
                	result = value === "1";
                	break;                	
                }
                
                case this.EnumDataTypeJson: {
                    try {
                    	result = JSON.parse(value);
                    } catch (e) {
                        log.error(StrLoc("Failed to load JSON value: {0}\n{1}").format(value, e));
                        value = undefined;
                    }
                    
                    break;
                }
                
                case this.EnumDataTypeJsonArray: {
                    try {
                    	result = JSON.parse(value);
                    } catch (e) {
                        log.error(StrLoc("Failed to load JSON Array value: {0}\n{1}").format(value, e));
                        result = undefined;
                    }
                    
                    break;
                }
            
                default: throw new Error(StrLoc("getReadValueByType not implemented for {0}").format(type));
            }
            
            if(Endless.isDebug) {
            	var determinedType = this.determineDataType(result);
            	
            	if(!(type === this.EnumDataTypeFloat && determinedType === this.EnumDataTypeNumber)) {
            		assert.isTrue(determinedType === type, "Read {0} as {1}, determined type {2} as {3}".format(value, result, type, determinedType));            		
            	}
            }
            
            return result;
        };
        
        this.getWriteValueByType = function(value, type) {
            if(this.isValueOfType(value, type) !== true) {
                throw new Error(StrLoc("getWriteValueByType arguments mismatch: '{0}' as '{1}'").format(value, type));
            }
            
            switch(type) {
                case this.EnumDataTypeString: return value;
                case this.EnumDataTypeNumber: return value.toString();
                case this.EnumDataTypeFloat: return value.toString();
                case this.EnumDataTypeBool: return value === true ? "1" : "0";
                case this.EnumDataTypeJson: return JSON.stringify(value);
                case this.EnumDataTypeJsonArray: return JSON.stringify(value);
            
                default: throw new Error(StrLoc("getWriteValueByType not implemented for {0}").format(type));
            }
        };
    }
    
    return new Type();
    
});

declare("TemplateContent", function() { return {
	emptyElement: '<div id="{{id}}"></div>'
}; });

declare('Debug', function () {
    var log = include('Log','debug');
    var gameTime = include('GameTime','debug');
    var component = include('Component','debug');
    var settings = include('Settings','debug');
    var staticData = include('StaticData','debug');
    var eventAggregate = include('EventAggregate','debug');
    Debug.prototype = component.prototype();
    Debug.prototype.$super = parent;
    Debug.prototype.constructor = Debug;
    function Debug() {
        component.construct(this);
        this.id = "Debug";
        this.currentTime = gameTime.getCurrentLocalTime();
        this.entries = {};
    }
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

 function FrozenBattleData() {
	this.disabled = false;
	this.updateInterval = 1000;
	this.logLimit = 100;
	
	this.enchantingEnabled = true;
	this.enchantingBaseChance = 0.5;
	this.enchantingBaseMultiplier = 0.3;
	
	this.autoSellActive = false;
	this.autoSellThreshold = 2;
	
	this.autoCombatActive = false;
	this.autoCombatKeepLevelDifference = true;
	this.autoCombatLastAttackTime = 0;
	this.autoCombatMaxLevelDifference = 5;
	this.autoCombatLevel = 1;
	
	this.statIncreaseStrength = 0;
	this.statIncreaseStamina = 0;
	this.statIncreaseAgi = 0;
	
	this.improvedSalePriceEnabled = true;
	this.formatHealthBarNumbers = true;
	this.detailedLogging = true;
	this.numberFormatter = 1;
	this.levelsReset = 0;
	this.applyLevelResetBonus = true;
	this.statsBought = 0;
	
	this.log = [];
	
	this.stats = {};
	
	this.save = function()
	{
		if (typeof (Storage) == "undefined") {
			return;
		}
		
		localStorage.fb_disabled = this.disabled;
		localStorage.fb_updateInterval = this.updateInterval;
		localStorage.fb_logLimit = this.logLimit;
		
		localStorage.fb_enchantingEnabled = this.enchantingEnabled;
		localStorage.fb_enchantingBaseChance = this.enchantingBaseChance;
		localStorage.fb_enchantingBaseMultiplier = this.enchantingBaseMultiplier;
		
		localStorage.fb_autoSellActive = this.autoSellActive;
		localStorage.fb_autoSellThreshold = this.autoSellThreshold;
		
		localStorage.fb_autoCombatActive = this.autoCombatActive;
		localStorage.fb_autoCombatKeepLevelDifference = this.autoCombatKeepLevelDifference;
		localStorage.fb_autoCombatLastAttackTime = this.autoCombatLastAttackTime;
		localStorage.fb_autoCombatMaxLevelDifference = this.autoCombatMaxLevelDifference;
		localStorage.fb_autoCombatLevel = this.autoCombatLevel;
		
		localStorage.fb_statIncreaseStrength = this.statIncreaseStrength;
		localStorage.fb_statIncreaseStamina = this.statIncreaseStamina;
		localStorage.fb_statIncreaseAgi = this.statIncreaseAgi;
		
		localStorage.fb_improvedSalePriceEnable = this.improvedSalePriceEnabled;
		localStorage.fb_detailedLogging = this.detailedLogging;
		localStorage.fb_numberFormatter = this.numberFormatter;
		localStorage.fb_formatHealthBarNumbers = this.formatHealthBarNumbers;
		localStorage.fb_levelsReset = this.levelsReset;
		localStorage.fb_applyLevelResetBonus = this.applyLevelResetBonus;
		localStorage.fb_statsBought = this.statsBought;
		
		var statKeys = Object.keys(this.stats);
		localStorage.fb_statCount = statKeys.length;
		for(var i = 0; i < statKeys.length; i++) {
		    localStorage['fb_stat_name_'+i] = statKeys[i];
		    localStorage['fb_stat_value_'+i] = this.stats[statKeys[i]];
		}
	}
	
	this.load = function()
	{
		if (typeof (Storage) == "undefined") {
			return;
		}
		
		this.disabled = frozenUtils.loadBool("fb_disabled", false);
		this.updateInterval = frozenUtils.loadInt("fb_updateInterval", 1000);
		this.logLimit = frozenUtils.loadInt("fb_logLimit", 100);
		
		this.enchantingEnabled = frozenUtils.loadBool("fb_enchantingEnabled", true);
		this.enchantingBaseChance = frozenUtils.loadFloat("fb_enchantingBaseChance", 0.5);
		this.enchantingBaseMultiplier = frozenUtils.loadFloat("fb_enchantingBaseMultiplier", 0.3);
		
		this.autoSellActive = frozenUtils.loadBool("fb_autoSellActive", false);
		this.autoSellThreshold = frozenUtils.loadInt("fb_autoSellThreshold", 2);
		
		this.autoCombatActive = frozenUtils.loadBool("fb_autoCombatActive", false);
		this.autoCombatKeepLevelDifference = frozenUtils.loadBool("fb_autoCombatKeepLevelDifference", true);
		this.autoCombatLastAttackTime = frozenUtils.loadInt("fb_autoCombatLastAttackTime", 0);
		this.autoCombatMaxLevelDifference = frozenUtils.loadInt("fb_autoCombatMaxLevelDifference", 5);
		this.autoCombatLevel = frozenUtils.loadInt("fb_autoCombatLevel", 1);
		
		this.statIncreaseStrength = frozenUtils.loadInt("fb_statIncreaseStrength", 0);
		this.statIncreaseStamina = frozenUtils.loadInt("fb_statIncreaseStamina", 0);
		this.statIncreaseAgi = frozenUtils.loadInt("fb_statIncreaseAgi", 0);
		
		this.improvedSalePriceEnable = frozenUtils.loadBool("fb_improvedSalePriceEnable", true);
		this.detailedLogging = frozenUtils.loadBool("fb_detailedLogging", true);
		this.numberFormatter = frozenUtils.loadInt("fb_numberFormatter", 0);
		this.formatHealthBarNumbers = frozenUtils.loadBool("fb_formatHealthBarNumbers", true);
		this.levelsReset = frozenUtils.loadInt("fb_levelsReset", 0);
		this.applyLevelResetBonus = frozenUtils.loadBool("fb_applyLevelResetBonus", true);
		this.statsBought = frozenUtils.loadInt("fb_statsBought", 0);
		
		var statCount = frozenUtils.loadInt("fb_statCount", 0);
		for(var i = 0; i < statCount; i++) {
		    var name = frozenUtils.load("fb_stat_name_"+i, undefined);
		    var value = frozenUtils.loadFloat("fb_stat_value_"+i, 0);
		    if(!name) {
		        continue;
		    }
		    this.stats[name] = value;
		}
	}
}

function FrozenBattle() {
    this.settings = undefined;
    this.version = 1.7;
    this.moduleActive = true;
    this.lastUpdateTime = Date.now();
    this.lastAttackTime = Date.now();
    this.lastStatsUpdate = Date.now();
    this.damageDealtSinceUpdate = 0;
    this.experienceSinceUpdate = 0;
    this.updateTimePassed = 0;
    this.init = function() {
        if (game == undefined || legacyGame.itemCreator == undefined
                || legacyGame.itemCreator.createRandomItem == undefined) {
            frozenUtils.log("Endless battle was not detected, disabling module!");
            this.moduleActive = false;
            return;
        }
        legacyGame.FrozenBattle = this;
        this.settings = new FrozenBattleData();
        this.settings.load();
        this.registerHooks();
        this.applyLevelResetBonus();
        
        this.applyStatIncrease();
        this.minRarity = ItemRarity.COMMON;
        this.maxRarity = ItemRarity.LEGENDARY;
        this.initializeUI();
        this.temp_fixPlayerHealth();
        frozenUtils.log("Frozen battle module version " + this.getFullVersionString() + " loaded");
    }
    this.registerHooks = function() {
        legacyGame.native_update = legacyGame.update;
        legacyGame.native_createRandomItem = legacyGame.itemCreator.createRandomItem;
        legacyGame.native_save = legacyGame.save;
        legacyGame.native_load = legacyGame.load;
        legacyGame.native_reset = legacyGame.reset;
        legacyGame.player.native_getCritChance = legacyGame.player.getCritChance;
        legacyGame.mercenaryManager.native_purchaseMercenary = legacyGame.mercenaryManager.purchaseMercenary;
        legacyGame.monsterCreator.native_createRandomMonster = legacyGame.monsterCreator.createRandomMonster;
        legacyGame.update = this.onUpdate;
        legacyGame.itemCreator.createRandomItem = this.onCreateRandomItem;
        legacyGame.save = this.onSave;
        legacyGame.load = this.onLoad;
        legacyGame.reset = this.onReset;
        legacyGame.player.getCritChance = this.onGetCritChance;
        legacyGame.mercenaryManager.purchaseMercenary = this.onPurchaseMercenary;
        legacyGame.monsterCreator.createRandomMonster = this.onCreateMonster;
        
        this.native_equipItemHover = equipItemHover;
        this.native_inventoryItemHover = inventoryItemHover;
        equipItemHover = this.onEquipItemHover;
        inventoryItemHover = this.onInventoryItemHover;
        
        this.native_formatMoney = Number.prototype.formatMoney;
        Number.prototype.formatMoney = this.onFormatNumber;
        Number.prototype.formatNumber = this.onFormatNumber;
    }
    this.releaseHooks = function() {
        legacyGame.update = legacyGame.native_update;
        legacyGame.itemCreator.createRandomItem = legacyGame.native_createRandomItem;
        legacyGame.save = legacyGame.native_save;
        legacyGame.load = legacyGame.native_load;
        legacyGame.reset = legacyGame.native_reset;
        legacyGame.player.getCritChance = legacyGame.player.native_getCritChance;
        legacyGame.mercenaryManager.purchaseMercenary = legacyGame.mercenaryManager.native_purchaseMercenary;
        legacyGame.monsterCreator.createRandomMonster = legacyGame.monsterCreator.native_createRandomMonster;
        
        Number.prototype.formatMoney = this.native_formatMoney;
        equipItemHover = this.native_equipItemHover;
        inventoryItemHover = this.native_inventoryItemHover;
    }
    this.onReset = function() {
        var self = legacyGame.FrozenBattle;
        self.releaseHooks();
        self.settings.levelsReset += legacyGame.player.level - 1;
        frozenUtils.log("Resetting");
        legacyGame.native_reset();
        self.applyLevelResetBonus();
        self.settings.autoCombatMaxLevelDifference = 0;
        self.settings.autoCombatLevel = 1;
        self.settings.statIncreaseAgi = 0;
        self.settings.statIncreaseStamina = 0;
        self.settings.statIncreaseStrength = 0;
        self.settings.statsBought = 0;
        self.settings.save();
        self.registerHooks();
        self.updateUI();
    }
    this.onCreateMonster = function(level, rarity) {
        var newMonster = legacyGame.monsterCreator.native_createRandomMonster(level, rarity);
        return newMonster;
    }
    this.onPurchaseMercenary = function(type) {
        legacyGame.mercenaryManager.native_purchaseMercenary(type);
        legacyGame.FrozenBattle.updateUI();
    }
    this.onGetCritChance = function() {
        var chance = legacyGame.player.native_getCritChance();
        if (chance > 90) {
            return 90;
        }
        return chance;
    }
    this.onUpdate = function() {
        legacyGame.FrozenBattle.update();
    }
    this.onSave = function() {
        legacyGame.FrozenBattle.save();
    }
    this.onLoad = function() {
        legacyGame.FrozenBattle.load();
    }
    
    this.onFormatNumber = function(d) {
        var self = legacyGame.FrozenBattle;
        var formatterKey = frozenUtils.FormatterKeys[self.settings.numberFormatter];
        if (frozenUtils.Formatters[formatterKey] != undefined) {
            var formatter = frozenUtils.Formatters[formatterKey];
            return formatter(parseInt(this)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return self.nativeFormatMoney(this, d || 0);
        }
    }
    this.onEquipItemHover = function(obj, index) {
        var self = legacyGame.FrozenBattle;
        self.native_equipItemHover(obj, index);
        var item = legacyGame.inventory.slots[index - 1];
        if (!item) {
            return;
        }
        $("#itemTooltipSellValue").html(item.sellValue.formatNumber());
    }
    this.onInventoryItemHover = function(obj, index) {
        var self = legacyGame.FrozenBattle;
        self.native_inventoryItemHover(obj, index);
        var item = legacyGame.inventory.slots[index - 1];
        if (!item) {
            return;
        }
        $("#itemTooltipSellValue").html(item.sellValue.formatNumber());
        var equippedSlot = self.getItemSlotNumber(item.type);
        var item2 = legacyGame.equipment.slots[equippedSlot];
        if (item2) {
            $("#itemCompareTooltipSellValue").html(item2.sellValue.formatNumber());
        }
    }
    this.save = function() {
        legacyGame.native_save();
        this.settings.save();
        localStorage.fb_version = this.version;
    }
    this.load = function() {
        legacyGame.native_load();
        this.settings.load();
    }
    this.update = function() {
        legacyGame.native_update();
        if (!this.moduleActive || this.settings.disabled) {
            return;
        }
        var currentTime = Date.now();
        this.autoCombat(currentTime);
        this.updateTimePassed += (currentTime - this.lastUpdateTime);
        if (this.updateTimePassed >= this.settings.updateInterval) {
            this.finishMonster(currentTime);
            this.autoSell(currentTime);
            this.updateTimePassed -= this.settings.updateInterval;
        }
        var timeSinceStatUpdate = currentTime - this.lastStatsUpdate;
        if (timeSinceStatUpdate > 1000) {
            this.updateStats();
            this.lastStatsUpdate = currentTime;
        }
        this.updateInterfaceOverrides();
        lastUpdateTime = currentTime;
    }
    this.finishMonster = function(time) {
        if (!legacyGame.inBattle || !legacyGame.monster.alive || legacyGame.monster.health >= 1) {
            return;
        }
        legacyGame.monster.alive = false;
        legacyGame.attack();
    }
    this.autoCombat = function(time) {
        if (!this.settings.autoCombatActive) {
            return;
        }
        var autoAttackTime = this.getAutoAttackTime();
        if (time - this.lastAttackTime < autoAttackTime) {
            return;
        }
        this.lastAttackTime = time;
        var healthThreshold = legacyGame.player.getMaxHealth() / 2;
        if (legacyGame.player.health < healthThreshold) {
            return;
        }
        var targetLevel = legacyGame.player.level;
        if (this.settings.autoCombatKeepLevelDifference) {
            targetLevel = legacyGame.player.level - this.settings.autoCombatMaxLevelDifference;
        }
        else {
            targetLevel = this.settings.autoCombatLevel;
        }
        legacyGame.battleLevel = targetLevel;
        if (legacyGame.inBattle == false && legacyGame.player.alive) {
            legacyGame.enterBattle();
        }
        var doubleHitChance = this.getDoubleHitChance();
        var attacks = 1;
        if (Math.random() < doubleHitChance) {
            attacks++;
        }
        while (attacks >= 1) {
            this.addStat("Auto attacks");
            legacyGame.attack();
            attacks--;
        }
    };
    this.getAutoAttackTime = function() {
        var time = 10000;
        var deduction = 0;
        deduction += legacyGame.mercenaryManager.footmenOwned * 10;
        deduction += legacyGame.mercenaryManager.clericsOwned * 20;
        deduction += legacyGame.mercenaryManager.magesOwned * 75;
        deduction += legacyGame.mercenaryManager.assassinsOwned * 150;
        deduction += legacyGame.mercenaryManager.warlocksOwned * 250;
        var multiplier = 1.0;
        if(this.settings.applyLevelResetBonus) {
            multiplier += this.settings.levelsReset * 0.001;
        }
        
        deduction *= multiplier;
        time -= deduction;
        if (time < 10) {
            return 10;
        }
        return time;
    };
    this.getDoubleHitChance = function() {
        var baseChance = 0.01;
        var chance = legacyGame.player.native_getCritChance();
        if (chance > 90) {
            baseChance += (chance - 90) / 1000;
        }
        return baseChance;
    };
    this.autoSell = function(time) {
        if (!this.settings.autoSellActive) {
            return;
        }
        var freeSlots = 0;
        for (var slot = 0; slot < legacyGame.inventory.slots.length; slot++) {
            if (legacyGame.inventory.slots[slot] != null) {
                var item = legacyGame.inventory.slots[slot];
                var rarity = this.getRarityNumber(item.rarity);
                if (rarity >= this.settings.autoSellThreshold) {
                    continue;
                }
                if (this.settings.detailedLogging) {
                    frozenUtils.log("sold " + this.getRarityString(rarity) + " " + item.name
                            + " for " + item.sellValue.formatNumber());
                }
                this.addStat("Items sold");
                this.addStat("Items sold for", item.sellValue);
                legacyGame.inventory.sellItem(slot);
            }
            else {
                freeSlots++;
            }
        }
        if (freeSlots == 0) {
            frozenUtils.log("Inventory full, selling all items!");
            legacyGame.inventory.sellAll();
        }
    }
    this.onCreateRandomItem = function(level, rarity) {
        return legacyGame.FrozenBattle.createRandomItem(level, rarity);
    }
    this.createRandomItem = function(level, rarity) {
        var item = legacyGame.native_createRandomItem(level, rarity);
        if (item == null) {
            return null;
        }
        if (this.settings.enchantingEnabled) {
            this.enchantItem(item);
        }
        if (this.settings.improvedSalePriceEnabled) {
            this.updateSalePrice(item);
        }
        if (this.settings.detailedLogging) {
            frozenUtils.log("Found "+item.rarity+" " + item.name);
        }
        return item;
    }
    this.addStat = function(key, value) {
        if (value == undefined)
            value = 1;
        if (!this.settings.stats[key]) {
            this.settings.stats[key] = 0;
        }
        this.settings.stats[key] += value;
        this.updateInterfaceStats();
    }
    this.enchantItem = function(item) {
        var enchantChance = this.settings.enchantingBaseChance;
        var bonus = 0;
        while (Math.random() <= enchantChance) {
            bonus++;
            enchantChance /= 1.5;
        }
        if (bonus > 0) {
            this.addStat("Items enchanted");
            item.name += " +" + bonus;
            item.enchantLevel = bonus;
            var multiplier = 1 + (this.settings.enchantingBaseMultiplier * bonus);
            item.minDamage = parseInt(item.minDamage * multiplier);
            item.maxDamage = parseInt(item.maxDamage * multiplier);
            item.damageBonus = parseInt(item.damageBonus * multiplier);
            item.strength = parseInt(item.strength * multiplier);
            item.agility = parseInt(item.agility * multiplier);
            item.stamina = parseInt(item.stamina * multiplier);
            item.health = parseInt(item.health * multiplier);
            item.hp5 = parseInt(item.hp5 * multiplier);
            item.armour = parseInt(item.armour * multiplier);
            item.armourBonus = parseInt(item.armourBonus * multiplier);
            item.critChance = parseInt(item.critChance * multiplier);
            item.critDamage = parseInt(item.critDamage * multiplier);
            item.goldGain = parseInt(item.goldGain * multiplier);
            item.experienceGain = parseInt(item.experienceGain * multiplier);
        }
    }
    this.updateSalePrice = function(item) {
        baseSaleValue = Math.pow(item.level / 2, 3);
        item.sellValue = 0;
        var multiplier = 1;
        multiplier += this.updateSalePriceFor(item, item.damageBonus, 1, 0.15);
        multiplier += this.updateSalePriceFor(item, item.strength, 0.1, 0.1);
        multiplier += this.updateSalePriceFor(item, item.agility, 0.1, 0.1);
        multiplier += this.updateSalePriceFor(item, item.stamina, 0.1, 0.05);
        multiplier += this.updateSalePriceFor(item, item.health, 0.05, 0.01);
        multiplier += this.updateSalePriceFor(item, item.hp5, 0.05, 0.02);
        multiplier += this.updateSalePriceFor(item, item.armour, 0.05, 0.01);
        multiplier += this.updateSalePriceFor(item, item.armourBonus, 0.1, 0.05);
        multiplier += this.updateSalePriceFor(item, item.critChance, 1, 0.15);
        multiplier += this.updateSalePriceFor(item, item.critDamage, 0.5, 0.05);
        multiplier += this.updateSalePriceFor(item, item.goldGain, 0.01, 0.01);
        multiplier += this.updateSalePriceFor(item, item.experienceGain, 0.01, 0.01);
        multiplier += this.updateSalePriceFor(item, item.enchantLevel, 0, 0.2);
        if (multiplier == NaN) {
            return;
        }
        var multipliedBaseValue = parseInt(baseSaleValue * multiplier);
        item.sellValue += multipliedBaseValue;
    }
    this.updateSalePriceFor = function(item, value, multiplierAdd, multiplierQuality) {
        var current = item.sellValue;
        if (value == NaN || value == undefined || value == 0) {
            return 0;
        }
        current += parseInt(value * multiplierAdd);
        item.sellValue = current;
        return multiplierQuality;
    }
    this.getRarityNumber = function(rarity) {
        switch (rarity) {
            case ItemRarity.COMMON:
                return 0;
            case ItemRarity.UNCOMMON:
                return 1;
            case ItemRarity.RARE:
                return 2;
            case ItemRarity.EPIC:
                return 3;
            case ItemRarity.LEGENDARY:
                return 4;
        }
    }
    this.getRarityString = function(rarityNumber) {
        switch (rarityNumber) {
            case 0:
                return "Common";
            case 1:
                return "Uncommon";
            case 2:
                return "Rare";
            case 3:
                return "Epic";
            case 4:
                return "Legendary";
        }
    }
    this.getItemSlotNumber = function(type) {
        switch (type) {
            case ItemType.HELM:
                return 0;
            case ItemType.SHOULDERS:
                return 1;
            case ItemType.CHEST:
                return 2;
            case ItemType.LEGS:
                return 3;
            case ItemType.WEAPON:
                return 4;
            case ItemType.GLOVES:
                return 5;
            case ItemType.BOOTS:
                return 6;
            case ItemType.TRINKET:
                return 7;
            case ItemType.OFF_HAND:
                return 9;
        }
    }
    this.getFullVersionString = function() {
        return this.version;
    }
    this.temp_fixPlayerHealth = function() {
        frozenUtils.log("Applying player health fix (thanks to feildmaster)");
        legacyGame.player.baseHealthLevelUpBonus = 0;
        legacyGame.player.baseHp5LevelUpBonus = 0;
        for (var x = 1; x < legacyGame.player.level; x++) {
            legacyGame.player.baseHealthLevelUpBonus += Math.floor(legacyGame.player.healthLevelUpBonusBase
                    * (Math.pow(1.15, x)));
            legacyGame.player.baseHp5LevelUpBonus += Math.floor(legacyGame.player.hp5LevelUpBonusBase
                    * (Math.pow(1.15, x)));
        }
        legacyGame.player.health = legacyGame.player.getMaxHealth();
    }
    this.sortInventory = function() {
        var order = {}
        for (var slot = 0; slot < legacyGame.inventory.slots.length; slot++) {
            if (legacyGame.inventory.slots[slot] != null) {
                var item = legacyGame.inventory.slots[slot];
                var orderValue = (this.getItemSlotNumber(item.type) * 100)
                        + this.getRarityNumber(item.rarity);
                if (!order[orderValue]) {
                    order[orderValue] = [];
                }
                order[orderValue].push(item);
            }
        }
        var keys = Object.keys(order);
        keys.sort();
        var currentSlot = 0;
        for (var i = 0; i < keys.length; i++) {
            for (var n = 0; n < order[keys[i]].length; n++) {
                legacyGame.inventory.slots[currentSlot++] = order[keys[i]][n];
            }
        }
        for (var slot = currentSlot; slot < legacyGame.inventory.slots.length; slot++) {
            legacyGame.inventory.slots[slot] = null;
        }
    }
    this.nativeFormatMoney = function(n, c, d, t) {
        var c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? ","
                : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3
                : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t)
                + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }
    this.updateStats = function() {
        this.settings.stats['Damage/s'] = this.damageDealtSinceUpdate;
        this.damageDealtSinceUpdate = 0;
        this.settings.stats['XP/s'] = this.experienceSinceUpdate;
        this.experienceSinceUpdate = 0;
        this.settings.stats["Levels reset"] = this.settings.levelsReset;
        this.settings.stats["Str bought"] = this.settings.statIncreaseStrength;
        this.settings.stats["Sta bought"] = this.settings.statIncreaseStamina;
        this.settings.stats["Agi bought"] = this.settings.statIncreaseAgi;
        this.updateInterfaceStats();
    }
    
    this.applyLevelResetBonus = function() {
        if (this.settings.applyLevelResetBonus) {
            legacyGame.player.baseStats.damageBonus += this.settings.levelsReset;
            legacyGame.player.baseStats.goldGain += this.settings.levelsReset;
            legacyGame.player.baseStats.experienceGain += this.settings.levelsReset;
        }
    }
    
    this.applyStatIncrease = function() {
        legacyGame.player.baseStats.strength += this.settings.statIncreaseStrength;
        legacyGame.player.baseStats.stamina += this.settings.statIncreaseStamina;
        legacyGame.player.baseStats.agility += this.settings.statIncreaseAgi;
    }
    
    this.removeStatIncrease = function() {
        legacyGame.player.baseStats.strength -= this.settings.statIncreaseStrength;
        legacyGame.player.baseStats.stamina -= this.settings.statIncreaseStamina;
        legacyGame.player.baseStats.agility -= this.settings.statIncreaseAgi;
    }
    
    this.gamble = function() {
        var cost = this.getGambleCost();
        if(legacyGame.player.gold < cost) {
            frozenUtils.logError("Not enough gold!");
            return false;
        }
        
        var targetLevel = legacyGame.player.level;
        var depth = 2 + Math.random() * 10;
        var modifier = Math.random();
        var gambleResult = "average";
        if(modifier < 0.2) {
            targetLevel -= 2;
            gambleResult = "mediocre";
            depth -= 5;
        }
        if(modifier > 0.8) {
            targetLevel++;
            gambleResult = "good";
            depth += 10;
        }
        if(modifier > 0.9) {
            targetLevel += 2;
            gambleResult = "great";
            depth += 10;
        }
                
        var rarity = legacyGame.monsterCreator.calculateMonsterRarity(targetLevel, Math.floor(depth))
        var item = undefined;
        while(item == undefined) {
            item = legacyGame.itemCreator.createRandomItem(targetLevel, rarity);
        }
        
        legacyGame.inventory.lootItem(item);
        legacyGame.player.gold -= cost;
        this.addStat('Gambled');
        this.addStat('Gamble cost', cost);
        frozenUtils.log("Gambled an "+gambleResult+" reward!");
        return true;
    }
    
    this.increaseStat = function(key) {
        var cost = this.getStatIncreaseCost();
        if(legacyGame.player.gold < cost) {
            frozenUtils.logError("Not enough gold!");
            return false;
        }
        
        this.removeStatIncrease();
        this.settings[key]++;
        this.settings.statsBought++;
        this.applyStatIncrease();
        
        legacyGame.player.gold -= cost;
        
        this.addStat('Stat cost', cost);
        
        return true;
    }
    
    this.getGps = function() {
        var gps = 0;
        for (var x = 0; x < legacyGame.mercenaryManager.mercenaries.length; x++) {
            gps += legacyGame.mercenaryManager.getMercenariesGps(legacyGame.mercenaryManager.mercenaries[x].type);
        }
        
        return gps;
    }
    
    this.getGambleCost = function() {
        var cost = Math.pow(1.3, legacyGame.player.level) * 340;
        return cost;
    }
    
    this.getStatIncreaseCost = function() {
        var cost = Math.pow(1.15, this.settings.statsBought) * 240;
        return cost;
    }
    this.initializeUI = function() {
        $('#version')
                .after(
                        $(
                                '<div id="fbVersion" style="color: #808080; padding: 5px 0px 5px 10px; float: left"/>')
                                .html('FB ' + this.getFullVersionString()));
        $('#inventoryWindowSellAllButton')
                .after(
                        $(
                                '<div id="inventoryWindowSortButton" class="button" style="font-family: \'Gentium Book Basic\'; position: absolute; left: 5px; top: 202px; line-height: 16px; color: #fff; font-size: 16px; text-shadow: 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;"/>')
                                .addClass('button').html('Sort').click(this.onSortInventory));
        $('#expBarOption').after(
                $('<div id="fbOptionNumberFormatting" class="optionsWindowOption"/>').click(
                        this.onToggleOptionNumberFormatting));
        $('#fbOptionNumberFormatting').after(
                $('<div id="fbOptionDetailedLogging" class="optionsWindowOption"/>').click(
                        function() {
                            legacyGame.FrozenBattle.onToggleBoolSetting("detailedLogging")
                        }));
        $('#fbOptionDetailedLogging').after(
                $('<div id="fbOptionEnchanting" class="optionsWindowOption"/>').click(function() {
                    legacyGame.FrozenBattle.onToggleBoolSetting("enchantingEnabled")
                }));
        $('#fbOptionEnchanting').after(
                $('<div id="fbOptionImprovedSalePrice" class="optionsWindowOption"/>').click(
                        function() {
                            legacyGame.FrozenBattle
                                    .onToggleBoolSetting("improvedSalePriceEnabled")
                        }));
        $('#fbOptionImprovedSalePrice').after(
                $('<div id="fbOptionFormatHealthBars" class="optionsWindowOption"/>').click(
                        function() {
                            legacyGame.FrozenBattle
                                    .onToggleBoolSetting("formatHealthBarNumbers")
                        }));
        $('#fbOptionFormatHealthBars').after(
                $('<div id="fbOptionApplyLevelResetBonus" class="optionsWindowOption"/>').click(this.onToggleApplyLevelResetBonus));
        $('#fbOptionApplyLevelResetBonus').after(
                $('<div id="fbOptionSkipTutorial" class="optionsWindowOption"/>').click(
                        function() {
                            legacyGame.FrozenBattle
                                    .onToggleBoolSetting("skipTutorial")
                        }));
        var ondemandOptions = $('<div id="fbOnDemandOptions" class="navBarWindow" style="width:300px; height:320px; position: absolute; left:10px;top: 150px;margin: 0;"/>');
        $(document.body).append(ondemandOptions);
        ondemandOptions
                .append("<div class=\"navBarText\" style=\"padding: 5px 10px 5px 10px\">Frozen Battle Options</div");
        ondemandOptions
                .append($(
                        '<div id="autoCombatButton" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
                        .addClass('button').click(function() {
                            legacyGame.FrozenBattle.onToggleBoolSetting("autoCombatActive")
                        }));
        ondemandOptions
                .append($(
                        '<div id="autoCombatKeepLevelDifferenceButton" class="navBarText" style="padding: 2px 10px 2px 20px"/>')
                        .addClass('button').click(
                                function() {
                                    legacyGame.FrozenBattle
                                            .onToggleBoolSetting("autoCombatKeepLevelDifference")
                                }));
        ondemandOptions.append($('<div id="fbOnDemandOptionsCloseButton" class="closeButton button" onmouseover="closeButtonHover(this)" onmouseout="closeButtonReset(this)" onmousedown="closeButtonClick(this)" onmouseup="closeButtonReset(this)"></div>'));
        var autoCombatLevelDifference = $('<div id="autoCombatLevelDifference" style="padding: 2px 10px 2px 10px;">');
        ondemandOptions.append(autoCombatLevelDifference);
        autoCombatLevelDifference
                .append(
                        $('<div class="navBarText" style="padding: 2px 10px 2px 10px;float:left">- Level range: </div>'))
                .append(
                        $(
                                '<div id="autoCombatLevelDifferenceDown" class="battleLevelButton button" style="margin:0;position: relative;left:0px; top:0px; float:left; background: url(\'includes/images/battleLevelButton.png\') 0 25px">-</button>')
                                .click(function() {
                                    legacyGame.FrozenBattle.onModifyBattleLevelDifference(-1);
                                }))
                .append(
                        $('<div id="autoCombatLevelDifferenceText" class="navBarText" style="padding: 2px 10px 2px 10px;float:left">N/A</div>'))
                .append(
                        $(
                                '<div id="autoCombatLevelDifferenceUp" class="battleLevelButton button" style="margin:0;position: relative;left:0px; top:0px;float:left">+</button>')
                                .click(function() {
                                    legacyGame.FrozenBattle.onModifyBattleLevelDifference(1);
                                })).append($('<div style="clear:both;"/>'));
        var autoCombatLevel = $('<div id="autoCombatLevel" style="padding: 2px 10px 2px 10px;">');
        ondemandOptions.append(autoCombatLevel);
        autoCombatLevel
                .append(
                        $('<div class="navBarText" style="padding: 2px 10px 2px 10px;float:left">- Level: </div>'))
                .append(
                        $(
                                '<div id="autoCombatLevelDown" class="battleLevelButton button" style="margin:0;position: relative;left:0px; top:0px; float:left; background: url(\'includes/images/battleLevelButton.png\') 0 25px">-</button>')
                                .click(function() {
                                    legacyGame.FrozenBattle.onModifyBattleLevel(-1);
                                }))
                .append(
                        $('<div id="autoCombatLevelText" class="navBarText" style="padding: 2px 10px 2px 10px;float:left">N/A</div>'))
                .append(
                        $(
                                '<div id="autoCombatLevelUp" class="battleLevelButton button" style="margin:0;position: relative;left:0px; top:0px;float:left">+</button>')
                                .click(function() {
                                    legacyGame.FrozenBattle.onModifyBattleLevel(1);
                                })).append($('<div style="clear:both;"/>'));
        ondemandOptions.append($(
                '<div id="autoSellButton" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
                .addClass('button').click(function() {
                    legacyGame.FrozenBattle.onToggleBoolSetting("autoSellActive")
                }));
        
        ondemandOptions
                .append($(
                        '<div id="autoSellThresholdButton" class="navBarText" style="padding: 2px 10px 2px 20px"/>')
                        .addClass('button').click(this.onToggleAutoSellThreshold));
        
        ondemandOptions.append($(
        '<div id="gambleButton" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
        .addClass('button').click(this.onGamble));
        
        ondemandOptions.append($(
        '<div id="statIncreaseStr" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
        .addClass('button').click(function() {
            legacyGame.FrozenBattle.onIncreaseStat('statIncreaseStrength');
        }));
        
        ondemandOptions.append($(
        '<div id="statIncreaseSta" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
        .addClass('button').click(function() {
            legacyGame.FrozenBattle.onIncreaseStat('statIncreaseStamina');
        }));
        
        ondemandOptions.append($(
        '<div id="statIncreaseAgi" class="navBarText" style="padding: 2px 10px 2px 10px"/>')
        .addClass('button').click(function() {
            legacyGame.FrozenBattle.onIncreaseStat('statIncreaseAgi');
        }));
        ondemandOptions.draggable({drag: function() { updateWindowDepths(document.getElementById("fbOnDemandOptions")); }, cancel: '.globalNoDrag'});
        ondemandOptions.hide();
        var extraStats = $('<div id="fbExtraStatsWindow" class="navBarWindow" style="width:300px; height:500px; position: absolute; left:10px;top: 150px;margin: 0;"/>');
        $(document.body).append(extraStats);
        extraStats.append('<div class="navBarText" style="padding: 5px 100px 5px 10px; float: left">Frozen Battle Stats</div>');
        var clearButton = $('<div class="navBarText" style="padding: 5px 10px 5px 20px">Clear</div>');
        clearButton.click(this.onClearStats);
        extraStats.append(clearButton);
        extraStats.append('<div id="fbExtraStats" style="padding: 5px 10px 5px 10px"/>');
        extraStats.append($('<div id="fbExtraStatsCloseButton" class="closeButton button" onmouseover="closeButtonHover(this)" onmouseout="closeButtonReset(this)" onmousedown="closeButtonClick(this)" onmouseup="closeButtonReset(this)"></div>'));
        extraStats.draggable({drag: function() { updateWindowDepths(document.getElementById("fbExtraStatsWindow")); }, cancel: '.globalNoDrag'});
        extraStats.hide();
        var combatLog = $('<div id="fbCombatLogWindow" class="navBarWindow" style="width:500px; height:250px; position: absolute; left:5px;bottom: 5px; top:initial;margin: 0"/>');
        $('#gameArea').append(combatLog);
        combatLog.append('<div class="navBarText" style="padding: 5px 300px 5px 10px; float: left">Combat Log</div>');
        combatLog.append('<div id="fbCombatLogContent" style="padding: 5px 10px 5px 10px; height: 85%; width: 95%; overflow: auto"/>');
        combatLog.append($('<div id="fbCombatLogCloseButton" class="closeButton button" onmouseover="closeButtonHover(this)" onmouseout="closeButtonReset(this)" onmousedown="closeButtonClick(this)" onmouseup="closeButtonReset(this)"></div>'));
        combatLog.draggable({drag: function() { updateWindowDepths(document.getElementById("fbCombatLogWindow")); }, cancel: '.globalNoDrag'});
        frozenUtils.logCallback = this.onLog;
        this.updateUI();
        this.updateInterfaceStats();
    }
    this.onClearStats = function(value) {
        var self = legacyGame.FrozenBattle;
        self.settings.stats = {};
        self.updateInterfaceStats();
    }
    this.onModifyBattleLevel = function(value) {
        var self = legacyGame.FrozenBattle;
        self.settings.autoCombatLevel += value;
        if (self.settings.autoCombatLevel < 0) {
            self.settings.autoCombatLevel = 0;
        }
        if (self.settings.autoCombatLevel >= legacyGame.player.level) {
            self.settings.autoCombatLevel = legacyGame.player.level - 1;
        }
        self.updateUI();
    }
    this.onModifyBattleLevelDifference = function(value) {
        var self = legacyGame.FrozenBattle;
        self.settings.autoCombatMaxLevelDifference += value;
        if (self.settings.autoCombatMaxLevelDifference < 0) {
            self.settings.autoCombatMaxLevelDifference = 0;
        }
        if (self.settings.autoCombatMaxLevelDifference >= legacyGame.player.level) {
            self.settings.autoCombatMaxLevelDifference = legacyGame.player.level - 1;
        }
        self.updateUI();
    }
    this.onToggleBoolSetting = function(setting) {
        var self = legacyGame.FrozenBattle;
        self.settings[setting] = !self.settings[setting];
        self.updateUI();
    }
    
    this.onIncreaseStat = function(key) {
        var self = legacyGame.FrozenBattle;
        if(self.increaseStat(key)) {
            self.updateUI();
        }
    }
    
    this.onToggleApplyLevelResetBonus = function() {
        var self = legacyGame.FrozenBattle;
        self.settings.applyLevelResetBonus = !self.settings.applyLevelResetBonus;
        
        if (self.settings.applyLevelResetBonus) {
            self.applyLevelResetBonus();
        } else {
            legacyGame.player.baseDamageBonus -= self.settings.levelsReset;
            legacyGame.player.baseGoldGain -= self.settings.levelsReset;
            legacyGame.player.baseExperienceGain -= self.settings.levelsReset;
        }
        
        self.updateUI();
    }
    this.onToggleAutoSellThreshold = function() {
        var self = legacyGame.FrozenBattle;
        if (self.settings.autoSellThreshold <= self.getRarityNumber(self.maxRarity)) {
            self.settings.autoSellThreshold++;
        }
        else {
            self.settings.autoSellThreshold = self.getRarityNumber(self.minRarity);
        }
        self.updateUI();
    }
    this.onToggleOptionNumberFormatting = function() {
        var self = legacyGame.FrozenBattle;
        if (self.settings.numberFormatter >= frozenUtils.FormatterKeys.length - 1) {
            self.settings.numberFormatter = 0;
        }
        else {
            self.settings.numberFormatter++;
        }
        self.updateMercenarySalePrices();
        self.updateUI();
    }
    this.onSortInventory = function() {
        legacyGame.FrozenBattle.sortInventory();
    }
    
    this.onGamble = function() {
        legacyGame.FrozenBattle.gamble();
    }
    this.updateMercenarySalePrices = function() {
        $("#footmanCost").text(legacyGame.mercenaryManager.footmanPrice.formatNumber());
        $("#clericCost").text(legacyGame.mercenaryManager.clericPrice.formatNumber());
        $("#commanderCost").text(legacyGame.mercenaryManager.commanderPrice.formatNumber());
        $("#mageCost").text(legacyGame.mercenaryManager.magePrice.formatNumber());
        $("#assassinCost").text(legacyGame.mercenaryManager.assassinPrice.formatNumber());
        $("#warlockCost").text(legacyGame.mercenaryManager.warlockPrice.formatNumber());
    }
    this.updateUI = function() {
        if (this.settings.autoCombatActive) {
            var attackTime = frozenUtils.timeDisplay(this.getAutoAttackTime(), true);
            $("#autoCombatButton").text(
                    'Auto combat: ' + this.getBoolDisplayText(this.settings.autoCombatActive)
                            + ' (every ' + attackTime + ')');
            $("#autoCombatKeepLevelDifferenceButton").show();
            $("#autoCombatKeepLevelDifferenceButton").text(
                    '- Keep combat level in range: '
                            + this.getBoolDisplayText(this.settings.autoCombatKeepLevelDifference));
            if (this.settings.autoCombatKeepLevelDifference) {
                $("#autoCombatLevel").hide();
                $("#autoCombatLevelDifference").show();
                $("#autoCombatLevelDifferenceText")
                        .text(this.settings.autoCombatMaxLevelDifference);
            }
            else {
                $("#autoCombatLevel").show();
                $("#autoCombatLevelDifference").hide();
                $("#autoCombatLevelText").text(this.settings.autoCombatLevel);
            }
        }
        else {
            $("#autoCombatButton").text(
                    'Auto combat: ' + this.getBoolDisplayText(this.settings.autoCombatActive));
            $("#autoCombatKeepLevelDifferenceButton").hide();
            $("#autoCombatLevelDifference").hide();
            $("#autoCombatLevel").hide();
        }
        $("#autoSellButton").text(
                'Auto sell: ' + this.getBoolDisplayText(this.settings.autoSellActive));
        $("#fbOptionDetailedLogging").text(
                "Detailed logging: " + this.getBoolDisplayText(this.settings.detailedLogging));
        $("#fbOptionEnchanting").text(
                "Enchanting: " + this.getBoolDisplayText(this.settings.enchantingEnabled));
        $("#fbOptionImprovedSalePrice").text(
                "Improved sale price: "
                        + this.getBoolDisplayText(this.settings.improvedSalePriceEnabled));
        $("#fbOptionNumberFormatting").text(
                "Format numbers: " + frozenUtils.FormatterKeys[this.settings.numberFormatter]);
        $("#fbOptionFormatHealthBars").text(
                "Format health bars: "
                        + this.getBoolDisplayText(this.settings.formatHealthBarNumbers));
        $("#fbOptionApplyLevelResetBonus").text(
                "Apply level reset bonus: "
                        + this.getBoolDisplayText(this.settings.applyLevelResetBonus));
        
        $("#gambleButton").text("Gamble for "+ this.getGambleCost().formatNumber());
        
        var statCost = this.getStatIncreaseCost();
        $("#statIncreaseStr").text("Buy str for "+statCost.formatNumber());
        $("#statIncreaseSta").text("Buy sta for "+statCost.formatNumber());
        $("#statIncreaseAgi").text("Buy agi for "+statCost.formatNumber());
        var autoSellThresholdText = "";
        if (this.settings.autoSellActive) {
            if (this.settings.autoSellThreshold > this.getRarityNumber(this.maxRarity)) {
                autoSellThresholdText = "All";
            }
            else {
                autoSellThresholdText = '- Sell below '
                        + this.getRarityString(this.settings.autoSellThreshold);
            }
            $("#autoSellThresholdButton").show();
            $("#autoSellThresholdButton").text(autoSellThresholdText);
        }
        else {
            $("#autoSellThresholdButton").hide();
        }
    }
    this.updateInterfaceStats = function() {
        $("#fbExtraStats").empty();
        for (key in this.settings.stats) {
            $("#fbExtraStats").append(
                    '<div class="navBarText" style="padding: 5px 70px 5px 10px; float:left;width:100px">'
                            + key + '</div>');
            $("#fbExtraStats").append(
                    '<div class="navBarText" style="padding: 5px 10px 5px 10px">'
                            + this.settings.stats[key].formatNumber() + '</div>');
        }
    }
    this.updateInterfaceOverrides = function(value) {
        if (this.settings.formatHealthBarNumbers) {
            var playerHp = Math.floor(legacyGame.player.health).formatNumber();
            var playerMaxHp = Math.floor(legacyGame.player.getMaxHealth()).formatNumber();
            $("#playerHealthBarText").text(playerHp + '/' + playerMaxHp);
            if (legacyGame.displayMonsterHealth && legacyGame.monster) {
                var monsterHp = Math.floor(legacyGame.monster.health).formatNumber();
                var monsterMaxHp = Math.floor(legacyGame.monster.maxHealth).formatNumber();
                $("#monsterName").text(monsterHp + '/' + monsterMaxHp);
            }
        }
    }
    this.getBoolDisplayText = function(value) {
        return value ? 'ON' : 'OFF';
    }
}

function ImprovementManager() {
    var currentTime = 0; // Is updated on updates
    var improvements = new Array(); // PRIVATE-NESS
    var pending = new Array();
    this.add = function(improvement) {
        if (improvement instanceof Improvement) {
            pending.push(improvement);
        }
    }
    this.getCurrentTime = function() {
        return currentTime;
    }
    function doInit() {
        for (var i in pending) {
            try {
                pending[i].onInit();
            } catch (e) {
                logError("init", e);
            }
        }
        doLoad();
    }
    function doLoad() {
        while (pending.length > 0) {
            var improvement = pending.pop();
            try {
                improvement.onLoad();
                improvements.push(improvement);
            } catch (e) {
                logError("load", e);
            }
        }
    }
    function doSave() {
        for (var i in improvements) {
            try {
                improvements[i].onSave();
            } catch (e) {
                logError("save", e);
            }
        }
    }
    function doUpdate() {
        for (var i in improvements) {
            try {
                improvements[i].onUpdate();
            } catch (e) {
                logError("update", e);
            }
        }
        if (pending.length > 0) {
            doInit();
        }
    }
    function doReset() {
        for (var i in improvements) {
            try {
                improvements[i].onReset();
            } catch (e) {
                logError("reset", e);
            }
        }
    }
    function logError(type, error) {
        var fileName = "undefined";
        if(error.fileName !== undefined) {
            fileName = error.fileName.slice(error.fileName.lastIndexOf("/") + 1);
        }
        console.log("Error when handling %s: [%s (%s:%d)]", type, error, fileName, error.lineNumber);
    }
    $(doInit);
    var originalSave = legacyGame.save;
    legacyGame.save = function() {
        originalSave.apply(this);
        doSave();
    }
    var originalUpdate = legacyGame.update;
    legacyGame.update = function() {
        currentTime = Date.now();
        originalUpdate.apply(this);
        doUpdate();
    }
    var originalReset = legacyGame.reset;
    legacyGame.reset = function() {
        originalReset.apply(this);
        doReset();
    }
}
function Improvement(init, load, save, update, reset) {
    this.onInit = function() {
        if (typeof init === 'function') {
            init();
        }
    }
    this.onLoad = function() {
        if (typeof load === 'function') {
            load();
        }
    }
    this.onSave = function() {
        if (typeof save === 'function') {
            save();
        }
    }
    this.onUpdate = function() {
        if (typeof update === 'function') {
            update();
        }
    }
    this.onReset = function() {
        if (typeof reset === 'function') {
            reset();
        }
    }
}
Improvement.prototype.register = function() {
    legacyGame.endlessImprovement.add(this);
}
function questFix() {
    new Improvement(init, load, null, null, reset).register();
    function init() {
        addHooks();
    }
    function load() {
        if (localStorage.questBuffRewards) {
            var buffs = JSON.parse(localStorage.getItem("questBuffRewards"));
            for (var x = 0; x < legacyGame.questsManager.quests.length; x++) {
                if (buffs.length > x) {
                    legacyGame.questsManager.quests[x].buffReward = buffs[x];
                }
            }
        }
    }
    function reset() {
        addHooks();
    }
    function addHooks() {
        legacyGame.questsManager.getSelectedQuest = function() {
            if (this.quests.length > this.selectedQuest) {
                return this.quests[this.selectedQuest];
            } else {
                return null;
            }
        }
        var originalAddQuest = legacyGame.questsManager.addQuest;
        legacyGame.questsManager.addQuest = function(quest) {
            quest.displayId = this.quests.length + 1;
            originalAddQuest.apply(this, arguments);
        }
        var originalRemoveQuest = legacyGame.questsManager.removeQuest;
        legacyGame.questsManager.removeQuest = function(id) {
            var removed = this.selectedQuest == id;
            originalRemoveQuest.apply(this, arguments);
            if (removed && this.selectedQuest < this.quests.length) {
                $("#questTextArea").show();
            }
        }
    }
}
function statWindowImprovement() {
    new Improvement(init, null, null, null, reset).register();
    var originalStatsUpdate = legacyGame.stats.update;
    function init() {
        legacyGame.stats.update = newUpdate;
    }
    function reset() {
        originalStatsUpdate = legacyGame.stats.update;
    }
    function newUpdate() {
        if (statsWindowShown) {
            originalStatsUpdate.apply(this);
        }
    }
}
function mercenaryHighlighting() {
    var enableHighlight = true;
    var currentMercenary = null;
    new Improvement(init, load, save, null, reset).register();
    function init() {
        addHooks();
        legacyGame.highlightBestMercenaryClick = function() {
            enableHighlight = !enableHighlight;
            highlightMostEfficientMercenary();
            updateOption();
        }
        $("#optionsWindowOptionsArea").append('<div class="optionsWindowOption" onmousedown="legacyGame.highlightBestMercenaryClick()">' +
            '<span style="color: #ffff00;">Highlight</span> most cost efficient mercenary: <span id="highlightMercenaryValue">ON</span></div>');
    }
    function load() {
        if (localStorage.endlessEnableHighlight) {
            enableHighlight = localStorage.endlessEnableHighlight === 'true';
        }
        updateOption(); // Lets update on load, for lack of better place (only needs to do this once...)
        highlightMostEfficientMercenary(); // Run once on load
    }
    function save() {
        localStorage.endlessEnableHighlight = enableHighlight;
    }
    function reset() {
        addHooks();
    }
    function addHooks() {
        var originalPurchaseMercenary = legacyGame.mercenaryManager.purchaseMercenary;
        legacyGame.mercenaryManager.purchaseMercenary = function() {
            originalPurchaseMercenary.apply(this, arguments);
            highlightMostEfficientMercenary();
        }
        var originalPurchaseUpgrade = legacyGame.upgradeManager.purchaseUpgrade;
        legacyGame.upgradeManager.purchaseUpgrade = function() {
            originalPurchaseUpgrade.apply(this, arguments);
            highlightMostEfficientMercenary();
        }
    }
    function updateOption() {
        $("#highlightMercenaryValue").html(enableHighlight?"ON":"OFF");
    }
    function highlightMostEfficientMercenary() {
        if (!enableHighlight) {
            removeHighlight();
            currentMercenary = null;
            return;
        }
        var newMercenary;
        var newValue = 0;
        for (var curMercenary in MercenaryType) {
            var curValue = legacyGame.mercenaryManager[curMercenary.toLowerCase() + 'Price'] / legacyGame.mercenaryManager.getMercenaryBaseGps(curMercenary);
            if (newMercenary == null || curValue < newValue) {
                newMercenary = curMercenary;
                newValue = curValue;
            }
        }
        if (currentMercenary != newMercenary) {
            removeHighlight();
            currentMercenary = newMercenary;
            getMercenaryElement(newMercenary).css('color', '#ffff00');
        }
    }
    function removeHighlight() {
        if (currentMercenary) {
            getMercenaryElement(currentMercenary).css('color', '#fff');
        }
    }
    function getMercenaryElement(type) {
        return $("#"+ type.toLowerCase() +"Name");
    }
}
function monsterKillStats() {
    var bossKills = 0;
    var bossLevel = 0;
    var isUpdated = false;
    new Improvement(init, load, save, update, reset).register();
    legacyGame.endlessImprovement.getBossKills = function() {
        return bossKills;
    }
    function init() {
        addHooks();
    }
    function load() {
        if (localStorage.endlessBossKills) {
            bossKills = parseInt(localStorage.endlessBossKills);
            bossLevel = parseInt(localStorage.endlessBossLevel);
        }
        $("#statsWindowStatsArea").append('<div class="statsWindowText"><span style="color: #F00;">Boss</span> kills at player level:</div>');
        $("#statsWindowStatValuesArea").append('<div id="statsWindowBossKills" class="statsWindowText"></div>');
        $("#statsWindowStatsArea").append('<div class="statsWindowText">Highest level <span style="color: #F00;">Boss</span> kill:</div>');
        $("#statsWindowStatValuesArea").append('<div id="statsWindowBossLevel" class="statsWindowText"></div>');
    }
    function save() {
        localStorage.endlessBossKills = bossKills;
        localStorage.endlessBossLevel = bossLevel;
    }
    function update() {
        if (isUpdated) {
            return;
        }
        $("#statsWindowBossKills").html(bossKills.formatMoney(0));
        $("#statsWindowBossLevel").html(bossLevel.formatMoney(0));
        isUpdated = true;
    }
    function reset() {
        bossKills = 0;
        bossLevel = 0;
        isUpdated = false;
        addHooks();
    }
    function monsterKilled(monster) {
        if (monster.rarity == MonsterRarity.BOSS) {
            if (monster.level > bossLevel) {
                bossLevel = monster.level;
                isUpdated = false;
            }
            if (monster.level === legacyGame.player.level) {
                bossKills++;
                isUpdated = false;
            }
        }
    }
    function addHooks() {
        var originalMonsterCreator = legacyGame.monsterCreator.createRandomMonster;
        legacyGame.monsterCreator.createRandomMonster = function() {
            var newMonster = originalMonsterCreator.apply(this, arguments);
            var originalDamageFunction = newMonster.takeDamage;
            newMonster.takeDamage = function() {
                if (!this.alive) {
                    return;
                }
                var value = originalDamageFunction.apply(this, arguments);
                if (!this.alive) {
                    monsterKilled(this);
                }
                return value;
            }
            return newMonster;
        }
    }
}
function monsterKillQuests() {
    var bossKillPercentage = 10;
    new Improvement(null, load, save, update, reset).register();
    QuestType.ENDLESS_BOSSKILL  = "EndlessBossKill";
    var killLevelAwarded = 0;
    function load() {
        if (localStorage.endlessKillLevelAwarded) {
            killLevelAwarded = parseInt(localStorage.endlessKillLevelAwarded);
        }
    }
    function save() {
        localStorage.endlessKillLevelAwarded = killLevelAwarded;
    }
    function update() {
        if (legacyGame.player.level < 30) {
            return;
        }
        findOrCreate();
    }
    function reset() {
        killLevelAwarded = 0;
    }
    function findOrCreate() {
        var quest;
        for (var x = legacyGame.questsManager.quests.length - 1; x >= 0; x--) {
            var c = legacyGame.questsManager.quests[x];
            if (c.type == QuestType.ENDLESS_BOSSKILL) {
                quest = c;
                hookBossKillQuest(quest);
                break;
            }
        }
        if (!quest) { // Give the quest... if we can
            addBossKillQuest();
        }
        if (killLevelAwarded != legacyGame.player.level) {
            killLevelAwarded = legacyGame.player.level;
        }
    }
    function addBossKillQuest() {
        if (legacyGame.player.level >= 30 && killLevelAwarded < legacyGame.player.level) {
            var name = "Kill a boss";
            var description = "Kill a boss equal to your level, prove your worth!";
            var quest = new Quest(name, description, QuestType.ENDLESS_BOSSKILL, 0, legacyGame.endlessImprovement.getBossKills(), 0, bossKillPercentage + '%');
            hookBossKillQuest(quest);
            legacyGame.questsManager.addQuest(quest);
        }
    }
    function hookBossKillQuest(quest) {
        if (quest.hooked) {
            return;
        }
        quest.update = updateBossKillQuest;
        quest.grantReward = rewardBossKillQuest;
        quest.hooked = true;
    }
    function updateBossKillQuest() {
        this.complete = legacyGame.endlessImprovement.getBossKills() > this.typeAmount;
    }
    function rewardBossKillQuest() {
        legacyGame.player.gainExperience(Math.ceil(legacyGame.player.experienceRequired * bossKillPercentage / 100), false);
        legacyGame.stats.experienceFromQuests += legacyGame.player.lastExperienceGained;
    }
}
function persistentGame() {
    new Improvement(null, load, save).register();
    function load() {
        if (localStorage.endlessEventTime) {
            legacyGame.eventManager.eventSpawnTimeRemaining = parseInt(localStorage.endlessEventTime);
        }
        if (localStorage.endlessBuffs) {
            var buffs = JSON.parse(localStorage.endlessBuffs);
            for (var x = 0; x < buffs.length; x++) {
                var buff = new Buff(buffs[x].name, buffs[x].type, buffs[x].multiplier, 1, buffs[x].leftPos, buffs[x].topPos);
                buff.maxDuration = buffs[x].maxDuration;
                buff.currentDuration = buffs[x].currentDuration;
                legacyGame.player.buffs.addBuff(buff);
            }
        }
        if (localStorage.endlessDeath) {
            legacyGame.player.resurrectionTimeRemaining = parseInt(localStorage.endlessDeath);
        }
    }
    function save() {
        localStorage.endlessEventTime = legacyGame.eventManager.eventSpawnTimeRemaining;
        localStorage.endlessBuffs = JSON.stringify(legacyGame.player.buffs.buffs);
        localStorage.endlessDeath = legacyGame.player.resurrectionTimeRemaining;
    }
}
$("#optionsWindowOptionsArea").append('<div id="improvementOptionsTitle" class="optionsWindowOptionsTitle">Endless Improvement Options</div>');
String.prototype.formatCapitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

declare('Game', function() {
    var debug = include('Debug','game');
    var assert = include('Assert','game');
    var component = include('Component','game');
    var staticData = include('StaticData','game');
    var save = include('Save','game');
    var saveKeys = include('SaveKeys','game');
    var coreUtils = include('CoreUtils','game');
    var eventAggregate = include('EventAggregate','game');
    Game.prototype = component.prototype();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;
    function Game() {
        component.construct(this);
        this.id = "Game";
        this.version = 0.5;
        this.autoSaveDelay = 30000; // 30s default
        this.autoSaveTime = undefined;
        this.versionCheckDelay = 30000;
        this.versionCheckTime = undefined;
        this.versionCheckData = undefined;
        this.versionCheckInfo = undefined;
    }
    Game.prototype.componentInit = Game.prototype.init;
    Game.prototype.init = function() {
        this.componentInit();
        this.reset();
        this.load();
        legacyGame.initialize();
        legacyGame.finishLoading();
        legacyGame.FrozenBattle = new FrozenBattle();
        legacyGame.FrozenBattle.init();
        legacyGame.endlessImprovement = new ImprovementManager();
        questFix();
        statWindowImprovement();
        mercenaryHighlighting();
        monsterKillStats();
        monsterKillQuests();
        persistentGame();
    };
    Game.prototype.componentUpdate = Game.prototype.update;
    Game.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }
        this.updateAutoSave(gameTime);
        this.updateVersionCheck(gameTime);
        legacyGame.update();
        return true;
    };
    Game.prototype.getCurrentVersion = function() {
        return this.version;
    };
    Game.prototype.getVersionCheckData = function() {
        return this.versionCheckData;
    };
    Game.prototype.updateAutoSave = function(gameTime) {
        if(this.autoSaveTime  === undefined) {
            this.autoSaveTime = gameTime.current;
            return;
        }
        if (gameTime.current > this.autoSaveTime + this.autoSaveDelay) {
            this.save();
            this.autoSaveTime = gameTime.current;
        }
    };
    Game.prototype.updateVersionCheck = function(gameTime) {
        if(this.versionCheckTime  === undefined) {
            this.versionCheckTime = gameTime.current;
            return;
        }
        if (gameTime.current > this.versionCheckTime + this.versionCheckDelay) {
            $.ajax({
                url : staticData.versionInfoFile,
                success : this.handleVersionInfoResult(this),
                cache: false
            });
            this.versionCheckTime = gameTime.current;
        }
    };
    Game.prototype.handleVersionCheckResult = function(self) {
        return function(data, textStatus, jqXHR) {
            self.versionCheckData = JSON.parse(data);
        };
    };
    Game.prototype.handleVersionInfoResult = function(self) {
        return function(data, textStatus, jqXHR) {
            var version = parseFloat(data.trim());
            if(self.versionCheckInfo !== version) {
                self.versionCheckInfo = version;
                
                $.ajax({
                    url : staticData.versionFile,
                    success : self.handleVersionCheckResult(self),
                    cache: false
                });
            }
        };
    };
    Game.prototype.gainGold = function(value, includeBonuses, silent) {
        if(value === undefined) {
            return;
        }
        var multiplier = 1;
        if (includeBonuses) {
            multiplier += legacyGame.player.getGoldGain() / 100;
            multiplier += legacyGame.player.buffs.getGoldMultiplier();
        }
        var gainedAmount = value * multiplier;
        legacyGame.player.gold += gainedAmount;
        legacyGame.player.lastGoldGained = gainedAmount;
        legacyGame.stats.goldEarned += gainedAmount;
        if(silent !== true) {
            eventAggregate.publish(staticData.EventGoldGain, {value: gainedAmount.formatMoney(0)});
        }
    };
    Game.prototype.gainExperience = function(value, includeBonuses) {
        var multiplier = 1;
        if(includeBonuses) {
            multiplier += legacyGame.player.getExperienceGain() / 100;
            multiplier += legacyGame.player.buffs.getExperienceMultiplier();
        }
        var gainedAmount = value * multiplier;
        legacyGame.player.experience += gainedAmount;
        legacyGame.player.lastExperienceGained = gainedAmount;
        legacyGame.stats.experienceEarned += gainedAmount;
        legacyGame.FrozenBattle.experienceSinceUpdate += gainedAmount;
        eventAggregate.publish(staticData.EventXpGain, {value: gainedAmount.formatMoney(0)});
        legacyGame.player.checkLevelUp();
    };
    Game.prototype.playerTakeDamage = function(value) {
        var takenAmount = legacyGame.player.takeDamage(value);
        if(takenAmount > 0) {
            var eventData = {
                wasHit: true,
                wasCrit: false,
                damageTotal: value.formatMoney(0),
                sourceActorName: legacyGame.monster.name,
                targetActorName: 'you'
            };
            eventAggregate.publish(staticData.EventCombatHit, eventData);
        }
    };
    Game.prototype.monsterTakeDamage = function(value, isCritical, displayParticle) {
        var takenAmount = legacyGame.monster.takeDamage(value, isCritical, displayParticle);
        legacyGame.FrozenBattle.damageDealtSinceUpdate += value;
        if(takenAmount > 0) {
            var eventData = {
                wasHit: true,
                wasCrit: isCritical,
                damageTotal: value.formatMoney(0),
                sourceActorName: 'you',
                targetActorName: legacyGame.monster.name
            };
            eventAggregate.publish(staticData.EventCombatHit, eventData);
        }
    };
    Game.prototype.save = function() {
        save.save();
    };
    Game.prototype.load = function() {
        save.load();
    };
    Game.prototype.reset = function() {
        save.reset();
    };
    Game.prototype.onLoad = function() {
        this.calculateMercenaryGps();
    };
    return new Game();
});

/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                 HELPER FUNCTIONS                                                      
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
function Sigma(number) {
    total = 0;
    for (var x = 1; x <= number; x++) {
        total += x;
    }
    return total;
}
var mouseX = 0;
var mouseY = 0;
(function () {
    window.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        event = event || window.event; // IE-ism
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
})();
Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, ab
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      PLAYER                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
 AttackType = new Object();
 AttackType.BASIC_ATTACK = "BASIC_ATTACK";
 AttackType.POWER_STRIKE = "POWER_STRIKE";
 AttackType.DOUBLE_STRIKE = "DOUBLE_STRIKE";
function StatsSet() {
    this.health = 0;
    this.hp5 = 0;
    this.minDamage = 0;
    this.maxDamage = 0;
    this.damageBonus = 0;
    this.armour = 0;
    this.evasion = 0;
    this.strength = 0;
    this.stamina = 0;
    this.agility = 0;
    this.critChance = 0;
    this.critDamage = 0;
    this.itemRarity = 0;
    this.goldGain = 0;
    this.experienceGain = 0;
}
function Player() {
    this.level = 1;
    this.health = 100;
    this.baseStats = new StatsSet();
    this.baseStats.health = this.health;
    this.baseStats.hp5 = 10;
    this.baseStats.minDamage = 1;
    this.baseStats.maxDamage = 1;
    this.baseStats.damageBonus = 0;
    this.baseStats.armour = 0;
    this.baseStats.evasion = 0;
    this.baseStats.strength = 0;
    this.baseStats.agility = 0;
    this.baseStats.stamina = 0;
    this.baseStats.critChance = 5;
    this.baseStats.critDamage = 200;
    this.baseStats.itemRarity = 0;
    this.baseStats.goldGain = 0;
    this.baseStats.experienceGain = 0;
    this.baseLevelUpBonuses = new StatsSet();
    this.baseLevelUpBonuses.health = 5;
    this.baseLevelUpBonuses.hp5 = 1;
    this.levelUpBonuses = new StatsSet();
    this.chosenLevelUpBonuses = new StatsSet();
    this.baseItemBonuses = new StatsSet();
    this.effects = new Array();
    this.lastDamageTaken = 0;
    this.alive = true;
    this.canAttack = true;
    this.attackType = AttackType.BASIC_ATTACK;
    this.gold = 0;
    this.lastGoldGained = 0;
    this.experience = 0;
    this.baseExperienceRequired = 10;
    this.experienceRequired = Math.ceil(Sigma(this.level * 2) * Math.pow(1.05, this.level) + this.baseExperienceRequired);
    this.lastExperienceGained = 0;
    this.powerShards = 0;
    this.resurrecting = false;
    this.resurrectionTimer = 60;
    this.resurrectionTimeRemaining = 0;
    this.skillPointsSpent = 0;
    this.skillPoints = 0;
    this.abilities = new Abilities();
    this.buffs = new BuffManager();
    this.debuffs = new DebuffManager();
    this.getMaxHealth = function getMaxHealth() {
        return Math.floor((this.getStrength() * 5) + (((this.baseStats.health + this.levelUpBonuses.health + this.baseItemBonuses.health) * (((legacyGame.mercenaryManager.getCommanderHealthPercentBonus() * legacyGame.mercenaryManager.commandersOwned) / 100) + 1)) * legacyGame.getPowerShardBonus()));
    }
    this.getHp5 = function getHp5() {
        return Math.floor(this.getStamina() + (((this.baseStats.hp5 + this.levelUpBonuses.hp5 + this.chosenLevelUpBonuses.hp5 + this.baseItemBonuses.hp5) * ((legacyGame.mercenaryManager.getClericHp5PercentBonus() * legacyGame.mercenaryManager.clericsOwned) / 100 + 1)) * legacyGame.getPowerShardBonus()));
    }
    this.getDamageBonusMultiplier = function() {
        return (this.getDamageBonus() + 100) / 100;
    }
    this.getMinDamage = function getMinDamage() {
        if (legacyGame.equipment.weapon() != null) {
            return Math.floor((((this.baseStats.minDamage + this.baseItemBonuses.minDamage - 1) * this.getDamageBonusMultiplier()) * this.buffs.getDamageMultiplier()) * legacyGame.getPowerShardBonus());
        }
        else {
            return this.baseStats.strength + Math.floor((((this.baseStats.minDamage + this.baseItemBonuses.minDamage) * this.getDamageBonusMultiplier()) * this.buffs.getDamageMultiplier()) * legacyGame.getPowerShardBonus());
        }
    }
    this.getMaxDamage = function getMaxDamage() {
        if (legacyGame.equipment.weapon() != null) {
            return Math.floor((((this.baseStats.maxDamage + this.baseItemBonuses.maxDamage - 1) * this.getDamageBonusMultiplier()) * this.buffs.getDamageMultiplier()) * legacyGame.getPowerShardBonus());
        }
        else {
            return this.baseStats.strength + Math.floor((((this.baseStats.maxDamage + this.baseItemBonuses.maxDamage) * this.getDamageBonusMultiplier()) * this.buffs.getDamageMultiplier()) * legacyGame.getPowerShardBonus());
        }
    }
    this.getDamageBonus = function getDamageBonus() {
        return this.getStrength() + ((this.baseStats.damageBonus + this.chosenLevelUpBonuses.damageBonus + this.baseItemBonuses.damageBonus + (legacyGame.mercenaryManager.getMageDamagePercentBonus() * legacyGame.mercenaryManager.magesOwned)) * legacyGame.getPowerShardBonus());
    }
    this.getAverageDamage = function getAverageDamage() {
        var average = this.getMaxDamage() - this.getMinDamage();
        average += this.getMinDamage();
        return average;
    }
    this.getArmour = function getArmour() {
        return Math.floor(((this.baseStats.armour + this.chosenLevelUpBonuses.armour + this.baseItemBonuses.armour) * ((this.getStamina() / 100) + 1)) * legacyGame.getPowerShardBonus());
    }
    this.getEvasion = function getEvasion() {
        return Math.floor(((this.baseStats.evasion + this.chosenLevelUpBonuses.evasion + this.baseItemBonuses.evasion) * (((this.getAgility() + (legacyGame.mercenaryManager.getAssassinEvasionPercentBonus() * legacyGame.mercenaryManager.assassinsOwned)) / 100) + 1)) * legacyGame.getPowerShardBonus());
    }
    this.getStrength = function getStrength() {
        return Math.floor((this.baseStats.strength + this.chosenLevelUpBonuses.strength + this.baseItemBonuses.strength) * legacyGame.getPowerShardBonus());
    }
    this.getStamina = function getStamina() {
        return Math.floor((this.baseStats.stamina + this.chosenLevelUpBonuses.stamina + this.baseItemBonuses.stamina) * legacyGame.getPowerShardBonus());
    }
    this.getAgility = function getAgility() {
        return Math.floor((this.baseStats.agility + this.chosenLevelUpBonuses.agility + this.baseItemBonuses.agility) * legacyGame.getPowerShardBonus());
    }
    this.getCritChance = function getCritChance() {
        return ((this.baseStats.critChance + this.chosenLevelUpBonuses.critChance + this.baseItemBonuses.critChance)) * legacyGame.getPowerShardBonus();
    }
    this.getCritDamage = function getCritDamage() {
        return ((this.baseStats.critDamage + this.chosenLevelUpBonuses.critDamage + this.baseItemBonuses.critDamage) + (this.getAgility() * 0.2) + (legacyGame.mercenaryManager.getWarlockCritDamageBonus() * legacyGame.mercenaryManager.warlocksOwned)) * legacyGame.getPowerShardBonus();
    }
    this.getItemRarity = function getItemRarity() {
        return (this.baseStats.itemRarity + this.chosenLevelUpBonuses.itemRarity + this.baseItemBonuses.itemRarity) * legacyGame.getPowerShardBonus();
    }
    this.getGoldGain = function getGoldGain() {
        return (this.baseStats.goldGain + this.chosenLevelUpBonuses.goldGain + this.baseItemBonuses.goldGain) * legacyGame.getPowerShardBonus();
    }
    this.getExperienceGain = function getExperienceGain() {
        return (this.baseStats.experienceGain + this.chosenLevelUpBonuses.experienceGain + this.baseItemBonuses.experienceGain) * legacyGame.getPowerShardBonus();
    }
    this.getEffectsOfType = function getEffectsOfType(type) {
        var allEffects = new Array();
        for (var x = 0; x < this.effects.length; x++) {
            if (this.effects[x].type == type) {
                allEffects.push(this.effects[x]);
            }
        }
        return allEffects;
    }
    this.increaseAbilityPower = function increaseAbilityPower(name) {
        switch (name) {
            case AbilityName.REND:
                this.abilities.baseRendLevel++;
                break;
            case AbilityName.REJUVENATING_STRIKES:
                this.abilities.baseRejuvenatingStrikesLevel++;
                break;
            case AbilityName.ICE_BLADE:
                this.abilities.baseIceBladeLevel++;
                break;
            case AbilityName.FIRE_BLADE:
                this.abilities.baseFireBladeLevel++;
                break;
        }
        this.skillPoints--;
        this.skillPointsSpent++;
    }
    this.useAbilities = function useAbilities() {
        var monstersDamageTaken = 0;
        var criticalHappened = false;
        if (this.abilities.getRendLevel() > 0) {
            legacyGame.monster.addDebuff(DebuffType.BLEED, this.abilities.getRendDamage(0), this.abilities.rendDuration);
        }
        if (this.abilities.getRejuvenatingStrikesLevel() > 0) {
            this.heal(this.abilities.getRejuvenatingStrikesHealAmount(0));
        }
        if (this.abilities.getIceBladeLevel() > 0) {
            var damage = this.abilities.getIceBladeDamage(0);
            if (this.getCritChance() >= (Math.random() * 100)) {
                damage *= (this.getCritDamage() / 100);
                criticalHappened = true;
            }
            game.monsterTakeDamage(damage, criticalHappened, false);
            legacyGame.monster.addDebuff(DebuffType.CHILL, 0, this.abilities.iceBladeChillDuration);
        }
        if (this.abilities.getFireBladeLevel() > 0) {
            var damage = this.abilities.getFireBladeDamage(0);
            if (this.getCritChance() >= (Math.random() * 100)) {
                damage *= (this.getCritDamage() / 100);
                criticalHappened = true;
            }
            game.monsterTakeDamage(damage, criticalHappened, false);
            legacyGame.monster.addDebuff(DebuffType.BURN, this.abilities.getFireBladeBurnDamage(0), this.abilities.fireBladeBurnDuration);
        }
    }
    this.changeAttack = function changeAttack(type) {
        switch (type) {
            case AttackType.BASIC_ATTACK:
                this.attackType = AttackType.BASIC_ATTACK;
                $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 0');
                break;
            case AttackType.POWER_STRIKE:
                this.attackType = AttackType.POWER_STRIKE;
                $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 100px');
                break;
            case AttackType.DOUBLE_STRIKE:
                this.attackType = AttackType.DOUBLE_STRIKE;
                $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 50px');
                break;
        }
    }
    this.checkLevelUp = function() {
        while (this.experience >= this.experienceRequired) {
            this.experience -= this.experienceRequired;
            this.level++;
            this.skillPoints++;
            this.experienceRequired = Math.ceil(Sigma(this.level * 2) * Math.pow(1.05, this.level) + this.baseExperienceRequired);
            if (this.level % 5 != 0) {
                legacyGame.statUpgradesManager.addRandomUpgrades(this.level);
            }
            this.levelUpBonuses.health += Math.floor(this.baseLevelUpBonuses.health * (Math.pow(1.01, this.level - 1)));
            this.levelUpBonuses.hp5 += Math.floor(this.baseLevelUpBonuses.hp5 * (Math.pow(1.01, this.level - 1)));
        }
    }
    this.takeDamage = function takeDamage(damage) {
        var damageReduction = this.calculateDamageReduction();
        var newDamage = damage - Math.floor(damage * (damageReduction / 100));
        if (newDamage < 0) { newDamage = 0; }
        this.health -= newDamage;
        this.lastDamageTaken = newDamage;
        legacyGame.stats.damageTaken += newDamage;
        var reflectAmount = 0;
        var barrierEffects = this.getEffectsOfType(EffectType.BARRIER);
        for (var x = 0; x < barrierEffects.length; x++) {
            reflectAmount += barrierEffects[x].value;
        }
        reflectAmount = this.lastDamageTaken * (reflectAmount / 100);
        if (reflectAmount > 0) {
            game.monsterTakeDamage(reflectAmount, false, false);
        }
        if (this.health <= 0) {
            this.alive = false;
        }
        legacyGame.particleManager.createParticle(newDamage, ParticleType.MONSTER_DAMAGE);
        return newDamage;
    }
    this.calculateDamageReduction = function calculateDamageReduction() {
        var reduction = this.getArmour() / (this.getArmour() + 500) * 99
        if (reduction >= 99) {
            reduction = 99;
        }
        return reduction;
    }
    this.calculateEvasionChance = function calculateEvasionChance() {
        var chance = (this.getEvasion() / (this.getEvasion() + 375)) * 75;
        if (chance >= 75) {
            chance = 75;
        }
        return chance;
    }
    this.heal = function heal(amount) {
        this.health += amount;
        if (this.health > this.getMaxHealth()) {
            this.health = this.getMaxHealth();
        }
    }
    this.regenerateHealth = function regenerateHealth(ms) {
        this.health += ((this.getHp5() / 5) * (ms / 1000));
        if (this.health >= this.getMaxHealth()) {
            this.health = this.getMaxHealth();
        }
    }
    this.gainItemsStats = function gainItemsStats(item) {
        this.baseItemBonuses.minDamage += item.minDamage + item.damageBonus;
        this.baseItemBonuses.maxDamage += item.maxDamage + item.damageBonus;
        this.baseItemBonuses.strength += item.strength;
        this.baseItemBonuses.agility += item.agility;
        this.baseItemBonuses.stamina += item.stamina;
        this.baseItemBonuses.health += item.health;
        this.baseItemBonuses.hp5 += item.hp5;
        this.baseItemBonuses.armour += item.armour + item.armourBonus;
        this.baseItemBonuses.evasion += item.evasion;
        this.baseItemBonuses.critChance += item.critChance;
        this.baseItemBonuses.critDamage += item.critDamage;
        this.baseItemBonuses.itemRarity += item.itemRarity;
        this.baseItemBonuses.goldGain += item.goldGain;
        this.baseItemBonuses.experienceGain += item.experienceGain;
        for (var x = 0; x < item.effects.length; x++) {
            this.effects.push(item.effects[x]);
        }
    }
    this.loseItemsStats = function loseItemsStats(item) {
        this.baseItemBonuses.minDamage -= item.minDamage + item.damageBonus;
        this.baseItemBonuses.maxDamage -= item.maxDamage + item.damageBonus;
        this.baseItemBonuses.strength -= item.strength;
        this.baseItemBonuses.agility -= item.agility;
        this.baseItemBonuses.stamina -= item.stamina;
        this.baseItemBonuses.health -= item.health;
        this.baseItemBonuses.hp5 -= item.hp5;
        this.baseItemBonuses.armour -= item.armour + item.armourBonus;
        this.baseItemBonuses.evasion -= item.evasion;
        this.baseItemBonuses.critChance -= item.critChance;
        this.baseItemBonuses.critDamage -= item.critDamage;
        this.baseItemBonuses.itemRarity -= item.itemRarity;
        this.baseItemBonuses.goldGain -= item.goldGain;
        this.baseItemBonuses.experienceGain -= item.experienceGain;
        for (var x = item.effects.length - 1; x >= 0; x--) {
            for (var y = this.effects.length - 1; y >= 0; y--) {
                if (this.effects[y].type == item.effects[x].type &&
                    this.effects[y].chance == item.effects[x].chance &&
                    this.effects[y].value == item.effects[x].value) {
                    this.effects.splice(y, 1);
                    break;
                }
            }
        }
    }
    this.addDebuff = function addDebuff(type, damage, duration) {
        switch (type) {
            case DebuffType.BLEED:
                this.debuffs.bleeding = true;
                this.debuffs.bleedDamage = damage;
                this.debuffs.bleedDuration = 0;
                this.debuffs.bleedMaxDuration = duration;
                this.debuffs.bleedStacks++;
                break;
            case DebuffType.CHILL:
                this.debuffs.chilled = true;
                this.debuffs.chillDuration = 0;
                this.debuffs.chillMaxDuration = duration;
                break;
            case DebuffType.BURN:
                this.debuffs.burning = true;
                this.debuffs.burningDamage = damage;
                this.debuffs.burningDuration = 0;
                this.debuffs.burningMaxDuration = duration;
                break;
        }
    }
    this.update = function update(ms) {
        this.buffs.update(ms);
    }
    this.updateDebuffs = function updateDebuffs() {
        if (this.debuffs.bleeding) {
            game.playerTakeDamage(this.debuffs.bleedDamage);
            this.debuffs.bleedDuration++;
            if (this.debuffs.bleedDuration >= this.debuffs.bleedMaxDuration) {
                this.debuffs.bleeding = false;
                this.debuffs.bleedDamage = 0;
                this.debuffs.bleedDuration = 0;
                this.debuffs.bleedMaxDuration = 0;
                this.debuffs.bleedStacks = 0;
            }
        }
        if (this.debuffs.chilled) {
            if (this.debuffs.chillDuration == 0 || (this.debuffs.chillDuration % 2 == 0)) {
                this.canAttack = false;
            }
            else { this.canAttack = true; }
            this.debuffs.chillDuration++;
            if (this.debuffs.chillDuration >= this.debuffs.chillMaxDuration) {
                this.debuffs.chillDuration = 0;
                this.debuffs.chillMaxDuration = 0;
                this.debuffs.chilled = false;
            }
        }
        else { this.canAttack = true; }
        if (this.debuffs.burning) {
            game.playerTakeDamage(this.debuffs.burningDamage);
            this.debuffs.burningDuration++;
            if (this.debuffs.burningDuration >= this.debuffs.burningMaxDuration) {
                this.debuffs.burningDamage = 0;
                this.debuffs.burningDuration = 0;
                this.debuffs.burningMaxDuration = 0;
                this.debuffs.burning = false;
            }
        }
    }
    this.save = function save() {
        localStorage.playerSaved = true;
        localStorage.playerLevel = this.level;
        localStorage.playerHealth = this.health;
        localStorage.chosenLevelUpBonuses = JSON.stringify(this.chosenLevelUpBonuses);
        localStorage.baseItemBonuses = JSON.stringify(this.baseItemBonuses);
        localStorage.playerGold = this.gold;
        localStorage.playerLevel = this.level;
        localStorage.playerExperience = this.experience;
        localStorage.playerSkillPointsSpent = this.skillPointsSpent;
        localStorage.playerSkillPoints = this.skillPoints;
        this.abilities.save();
        localStorage.playerAlive = this.alive;
        localStorage.attackType = this.attackType;
        localStorage.playerEffects = JSON.stringify(this.effects);
        localStorage.powerShards = this.powerShards;
    }
    this.load = function load() {
        if (localStorage.playerSaved != null) {
            this.level = parseInt(localStorage.playerLevel);
            this.health = parseFloat(localStorage.playerHealth);
            if (localStorage.version == null) {
                this.chosenLevelUpBonuses.health = parseFloat(localStorage.playerBaseHealthStatBonus);
                this.chosenLevelUpBonuses.hp5 = parseFloat(localStorage.playerBaseHp5StatBonus);
                this.chosenLevelUpBonuses.damageBonus = parseFloat(localStorage.playerBaseDamageBonusStatBonus);
                this.chosenLevelUpBonuses.armour = parseFloat(localStorage.playerBaseArmourStatBonus);
                this.chosenLevelUpBonuses.strength = parseFloat(localStorage.playerBaseStrengthStatBonus);
                this.chosenLevelUpBonuses.stamina = parseFloat(localStorage.playerBaseStaminaStatBonus);
                this.chosenLevelUpBonuses.agility = parseFloat(localStorage.playerBaseAgilityStatBonus);
                this.chosenLevelUpBonuses.critChance = parseFloat(localStorage.playerBaseCritChanceStatBonus);
                this.chosenLevelUpBonuses.critDamage = parseFloat(localStorage.playerBaseCritDamageStatBonus);
                this.chosenLevelUpBonuses.itemRarity = parseFloat(localStorage.playerBaseItemRarityStatBonus);
                this.chosenLevelUpBonuses.goldGain = parseFloat(localStorage.playerBaseGoldGainStatBonus);
                this.chosenLevelUpBonuses.experienceGain = parseFloat(localStorage.playerBaseExperienceGainStatBonus);
                this.baseItemBonuses.health = parseInt(localStorage.playerBaseHealthFromItems);
                this.baseItemBonuses.hp5 = parseInt(localStorage.playerBaseHp5FromItems);
                this.baseItemBonuses.minDamage = parseInt(localStorage.playerBaseMinDamageFromItems);
                this.baseItemBonuses.maxDamage = parseInt(localStorage.playerBaseMaxDamageFromItems);
                this.baseItemBonuses.damageBonus = parseFloat(localStorage.playerBaseDamageBonusFromItems);
                this.baseItemBonuses.armour = parseFloat(localStorage.playerBaseArmourFromItems);
                this.baseItemBonuses.strength = parseInt(localStorage.playerBaseStrengthFromItems);
                this.baseItemBonuses.stamina = parseInt(localStorage.playerBaseStaminaFromItems);
                this.baseItemBonuses.agility = parseInt(localStorage.playerBaseAgilityFromItems);
                this.baseItemBonuses.critChance = parseFloat(localStorage.playerBaseCritChanceFromItems);
                this.baseItemBonuses.critDamage = parseFloat(localStorage.playerBaseCritDamageFromItems);
                this.baseItemBonuses.itemRarity = parseFloat(localStorage.playerBaseItemRarityFromItems);
                this.baseItemBonuses.goldGain = parseFloat(localStorage.playerBaseGoldGainFromItems);
                this.baseItemBonuses.experienceGain = parseFloat(localStorage.playerBaseExperienceGainFromItems);
            }
            for (var x = 1; x < this.level; x++) {
                this.levelUpBonuses.health += Math.floor(this.baseLevelUpBonuses.health * (Math.pow(1.01, x)));
                this.levelUpBonuses.hp5 += Math.floor(this.baseLevelUpBonuses.hp5 * (Math.pow(1.01, x)));
            }
            this.gold = parseFloat(localStorage.playerGold);
            this.level = parseInt(localStorage.playerLevel);
            this.experience = parseFloat(localStorage.playerExperience);
            this.experienceRequired = Math.ceil(Sigma(this.level * 2) * Math.pow(1.05, this.level) + this.baseExperienceRequired);
            this.skillPointsSpent = parseInt(localStorage.playerSkillPointsSpent);
            this.skillPoints = parseInt(localStorage.playerSkillPoints);
            this.abilities.load();
            this.changeAttack(localStorage.attackType);
            if (localStorage.version != null) {
                this.chosenLevelUpBonuses = JSON.parse(localStorage.chosenLevelUpBonuses);
                this.baseItemBonuses = JSON.parse(localStorage.baseItemBonuses);
                this.changeAttack(localStorage.attackType);
                var newEffects = JSON.parse(localStorage.playerEffects);
                if (newEffects != null && newEffects.length > 0) {
                    for (var x = 0; x < newEffects.length; x++) {
                        this.effects.push(new Effect(newEffects[x].type, newEffects[x].chance, newEffects[x].value));
                    }
                }
            }
            if (localStorage.powerShards != null) { this.powerShards = parseInt(localStorage.powerShards); }
        }
        if (localStorage.playerAlive != null) { this.alive = JSON.parse(localStorage.playerAlive); }
    }
}
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                     ABILITIES                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
AbilityName = new Object();
AbilityName.REND = "REND";
AbilityName.REJUVENATING_STRIKES = "REJUVENATING_STRIKES";
AbilityName.ICE_BLADE = "ICE_BLADE";
AbilityName.FIRE_BLADE = "FIRE_BLADE";
function Abilities() {
    this.baseRendLevel = 0;
    this.getRendLevel = function getRendLevel() {
        var level = this.baseRendLevel;
        var effects = legacyGame.player.getEffectsOfType(EffectType.WOUNDING);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }
    this.rendDuration = 5;
    this.getRendDamage = function getRendDamage(levelBonus) {
        return Math.ceil((legacyGame.player.getAverageDamage() / 17) + (legacyGame.player.level / 1.5)) * (this.getRendLevel() + levelBonus);
    }
    this.baseRejuvenatingStrikesLevel = 0;
    this.getRejuvenatingStrikesLevel = function getRejuvenatingStrikesLevel() {
        var level = this.baseRejuvenatingStrikesLevel;
        var effects = legacyGame.player.getEffectsOfType(EffectType.CURING);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }
    this.getRejuvenatingStrikesHealAmount = function getRejuvenatingStrikesHealAmount(levelBonus) {
        return Math.ceil((legacyGame.player.getAverageDamage() / 54) + (legacyGame.player.level / 2)) * (this.getRejuvenatingStrikesLevel() + levelBonus);
    }
    this.baseIceBladeLevel = 0;
    this.getIceBladeLevel = function getIceBladeLevel() {
        var level = this.baseIceBladeLevel;
        var effects = legacyGame.player.getEffectsOfType(EffectType.FROST_SHARDS);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }
    this.iceBladeChillDuration = 5;
    this.getIceBladeDamage = function getIceBladeDamage(levelBonus) {
        return Math.ceil((legacyGame.player.getAverageDamage() / 12) + legacyGame.player.level) * (this.getIceBladeLevel() + levelBonus);
    }
    this.baseFireBladeLevel = 0;
    this.getFireBladeLevel = function getFireBladeLevel() {
        var level = this.baseFireBladeLevel;
        var effects = legacyGame.player.getEffectsOfType(EffectType.FLAME_IMBUED);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }
    this.fireBladeBurnDuration = 5;
    this.getFireBladeDamage = function getFireBladeDamage(levelBonus) {
        return Math.ceil((legacyGame.player.getAverageDamage() / 12) + legacyGame.player.level) * (this.getFireBladeLevel() + levelBonus);
    }
    this.getFireBladeBurnDamage = function getFireBladeBurnDamage(levelBonus) {
        return Math.ceil((legacyGame.player.getAverageDamage() / 9) + legacyGame.player.level) * (this.getFireBladeLevel() + levelBonus);
    }
    this.save = function save() {
        localStorage.playerRendLevel = this.baseRendLevel;
        localStorage.playerRejuvenatingStrikesLevel = this.baseRejuvenatingStrikesLevel;
        localStorage.playerIceBladeLevel = this.baseIceBladeLevel;
        localStorage.playerFireBladeLevel = this.baseFireBladeLevel;
    }
    this.load = function load() {
        if (localStorage.playerRendLevel != null) { this.baseRendLevel = parseInt(localStorage.playerRendLevel); }
        if (localStorage.playerRejuvenatingStrikesLevel != null) { this.baseRejuvenatingStrikesLevel = parseInt(localStorage.playerRejuvenatingStrikesLevel); }
        if (localStorage.playerIceBladeLevel != null) { this.baseIceBladeLevel = parseInt(localStorage.playerIceBladeLevel); }
        if (localStorage.playerFireBladeLevel != null) { this.baseFireBladeLevel = parseInt(localStorage.playerFireBladeLevel); }
    }
}
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
function StatUpgrade(type, amount) {
    this.type = type;
    this.amount = amount;
}
function StatUpgradesManager() {
    this.upgrades = new Array();
    this.addNewUpgrades = function addNewUpgrades(upgrade1Type, upgrade1Amount, upgrade2Type, upgrade2Amount, upgrade3Type, upgrade3Amount) {
        var newUpgrades = new Array();
        newUpgrades.push(new StatUpgrade(upgrade1Type, upgrade1Amount));
        newUpgrades.push(new StatUpgrade(upgrade2Type, upgrade2Amount));
        newUpgrades.push(new StatUpgrade(upgrade3Type, upgrade3Amount));
        this.upgrades.push(newUpgrades);
    }
    this.addRandomUpgrades = function addRandomUpgrades(level) {
        var upgradeTypes = new Array();
        var upgradeIds = new Array();
        var upgradeAmounts = new Array();
        var idsRemaining = 3;
        var newId;
        while (idsRemaining >= 0) {
            newId = Math.floor(Math.random() * (StatUpgradeType.amount + 1));
            if (upgradeIds.indexOf(newId) == -1) {
                upgradeIds.push(newId);
                idsRemaining--;
            }
        }
        for (var x = 0; x < upgradeIds.length; x++) {
            switch (upgradeIds[x]) {
                case 0:
                    upgradeTypes.push(StatUpgradeType.DAMAGE);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomDamageBonus(level));
                    break;
                case 1:
                    upgradeTypes.push(StatUpgradeType.STRENGTH);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomStrengthBonus(level));
                    break;
                case 2:
                    upgradeTypes.push(StatUpgradeType.AGILITY);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomAgilityBonus(level));
                    break;
                case 3:
                    upgradeTypes.push(StatUpgradeType.STAMINA);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomStaminaBonus(level));
                    break;
                case 4:
                    upgradeTypes.push(StatUpgradeType.ARMOUR);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomArmourBonus(level));
                    break;
                case 5:
                    upgradeTypes.push(StatUpgradeType.HP5);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomHp5Bonus(level));
                    break;
                case 6:
                    upgradeTypes.push(StatUpgradeType.CRIT_DAMAGE);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomCritDamageBonus(level));
                    break;
                case 7:
                    upgradeTypes.push(StatUpgradeType.ITEM_RARITY);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomItemRarityBonus(level));
                    break;
                case 8:
                    upgradeTypes.push(StatUpgradeType.GOLD_GAIN);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomGoldGainBonus(level));
                    break;
                case 9:
                    upgradeTypes.push(StatUpgradeType.EXPERIENCE_GAIN);
                    upgradeAmounts.push(legacyGame.statGenerator.getRandomExperienceGainBonus(level));
                    break;
            }
        }
        this.addNewUpgrades(upgradeTypes[0], upgradeAmounts[0], upgradeTypes[1], upgradeAmounts[1], upgradeTypes[2], upgradeAmounts[2]);
    }
    this.save = function save() {
        localStorage.statUpgradesSaved = true;
        localStorage.statUpgrades = JSON.stringify(this.upgrades);
    }
    this.load = function load() {
        if (localStorage.statUpgradesSaved != null) {
            this.upgrades = JSON.parse(localStorage.statUpgrades);
        }
    }
}
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      DEBUFFS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
DebuffType = new Object();
DebuffType.BLEED = "BLEED";
DebuffType.CHILL = "CHILL";
DebuffType.BURN = "BURN";
function DebuffManager() {
    this.bleeding = false;
    this.bleedStacks = 0;
    this.bleedDamage = 0;
    this.bleedDuration = 0;
    this.bleedMaxDuration = 0;
    this.chilled = false;
    this.chillDuration = 0;
    this.chillMaxDuration = 0;
    this.burning = false;
    this.burningStacks = 0;
    this.burningDamage = 0;
    this.burningDuration = 0;
    this.burningMaxDuration = 0;
}
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
function mercenary(type) {
    this.type = type;
}
function mercenaryManager() {
    var gpsUpdateDelay = 100;
    var gpsUpdateTime = 0;
    this.baseFootmanGps = 0.1;
    this.baseClericGps = 0.94;
    this.baseCommanderGps = 8.8;
    this.baseMageGps = 83;
    this.baseAssassinGps = 780;
    this.baseWarlockGps = 7339;
    this.footmanGps = this.baseFootmanGps;
    this.clericGps = this.baseClericGps;
    this.commanderGps = this.baseCommanderGps;
    this.mageGps = this.baseMageGps;
    this.assassinGps = this.baseAssassinGps;
    this.warlockGps = this.baseWarlockGps;
    this.baseClericHp5PercentBonus = 5;
    this.baseCommanderHealthPercentBonus = 5;
    this.baseMageDamagePercentBonus = 5;
    this.baseAssassinEvasionPercentBonus = 5;
    this.baseWarlockCritDamageBonus = 5;
    this.clericHp5PercentUpgradeValue = 2.5;
    this.commanderHealthPercentUpgradeValue = 2.5;
    this.mageDamagePercentUpgradeValue = 2.5;
    this.assassinEvasionPercentUpgradeValue = 2.5;
    this.warlockCritDamageUpgradeValue = 2.5;
    this.baseFootmanPrice = 10;
    this.baseClericPrice = 200;
    this.baseCommanderPrice = 4000;
    this.baseMagePrice = 80000;
    this.baseAssassinPrice = 1600000;
    this.baseWarlockPrice = 32000000;
    this.footmanPrice = this.baseFootmanPrice;
    this.footmenOwned = 0;
    this.clericPrice = this.baseClericPrice;
    this.clericsOwned = 0;
    this.commanderPrice = this.baseCommanderPrice;
    this.commandersOwned = 0;
    this.magePrice = this.baseMagePrice;
    this.magesOwned = 0;
    this.assassinPrice = this.baseAssassinPrice;
    this.assassinsOwned = 0;
    this.warlockPrice = this.baseWarlockPrice;
    this.warlocksOwned = 0;
    this.deathGpsReductionAmount = 50;
    this.deathGpsReductionDuration = 60;
    this.gpsReductionTimeRemaining = 0;
    this.gpsReduction = 0;
    this.mercenaries = new Array();
    this.initialize = function initialize() {
        document.getElementById("footmanCost").innerHTML = this.footmanPrice.formatMoney(0);
        document.getElementById("clericCost").innerHTML = this.clericPrice.formatMoney(0);
        document.getElementById("commanderCost").innerHTML = this.commanderPrice.formatMoney(0);
        document.getElementById("mageCost").innerHTML = this.magePrice.formatMoney(0);
        document.getElementById("assassinCost").innerHTML = this.assassinPrice.formatMoney(0);
        document.getElementById("warlockCost").innerHTML = this.warlockPrice.formatMoney(0);
    }
    this.addMercenary = function addMercenary(type) {
        switch (type) {
            case MercenaryType.FOOTMAN: this.mercenaries.push(new mercenary(MercenaryType.FOOTMAN)); break;
            case MercenaryType.CLERIC: this.mercenaries.push(new mercenary(MercenaryType.CLERIC)); break;
            case MercenaryType.COMMANDER: this.mercenaries.push(new mercenary(MercenaryType.COMMANDER)); break;
            case MercenaryType.MAGE: this.mercenaries.push(new mercenary(MercenaryType.MAGE)); break;
            case MercenaryType.ASSASSIN: this.mercenaries.push(new mercenary(MercenaryType.ASSASSIN)); break;
            case MercenaryType.WARLOCK: this.mercenaries.push(new mercenary(MercenaryType.WARLOCK)); break;
        }
    }
    this.getClericHp5PercentBonus = function getClericHp5PercentBonus() {
        return this.baseClericHp5PercentBonus + (this.clericHp5PercentUpgradeValue * legacyGame.upgradeManager.clericSpecialUpgradesPurchased);
    }
    this.getCommanderHealthPercentBonus = function getCommanderHealthPercentBonus() {
        return this.baseCommanderHealthPercentBonus + (this.commanderHealthPercentUpgradeValue * legacyGame.upgradeManager.commanderSpecialUpgradesPurchased);
    }
    this.getMageDamagePercentBonus = function getMageDamagePercentBonus() {
        return this.baseMageDamagePercentBonus + (this.mageDamagePercentUpgradeValue * legacyGame.upgradeManager.mageSpecialUpgradesPurchased);
    }
    this.getAssassinEvasionPercentBonus = function getAssassinEvasionPercentBonus() {
        return this.baseAssassinEvasionPercentBonus + (this.assassinEvasionPercentUpgradeValue * legacyGame.upgradeManager.assassinSpecialUpgradesPurchased);
    }
    this.getWarlockCritDamageBonus = function getWarlockCritDamageBonus() {
        return this.baseWarlockCritDamageBonus + (this.warlockCritDamageUpgradeValue * legacyGame.upgradeManager.warlockSpecialUpgradesPurchased);
    }
    this.getMercenaryBaseGps = function getMercenaryBaseGps(type) {
        switch (type) {
            case MercenaryType.FOOTMAN:
                return (this.baseFootmanGps * Math.pow(2, legacyGame.upgradeManager.footmanUpgradesPurchased));
                break;
            case MercenaryType.CLERIC:
                return (this.baseClericGps * Math.pow(2, legacyGame.upgradeManager.clericUpgradesPurchased));
                break;
            case MercenaryType.COMMANDER:
                return (this.baseCommanderGps * Math.pow(2, legacyGame.upgradeManager.commanderUpgradesPurchased));
                break;
            case MercenaryType.MAGE:
                return (this.baseMageGps * Math.pow(2, legacyGame.upgradeManager.mageUpgradesPurchased));
                break;
            case MercenaryType.ASSASSIN:
                return (this.baseAssassinGps * Math.pow(2, legacyGame.upgradeManager.assassinUpgradesPurchased));
                break;
            case MercenaryType.WARLOCK:
                return (this.baseWarlockGps * Math.pow(2, legacyGame.upgradeManager.warlockUpgradesPurchased));
                break;
        }
    }
    this.getMercenariesGps = function getMercenariesGps(type) {
        switch (type) {
            case MercenaryType.FOOTMAN:
                return (this.getMercenaryBaseGps(type) * ((legacyGame.player.getGoldGain() / 100) + 1) * ((100 - this.gpsReduction) / 100)) * legacyGame.player.buffs.getGoldMultiplier();
                break;
            case MercenaryType.CLERIC:
                return (this.getMercenaryBaseGps(type) * ((legacyGame.player.getGoldGain() / 100) + 1) * ((100 - this.gpsReduction) / 100)) * legacyGame.player.buffs.getGoldMultiplier();
                break;
            case MercenaryType.COMMANDER:
                return (this.getMercenaryBaseGps(type) * ((legacyGame.player.getGoldGain() / 100) + 1) * ((100 - this.gpsReduction) / 100)) * legacyGame.player.buffs.getGoldMultiplier();
                break;
            case MercenaryType.MAGE:
                return (this.getMercenaryBaseGps(type) * ((legacyGame.player.getGoldGain() / 100) + 1) * ((100 - this.gpsReduction) / 100)) * legacyGame.player.buffs.getGoldMultiplier();
                break;
            case MercenaryType.ASSASSIN:
                return (this.getMercenaryBaseGps(type) * ((legacyGame.player.getGoldGain() / 100) + 1) * ((100 - this.gpsReduction) / 100)) * legacyGame.player.buffs.getGoldMultiplier();
                break;
            case MercenaryType.WARLOCK:
                return (this.getMercenaryBaseGps(type) * ((legacyGame.player.getGoldGain() / 100) + 1) * ((100 - this.gpsReduction) / 100)) * legacyGame.player.buffs.getGoldMultiplier();
                break;
        }
    }
    this.getGps = function getGps() {
        var gps = 0;
        var gold = 0;
        for (var x = 0; x < this.mercenaries.length; x++) {
            gold = 0;
            gold += this.getMercenariesGps(this.mercenaries[x].type);
            gps += gold;
        }
        return gps.formatMoney(2);
    }
    this.update = function update(ms) {
        if (this.gpsReduction > 0) {
            this.gpsReductionTimeRemaining -= ms;
            if (this.gpsReductionTimeRemaining <= 0) {
                this.gpsReduction = 0;
            }
        }
        gpsUpdateTime += ms;
        if (gpsUpdateTime >= gpsUpdateDelay) {
            var gainTimes = 0;
            while (gpsUpdateTime >= gpsUpdateDelay) {
                gpsUpdateTime -= gpsUpdateDelay;
                gainTimes++;
            }
            for (var x = 0; x < this.mercenaries.length; x++) {
                var amount = ((this.getMercenariesGps(this.mercenaries[x].type) / 1000) * gpsUpdateDelay) * gainTimes;
                game.gainGold(amount, false, true);
                legacyGame.stats.goldFromMercenaries += legacyGame.player.lastGoldGained;
            }
        }
    }
    this.purchaseMercenary = function purchaseMercenary(type) {
        var price;
        switch (type) {
            case MercenaryType.FOOTMAN: price = this.footmanPrice; break;
            case MercenaryType.CLERIC: price = this.clericPrice; break;
            case MercenaryType.COMMANDER: price = this.commanderPrice; break;
            case MercenaryType.MAGE: price = this.magePrice; break;
            case MercenaryType.ASSASSIN: price = this.assassinPrice; break;
            case MercenaryType.WARLOCK: price = this.warlockPrice; break;
        }
        if (legacyGame.player.gold >= price) {
            legacyGame.player.gold -= price;
            this.addMercenary(type);
            switch (type) {
                case MercenaryType.FOOTMAN: this.footmenOwned++; break;
                case MercenaryType.CLERIC: this.clericsOwned++; break;
                case MercenaryType.COMMANDER: this.commandersOwned++; break;
                case MercenaryType.MAGE: this.magesOwned++; break;
                case MercenaryType.ASSASSIN: this.assassinsOwned++; break;
                case MercenaryType.WARLOCK: this.warlocksOwned++; break;
            }
            switch (type) {
                case MercenaryType.FOOTMAN: this.footmanPrice = Math.floor(this.baseFootmanPrice * Math.pow(1.15, this.footmenOwned)); break;
                case MercenaryType.CLERIC: this.clericPrice = Math.floor(this.baseClericPrice * Math.pow(1.15, this.clericsOwned)); break;
                case MercenaryType.COMMANDER: this.commanderPrice = Math.floor(this.baseCommanderPrice * Math.pow(1.15, this.commandersOwned)); break;
                case MercenaryType.MAGE: this.magePrice = Math.floor(this.baseMagePrice * Math.pow(1.15, this.magesOwned)); break;
                case MercenaryType.ASSASSIN: this.assassinPrice = Math.floor(this.baseAssassinPrice * Math.pow(1.15, this.assassinsOwned)); break;
                case MercenaryType.WARLOCK: this.warlockPrice = Math.floor(this.baseWarlockPrice * Math.pow(1.15, this.warlocksOwned)); break;
            }
            var leftReduction;
            switch (type) {
                case MercenaryType.FOOTMAN:
                    document.getElementById("footmanCost").innerHTML = this.footmanPrice.formatMoney(0);
                    document.getElementById("footmenOwned").innerHTML = this.footmenOwned;
                    break;
                case MercenaryType.CLERIC:
                    document.getElementById("clericCost").innerHTML = this.clericPrice.formatMoney(0);
                    document.getElementById("clericsOwned").innerHTML = this.clericsOwned;
                    break;
                case MercenaryType.COMMANDER:
                    document.getElementById("commanderCost").innerHTML = this.commanderPrice.formatMoney(0);
                    document.getElementById("commandersOwned").innerHTML = this.commandersOwned;
                    break;
                case MercenaryType.MAGE:
                    document.getElementById("mageCost").innerHTML = this.magePrice.formatMoney(0);
                    document.getElementById("magesOwned").innerHTML = this.magesOwned;
                    break;
                case MercenaryType.ASSASSIN:
                    document.getElementById("assassinCost").innerHTML = this.assassinPrice.formatMoney(0);
                    document.getElementById("assassinsOwned").innerHTML = this.assassinsOwned;
                    break;
                case MercenaryType.WARLOCK:
                    document.getElementById("warlockCost").innerHTML = this.warlockPrice.formatMoney(0);
                    document.getElementById("warlocksOwned").innerHTML = this.warlocksOwned;
                    break;
            }
        }
    }
    this.addGpsReduction = function addGpsReduction(percentage, duration) {
        this.gpsReduction = percentage;
        this.gpsReductionTimeRemaining = (duration * 1000);
    }
    this.save = function save() {
        localStorage.mercenaryManagerSaved = true;
        localStorage.footmenOwned = this.footmenOwned;
        localStorage.clericsOwned = this.clericsOwned;
        localStorage.commandersOwned = this.commandersOwned;
        localStorage.magesOwned = this.magesOwned;
        localStorage.assassinsOwned = this.assassinsOwned;
        localStorage.warlocksOwned = this.warlocksOwned;
        localStorage.mercenaries = JSON.stringify(this.mercenaries);
    }
    this.load = function load() {
        if (localStorage.mercenaryManagerSaved != null) {
            this.footmenOwned = parseInt(localStorage.footmenOwned);
            this.clericsOwned = parseInt(localStorage.clericsOwned);
            this.commandersOwned = parseInt(localStorage.commandersOwned);
            this.magesOwned = parseInt(localStorage.magesOwned);
            if (localStorage.version == null) {
                this.assassinsOwned = parseInt(localStorage.thiefsOwned);
            }
            else { this.assassinsOwned = parseInt(localStorage.assassinsOwned); }
            this.warlocksOwned = parseInt(localStorage.warlocksOwned);
            this.footmanPrice = Math.floor(this.baseFootmanPrice * Math.pow(1.15, this.footmenOwned));
            this.clericPrice = Math.floor(this.baseClericPrice * Math.pow(1.15, this.clericsOwned));
            this.commanderPrice = Math.floor(this.baseCommanderPrice * Math.pow(1.15, this.commandersOwned));
            this.magePrice = Math.floor(this.baseMagePrice * Math.pow(1.15, this.magesOwned));
            this.assassinPrice = Math.floor(this.baseAssassinPrice * Math.pow(1.15, this.assassinsOwned));
            this.warlockPrice = Math.floor(this.baseWarlockPrice * Math.pow(1.15, this.warlocksOwned));
            this.mercenaries = JSON.parse(localStorage.mercenaries);
            for (var x = 0; x < this.mercenaries.length; x++) {
                if (this.mercenaries[x].type == MercenaryType.THIEF) {
                    this.mercenaries[x].type = MercenaryType.ASSASSIN;
                }
            }
            document.getElementById("footmanCost").innerHTML = this.footmanPrice.formatMoney(0);
            document.getElementById("footmenOwned").innerHTML = this.footmenOwned;
            document.getElementById("clericCost").innerHTML = this.clericPrice.formatMoney(0);
            document.getElementById("clericsOwned").innerHTML = this.clericsOwned;
            document.getElementById("commanderCost").innerHTML = this.commanderPrice.formatMoney(0);
            document.getElementById("commandersOwned").innerHTML = this.commandersOwned;
            document.getElementById("mageCost").innerHTML = this.magePrice.formatMoney(0);
            document.getElementById("magesOwned").innerHTML = this.magesOwned;
            document.getElementById("assassinCost").innerHTML = this.assassinPrice.formatMoney(0);
            document.getElementById("assassinsOwned").innerHTML = this.assassinsOwned;
            document.getElementById("warlockCost").innerHTML = this.warlockPrice.formatMoney(0);
            document.getElementById("warlocksOwned").innerHTML = this.warlocksOwned;
        }
    }
}
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                     EQUIPMENT                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
function Equipment() {
    this.slots = new Array();
    for (var x = 0; x < 10; x++) {
        this.slots[x] = null;
    }
    this.helm = function helm() { return this.slots[0]; };
    this.shoulders = function shoulders() { return this.slots[1]; };
    this.chest = function chest() { return this.slots[2]; };
    this.legs = function legs() { return this.slots[3]; };
    this.weapon = function weapon() { return this.slots[4]; };
    this.gloves = function gloves() { return this.slots[5]; };
    this.boots = function boots() { return this.slots[6]; };
    this.trinket1 = function trinket1() { return this.slots[7]; };
    this.trinket2 = function trinket2() { return this.slots[8]; };
    this.off_hand = function off_hand() { return this.slots[9]; };
    this.equipItem = function equipItem(item, currentSlotIndex) {
        if (item == null) { return; }
        var equippable = false;
        if (item.type == ItemType.HELM || item.type == ItemType.SHOULDERS || item.type == ItemType.CHEST ||
            item.type == ItemType.LEGS || item.type == ItemType.WEAPON || item.type == ItemType.GLOVES ||
            item.type == ItemType.BOOTS || item.type == ItemType.TRINKET || item.type == ItemType.TRINKET ||
            item.type == ItemType.OFF_HAND) {
            equippable = true;
        }
        var newSlotIndex = 0;
        switch (item.type) {
            case ItemType.HELM: newSlotIndex = 0; break;
            case ItemType.SHOULDERS: newSlotIndex = 1; break;
            case ItemType.CHEST: newSlotIndex = 2; break;
            case ItemType.LEGS: newSlotIndex = 3; break;
            case ItemType.WEAPON: newSlotIndex = 4; break;
            case ItemType.GLOVES: newSlotIndex = 5; break;
            case ItemType.BOOTS: newSlotIndex = 6; break;
            case ItemType.TRINKET:
                if (this.slots[7] == null) {
                    newSlotIndex = 7;
                }
                else if (this.slots[8] == null) {
                    newSlotIndex = 8;
                }
                else {
                    newSlotIndex = 7;
                }
                break;
            case ItemType.OFF_HAND: newSlotIndex = 9; break;
        }
        if (equippable) {
            if (this.slots[newSlotIndex] == null) {
                this.slots[newSlotIndex] = item;
                legacyGame.inventory.removeItem(currentSlotIndex);
                legacyGame.player.gainItemsStats(item);
            }
            else {
                var savedItem = this.slots[newSlotIndex];
                this.slots[newSlotIndex] = item;
                legacyGame.player.gainItemsStats(item);
                legacyGame.inventory.addItemToSlot(savedItem, currentSlotIndex);
                legacyGame.player.loseItemsStats(savedItem);
            }
            if (legacyGame.inventory.slots[currentSlotIndex] != null) {
                var item = legacyGame.inventory.slots[currentSlotIndex];
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
                                                    if (legacyGame.equipment.trinket1() != null && legacyGame.equipment.trinket2() != null) {
                                                        twoTrinkets = true;
                                                    }
                                                }
                                                break;
                    case ItemType.OFF_HAND:     if (legacyGame.equipment.off_hand() != null) { equippedSlot = 9; } break;
                }
                var item2 = legacyGame.equipment.slots[equippedSlot];
                if (twoTrinkets) {
                    var item3 = legacyGame.equipment.trinket2();
                }
                var slot = document.getElementById("inventoryItem" + (currentSlotIndex + 1));
                var rect = slot.getBoundingClientRect();
                legacyGame.tooltipManager.displayItemTooltip(item, item2, item3, rect.left, rect.top, true);
            }
            else {
                $("#itemTooltip").hide();
                $("#itemCompareTooltip").hide();
                $("#itemCompareTooltip2").hide();
            }
        }
    }
    this.equipSecondTrinket = function equipSecondTrinket(item, itemSlot) {
        if (item.type == ItemType.TRINKET) {
            this.equipItemInSlot(item, 8, itemSlot);
            if (legacyGame.inventory.slots[itemSlot] != null) {
                var item = legacyGame.inventory.slots[itemSlot];
                var equippedSlot = -1
                var twoTrinkets = false;
                switch (item.type) {
                    case ItemType.HELM: if (legacyGame.equipment.helm() != null) { equippedSlot = 0 } break;
                    case ItemType.SHOULDERS: if (legacyGame.equipment.shoulders() != null) { equippedSlot = 1; } break;
                    case ItemType.CHEST: if (legacyGame.equipment.chest() != null) { equippedSlot = 2; } break;
                    case ItemType.LEGS: if (legacyGame.equipment.legs() != null) { equippedSlot = 3; } break;
                    case ItemType.WEAPON: if (legacyGame.equipment.weapon() != null) { equippedSlot = 4; } break;
                    case ItemType.GLOVES: if (legacyGame.equipment.gloves() != null) { equippedSlot = 5; } break;
                    case ItemType.BOOTS: if (legacyGame.equipment.boots() != null) { equippedSlot = 6; } break;
                    case ItemType.TRINKET: if (legacyGame.equipment.trinket1() != null || legacyGame.equipment.trinket2() != null) {
                            equippedSlot = 7;
                            if (legacyGame.equipment.trinket1() != null && legacyGame.equipment.trinket2() != null) {
                                twoTrinkets = true;
                            }
                        }
                        break;
                    case ItemType.OFF_HAND: if (legacyGame.equipment.off_hand() != null) { equippedSlot = 9; } break;
                }
                var item2 = legacyGame.equipment.slots[equippedSlot];
                if (twoTrinkets) {
                    var item3 = legacyGame.equipment.trinket2();
                }
                var slot = document.getElementById("inventoryItem" + (itemSlot + 1));
                var rect = slot.getBoundingClientRect();
                legacyGame.tooltipManager.displayItemTooltip(item, item2, item3, rect.left, rect.top, true);
            }
            else {
                $("#itemTooltip").hide();
                $("#itemCompareTooltip").hide();
                $("#itemCompareTooltip2").hide();
            }
        }
    }
    this.equipItemInSlot = function equipItemInSlot(item, newSlotIndex, currentSlotIndex) {
        var equippable = false;
        switch (newSlotIndex) {
            case 0: if (item.type == ItemType.HELM) { equippable = true; } break;
            case 1: if (item.type == ItemType.SHOULDERS) { equippable = true; } break;
            case 2: if (item.type == ItemType.CHEST) { equippable = true; } break;
            case 3: if (item.type == ItemType.LEGS) { equippable = true; } break;
            case 4: if (item.type == ItemType.WEAPON) { equippable = true; } break;
            case 5: if (item.type == ItemType.GLOVES) { equippable = true; } break;
            case 6: if (item.type == ItemType.BOOTS) { equippable = true; } break;
            case 7: if (item.type == ItemType.TRINKET) { equippable = true; } break;
            case 8: if (item.type == ItemType.TRINKET) { equippable = true; } break;
            case 9: if (item.type == ItemType.OFF_HAND) { equippable = true; } break;
        }
        if (equippable) {
            if (this.slots[newSlotIndex] == null) {
                this.slots[newSlotIndex] = item;
                legacyGame.inventory.removeItem(currentSlotIndex);
                legacyGame.player.gainItemsStats(item);
            }
            else {
                var savedItem = this.slots[newSlotIndex];
                this.slots[newSlotIndex] = item;
                legacyGame.player.gainItemsStats(item);
                legacyGame.inventory.addItemToSlot(savedItem, currentSlotIndex);
                legacyGame.player.loseItemsStats(savedItem);
            }
        }
    }
    this.removeItem = function removeItem(index) {
        legacyGame.player.loseItemsStats(this.slots[index]);
        this.slots[index] = null;
    }
    this.unequipItem = function unequipItem(slot) {
        var newSlot = -1;
        for (var x = 0; x < legacyGame.inventory.slots.length; x++) {
            if (legacyGame.inventory.slots[x] == null) {
                newSlot = x;
                break;
            }
        }
        if (newSlot != -1) {
            legacyGame.inventory.addItemToSlot(this.slots[slot], newSlot);
            this.removeItem(slot);
        }
    }
    this.unequipItemToSlot = function unequipItemToSlot(currentSlotIndex, newSlotIndex) {
        var inventorySlotItem = legacyGame.inventory.slots[newSlotIndex];
        if (inventorySlotItem == null) {
            legacyGame.inventory.addItemToSlot(this.slots[currentSlotIndex], newSlotIndex);
            this.removeItem(currentSlotIndex);
        }
        else if (this.slots[currentSlotIndex].type == inventorySlotItem.type) {
            var savedItem = this.slots[currentSlotIndex];
            this.slots[currentSlotIndex] = inventorySlotItem;
            legacyGame.player.gainItemsStats(inventorySlotItem);
            legacyGame.inventory.addItemToSlot(savedItem, newSlotIndex);
            legacyGame.player.loseItemsStats(savedItem);
        }
    }
    this.swapTrinkets = function swapTrinkets() {
        var savedItem = this.slots[7];
        this.slots[7] = this.slots[8];
        this.slots[8] = savedItem;
    }
    this.save = function save() {
        localStorage.equipmentSaved = true;
        localStorage.equipmentSlots = JSON.stringify(this.slots);
    }
    this.load = function load() {
        if (localStorage.equipmentSaved != null) {
            this.slots = JSON.parse(localStorage.equipmentSlots);
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
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                     INVENTORY                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
function Inventory() {
    this.slots = new Array();
    this.maxSlots = 25;
    for (var x = 0; x < this.maxSlots; x++) {
        this.slots[x] = null;
    }
    this.lootItem = function lootItem(item) {
        for (var x = 0; x < this.maxSlots; x++) {
            if (this.slots[x] == null) {
                this.slots[x] = item;
                legacyGame.stats.itemsLooted++;
                break;
            }
        }
    }
    this.swapItems = function swapItems(index1, index2) {
        var savedItem = this.slots[index1];
        this.slots[index1] = this.slots[index2];
        this.slots[index2] = savedItem;
    }
    this.removeItem = function removeItem(index) {
        this.slots[index] = null;
    }
    this.addItemToSlot = function addItemToSlot(item, index) {
        this.slots[index] = item;
    }
    this.sellItem = function sellItem(slot) {
        if (this.slots[slot] != null) {
            var value = this.slots[slot].sellValue;
            legacyGame.player.gold += value;
            this.removeItem(slot);
            legacyGame.stats.itemsSold++;
            legacyGame.stats.goldFromItems += value;
        }
    }
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
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      QUESTS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
QuestType = new Object();
QuestType.KILL = "KILL";
QuestType.MERCENARIES = "MERCENARIES";
QuestType.UPGRADE = "UPGRADE";
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
    this.displayId = legacyGame.questsManager.quests.length + 1;
    this.update = function update() {
        switch (this.type) {
            case QuestType.KILL:
                if (this.killCount >= this.typeAmount) {
                    this.complete = true;
                }
                break;
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
function QuestsManager() {
    this.quests = new Array();
    this.selectedQuest = 0;
    this.questsButtonGlowing = false;
    this.addQuest = function addQuest(quest) {
        this.quests.push(quest);
        legacyGame.displayAlert("New quest received!");
        this.glowQuestsButton();
        var newDiv = document.createElement('div');
        newDiv.id = 'questName' + quest.displayId;
        newDiv.className = 'questName';
        var id = quest.displayId - 1;
        newDiv.onmousedown = function () { questNameClick(id); }
        newDiv.innerHTML = quest.name;
        var container = document.getElementById("questNamesArea");
        container.appendChild(newDiv);
        $("#questNamesArea").show();
        $("#questTextArea").show();
    }
    this.update = function update() {
        for (var x = this.quests.length - 1; x >= 0; x--) {
            this.quests[x].update();
            if (this.quests[x].complete) {
                this.quests[x].grantReward();
                this.removeQuest(x);
                legacyGame.stats.questsCompleted++;
            }
        }
    }
    this.stopGlowingQuestsButton = function stopGlowingQuestsButton() {
        this.questsButtonGlowing = false;
        $("#questsWindowButtonGlow").stop(true);
        $("#questsWindowButtonGlow").css('opacity', 0);
        $("#questsWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 78px 195px');
    }
    this.glowQuestsButton = function glowQuestsButton() {
        this.questsButtonGlowing = true;
        $("#questsWindowButtonGlow").animate({ opacity:'+=0.5' }, 400);
        $("#questsWindowButtonGlow").animate({ opacity:'-=0.5' }, 400, function() { glowQuestsButton(); });
    }
    this.updateKillCounts = function updateKillCounts(level) {
        for (var x = 0; x < this.quests.length; x++) {
            if (this.quests[x].type == QuestType.KILL && this.quests[x].typeId == level) {
                this.quests[x].killCount++;
            }
        }
    }
    this.removeQuest = function removeQuest(id) {
        this.quests.splice(id, 1);
        var displayId = id + 1;
        for (var x = id; x < this.quests.length; x++) {
            this.quests[x].displayId--;
            var element = document.getElementById("questName" + (x + 1));
            element.innerHTML = this.quests[x].name;
        }
        currentElement = document.getElementById('questName' + (this.quests.length + 1));
        currentElement.parentNode.removeChild(currentElement);
        if (this.selectedQuest == id) {
            this.selectedQuest = 0;
            $("#questTextArea").hide();
        }
    }
    this.getSelectedQuest = function getSelectedQuest() {
        if (this.quests.length >= 0) {
            return this.quests[this.selectedQuest];
        }
        else { return null; }
    }
    this.save = function save() {
        localStorage.questsManagerSaved = true;
        var questNames = new Array();
        var questDescriptions = new Array();
        var questTypes = new Array();
        var questTypeIds = new Array();
        var questTypeAmounts = new Array();
        var questGoldRewards = new Array();
        var questExpRewards = new Array();
        var questBuffRewards = new Array();
        for (var x = 0; x < this.quests.length; x++) {
            questNames.push(this.quests[x].name);
            questDescriptions.push(this.quests[x].description);
            questTypes.push(this.quests[x].type);
            questTypeIds.push(this.quests[x].typeId);
            questTypeAmounts.push(this.quests[x].typeAmount);
            questGoldRewards.push(this.quests[x].goldReward);
            questExpRewards.push(this.quests[x].expReward);
            questBuffRewards.push(this.quests[x].buffReward);
        }
        localStorage.setItem("questNames", JSON.stringify(questNames));
        localStorage.setItem("questDescriptions", JSON.stringify(questDescriptions));
        localStorage.setItem("questTypes", JSON.stringify(questTypes));
        localStorage.setItem("questTypeIds", JSON.stringify(questTypeIds));
        localStorage.setItem("questTypeAmounts", JSON.stringify(questTypeAmounts));
        localStorage.setItem("questGoldRewards", JSON.stringify(questGoldRewards));
        localStorage.setItem("questExpRewards", JSON.stringify(questExpRewards));
        localStorage.setItem("questBuffRewards", JSON.stringify(questBuffRewards));
    }
    this.load = function load() {
        if (localStorage.questsManagerSaved != null) {
            var questNames = JSON.parse(localStorage.getItem("questNames"));
            var questDescriptions = JSON.parse(localStorage.getItem("questDescriptions"));
            var questTypes = JSON.parse(localStorage.getItem("questTypes"));
            var questTypeIds = JSON.parse(localStorage.getItem("questTypeIds"));
            var questTypeAmounts = JSON.parse(localStorage.getItem("questTypeAmounts"));
            var questGoldRewards = JSON.parse(localStorage.getItem("questGoldRewards"));
            var questExpRewards = JSON.parse(localStorage.getItem("questExpRewards"));
            var questBuffRewards = JSON.parse(localStorage.getItem("questBuffRewards"));
            if (questBuffRewards == null) {
                for (var x = 0; x < questNames.length; x++) {
                    this.addQuest(new Quest(questNames[x], questDescriptions[x], questTypes[x], questTypeIds[x], questTypeAmounts[x], questGoldRewards[x], questExpRewards[x], null));
                }
            }
            else {
                for (var x = 0; x < questNames.length; x++) {
                    this.addQuest(new Quest(questNames[x], questDescriptions[x], questTypes[x], questTypeIds[x], questTypeAmounts[x], questGoldRewards[x], questExpRewards[x], null));
                }
            }
        }
    }
}
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                       BUFFS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
BuffType = new Object();
BuffType.DAMAGE = "DAMAGE";
BuffType.GOLD = "GOLD";
BuffType.EXPERIENCE = "EXPERIENCE";
function Buff(name, type, multiplier, duration, leftPos, topPos) {
    this.id = null;
    this.name = name;
    this.type = type;
    this.multiplier = multiplier;
    this.currentDuration = duration * 1000;
    this.maxDuration = duration * 1000;
    this.leftPos = leftPos;
    this.topPos = topPos;
}
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
        for (var x = this.buffs.length - 1; x >= 0; x--) {
            this.buffs[x].currentDuration -= ms;
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
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      EVENTS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
EventType = new Object();
EventType.QUEST = "QUEST";
EventType.amount = 1;
QuestNamePrefixes = new Array("Clearing", "Reaping", "Destroying", "Removing", "Obliterating");
QuestNameSuffixes = new Array("Threat", "Swarm", "Horde", "Pillagers", "Ravagers");
function Event(id) {
    this.id = id;
    this.type = null;
    this.quest = null;
    this.velY = 0;
}
function EventManager() {
    this.eventSpawnTime = 3600000;
    this.eventSpawnTimeRemaining = this.eventSpawnTime;
    this.events = new Array();
    this.addRandomEvent = function addRandomEvent(level) {
        var event = new Event(this.events.length + 1);
        event.type = EventType.QUEST;
        var name = QuestNamePrefixes[Math.floor(Math.random() * 5)] + ' the ' + QuestNameSuffixes[Math.floor(Math.random() * 5)];
        var amount = Math.floor(Math.random() * 6) + 7;
        event.quest = new Quest(name, ("Kill " + amount + " level " + level + " monsters."), QuestType.KILL, level, amount, (level * 10), (level * 10), legacyGame.player.buffs.getRandomQuestRewardBuff());
        this.events.push(event);
        var newDiv = document.createElement('div');
        newDiv.id = 'eventButton' + event.id;
        newDiv.className = 'eventButton button';
        newDiv.onmousedown = function () { clickEventButton(newDiv, event.id); }
        var container = document.getElementById("eventsArea");
        container.appendChild(newDiv);
    }
    this.update = function update(ms) {
        this.eventSpawnTimeRemaining -= ms;
        if (this.eventSpawnTimeRemaining <= 0) {
            this.eventSpawnTimeRemaining = this.eventSpawnTime;
            this.addRandomEvent(legacyGame.player.level);
        }
        var elements = document.getElementsByClassName('eventButton');
        for (var x = 0; x < this.events.length; x++) {
            var element = elements[x]
            var parent = element.parentNode;
            var bottom = parent.clientHeight - element.offsetTop - element.clientHeight;
            var minBottom = x * 25;
            var newBottom = bottom - (this.events[x].velY * (ms / 1000));
            if (newBottom < minBottom) { newBottom = minBottom; this.events[x].velY = 0; }
            element.style.bottom = newBottom + 'px';
            this.events[x].velY += 10;
        }
    }
    this.startEvent = function startEvent(obj, id) {
        obj.parentNode.removeChild(obj);
        legacyGame.questsManager.addQuest(this.events[id - 1].quest);
        this.events.splice(id - 1, 1);
        for (var x = id - 1; x < this.events.length; x++) {
            this.events[x].id--;
        }
    }
}
function clickEventButton(obj, id) {
    legacyGame.eventManager.startEvent(obj, id);
}
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                       STATS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
function Stats() {
    this.getGold = function getGold() { return legacyGame.player.gold; }
    this.goldEarned = 0;
    this.startDate = new Date();
    this.getMercenariesOwned = function getMercenariesOwned() { return legacyGame.mercenaryManager.mercenaries.length; }
    this.getGps = function getGps() { return legacyGame.mercenaryManager.getGps(); }
    this.goldFromMonsters = 0;
    this.goldFromMercenaries = 0;
    this.goldFromQuests = 0;
    this.getExperience = function getExperience() { return legacyGame.player.experience; }
    this.experienceEarned = 0;
    this.experienceFromMonsters = 0;
    this.experienceFromQuests = 0;
    this.itemsLooted = 0;
    this.itemsSold = 0;
    this.goldFromItems = 0;
    this.questsCompleted = 0;
    this.monstersKilled = 0;
    this.damageDealt = 0;
    this.damageTaken = 0;
    this.getUpgradesUnlocked = function getUpgradesUnlocked() {
        var unlocked = 0;
        for(var i = 0; i < legacyGame.upgradeManager.upgrades.length; i++) {
            if(legacyGame.upgradeManager.upgrades[i].purchased === true) {
                unlocked++;
            }
        }
        return unlocked;
    }
    this.update = function update() {
        document.getElementById("statsWindowPowerShardsValue").innerHTML = legacyGame.player.powerShards.formatMoney(2);
        document.getElementById("statsWindowGoldValue").innerHTML = this.getGold().formatMoney(2);
        document.getElementById("statsWindowGoldEarnedValue").innerHTML = this.goldEarned.formatMoney(2);
        document.getElementById("statsWindowStartDateValue").innerHTML = this.startDate.toDateString() + " " + this.startDate.toLocaleTimeString();
        document.getElementById("statsWindowMercenariesOwnedValue").innerHTML = this.getMercenariesOwned().formatMoney(0);
        document.getElementById("statsWindowGpsValue").innerHTML = this.getGps();
        document.getElementById("statsWindowGoldFromMonstersValue").innerHTML = this.goldFromMonsters.formatMoney(2);
        document.getElementById("statsWindowGoldFromMercenariesValue").innerHTML = this.goldFromMercenaries.formatMoney(2);
        document.getElementById("statsWindowGoldFromQuestsValue").innerHTML = this.goldFromQuests.formatMoney(0);
        document.getElementById("statsWindowUpgradesUnlockedValue").innerHTML = this.getUpgradesUnlocked().formatMoney(0);
        document.getElementById("statsWindowExperienceValue").innerHTML = this.getExperience().formatMoney(2);
        document.getElementById("statsWindowExperienceEarnedValue").innerHTML = this.experienceEarned.formatMoney(2);
        document.getElementById("statsWindowExperienceFromMonstersValue").innerHTML = this.experienceFromMonsters.formatMoney(2);
        document.getElementById("statsWindowExperienceFromQuestsValue").innerHTML = this.experienceFromQuests.formatMoney(0);
        document.getElementById("statsWindowItemsLootedValue").innerHTML = this.itemsLooted.formatMoney(0);
        document.getElementById("statsWindowItemsSoldValue").innerHTML = this.itemsSold.formatMoney(0);
        document.getElementById("statsWindowGoldFromItemsValue").innerHTML = this.goldFromItems.formatMoney(0);
        document.getElementById("statsWindowQuestsCompletedValue").innerHTML = this.questsCompleted.formatMoney(0);
        document.getElementById("statsWindowMonstersKilledValue").innerHTML = this.monstersKilled.formatMoney(0);
        document.getElementById("statsWindowDamageDealtValue").innerHTML = (Math.floor(this.damageDealt)).formatMoney(0);
        document.getElementById("statsWindowDamageTakenValue").innerHTML = (Math.floor(this.damageTaken)).formatMoney(0);
    }
    this.save = function save() {
        localStorage.StatsSaved = true;
        localStorage.statsGoldEarned = this.goldEarned;
        localStorage.statsStartDate = this.startDate;
        localStorage.statsGoldFromMonsters = this.goldFromMonsters;
        localStorage.statsGoldFromMercenaries = this.goldFromMercenaries;
        localStorage.statsGoldFromQuests = this.goldFromQuests;
        localStorage.statsExperienceEarned = this.experienceEarned;
        localStorage.statsExperienceFromMonsters = this.experienceFromMonsters;
        localStorage.statsExperienceFromQuests = this.experienceFromQuests;
        localStorage.statsItemsLooted = this.itemsLooted;
        localStorage.statsItemsSold = this.itemsSold;
        localStorage.statsGoldFromItems = this.goldFromItems;
        localStorage.statsQuestsCompleted = this.questsCompleted;
        localStorage.statsMonstersKilled = this.monstersKilled;
        localStorage.statsDamageDealt = this.damageDealt;
        localStorage.statsDamageTaken = this.damageTaken;
    }
    this.load = function load() {
        if (localStorage.StatsSaved != null) {
            this.goldEarned = parseFloat(localStorage.statsGoldEarned);
            this.startDate = new Date(localStorage.statsStartDate);
            this.goldFromMonsters = parseFloat(localStorage.statsGoldFromMonsters);
            this.goldFromMercenaries = parseFloat(localStorage.statsGoldFromMercenaries);
            this.goldFromQuests = parseInt(localStorage.statsGoldFromQuests);
            this.experienceEarned = parseFloat(localStorage.statsExperienceEarned);
            this.experienceFromMonsters = parseFloat(localStorage.statsExperienceFromMonsters);
            this.experienceFromQuests = parseInt(localStorage.statsExperienceFromQuests);
            this.itemsLooted = parseInt(localStorage.statsItemsLooted);
            this.itemsSold = parseInt(localStorage.statsItemsSold);
            this.goldFromItems = parseInt(localStorage.statsGoldFromItems);
            this.questsCompleted = parseInt(localStorage.statsQuestsCompleted);
            this.monstersKilled = parseInt(localStorage.statsMonstersKilled);
            this.damageDealt = parseFloat(localStorage.statsDamageDealt);
            this.damageTaken = parseFloat(localStorage.statsDamageTaken);
        }
    }
}
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      MONSTER                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
MonsterRarity = new Object();
MonsterRarity.COMMON = "COMMON";
MonsterRarity.RARE = "RARE";
MonsterRarity.ELITE = "ELITE";
MonsterRarity.BOSS = "BOSS";
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
    this.addDebuff = function addDebuff(type, damage, duration) {
        switch (type) {
            case DebuffType.BLEED:
                if (this.debuffs.bleeding == false) {
                    $("#monsterBleedingIcon").show();
                    var left = this.debuffIconLeftPositionBase;
                    if (this.debuffs.burning) { left += this.debuffLeftPositionIncrement; }
                    if (this.debuffs.chilled) { left += this.debuffLeftPositionIncrement; }
                    $("#monsterBleedingIcon").css('left', left + 'px');
                }
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
                if (this.debuffs.burning == false) {
                    $("#monsterBurningIcon").show();
                    var left = this.debuffIconLeftPositionBase;
                    if (this.debuffs.bleeding) { left += this.debuffLeftPositionIncrement; }
                    if (this.debuffs.chilled) { left += this.debuffLeftPositionIncrement; }
                    $("#monsterBurningIcon").css('left', left + 'px');
                }
                this.debuffs.burning = true;
                this.debuffs.burningDamage = damage;
                this.debuffs.burningDuration = 0;
                this.debuffs.burningMaxDuration = duration;
                var effects = legacyGame.player.getEffectsOfType(EffectType.COMBUSTION);
                var maxStacks = 0;
                if (effects.length > 0) {
                    for (var x = 0; x < effects.length; x++) {
                        maxStacks += effects[x].value;
                    }
                }
                if (maxStacks > this.debuffs.burningStacks) {
                    this.debuffs.burningStacks++;
                }
                if (this.debuffs.burningStacks == 0) { this.debuffs.burningStacks = 1; }
                document.getElementById("monsterBurningStacks").innerHTML = this.debuffs.burningStacks;
                break;
            case DebuffType.CHILL:
                if (this.debuffs.chilled == false) {
                    $("#monsterChilledIcon").show();
                    var left = this.debuffIconLeftPositionBase;
                    if (this.debuffs.bleeding) { left += this.debuffLeftPositionIncrement; }
                    if (this.debuffs.burning) { left += this.debuffLeftPositionIncrement; }
                    $("#monsterChilledIcon").css('left', left + 'px');
                }
                this.debuffs.chilled = true;
                this.debuffs.chillDuration = 0;
                this.debuffs.chillMaxDuration = duration;
                break;
        }
    }
    this.updateDebuffs = function updateDebuffs() {
        if (this.debuffs.bleeding) {
            game.monsterTakeDamage(this.debuffs.bleedDamage * this.debuffs.bleedStacks, false, false);
            this.debuffs.bleedDuration++;
            if (this.debuffs.bleedDuration >= this.debuffs.bleedMaxDuration) {
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
        if (this.debuffs.burning) {
            game.monsterTakeDamage(this.debuffs.burningDamage * this.debuffs.burningStacks, false, false);
            this.debuffs.burningDuration++;
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
        if (this.debuffs.chilled) {
            if (this.canAttack) {
                this.canAttack = false;
            }
            else { this.canAttack = true; }
            this.debuffs.chillDuration++;
            if (this.debuffs.chillDuration >= this.debuffs.chillMaxDuration) {
                $("#monsterChilledIcon").hide();
                $("#monsterBleedingIcon").css('left', ($("#monsterBleedingIcon").position().left - this.debuffLeftPositionIncrement) + 'px');
                $("#monsterBurningIcon").css('left', ($("#monsterBurningIcon").position().left - this.debuffLeftPositionIncrement) + 'px');
                this.debuffs.chillDuration = 0;
                this.debuffs.chillMaxDuration = 0;
                this.debuffs.chilled = false;
            }
        }
        else { this.canAttack = true; }
    }
}
function Loot(gold, item) {
    this.gold = gold;
    this.item = item;
}
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                 MONSTER CREATOR                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
function MonsterCreator() {
    this.names = ["Zombie", "Skeleton", "Goblin", "Spider", "Troll", "Lizardman", "Ogre", "Orc"];
    this.monsterBaseHealth = 5;
    this.monsterBaseDamage = 0;
    this.monsterBaseGoldWorth = 1;
    this.monsterBaseExperienceWorth = 1;
    this.createRandomMonster = function createRandomMonster(level, rarity) {
        var name = this.names[Math.floor(Math.random() * this.names.length)];
        var health = this.calculateMonsterHealth(level, rarity);
        var damage = this.calculateMonsterDamage(level, rarity);
        var goldWorth = this.calculateMonsterGoldWorth(level, rarity);
        var experienceWorth = this.calculateMonsterExperienceWorth(level, rarity);
        return new Monster(name, level, rarity, health, damage, 0, goldWorth, experienceWorth);
    }
    this.calculateMonsterHealth = function calculateMonsterHealth(level, rarity) {
        var health = Sigma(level) * Math.pow(1.05, level) + this.monsterBaseHealth;
        health = Math.ceil(health);
        switch (rarity) {
            case "COMMON":
                break;
            case "RARE":
                health *= 3;
                break;
            case "ELITE":
                health *= 10;
                break;
            case "BOSS":
                health *= 30;
                break;
        }
        return health;
    }
    this.calculateMonsterDamage = function calculateMonsterDamage(level, rarity) {
        var damage = (Sigma(level) * Math.pow(1.01, level)) / 3 + this.monsterBaseDamage;
        damage = Math.ceil(damage);
        switch (rarity) {
            case "COMMON":
                break;
            case "RARE":
                damage *= 2;
                break;
            case "ELITE":
                damage *= 4;
                break;
            case "BOSS":
                damage *= 8;
                break;
        }
        return damage;
    }
    this.calculateMonsterGoldWorth = function calculateMonsterGoldWorth(level, rarity) {
        var goldWorth = (Sigma(level) * Math.pow(1.01, level)) / 4 + this.monsterBaseGoldWorth;
        goldWorth = Math.ceil(goldWorth);
        switch (rarity) {
            case "COMMON":
                break;
            case "RARE":
                goldWorth *= 1.5;
                break;
            case "ELITE":
                goldWorth *= 3;
                break;
            case "BOSS":
                goldWorth *= 6;
                break;
        }
        return goldWorth;
    }
    this.calculateMonsterExperienceWorth = function calculateMonsterExperienceWorth(level, rarity) {
        var experienceWorth = (Sigma(level) * Math.pow(1.01, level)) / 5 + this.monsterBaseExperienceWorth;
        experienceWorth = Math.ceil(experienceWorth);
        switch (rarity) {
            case "COMMON":
                break;
            case "RARE":
                experienceWorth *= 1.5;
                break;
            case "ELITE":
                experienceWorth *= 3;
                break;
            case "BOSS":
                experienceWorth *= 6;
                break;
        }
        return experienceWorth;
    }
    this.calculateMonsterRarity = function calculateMonsterRarity(battleLevel, battleDepth) {
        var rareChance = 0.001 + (battleLevel / 500);
        if (rareChance > 0.1) { rareChance = 0.1; }
        var eliteChance = 0;
        if (battleLevel >= 10) {
            eliteChance = 0.03 + (battleLevel / 12000);
            if (eliteChance > 0.05) { eliteChance = 0.05; }
        }
        var bossChance = 0;
        if (battleLevel >= 30) {
            bossChance = 0.03 + (battleLevel / 24000);
            if (bossChance > 0.01) { bossChance = 0.01; }
        }
        rareChance += eliteChance + bossChance;
        eliteChance += bossChance;
        var rand = Math.random();
        if (rand <= bossChance) {
            return MonsterRarity.BOSS;
        }
        else if (rand <= eliteChance) {
            return MonsterRarity.ELITE;
        }
        else if (rand <= rareChance) {
            return MonsterRarity.RARE;
        }
        else return MonsterRarity.COMMON;
    }
    this.getRarityColour = function getRarityColour(rarity) {
        switch (rarity) {
            case MonsterRarity.COMMON: return '#ffffff'; break;
            case MonsterRarity.RARE: return '#00fff0'; break;
            case MonsterRarity.ELITE: return '#ffd800'; break;
            case MonsterRarity.BOSS: return '#ff0000'; break;
        }
    }
}
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                      OPTIONS                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
function Options() {
    this.displaySkullParticles = true;
    this.displayGoldParticles = true;
    this.displayExpParticles = true;
    this.displayPlayerDamageParticles = true;
    this.displayMonsterDamageParticles = true;
    this.alwaysDisplayPlayerHealth = false;
    this.alwaysDisplayMonsterHealth = false;
    this.alwaysDisplayExp = false;
    this.save = function save() {
        localStorage.optionsSaved = true;
        localStorage.displaySkullParticles = this.displaySkullParticles;
        localStorage.displayGoldParticles = this.displayGoldParticles;
        localStorage.displayExpParticles = this.displayExpParticles;
        localStorage.displayPlayerDamageParticles = this.displayPlayerDamageParticles;
        localStorage.displayMonsterDamageParticles = this.displayMonsterDamageParticles;
        localStorage.alwaysDisplayPlayerHealth = this.alwaysDisplayPlayerHealth;
        localStorage.alwaysDisplayMonsterHealth = this.alwaysDisplayMonsterHealth;
        localStorage.alwaysDisplayExp = this.alwaysDisplayExp;
    }
    this.load = function load() {
        if (localStorage.optionsSaved != null) {
            this.displaySkullParticles = JSON.parse(localStorage.displaySkullParticles);
            this.displayGoldParticles = JSON.parse(localStorage.displayGoldParticles);
            this.displayExpParticles = JSON.parse(localStorage.displayExpParticles);
            this.displayPlayerDamageParticles = JSON.parse(localStorage.displayPlayerDamageParticles);
            this.displayMonsterDamageParticles = JSON.parse(localStorage.displayMonsterDamageParticles);
            this.alwaysDisplayPlayerHealth = JSON.parse(localStorage.alwaysDisplayPlayerHealth);
            this.alwaysDisplayMonsterHealth = JSON.parse(localStorage.alwaysDisplayMonsterHealth);
            this.alwaysDisplayExp = JSON.parse(localStorage.alwaysDisplayExp);
            if (!this.displaySkullParticles) { document.getElementById("skullParticlesOption").innerHTML = "Monster death particles: OFF"; }
            if (!this.displayGoldParticles) { document.getElementById("goldParticlesOption").innerHTML = "Gold particles: OFF"; }
            if (!this.displayExpParticles) { document.getElementById("experienceParticlesOption").innerHTML = "Experience particles: OFF"; }
            if (!this.displayPlayerDamageParticles) { document.getElementById("playerDamageParticlesOption").innerHTML = "Player damage particles: OFF"; }
            if (!this.displayMonsterDamageParticles) { document.getElementById("monsterDamageParticlesOption").innerHTML = "Monster damage particles: OFF"; }
            if (this.alwaysDisplayPlayerHealth) {
                document.getElementById("playerHealthOption").innerHTML = "Always display player health: ON";
            }
            if (this.alwaysDisplayMonsterHealth) {
                document.getElementById("monsterHealthOption").innerHTML = "Always display monster health: ON";
                legacyGame.displayMonsterHealth = true;
            }
            if (this.alwaysDisplayExp) {
                document.getElementById("expBarOption").innerHTML = "Always display experience: ON";
            }
        }
    }
}
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
function Particle(image, text, textColour, x, y, width, height, velocityX, velocityY, duration) {
    this.image = image;
    this.text = text;
    this.textColour = textColour;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.duration = duration;
    this.maxDuration = duration;
    this.update = function update(ms) {
        this.duration -= ms;
        var velX = (this.velocityX * (ms / 1000));
        var velY = (this.velocityY * (ms / 1000));
        this.x += velX;
        this.y += velY;
    }
    this.draw = function draw() {
        var canvas = document.getElementById("particleCanvas");
        var context = canvas.getContext("2d");
        if (this.duration <= this.maxDuration / 5) {
            var newAlpha = this.duration / (this.maxDuration / 5);
            if (newAlpha < 0) { newAlpha = 0; }
            context.globalAlpha = newAlpha;
        }
        if (this.image != null) {
            context.drawImage(this.image, this.x, this.y, 25, 25);
        }
        if (this.text != null) {
            context.shadowColor = "black";
            context.lineWidth = 3;
            context.strokeText(this.text, this.x + 12, this.y + 19);
            context.fillStyle = this.textColour;
            context.fillText(this.text, this.x + 12, this.y + 19);
        }
        context.globalAlpha = 1;
    }
    this.expired = function expired() {
        return this.duration <= 0;
    }
}
function ParticleManager() {
    this.maxParticles = 50;
    this.particles = new Array();
    this.particleSources = new Object();
    this.particleSources.SKULL = "includes/images/skull.png";
    this.particleSources.GOLD = "includes/images/goldCoin.png";
    this.particleSources.EXP_ORB = "includes/images/expOrb.png";
    this.particleSources.PLAYER_DAMAGE = "includes/images/sword.png";
    this.particleSources.PLAYER_CRITICAL = "includes/images/sword.png";
    this.initialize = function initialize() {
        var canvas = document.getElementById("particleCanvas");
        var context = canvas.getContext("2d");
        context.font = "20px Gentium Book Basic";
        context.textAlign = 'center';
    }
    this.createParticle = function createParticle(text, imageType) {
        switch (imageType) {
            case ParticleType.SKULL: if (legacyGame.options.displaySkullParticles == false) { return; } break;
            case ParticleType.GOLD: if (legacyGame.options.displayGoldParticles == false) { return; } break;
            case ParticleType.EXP_ORB: if (legacyGame.options.displayExpParticles == false) { return; } break;
            case ParticleType.PLAYER_DAMAGE: if (legacyGame.options.displayPlayerDamageParticles == false) { return; } break;
            case ParticleType.PLAYER_CRITICAL: if (legacyGame.options.displayPlayerDamageParticles == false) { return; } break;
            case ParticleType.MONSTER_DAMAGE: if (legacyGame.options.displayMonsterDamageParticles == false) { return; } break;
        }
        var left = Math.random() * 325 + 175;
        var top = Math.random() * 425 + 100;
        var textColour;
        var source = null;
        switch (imageType) {
            case ParticleType.SKULL: source = this.particleSources.SKULL; break;
            case ParticleType.GOLD: textColour = '#fcd200'; source = this.particleSources.GOLD; break;
            case ParticleType.EXP_ORB: textColour = '#00ff00'; source = this.particleSources.EXP_ORB; break;
            case ParticleType.PLAYER_DAMAGE: textColour = '#ffffff'; source = this.particleSources.PLAYER_DAMAGE; break;
            case ParticleType.PLAYER_CRITICAL: textColour = '#fcff00'; source = this.particleSources.PLAYER_CRITICAL; break;
            case ParticleType.MONSTER_DAMAGE: textColour = '#ff0000'; source = this.particleSources.MONSTER_DAMAGE; break;
        }
        var finalText = null;
        if (text != null) {
            finalText = '';
            if (imageType == ParticleType.GOLD || imageType == ParticleType.EXP_ORB) {
                finalText += '+';
            }
            else if (imageType == ParticleType.MONSTER_DAMAGE) {
                finalText += '-';
            }
            finalText += text;
            if (imageType == ParticleType.PLAYER_CRITICAL) {
                finalText += '!';
            }
        }
        var image = null;
        if (source != null) {
            var image = new Image();
            image.src = source;
        }
        var canvas = document.getElementById("particleCanvas");
        var context = canvas.getContext("2d");
        var particle = new Particle(image, finalText, textColour, left, top, 25, 25, 0, -50, 2000);
        this.particles.push(particle);
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, 1);
        }
    }
    this.update = function update(ms) {
        var canvas = document.getElementById("particleCanvas");
        var context = canvas.getContext("2d");
        var image;
        var p;
        context.clearRect(0, 0, 675, 550);
        for (var x = this.particles.length - 1; x >= 0; x--) {
            p = this.particles[x];
            p.update(ms);
            p.draw();
            if (p.expired()) {
                this.particles.splice(x, 1);
            }
        }
    }
}
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
function NameGenerator() {
    var rand;
    this.getRandomDamageBonusName = function getRandomDamageBonusName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return DamageNames[rand];
    }
    this.getRandomHealthName = function getRandomHealthName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return HealthNames[rand];
    }
    this.getRandomArmourBonusName = function getRandomArmourBonusName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return ArmourNames[rand];
    }
    this.getRandomCritChanceName = function getRandomCritChanceName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return CritChanceNames[rand];
    }
    this.getRandomItemRarityName = function getRandomItemRarityName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return ItemRarityNames[rand];
    }
    this.getRandomGoldGainName = function getRandomGoldGainName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return GoldGainNames[rand];
    }
    this.getRandomStrengthName = function getRandomStrengthName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return StrengthNames[rand];
    }
    this.getRandomAgilityName = function getRandomAgilityName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return AgilityNames[rand];
    }
    this.getRandomStaminaName = function getRandomStaminaName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return StaminaNames[rand];
    }
    this.getRandomHp5Name = function getRandomHp5Name() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return Hp5Names[rand];
    }
    this.getRandomCritDamageName = function getRandomCritDamageName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return CritDamageNames[rand];
    }
    this.getRandomExperienceGainName = function getRandomExperienceGainName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return ExperienceGainNames[rand];
    }
    this.getRandomEvasionName = function getRandomEvasionName() {
        rand = Math.random() * namesAmount;
        rand = Math.floor(rand);
        return EvasionNames[rand];
    }
}
function StatGenerator() {
    var rand;
    this.getRandomMinDamage = function getRandomMinDamage(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil(level * Math.pow(1.001, level)); break;
            case 1: return Math.ceil(((level * Math.pow(1.001, level)) + (level / 10) + 1)); break;
            case 2: return Math.ceil(((level * Math.pow(1.001, level)) + (level / 5) + 2)); break;
        }
    }
    this.getRandomMaxDamage = function getRandomMaxDamage(level, minDamage) {
        return (minDamage + this.getRandomDamageBonus(level));
    }
    this.getRandomDamageBonus = function getRandomDamageBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil((2 * level) * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }
    this.getRandomStrengthBonus = function getRandomStrengthBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil(level * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }
    this.getRandomAgilityBonus = function getRandomAgilityBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil(level * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }
    this.getRandomStaminaBonus = function getRandomStaminaBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil(level * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }
    this.getRandomHealthBonus = function getRandomHealthBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil((10 * level) * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil(((10 * level) * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil(((10 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }
    this.getRandomHp5Bonus = function getRandomHp5Bonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil((2 * level) * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }
    this.getRandomArmour = function getRandomArmour(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil(level * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }
    this.getRandomArmourBonus = function getRandomArmourBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil((level * Math.pow(1.001, level) * 0.75) / 5); break;
            case 1: return Math.ceil(((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1) / 4); break;
            case 2: return Math.ceil(((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) / 3); break;
        }
    }
    this.getRandomCritChanceBonus = function getRandomCritChanceBonus(level) {
        var critChance = 0;
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: critChance = parseFloat((((((0.3 * level) * Math.pow(1.001, level) * 0.75) + 0.00001) * 100) / 100).toFixed(2)); break;
            case 1: critChance = parseFloat((((((0.3 * level) * Math.pow(1.001, level) * 0.8) + 0.00001) * 100) / 100).toFixed(2)); break;
            case 2: critChance = parseFloat((((((0.3 * level) * Math.pow(1.001, level) * 0.85) + 0.00001) * 100) / 100).toFixed(2)); break;
        }
        if (critChance > 10) {
            critChance = 10;
        }
        return critChance;
    }
    this.getRandomCritDamageBonus = function getRandomCritDamageBonus(level) {
        rand = Math.floor(Math.random() * 3);
        switch (rand) {
            case 0: return parseFloat((((((0.2 * level) * Math.pow(1.001, level) * 0.75) + 0.00001) * 100) / 100).toFixed(2)); break;
            case 1: return parseFloat((((((0.2 * level) * Math.pow(1.001, level) * 0.8) + 0.00001) * 100) / 100).toFixed(2)); break;
            case 2: return parseFloat((((((0.2 * level) * Math.pow(1.001, level) * 0.85) + 0.00001) * 100) / 100).toFixed(2)); break;
        }
    }
    this.getRandomItemRarityBonus = function getRandomItemRarityBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return parseFloat((level * Math.pow(1.001, level) * 0.75).toFixed(2)); break;
            case 1: return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1).toFixed(2)); break;
            case 2: return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1).toFixed(2)); break;
        }
    }
    this.getRandomGoldGainBonus = function getRandomGoldGainBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return parseFloat((level * Math.pow(1.001, level) * 0.75).toFixed(2)); break;
            case 1: return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1).toFixed(2)); break;
            case 2: return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1).toFixed(2)); break;
        }
    }
    this.getRandomExperienceGainBonus = function getRandomExperienceGainBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return parseFloat((level * Math.pow(1.001, level) * 0.75).toFixed(2)); break;
            case 1: return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1).toFixed(2)); break;
            case 2: return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1).toFixed(2)); break;
        }
    }
    this.getRandomEvasionBonus = function getRandomEvasionBonus(level) {
        rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0: return Math.ceil(level * Math.pow(1.001, level) * 0.75); break;
            case 1: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1); break;
            case 2: return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); break;
        }
    }
}
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
function Effect(type, chance, value) {
    this.type = type;
    this.chance = chance;
    this.value = value;
    this.getDescription = function getDescription() {
        switch (this.type) {
            case EffectType.CRUSHING_BLOWS: 
                return "Crushing Blows: Your attack deal " + this.value + "% of your opponent's current health in damage"; 
                break;
            case EffectType.COMBUSTION: 
                return "Combustion: The debuff from Fire Blade can stack up to " + this.value + " more times"; 
                break;
            case EffectType.RUPTURE: 
                return "Rupture: Your attacks apply an additional stack of Rend. Also increases the maximum stacks of Rend by " + this.value; 
                break;
            case EffectType.WOUNDING: 
                return "Wounding: Increases the level of your Rend ability by " + this.value; 
                break;
            case EffectType.CURING: 
                return "Curing: Increases the level of your Rejuvenating Strikes ability by " + this.value;  
                break;
            case EffectType.FROST_SHARDS: 
                return "Frost Shards: Increases the level of your Ice Blade ability by " + this.value; 
                break;
            case EffectType.FLAME_IMBUED: 
                return "Flame Imbued: Increases the level of your Fire Blade ability by " + this.value; 
                break;
            case EffectType.BARRIER: 
                return "Barrier: You reflect " + this.value + "% of the damage you receive"; 
                break;
            case EffectType.SWIFTNESS: 
                return "Swiftness: Your attacks have a " + this.chance + "% chance to generate an additional attack"; 
                break;
            case EffectType.PILLAGING: 
                return "Pillaging: Your attacks have a " + this.chance + "% chance to grant you " + this.value + " gold"; 
                break;
            case EffectType.NOURISHMENT: 
                return "Nourishment: Your attacks have a " + this.chance + "% chance to heal you for " + this.value + " health"; 
                break;
            case EffectType.BERSERKING: 
                return "Berserking: Your attacks have a " + this.chance + "% chance to deal " + this.value + " damage"; 
                break;
        }
    }
}
function ItemBonuses() {
    this.minDamage = 0;
    this.maxDamage = 0;
    this.damageBonus = 0;
    this.strength = 0;
    this.agility = 0
    this.stamina = 0;
    this.health = 0;
    this.hp5 = 0;
    this.armour = 0;
    this.armourBonus = 0;
    this.evasion = 0;
    this.critChance = 0;
    this.critDamage = 0;
    this.itemRarity = 0;
    this.goldGain = 0;
    this.experienceGain = 0;
    this.effects = new Array();
}
function Item(name, level, rarity, type, sellValue, iconSourceX, iconSourceY, itemBonuses) {
    this.name = name;
    this.level = level;
    this.rarity = rarity;
    this.type = type;
    this.sellValue = sellValue;
    this.iconSourceX = iconSourceX;
    this.iconSourceY = iconSourceY;
    this.minDamage = itemBonuses.minDamage;
    this.maxDamage = itemBonuses.maxDamage;
    this.damageBonus = itemBonuses.damageBonus;
    this.strength = itemBonuses.strength;
    this.agility = itemBonuses.agility;
    this.stamina = itemBonuses.stamina;
    this.health = itemBonuses.health;
    this.hp5 = itemBonuses.hp5;
    this.armour = itemBonuses.armour;
    this.armourBonus = itemBonuses.armourBonus;
    this.evasion = itemBonuses.evasion;
    this.critChance = itemBonuses.critChance;
    this.critDamage = itemBonuses.critDamage;
    this.itemRarity = itemBonuses.itemRarity;
    this.goldGain = itemBonuses.goldGain;
    this.experienceGain = itemBonuses.experienceGain;
    this.effects = itemBonuses.effects;
}
function ItemCreator() {
    this.getRandomItemRarity = function getRandomItemRarity(monsterRarity) {
        var rand = Math.random();
        switch (monsterRarity) {
            case MonsterRarity.COMMON:
                if (rand < 0.20) {
                    rand = Math.random();
                    if (rand < (0.00001 * ((legacyGame.player.getItemRarity() / 100) + 1))) { return ItemRarity.LEGENDARY; }
                    else if (rand < (0.0001 * ((legacyGame.player.getItemRarity() / 100) + 1))) { return ItemRarity.EPIC; }
                    else if (rand < (0.001 * ((legacyGame.player.getItemRarity() / 100) + 1))) { return ItemRarity.RARE; }
                    else if (rand < (0.01 * ((legacyGame.player.getItemRarity() / 100) + 1))) { return ItemRarity.UNCOMMON; }
                    else { return ItemRarity.COMMON; }
                }
                break;
            case MonsterRarity.RARE:
                if (rand < (0.0001 * ((legacyGame.player.getItemRarity() / 100) + 1))) { return ItemRarity.LEGENDARY; }
                else if (rand < (0.001 * ((legacyGame.player.getItemRarity() / 100) + 1))) { return ItemRarity.EPIC; }
                else if (rand < (0.01 * ((legacyGame.player.getItemRarity() / 100) + 1))) { return ItemRarity.RARE; }
                else { return ItemRarity.UNCOMMON; }
                break;
            case MonsterRarity.ELITE:
                if (rand < (0.001 * ((legacyGame.player.getItemRarity() / 100) + 1))) { return ItemRarity.LEGENDARY; }
                else if (rand < (0.01 * ((legacyGame.player.getItemRarity() / 100) + 1))) { return ItemRarity.EPIC; }
                else { return ItemRarity.RARE; }
                break;
            case MonsterRarity.BOSS:
                if (rand < (0.01 * ((legacyGame.player.getItemRarity() / 100) + 1))) { return ItemRarity.LEGENDARY; }
                else { return ItemRarity.EPIC; }
                break;
        }
    }
    this.createRandomItem = function createRandomItem(level, rarity) {
        if (rarity == null) {
            return null;
        }
        var rand = Math.floor(Math.random() * ItemType.count);
        var type;
        switch (rand) {
            case 0: type = ItemType.HELM; break;
            case 1: type = ItemType.SHOULDERS; break;
            case 2: type = ItemType.CHEST; break;
            case 3: type = ItemType.LEGS; break;
            case 4: type = ItemType.WEAPON; break;
            case 5: type = ItemType.GLOVES; break;
            case 6: type = ItemType.BOOTS; break;
            case 7: type = ItemType.TRINKET; break;
            case 8: type = ItemType.OFF_HAND; break;
        }
        var prefixAmount;
        var suffixAmount;
        switch (rarity) {
            case ItemRarity.COMMON: prefixAmount = 1; suffixAmount = 0; break;
            case ItemRarity.UNCOMMON: prefixAmount = 1; suffixAmount = 1; break;
            case ItemRarity.RARE: prefixAmount = 2; suffixAmount = 1; break;
            case ItemRarity.EPIC: prefixAmount = 2; suffixAmount = 2; break;
            case ItemRarity.LEGENDARY: prefixAmount = 3; suffixAmount = 3; break;
        }
        var itemBonuses = new ItemBonuses();
        var randBonus;
        var prefix = "";
        var suffix = "";
        var amount = prefixAmount;
        while (amount > 0) {
            randBonus = Math.floor(Math.random() * PREFIX_AMOUNT);
            var statGenerator = new StatGenerator();
            var nameGenerator = new NameGenerator();
            switch (randBonus) {
                case 0:
                    if (itemBonuses.damageBonus == 0 && type == ItemType.WEAPON) {
                        itemBonuses.damageBonus = statGenerator.getRandomDamageBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomDamageBonusName(); }
                        amount--;
                    }
                    break;
                case 1:
                    if (itemBonuses.health == 0) {
                        itemBonuses.health = statGenerator.getRandomHealthBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomHealthName(); }
                        amount--;
                    }
                    break;
                case 2:
                    if (itemBonuses.armourBonus == 0 && type != ItemType.WEAPON) {
                        itemBonuses.armourBonus = statGenerator.getRandomArmourBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomArmourBonusName(); }
                        amount--;
                    }
                    break;
                case 3:
                    if (itemBonuses.critChance == 0) {
                        itemBonuses.critChance = statGenerator.getRandomCritChanceBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomCritChanceName(); }
                        amount--;
                    }
                    break;
                case 4:
                    if (itemBonuses.itemRarity == 0) {
                        itemBonuses.itemRarity = statGenerator.getRandomItemRarityBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomItemRarityName(); }
                        amount--;
                    }
                    break;
                case 5:
                    if (itemBonuses.goldGain == 0) {
                        itemBonuses.goldGain = statGenerator.getRandomGoldGainBonus(level);
                        if (prefix == "") { prefix = nameGenerator.getRandomGoldGainName(); }
                        amount--;
                    }
                    break;
            }
        }
        amount = suffixAmount;
        while (amount > 0) {
            randBonus = Math.floor(Math.random() * SUFFIX_AMOUNT);
            switch (randBonus) {
                case 0:
                    if (itemBonuses.strength == 0) {
                        itemBonuses.strength = statGenerator.getRandomStrengthBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomStrengthName(); }
                        amount--;
                    }
                    break;
                case 1:
                    if (itemBonuses.agility == 0) {
                        itemBonuses.agility = statGenerator.getRandomAgilityBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomAgilityName(); }
                        amount--;
                    }
                    break;
                case 2:
                    if (itemBonuses.stamina == 0) {
                        itemBonuses.stamina = statGenerator.getRandomStaminaBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomStaminaName(); }
                        amount--;
                    }
                    break;
                case 3:
                    if (itemBonuses.hp5 == 0) {
                        itemBonuses.hp5 = statGenerator.getRandomHp5Bonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomHp5Name(); }
                        amount--;
                    }
                    break;
                case 4:
                    if (itemBonuses.critDamage == 0) {
                        itemBonuses.critDamage = statGenerator.getRandomCritDamageBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomCritDamageName(); }
                        amount--;
                    }
                    break;
                case 5:
                    if (itemBonuses.experienceGain == 0) {
                        itemBonuses.experienceGain = statGenerator.getRandomExperienceGainBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomExperienceGainName(); }
                        amount--;
                    }
                    break;
                case 6:
                    if (itemBonuses.evasion == 0) {
                        itemBonuses.evasion = statGenerator.getRandomEvasionBonus(level);
                        if (suffix == "") { suffix = nameGenerator.getRandomEvasionName(); }
                        amount--;
                    }
                    break;
            }
        }
        if (type == ItemType.WEAPON) {
            itemBonuses.minDamage = statGenerator.getRandomMinDamage(level);
            itemBonuses.maxDamage = statGenerator.getRandomMaxDamage(level, itemBonuses.minDamage);
            switch (rarity) {
                case ItemRarity.UNCOMMON: 
                    itemBonuses.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); 
                    itemBonuses.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1); 
                    break;
                case ItemRarity.RARE: 
                    itemBonuses.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 2; 
                    itemBonuses.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 2; 
                    break;
                case ItemRarity.EPIC: 
                    itemBonuses.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 3;
                    itemBonuses.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 3;  
                    break;
                case ItemRarity.LEGENDARY: 
                    itemBonuses.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 4; 
                    itemBonuses.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 4; 
                    break;
            }
        }
        else {
            itemBonuses.armour = statGenerator.getRandomArmour(level);
        }
        var name = prefix;
        switch (type) {
            case ItemType.HELM: name += " Helmet "; break;
            case ItemType.SHOULDERS: name += " Shoulders "; break;
            case ItemType.CHEST: name += " Chest "; break;
            case ItemType.LEGS: name += " Legs "; break;
            case ItemType.WEAPON: name += " Weapon "; break;
            case ItemType.GLOVES: name += " Gloves "; break;
            case ItemType.BOOTS: name += " Boots "; break;
            case ItemType.TRINKET: name += " Trinket "; break;
            case ItemType.OFF_HAND: name += " Shield "; break;
        }
        name += suffix;
        var iconSourceX = 0;
        var iconSourceY = 0;
        switch (type) {
            case ItemType.HELM: iconSourceX = 0; break;
            case ItemType.SHOULDERS: iconSourceX = 280; break;
            case ItemType.CHEST: iconSourceX = 245; break;
            case ItemType.LEGS: iconSourceX = 210; break;
            case ItemType.WEAPON: iconSourceX = 175; break;
            case ItemType.GLOVES: iconSourceX = 140; break;
            case ItemType.BOOTS: iconSourceX = 105; break;
            case ItemType.TRINKET: iconSourceX = 70; break;
            case ItemType.OFF_HAND: iconSourceX = 35; break;
        }
        switch (rarity) {
            case ItemRarity.UNCOMMON: iconSourceY = 140; break;
            case ItemRarity.RARE: iconSourceY = 105; break;
            case ItemRarity.EPIC: iconSourceY = 70; break;
            case ItemRarity.LEGENDARY: iconSourceY = 35; break;
        }
        var multiple = 0;
        switch (type) {
            case ItemType.HELM: multiple = 2.3; break;
            case ItemType.SHOULDERS: multiple = 2.5; break;
            case ItemType.CHEST: multiple = 3.3; break;
            case ItemType.LEGS: multiple = 3.1; break;
            case ItemType.WEAPON: multiple = 2.9; break;
            case ItemType.GLOVES: multiple = 2.1; break;
            case ItemType.BOOTS: multiple = 2.1; break;
            case ItemType.TRINKET: multiple = 2.9; break;
            case ItemType.OFF_HAND: multiple = 2.7; break;
        }
        var sellValue = Math.floor(level * multiple);
        var effects = new Array();
        var newEffect = null;
        var effectOwned = false;
        var effectsAmount = 0;
        switch (rarity) {
            case ItemRarity.EPIC: effectsAmount = Math.floor(Math.random() * 2); break;
            case ItemRarity.LEGENDARY: effectsAmount = Math.floor(Math.random() * 2) + 1; break;
        }
        while (effectsAmount > 0) {
            effectOwned = false;
            switch (type) {
                case ItemType.WEAPON:
                    switch (Math.floor(Math.random() * 3)) {
                        case 0: newEffect = new Effect(EffectType.CRUSHING_BLOWS, 100, 5); break;
                        case 1: newEffect = new Effect(EffectType.COMBUSTION, 100, 5); break;
                        case 2: newEffect = new Effect(EffectType.RUPTURE, 100, 5); break;
                    }
                    break;
                case ItemType.TRINKET:
                    switch (Math.floor(Math.random() * 4)) {
                        case 0: newEffect = new Effect(EffectType.SWIFTNESS, 10, 0); break;
                        case 1: newEffect = new Effect(EffectType.PILLAGING, 10, Math.floor(((Sigma(level) * Math.pow(1.01, level)) / 4 + 1) * 15)); break;
                        case 2: newEffect = new Effect(EffectType.NOURISHMENT, 10, Math.floor((10 * level) * Math.pow(1.001, level) * 0.75)); break;
                        case 3: newEffect = new Effect(EffectType.BERSERKING, 10, Math.floor((level) * Math.pow(1.001, level) * 3)); break;
                    }
                    break;
                default:
                    switch (Math.floor(Math.random() * 5)) {
                        case 0: newEffect = new Effect(EffectType.WOUNDING, 100, Math.ceil(level / 35)); break;
                        case 1: newEffect = new Effect(EffectType.CURING, 100, Math.ceil(level / 35)); break;
                        case 2: newEffect = new Effect(EffectType.FROST_SHARDS, 100, Math.ceil(level / 35)); break;
                        case 3: newEffect = new Effect(EffectType.FLAME_IMBUED, 100, Math.ceil(level / 35)); break;
                        case 4: newEffect = new Effect(EffectType.BARRIER, 100, Math.floor((Math.random() * 15) + 20)); break;
                    }
                    break;
            }
            for (var x = 0; x < effects.length; x++) {
                if (effects[x].type == newEffect.type) {
                    effectOwned = true;
                }
            }
            if (!effectOwned) {
                effects.push(newEffect);
                effectsAmount--;
            }
        }
        itemBonuses.effects = effects;
        var newItem = new Item(name, level, rarity, type, sellValue, iconSourceX, iconSourceY, itemBonuses);
        return newItem;
    }
}
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
function Upgrade(name, cost, type, requirementType, requirementAmount, description, iconSourceLeft, iconSourceTop) {
    this.name = name;
    this.cost = cost;
    this.type = type;
    this.requirementType = requirementType;
    this.requirementAmount = requirementAmount;
    this.description = description;
    this.iconSourceLeft = iconSourceLeft;
    this.iconSourceTop = iconSourceTop;
    this.available = false;
    this.purchased = false;
}
function UpgradeManager() {
    this.upgradesButtonGlowing = false;
    this.footmanUpgradesPurchased = 0;
    this.clericUpgradesPurchased = 0;
    this.commanderUpgradesPurchased = 0;
    this.mageUpgradesPurchased = 0;
    this.assassinUpgradesPurchased = 0;
    this.warlockUpgradesPurchased = 0;
    this.clericSpecialUpgradesPurchased = 0;
    this.commanderSpecialUpgradesPurchased = 0;
    this.mageSpecialUpgradesPurchased = 0;
    this.assassinSpecialUpgradesPurchased = 0;
    this.warlockSpecialUpgradesPurchased = 0;
    this.upgrades = new Array();
    this.initialize = function initialize() {
        this.upgrades.push(new Upgrade("Footman Training", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 10, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training II", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 19)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 20, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training III", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 29)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 30, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training IV", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 50, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training V", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 74)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 75, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training VI", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 100, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training VII", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 150, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training VIII", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 199)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 200, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training IX", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 249)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 250, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Footman Training X", Math.floor((legacyGame.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 199)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 300, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(new Upgrade("Cleric Training", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 10, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(new Upgrade("Cleric Training II", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 25, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(new Upgrade("Cleric Training III", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 50, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(new Upgrade("Cleric Training IV", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 100, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(new Upgrade("Cleric Training V", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 150, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(new Upgrade("Commander Training", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 10, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(new Upgrade("Commander Training II", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 25, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(new Upgrade("Commander Training III", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 50, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(new Upgrade("Commander Training IV", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 100, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(new Upgrade("Commander Training V", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 150, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(new Upgrade("Mage Training", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 10, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(new Upgrade("Mage Training II", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 25, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(new Upgrade("Mage Training III", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 50, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(new Upgrade("Mage Training IV", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 100, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(new Upgrade("Mage Training V", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 150, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(new Upgrade("Assassin Training", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 10, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(new Upgrade("Assassin Training II", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 25, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(new Upgrade("Assassin Training III", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 50, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(new Upgrade("Assassin Training IV", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 100, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(new Upgrade("Assassin Training V", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 150, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(new Upgrade("Warlock Training", ((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 10, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(new Upgrade("Warlock Training II", ((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 25, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(new Upgrade("Warlock Training III", ((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 50, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(new Upgrade("Warlock Training IV", ((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 100, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(new Upgrade("Warlock Training V", ((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 150, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(new Upgrade("Holy Imbuement", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 50, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
        this.upgrades.push(new Upgrade("Holy Imbuement II", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 100, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
        this.upgrades.push(new Upgrade("Holy Imbuement III", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 150, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
        this.upgrades.push(new Upgrade("Holy Imbuement IV", Math.floor((legacyGame.mercenaryManager.baseClericPrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 200, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
        this.upgrades.push(new Upgrade("Battle Morale", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 50, "Increases the health bonus from your Commanders by " + legacyGame.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));
        this.upgrades.push(new Upgrade("Battle Morale II", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 100, "Increases the health bonus from your Commanders by " + legacyGame.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));
        this.upgrades.push(new Upgrade("Battle Morale III", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 150, "Increases the health bonus from your Commanders by " + legacyGame.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));
        this.upgrades.push(new Upgrade("Battle Morale IV", Math.floor((legacyGame.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 200, "Increases the health bonus from your Commanders by " + legacyGame.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));
        this.upgrades.push(new Upgrade("Fire Mastery", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 50, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
        this.upgrades.push(new Upgrade("Fire Mastery II", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 100, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
        this.upgrades.push(new Upgrade("Fire Mastery III", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 150, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
        this.upgrades.push(new Upgrade("Fire Mastery IV", Math.floor((legacyGame.mercenaryManager.baseMagePrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 200, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
        this.upgrades.push(new Upgrade("Shadow Mastery", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 50, "Increases the evasion bonus from your assassins by " + legacyGame.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
        this.upgrades.push(new Upgrade("Shadow Mastery II", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 100, "Increases the evasion bonus from your assassins by " + legacyGame.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
        this.upgrades.push(new Upgrade("Shadow Mastery III", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 150, "Increases the evasion bonus from your assassins by " + legacyGame.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
        this.upgrades.push(new Upgrade("Shadow Mastery IV", Math.floor((legacyGame.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 200, "Increases the evasion bonus from your assassins by " + legacyGame.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
        this.upgrades.push(new Upgrade("Corruption", Math.floor((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 50, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
        this.upgrades.push(new Upgrade("Corruption II", Math.floor((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 100, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
        this.upgrades.push(new Upgrade("Corruption III", Math.floor((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 150, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
        this.upgrades.push(new Upgrade("Corruption IV", Math.floor((legacyGame.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 200, "Increases the crit damage bonus from Warlocks by 2.5%.", 40, 0));
        this.upgrades.push(new Upgrade("Power Strike", legacyGame.monsterCreator.calculateMonsterGoldWorth(50, MonsterRarity.COMMON) * 400, UpgradeType.ATTACK, UpgradeRequirementType.LEVEL, 50, "Upgrades your attack to Power Strike", 0, 80));
        this.upgrades.push(new Upgrade("Double Strike", legacyGame.monsterCreator.calculateMonsterGoldWorth(100, MonsterRarity.COMMON) * 400, UpgradeType.ATTACK, UpgradeRequirementType.LEVEL, 100, "Upgrades your attack to Double Strike", 200, 80));
    }
    this.update = function update() {
        var currentUpgrade;
        var available = false;
        for (var x = 0; x < this.upgrades.length; x++) {
            currentUpgrade = this.upgrades[x];
            if (!currentUpgrade.available && !currentUpgrade.purchased) {
                available = false;
                switch (currentUpgrade.requirementType) {
                    case UpgradeRequirementType.FOOTMAN: if (legacyGame.mercenaryManager.footmenOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.CLERIC: if (legacyGame.mercenaryManager.clericsOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.COMMANDER: if (legacyGame.mercenaryManager.commandersOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.MAGE: if (legacyGame.mercenaryManager.magesOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.ASSASSIN: if (legacyGame.mercenaryManager.assassinsOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.WARLOCK: if (legacyGame.mercenaryManager.warlocksOwned >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.ITEMS_LOOTED: if (legacyGame.stats.itemsLooted >= currentUpgrade.requirementAmount) { available = true; } break;
                    case UpgradeRequirementType.LEVEL: if (legacyGame.player.level >= currentUpgrade.requirementAmount) { available = true; } break;
                }
            }
            if (available) {
                legacyGame.displayAlert("New upgrade available!");
                currentUpgrade.available = true;
                this.glowUpgradesButton();
                break;
            }
        }
    }
    this.purchaseUpgrade = function purchaseUpgrade(id) {
        if (legacyGame.player.gold >= this.upgrades[id].cost) {
            var upgrade = this.upgrades[id];
            legacyGame.player.gold -= upgrade.cost;
            upgrade.purchased = true;
            upgrade.available = false;
            switch (upgrade.type) {
                case UpgradeType.GPS:
                    switch (upgrade.requirementType) {
                        case UpgradeRequirementType.FOOTMAN: this.footmanUpgradesPurchased++; break;
                        case UpgradeRequirementType.CLERIC: this.clericUpgradesPurchased++; break;
                        case UpgradeRequirementType.COMMANDER: this.commanderUpgradesPurchased++; break;
                        case UpgradeRequirementType.MAGE: this.mageUpgradesPurchased++; break;
                        case UpgradeRequirementType.ASSASSIN: this.assassinUpgradesPurchased++; break;
                        case UpgradeRequirementType.WARLOCK: this.warlockUpgradesPurchased++; break;
                    }
                    break;
                case UpgradeType.SPECIAL:
                    switch (upgrade.requirementType) {
                        case UpgradeRequirementType.FOOTMAN: break;
                        case UpgradeRequirementType.CLERIC: this.clericSpecialUpgradesPurchased++; break;
                        case UpgradeRequirementType.COMMANDER: this.commanderSpecialUpgradesPurchased++; break;
                        case UpgradeRequirementType.MAGE: this.mageSpecialUpgradesPurchased++; break;
                        case UpgradeRequirementType.ASSASSIN: this.assassinSpecialUpgradesPurchased++; break;
                        case UpgradeRequirementType.WARLOCK: this.warlockSpecialUpgradesPurchased++; break;
                    }
                    break;
                case UpgradeType.ATTACK:
                    switch (upgrade.name) {
                        case "Power Strike": if (!this.upgrades[56].purchased) { legacyGame.player.changeAttack(AttackType.POWER_STRIKE); } break;
                        case "Double Strike": legacyGame.player.changeAttack(AttackType.DOUBLE_STRIKE); break;
                    }
            }
            $("#otherTooltip").hide();
        }
    }
    this.stopGlowingUpgradesButton = function stopGlowingUpgradesButton() {
        this.upgradesButtonGlowing = false;
        $("#upgradesWindowButtonGlow").stop(true);
        $("#upgradesWindowButtonGlow").css('opacity', 0);
        $("#upgradesWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 78px 0');
    }
    this.glowUpgradesButton = function glowUpgradesButton() {
        this.upgradesButtonGlowing = true;
        $("#upgradesWindowButtonGlow").animate({ opacity:'+=0.5' }, 400);
        $("#upgradesWindowButtonGlow").animate({ opacity:'-=0.5' }, 400, function() { glowUpgradesButton(); });
    }
    this.save = function save() {
        localStorage.upgradesSaved = true;
        localStorage.footmanUpgradesPurchased = this.footmanUpgradesPurchased;
        localStorage.clericUpgradesPurchased = this.clericUpgradesPurchased;
        localStorage.commanderUpgradesPurchased = this.commanderUpgradesPurchased;
        localStorage.mageUpgradesPurchased = this.mageUpgradesPurchased;
        localStorage.assassinUpgradesPurchased = this.assassinUpgradesPurchased;
        localStorage.warlockUpgradesPurchased = this.warlockUpgradesPurchased;
        var upgradesPurchasedArray = new Array();
        var upgradesAvailableArray = new Array();
        for (var x = 0; x < this.upgrades.length; x++) {
            upgradesPurchasedArray.push(this.upgrades[x].purchased);
            upgradesAvailableArray.push(this.upgrades[x].available);
        }
        localStorage.upgradesPurchasedArray = JSON.stringify(upgradesPurchasedArray);
        localStorage.upgradesAvailableArray = JSON.stringify(upgradesAvailableArray);
        localStorage.clericSpecialUpgradesPurchased = this.clericSpecialUpgradesPurchased;
        localStorage.commanderSpecialUpgradesPurchased = this.commanderSpecialUpgradesPurchased;
        localStorage.mageSpecialUpgradesPurchased = this.mageSpecialUpgradesPurchased;
        localStorage.assassinSpecialUpgradesPurchased = this.assassinSpecialUpgradesPurchased;
        localStorage.warlockSpecialUpgradesPurchased = this.warlockSpecialUpgradesPurchased;
    }
    this.load = function load() {
        if (localStorage.upgradesSaved != null) {
            this.footmanUpgradesPurchased = parseInt(localStorage.footmanUpgradesPurchased);
            this.clericUpgradesPurchased = parseInt(localStorage.clericUpgradesPurchased);
            this.commanderUpgradesPurchased = parseInt(localStorage.commanderUpgradesPurchased);
            this.mageUpgradesPurchased = parseInt(localStorage.mageUpgradesPurchased);
            if (localStorage.version == null) {
                this.assassinUpgradesPurchased = parseInt(localStorage.thiefUpgradesPurchased);
            }
            else {
                this.assassinUpgradesPurchased = parseInt(localStorage.assassinUpgradesPurchased);
            }
            this.warlockUpgradesPurchased = parseInt(localStorage.warlockUpgradesPurchased);
            var upgradesPurchasedArray = JSON.parse(localStorage.upgradesPurchasedArray);
            var upgradesAvailableArray = JSON.parse(localStorage.upgradesAvailableArray);
            if (localStorage.clericSpecialUpgradesPurchased != null) { this.clericSpecialUpgradesPurchased = localStorage.clericSpecialUpgradesPurchased; }
            if (localStorage.commanderSpecialUpgradesPurchased != null) { this.commanderSpecialUpgradesPurchased = localStorage.commanderSpecialUpgradesPurchased; }
            if (localStorage.mageSpecialUpgradesPurchased != null) { this.mageSpecialUpgradesPurchased = localStorage.mageSpecialUpgradesPurchased; }
            if (localStorage.assassinSpecialUpgradesPurchased != null) { this.assassinSpecialUpgradesPurchased = localStorage.assassinSpecialUpgradesPurchased; }
            else if (localStorage.thiefSpecialUpgradesPurchased != null) { this.assassinSpecialUpgradesPurchased = localStorage.thiefSpecialUpgradesPurchased; }
            if (localStorage.warlockSpecialUpgradesPurchased != null) { this.warlockSpecialUpgradesPurchased = localStorage.warlockSpecialUpgradesPurchased; }
            for (var x = 0; x < upgradesPurchasedArray.length; x++) {
                if(this.upgrades[x] === undefined) {
                    continue;
                }
                if (upgradesPurchasedArray[x]) {
                    this.upgradesPurchased++;
                    this.upgrades[x].purchased = upgradesPurchasedArray[x];
                }
                else if (upgradesAvailableArray[x]) {
                    this.upgrades[x].available = upgradesAvailableArray[x];
                }
            }
        }
    }
}
function upgradeButtonMouseOverFactory(obj, id) {
    return function () { upgradeButtonMouseOver(obj, id); }
}
function upgradeButtonMouseDownFactory(id) {
    return function () { upgradeButtonMouseDown(id); }
}
function upgradeButtonMouseOutFactory(id) {
    return function () { upgradeButtonMouseOut(id); }
}
function upgradeButtonMouseOver(upgradeId) {
    var upgrade = legacyGame.upgradeManager.upgrades[upgradeId];
    $("#upgradePurchaseButton" + upgradeId).css('background', 'url("includes/images/buyButtonBase.png") 0 92px');
    $("#otherTooltipTitle").html(upgrade.name);
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html(upgrade.description);
    $("#otherTooltip").show();
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
function TooltipManager() {
    this.displayItemTooltip = function displayItemTooltip(item1, item2, item3, left, top, canSell) {
        var type = '';
        switch (item1.type) {
            case ItemType.HELM: type = "Helmet "; break;
            case ItemType.SHOULDERS: type = "Shoulders "; break;
            case ItemType.CHEST: type = "Chest "; break;
            case ItemType.LEGS: type = "Legs "; break;
            case ItemType.WEAPON: type = "Weapon "; break;
            case ItemType.GLOVES: type = "Gloves "; break;
            case ItemType.BOOTS: type = "Boots "; break;
            case ItemType.TRINKET: type = "Trinket "; break;
            case ItemType.OFF_HAND: type = "Off-Hand "; break;
        }
        var stats1 = '';
        var stats2 = '';
        if (item1.minDamage > 0) { stats1 += item1.minDamage + " - " + item1.maxDamage + " Damage"; }
        if (item1.armour > 0) { stats1 += (item1.armour + item1.armourBonus) + " Armour"; }
        if (item1.strength > 0) { stats2 += "<br>Strength: " + item1.strength; }
        if (item1.agility > 0) { stats2 += "<br>Agility: " + item1.agility; }
        if (item1.stamina > 0) { stats2 += "<br>Stamina: " + item1.stamina; }
        if (item1.health > 0) { stats2 += "<br>Health: " + item1.health; }
        if (item1.hp5 > 0) { stats2 += "<br>Hp5: " + item1.hp5; }
        if (item1.critChance > 0) { stats2 += "<br>Crit Chance: " + item1.critChance + "%"; }
        if (item1.critDamage > 0) { stats2 += "<br>Crit Damage: " + item1.critDamage + "%"; }
        if (item1.itemRarity > 0) { stats2 += "<br>Item Rarity: " + item1.itemRarity + "%"; }
        if (item1.goldGain > 0) { stats2 += "<br>Gold Gain: " + item1.goldGain + "%"; }
        if (item1.experienceGain > 0) { stats2 += "<br>Experience Gain: " + item1.experienceGain + "%"; }
        if (item1.evasion > 0) { stats2 += "<br>Evasion: " + item1.evasion; }
        var effect;
        var name;
        for (var x = 0; x < item1.effects.length; x++) {
            effect = item1.effects[x];
            stats2 += '<span class="yellowText">' + "<br>" + effect.getDescription();
        }
        if (item1.rarity == ItemRarity.COMMON) {
            $("#itemTooltip").css('border-color', '#fff'); $(".equipButton").css('border-color', '#fff');
            $("#itemTooltipTitle").html('<span class="whiteText">' + item1.name + '<br></span>');
        }
        if (item1.rarity == ItemRarity.UNCOMMON) {
            $("#itemTooltip").css('border-color', '#00ff05'); $(".equipButton").css('border-color', '#00ff05');
            $("#itemTooltipTitle").html('<span class="greenText">' + item1.name + '<br></span>');
        }
        if (item1.rarity == ItemRarity.RARE) {
            $("#itemTooltip").css('border-color', '#0005ff'); $(".equipButton").css('border-color', '#0005ff');
            $("#itemTooltipTitle").html('<span class="blueText">' + item1.name + '<br></span>');
        }
        if (item1.rarity == ItemRarity.EPIC) {
            $("#itemTooltip").css('border-color', '#b800af'); $(".equipButton").css('border-color', '#b800af');
            $("#itemTooltipTitle").html('<span class="purpleText">' + item1.name + '<br></span>');
        }
        if (item1.rarity == ItemRarity.LEGENDARY) {
            $("#itemTooltip").css('border-color', '#ff6a00'); $(".equipButton").css('border-color', '#ff6a00');
            $("#itemTooltipTitle").html('<span class="orangeText">' + item1.name + '<br></span>');
        }
        $("#itemTooltipType").html(type + '<br>');
        if (item1.armourBonus > 0) {
            $("#itemTooltipStats1").html('<span class="greenText">' + (item1.armour + item1.armourBonus) + '<span class="whiteText"> Armour<br></span></span>');
        }
        else if (item1.damageBonus > 0) {
            $("#itemTooltipStats1").html('<span class="greenText">' + (item1.minDamage + item1.damageBonus) + ' - ' + (item1.maxDamage + item1.damageBonus) + '<span class="whiteText"> Damage<br></span></span>');
        }
        else {
            $("#itemTooltipStats1").html(stats1 + '<br>');
        }
        $("#itemTooltipStats2").html(stats2);
        $("#itemTooltipSellValue").html(item1.sellValue);
        $("#itemTooltipLevel").html('Item Level ' + item1.level);
        $("#itemTooltipUseInfo").html('[Right-click to equip]');
        if (canSell) {
            $("#itemTooltipSellInfo").html('[Shift-click to sell]');
        }
        else { $("#itemTooltipSellInfo").html(''); }
        $("#itemTooltip").show();
        var topReduction = document.getElementById("itemTooltip").scrollHeight;
        $("#itemTooltip").css('top', top - topReduction - 30);
        var leftReduction = document.getElementById("itemTooltip").scrollWidth;
        $("#itemTooltip").css('left', left - leftReduction - 30);
        if (item2 != null) {
            var type2 = '';
            switch (item2.type) {
                case ItemType.HELM: type2 = "Helmet "; break;
                case ItemType.SHOULDERS: type2 = "Shoulders "; break;
                case ItemType.CHEST: type2 = "Chest "; break;
                case ItemType.LEGS: type2 = "Legs "; break;
                case ItemType.WEAPON: type2 = "Weapon "; break;
                case ItemType.GLOVES: type2 = "Gloves "; break;
                case ItemType.BOOTS: type2 = "Boots "; break;
                case ItemType.TRINKET: type2 = "Trinket "; break;
                case ItemType.OFF_HAND: type2 = "Off-Hand "; break;
            }
            stats1 = '';
            stats2 = '';
            if (item2.minDamage > 0) { stats1 += item2.minDamage + " - " + item2.maxDamage + " Damage"; }
            if (item2.armour > 0) { stats1 += (item2.armour + item2.armourBonus) + " Armour"; }
            if (item2.strength > 0) { stats2 += "<br>Strength: " + item2.strength; }
            if (item2.agility > 0) { stats2 += "<br>Agility: " + item2.agility; }
            if (item2.stamina > 0) { stats2 += "<br>Stamina: " + item2.stamina; }
            if (item2.health > 0) { stats2 += "<br>Health: " + item2.health; }
            if (item2.hp5 > 0) { stats2 += "<br>Hp5: " + item2.hp5; }
            if (item2.critChance > 0) { stats2 += "<br>Crit Chance: " + item2.critChance + "%"; }
            if (item2.critDamage > 0) { stats2 += "<br>Crit Damage: " + item2.critDamage + "%"; }
            if (item2.itemRarity > 0) { stats2 += "<br>Item Rarity: " + item2.itemRarity + "%"; }
            if (item2.goldGain > 0) { stats2 += "<br>Gold Gain: " + item2.goldGain + "%"; }
            if (item2.experienceGain > 0) { stats2 += "<br>Experience Gain: " + item2.experienceGain + "%"; }
            if (item2.evasion > 0) { stats2 += "<br>Evasion: " + item2.evasion; }
            var effect;
            var name;
            for (var x = 0; x < item2.effects.length; x++) {
                effect = item2.effects[x];
                stats2 += '<span class="yellowText">' + "<br>" + effect.getDescription();
            }
            $("#itemCompareTooltipExtra").html('Currently equipped');
            if (item2.rarity == ItemRarity.COMMON) {
                $("#itemCompareTooltip").css('border-color', '#fff'); $(".equipButton").css('border-color', '#fff');
                $("#itemCompareTooltipTitle").html('<span class="whiteText">' + item2.name + '<br></span>');
            }
            if (item2.rarity == ItemRarity.UNCOMMON) {
                $("#itemCompareTooltip").css('border-color', '#00ff05'); $(".equipButton").css('border-color', '#00ff05');
                $("#itemCompareTooltipTitle").html('<span class="greenText">' + item2.name + '<br></span>');
            }
            if (item2.rarity == ItemRarity.RARE) {
                $("#itemCompareTooltip").css('border-color', '#0005ff'); $(".equipButton").css('border-color', '#0005ff');
                $("#itemCompareTooltipTitle").html('<span class="blueText">' + item2.name + '<br></span>');
            }
            if (item2.rarity == ItemRarity.EPIC) {
                $("#itemCompareTooltip").css('border-color', '#b800af'); $(".equipButton").css('border-color', '#b800af');
                $("#itemCompareTooltipTitle").html('<span class="purpleText">' + item2.name + '<br></span>');
            }
            if (item2.rarity == ItemRarity.LEGENDARY) {
                $("#itemCompareTooltip").css('border-color', '#ff6a00'); $(".equipButton").css('border-color', '#ff6a00');
                $("#itemCompareTooltipTitle").html('<span class="orangeText">' + item2.name + '<br></span>');
            }
            $("#itemCompareTooltipType").html(type + '<br>');
            if (item2.armourBonus > 0) {
                $("#itemCompareTooltipStats1").html('<span class="greenText">' + (item2.armour + item2.armourBonus) + '<span class="whiteText"> Armour<br></span></span>');
            }
            else if (item2.damageBonus > 0) {
                $("#itemCompareTooltipStats1").html('<span class="greenText">' + (item2.minDamage + item2.damageBonus) + ' - ' + (item2.maxDamage + item2.damageBonus) + '<span class="whiteText"> Damage<br></span></span>');
            }
            else {
                $("#itemCompareTooltipStats1").html(stats1 + '<br>');
            }
            $("#itemCompareTooltipStats2").html(stats2);
            $("#itemCompareTooltipSellValue").html(item2.sellValue);
            $("#itemCompareTooltipLevel").html('Item Level ' + item2.level);
            $("#itemCompareTooltipUseInfo").html('');
            $("#itemCompareTooltipSellInfo").html('');
            $("#itemCompareTooltip").show();
            $("#itemCompareTooltip").css('top', top - topReduction - 30);
            leftReduction += document.getElementById("itemCompareTooltip").scrollWidth;
            $("#itemCompareTooltip").css('left', (left - leftReduction - 40));
            if (item3 != null) {
                var type3 = 'Trinket ';
                var item3 = legacyGame.equipment.trinket2();
                stats1 = '';
                stats2 = '';
                if (item3.minDamage > 0) { stats1 += item3.minDamage + " - " + item3.maxDamage + " Damage"; }
                if (item3.armour > 0) { stats1 += (item3.armour + item3.armourBonus) + " Armour"; }
                if (item3.strength > 0) { stats2 += "<br>Strength: " + item3.strength; }
                if (item3.agility > 0) { stats2 += "<br>Agility: " + item3.agility; }
                if (item3.stamina > 0) { stats2 += "<br>Stamina: " + item3.stamina; }
                if (item3.health > 0) { stats2 += "<br>Health: " + item3.health; }
                if (item3.hp5 > 0) { stats2 += "<br>Hp5: " + item3.hp5; }
                if (item3.critChance > 0) { stats2 += "<br>Crit Chance: " + item3.critChance + "%"; }
                if (item3.critDamage > 0) { stats2 += "<br>Crit Damage: " + item3.critDamage + "%"; }
                if (item3.itemRarity > 0) { stats2 += "<br>Item Rarity: " + item3.itemRarity + "%"; }
                if (item3.goldGain > 0) { stats2 += "<br>Gold Gain: " + item3.goldGain + "%"; }
                if (item3.experienceGain > 0) { stats2 += "<br>Experience Gain: " + item3.experienceGain + "%"; }
                if (item3.evasion > 0) { stats2 += "<br>Evasion: " + item3.evasion; }
                var effect;
                var name;
                for (var x = 0; x < item3.effects.length; x++) {
                    effect = item3.effects[x];
                    stats2 += '<span class="yellowText">' + "<br>" + effect.getDescription();
                }
                $("#itemCompareTooltip2Extra").html('Currently equipped');
                if (item3.rarity == ItemRarity.COMMON) {
                    $("#itemCompareTooltip2").css('border-color', '#fff'); $(".equipButton").css('border-color', '#fff');
                    $("#itemCompareTooltip2Title").html('<span class="whiteText">' + item3.name + '<br></span>');
                }
                if (item3.rarity == ItemRarity.UNCOMMON) {
                    $("#itemCompareTooltip2").css('border-color', '#00ff05'); $(".equipButton").css('border-color', '#00ff05');
                    $("#itemCompareTooltip2Title").html('<span class="greenText">' + item3.name + '<br></span>');
                }
                if (item3.rarity == ItemRarity.RARE) {
                    $("#itemCompareTooltip2").css('border-color', '#0005ff'); $(".equipButton").css('border-color', '#0005ff');
                    $("#itemCompareTooltip2Title").html('<span class="blueText">' + item3.name + '<br></span>');
                }
                if (item3.rarity == ItemRarity.EPIC) {
                    $("#itemCompareTooltip2").css('border-color', '#b800af'); $(".equipButton").css('border-color', '#b800af');
                    $("#itemCompareTooltip2Title").html('<span class="purpleText">' + item3.name + '<br></span>');
                }
                if (item3.rarity == ItemRarity.LEGENDARY) {
                    $("#itemCompareTooltip2").css('border-color', '#ff6a00'); $(".equipButton").css('border-color', '#ff6a00');
                    $("#itemCompareTooltip2Title").html('<span class="orangeText">' + item3.name + '<br></span>');
                }
                $("#itemCompareTooltip2Type").html(type + '<br>');
                if (item3.armourBonus > 0) {
                    $("#itemCompareTooltip2Stats1").html('<span class="greenText">' + (item3.armour + item3.armourBonus) + '<span class="whiteText"> Armour<br></span></span>');
                }
                else if (item3.damageBonus > 0) {
                    $("#itemCompareTooltip2Stats1").html('<span class="greenText">' + (item3.minDamage + item3.damageBonus) + ' - ' + (item3.maxDamage + item3.damageBonus) + '<span class="whiteText"> Damage<br></span></span>');
                }
                else {
                    $("#itemCompareTooltip2Stats1").html(stats1 + '<br>');
                }
                $("#itemCompareTooltip2Stats2").html(stats2);
                $("#itemCompareTooltip2SellValue").html(item3.sellValue);
                $("#itemCompareTooltip2Level").html('Item Level ' + item3.level);
                $("#itemCompareTooltip2UseInfo").html('');
                $("#itemCompareTooltip2SellInfo").html('');
                $("#itemCompareTooltip2").show();
                $("#itemCompareTooltip2").css('top', top - topReduction - 30);
                leftReduction += document.getElementById("itemCompareTooltip2").scrollWidth;
                $("#itemCompareTooltip2").css('left', left - leftReduction - 50);
            }
        }
    }
    this.displayBasicTooltip = function displayBasicTooltip(obj, text) {
        $("#basicTooltipText").html(text);
        $("#basicTooltip").show();
        var rect = obj.getBoundingClientRect();
        $("#basicTooltip").css('top', rect.top - 70);
        var leftReduction = document.getElementById("basicTooltip").scrollWidth;
        $("#basicTooltip").css('left', (rect.left - leftReduction - 40));
    }
}
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                       GAME                                                       
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
function Game() {
    this.version = 0.2;
    this.loading = false;
    this.loadingTextInterval = 0;
    this.loadInterval = 0;
    this.oldDate = new Date();
    this.player = new Player();
    this.inventory = new Inventory();
    this.equipment = new Equipment();
    this.statGenerator = new StatGenerator();
    this.nameGenerator = new NameGenerator();
    this.statUpgradesManager = new StatUpgradesManager();
    this.tooltipManager = new TooltipManager();
    this.questsManager = new QuestsManager();
    this.eventManager = new EventManager();
    this.stats = new Stats();
    this.options = new Options();
    this.inBattle = false;
    this.battleLevel = 1;
    this.battleDepth = 1;
    this.mercenaryManager = new mercenaryManager();
    this.upgradeManager = new UpgradeManager();
    this.particleManager = new ParticleManager();
    this.monsterCreator = new MonsterCreator();
    this.monster = this.monsterCreator.createRandomMonster(
        this.battleLevel,
        this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));
    this.displayMonsterHealth = false;
    this.itemCreator = new ItemCreator();
    this.saveDelay = 10000;
    this.saveTimeRemaining = this.saveDelay;
    this.initialize = function initialize() {
        this.beginLoading();
        this.mercenaryManager.initialize();
        this.upgradeManager.initialize();
        this.particleManager.initialize();
        this.load();
        document.getElementById("version").innerHTML = "Version " + this.version;
    }
    this.getPowerShardBonus = function() {
        return (this.player.powerShards / 100) + 1;
    };
    this.beginLoading = function beginLoading() {
        this.loading = true;
        this.loadingTextInterval = setInterval(function () {
            this.loadingInterval++;
            if (this.loadingInterval > 2) {
                this.loadingInterval = 0;
                $("#loadingText").html('Loading.');
            }
            else {
                $("#loadingText").append('.');
            }
        }, 500);
    }
    this.finishLoading = function finishLoading() {
        this.loading = false;
        clearInterval(this.loadingTextInterval);
        $("#loadingArea").hide();
    }
    this.allowBattle = function allowBattle() {
        enterBattleButtonReset();
    }
    this.disallowBattle = function disallowBattle() {
        this.leaveBattle();
        $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 25px');
    }
    this.enterBattle = function enterBattle() {
        this.inBattle = true;
        this.monster = this.monsterCreator.createRandomMonster(
            this.battleLevel,
            this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));
        $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 50px');
        $("#leaveBattleButton").show();
        $("#leaveBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
        $("#monsterHealthBarArea").show();
        $("#attackButton").show();
    }
    this.leaveBattle = function leaveBattle() {
        $("#leaveBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 50px');
        this.inBattle = false;
        $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
        $("#monsterHealthBarArea").hide();
        $("#leaveBattleButton").hide();
        this.resetBattle();
        $("#attackButton").hide();
        $("#monsterBleedingIcon").hide();
        $("#monsterBurningIcon").hide();
        $("#monsterChilledIcon").hide();
    }
    this.attack = function attack() {
        this.player.updateDebuffs();
        this.monster.updateDebuffs();
        var monstersDamageTaken = 0;
        if (legacyGame.player.canAttack) {
            var attackAmount = 1;
            var successfulAttacks = 0;
            if (this.player.attackType == AttackType.DOUBLE_STRIKE) { attackAmount++; }
            for (var x = 0; x < attackAmount; x++) {
                var playerMinDamage = this.player.getMinDamage();
                var playerMaxDamage = this.player.getMaxDamage();
                var playerDamage = playerMinDamage + (Math.random() * (playerMaxDamage - playerMinDamage));
                if (this.player.attackType == AttackType.POWER_STRIKE) {
                    playerDamage *= 1.5;
                }
                var criticalHappened = false;
                if (this.player.getCritChance() >= (Math.random() * 100)) {
                    playerDamage *= (this.player.getCritDamage() / 100);
                    criticalHappened = true;
                }
                var crushingBlowsEffects = legacyGame.player.getEffectsOfType(EffectType.CRUSHING_BLOWS);
                var crushingBlowsDamage = 0;
                if (crushingBlowsEffects.length > 0) {
                    for (var y = 0; y < crushingBlowsEffects.length; y++) {
                        crushingBlowsDamage += crushingBlowsEffects[y].value;
                    }
                    if (crushingBlowsDamage > 0) {
                        game.monsterTakeDamage((crushingBlowsDamage / 100) * this.monster.health, false, false);
                    }
                }
                game.monsterTakeDamage(playerDamage, criticalHappened, true);
                this.player.useAbilities();
                successfulAttacks++;
                var swiftnessEffects = legacyGame.player.getEffectsOfType(EffectType.SWIFTNESS);
                for (var z = 0; z < swiftnessEffects.length; z++) {
                    if (Math.random() < swiftnessEffects[z].chance / 100) {
                        playerMinDamage = this.player.getMinDamage();
                        playerMaxDamage = this.player.getMaxDamage();
                        playerDamage = playerMinDamage + (Math.random() * (playerMaxDamage - playerMinDamage));
                        if (this.player.attackType == AttackType.POWER_STRIKE) {
                            playerDamage *= 1.5;
                        }
                        criticalHappened = false;
                        if (this.player.getCritChance() >= (Math.random() * 100)) {
                            playerDamage *= (this.player.getCritDamage() / 100);
                            criticalHappened = true;
                        }
                        crushingBlowsEffects = legacyGame.player.getEffectsOfType(EffectType.CRUSHING_BLOWS);
                        crushingBlowsDamage = 0;
                        if (crushingBlowsEffects.length > 0) {
                            for (var y = 0; y < crushingBlowsEffects.length; y++) {
                                crushingBlowsDamage += crushingBlowsEffects[y].value;
                            }
                            if (crushingBlowsDamage > 0) {
                                game.monsterTakeDamage((crushingBlowsDamage / 100) * this.monster.health, false, false);
                            }
                        }
                        game.monsterTakeDamage(playerDamage, criticalHappened, true);
                        this.player.useAbilities();
                        successfulAttacks++;
                    }
                }
            }
            var pillagingEffects = this.player.getEffectsOfType(EffectType.PILLAGING);
            var nourishmentEffects = this.player.getEffectsOfType(EffectType.NOURISHMENT);
            var berserkingEffects = this.player.getEffectsOfType(EffectType.BERSERKING);
            for (var x = 0; x < successfulAttacks; x++) {
                for (var y = 0; y < pillagingEffects.length; y++) {
                    if (Math.random() < pillagingEffects[y].chance / 100) {
                        game.gainGold(pillagingEffects[y].value, true);
                    }
                }
                for (var y = 0; y < nourishmentEffects.length; y++) {
                    if (Math.random() < nourishmentEffects[y].chance / 100) {
                        legacyGame.player.heal(nourishmentEffects[y].value);
                    }
                }
                for (var y = 0; y < berserkingEffects.length; y++) {
                    if (Math.random() < berserkingEffects[y].chance / 100) {
                        game.monsterTakeDamage(berserkingEffects[y].value, false, false);
                    }
                }
            }
        }
        var playersDamageTaken = 0;
        if (this.monster.canAttack && this.monster.alive) {
            if (Math.random() >= (this.player.calculateEvasionChance() / 100)) {
                var monsterDamage = this.monster.damage;
                game.playerTakeDamage(monsterDamage);
                playersDamageTaken = monsterDamage;
            }
        }
        if (this.monster.alive == false) {
            this.questsManager.updateKillCounts(this.monster.level);
            var loot = this.monster.getRandomLoot();
            game.gainGold(loot.gold, true);
            this.stats.goldFromMonsters += this.player.lastGoldGained;
            game.gainExperience(this.monster.experienceWorth, true);
            this.stats.experienceFromMonsters += this.player.lastExperienceGained;
            if (loot.item != null) {
                this.inventory.lootItem(loot.item);
            }
            this.particleManager.createParticle(this.player.lastGoldGained.toFixed(2), ParticleType.GOLD);
            this.particleManager.createParticle(this.player.lastExperienceGained.toFixed(2), ParticleType.EXP_ORB);
            this.particleManager.createParticle(null, ParticleType.SKULL);
            this.monster = this.monsterCreator.createRandomMonster(
                this.battleLevel,
                this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));
            $("#monsterBleedingIcon").hide();
            $("#monsterBurningIcon").hide();
            $("#monsterChilledIcon").hide();
            this.battleDepth++;
        }
    }
    this.maxBattleLevelReached = function maxBattleLevelReached() {
        if (this.player.level == this.battleLevel) {
            return true;
        }
        else { return false; }
    }
    this.increaseBattleLevel = function increaseBattleLevel() {
        if (this.player.level > this.battleLevel) {
            this.battleLevel++;
            this.displayAlert("Battle Level " + legacyGame.battleLevel);
        }
    }
    this.decreaseBattleLevel = function decreaseBattleLevel() {
        if (this.battleLevel != 1) {
            this.battleLevel--;
            this.displayAlert("Battle Level " + legacyGame.battleLevel);
        }
    }
    this.resetBattle = function resetBattle() {
        this.battleDepth = 1;
    }
    this.displayAlert = function displayAlert(text) {
        $("#battleLevelText").stop(true);
        var battleLevelText = document.getElementById("battleLevelText");
        battleLevelText.style.opacity = '1';
        battleLevelText.style.top = '600px';
        battleLevelText.innerHTML = text;
        $("#battleLevelText").animate({ top:'-=50px', opacity:'0' }, 1000);
    }
    this.displayLevelUpWindow = function displayLevelUpWindow() {
        if ((this.player.skillPointsSpent + 2) % 5 == 0) {
            $("#abilityUpgradesWindow").show();
        }
        else {
            var upgrades = this.statUpgradesManager.upgrades[0];
            $("#statUpgradesWindow").show();
            switch (upgrades[0].type) {
                case StatUpgradeType.DAMAGE:            document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Damage"; break;
                case StatUpgradeType.STRENGTH:          document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Strength"; break;
                case StatUpgradeType.AGILITY:           document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Agility"; break;
                case StatUpgradeType.STAMINA:           document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Stamina"; break;
                case StatUpgradeType.ARMOUR:            document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Armour"; break;
                case StatUpgradeType.HP5:               document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Hp5"; break;
                case StatUpgradeType.CRIT_DAMAGE:       document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Crit Damage"; break;
                case StatUpgradeType.ITEM_RARITY:         document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Item Rarity"; break;
                case StatUpgradeType.GOLD_GAIN:         document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Gold Gain"; break;
                case StatUpgradeType.EXPERIENCE_GAIN:   document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Experience Gain"; break;
            }
            switch (upgrades[1].type) {
                case StatUpgradeType.DAMAGE:            document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Damage"; break;
                case StatUpgradeType.STRENGTH:          document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Strength"; break;
                case StatUpgradeType.AGILITY:           document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Agility"; break;
                case StatUpgradeType.STAMINA:           document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Stamina"; break;
                case StatUpgradeType.ARMOUR:            document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Armour"; break;
                case StatUpgradeType.HP5:               document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Hp5"; break;
                case StatUpgradeType.CRIT_DAMAGE:       document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Crit Damage"; break;
                case StatUpgradeType.ITEM_RARITY:         document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Item Rarity"; break;
                case StatUpgradeType.GOLD_GAIN:         document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Gold Gain"; break;
                case StatUpgradeType.EXPERIENCE_GAIN:   document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Experience Gain"; break;
            }
            switch (upgrades[2].type) {
                case StatUpgradeType.DAMAGE:            document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Damage"; break;
                case StatUpgradeType.STRENGTH:          document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Strength"; break;
                case StatUpgradeType.AGILITY:           document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Agility"; break;
                case StatUpgradeType.STAMINA:           document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Stamina"; break;
                case StatUpgradeType.ARMOUR:            document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Armour"; break;
                case StatUpgradeType.HP5:               document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Hp5"; break;
                case StatUpgradeType.CRIT_DAMAGE:       document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Crit Damage"; break;
                case StatUpgradeType.ITEM_RARITY:         document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Item Rarity"; break;
                case StatUpgradeType.GOLD_GAIN:         document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Gold Gain"; break;
                case StatUpgradeType.EXPERIENCE_GAIN:   document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Experience Gain"; break;
            }
        }
    }
    this.calculatePowerShardReward = function calculatePowerShardReward() {
        var powerShardsTotal = Math.floor((Math.sqrt(1 + 8 * (this.stats.goldEarned / 1000000000000)) - 1) / 2);
        var powerShardsReward = powerShardsTotal - this.player.powerShards;
        if (powerShardsReward < 0) { powerShardsReward = 0; }
        return powerShardsReward;
    }
    this.save = function save() {
        if (typeof (Storage) !== "undefined") {
            localStorage.version = this.version;
            this.inventory.save();
            this.equipment.save();
            this.player.save();
            this.questsManager.save();
            this.mercenaryManager.save();
            this.upgradeManager.save();
            this.statUpgradesManager.save();
            this.stats.save();
            this.options.save();
            localStorage.battleLevel = this.battleLevel;
        }
    }
    this.load = function load() {
        if (typeof (Storage) !== "undefined") {
            this.inventory.load();
            this.equipment.load();
            this.player.load();
            this.questsManager.load();
            this.mercenaryManager.load();
            this.upgradeManager.load();
            this.statUpgradesManager.load();
            this.stats.load();
            this.options.load();
            if (localStorage.battleLevel != null) { this.battleLevel = parseInt(localStorage.battleLevel); }
            if (this.battleLevel > 1) {
                $("#battleLevelDownButton").css('background', 'url("includes/images/battleLevelButton.png") 0 0px');
            }
            if (this.maxBattleLevelReached()) {
                $("#battleLevelUpButton").css('background', 'url("includes/images/battleLevelButton.png") 0 25px');
            }
            this.monster = this.monsterCreator.createRandomMonster(
                this.battleLevel,
                this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));
        }
    }
    this.reset = function reset() {
        localStorage.clear();
        this.player = new Player();
        this.inventory = new Inventory();
        this.equipment = new Equipment();
        this.statGenerator = new StatGenerator();
        this.nameGenerator = new NameGenerator();
        this.statUpgradesManager = new StatUpgradesManager();
        this.questsManager = new QuestsManager();
        this.eventManager = new EventManager();
        this.stats = new Stats();
        this.inBattle = false;
        this.battleLevel = 1;
        this.battleDepth = 1;
        this.mercenaryManager = new mercenaryManager();
        var currentElement;
        for (var x = 0; x < this.upgradeManager.upgradesAvailable; x++) {
            currentElement = document.getElementById('upgradePurchaseButton' + (x + 1));
            currentElement.parentNode.removeChild(currentElement);
        }
        this.upgradeManager = new UpgradeManager();
        this.particleManager = new ParticleManager();
        this.monsterCreator = new MonsterCreator();
        this.monster = this.monsterCreator.createRandomMonster(
            this.battleLevel,
            this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));
        this.itemCreator = new ItemCreator();
        this.initialize();
        $("#leaveBattleButton").hide();
        $("#monsterHealthBarArea").hide();
        $("#attackButton").hide();
        $("#powerStrikeButton").hide();
        $("#inventoryWindow").hide();
        $("#characterWindow").hide();
        $("#upgradesWindow").hide();
        $("#mercenariesWindow").hide();
        $("#questsWindow").hide();
        $("#resurrectionBarArea").hide();
        $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
        $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 150px 0');
        document.getElementById("footmanCost").innerHTML = this.mercenaryManager.footmanPrice.formatMoney(0);
        document.getElementById("footmenOwned").innerHTML = this.mercenaryManager.footmenOwned;
        document.getElementById("clericCost").innerHTML = this.mercenaryManager.clericPrice.formatMoney(0);
        document.getElementById("clericsOwned").innerHTML = this.mercenaryManager.clericsOwned;
        document.getElementById("commanderCost").innerHTML = this.mercenaryManager.commanderPrice.formatMoney(0);
        document.getElementById("commandersOwned").innerHTML = this.mercenaryManager.commandersOwned;
        document.getElementById("mageCost").innerHTML = this.mercenaryManager.magePrice.formatMoney(0);
        document.getElementById("magesOwned").innerHTML = this.mercenaryManager.magesOwned;
        document.getElementById("assassinCost").innerHTML = this.mercenaryManager.assassinPrice.formatMoney(0);
        document.getElementById("assassinsOwned").innerHTML = this.mercenaryManager.assassinsOwned;
        document.getElementById("warlockCost").innerHTML = this.mercenaryManager.warlockPrice.formatMoney(0);
        document.getElementById("warlocksOwned").innerHTML = this.mercenaryManager.warlocksOwned;
    }
    this.update = function update() {
        var newDate = new Date();
        var ms = (newDate.getTime() - this.oldDate.getTime());
        if (!this.player.alive) {
            if (!this.player.resurrecting) {
                $("#resurrectionBarArea").show();
                this.player.resurrecting = true;
                this.player.resurrectionTimeRemaining = this.player.resurrectionTimer;
                this.disallowBattle();
                this.player.health = 0;
                this.mercenaryManager.addGpsReduction(this.mercenaryManager.deathGpsReductionAmount, this.mercenaryManager.deathGpsReductionDuration);
            }
            else {
                this.player.resurrectionTimeRemaining -= (ms / 1000);
                $("#resurrectionBar").css('width', (200 * (this.player.resurrectionTimeRemaining / this.player.resurrectionTimer)));
                $("#resurrectionBar").css('height', '23');
                document.getElementById("resurrectionBarText").innerHTML = "Resurrecting: " + Math.floor((this.player.resurrectionTimeRemaining / this.player.resurrectionTimer) * 100) + "%";
                if (this.player.resurrectionTimeRemaining <= 0) {
                    this.player.resurrecting = false;
                    this.player.health = this.player.getMaxHealth();
                    this.player.alive = true;
                    $("#resurrectionBarArea").hide();
                    this.allowBattle();
                }
            }
        }
        else {
            this.player.regenerateHealth(ms);
        }
        this.mercenaryManager.update(ms);
        this.updateInterface(ms);
        this.questsManager.update();
        this.eventManager.update(ms);
        this.player.update(ms);
        legacyGame.saveTimeRemaining -= ms;
        if (legacyGame.saveTimeRemaining <= 0) {
            legacyGame.saveTimeRemaining = legacyGame.saveDelay;
            legacyGame.save();
        }
        this.oldDate = newDate;
    }
    this.updateInterface = function updateInterface(ms) {
        this.upgradeManager.update();
        this.particleManager.update(ms);
        document.getElementById("levelValue").innerHTML = this.player.level;
        document.getElementById("healthValue").innerHTML = Math.floor(this.player.health) + '/' + Math.floor(this.player.getMaxHealth());
        document.getElementById("hp5Value").innerHTML = this.player.getHp5().toFixed(2);
        document.getElementById("damageValue").innerHTML = Math.floor(this.player.getMinDamage()) + ' - ' + Math.floor(this.player.getMaxDamage());
        document.getElementById("damageBonusValue").innerHTML = this.player.getDamageBonus() + '%';
        document.getElementById("armourValue").innerHTML = this.player.getArmour().toFixed(2) + ' (' + this.player.calculateDamageReduction().toFixed(2) + '%)';
        document.getElementById("evasionValue").innerHTML = this.player.getEvasion().toFixed(2) + ' (' + this.player.calculateEvasionChance().toFixed(2) + '%)';
        document.getElementById("strengthValue").innerHTML = this.player.getStrength();
        document.getElementById("staminaValue").innerHTML = this.player.getStamina();
        document.getElementById("agilityValue").innerHTML = this.player.getAgility();
        document.getElementById("critChanceValue").innerHTML = this.player.getCritChance().toFixed(2) + '%';
        document.getElementById("critDamageValue").innerHTML = this.player.getCritDamage().toFixed(2) + '%';
        document.getElementById("itemRarityValue").innerHTML = this.player.getItemRarity().toFixed(2) + '%';
        document.getElementById("goldGainValue").innerHTML = this.player.getGoldGain().toFixed(2) + '%';
        document.getElementById("experienceGainValue").innerHTML = this.player.getExperienceGain().toFixed(2) + '%';
        var quest = this.questsManager.getSelectedQuest();
        if (quest != null) {
            var newText = '';
            document.getElementById("questTitle").innerHTML = quest.name;
            switch (quest.type) {
                case QuestType.KILL:
                    if (quest.typeAmount == 1) {
                        newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monster.";
                    }
                    else {
                        newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monsters.";
                    }
                    break;
                case QuestType.MERCENARIES:
                    switch (quest.typeId) {
                        case 0:
                            newText = "Own " + quest.typeAmount + " Footmen.";
                            break;
                        case 1:
                            newText = "Own " + quest.typeAmount + " Clerics.";
                            break;
                        case 2:
                            newText = "Own " + quest.typeAmount + " Commanders.";
                            break;
                        case 3:
                            newText = "Own " + quest.typeAmount + " Mages.";
                            break;
                        case 4:
                            newText = "Own " + quest.typeAmount + " Assassins.";
                            break;
                        case 5:
                            newText = "Own " + quest.typeAmount + " Warlocks.";
                            break;
                    }
                    break;
                case QuestType.UPGRADE:
                    newText = "Purchase the " + this.upgradeManager.upgrades[quest.typeId].name + " upgrade.";
                    break;
            }
            document.getElementById("questGoal").innerHTML = newText;
            switch (quest.type) {
                case QuestType.KILL:
                    newText = quest.killCount + "/" + quest.typeAmount + " Monsters slain.";
                    break;
                case QuestType.MERCENARIES:
                    switch (quest.typeId) {
                        case 0:
                            newText = this.mercenaryManager.footmenOwned + "/" + quest.typeAmount + " Footmen owned.";
                            break;
                        case 1:
                            newText = this.mercenaryManager.clericsOwned + "/" + quest.typeAmount + " Clerics owned.";
                            break;
                        case 2:
                            newText = this.mercenaryManager.commandersOwned + "/" + quest.typeAmount + " Commanders owned.";
                            break;
                        case 3:
                            newText = this.mercenaryManager.magesOwned + "/" + quest.typeAmount + " Mages owned.";
                            break;
                        case 4:
                            newText = this.mercenaryManager.assassinsOwned + "/" + quest.typeAmount + " Assassins owned.";
                            break;
                        case 5:
                            newText = this.mercenaryManager.warlocksOwned + "/" + quest.typeAmount + " Warlocks owned.";
                            break;
                    }
                    break;
                case QuestType.UPGRADE:
                    break;
            }
            document.getElementById("questProgress").innerHTML = newText;
            document.getElementById("questDescription").innerHTML = "<br>" + quest.description;
            document.getElementById("questReward").innerHTML = "<br>Reward:";
            if (quest.buffReward != null) { document.getElementById("questRewardText").innerHTML = "Completing this quest will empower you with a powerful buff."; }
            document.getElementById("questGold").innerHTML = quest.goldReward;
            document.getElementById("questExperience").innerHTML = quest.expReward;
        }
        else {
            $("#questNamesArea").hide();
            $("#questTextArea").hide();
        }
        this.stats.update();
    }
}
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
    if (event.which == 1) {
        slotTypeSelected = SLOT_TYPE.EQUIP;
        slotNumberSelected = index;
        var rect = $(".equipItem" + index).position();
        $(".equipItem" + index).css('z-index', '200');
    }
}
function inventoryItemHover(obj, index) {
    var item = legacyGame.inventory.slots[index - 1];
    if (item != null) {
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
                                            if (legacyGame.equipment.trinket1() != null && legacyGame.equipment.trinket2() != null) {
                                                twoTrinkets = true;
                                            }
                                        }
                                        break;
            case ItemType.OFF_HAND:     if (legacyGame.equipment.off_hand() != null) { equippedSlot = 9; } break;
        }
        var item2 = legacyGame.equipment.slots[equippedSlot];
        if (twoTrinkets) {
            var item3 = legacyGame.equipment.trinket2();
        }
        var rect = obj.getBoundingClientRect();
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
    if (event.shiftKey == 1) {
        legacyGame.inventory.sellItem(index - 1);
        $('#itemTooltip').hide();
    }
    else if (event.which == 1) {
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
    if (!sellButtonActive) {
        obj.setAttribute("src", "includes/images/sellButtonHover.png");
    }
}
function sellButtonReset(obj) {
    if (!sellButtonActive) {
        obj.setAttribute("src", "includes/images/sellButton.png");
    }
}
function sellButtonClick(obj) {
    if (!sellButtonActive) {
        sellButtonActive = true;
        obj.setAttribute("src", "includes/images/sellButtonDown.png");
    }
    else {
        sellButtonActive = false;
        obj.setAttribute("src", "includes/images/sellButtonHover.png");
    }
}
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
    for (var x = 0; x < WindowOrder.length; x++) {
        if (WindowOrder[x] == obj.id) {
            WindowOrder.splice(x, 1);
            break;
        }
    }
    WindowOrder.push(obj.id);
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
        '<br>Commanders increase your health by ' + legacyGame.mercenaryManager.getCommanderHealthPercentBonus() + '%.');
    $("#otherTooltip").show();
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
    var upgrade = legacyGame.statUpgradesManager.upgrades[0][index - 1];
    switch (upgrade.type) {
        case StatUpgradeType.DAMAGE:
            $("#otherTooltipTitle").html("Damage");
            $("#otherTooltipDescription").html("Increases the damage you deal with basic attacks.");
            break;
        case StatUpgradeType.STRENGTH:
            $("#otherTooltipTitle").html("Strength");
            $("#otherTooltipDescription").html("Increases your Health by 5 and Damage by 1%.");
            break;
        case StatUpgradeType.AGILITY:
            $("#otherTooltipTitle").html("Agility");
            $("#otherTooltipDescription").html("Increases your Crit Damage by 0.2% and Evasion by 1%.");
            break;
        case StatUpgradeType.STAMINA:
            $("#otherTooltipTitle").html("Stamina");
            $("#otherTooltipDescription").html("Increases your Hp5 by 1 and your Armour by 1%.");
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
    $("#statUpgradesWindow").hide();
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
    legacyGame.statUpgradesManager.upgrades.splice(0, 1);
    legacyGame.player.skillPoints--;
    legacyGame.player.skillPointsSpent++;
}
function statUpgradeButtonReset(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 0';
    $("#otherTooltip").hide();
}
function rendUpgradeButtonHover(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 92px';
    $("#abilityUpgradeTooltipTitle").html('Rend');
    $("#abilityUpgradeTooltipCooldown").html('');
    if (legacyGame.player.abilities.getRendLevel() > 0) {
        $("#abilityUpgradeTooltipLevel").html('Level ' + legacyGame.player.abilities.getRendLevel());
        $("#abilityUpgradeTooltipDescription").html('Your attacks cause your opponent to bleed for <span class="yellowText">' + legacyGame.player.abilities.getRendDamage(0) + 
            '</span> damage after every round for ' + legacyGame.player.abilities.rendDuration + ' rounds. Stacks up to 5 times.');
        $("#abilityUpgradeTooltipLevel2").html('Next Level');
    }
    else {
        $("#abilityUpgradeTooltipLevel").html('');
        $("#abilityUpgradeTooltipDescription").html('');
        $("#abilityUpgradeTooltipLevel2").html('Level 1');
    }
    $("#abilityUpgradeTooltipDescription2").html('Your attacks cause your opponent to bleed for <span class="yellowText">' + legacyGame.player.abilities.getRendDamage(1) + 
        '</span> damage after every round for ' + legacyGame.player.abilities.rendDuration + ' rounds. Stacks up to 5 times.');
    $("#abilityUpgradeTooltip").show();
    var rect = obj.getBoundingClientRect();
    $("#abilityUpgradeTooltip").css('top', rect.top - 70);
    var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
    $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 40));
}
function rendUpgradeButtonClick(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 46px';
    $("#abilityUpgradesWindow").hide();
    legacyGame.player.increaseAbilityPower(AbilityName.REND);
}
function rendUpgradeButtonReset(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 0';
    $("#abilityUpgradeTooltip").hide();
}
function rejuvenatingStrikesUpgradeButtonHover(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 92px';
    $("#abilityUpgradeTooltipTitle").html('Rejuvenating Strikes');
    $("#abilityUpgradeTooltipCooldown").html('');
    if (legacyGame.player.abilities.getRejuvenatingStrikesLevel() > 0) {
        $("#abilityUpgradeTooltipLevel").html('Level ' + legacyGame.player.abilities.getRejuvenatingStrikesLevel());
        $("#abilityUpgradeTooltipDescription").html('Your attacks heal you for <span class="greenText">' + legacyGame.player.abilities.getRejuvenatingStrikesHealAmount(0) + 
            '</span> health.');
        $("#abilityUpgradeTooltipLevel2").html('Next Level');
    }
    else {
        $("#abilityUpgradeTooltipLevel").html('');
        $("#abilityUpgradeTooltipDescription").html('');
        $("#abilityUpgradeTooltipLevel2").html('Level 1');
    }
    $("#abilityUpgradeTooltipDescription2").html('Your attacks heal you for <span class="greenText">' + legacyGame.player.abilities.getRejuvenatingStrikesHealAmount(1) + 
        '</span> health.');
    $("#abilityUpgradeTooltip").show();
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
}
function iceBladeUpgradeButtonHover(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 92px';
    $("#abilityUpgradeTooltipTitle").html('Ice Blade');
    $("#abilityUpgradeTooltipCooldown").html('');
    if (legacyGame.player.abilities.getIceBladeLevel() > 0) {
        $("#abilityUpgradeTooltipLevel").html('Level ' + legacyGame.player.abilities.getIceBladeLevel());
        $("#abilityUpgradeTooltipDescription").html('Your attacks deal <span class="yellowText">' + legacyGame.player.abilities.getIceBladeDamage(0) + 
            '</span> bonus damage and chill them for ' + legacyGame.player.abilities.iceBladeChillDuration + ' rounds.');
        $("#abilityUpgradeTooltipLevel2").html('Next Level');
    }
    else {
        $("#abilityUpgradeTooltipLevel").html('');
        $("#abilityUpgradeTooltipDescription").html('');
        $("#abilityUpgradeTooltipLevel2").html('Level 1');
    }
    $("#abilityUpgradeTooltipDescription2").html('Your attacks deal <span class="yellowText">' + legacyGame.player.abilities.getIceBladeDamage(1) + 
        '</span> damage and chill them for ' + legacyGame.player.abilities.iceBladeChillDuration + ' rounds.');
    $("#abilityUpgradeTooltip").show();
    var rect = obj.getBoundingClientRect();
    $("#abilityUpgradeTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
    $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 10));
}
function iceBladeUpgradeButtonClick(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 46px';
    $("#abilityUpgradesWindow").hide();
    legacyGame.player.increaseAbilityPower(AbilityName.ICE_BLADE);
}
function iceBladeUpgradeButtonReset(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 0';
    $("#abilityUpgradeTooltip").hide();
}
function fireBladeUpgradeButtonHover(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 92px';
    $("#abilityUpgradeTooltipTitle").html('Fire Blade');
    $("#abilityUpgradeTooltipCooldown").html('');
    if (legacyGame.player.abilities.getFireBladeLevel() > 0) {
        $("#abilityUpgradeTooltipLevel").html('Level ' + legacyGame.player.abilities.getFireBladeLevel());
        $("#abilityUpgradeTooltipDescription").html('Your attacks deal <span class="yellowText">' + legacyGame.player.abilities.getFireBladeDamage(0) + 
            '</span> bonus damage and burn them for <span class="yellowText">' + legacyGame.player.abilities.getFireBladeBurnDamage(0) + 
            '</span> damage after every round for ' + legacyGame.player.abilities.fireBladeBurnDuration + ' rounds.');
        $("#abilityUpgradeTooltipLevel2").html('Next Level');
    }
    else {
        $("#abilityUpgradeTooltipLevel").html('');
        $("#abilityUpgradeTooltipDescription").html('');
        $("#abilityUpgradeTooltipLevel2").html('Level 1');
    }
    $("#abilityUpgradeTooltipDescription2").html('Your attacks deal <span class="yellowText">' + legacyGame.player.abilities.getFireBladeDamage(1) + 
        '</span> bonus damage and burn them for <span class="yellowText">' + legacyGame.player.abilities.getFireBladeBurnDamage(1) + 
        '</span> damage after every round for ' + legacyGame.player.abilities.fireBladeBurnDuration + ' rounds.');
    $("#abilityUpgradeTooltip").show();
    var rect = obj.getBoundingClientRect();
    $("#abilityUpgradeTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
    $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 10));
}
function fireBladeUpgradeButtonClick(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 46px';
    $("#abilityUpgradesWindow").hide();
    legacyGame.player.increaseAbilityPower(AbilityName.FIRE_BLADE);
}
function fireBladeUpgradeButtonReset(obj) {
    obj.style.background = 'url("includes/images/buyButtonBase.png") 0 0';
    $("#abilityUpgradeTooltip").hide();
}
/* ========== ========== ========== ========== ==========  ========== ========== ========== ========== ==========  /
/                                                       OTHER                                                      
/  ========== ========== ========== ========== ==========  ========== ========== ========== ========== ========== */
function expBarAreaMouseOver() {
    $("#expBarText").show();
}
function expBarAreaMouseOut() {
    if (!legacyGame.options.alwaysDisplayExp) {
        $("#expBarText").hide();
    }
}
function playerHealthBarAreaMouseOver() {
    $("#playerHealthBarText").show();
}
function playerHealthBarAreaMouseOut() {
    if (!legacyGame.options.alwaysDisplayPlayerHealth) {
        $("#playerHealthBarText").hide();
    }
}
function monsterHealthBarAreaMouseOver() {
    legacyGame.displayMonsterHealth = true;
}
function monsterHealthBarAreaMouseOut() {
    if (!legacyGame.options.alwaysDisplayMonsterHealth) {
        legacyGame.displayMonsterHealth = false;
    }
}
function bleedingIconMouseOver(obj) {
    $("#otherTooltipTitle").html("Bleeding");
    $("#otherTooltipCooldown").html((legacyGame.monster.debuffs.bleedMaxDuration - legacyGame.monster.debuffs.bleedDuration) + ' rounds remaining');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('This monster is bleeding, causing damage at the end of every round');
    $("#otherTooltip").show();
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
}
function bleedingIconMouseOut() {
    $("#otherTooltip").hide();
}
function burningIconMouseOver(obj) {
    $("#otherTooltipTitle").html("Burning");
    $("#otherTooltipCooldown").html((legacyGame.monster.debuffs.burningMaxDuration - legacyGame.monster.debuffs.burningDuration) + ' rounds remaining');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('This monster is burning, causing damage at the end of every round');
    $("#otherTooltip").show();
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
}
function burningIconMouseOut() {
    $("#otherTooltip").hide();
}
function chilledIconMouseOver(obj) {
    $("#otherTooltipTitle").html("Chilled");
    $("#otherTooltipCooldown").html((legacyGame.monster.debuffs.chillMaxDuration - legacyGame.monster.debuffs.chillDuration) + ' rounds remaining');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html('This monster is chilled, causing it to attack twice as slow');
    $("#otherTooltip").show();
    var rect = obj.getBoundingClientRect();
    $("#otherTooltip").css('top', rect.top + 10);
    var leftReduction = document.getElementById("otherTooltip").scrollWidth;
    $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
}
function chilledIconMouseOut() {
    $("#otherTooltip").hide();
}
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
    $("#otherTooltipDescription").html("Increases your Health by 5 and Damage by 1%.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function agilityStatHover(obj) {
    $("#otherTooltipTitle").html("Agility");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases your Crit Damage by 0.2% and Evasion by 1%.");
    $("#otherTooltip").show();
    setTooltipLocation(obj);
}
function staminaStatHover(obj) {
    $("#otherTooltipTitle").html("Stamina");
    $("#otherTooltipCooldown").html('');
    $("#otherTooltipLevel").html('');
    $("#otherTooltipDescription").html("Increases your Hp5 by 1 and Armour by 1%.");
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
function saveButtonClick() {
    legacyGame.save();
}
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

declare('Save', function() {
    var log = include('Log','save');
    var coreSave = include('CoreSave','save');
    
    Save.prototype = coreSave.prototype();
    Save.prototype.$super = parent;
    Save.prototype.constructor = Save;
    
    function Save() {
        coreSave.construct(this);
        this.stateName = "endlessSave";
    }
    Save.prototype.doSave = function(data) {
        var storageKey = this.getStorageKey();
        localStorage[storageKey] = data;
        return true;
    };
    Save.prototype.doLoad = function() {
        var storageKey = this.getStorageKey();
        return localStorage[storageKey];
    };
    Save.prototype.doGetSize = function() {
        var storageKey = this.getStorageKey();
        if(localStorage[storageKey] !== undefined) {
            return localStorage[storageKey].length;
        }
        return 0;
    };
    Save.prototype.getLocalStorageSize = function() {
        var size = 3072; // General overhead for localstorage is around 3kb
        for(var entry in localStorage) {
            size += (entry.length + localStorage[entry].length) * 16;
        }
        return size;
    };
    Save.prototype.debugLocalStorage = function() {
        for(var entry in localStorage) {
            log.debug(entry + ": " + localStorage[entry].length);
        }
    };
    
    return new Save();
    
});

declare('SaveKeys', function() {
	return {
        idnSettingsInternalInfoToConsole: "N495450445",
        idnSettingsInternalWarningToConsole: "N89912178",
		idnSettingsInternalLogContexts: "N1557983302",
	};
});

declare('Settings', function () {
    var component = include('Component','settings');
    var save = include('Save','settings');
    var saveKeys = include('SaveKeys','settings');
    Settings.prototype = component.prototype();
    Settings.prototype.$super = parent;
    Settings.prototype.constructor = Settings;
    function Settings() {
        component.construct(this);
        this.id = "Settings";
        this.logContextDefaultValue = true;
        save.register(this, saveKeys.idnSettingsInternalInfoToConsole).asBool().withDefault(false);
        save.register(this, saveKeys.idnSettingsInternalWarningToConsole).asBool().withDefault(false);
        save.register(this, saveKeys.idnSettingsInternalLogContexts).asJson();
    }
    Settings.prototype.componentInit = Settings.prototype.init;
    Settings.prototype.init = function(baseStats) {
        this.componentInit();
    };
    Settings.prototype.componentUpdate = Settings.prototype.update;
    Settings.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }
        return true;
    };
    Settings.prototype.getLogContextEnabled = function(context) {
        if(this[saveKeys.idnSettingsInternalLogContexts][context] !== undefined) {
            return this[saveKeys.idnSettingsInternalLogContexts][context];
        }
        return this.logContextDefaultValue;
    };
    Settings.prototype.setLogContextEnabled = function(context, value) {
        if(this[saveKeys.idnSettingsInternalLogContexts][context] === undefined) {
            this[saveKeys.idnSettingsInternalLogContexts][context] = this.logContextDefaultValue;
        }
        this[saveKeys.idnSettingsInternalLogContexts][context] = value;
    };
    return new Settings();
});

declare('StaticData', function () {
    var component = include('Component','staticData');
    StaticData.prototype = component.prototype();
    StaticData.prototype.$super = parent;
    StaticData.prototype.constructor = StaticData;
    function StaticData() {
        component.construct(this);
        this.id = "StaticData";
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

declare('TemplateProvider', function() {
    var assert = include('Assert','templateProvider');
    
	var data = undefined;
	
    var applyTemplateAttributes = function(template, attributes) {
        assert.isDefined(template);
        assert.isDefined(attributes);
        var result = template;
        for(var key in attributes) {
            result = result.replace(new RegExp('{{'+key+'}}', "gi"), attributes[key]);
        }
        
        return result;
    };
    
    function TemplateProvider() {    	
        this.GetTemplate = function(templateName, attributes) {
        	if(data === undefined) {
        		data = {};
        	}
        	
            var template;
            if(data[templateName] !== undefined) {
                template = data[templateName];
            } else {
                return undefined;
            }
            
            if(attributes !== undefined) {
                return applyTemplateAttributes(template, attributes);
            }
            
            return template;
        };
        
        this.SetTemplate = function(templateName, data) {
        	if(data === undefined) {
        		data = {};
        	}
        	
        	assert.isUndefined(data[templateName]);
        	
        	data[templateName] = data;
        };
        
        this.SetData = function(newData) {
        	data = newData;
        };
    };
    
    return new TemplateProvider();
    
});

declare('UserInterface', function () {
    var component = include('Component','userInterface');
    var save = include('Save','userInterface');
    var saveKeys = include('SaveKeys','userInterface');
    var combatLog = include('CombatLog','userInterface');
    UserInterface.prototype = component.prototype();
    UserInterface.prototype.$super = parent;
    UserInterface.prototype.constructor = UserInterface;
    function UserInterface() {
        component.construct(this);
        this.id = "UserInterface";
        this.needInventoryUpdate = true;
        this.needEquipmentUpdate = true;
        this.combatLog = undefined;
    }
    UserInterface.prototype.componentInit = UserInterface.prototype.init;
    UserInterface.prototype.init = function() {
        this.componentInit();
        this.initLegacyInterface();
        this.initUpgradeButtons();
        this.combatLog = combatLog.create();
        this.combatLog.init(this);
    };
    UserInterface.prototype.componentUpdate = UserInterface.prototype.update;
    UserInterface.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }
        this.updateLegacyInterface(gameTime);
        this.updateUpdateNotice(gameTime);
        this.combatLog.update(gameTime);
        return true;
    }
    UserInterface.prototype.initLegacyInterface = function() {
        $("#itemTooltip").hide();
        $("#itemCompareTooltip").hide();
        $("#itemCompareTooltip2").hide();
        $("#otherTooltip").hide();
        $("#abilityUpgradeTooltip").hide();
        $("#basicTooltip").hide();
        $("#mouseIcon").hide();
        $("#mercenaryArea").hide();
        $("#otherArea").hide();
        $("#inventoryArea").hide();
        $("#playerHealthBarText").hide();
        $("#resurrectionBarArea").hide();
        $("#monsterHealthBarArea").hide();
        $("#inventoryWindow").hide();
        $("#characterWindow").hide();
        $("#mercenariesWindow").hide();
        $("#upgradesWindow").hide();
        $("#questsWindow").hide();
        $("#questTextArea").hide();
        $("#mapWindow").hide();
        $("#leaveBattleButton").hide();
        $("#actionButtonsContainer").hide();
        $("#actionCooldownsArea").hide();
        $("#levelUpButton").hide();
        $("#expBarText").hide();
        $("#statUpgradesWindow").hide();
        $("#abilityUpgradesWindow").hide();
        $(".bleedingIcon").hide();
        $(".burningIcon").hide();
        $(".chilledIcon").hide();
        $("#attackButton").hide();
        $("#healButton").hide();
        $("#iceboltButton").hide();
        $("#fireballButton").hide();
        $("#powerStrikeButton").hide();
        $("#rendCooldownContainer").hide();
        $("#healCooldownContainer").hide();
        $("#iceboltCooldownContainer").hide();
        $("#fireballCooldownContainer").hide();
        $("#powerStrikeCooldownContainer").hide();
        $("#checkboxWhite").hide();
        $("#checkboxGreen").hide();
        $("#checkboxBlue").hide();
        $("#checkboxPurple").hide();
        $("#checkboxOrange").hide();
        $("#updatesWindow").hide();
        $("#statsWindow").hide();
        $("#optionsWindow").hide();
        $("#resetConfirmWindow").hide();
        $(".craftingWindowButton").hide();
        for (var x = 1; x < 11; x++) {
            $(".equipItem" + x).draggable({
                stop: function (event, ui) {
                    var top = ui.offset.top;
                    var left = ui.offset.left;
                    var offset;
                    var itemMoved = false;
                    for (var y = 1; y < (legacyGame.inventory.maxSlots + 1); y++) {
                        offset = $("#inventoryItem" + y).offset();
                        if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                            legacyGame.equipment.unequipItemToSlot(slotNumberSelected - 1, y - 1);
                            itemMoved = true;
                        }
                    }
                    if (!itemMoved && (slotNumberSelected == 8 || slotNumberSelected == 9)) {
                        var otherSlot;
                        if (slotNumberSelected == 9) {
                            otherSlot = 8;
                        }
                        else {
                            otherSlot = 9;
                        }
                        offset = $(".equipItem" + otherSlot).offset();
                        if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                            legacyGame.equipment.swapTrinkets();
                            itemMoved = true;
                        }
                    }
                },
                revert: true,
                scroll: false,
                revertDuration: 0,
                cursorAt: { top: 0, left: 0 }
            });
        }
        for (var x = 1; x < (legacyGame.inventory.maxSlots + 1); x++) {
            $("#inventoryItem" + x).draggable({
                stop: function (event, ui) {
                    var top = ui.offset.top;
                    var left = ui.offset.left;
                    var offset;
                    var itemMoved = false;
                    for (var y = 1; y < (legacyGame.inventory.maxSlots + 1); y++) {
                        if (y != slotNumberSelected) {
                            offset = $("#inventoryItem" + y).offset();
                            if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                                legacyGame.inventory.swapItems(slotNumberSelected - 1, y - 1);
                                itemMoved = true;
                            }
                        }
                    }
                    if (!itemMoved) {
                        for (var y = 1; y < 11; y++) {
                            offset = $(".equipItem" + y).offset();
                            if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                                legacyGame.equipment.equipItemInSlot(legacyGame.inventory.slots[slotNumberSelected - 1], y - 1, slotNumberSelected - 1);
                                itemMoved = true;
                            }
                        }
                    }
                    if (!itemMoved) {
                        offset = $("#characterIconArea").offset();
                        if (left >= offset.left && left < offset.left + 124 && mouseY >= top.top && mouseY < top.top + 204) {
                            legacyGame.equipment.equipItem(legacyGame.inventory.slots[slotNumberSelected - 1], slotNumberSelected - 1);
                            itemMoved = true;
                        }
                    }
                },
                revert: true,
                scroll: false,
                revertDuration: 0,
                cursorAt: { top: 0, left: 0 }
            });
        }
        $("#characterWindow").draggable({drag: function() { updateWindowDepths(document.getElementById("characterWindow")); }, cancel: '.globalNoDrag'});
        $("#mercenariesWindow").draggable({drag: function() { updateWindowDepths(document.getElementById("mercenariesWindow")); }, cancel: '.globalNoDrag'});
        $("#upgradesWindow").draggable({drag: function() { updateWindowDepths(document.getElementById("upgradesWindow")); }, cancel: '.globalNoDrag'});
        $("#questsWindow").draggable({drag: function() { updateWindowDepths(document.getElementById("questsWindow")); }, cancel: '.globalNoDrag'});
        $("#inventoryWindow").draggable({drag: function() { updateWindowDepths(document.getElementById("inventoryWindow")); }, cancel: '.globalNoDrag'});
    };
    UserInterface.prototype.initUpgradeButtons = function() {
        var upgradeArea = $('#upgradesBuyArea');
        for (var i = 0; i < legacyGame.upgradeManager.upgrades.length; i++) {
            var upgrade = legacyGame.upgradeManager.upgrades[i];
            upgrade.id = i;
            var button = $('<div id="buyButton{0}" class="buyButton"></div>'.format(upgrade.id));
            button.mousedown({'id': upgrade.id}, function(args) { upgradeButtonMouseDown(args.data.id); });
            button.mouseup({'id': upgrade.id}, function(args) { upgradeButtonMouseOver(args.data.id); });
            button.mouseover({'id': upgrade.id}, function(args) { upgradeButtonMouseOver(args.data.id); });
            button.mouseout({'id': upgrade.id}, function(args) { upgradeButtonMouseOut(args.data.id); });
            var buttonArea = $('<div id="upgradePurchaseButton{0}" class="buyButtonArea"></div>'.format(upgrade.id));
            button.append(buttonArea);
            var icon = $('<div class="buyButtonIcon"></div>');
            icon.css({background: 'url("includes/images/bigIcons.png") ' + upgrade.iconSourceLeft + 'px ' + upgrade.iconSourceTop + 'px'});
            buttonArea.append(icon);
            var name = $('<div class="mercenaryName">{0}</div>'.format(upgrade.name));
            buttonArea.append(name);
            var cost = $('<div class="mercenaryAmount">{0}</div>'.format(upgrade.cost.formatMoney(0)));
            cost.css({left: '53px'});
            buttonArea.append(cost);
            var coinIcon = $('<div class="goldCoin"></div>');
            coinIcon.css({position: 'absolute', top: '28px', width: '12px', height: '12px', left: '41px'});
            buttonArea.append(coinIcon);
            upgradeArea.append(button);
            /*var element = document.getElementById('buyButton' + upgrade.id);
            element.onmouseover = function () { upgradeButtonMouseOver(element, upgrade.id); };
            element.onmousedown = function () { upgradeButtonMouseDown(upgrade.id); };
            element.onmouseup = function () { upgradeButtonMouseOver(element, upgrade.id); };
            element.onmouseout = function () { upgradeButtonMouseOut(upgrade.id); };*/
        }
    }
    UserInterface.prototype.updateLegacyInterface = function(gameTime) {
        $('#version').text('Version ' + game.getCurrentVersion());
        if(this.needInventoryUpdate === true) {
            this.updateInventory(gameTime);
        }
        if(this.needEquipmentUpdate === true) {
            this.updateEquipment(gameTime);
        }
        if (this.skillPoints > 0) {
            $("#levelUpButton").show();
        }
        this.updateGoldDisplay(gameTime);
        this.updatePlayerAndMonster(gameTime);
        this.updateBattleDisplay(gameTime);
        this.updateUpgrades(gameTime);
    };
    UserInterface.prototype.updateBattleDisplay = function(gameTime) {
        $('#enterBattleButton').text("Enter Battle (Lvl {0})".format(legacyGame.battleLevel));
        $('#leaveBattleButton').text("Leave Battle (Lvl {0})".format(legacyGame.battleLevel));
        if(legacyGame.player.skillPoints > 0) {
            $('#levelUpButton').text("Level Up ({0})".format(legacyGame.player.skillPoints));
            $('#levelUpButton').show();
        } else {
            $('#levelUpButton').hide();
        }
        if (legacyGame.inBattle == false && legacyGame.player.alive) {
            $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
        }
        if(legacyGame.inBattle === true) {
            $('#enterBattleButton').hide();
            $("#battleLevelDownButton").hide();
            $("#battleLevelUpButton").hide();
        } else {
            $('#enterBattleButton').show();
            $("#battleLevelDownButton").show();
            $("#battleLevelUpButton").show();
        }
    };
    UserInterface.prototype.updateInventory = function(gameTime) {
        var slots = legacyGame.inventory.slots;
        for (var x = 0; x < slots.length; x++) {
            var control = $("#inventoryItem" + (x + 1));
            if (slots[x] != null) {
                control.css('background', 'url("includes/images/itemSheet3.png") ' + slots[x].iconSourceX + 'px ' + slots[x].iconSourceY + 'px');
            } else {
                control.css('background', 'url("includes/images/NULL.png")');
            }
        }
    };
    UserInterface.prototype.updateEquipment = function(gameTime) {
        var slots = legacyGame.equipment.slots;
        for (var x = 0; x < slots.length; x++) {
            var control = $(".equipItem" + (x + 1));
            if (slots[x] != null) {
                control.css('background', 'url("includes/images/itemSheet3.png") ' + slots[x].iconSourceX + 'px ' + slots[x].iconSourceY + 'px');
            } else  {
                control.css('background', 'url("includes/images/NULL.png")');
            }
        }
    };
    UserInterface.prototype.updateGoldDisplay = function(gameTime) {
        var gameAreaHalfWidth = ($("#gameArea").width() / 2);
        var element = $('#goldAmount');
        element.text(legacyGame.player.gold.formatMoney(2));
        var leftReduction = element[0].scrollWidth / 2;
        element.css('left', (gameAreaHalfWidth - leftReduction) + 'px');
        $("#goldCoin").css('left', (gameAreaHalfWidth - leftReduction - 21) + 'px');
        var currentGoldPerSecond = legacyGame.mercenaryManager.getGps();
        element = $("#gps");
        element.text(currentGoldPerSecond + 'gps');
        var leftReduction = element[0].scrollWidth / 2;
        element.css('left', (gameAreaHalfWidth - leftReduction) + 'px');
        if(legacyGame.mercenaryManager.gpsReduction !== 0) {
            element.css('color', '#ff0000');
        } else {
            element.css('color', '#ffd800');
        }
    };
    UserInterface.prototype.updatePlayerAndMonster = function(gameTime) {
        var hpBar = $("#playerHealthBar");
        hpBar.css('width', 198 * (legacyGame.player.health / legacyGame.player.getMaxHealth()));
        hpBar.css('height', '23');
        document.getElementById("playerHealthBarText").innerHTML = Math.floor(legacyGame.player.health) + '/' + Math.floor(legacyGame.player.getMaxHealth());
        if (legacyGame.options.alwaysDisplayPlayerHealth) {
            $("#playerHealthBarText").show();
        } else {
            $("#playerHealthBarText").hide();
        }
        var expBar = $("#expBar");
        expBar.css('width', 718 * (legacyGame.player.experience / legacyGame.player.experienceRequired));
        expBar.css('height', '13');
        document.getElementById("expBarText").innerHTML = Math.floor(legacyGame.player.experience) + '/' + legacyGame.player.experienceRequired;
        if (legacyGame.options.alwaysDisplayExp) {
            $("#expBarText").show();
        } else {
            $("#expBarText").hide();
        }
        hpBar = $("#monsterHealthBar");
        hpBar.css('width', 198 * (legacyGame.monster.health / legacyGame.monster.maxHealth));
        hpBar.css('height', '23');
        hpBar.css('color', legacyGame.monsterCreator.getRarityColour(legacyGame.monster.rarity));
        if (legacyGame.displayMonsterHealth) {
            document.getElementById("monsterName").innerHTML = Math.floor(legacyGame.monster.health) + '/' + Math.floor(legacyGame.monster.maxHealth);
        }
        else {
            document.getElementById("monsterName").innerHTML = "(Lv" + legacyGame.monster.level + ") " + legacyGame.monster.name;
        }
        $("#monsterName").css('color', legacyGame.monsterCreator.getRarityColour(legacyGame.monster.rarity));
    };
    UserInterface.prototype.updateUpgrades = function(gameTime) {
        for (var i = 0; i < legacyGame.upgradeManager.upgrades.length; i++) {
            var upgrade = legacyGame.upgradeManager.upgrades[i];
            var element = $('#buyButton' + upgrade.id);
            if(element.length <= 0) {
                continue;
            }
            if(upgrade.available === true && upgrade.purchased === false) {
                element.show();
            } else {
                element.hide();
            }
        }
    };
    UserInterface.prototype.updateUpdateNotice = function(gameTime) {
        var currentVersion = game.getCurrentVersion();
        var versionData = game.getVersionCheckData();
        var control = $('#fbUpdate');
        if(versionData !== undefined && versionData.version > currentVersion) {
            control.text('Update {0} Available!'.format(versionData.version));
            control.show();
            return;
        }
        control.hide();
    };
    UserInterface.prototype.updateCombatLog = function(gameTime) {
    };
    return new UserInterface();
});

declare('CombatLog', function() {
    var component = include('Component','combatLog');
    var eventAggregate = include('EventAggregate','combatLog');
    var staticData = include('StaticData','combatLog');
    var coreUtils = include('CoreUtils','combatLog');
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
    };
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
            contentArea.scrollTop(1E10);
        }
        return true;
    };
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

Endless.main = function() {
	var assert = include('Assert','main');
	var debug = include('Debug','main');
	var staticData = include('StaticData','main');
	var game = include('Game','main');
	var gameTime = include('GameTime','main');
	var userInterface = include('UserInterface','main');
	debug.logInfo("Initializing");
	window.game = game;
	
	staticData.setRoot("");
	
	include('TemplateProvider').SetData(include('TemplateContent'));
	
	debug.init();
	staticData.init();
    game.init();
    userInterface.init();
    var interval = 1000 / 60;
    var intervalHook = setInterval(function() {
        onUpdate();
    }, interval);
    
    requestAnimationFrame(onUIUpdate);
	var gameTime = gameTime.create();
	function onUpdate() {
		if(assert.hasAsserted() === true) {
			clearInterval(intervalHook);
			console.assert(false, "Aborting update cycle, asserts occured!");
			return;
		}
		Endless.currentUpdateTick++;
		gameTime.update();
		if(Endless.isDebug === true) {
			debug.update(gameTime);
		}
	
	    Endless.resetFrame();
		staticData.update(gameTime);
	    game.update(gameTime);
	};
	
	function onUIUpdate() {
		if(assert.hasAsserted() === true) {
			console.assert(false, "Aborting UI update cycle, asserts occured!");
			return;
		}
		Endless.currentUpdateTick++;
		userInterface.update(gameTime);
	    
	    requestAnimationFrame(onUIUpdate);
	};
};
$(document).ready(function() {
	Endless.main();
});

