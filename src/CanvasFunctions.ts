import { Node, Graph } from "./Types";
import {
  NODE_RADIUS,
  WEIGHT_RADIUS,
  LESS_X_OFFSET,
  MORE_X_OFFSET,
  MORE_HEURISTIC_X_OFFSET,
  LESS_HEURISTIC_X_OFFSET,
} from "./Constants";
import { drawPath } from "./GraphFunctions";

/**
 * Draws a graph node.
 * @param ctx - The canvas context object.
 * @param node - The name of the node. Is a letter in the alphabet.
 * @param node - The node object to draw. Contains node metadata like neighbors and heuristics.
 * @param color - The color of the node.
 */
const drawNode = (
  ctx: CanvasRenderingContext2D,
  nodeName: string,
  node: Node,
  color: string,
) => {
  ctx.beginPath();
  ctx.arc(node.attributes.x, node.attributes.y, NODE_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.font = `${NODE_RADIUS}px Verdana`;
  ctx.fillStyle = color;
  ctx.fill();
  let xTextOffset = node.attributes.x - (5 * NODE_RADIUS) / 16;
  let heuristicOffset = xTextOffset + 12;
  if (LESS_X_OFFSET.has(nodeName)) {
    xTextOffset -= 2;
    heuristicOffset += 1;
  }
  if (MORE_X_OFFSET.has(nodeName)) {
    xTextOffset += 2;
    heuristicOffset -= 1;
  }
  if (MORE_HEURISTIC_X_OFFSET.has(nodeName)) {
    heuristicOffset += 1;
  }
  if (LESS_HEURISTIC_X_OFFSET.has(nodeName)) {
    heuristicOffset -= 2;
  }
  if (node.attributes.heuristic > 9) {
    xTextOffset -= 5;
    heuristicOffset -= 5;
  }

  if (NODE_RADIUS > 2) {
    ctx.fillStyle = "black"; // Reset fill style
    ctx.fillText(nodeName, xTextOffset, node.attributes.y + NODE_RADIUS / 3);
    ctx.font = `${10}px Verdana`;
    ctx.fillText(
      node.attributes.heuristic.toString(),
      heuristicOffset,
      node.attributes.y + 2 + NODE_RADIUS / 3,
    );
  }
};

/**
 * Draws an edge weight.
 * @param ctx - The canvas context object.
 * @param x - The x coordinate of the weight.
 * @param y - The y coordinate of the weight.
 * @param text - The text to draw in the weight. Is a number from 1-9.
 * @param color - The color of the weight.
 */
const drawWeight = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
) => {
  ctx.beginPath();
  ctx.arc(x, y, WEIGHT_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.font = `${NODE_RADIUS}px Verdana`;
  ctx.fillStyle = color;
  ctx.fill();

  let xTextOffset = x - (4 * NODE_RADIUS) / 15;
  ctx.fillStyle = "black"; // Reset fill style
  ctx.fillText(text, xTextOffset, y + NODE_RADIUS / 3);
};

function getWeightColor(
  graph: Graph,
  baseNodeName: string,
  neighborNodeName: string,
) {
  const isBaseChecking = graph[baseNodeName].attributes.state === "newNode";
  const isNeighborChecking =
    graph[neighborNodeName].attributes.state === "checkAdj";

  const isNeighborInPath =
    (graph[baseNodeName].attributes.state.includes("path") &&
      graph[baseNodeName].attributes.state.endsWith(`-${neighborNodeName}`)) ||
    (graph[neighborNodeName].attributes.state.includes("path") &&
      graph[neighborNodeName].attributes.state.endsWith(`-${baseNodeName}`));

  const isYellowCondition =
    (isBaseChecking && isNeighborChecking) || isNeighborInPath;

  return isYellowCondition ? "yellow" : "white";
}

/**
 *
 * @param ctx - The canvas context object.
 * @param graph - The graph to be drawn.
 * @returns
 */
export const drawGraph = (ctx: CanvasRenderingContext2D, graph: Graph) => {
  const drawnEdges: Record<string, Set<string>> = {};
  for (const baseNodeName in graph) {
    drawnEdges[baseNodeName] = new Set<string>();
  }
  for (const baseNodeName in graph) {
    const baseNode = graph[baseNodeName];
    for (let neighbor of graph[baseNodeName].neighbors) {
      if (!drawnEdges[baseNodeName].has(neighbor.nodeName)) {
        const otherNode = graph[neighbor.nodeName];
        ctx.beginPath();
        ctx.moveTo(baseNode.attributes.x, baseNode.attributes.y);
        ctx.lineTo(otherNode.attributes.x, otherNode.attributes.y);
        ctx.stroke();
        drawWeight(
          ctx,
          Math.abs((otherNode.attributes.x + baseNode.attributes.x) / 2),
          Math.abs((otherNode.attributes.y + baseNode.attributes.y) / 2),
          neighbor.weight.toString(),
          getWeightColor(graph, baseNodeName, neighbor.nodeName),
        );
        drawnEdges[neighbor.nodeName].add(baseNodeName);
      }
    }
    for (let baseNodeName in graph) {
      let color = "white";
      if (
        graph[baseNodeName].attributes.state === "checkAdj" ||
        graph[baseNodeName].attributes.state.includes("path")
      ) {
        color = "yellow";
      } else if (graph[baseNodeName].attributes.state === "newNode") {
        color = "orange";
      } else if (graph[baseNodeName].attributes.state === "processed") {
        color = "green";
      } else if (graph[baseNodeName].attributes.state === "found") {
        color = "violet";
      }
      drawNode(ctx, baseNodeName, graph[baseNodeName], color);
    }
  }
};

/**
 * Draws the entire canvas.
 * @param canvasRef - The ref to the canvas.
 * @param graph - The graph to be drawn.
 */
export function drawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  graph: Graph,
) {
  if (!canvasRef.current || !graph) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const devicePixelRatio = window.devicePixelRatio || 1;

  const width = canvas.clientWidth * devicePixelRatio;
  const height = canvas.clientHeight * devicePixelRatio;

  canvas.width = width;
  canvas.height = height;

  ctx.scale(devicePixelRatio, devicePixelRatio);

  ctx.clearRect(0, 0, width, height);
  drawGraph(ctx, graph);
}

