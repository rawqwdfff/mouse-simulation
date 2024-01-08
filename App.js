import { Accelerometer, Gyroscope } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import io from "socket.io-client";

const serverURL = "http://192.168.31.208:3000"; // Laptop's IP address

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [{ a, b, c }, setAccData] = useState({
    a: 0,
    b: 0,
    c: 0,
  });

  const [subscription, setSubscription] = useState(null);

  const _slow = () => Gyroscope.setUpdateInterval(1000);
  const _fast = () => Gyroscope.setUpdateInterval(16);

  const acc_slow = () => Accelerometer.setUpdateInterval(1000);
  const acc_fast = () => Accelerometer.setUpdateInterval(16);

  const gyro_subscribe = () => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        setData(gyroscopeData);
      })
    );
  };

  const acc_subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accScopeData) => {
        let modified_accScopeData = Object.assign(
          {},
          { a: accScopeData.x, b: accScopeData.y, c: accScopeData.z }
        );

        setAccData(modified_accScopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    gyro_subscribe();
    acc_subscribe();

    const socket = io(serverURL);

    // Replace with your gyroscope data handling logic
    const gyroScopeData = { x, y, z };
    const accScopeData = { a, b, c };

    // Transmit gyroscope data to the server
    console.log("Connected to server !!");
    socket.emit("sensorData", gyroScopeData, accScopeData);
    console.log("Sent Accelerometer and Gyrometric Sensor data");

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
      _unsubscribe();
    };
  }, [x, y, z, a, b, c]);

  return (
    <View style={styles.container}>
      <View style={styles.sub_container}>
        <Text style={styles.text}>Gyroscope:</Text>
        <Text style={styles.text}>x: {x}</Text>
        <Text style={styles.text}>y: {y}</Text>
        <Text style={styles.text}>z: {z}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={subscription ? _unsubscribe : gyro_subscribe}
            style={styles.button}
          >
            <Text>{subscription ? "On" : "Off"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={_slow}
            style={[styles.button, styles.middleButton]}
          >
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={styles._sub_container}>
          <Text style={styles.text}>
            Accelerometer: (in gs where 1g = 9.81 m/s^2)
          </Text>
          <Text style={styles.text}>x: {a}</Text>
          <Text style={styles.text}>y: {b}</Text>
          <Text style={styles.text}>z: {c}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={subscription ? _unsubscribe : acc_subscribe}
              style={styles.button}
            >
              <Text>{subscription ? "On" : "Off"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={acc_slow}
              style={[styles.button, styles.middleButton]}
            >
              <Text>Slow</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={acc_fast} style={styles.button}>
              <Text>Fast</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sub_container: {
    marginTop: 100,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  text: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});
