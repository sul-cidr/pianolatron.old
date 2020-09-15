import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import MidiPlayer from "midi-player-js";

import mididata from "./assets/mididata.json";

const App = () => {
  const MidiSamplePlayer = new MidiPlayer.Player();

  const [rollMetadata, setRollMetadata] = useState({});

  MidiSamplePlayer.on("fileLoaded", () => {
    const track1 = MidiSamplePlayer.events[0];
    setRollMetadata(
      /* @IMAGE_WIDTH and @IMAGE_LENGTH should be the same as from viewport._contentSize
       * Can't think of why they wouldn't be, but maybe check anyway. Would need to scale
       * all pixel values if so.
       * Other potentially useful values, e.g., for drawing overlays:
       * @ROLL_WIDTH (this is smaller than the image width)
       * @HARD_MARGIN_TREBLE
       * @HARD_MARGIN_BASS
       * @HOLE_SEPARATION
       * @HOLE_OFFSET
       * All of the source/performance/recording metadata is in this track as well.
       */

      Object.fromEntries(
        track1
          .filter((event) => event.name === "Text Event")
          .map((event) =>
            event.string.match(/^@([^:]*):[\t\s]*(.*)$/).slice(1, 3),
          ),
      ),
    );
  });

  useEffect(() => {
    // Load the MIDI data and trigger rendering
    MidiSamplePlayer.loadDataUri(mididata.magic_fire);
  }, []);

  return <h3>Pianolatron Demonstration</h3>;
};

ReactDOM.render(<App />, document.querySelector("#root"));
