import { useState, useEffect } from "react";

import MidiPlayer from "midi-player-js";

const useMidiSamplePlayer = (mididata) => {
  const [midiSamplePlayer, setMidiSamplePlayer] = useState();
  const [rollMetadata, setRollMetadata] = useState({});

  const initMidiPlayer = () => {
    const _midiSamplePlayer = new MidiPlayer.Player();
    _midiSamplePlayer.on("fileLoaded", () => {
      const metadataTrack = _midiSamplePlayer.events[0];
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
          metadataTrack
            .filter((event) => event.name === "Text Event")
            .map((event) =>
              event.string.match(/^@([^:]*):[\t\s]*(.*)$/).slice(1, 3),
            ),
        ),
      );
    });

    _midiSamplePlayer.loadDataUri(mididata);
    setMidiSamplePlayer(_midiSamplePlayer);
  };

  useEffect(() => initMidiPlayer(), []);

  return { rollMetadata };
};

export default useMidiSamplePlayer;
