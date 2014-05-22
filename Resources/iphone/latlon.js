function LatLon(lat, lon, rad) {
    "undefined" == typeof rad && (rad = 6371);
    this._lat = "number" == typeof lat ? lat : "string" == typeof lat && "" != lat.trim() ? +lat : 0/0;
    this._lon = "number" == typeof lon ? lon : "string" == typeof lon && "" != lon.trim() ? +lon : 0/0;
    this._radius = "number" == typeof rad ? rad : "string" == typeof rad && "" != trim(lon) ? +rad : 0/0;
}

LatLon.prototype.distanceTo = function(point, precision) {
    "undefined" == typeof precision && (precision = 4);
    var R = this._radius;
    var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
    var lat2 = point._lat.toRad(), lon2 = point._lon.toRad();
    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d.toPrecisionFixed(precision);
};

LatLon.prototype.bearingTo = function(point) {
    var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
    var dLon = (point._lon - this._lon).toRad();
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    var brng = Math.atan2(y, x);
    return (brng.toDeg() + 360) % 360;
};

LatLon.prototype.finalBearingTo = function(point) {
    var lat1 = point._lat.toRad(), lat2 = this._lat.toRad();
    var dLon = (this._lon - point._lon).toRad();
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    var brng = Math.atan2(y, x);
    return (brng.toDeg() + 180) % 360;
};

LatLon.prototype.midpointTo = function(point) {
    lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
    lat2 = point._lat.toRad();
    var dLon = (point._lon - this._lon).toRad();
    var Bx = Math.cos(lat2) * Math.cos(dLon);
    var By = Math.cos(lat2) * Math.sin(dLon);
    lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
    lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
    lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    return new LatLon(lat3.toDeg(), lon3.toDeg());
};

LatLon.prototype.destinationPoint = function(brng, dist) {
    dist = "number" == typeof dist ? dist : "string" == typeof dist && "" != dist.trim() ? +dist : 0/0;
    dist /= this._radius;
    brng = brng.toRad();
    var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
    var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
    lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    return new LatLon(lat2.toDeg(), lon2.toDeg());
};

LatLon.intersection = function(p1, brng1, p2, brng2) {
    brng1 = "number" == typeof brng1 ? brng1 : "string" == typeof brng1 && "" != trim(brng1) ? +brng1 : 0/0;
    brng2 = "number" == typeof brng2 ? brng2 : "string" == typeof brng2 && "" != trim(brng2) ? +brng2 : 0/0;
    lat1 = p1._lat.toRad(), lon1 = p1._lon.toRad();
    lat2 = p2._lat.toRad(), lon2 = p2._lon.toRad();
    brng13 = brng1.toRad(), brng23 = brng2.toRad();
    dLat = lat2 - lat1, dLon = lon2 - lon1;
    dist12 = 2 * Math.asin(Math.sqrt(Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)));
    if (0 == dist12) return null;
    brngA = Math.acos((Math.sin(lat2) - Math.sin(lat1) * Math.cos(dist12)) / (Math.sin(dist12) * Math.cos(lat1)));
    isNaN(brngA) && (brngA = 0);
    brngB = Math.acos((Math.sin(lat1) - Math.sin(lat2) * Math.cos(dist12)) / (Math.sin(dist12) * Math.cos(lat2)));
    if (Math.sin(lon2 - lon1) > 0) {
        brng12 = brngA;
        brng21 = 2 * Math.PI - brngB;
    } else {
        brng12 = 2 * Math.PI - brngA;
        brng21 = brngB;
    }
    alpha1 = (brng13 - brng12 + Math.PI) % (2 * Math.PI) - Math.PI;
    alpha2 = (brng21 - brng23 + Math.PI) % (2 * Math.PI) - Math.PI;
    if (0 == Math.sin(alpha1) && 0 == Math.sin(alpha2)) return null;
    if (0 > Math.sin(alpha1) * Math.sin(alpha2)) return null;
    alpha3 = Math.acos(-Math.cos(alpha1) * Math.cos(alpha2) + Math.sin(alpha1) * Math.sin(alpha2) * Math.cos(dist12));
    dist13 = Math.atan2(Math.sin(dist12) * Math.sin(alpha1) * Math.sin(alpha2), Math.cos(alpha2) + Math.cos(alpha1) * Math.cos(alpha3));
    lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist13) + Math.cos(lat1) * Math.sin(dist13) * Math.cos(brng13));
    dLon13 = Math.atan2(Math.sin(brng13) * Math.sin(dist13) * Math.cos(lat1), Math.cos(dist13) - Math.sin(lat1) * Math.sin(lat3));
    lon3 = lon1 + dLon13;
    lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    return new LatLon(lat3.toDeg(), lon3.toDeg());
};

