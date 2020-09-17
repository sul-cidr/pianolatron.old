import React, { useState } from "react";
import PropTypes from "prop-types";

const ScoreControls = ({
  playPauseMidiFile,
  stopMidiFile,
  sliderTempo,
  updateSliderTempo,
  volumeRatio,
  updateVolumeRatio,
}) => {
  const [uiTempo, setUiTempo] = useState(sliderTempo);
  const [uiMasterVolume, setUiMasterVolume] = useState(volumeRatio);
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
          name="tempo"
          onChange={({ target: { value } }) => {
            setUiTempo(value);
            updateSliderTempo(value);
          }}
        />
        {uiTempo} bpm
      </div>
      <div>
        Master Volume:
        <input
          type="range"
          min="0"
          max="4"
          step=".1"
          value={uiMasterVolume}
          name="volume"
          onChange={({ target: { value } }) => {
            setUiMasterVolume(value);
            updateVolumeRatio(value);
          }}
        />
        {uiMasterVolume}
      </div>
    </div>
  );
};

ScoreControls.propTypes = {
  playPauseMidiFile: PropTypes.func.isRequired,
  stopMidiFile: PropTypes.func.isRequired,
  sliderTempo: PropTypes.number.isRequired,
  updateSliderTempo: PropTypes.func.isRequired,
  volumeRatio: PropTypes.number.isRequired,
  updateVolumeRatio: PropTypes.func.isRequired,
};

export default ScoreControls;
