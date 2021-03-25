import { Audio } from "expo-av";
import * as AudioFiles from "./audioSelector";

// Play audio file
export const playRightSound = async audioTrack => {
  let sound = AudioFiles.audioSelector(audioTrack);
  setTimeout(() => {
    Audio.Sound
      .createAsync(sound, { shouldPlay: true })
      .then(res => {
        res.sound.setOnPlaybackStatusUpdate(status => {
          if (!status.didJustFinish) return;
          console.log("Unloading ");
          res.sound.unloadAsync().catch(() => {
            Console.log("Could not unload sound");
          });
        });
      })
      .catch(error => {
        Console.log("Could not play sound");
      });
  }, 1000);
};
