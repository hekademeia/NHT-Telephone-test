import React from "react";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./components/homeScreen";
import { Header } from "react-native-elements";
import InitialScreen from "./components/entryscreen";
import { AppContainer } from "./navigation";
import ThankYou from "./components/thankYou";

// @TODO: This is to hide a Warning caused by NativeBase after upgrading to RN 0.62
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
])
// ------- END OF WARNING SUPPRESSION

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{
            text: "NHT Application",
            style: { color: "#fff" }
          }}
        />
        <AppContainer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff"
  }
});
