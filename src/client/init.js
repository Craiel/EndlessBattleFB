// set the main namespace
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

Number.prototype.formatPercentage = function(decimals) {
    return this.formatMoney(decimals) + '%';
};

Number.prototype.formatPercentageMultiplier = function() {
    return (this * 100).formatPercentage();
};

Number.prototype.formatMultiplier = function() {
    return (this * 100).formatMoney(2) + '%';
};

var StrLoc = function(str) {
	return str;
};

// #IfDebug
Endless.isDebug = true;
// #EndIf

if (typeof window !== 'undefined') {
    declare("$", jQuery);
} else {
    console.log("Running in non-browser mode, exiting...");
}
