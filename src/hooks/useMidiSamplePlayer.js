import { useState, useEffect } from "react";

import MidiPlayer from "midi-player-js";
import Soundfont from "soundfont-player";

const SOFT_PEDAL_RATIO = 0.67;
const HALF_BOUNDARY = 66; // F# above Middle C; divides the keyboard into two "pans"
const ADSR_SAMPLE_DEFAULTS = {
  attack: 0.01,
  decay: 0.1,
  sustain: 0.9,
  release: 0.3,
};

const decodeHtmlEntities = (string) =>
  string
    .replace(/&#(\d+);/g, (match, num) => String.fromCodePoint(num))
    .replace(/&#x([A-Za-z0-9]+);/g, (match, num) =>
      String.fromCodePoint(parseInt(num, 16)),
    );

const midiSamplePlayer = new MidiPlayer.Player();

const activeAudioNodes = {};
const activeNotes = [];
const sustainedNotes = [];

let adsr = ADSR_SAMPLE_DEFAULTS;
let baseTempo;
let tempoRatio = 1.0; // To keep track of gradual roll acceleration
let sliderTempo = 60.0;

let volumeRatio = 1.0;
const leftVolumeRatio = 1.0;
const rightVolumeRatio = 1.0;
const sustainPedalOn = false;
const softPedalOn = false;
const panBoundary = HALF_BOUNDARY;
const sampleInst = "acoustic_grand_piano";

const useMidiSamplePlayer = (mididata) => {
  const [rollMetadata, setRollMetadata] = useState({});

  const initMidiPlayer = (instrument, audioContext) => {
    midiSamplePlayer.on("fileLoaded", () => {
      const metadataTrack = midiSamplePlayer.events[0];
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
              event.string
                .match(/^@([^:]*):[\t\s]*(.*)$/)
                .slice(1, 3)
                .map((value) => decodeHtmlEntities(value)),
            ),
        ),
      );

      // set base tempo to the value of event.data for the event with the lowest value
      //  for event.tick where event.name is "Set Tempo"
      baseTempo = Object.values(
        metadataTrack.filter((event) => event.name === "Set Tempo"),
      ).reduce((prev, curr) => (prev.tick < curr.tick ? prev : curr)).data;
    });

    midiSamplePlayer.on("midiEvent", ({ name, data, noteNumber, velocity }) => {
      if (name === "Note on") {
        if (velocity === 0) {
          // Note off
          if (
            noteNumber in activeAudioNodes &&
            !sustainedNotes.includes(noteNumber)
          ) {
            try {
              activeAudioNodes[noteNumber].stop();
            } catch (ex) {
              console.log(
                "COULDN'T STOP NOTE, PROBABLY DUE TO WEIRD ADSR VALUES, RESETTING",
              );

              adsr = ADSR_SAMPLE_DEFAULTS;
            }
            delete activeAudioNodes[noteNumber];
          }
          // remove every occurrence of noteNumber in activeNotes
          while (activeNotes.includes(noteNumber)) {
            activeNotes.splice(activeNotes.indexOf(noteNumber), 1);
          }
        } else {
          // Note on
          if (sustainedNotes.includes(noteNumber)) {
            try {
              activeAudioNodes[noteNumber].stop();
            } catch (ex) {
              console.log(
                "Tried and failed to stop sustained note being re-touched",
                noteNumber,
              );
            }
            activeAudioNodes[noteNumber] = null;
          }

          let updatedVolume = (velocity / 100) * volumeRatio;
          if (softPedalOn) {
            updatedVolume *= SOFT_PEDAL_RATIO;
          }
          if (noteNumber < panBoundary) {
            updatedVolume *= leftVolumeRatio;
          } else if (noteNumber >= panBoundary) {
            updatedVolume *= rightVolumeRatio;
          }

          try {
            activeAudioNodes[noteNumber] = instrument.play(
              noteNumber,
              audioContext.currentTime,
              {
                gain: updatedVolume,
                adsr,
              },
            );
          } catch (ex) {
            // Get rid of this eventually
            console.log("IMPOSSIBLE ADSR VALUES FOR THIS NOTE, RESETTING");
            adsr = ADSR_SAMPLE_DEFAULTS;
            activeAudioNodes[noteNumber] = instrument.play(
              noteNumber,
              audioContext.currentTime,
              {
                gain: updatedVolume,
                adsr,
              },
            );
          }
          if (sustainPedalOn && !sustainedNotes.includes(noteNumber)) {
            sustainedNotes.push(noteNumber);
          }
          if (!activeNotes.includes(noteNumber)) {
            activeNotes.push(noteNumber);
          }
        }
      } else if (name === "Set Tempo") {
        // Note: MidiPlayerJS automatically sets the tempo in response to
        //       "Set Tempo" events, so we need to intervene here.
        // (https://github.com/grimmdude/MidiPlayerJS/releases/tag/2.0.12)
        tempoRatio = 1 + (data - baseTempo) / baseTempo;
        midiSamplePlayer.setTempo(sliderTempo * tempoRatio);
      }
    });
    midiSamplePlayer.loadDataUri(mididata);
  };

  const playPauseMidiFile = () => {
    if (midiSamplePlayer.isPlaying()) {
      midiSamplePlayer.pause();
    } else {
      midiSamplePlayer.play();
    }
  };

  const stopMidiFile = () => {
    midiSamplePlayer.stop();
  };

  const updateSliderTempo = (_sliderTempo) => {
    // If not paused during tempo change, player jumps back a bit on
    // shift to slower playback tempo, forward on shift to faster tempo.
    // See https://github.com/grimmdude/MidiPlayerJS/issues/13#issuecomment-354489911
    midiSamplePlayer
      .pause()
      .setTempo(_sliderTempo * tempoRatio)
      .play();
    sliderTempo = _sliderTempo;
  };

  const updateVolumeRatio = (_volumeRatio) => {
    volumeRatio = _volumeRatio;
  };

  useEffect(() => {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext || false;
    const audioContext = new AudioContext();

    /* Necessary for volume control */
    // const gainNode = ac.createGain();
    // gainNode.connect(ac.destination);
    // this.setState({ gainNode });

    Soundfont.instrument(audioContext, sampleInst, {
      soundfont: "MusyngKite",
    }).then((instrument) => initMidiPlayer(instrument, audioContext));
  }, []);

  return {
    rollMetadata,
    playPauseMidiFile,
    stopMidiFile,
    sliderTempo,
    updateSliderTempo,
    volumeRatio,
    updateVolumeRatio,
  };
};

export default useMidiSamplePlayer;
