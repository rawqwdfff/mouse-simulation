import { createServer } from "http";
import robot from "robotjs";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer);

let PointerPosition = { x: 688, y: 384 };

function project3DTo2D(x, y, z, cameraDistance) {
  // Assuming camera is at (0, 0, -cameraDistance)
  const scaleFactor = cameraDistance / (cameraDistance + z);
  const projectedX = x * -50;
  const projectedY = y * 50;

  // Return the 2D coordinates
  return { x: projectedX, y: projectedY };
}

// class SensorSimulator {
//   constructor() {
//     this.rotation = { x: 0, y: 0, z: 0 }; // Initial rotation angles
//     this.acceleration = { x: 0, y: 0, z: 0 }; // Initial acceleration values
//     this.angularVelocity = { x: 0, y: 0, z: 0 }; // Initial angular velocity values
//     this.timeStep = 0.01; // Time step for integration
//     this.initial2DCoordinates = { x: 688, y: 384 }; // Initial 2D coordinates
//   }

//   updateSensors() {
//     // Simulated function to update gyroscope and accelerometer data
//     // Replace this with actual sensor data from your application
//     this.angularVelocity = {
//       x: Math.random() * 0.1,
//       y: Math.random() * 0.1,
//       z: Math.random() * 0.1,
//     };

//     this.acceleration = {
//       x: Math.random() * 0.1,
//       y: Math.random() * 0.1,
//       z: Math.random() * 0.1,
//     };
//   }

//   eulerIntegration() {
//     // Update sensor data
//     this.updateSensors();

//     // Euler's method integration for gyroscope
//     this.rotation.x += this.angularVelocity.x * this.timeStep;
//     this.rotation.y += this.angularVelocity.y * this.timeStep;
//     this.rotation.z += this.angularVelocity.z * this.timeStep;

//     // Euler's method integration for accelerometer (simple for illustration)
//     this.initial2DCoordinates.x += this.acceleration.x * this.timeStep;
//     this.initial2DCoordinates.y += this.acceleration.y * this.timeStep;

//     // Return 2D coordinates based on the 3D rotation and accelerometer data
//     return {
//       x: this.initial2DCoordinates.x + this.rotation.y, // Adjust based on your coordinate system
//       y: this.initial2DCoordinates.y + this.rotation.x,
//     };
//   }

//   simulate() {
//     // Simulate continuous updates
//     setInterval(() => {
//       const coordinates = this.eulerIntegration();
//       console.log('2D Coordinates:', coordinates);
//     }, this.timeStep * 1000); // Convert time step to milliseconds
//   }
// }

io.on("connection", (socket) => {
  console.log("Android device connected");

  socket.on("sensorData", (gyroscopeData, accelerometerData) => {
    console.log("Gyrometer Data received: gyroscopeData");
    console.log("Accelerometer Data received: accelerometerData");

    // Update laptop pointer position based on gyroscope data

    // const sensorSimulator = new SensorSimulator();
    // sensorSimulator.simulate();

    let Pointer = project3DTo2D(
      gyroscopeData.x,
      gyroscopeData.y,
      gyroscopeData.z,
      0
    );
    PointerPosition.x += Pointer.x;
    PointerPosition.y += Pointer.y;

    console.log("Moving laptop pointer to:", PointerPosition);
    robot.moveMouseSmooth(PointerPosition.x, PointerPosition.y);
  });

  socket.on("disconnect", () => {
    console.log("Android device disconnected");
  });
});

httpServer.listen(3000);