LatLon.prototype.rhumbDistanceTo = function(point) {
    var R = this._radius;
    var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
    var dLat = (point._lat - this._lat).toRad();
    var dLon = Math.abs(point._lon - this._lon).toRad();
    var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
    var q = isFinite(dLat / dPhi) ? dLat / dPhi : Math.cos(lat1);
    Math.abs(dLon) > Math.PI && (dLon = dLon > 0 ? -(2 * Math.PI - dLon) : 2 * Math.PI + dLon);
    var dist = Math.sqrt(dLat * dLat + q * q * dLon * dLon) * R;
    return dist.toPrecisionFixed(4);
};

LatLon.prototype.rhumbBearingTo = function(point) {
    var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
    var dLon = (point._lon - this._lon).toRad();
    var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
    Math.abs(dLon) > Math.PI && (dLon = dLon > 0 ? -(2 * Math.PI - dLon) : 2 * Math.PI + dLon);
    var brng = Math.atan2(dLon, dPhi);
    return (brng.toDeg() + 360) % 360;
};

LatLon.prototype.rhumbDestinationPoint = function(brng, dist) {
    var R = this._radius;
    var d = parseFloat(dist) / R;
    var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
    brng = brng.toRad();
    var dLat = d * Math.cos(brng);
    1e-10 > Math.abs(dLat) && (dLat = 0);
    var lat2 = lat1 + dLat;
    var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
    var q = isFinite(dLat / dPhi) ? dLat / dPhi : Math.cos(lat1);
    var dLon = d * Math.sin(brng) / q;
    Math.abs(lat2) > Math.PI / 2 && (lat2 = lat2 > 0 ? Math.PI - lat2 : -Math.PI - lat2);
    lon2 = (lon1 + dLon + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    return new LatLon(lat2.toDeg(), lon2.toDeg());
};

LatLon.prototype.rhumbMidpointTo = function(point) {
    lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
    lat2 = point._lat.toRad(), lon2 = point._lon.toRad();
    Math.abs(lon2 - lon1) > Math.PI && (lon1 += 2 * Math.PI);
    var lat3 = (lat1 + lat2) / 2;
    var f1 = Math.tan(Math.PI / 4 + lat1 / 2);
    var f2 = Math.tan(Math.PI / 4 + lat2 / 2);
    var f3 = Math.tan(Math.PI / 4 + lat3 / 2);
    var lon3 = ((lon2 - lon1) * Math.log(f3) + lon1 * Math.log(f2) - lon2 * Math.log(f1)) / Math.log(f2 / f1);
    isFinite(lon3) || (lon3 = (lon1 + lon2) / 2);
    lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    return new LatLon(lat3.toDeg(), lon3.toDeg());
};

LatLon.prototype.lat = function(format, dp) {
    if ("undefined" == typeof format) return this._lat;
    return Geo.toLat(this._lat, format, dp);
};

LatLon.prototype.lon = function(format, dp) {
    if ("undefined" == typeof format) return this._lon;
    return Geo.toLon(this._lon, format, dp);
};

LatLon.prototype.toString = function(format, dp) {
    "undefined" == typeof format && (format = "dms");
    return Geo.toLat(this._lat, format, dp) + ", " + Geo.toLon(this._lon, format, dp);
};

"undefined" == typeof Number.prototype.toRad && (Number.prototype.toRad = function() {
    return this * Math.PI / 180;
});

"undefined" == typeof Number.prototype.toDeg && (Number.prototype.toDeg = function() {
    return 180 * this / Math.PI;
});

"undefined" == typeof Number.prototype.toPrecisionFixed && (Number.prototype.toPrecisionFixed = function(precision) {
    var n = this.toPrecision(precision);
    n = n.replace(/(.+)e\+(.+)/, function(n, sig, exp) {
        sig = sig.replace(/\./, "");
        l = sig.length - 1;
        while (exp-- > l) sig += "0";
        return sig;
    });
    n = n.replace(/(.+)e-(.+)/, function(n, sig, exp) {
        sig = sig.replace(/\./, "");
        while (exp-- > 1) sig = "0" + sig;
        return "0." + sig;
    });
    return n;
});

"undefined" == typeof String.prototype.trim && (String.prototype.trim = function() {
    return String(this).replace(/^\s\s*/, "").replace(/\s\s*$/, "");
});

var Geo = {};

Geo.parseDMS = function(dmsStr) {
    if ("object" == typeof deg) throw new TypeError("Geo.parseDMS - dmsStr is [DOM?] object");
    if ("number" == typeof dmsStr && isFinite(dmsStr)) return Number(dmsStr);
    var dms = String(dmsStr).trim().replace(/^-/, "").replace(/[NSEW]$/i, "").split(/[^0-9.,]+/);
    "" == dms[dms.length - 1] && dms.splice(dms.length - 1);
    if ("" == dms) return 0/0;
    switch (dms.length) {
      case 3:
        var deg = dms[0] / 1 + dms[1] / 60 + dms[2] / 3600;
        break;

      case 2:
        var deg = dms[0] / 1 + dms[1] / 60;
        break;

      case 1:
        var deg = dms[0];
        break;

      default:
        return 0/0;
    }
    /^-|[WS]$/i.test(dmsStr.trim()) && (deg = -deg);
    return Number(deg);
};

Geo.toDMS = function(deg, format, dp) {
    if ("object" == typeof deg) throw new TypeError("Geo.toDMS - deg is [DOM?] object");
    if (isNaN(deg)) return null;
    "undefined" == typeof format && (format = "dms");
    if ("undefined" == typeof dp) switch (format) {
      case "d":
        dp = 4;
        break;

      case "dm":
        dp = 2;
        break;

      case "dms":
        dp = 0;
        break;

      default:
        format = "dms";
        dp = 0;
    }
    deg = Math.abs(deg);
    switch (format) {
      case "d":
        d = deg.toFixed(dp);
        100 > d && (d = "0" + d);
        10 > d && (d = "0" + d);
        dms = d + "°";
        break;

      case "dm":
        var min = (60 * deg).toFixed(dp);
        var d = Math.floor(min / 60);
        var m = (min % 60).toFixed(dp);
        100 > d && (d = "0" + d);
        10 > d && (d = "0" + d);
        10 > m && (m = "0" + m);
        dms = d + "°" + m + "′";
        break;

      case "dms":
        var sec = (3600 * deg).toFixed(dp);
        var d = Math.floor(sec / 3600);
        var m = Math.floor(sec / 60) % 60;
        var s = (sec % 60).toFixed(dp);
        100 > d && (d = "0" + d);
        10 > d && (d = "0" + d);
        10 > m && (m = "0" + m);
        10 > s && (s = "0" + s);
        dms = d + "°" + m + "′" + s + "″";
    }
    return dms;
};

Geo.toLat = function(deg, format, dp) {
    var lat = Geo.toDMS(deg, format, dp);
    return null == lat ? "–" : lat.slice(1) + (0 > deg ? "S" : "N");
};

Geo.toLon = function(deg, format, dp) {
    var lon = Geo.toDMS(deg, format, dp);
    return null == lon ? "–" : lon + (0 > deg ? "W" : "E");
};

Geo.toBrng = function(deg, format, dp) {
    deg = (Number(deg) + 360) % 360;
    var brng = Geo.toDMS(deg, format, dp);
    return null == brng ? "–" : brng.replace("360", "0");
};

module.exports = LatLon;