var Main = (function($) {
  var count = 10,

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

    // get connections
    var nodeProp = nodes[node]
    var connections = Object.keys(nodeProp);
    var connectedData = connections.join(", ");

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

    if (direction === 'desc') {
      displaySetAmount = nodesArraylength-1;
      start = (nodesArraylength > 500) ? nodesArraylength - 500 : 0
    } else {
      displaySetAmount = (nodesArraylength > 500) ? 500 : nodesArraylength
    }

    getNodesSetToDisplay(nA, direction, start, displaySetAmount);

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
    // console.log(array, direction, beginAt, stopAt);
    var tbody = document.querySelector('tbody');

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

  var buildMinimumWeightPath = function (v, pred) {
    var path = v;
    var node = v

    while (pred[node]) {
      path = pred[node] + ' -> ' + path
      node = pred[node]
    }
    return path
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
        return buildMinimumWeightPath(smallest, prev)
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

  var sortClickAction = function () {
    var nodeListCol = document.querySelector('.col-1');
    var tbody = document.querySelector('tbody');

    // remove row elements
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
    }
    // call sort
    if (nodeListCol.classList.contains("asc")) {
      nodeListCol.classList.remove('asc');
      nodeListCol.classList.add('desc');
      displayNodes(sortedArray, 'desc');

    } else {
      nodeListCol.classList.remove('desc');
      nodeListCol.classList.add('asc');
      displayNodes(sortedArray, 'asc')
    }
  }

  var findPathClickAction = function () {
    var fromInput = document.getElementById('from').value;
    var toInput = document.getElementById('to').value;
    var pathDiv = document.querySelector('.path');
    var minDiv = document.querySelector('.min');
    var p = document.createElement('p');

    var nodePath = searchForPath(nodes, fromInput, toInput)
    p.innerHTML = nodePath
    pathDiv.appendChild(p)
  }

  var registerListeners = function () {
    var nodeListCol = document.querySelector('.col-1');
    var find = document.querySelector('#find')

    nodeListCol.addEventListener('click', sortClickAction);
    find.addEventListener('click', findPathClickAction)
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
