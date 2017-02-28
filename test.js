var nodes = {
  node0: {
    node2: 67,
    node3: 68,
    node5: 6,
    node6: 88,
    node7: 41,
    node8: 20
  },
  node1: {
    node4: 99,
    node5: 73,
    node6: 29,
    node7: 29,
    node8: 97,
    node9: 35
  },
  node2: {
    node0: 67,
    node5: 95,
    node6: 17,
    node7: 96,
    node8: 70
  },
  node3: {
    node0: 68,
    node4: 32,
    node5: 90,
    node7: 35,
    node8: 41
  },
  node4:{
    node1: 99,
    node3: 32,
    node5: 29,
    node6: 69,
    node7: 58,
    node3: 75
  },
  node5:{
    node0: 6,
    node1: 73,
    node2: 95,
    node3: 90,
    node4: 29,
    node7: 33,
    node9: 10
  },
  node6:{
    node0: 88,
    node1: 29,
    node2: 17,
    node4: 69,
    node7: 71
  },
  node7:{
    node0: 41,
    node1: 29,
    node2: 96,
    node3: 35,
    node4: 58,
    node5: 33,
    node6: 71,
    node8: 72,
    node9: 77
  },
  node8:{
    node0: 20,
    node1: 97,
    node2: 70,
    node3: 41,
    node7: 72
  },
  node9:{
    node1: 35,
    node4: 75,
    node5: 10,
    node7: 77
  }
}
var newNodes = {
  node0: {
    node1: 6,
    node2: 82,
    node3: 15
  },
  node1: {
    node0: 6,
    node2: 61,
    node3: 96
  },
  node2: {
    node0: 82,
    node1: 61,
    node3: 95
  },
  node3: {
    node0: 15,
    node1: 96,
    node2: 95
  }
}
var buildPath = function (v, pred) {
  var path = v;
  var node = v
  while (pred[node] !== null) {
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
  console.log(queue);
var count = 0
  while (queue.length !== 0) {
      console.log(count);
    if (count > 100){
      return
    }
    // find smallest in queue
    var leastDist = findSmallest(queue, dist)
    var vertex = queue.splice(leastDist[1], 1)

    smallest = leastDist[0]

    console.log(queue, leastDist);

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
    count++
  }
};


console.log(findMinimumWeightPath(newNodes, 'node0', 'node3'))
