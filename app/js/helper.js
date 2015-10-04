var renderItems = function(items, column) {
  var reformedItems = []
  var row = [];
  for (var i = 0; i < items.length; i++) {
    row.push(items[i]);
    if ((i+1) % column0 == 0) {
      reformedItems.push(row);
      row = [];
    }
  }
  if (row != [])
    reformedItems.push(row);
  return reformedItems;
};
