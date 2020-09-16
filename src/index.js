import React from "react";
import ReactDOM from "react-dom";

import useMidiSamplePlayer from "./hooks/useMidiSamplePlayer";

import ScoreDetails from "./components/ScoreDetails";

import mididata from "./assets/mididata.json";

const App = () => {
  const { rollMetadata } = useMidiSamplePlayer(mididata.magic_fire);

  return (
    <>
      <h3>Pianolatron Demonstration</h3>
      <ScoreDetails rollMetadata={rollMetadata} />
    </>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
