import { ICompare, PriorityQueue } from "@datastructures-js/priority-queue";
import { Graph, Step, Distance } from "./Types";
import { Queue } from "queue-typescript";

/**
 * Compares two distances.
 * @param a - The first distance.
 * @param b - The second distance.
 * @returns An integer to be used in Dijkstra's priority queue.
 */
const compareDistances: ICompare<Distance> = (a: Distance, b: Distance) => {
  if (a.distance < b.distance) {
    return -1;
  }
  return 1;
};

/**
 * Compares two distances by their A* score.
 * @param a - The first distance.
 * @param b - The second distance.
 * @returns An integer to be used in the A* priority queue.
 */
const compareAStar: ICompare<Distance> = (a: Distance, b: Distance) => {
  if (a.aStar !== undefined && b.aStar !== undefined && a.aStar < b.aStar) {
    return -1;
  }
  return 1;
};

/**
 * Dijkstra's Algorithm. Always chooses the next node that has the lowest-weight path.
 * @param graph - The graph.
 * @param startingNode - The node to begin the graph traversal from.
 * @param endNode - The node to search for. Will be the empty string if traversing the entire graph.
 * @returns An object that contains data which will be used to visualize the traversal.
 */
export function dijkstra(graph: Graph, startingNode: string, endNode: string) {
  let traversal: Step[] = [];
  let distances: Record<string, number>[] = [];
  let paths: Record<string, string[]> = {};
  const output: Record<string, number> = {};
  const from: Record<string, string>[] = [];
  let currentFromMap: Record<string, string> = {};
  for (const nodeName in graph) {
    output[nodeName] = nodeName === startingNode ? 0 : Infinity;
    paths[nodeName] = nodeName === startingNode ? [startingNode] : [];
    currentFromMap[nodeName] = "";
  }

  const visited = new Set<string>();
  const queue = new PriorityQueue<Distance>(compareDistances);
  queue.enqueue({ nodeName: startingNode, distance: 0 });
  while (queue.size()) {
    currentFromMap =
      from.length === 0 ? currentFromMap : { ...[...from][from.length - 1] };
    let currentNode = queue.dequeue();
    if (visited.has(currentNode.nodeName)) continue;
    if (currentNode.nodeName === endNode) {
      traversal.push({
        state: "found",
        value: currentNode.nodeName,
      });
      distances.push({ ...output });
      from.push({ ...currentFromMap });
      return {
        traversal: traversal,
        distances: distances,
        paths: paths,
        from: from,
      };
    }
    traversal.push({ state: "newNode", value: currentNode.nodeName });
    distances.push({ ...output });
    from.push({ ...currentFromMap });
    visited.add(currentNode.nodeName);
    for (const neighbor of graph[currentNode.nodeName].neighbors) {
      if (!visited.has(neighbor.nodeName)) {
        let currentNodeDistance = output[currentNode.nodeName];
        if (currentNodeDistance + neighbor.weight < output[neighbor.nodeName]) {
          output[neighbor.nodeName] =
            output[currentNode.nodeName] + neighbor.weight;
          paths[neighbor.nodeName] = [
            ...paths[currentNode.nodeName],
            neighbor.nodeName,
          ];
          currentFromMap[neighbor.nodeName] = currentNode.nodeName;
        }
        queue.enqueue({
          nodeName: neighbor.nodeName,
          distance: output[neighbor.nodeName],
        });
        traversal.push({
          state: "checkAdj",
          value: neighbor.nodeName,
        });
        distances.push({ ...output });
        from.push({ ...currentFromMap });
      }
    }
    traversal.push({ state: "processed", value: currentNode.nodeName });
    distances.push({ ...output });
    from.push({ ...currentFromMap });
  }
  return {
    traversal: traversal,
    distances: distances,
    paths: paths,
    from: from,
  };
}

/**
 * A* Search. Always chooses the next node that has the A* score.
 * A* score is calculated with the lowest path to the current node plus the heuristic of the neighbor.
 * @param graph - The graph.
 * @param startingNode - The node to begin the graph traversal from.
 * @param endNode - The node to search for. Will be the empty string if traversing the entire graph.
 * @returns An object that contains data which will be used to visualize the traversal.
 */
