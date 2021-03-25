import { Audio } from "expo-av";
import * as AudioFiles from "./audioSelector";

// Play audio file
export const playLeftSound = async audioTrack => {
  let sound = AudioFiles.audioSelector(audioTrack);
  setTimeout(() => {
    Audio.Sound
      .createAsync(sound, { shouldPlay: true })
      .then(res => {
        res.sound.setOnPlaybackStatusUpdate(status => {
          if (!status.didJustFinish) return;
          console.log("Unloading ");
          res.sound.unloadAsync().catch(() => {});
        });
      })
      .catch(error => {});
  }, 1000);
};
