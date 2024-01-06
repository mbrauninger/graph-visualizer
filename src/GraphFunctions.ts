import { DISPLAY_WIDTH, DISPLAY_HEIGHT, ALPHABET } from "./Constants";
import { dijkstra } from "./Traversals";
import { Graph } from "./Types";

/**
 * Generates a random integer between two values.
 * @param min - The minimum value in the range.
 * @param max - The maximum value in the range.
 * @returns
 */
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generates a graph with random weights and admissible (but not consistent) heuristics.
 * Graph conforms to a structural pattern: every odd row has 5 nodes and every even row has 6.
 * Each node connects to nodes that immediately surround it.
 * Heuristics are generated for every node by running Dijkstra from that node to the goal node.
 * A random value from 1 to the value returned by Dijkstra will be returned for the heuristic value,
 * and this will help A* sniff out the finish since the maximum possible heuristic value will be lower
 * as the algorithm gets closer to the goal. Since the graph is random, I can't make the heuristic
 * consistent, so this is a good pattern to show how A* can speed up a search and still find a
 * reasonably low path cost.
 * @param size - The size of the graph.
 * @param startingNode
 * @param endNode
 * @returns
 */
export function generateGraph(
  size: number,
  startingNode: string,
  endNode: string,
) {
  function getX(i: number, evenRow: boolean) {
    if (evenRow) {
      if (i === 0) {
        return DISPLAY_WIDTH / 12;
      } else if (i === 1) {
        return (3 * DISPLAY_WIDTH) / 12;
      } else if (i === 2) {
        return (5 * DISPLAY_WIDTH) / 12;
      } else if (i === 3) {
        return (7 * DISPLAY_WIDTH) / 12;
      } else if (i === 4) {
        return (9 * DISPLAY_WIDTH) / 12;
      } else {
        return (11 * DISPLAY_WIDTH) / 12;
      }
    } else {
      if (i === 0) {
        return DISPLAY_WIDTH / 6;
      } else if (i === 1) {
        return DISPLAY_WIDTH / 3;
      } else if (i === 2) {
        return DISPLAY_WIDTH / 2;
      } else if (i === 3) {
        return (2 * DISPLAY_WIDTH) / 3;
      } else {
        return (5 * DISPLAY_WIDTH) / 6;
      }
    }
  }
  let index = 0;
  const graph: Graph = {};
  let evenRow = false;
  let y = DISPLAY_HEIGHT / 9;
  while (index < size) {
    let i = 0;
    if (!evenRow) {
      while (i < 5 && index < size) {
        graph[ALPHABET[index]] = {
          neighbors: [],
          attributes: {
            state: "clean",
            heuristic: 0,
            x: getX(i, evenRow),
            y: y,
          },
        };
        i++;
        index++;
      }
    } else {
      while (i < 6 && index < size) {
        graph[ALPHABET[index]] = {
          neighbors: [],
          attributes: {
            state: "clean",
            heuristic: 0,
            x: getX(i, evenRow),
            y: y,
          },
        };
        i++;
        index++;
      }
    }
    evenRow = !evenRow;
    y += (2 * DISPLAY_HEIGHT) / 15;
  }

  for (let i = 0; i < size; i++) {
    graph[ALPHABET[i]].neighbors = getNeighbors(i, graph);
  }

  for (const node of Object.keys(graph)) {
    const distances = dijkstra(graph, node, endNode).distances;
    const optimalPathLength = distances[distances.length - 1][endNode];
    if (node !== startingNode && node !== endNode) {
      graph[node].attributes.heuristic = generateHeuristic(
        graph,
        node,
        optimalPathLength,
      );
    } else {
      graph[node].attributes.heuristic = 0;
    }
  }
  return graph;
}

/**
 * A heuristic must be both admissible and consistent.
 * Admissible means that the heuristic always is less than or equal to the optimal path cost from
 * the current node.
 * Consistent means that the cost of the heuristic plus the weight to get to a neighbor is less
 * than or equal to the neighbor's heuristic.
 */
function generateHeuristic(
  graph: Graph,
  nodeName: string,
  optimalPathLength: number,
) {
  const node = graph[nodeName];
  let lowestCostToNeighbor = Infinity;
  for (const neighbor of node.neighbors) {
    lowestCostToNeighbor =
      neighbor.weight < lowestCostToNeighbor
        ? neighbor.weight
        : lowestCostToNeighbor;
  }
  // Another possible heuristic
  // const maximumAllowedValue = Math.min(lowestCostToNeighbor, optimalPathLength);
  // return randomIntFromInterval(1, maximumAllowedValue);
  return randomIntFromInterval(1, optimalPathLength);
}

/**
 * If the weight for a neighbor has already been set, get it, otherwise return 0.
 * Important so graph correctly sets the same weight on both nodes that are connected by an edge.
 * @param index - The index of the alphabet array to use (alphabet contains all node names).
 * @param offset - The offset from the alphabet index.
 * @param graph - The graph.
 * @returns
 */
