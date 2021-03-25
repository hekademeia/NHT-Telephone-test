import React, { Component } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { Input, Card, Button, CheckBox } from "react-native-elements";
import SpaceView from "./spaceView";
import Toast, { DURATION } from "react-native-easy-toast";
import * as FileSystem from "expo-file-system";

const DeviceHeight = Dimensions.get("window").height;
const DeviceWidth = Dimensions.get("window").width;

export default class Initialscreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      clientID: "",
      testID: "",
      selectedEar: "",
      leftStatus: false,
      rightStatus: false
    };
    this.handleClientIDChange = this.handleClientIDChange.bind(this);
    this.handleTestIDCHange = this.handleTestIDCHange.bind(this);
  }

  handleClientIDChange(event) {
    this.setState({ clientID: event.nativeEvent.text });
  }

  handleTestIDCHange(event) {
    this.setState({ testID: event.nativeEvent.text });
  }

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

  selectEar = id => {
    if (id == "left") {
      this.setState({ selectedEar: "left" });
      this.setState({ leftStatus: true });
      this.setState({ rightStatus: false });
    } else if (id == "right") {
      this.setState({ selectedEar: "right" });
      this.setState({ leftStatus: false });
      this.setState({ rightStatus: true });
    }
  };

  render() {
    // console.log("FileSystem", FileSystem);
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          height: DeviceHeight,
          width: DeviceWidth
        }}
      >
        <Toast ref="error" position="bottom" />
        {this.spaceView(3, "first")}
        <Card>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              paddingRight: 10
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {" "}Client ID{" "}
            </Text>
            <Input onChange={this.handleClientIDChange} />
          </View>
        </Card>

        {this.spaceView(1, "first")}
        <Card>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              paddingRight: 10
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}> Test ID </Text>
            <Input onChange={this.handleTestIDCHange} />
          </View>
        </Card>

        <Card>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              paddingRight: 10
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {" "}Select Ear{" "}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <View>
                <CheckBox
                  id="left"
                  center
                  title="Left Ear"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={this.state.leftStatus}
                  onPress={() => this.selectEar("left")}
                />
              </View>
              <View>
                <CheckBox
                  id="right"
                  center
                  title="Right Ear"
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={this.state.rightStatus}
                  onPress={() => this.selectEar("right")}
                />
              </View>
            </View>
          </View>
        </Card>

        {this.spaceView(1, "first")}
        <Card>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              paddingRight: 10
            }}
          >

            <Button
              title="Begin Test"
              onPress={() => {
                if (this.state.selectedEar === "") {
                  this.refs.error.show("please select an ear");
                } else {
                  this.props.navigation.navigate("HomeScreen", {
                    selectedEar: this.state.selectedEar,
                    clientID: this.state.clientID,
                    testID: this.state.testID
                  });
                }
              }}
            />
          </View>
        </Card>
      </View>
    );
  }
}

const styles = {
  ButtonViewStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: "#DDDDDD",

    height: 70
  }
};
