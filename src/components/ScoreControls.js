import React, { useState } from "react";
import PropTypes from "prop-types";

const ScoreControls = ({
  playPauseMidiFile,
  stopMidiFile,
  sliderTempo,
  updateSliderTempo,
}) => {
  const [uiTempo, setUiTempo] = useState(sliderTempo);
  return (
    <div id="score-controls">
      <button type="button" id="pause" onClick={playPauseMidiFile}>
        Play/Pause
      </button>
      <button type="button" id="stop" onClick={stopMidiFile}>
        Stop
      </button>
      <div>
        Tempo:
        <input
          type="range"
          min="0"
          max="180"
          value={uiTempo}
          className="slider"
          id="tempoSlider"
          onChange={({ target: { value } }) => {
            setUiTempo(value);
            updateSliderTempo(value);
          }}
        />
        {uiTempo} bpm
      </div>
    </div>
  );
};

ScoreControls.propTypes = {
  playPauseMidiFile: PropTypes.func.isRequired,
  stopMidiFile: PropTypes.func.isRequired,
  sliderTempo: PropTypes.number.isRequired,
  updateSliderTempo: PropTypes.func.isRequired,
};

export default ScoreControls;
