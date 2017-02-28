var Main = (function($) {
  var count = 100,

      // The second parameter is the seed, remove it to get a different
      // set and order on page refresh. That is:
      // var nodes = generateNodes(50000);
      nodes = generateNodes(count, 1234567),

      content = '';
      totalEdges = _.reduce(nodes, function(count, value) {
          return count + _.size(value);
      }, 0),
      averageEdgeCount = (totalEdges / count).toFixed(2);

  content = [
    'There are a total of',
    totalEdges.toLocaleString(), 'total edges',
    'for', count.toLocaleString(), 'nodes.',
    'This averages to', averageEdgeCount, 'edges per node'
  ].join(' ');

  $('caption').html(content);

////////////////////////////////////////

  var sortedArray;

  var createRow = function (node) {
    var row = document.createElement('tr');
    var nodeCell = document.createElement('td');
    var connectionsCell = document.createElement('td');

    // get node connections
    var nodeProp = nodes[node]
    var connections = Object.keys(nodeProp);
    var connectedData = connections.join(", ");

    // create cells and return row
    nodeCell.innerHTML = node;
    connectionsCell.innerHTML = connectedData;
    row.appendChild(nodeCell);
    row.appendChild(connectionsCell);

    return row;
  }

  var displayNodes = function (nA, direction) {
    var nodesArraylength = nA.length
    var displaySetAmount = 0;
    var start = 0;

    // set the number of nodes to display
    if (direction === 'desc') {
      displaySetAmount = nodesArraylength - 1;
      start = (nodesArraylength > 500) ? nodesArraylength - 500 : 0
    } else {
      displaySetAmount = (nodesArraylength > 500) ? 500 : nodesArraylength
    }

    getNodesSetToDisplay(nA, direction, start, displaySetAmount);

    // throttle onscroll action and displays the next set of nodes
    window.onscroll = Helpers.throttle(function () {
      if (direction === 'desc') {
        displaySetAmount = start-1;
        start = ((start - 500) > 0) ? start - 500 : 0;
      } else {
        start = displaySetAmount;
        displaySetAmount = ((displaySetAmount + 500) < nodesArraylength) ? displaySetAmount + 500 : nodesArraylength
      }
      getNodesSetToDisplay(nA, direction, start, displaySetAmount)
    }, 500)

  }

  var getNodesSetToDisplay = function (array, direction, beginAt, stopAt) {
    var tbody = document.querySelector('tbody');

    // invoke create row on each node and append to the body
    if (direction === 'desc') {
      for (var i = stopAt; i >= beginAt ; i--) {
        tbody.appendChild(createRow(array[i]));
      }
    } else {
      for (var i = beginAt; i < stopAt; i++) {
        tbody.appendChild(createRow(array[i]));
      }
    }
  }

  var buildPath = function (v, pred) {
    var path = v;
    var node = v
    while (pred[node]) {
      path = pred[node] + ' -> ' + path
      node = pred[node]
    }
    return path
  };

  var searchForPath = function (graph, fromNode, toNode) {
    // BFS to find path
    var queue = [];
    var visited = {};
    var parents = {};
    var vertex;

    queue.push(fromNode);
    visited[fromNode] = true;
    parents[fromNode] = null;

    while (queue.length !== 0) {
      vertex = queue.shift();

      if (vertex === toNode) {
        return buildPath(vertex, parents)
      }

      for (connection in graph[vertex]) {
        if (!visited.hasOwnProperty(connection)) {
          queue.push(connection);
          visited[connection] = true
        }

        if (!parents.hasOwnProperty(connection)) {
          parents[connection] = vertex
        }
      }
    }
  };

  var findSmallest = function  (q, dist) {
    var leastDist = Infinity;
    var smallest, idx;
    for (var i = 0; i < q.length; i++) {
      if (dist[q[i]] <= leastDist) {
        leastDist = dist[q[i]]
        smallest = q[i];
        idx = i;
      }
    }
    return [smallest, idx];
  };

  var findMinimumWeightPath = function (graph, fromNode, toNode) {
    // Dijkstra
    var dist = {};
    var prev = {};
    var queue = [];

    for (var v in graph) {
      dist[v] = Infinity;
      prev[v] = undefined;
      queue.push(v)
    }
    dist[fromNode] = 0;

    while (queue.length !== 0) {

      // find smallest in queue
      var leastDist = findSmallest(queue, dist)
      var vertex = queue.splice(leastDist[1], 1)

      smallest = leastDist[0]

      if (smallest === toNode) {
        return buildPath(smallest, prev)
      }

      for (connection in graph[smallest]) {
        var alt = dist[smallest] + graph[smallest][connection];
        if (alt < dist[connection]) {
          dist[connection] = alt
          prev[connection] = smallest
        }
      }
    }
  };

  var displayPathBlocks = function (array) {
    // build blocks for shortest path
    var pathDiv = document.querySelector('.path');
    var child = pathDiv.querySelector('ul');
    var ul = document.createElement('ul');
    var path = array.split(' -> ');

    pathDiv.style.background = "#ffffff";
    pathDiv.style.color = "#000000";

    if ( child != null ) {
      pathDiv.removeChild(child);
    }

    for (var i = 0; i < path.length; i++) {
      var firstLi = document.createElement('li');
      firstLi.innerHTML = path[i];
      ul.appendChild(firstLi);
    }
    pathDiv.appendChild(ul);
  };

  var displayMinPathBlocks = function (array) {
    // Build blocks for minimum weight path
    var minDiv = document.querySelector('.min');
    var child = minDiv.querySelector('ul');
    var ul = document.createElement('ul');
    var path = array.split(' -> ');

    minDiv.style.background = "#ffffff";
    minDiv.style.color = "#000000";

    if (child != null) {
      minDiv.removeChild(child);
    }

    for (var i = 0; i < path.length; i++) {
      var firstLi = document.createElement('li');
      firstLi.innerHTML = path[i];
      ul.appendChild(firstLi);
    }
    minDiv.appendChild(ul);
  };

  var findPathClickAction = function () {
    var fromInput = document.getElementById('from').value;
    var toInput = document.getElementById('to').value;

    // get path for node inputs
    var nodePath = searchForPath(nodes, fromInput, toInput);
    var minWeightPath = findMinimumWeightPath(nodes, fromInput, toInput);

    // append results
    displayPathBlocks(nodePath);
    displayMinPathBlocks(minWeightPath);
  };

  var sortClickAction = function () {
    var nodeListCol = document.querySelector('.col-1');
    var tbody = document.querySelector('tbody');
    var sortBoth = document.querySelector('.both');
    var sortUp = document.querySelector('.sort-up');
    var sortDown = document.querySelector('.sort-down');

    // sort direction arrow
    if (sortBoth) {
      sortBoth.style.display = 'none';
      sortUp.style.display = 'inline-block'
    }

    // remove row elements
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
    }

    if (nodeListCol.classList.contains("asc")) {
      nodeListCol.classList.remove('asc');
      nodeListCol.classList.add('desc');
      sortUp.style.display = 'none';
      sortDown.style.display = 'inline-block'
      displayNodes(sortedArray, 'desc');
    } else {
      nodeListCol.classList.remove('desc');
      nodeListCol.classList.add('asc');
      sortDown.style.display = 'none';
      sortUp.style.display = 'inline-block';
      displayNodes(sortedArray, 'asc');
    }
  };

  var registerListeners = function () {
    var nodeListCol = document.querySelector('.col-1');
    var find = document.querySelector('#find');

    nodeListCol.addEventListener('click', sortClickAction);
    find.addEventListener('click', findPathClickAction);
  };


  return {
    init: function () {
      var nodesArray = Helpers.createArray(nodes);
      displayNodes(nodesArray)
      registerListeners();

      sortedArray = Helpers.createArray(nodes);
      sortedArray = Helpers.sortNodesArray(sortedArray)
    }
  }
}(jQuery));

Main.init()