/**
 * 
 * @param x - The x coordinate of the click in the canvas.
 * @param y - The y coordinate of the click in the canvas.
 * @param graph - The graph.
 * @param finished - If the traversal visualization is finished.
 * @param distances - A map of the calculated distance to each node.
 * @param paths - An object that maps each node to the lowest-cost path.
 * @param savedFinishedGraph - The saved graph to revert to if a request to change the displayed
 *                             path occurs.
 * @param setGraph - The function to set the graph with the updated path.
 */
export function handleNodeClick(x: number, y: number, graph: Graph, finished: boolean, distances: Record<string, number>, paths: Record<string, string[]>, savedFinishedGraph: Graph, setGraph: Function) {
  if (!finished) {
    return;
  }
  for (const node in graph) {
    const distance = Math.sqrt(Math.pow(x - graph[node].attributes.x, 2) + Math.pow(y - graph[node].attributes.y, 2));
    if (distance < NODE_RADIUS) {
        if (distances[node] === Infinity) return;
        const currentGraph = JSON.parse(
          JSON.stringify(savedFinishedGraph),
        );
        drawPath(currentGraph, paths[node], finished);
        setGraph(currentGraph);
        break;
    }
  }

}

/**
 * Detects if a point on the canvas is inside a node.
 * @param x - The x-coordinate of the point.
 * @param y - The y coordinate of the point.
 * @param graph - The graph.
 * @returns - A boolean representing whether or not the point is inside a node.
 */
export function isPointInsideNode(x: number, y: number, graph: Graph): boolean {
  for (const node in graph) {
    const distance = Math.sqrt(Math.pow(x - graph[node].attributes.x, 2) + Math.pow(y - graph[node].attributes.y, 2));
    if (distance < NODE_RADIUS) {
      return true;
    }
  }
  return false;
}