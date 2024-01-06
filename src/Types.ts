/**
 * The information attached to a node that is not the node's weight.
 */
interface NodeAttributes {
  state: string;
  heuristic: number;
  x: number;
  y: number;
}

/**
 * The name of a neighbor node and the cost to get to that node.
 */
export interface Neighbor {
  nodeName: string;
  weight: number;
}

/**
 * Represents the distance to get to a node. Includes A* score if the search is A*.
 */
export interface Distance {
  nodeName: string;
  distance: number;
  aStar?: number;
}

/**
 * A node object that contains name and attributes.
 */
export interface Node {
  neighbors: Neighbor[];
  attributes: NodeAttributes;
}

/**
 * The graph to be traversed.
 */
export interface Graph {
  [nodeName: string]: Node;
}

/**
 * A step in the traversal to be displayed in the ScrollableTable.
 */
export interface Step {
  value: string;
  state: string;
}

/**
 * Used to set the frequency of screen refreshes in a traversal.
 */
export enum TraversalSpeeds {
  FAST = "Fast",
  MEDIUM = "Medium",
  SLOW = "Slow",
}

/**
 * Types of traversals.
 */
export enum TraversalTypes {
  DIJKSTRA = "Dijkstra",
  BFS = "Bfs",
  DFS = "Dfs",
  A_STAR = "AStar",
}
