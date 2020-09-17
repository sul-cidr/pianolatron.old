import React from "react";
import ReactDOM from "react-dom";

import useMidiSamplePlayer from "./hooks/useMidiSamplePlayer";

import ScoreControls from "./components/ScoreControls";
import ScoreDetails from "./components/ScoreDetails";

import mididata from "./assets/mididata.json";

const App = () => {
  const { rollMetadata, playPauseMidiFile, stopMidiFile } = useMidiSamplePlayer(
    mididata.mozart_rondo_alla_turca,
  );

  return (
    <>
      <h3>Pianolatron Demonstration</h3>
      <ScoreDetails rollMetadata={rollMetadata} />
      <ScoreControls
        playPauseMidiFile={playPauseMidiFile}
        stopMidiFile={stopMidiFile}
      />
    </>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
