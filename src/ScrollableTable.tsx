import React, { useEffect, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TableContainer } from "@mui/material";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { Step } from "./Types";

interface ScrollableTableProps {
  data: Step[];
}

/**
 * The table that is shown on the right side of the screen. Shows the 30 most recent steps in the
 * traversal. A 'Step' is a node name that is mapped to the action that is occurring in a graph. The
 * action is a string, and uses shorthand notation to describe possible things that could be happening
 * in the traversal. For example, checking a neighbor is represented as 'checkAdj' (check adjacent).
 * @returns The component.
 */
const ScrollableTable: React.FC<ScrollableTableProps> = ({ data }) => {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when new elements are added
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <TableContainer
      component={Paper}
      style={{
        height: window.innerWidth <= 768 ? "70vh" : "80vh",
        width: "275px",
        overflowY: "auto",
        marginLeft: "10px",
        position: "relative",
        top: 2,
      }}
      ref={tableRef}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: 20 }}>State</TableCell>
            <TableCell sx={{ fontSize: 20 }}>Node</TableCell>
            {/* Add more table headers as needed */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((step, index) => (
            <TableRow key={index}>
              <TableCell sx={{ fontSize: 20 }}>{step.state}</TableCell>
              <TableCell sx={{ fontSize: 20 }}>{step.value}</TableCell>
              {/* Add more table cells as needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScrollableTable;
