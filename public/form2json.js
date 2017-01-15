function form2Json(params)
{
  var pairs = params.split('&'),
      result = {};

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('='),
        key = decodeURIComponent(pair[0]),
        value = decodeURIComponent(pair[1]),
        isArray = /\[\]$/.test(key),
        dictMatch = key.match(/^(.+)\[([^\]]+)\]$/);

    if (dictMatch) {
      key = dictMatch[1];
      var subkey = dictMatch[2];

      result[key] = result[key] || {};
      result[key][subkey] = value;
    } else if (isArray) {
      key = key.substring(0, key.length-2);
      result[key] = result[key] || [];
      result[key].push(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
