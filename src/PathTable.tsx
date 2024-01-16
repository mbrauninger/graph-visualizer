import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TableContainer } from "@mui/material";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { Graph } from "./Types";

interface PathTableProps {
  data: Record<string, number>;
  graph: Graph;
  paths: Record<string, string[]>;
  drawPath: Function;
  setGraph: Function;
  finished: boolean;
  from: Record<string, string>;
  savedFinishedGraph: Graph;
  aStar?: Record<string, number>;
}

/**
 * The table that is shown on the left side of the screen. Shows the minimum path that has been
 * detected by the traversal algorithm (not  guaranteed to be optimal), the previous node that
 * has been used to get to a node, and the A* score for each node if the set traversal is A*.
 * @param props - The state variables/functions that are passed into the component.
 * @returns The component.
 */
const PathTable = (props: PathTableProps) => {
  return (
    <TableContainer
      component={Paper}
      style={{
        height: window.innerWidth <= 768 ? "70vh" : "80vh",
        marginLeft: "10px",
        position: "relative",
        top: 2,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontSize: 15, paddingLeft: props.aStar ? 2.5 : 4 }}
            >
              Node
            </TableCell>
            {props.aStar ? (
              <TableCell sx={{ fontSize: 15, paddingLeft: 2.8 }}>A*</TableCell>
            ) : null}
            <TableCell sx={{ fontSize: 15, paddingLeft: props.aStar ? 2 : 3 }}>
              Cost
            </TableCell>
            <TableCell sx={{ fontSize: 15, paddingLeft: props.aStar ? 2 : 3 }}>
              From
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.data).map((key) => (
            <TableRow
              key={key}
              sx={{
                height: "20px",
                cursor: "pointer",
                "&:hover": { background: "#f2f2f2" },
              }}
              onClick={() => {
                if (props.data[key] === Infinity) return;
                const currentGraph = JSON.parse(
                  JSON.stringify(props.savedFinishedGraph),
                );
                props.drawPath(currentGraph, props.paths[key], props.finished);
                props.setGraph(currentGraph);
              }}
            >
              <TableCell
                sx={{
                  textAlign: "center",
                  paddingTop: 0.5,
                  paddingBottom: 0.4,
                  fontFamily: "Courier, monospace",
                }}
              >
                {key}
              </TableCell>
              {props.aStar ? (
                <TableCell
                  sx={{
                    textAlign: "center",
                    paddingTop: 0.5,
                    paddingBottom: 0.4,
                    fontFamily: "Courier, monospace",
                  }}
                >
                  {props.aStar[key] === Infinity ? "Inf" : props.aStar[key]}
                </TableCell>
              ) : null}
              <TableCell
                sx={{
                  textAlign: "center",
                  paddingTop: 0.5,
                  paddingBottom: 0.4,
                  fontFamily: "Courier, monospace",
                }}
              >
                {props.data[key] === Infinity ? "Inf" : props.data[key]}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  paddingTop: 0.5,
                  paddingBottom: 0.4,
                  fontFamily: "Courier, monospace",
                }}
              >
                {props.from[key]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PathTable;