export function aStar(graph: Graph, startingNode: string, endNode: string) {
  let traversal: Step[] = [];
  let distances: Record<string, number>[] = [];
  let paths: Record<string, string[]> = {};
  const output: Record<string, number> = {};
  const from: Record<string, string>[] = [];
  let currentFromMap: Record<string, string> = {};
  const aStar: Record<string, number>[] = [];
  let currentAStar: Record<string, number> = {};

  for (const nodeName in graph) {
    output[nodeName] = nodeName === startingNode ? 0 : Infinity;
    paths[nodeName] = nodeName === startingNode ? [startingNode] : [];
    currentFromMap[nodeName] = "";
    currentAStar[nodeName] = nodeName === startingNode ? 0 : Infinity;
  }

  const visited = new Set<string>();
  const queue = new PriorityQueue<Distance>(compareAStar);
  queue.enqueue({ nodeName: startingNode, distance: 0, aStar: 0 });
  while (queue.size()) {
    currentFromMap =
      from.length === 0 ? currentFromMap : { ...[...from][from.length - 1] };
    currentAStar =
      aStar.length === 0 ? currentAStar : { ...[...aStar][aStar.length - 1] };
    let currentNode = queue.dequeue();
    if (visited.has(currentNode.nodeName)) continue;
    if (currentNode.nodeName === endNode) {
      traversal.push({
        state: "found",
        value: currentNode.nodeName,
      });
      distances.push({ ...output });
      from.push({ ...currentFromMap });
      aStar.push({ ...currentAStar });
      return {
        traversal: traversal,
        distances: distances,
        paths: paths,
        from: from,
        aStar: aStar,
      };
    }
    traversal.push({ state: "newNode", value: currentNode.nodeName });
    distances.push({ ...output });
    from.push({ ...currentFromMap });
    aStar.push({ ...currentAStar });
    visited.add(currentNode.nodeName);
    for (const neighbor of graph[currentNode.nodeName].neighbors) {
      if (!visited.has(neighbor.nodeName)) {
        let currentNodeDistance = output[currentNode.nodeName];
        if (
          currentNodeDistance +
            neighbor.weight +
            graph[neighbor.nodeName].attributes.heuristic <
          output[neighbor.nodeName]
        ) {
          if (
            currentNodeDistance + neighbor.weight <
            output[neighbor.nodeName]
          ) {
            output[neighbor.nodeName] =
              output[currentNode.nodeName] + neighbor.weight;
          }
          paths[neighbor.nodeName] = [
            ...paths[currentNode.nodeName],
            neighbor.nodeName,
          ];
          currentFromMap[neighbor.nodeName] = currentNode.nodeName;
          currentAStar[neighbor.nodeName] =
            output[currentNode.nodeName] +
            neighbor.weight +
            graph[neighbor.nodeName].attributes.heuristic;
        }
        queue.enqueue({
          nodeName: neighbor.nodeName,
          distance: output[neighbor.nodeName],
          aStar:
            output[neighbor.nodeName] +
            neighbor.weight +
            graph[neighbor.nodeName].attributes.heuristic,
        });
        traversal.push({
          state: "checkAdj",
          value: neighbor.nodeName,
        });
        distances.push({ ...output });
        from.push({ ...currentFromMap });
        aStar.push({ ...currentAStar });
      }
    }
    traversal.push({ state: "processed", value: currentNode.nodeName });
    distances.push({ ...output });
    from.push({ ...currentFromMap });
    aStar.push({ ...currentAStar });
  }
  return {
    traversal: traversal,
    distances: distances,
    paths: paths,
    from: from,
    aStar: aStar,
  };
}

/**
 * Breadth-First Search. Traverses the graph level-by-level. Implemented with a queue.
 * @param graph - The graph.
 * @param startingNode - The node to begin the graph traversal from.
 * @param endNode - The node to search for. Will be the empty string if traversing the entire graph.
 * @returns An object that contains data which will be used to visualize the traversal.
 */
