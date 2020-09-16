import React from "react";
import PropTypes from "prop-types";

const ScoreControls = ({ playPauseMidiFile, stopMidiFile }) => (
  <div id="score-controls">
    <button type="button" id="pause" onClick={playPauseMidiFile}>
      Play/Pause
    </button>
    <button type="button" id="stop" onClick={stopMidiFile}>
      Stop
    </button>
  </div>
);

ScoreControls.propTypes = {
  playPauseMidiFile: PropTypes.func.isRequired,
  stopMidiFile: PropTypes.func.isRequired,
};

export default ScoreControls;
