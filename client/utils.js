var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

function deduplicate(a) {
  var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

  return a.filter(function(item) {
    var type = typeof item;
    if(type in prims)
      return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
    else {
      if (item.hasOwnProperty("id")) {
        return objs.indexOf(item.id) >= 0 ? false : objs.push(item.id);
      }
      return objs.indexOf(item) >= 0 ? false : objs.push(item);
    }
  });
}

function idx(map, key, defaultValue) {
  if (map instanceof Object) {
    if (key in map) {
      return map[key]
    }
  }
  return defaultValue;
}

function distSqr(p1, p2) {
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
}

function lerp(a, b, pct) {
  return (b - a) * pct + a;
}

function triangle(a, b, c, pct) {
  if (pct < 0.5) {
    return lerp(a, b, pct / 0.5);
  }
  return lerp(b, c, (pct - 0.5) / 0.5);
}

function getRandomFromWeightedList(randNum, weightedList) {
  var value = null;
  var totalWeight = 0;
  weightedList.forEach((weightedItem) => { totalWeight += weightedItem.weight; });
  if (totalWeight <= 0) { throw new Error("Invalid spawn weights"); }

  var r = Math.floor(randNum * totalWeight);
  for (var i = 0; i < weightedList.length; i++) {
    r -= weightedList[i].weight;
    value = weightedList[i].value;
    if (r < 0) {
      return value;
    }
  }
}

function remove_duplicates (a) {
  var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

  return a.filter(function(item) {
    var type = typeof item;
    if(type in prims)
      return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
    else
      return objs.indexOf(item) >= 0 ? false : objs.push(item);
  });
}
