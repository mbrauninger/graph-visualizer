import React from "react";
import IconButton from "@material-ui/core/IconButton";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

interface ButtonProps {
  setModalOpen: Function;
}

export function QuestionButton(props: ButtonProps) {
  return (
    <IconButton
      color="primary"
      aria-label="question"
      style={{ fontSize: "4.2em" }}
      onClick={() => props.setModalOpen(true)}
    >
      <HelpOutlineIcon style={{ fontSize: "0.5em" }} />
    </IconButton>
  );
}

export default QuestionButton;
