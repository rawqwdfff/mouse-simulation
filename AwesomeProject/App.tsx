import {Accelerometer} from 'expo-sensors';
import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import WebSocket from 'ws';

var ws = new WebSocket('ws://host.com/path');

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});

function App(): JSX.Element {
  const [{x, y, z}, setData] = useState({x: 0, y: 0, z: 0});

  useEffect(() => {
    const subscription = Accelerometer.addListener(setData);
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text>x: {x}</Text>
      <Text>y: {y}</Text>
      <Text>z: {z}</Text>
      <Button
        title="Slow"
        onPress={() => Accelerometer.setUpdateInterval(2000)}
      />
      <Button
        title="Fast"
        onPress={() => Accelerometer.setUpdateInterval(50)}
      />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