function getNeighborWeightIfExists(
  index: number,
  offset: number,
  graph: Graph,
) {
  const currentNode = ALPHABET[index];
  const neighbors = new Set(
    graph[ALPHABET[index + offset]].neighbors.map(
      (neighbor) => neighbor.nodeName,
    ),
  ).has(currentNode)
    ? graph[ALPHABET[index + offset]].neighbors
    : [];
  if (neighbors.length) {
    for (const neighbor of neighbors) {
      if (neighbor.nodeName === currentNode) {
        return neighbor.weight;
      }
    }
  } else {
    return 0;
  }
}

/**
 * Generates all neighbors for a node. If a neighbor's weight to a node has already been
 * generated, it will use that weight.
 * @param index
 * @param graph
 * @returns
 */
function getNeighbors(index: number, graph: Graph) {
  const middleNodes = new Set<number>([
    6, 7, 8, 9, 12, 13, 14, 17, 18, 19, 20, 23, 24, 25, 28, 29, 30, 31,
  ]);
  const leftNodes = new Set<number>([5, 16, 27]);
  const rightNodes = new Set<number>([10, 21, 32]);
  const topMiddleNodes = new Set<number>([1, 2, 3]);
  const bottomMiddleNodes = new Set<number>([34, 35, 36]);
  const topLeftNodes = new Set<number>([0]);
  const bottomLeftNodes = new Set<number>([33]);
  const topRightNodes = new Set<number>([4]);
  const bottomRightNodes = new Set<number>([37]);
  const middleLeftNodes = new Set<number>([11, 22]);
  const middleRightNodes = new Set<number>([15, 26]);

  if (middleNodes.has(index)) {
    const minus6Weight = getNeighborWeightIfExists(index, -6, graph);
    const minus5Weight = getNeighborWeightIfExists(index, -5, graph);
    const minus1Weight = getNeighborWeightIfExists(index, -1, graph);
    const plus1Weight = getNeighborWeightIfExists(index, 1, graph);
    const plus5Weight = getNeighborWeightIfExists(index, 5, graph);
    const plus6Weight = getNeighborWeightIfExists(index, 6, graph);
    return [
      {
        nodeName: ALPHABET[index - 6],
        weight: minus6Weight ? minus6Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 5],
        weight: minus5Weight ? minus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 1],
        weight: minus1Weight ? minus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 1],
        weight: plus1Weight ? plus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 5],
        weight: plus5Weight ? plus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 6],
        weight: plus6Weight ? plus6Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else if (leftNodes.has(index)) {
    const minus5Weight = getNeighborWeightIfExists(index, -5, graph);
    const plus1Weight = getNeighborWeightIfExists(index, 1, graph);
    const plus6Weight = getNeighborWeightIfExists(index, 6, graph);
    return [
      {
        nodeName: ALPHABET[index - 5],
        weight: minus5Weight ? minus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 1],
        weight: plus1Weight ? plus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 6],
        weight: plus6Weight ? plus6Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else if (rightNodes.has(index)) {
    const minus6Weight = getNeighborWeightIfExists(index, -6, graph);
    const minus1Weight = getNeighborWeightIfExists(index, -1, graph);
    const plus5Weight = getNeighborWeightIfExists(index, 5, graph);
    return [
      {
        nodeName: ALPHABET[index - 6],
        weight: minus6Weight ? minus6Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 1],
        weight: minus1Weight ? minus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 5],
        weight: plus5Weight ? plus5Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else if (topMiddleNodes.has(index)) {
    const minus1Weight = getNeighborWeightIfExists(index, -1, graph);
    const plus1Weight = getNeighborWeightIfExists(index, 1, graph);
    const plus5Weight = getNeighborWeightIfExists(index, 5, graph);
    const plus6Weight = getNeighborWeightIfExists(index, 6, graph);
    return [
      {
        nodeName: ALPHABET[index - 1],
        weight: minus1Weight ? minus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 1],
        weight: plus1Weight ? plus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 5],
        weight: plus5Weight ? plus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 6],
        weight: plus6Weight ? plus6Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else if (bottomMiddleNodes.has(index)) {
    const minus6Weight = getNeighborWeightIfExists(index, -6, graph);
    const minus5Weight = getNeighborWeightIfExists(index, -5, graph);
    const minus1Weight = getNeighborWeightIfExists(index, -1, graph);
    const plus1Weight = getNeighborWeightIfExists(index, 1, graph);
    return [
      {
        nodeName: ALPHABET[index - 6],
        weight: minus6Weight ? minus6Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 5],
        weight: minus5Weight ? minus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 1],
        weight: minus1Weight ? minus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 1],
        weight: plus1Weight ? plus1Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else if (topLeftNodes.has(index)) {
    const plus1Weight = getNeighborWeightIfExists(index, 1, graph);
    const plus5Weight = getNeighborWeightIfExists(index, 5, graph);
    const plus6Weight = getNeighborWeightIfExists(index, 6, graph);
    return [
      {
        nodeName: ALPHABET[index + 1],
        weight: plus1Weight ? plus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 5],
        weight: plus5Weight ? plus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 6],
        weight: plus6Weight ? plus6Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else if (bottomLeftNodes.has(index)) {
    const minus6Weight = getNeighborWeightIfExists(index, -6, graph);
    const minus5Weight = getNeighborWeightIfExists(index, -5, graph);
    const plus1Weight = getNeighborWeightIfExists(index, 1, graph);
    return [
      {
        nodeName: ALPHABET[index - 6],
        weight: minus6Weight ? minus6Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 5],
        weight: minus5Weight ? minus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 1],
        weight: plus1Weight ? plus1Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else if (topRightNodes.has(index)) {
    const minus1Weight = getNeighborWeightIfExists(index, -1, graph);
    const plus5Weight = getNeighborWeightIfExists(index, 5, graph);
    const plus6Weight = getNeighborWeightIfExists(index, 6, graph);
    return [
      {
        nodeName: ALPHABET[index - 1],
        weight: minus1Weight ? minus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 5],
        weight: plus5Weight ? plus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 6],
        weight: plus6Weight ? plus6Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else if (bottomRightNodes.has(index)) {
    const minus6Weight = getNeighborWeightIfExists(index, -6, graph);
    const minus5Weight = getNeighborWeightIfExists(index, -5, graph);
    const minus1Weight = getNeighborWeightIfExists(index, -1, graph);
    return [
      {
        nodeName: ALPHABET[index - 6],
        weight: minus6Weight ? minus6Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 5],
        weight: minus5Weight ? minus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 1],
        weight: minus1Weight ? minus1Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else if (middleLeftNodes.has(index)) {
    const minus6Weight = getNeighborWeightIfExists(index, -6, graph);
    const minus5Weight = getNeighborWeightIfExists(index, -5, graph);
    const plus1Weight = getNeighborWeightIfExists(index, 1, graph);
    const plus5Weight = getNeighborWeightIfExists(index, 5, graph);
    const plus6Weight = getNeighborWeightIfExists(index, 6, graph);
    return [
      {
        nodeName: ALPHABET[index - 6],
        weight: minus6Weight ? minus6Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 5],
        weight: minus5Weight ? minus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 1],
        weight: plus1Weight ? plus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 5],
        weight: plus5Weight ? plus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 6],
        weight: plus6Weight ? plus6Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else if (middleRightNodes.has(index)) {
    const minus6Weight = getNeighborWeightIfExists(index, -6, graph);
    const minus5Weight = getNeighborWeightIfExists(index, -5, graph);
    const minus1Weight = getNeighborWeightIfExists(index, -1, graph);
    const plus5Weight = getNeighborWeightIfExists(index, 5, graph);
    const plus6Weight = getNeighborWeightIfExists(index, 6, graph);
    return [
      {
        nodeName: ALPHABET[index - 6],
        weight: minus6Weight ? minus6Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 5],
        weight: minus5Weight ? minus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index - 1],
        weight: minus1Weight ? minus1Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 5],
        weight: plus5Weight ? plus5Weight : randomIntFromInterval(1, 9),
      },
      {
        nodeName: ALPHABET[index + 6],
        weight: plus6Weight ? plus6Weight : randomIntFromInterval(1, 9),
      },
    ];
  } else {
    return [];
  }
}

/**
 * Updates a graph by a target node name with a state.
 * @param graph - The graph to update.
 * @param targetNodeName - The name of the node to update.
 * @param state - The state of the node.
 */
export const updateGraphByValue = (
  graph: Graph,
  targetNodeName: string,
  state: string,
) => {
  graph[targetNodeName].attributes.state = state;
  for (const nodeName in graph) {
    if (
      graph[nodeName].attributes.state !== "processed" &&
      graph[nodeName].attributes.state !== "newNode" &&
      nodeName !== targetNodeName
    ) {
      graph[nodeName].attributes.state = "clean";
    }
  }
};

/**
 * Updates the graph to draw a path between two nodes by drawing each node in the path yellow.
 * The canvas drawing tool has been configured to know to draw a node a yellow if the node's state
 * attribute contains 'path' in the string. Returns the original graph as well so it can be used
 * as the base graph if the user wants to visualize one path after another (if we didn't have this,
 * then nodes that were highlighted yellow would remain that way upon subsequent path visualizations).
 * @param graph - The graph to update.
 * @param path - A list of all node names in the path.
 * @param finished - Whether the current traversal is finished. The path should only be drawn after
 *                   the traversal has finished.
 * @returns A copy of the original graph and the updated graph.
 */
export function drawPath(graph: Graph, path: string[], finished: boolean) {
  if (!finished) return;

  const copy = { ...graph };
  path.forEach((nodeName, index) => {
    graph[nodeName].attributes.state =
      index === path.length - 1 ? "path" : `path-${path[index + 1]}`;
  });
  return { originalGraph: copy, newGraph: graph };
}
