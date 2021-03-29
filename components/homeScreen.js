import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert
} from "react-native";
import {
  Card,
  ListItem,
  Button,
  Icon,
  Divider,
  Input
} from "react-native-elements";
import SpaceView from "./spaceView";
import { Audio } from "expo-av";
import * as Constants from "./constants";
import EarSelect from "./earSelection";
import Toast, { DURATION } from "react-native-easy-toast";
import * as AudioFiles from "./audioSelector";
import EntryScreen from "./entryscreen";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import { Overlay } from "react-native-elements";
import * as LeftPlayer from "./leftPlayer";
import * as RightPlayer from "./rightPlayer";
import ThankYou from "./thankYou";
//import * as MailComposer from 'expo-mail-composer';
//import Communications from 'react-native-communications';



const DeviceHeight = Dimensions.get("window").height;
const DeviceWidth = Dimensions.get("window").width;
var fileWriter = [];

let NUM_TRIALS = 30;
let senderURL = "http://nht.iu.hekademeia.org/email.php";
if(__DEV__){ // settings for development
  NUM_TRIALS = 2;
  senderURL = "http://localhost:8887/email.php";
}

export default class HomeScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      left: [],
      right: [],
      currentTrack: "",
      currentLevel: 2,
      inputValue: "",
      leftCounter: 0,
      rightCounter: 0,
      leftCorrectResponses: 0,
      rightCorrectResponses: 0,
      currentEar: "",
      soundFlag: 0,
      leftStatus: false,
      rightStatus: false,
      testContinue: false,
      fileWrite: [],
      isOverlayVisible: false,
      fileWritten: false
    };
    this.returnButton = this.returnButton.bind(this);
  }



  displaySelectEarButton() {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center"
        }}
      >
        <SpaceView />
        <Text style={{ fontSize: 20 }}>
          Testing {this.state.currentEar} ear currently and track no is{" "}
          {this.state.currentTrack}_{this.state.currentLevel}
        </Text>
      </View>
    );
  }

  handleOverlay = earPreference => {
    if (earPreference == "left") {
      var array = [...this.state.left]; // make a separate copy of the array
      const currentVal = array[0];
      const newArray = array.slice(1, 0).concat(array.slice(1, array.length));
      let currentTrackString =
        this.state.currentTrack + "_" + this.state.currentLevel;
      this.setState({ left: newArray });
      this.setState({ currentTrack: currentVal });
    } else if (earPreference == "right") {
      var array = [...this.state.right]; // make a separate copy of the array
      const currentVal = array[0];
      const newArray = array.slice(1, 0).concat(array.slice(1, array.length));
      let currentTrackString =
        this.state.currentTrack + "_" + this.state.currentLevel;
      this.setState({ right: newArray });
      this.setState({ currentTrack: currentVal });
    }
    let str =
      earPreference == "left"
        ? "---------------------left----------------------\n|Trial No.|Stimulus|Track Level|Response|"
        : "---------------------right---------------------\n|Trial No.|Stimulus|Track Level|Response|";
    fileWriter.push(str);
    this.setState({ currentEar: earPreference });
  };

  async leftTrackChange() {
    if (this.state.currentEar == "left") {
      if (this.state.leftCorrectResponses == 0 && this.state.leftCounter > 5) {
        if (this.state.rightStatus == false) {
          var array = [...this.state.right]; // make a separate copy of the array
          const currentVal = array[0];
          const newArray = array
            .slice(1, 0)
            .concat(array.slice(1, array.length));
          this.setState({ currentTrack: currentVal });
          this.setState({ right: newArray });
          this.setState({ currentEar: "right" });
          this.setState({ currentLevel: 2 });
          let str =
            "\n---------------------right---------------------\n|Trial No.|Stimulus|Track Level|Response|";
          fileWriter.push(str);
        } else {
          await this.saveFile();
          this.setState({ currentTrack: 0 });
          this.setState({ currentEar: "" });
        }
        this.setState({ leftStatus: true });
      } else if (
        this.state.leftCorrectResponses >= 0 &&
        this.state.leftCounter < NUM_TRIALS
      ) {
        var array = [...this.state.left];
        const currentVal = array[0];
        const newArray = array.slice(1, 0).concat(array.slice(1, array.length));
        this.setState({ currentTrack: currentVal });
        this.setState({ left: newArray });
      } else {
        if (this.state.rightStatus == false) {
          var array = [...this.state.right]; // make a separate copy of the array
          const currentVal = array[0];
          const newArray = array
            .slice(1, 0)
            .concat(array.slice(1, array.length));
          this.setState({ currentTrack: currentVal });
          this.setState({ right: newArray });
          this.setState({ currentEar: "right" });
          this.setState({ currentLevel: 2 });

          let str =
            "\n---------------------right---------------------\n|Trial No.|Stimulus|Track Level|Response|";
          fileWriter.push(str);
        } else {
          await this.saveFile();
          this.setState({ currentTrack: 0 });
          this.setState({ currentEar: "" });
        }
        this.setState({ leftStatus: true });
      }
    }
  }

  async rightTrackChange() {
    if (this.state.currentEar == "right") {
      if (
        this.state.rightCorrectResponses == 0 &&
        this.state.rightCounter > 5
      ) {
        if (this.state.leftStatus == false) {
          var array = [...this.state.left]; // make a separate copy of the array
          const currentVal = array[0];
          const newArray = array
            .slice(1, 0)
            .concat(array.slice(1, array.length));
          this.setState({ currentTrack: currentVal });
          this.setState({ left: newArray });
          this.setState({ currentEar: "left" });
          this.setState({ currentLevel: 2 });
          let str =
            "\n---------------------left----------------------\n|Trial No.|Stimulus|Track Level|Response|";
          fileWriter.push(str);
        } else {
          await this.saveFile();
          this.setState({ currentTrack: 0 });
          this.setState({ currentEar: "" });
        }
        this.setState({ rightStatus: true });
      } else if (
        this.state.rightCorrectResponses >= 0 &&
        this.state.rightCounter < NUM_TRIALS
      ) {
        var array = [...this.state.right];
        const currentVal = array[0];
        const newArray = array.slice(1, 0).concat(array.slice(1, array.length));
        this.setState({ currentTrack: currentVal });
        this.setState({ right: newArray });
      } else {
        if (this.state.leftStatus == false) {
          var array = [...this.state.left]; // make a separate copy of the array
          const currentVal = array[0];
          const newArray = array
            .slice(1, 0)
            .concat(array.slice(1, array.length));
          this.setState({ currentTrack: currentVal });
          this.setState({ left: newArray });
          this.setState({ currentEar: "left" });
          this.setState({ currentLevel: 2 });

          let str =
            "\n---------------------left----------------------\n|Trial No.|Stimulus|Track Level|Response|";
          fileWriter.push(str);
        } else {
          await this.saveFile();
          this.setState({ currentTrack: 0 });
          this.setState({ currentEar: "" });
        }
        this.setState({ rightStatus: true });
      }
    }
  }

  async trackChange() {
    // console.log(
    //   "Left counter is " +
    //     this.state.leftCounter +
    //     " and left status is " +
    //     this.state.leftStatus
    // );
    // console.log(
    //   "right counter is " +
    //     this.state.rightCounter +
    //     " and right status is " +
    //     this.state.rightStatus
    // );
    if (this.state.rightStatus == true && this.state.leftStatus == true) {
      console.log("test complete");
      return;
    }
    if (this.state.currentEar == "left" && this.state.leftStatus == false) {
      await this.leftTrackChange();
    } else if (
      this.state.currentEar == "right" &&
      this.state.rightStatus == false
    ) {
      await this.rightTrackChange();
    }
  }

  async playAudio() {
    if (
      this.state.currentEar == "right" &&
      this.state.rightCounter == 0 &&
      this.state.leftStatus == true &&
      this.state.testContinue == false
    ) {
      this.setState({ testContinue: true });
      this.setState({ isOverlayVisible: true });
      return;
    }
    if (
      this.state.currentEar == "left" &&
      this.state.leftCounter == 0 &&
      this.state.rightStatus == true &&
      this.state.testContinue == false
    ) {
      this.setState({ testContinue: true });
      this.setState({ isOverlayVisible: true });
      return;
    }
    let currentTrackString =
      this.state.currentTrack +
      "_" +
      this.state.currentLevel +
      "_" +
      (this.state.currentEar == "left" ? "_L" : "_R");
    // console.log("audio is " + currentTrackString);
    if (this.state.currentEar == "left") {
      await LeftPlayer.playLeftSound(currentTrackString);
      this.setState({ soundFlag: 1 });
      if (this.state.currentEar == "left") {
        var leftCount = this.state.leftCounter + 1;
        this.setState({ leftCounter: leftCount });
      } else if (this.state.currentEar == "right") {
        var rightCount = this.state.rightCounter + 1;
        // console.log("new right count is " + rightCount);
        this.setState({ rightCounter: rightCount });
      }
    } else if (this.state.currentEar == "right") {
      await RightPlayer.playRightSound(currentTrackString);
      this.setState({ soundFlag: 1 });
      if (this.state.currentEar == "left") {
        var leftCount = this.state.leftCounter + 1;
        this.setState({ leftCounter: leftCount });
      } else if (this.state.currentEar == "right") {
        var rightCount = this.state.rightCounter + 1;
        // console.log("new right count is " + rightCount);
        this.setState({ rightCounter: rightCount });
      }
    }
  }
  // This method will select 20 files randomly for each ear and add it to the state variables left and right
  UNSAFE_componentWillMount() {
    let Leftvisited = [];
    //randomly selecting NUM_TRIALS files for the left ear
    while (Leftvisited.length < NUM_TRIALS) {
      let randNumber = Math.floor(Math.random() * 64);
      if (Leftvisited.includes(Constants.audioFiles[randNumber])) {
        continue;
      } else {
        Leftvisited.push(Constants.audioFiles[randNumber]);
      }
    }
    //setting state variable left according to the audio files selected
    this.setState({ left: Leftvisited });

    let RightVisited = [];
    //randomly selecting NUM_TRIALS files for the right ear which haven't been used for the left ear
    while (RightVisited.length < NUM_TRIALS) {
      let randNumber = Math.floor(Math.random() * 64);
      if (
        Leftvisited.includes(Constants.audioFiles[randNumber]) ||
        RightVisited.includes(Constants.audioFiles[randNumber])
      ) {
        continue;
      } else {
        RightVisited.push(Constants.audioFiles[randNumber]);
      }
    }
    // setting state variable right according to the 30 files selected
    this.setState({ right: RightVisited });
  }

  async componentDidMount() {
    console.log("right array" + this.state.right);
    console.log("left array" + this.state.left);
    await this.handleOverlay(this.props.navigation.state.params.selectedEar);
  }

  // This method would append the text value entered by the user into the top text show area
  appendState = num => {
    this.setState({ inputText: this.state.inputText + num });
  };

  //This method would remove the last character from the string entered in the top text area
  backspace = () => {
    this.setState({ inputText: this.state.inputText.slice(0, -1) });
  };

  // This function would return blank views in order to maintain spacing between components in the final render function.
  // The function intakes the num argument as the num of space views and val argument in order to assign a unique key to
  // each view which is an important aspect for react components
  spaceView = (num, val) => {
    let returnDiv = [];
    for (let i = 0; i < num; i++) {
      let keyValue = `${val}` + `${i}`;
      returnDiv.push(<SpaceView key={keyValue} />);
    }
    return (
      <View>
        {returnDiv}
      </View>
    );
  };

  // This function returns a button component according to the num argument passed to it. This button would be titled
  // same as the argument passed and would also work as a button (i.e. append the value clicked to the top text section)
  returnButton = num => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.appendState(num);
        }}
        style={styles.ButtonStyle}
      >
        <Text style={{ fontSize: 40, fontWeight: "bold" }}>
          {num}
        </Text>
      </TouchableOpacity>
    );
  };

  clear = () => {
    this.setState({ inputText: "" });
  };

  // This function would reset all the states and take the test to its initial state
  reset() {
    this.setState({ currentEar: "" });
    this.setState({ overlayActivate: false });
    this.setState({ inputValue: "" });
    this.setState({ currentTrack: "" });
    this.setState({ currentLevel: 2 });
    this.setState({ counter: 0 });
    this.setState({ correctResponses: 0 });
    this.componentDidMount();
  }

  async correctResponseChanger() {
    if (this.state.currentEar == "left") {
      await this.setState({
        leftCorrectResponses: this.state.leftCorrectResponses + 1
      });
    } else if (this.state.currentEar == "right") {
      await this.setState({
        rightCorrectResponses: this.state.rightCorrectResponses + 1
      });
    }
  }

  async verifyRegister() {
    if (this.state.inputText == this.state.currentTrack) {
      // console.log(
      //   "trial number : " +
      //     (this.state.currentEar == "left"
      //       ? this.state.leftCounter
      //       : this.state.rightCounter) +
      //     ", stimulus : " +
      //     this.state.currentTrack +
      //     ", level : " +
      //     this.state.currentLevel +
      //     ", response : " +
      //     this.state.inputText
      // );

      let verifyString =
        "      " +
        (this.state.currentEar == "left"
          ? this.state.leftCounter
          : this.state.rightCounter) +
        "            " +
        this.state.currentTrack +
        "             " +
        this.state.currentLevel +
        "            " +
        this.state.inputText +
        "      ";
      fileWriter.push(verifyString);
      if (this.state.currentLevel < 11) {
        var currentLevel = this.state.currentLevel + 1;
      } else {
        var currentLevel = this.state.currentLevel;
      }
      this.setState({ soundFlag: 0 });
      await this.correctResponseChanger();
      this.setState({ currentLevel: currentLevel });
      this.setState({ inputText: "" });
      await this.trackChange();
      await this.playAudio();
    } else {
      // console.log(
      //   this.state.inputText,
      //   "doesn't match",
      //   this.state.currentTrack
      // );
      let verifyString =
        "      " +
        (this.state.currentEar == "left"
          ? this.state.leftCounter
          : this.state.rightCounter) +
        "            " +
        this.state.currentTrack +
        "             " +
        this.state.currentLevel +
        "            " +
        this.state.inputText +
        "      ";
      fileWriter.push(verifyString);

      if (this.state.currentLevel > 1) {
        var currentLevel = this.state.currentLevel - 1;
        this.setState({ currentLevel: currentLevel });

        await this.trackChange();
        await this.playAudio();
      } else {
        var currentLevel = this.state.currentLevel;
        this.setState({ currentLevel: currentLevel });

        await this.trackChange();
        await this.playAudio();
      }
      this.setState({ inputText: "" });
    }
  }

  renderAudioButton() {
    // if (this.state.leftCounter == NUM_TRIALS || this.state.rightCounter == NUM_TRIALS) {
    //   console.log(
    //     "selected ear is " +
    //       this.state.currentEar +
    //       " and leftCounter is " +
    //       this.state.leftCounter +
    //       " and right counter is " +
    //       this.state.rightCounter
    //   );
    // }
    if (
      (this.state.currentEar == "left" && this.state.leftCounter == 0) ||
      (this.state.currentEar == "right" && this.state.rightCounter == 0)
    ) {
      return (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Overlay
            isVisible={this.state.isOverlayVisible}
            onBackdropPress={() => this.setState({ isOverlayVisible: false })}
            height="25%"
            width="80%"
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                {this.state.currentEar == "left" ? "Right" : "Left"} ear testing
                complete
              </Text>
              <SpaceView />
              <Text>
                Press Continue to start testing the{" "}
                {this.state.currentEar == "left" ? "Left" : "Right"} ear
              </Text>
              <SpaceView />
              <SpaceView />
              <Button
                title="Continue"
                onPress={() => this.setState({ isOverlayVisible: false })}
              />
            </View>
          </Overlay>
          {/* <TouchableOpacity
            onPress={() => {
              this.playAudio();
            }}
            style={{ margin: 20 }}
          >
            <Icon
              name="play-circle-outline"
              type="material"
              color="black"
              size={100}
            />
          </TouchableOpacity> */}
          <Button
          title = "Start"
          style={{ margin: 20, width:100, fontSize:30, fontWeight:"bold", height:70 }}
          onPress={() => {
              this.playAudio();
            }}
          />
        </View>
      );
    } else {
      if(this.state.inputText.length == 3){
      return (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* <TouchableOpacity
            onPress={() => {
              this.verifyRegister();
            }}
            style={{ margin: 20 }}
          >
            <Icon name="done" type="material" color="black" size={100} />
          </TouchableOpacity> */}
          <Button
          title = "Next"
          style={{ margin: 20, width:100, fontSize:30, fontWeight:"bold", height:70 }}
          onPress={() => {
              this.verifyRegister();
            }}
          />
        </View>
      );
      }else{
        return (
          <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            margin: 10
          }}
        >
          <Text>Please enter your response</Text>
        </View>
        )
      }
    }
  }

  saveFile = async () => {
    if (this.state.fileWritten == false) {
      var finalWriteStr = "";
      for (let i = 0; i < fileWriter.length; i++) {
        finalWriteStr = finalWriteStr + "\n" + fileWriter[i];
      }
      console.log("finalString is ", finalWriteStr);
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        let fileUri = FileSystem.documentDirectory + "text.txt";
        await FileSystem.writeAsStringAsync(fileUri, finalWriteStr, {
          encoding: FileSystem.EncodingType.UTF8
        });
        if (Platform.OS != "ios"){
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync("Download", asset, false);
        }
      }
      await this.setState({ fileWritten: true });
    }
  };

  render() {
    if (this.state.leftStatus == true && this.state.rightStatus == true) {
      var finalWriteStr = "";
      for (let i = 0; i < fileWriter.length; i++) {
        finalWriteStr = finalWriteStr + "\n" + fileWriter[i];
      }
      setTimeout(() => {
        // MailComposer.composeAsync({
        //   recipients :["kidd@iu.edu"],
        //   subject:"Results for Client ID: "+ this.props.navigation.state.params.clientID + " and Test ID: " + this.props.navigation.state.params.testID,
        //   body:finalWriteStr + "\n\n" + "Thank You,\nNHT Group"
        // })
        /*Communications.email(
          ['kidd@iu.edu'],null,null,
          "Results for Client ID: "+ this.props.navigation.state.params.clientID + " and Test ID: " + this.props.navigation.state.params.testID,
          finalWriteStr + "\n\n" + "Thank You,\nNHT Group"
        )*/
        fetch(senderURL,{
          method: "POST",
          headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded'
          }),
          body: "cid="+this.props.navigation.state.params.clientID
            +"&tid="+this.props.navigation.state.params.testID
            +"&body="+finalWriteStr
        }).then((rsp) => rsp.json()).then((json)=>{
          console.log(json)
          if(json.err!=0)
            Alert.alert(
              "An Error Ocurred",
              "There was a problem sending the results!",
              [{ text: 'OK', onPress: ()=>console.log(json.err) }]
            )
        })
      }, 250)
      return <ThankYou />;
    } else {
      return (
        <View id="MainView" style={styles.MainView}>
          {/* {this.displaySelectEarButton()} */}
          {/* <Text>
          {this.props.navigation.state.params.selectedEar}
        </Text> */}
          {this.spaceView(2, "main")}
          <Toast ref="error" position="top" />
          <Text
            style={{
              textAlign: "center",
              fontSize: 40,
              height: 60
            }}
          >
            {this.state.inputText}
          </Text>
          {this.spaceView(5, "numpad")}
          <View style={styles.ButtonViewStyle}>
            {this.returnButton("1")}
            {this.returnButton("2")}
            {this.returnButton("3")}
          </View>
          {this.spaceView(2, "numpad1")}
          <View style={styles.ButtonViewStyle}>
            {this.returnButton("4")}
            {this.returnButton("5")}
            {this.returnButton("6")}
          </View>
          {this.spaceView(2, "numpad2")}
          <View style={styles.ButtonViewStyle}>
            {this.returnButton("7")}
            {this.returnButton("8")}
            {this.returnButton("9")}
          </View>
          {this.spaceView(2, "numpad3")}
          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              onPress={() => {
                this.clear();
              }}
            >
              <Icon name="clear" color="black" size={50} />
            </TouchableOpacity>
            {this.returnButton("0")}
            <TouchableOpacity
              onPress={() => {
                this.backspace();
              }}
            >
              <Icon name="backspace" color="black" size={50} />
            </TouchableOpacity>
          </View>
          {this.spaceView(2, "numpad3")}
          {this.renderAudioButton()}
        </View>
      );
    }
  }
}

const styles = {
  MainView: {
    height: DeviceHeight,
    width: DeviceWidth
  },
  ButtonStyle: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    alignContent: "center",
    justifyContent: "center",
    height: 80,
    width: 80,
    borderRadius: 40
  },
  ButtonViewStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 40,
    marginRight: 40,
    height: 70
  },
  selectEar: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    alignContent: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
    borderRadius: 30
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  }
};
