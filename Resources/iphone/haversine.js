function haversine(lat1, lon1, lat2, lon2) {
    var x1 = lat2 - lat1;
    var dLat = x1.toRad();
    var x2 = lon2 - lon1;
    var dLon = x2.toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
};

exports.distance = haversine;