export function bfs(graph: Graph, startingNode: string, endNode: string) {
  let traversal: Step[] = [];
  let distances: Record<string, number>[] = [];
  let paths: Record<string, string[]> = {};
  const output: Record<string, number> = {};
  const from: Record<string, string>[] = [];
  let currentFromMap: Record<string, string> = {};
  for (const nodeName in graph) {
    output[nodeName] = nodeName === startingNode ? 0 : Infinity;
    paths[nodeName] = nodeName === startingNode ? [startingNode] : [];
    currentFromMap[nodeName] = "";
  }

  const visited = new Set<string>();
  const queue = new Queue<Distance>({ nodeName: startingNode, distance: 0 });
  while (queue.length) {
    currentFromMap =
      from.length === 0 ? currentFromMap : { ...[...from][from.length - 1] };
    let currentNode = queue.dequeue();
    if (visited.has(currentNode.nodeName)) continue;
    if (currentNode.nodeName === endNode) {
      traversal.push({
        state: "found",
        value: currentNode.nodeName,
      });
      distances.push({ ...output });
      from.push({ ...currentFromMap });
      return {
        traversal: traversal,
        distances: distances,
        paths: paths,
        from: from,
        aStar: aStar,
      };
    }
    traversal.push({ state: "newNode", value: currentNode.nodeName });
    distances.push({ ...output });
    from.push({ ...currentFromMap });
    visited.add(currentNode.nodeName);
    for (const neighbor of graph[currentNode.nodeName].neighbors) {
      if (!visited.has(neighbor.nodeName)) {
        let currentNodeDistance = output[currentNode.nodeName];
        if (currentNodeDistance + neighbor.weight < output[neighbor.nodeName]) {
          output[neighbor.nodeName] =
            output[currentNode.nodeName] + neighbor.weight;
          paths[neighbor.nodeName] = [
            ...paths[currentNode.nodeName],
            neighbor.nodeName,
          ];
          currentFromMap[neighbor.nodeName] = currentNode.nodeName;
        }
        traversal.push({ state: "checkAdj", value: neighbor.nodeName });
        distances.push({ ...output });
        queue.enqueue({
          nodeName: neighbor.nodeName,
          distance: output[neighbor.nodeName],
        });
        from.push({ ...currentFromMap });
      }
    }
    traversal.push({ state: "processed", value: currentNode.nodeName });
    distances.push({ ...output });
    from.push({ ...currentFromMap });
  }
  return {
    traversal: traversal,
    distances: distances,
    paths: paths,
    from: from,
  };
}

/**
 * Depth-First Search. Implemented with a stack. Chooses the next node by whatever is at the top
 * of the stack.
 * @param graph - The graph.
 * @param startingNode - The node to begin the graph traversal from.
 * @param endNode - The node to search for. Will be the empty string if traversing the entire graph.
 * @returns An object that contains data which will be used to visualize the traversal.
 */
export function dfs(graph: Graph, startingNode: string, endNode: string) {
  let traversal: Step[] = [];
  let distances: Record<string, number>[] = [];
  let paths: Record<string, string[]> = {};
  const output: Record<string, number> = {};
  const from: Record<string, string>[] = [];
  let currentFromMap: Record<string, string> = {};
  for (const nodeName in graph) {
    output[nodeName] = nodeName === startingNode ? 0 : Infinity;
    paths[nodeName] = nodeName === startingNode ? [startingNode] : [];
    currentFromMap[nodeName] = "";
  }

  const visited = new Set<string>();
  const stack: Distance[] = [{ nodeName: startingNode, distance: 0 }];
  while (stack.length) {
    currentFromMap =
      from.length === 0 ? currentFromMap : { ...[...from][from.length - 1] };
    let currentNode = stack.pop();
    if (!currentNode) break;

    if (visited.has(currentNode.nodeName)) continue;
    if (currentNode.nodeName === endNode) {
      traversal.push({
        state: "found",
        value: currentNode.nodeName,
      });
      distances.push({ ...output });
      from.push({ ...currentFromMap });
      return {
        traversal: traversal,
        distances: distances,
        paths: paths,
        from: from,
        aStar: aStar,
      };
    }
    traversal.push({ state: "newNode", value: currentNode.nodeName });
    distances.push({ ...output });
    from.push({ ...currentFromMap });
    visited.add(currentNode.nodeName);
    for (const neighbor of graph[currentNode.nodeName].neighbors) {
      if (!visited.has(neighbor.nodeName)) {
        let currentNodeDistance = output[currentNode.nodeName];
        if (currentNodeDistance + neighbor.weight < output[neighbor.nodeName]) {
          output[neighbor.nodeName] =
            output[currentNode.nodeName] + neighbor.weight;
          paths[neighbor.nodeName] = [
            ...paths[currentNode.nodeName],
            neighbor.nodeName,
          ];
          currentFromMap[neighbor.nodeName] = currentNode.nodeName;
        }
        traversal.push({ state: "checkAdj", value: neighbor.nodeName });
        distances.push({ ...output });
        stack.push({
          nodeName: neighbor.nodeName,
          distance: output[neighbor.nodeName],
        });
        from.push({ ...currentFromMap });
      }
    }
    traversal.push({ state: "processed", value: currentNode.nodeName });
    distances.push({ ...output });
    from.push({ ...currentFromMap });
  }
  return {
    traversal: traversal,
    distances: distances,
    paths: paths,
    from: from,
  };
}
