import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  width: window.innerWidth <= 768 ? "70%" : 600,
  height: window.innerWidth <= 768 ? "80%" : 390,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  color: "white",
  overflowY: "auto",
  margin: "auto",
};

interface ModalProps {
  modalOpen: boolean;
  setModalOpen: Function;
}

export function InfoModal(props: ModalProps) {
  return (
    <Modal
      sx={modalStyle}
      open={props.modalOpen}
      onClose={() => props.setModalOpen(false)}
      aria-labelledby="info-modal"
    >
      <Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => props.setModalOpen(false)}
          aria-label="close"
          style={{ position: "sticky", top: -20, left: 800 }}
        >
          <CloseIcon />
        </IconButton>
        <Box>
          This is a project that visualizes graph traversal algorithms. It
          features four algorithms: Dijkstra, A* Search, Breadth-First Search,
          and Depth-First Search. The graph is comprised of nodes, with a cost
          to get from one node to another through an edge. Nodes additionally
          contain heuristic values (the number inside each node), which are used
          for A* Search. Heuristics are admissible but not consistent (for those
          of you who are familiar with A* Search terminology).
          <br />
          <br />
          You can set the traversal algorithm in the settings window, which
          appears by clicking the 'Settings' button at the bottom of the screen.
          You can play through a traversal in real time, as well as pause the
          traversal, by clicking the 'Play' button, and can edit the traversal
          speed in the settings window. You can also click through a traversal
          step-by-step by clicking the 'Step' button.
          <br />
          <br />
          If you are on a computer, you will see two tables. The table on the
          left side of the screen contains information about each node, such as
          the calculated lowest cost to get to that node, and the previous node
          that the traversal arrived to that node from. If A* Search is the
          selected algorithm, the table will also show the A* score.
          <br />
          <br />
          The right table will list each step in the traversal, up to 30 steps
          at a time. If you are on mobile, you will not see the tables. Once the
          traversal is finished, you can click on a node to view the calculated
          path to that node from the starting node.
          <br />
          <br />
          You can edit the starting node and the ending node in the settings
          window, and can optionally configure the application to traverse the
          entire graph instead of stopping at a goal node.
          <br />
          <br />
          Clicking the 'New Graph' button in the top-right corner of the graph
          visualizer will generate a new graph with randomized weights and
          heuristics, and will take your updated settings into account. Hope you
          enjoy the project!
        </Box>
      </Box>
    </Modal>
  );
}
