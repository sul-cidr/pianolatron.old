import React from "react";
import ReactDOM from "react-dom";

import useMidiSamplePlayer from "./hooks/useMidiSamplePlayer";

import ScoreControls from "./components/ScoreControls";
import ScoreDetails from "./components/ScoreDetails";

import mididata from "./assets/mididata.json";

const App = () => {
  const {
    rollMetadata,
    playPauseMidiFile,
    stopMidiFile,
    sliderTempo,
    updateSliderTempo,
    volumeRatio,
    updateVolumeRatio,
  } = useMidiSamplePlayer(mididata.mozart_rondo_alla_turca);
  console.log("rerendering App");
  return (
    <>
      <h3>Pianolatron Demonstration</h3>
      <ScoreDetails rollMetadata={rollMetadata} />
      <ScoreControls
        playPauseMidiFile={playPauseMidiFile}
        stopMidiFile={stopMidiFile}
        sliderTempo={sliderTempo}
        updateSliderTempo={updateSliderTempo}
        volumeRatio={volumeRatio}
        updateVolumeRatio={updateVolumeRatio}
      />
    </>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
