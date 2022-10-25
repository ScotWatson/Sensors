/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

const initPageTime = performance.now();

const loadWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

const loadErrorLogModule = (async function () {
  try {
    const module = await import("https://scotwatson.github.io/Debug/ErrorLog.mjs");
    return module;
  } catch (e) {
    console.error(e);
  }
})();

(async function () {
  try {
    const modules = await Promise.all( [ loadWindow, loadErrorLogModule ] );
    start(modules);
  } catch (e) {
    console.error(e);
  }
})();

let xAccDisplay;
let yAccDisplay;
let zAccDisplay;
let magAccDisplay;
let acc;
let xLinAccDisplay;
let yLinAccDisplay;
let zLinAccDisplay;
let magLinAccDisplay;
let linAcc;
let xGravDisplay;
let yGravDisplay;
let zGravDisplay;
let magGravDisplay;
let grav;
let xGyroDisplay;
let yGyroDisplay;
let zGyroDisplay;
let magGyroDisplay;
let gyro;
let xMagDisplay;
let yMagDisplay;
let zMagDisplay;
let magMagDisplay;
let mag;

const strSensorPermissions = [
  "accelerometer",
  "ambient-light-sensor",
  "camera",
  "display-capture",
  "geolocation",
  "gyroscope",
  "magnetometer",
  "microphone",
  "nfc",
];

const strOtherPermissions = [
  "accessibility-events",
  "background-fetch",
  "background-sync",
  "bluetooth",
  "clipboard",
  "clipboard-read",
  "clipboard-write",
  "device-info",
  "idle-detection",
  "local-fonts",
  "midi",
  "notifications",
  "payment-handler",
  "periodic-background-sync",
  "persistent-storage",
  "push",
  "screen-wake-lock",
  "speaker",
  "speaker-selection",
  "storage-access",
  "system-wake-lock",
  "window-placement",
];

async function start( [ evtWindow, ErrorLog ] ) {
  try {
    let mapSensors = new Map();
    for (const elem of strSensorPermissions) {
      try {
        const status = await navigator.permissions.query({ name: elem });
        mapSensors.set(elem, status);
      } catch (e) {
        const p = document.createElement("p");
        p.innerHTML = elem + ": " + e.message;
        document.body.appendChild(p);
      }
    }
    let p;
    let label;
    if (mapSensors.get("accelerometer")?.state === "granted") {
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "x: ";
      p.appendChild(label);
      xAccDisplay = document.createElement("span");
      xAccDisplay.innerHTML = "";
      p.appendChild(xAccDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "y: ";
      p.appendChild(label);
      yAccDisplay = document.createElement("span");
      yAccDisplay.innerHTML = "";
      p.appendChild(yAccDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "z: ";
      p.appendChild(label);
      zAccDisplay = document.createElement("span");
      zAccDisplay.innerHTML = "";
      p.appendChild(zAccDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "mag: ";
      p.appendChild(label);
      magAccDisplay = document.createElement("span");
      magAccDisplay.innerHTML = "";
      p.appendChild(magAccDisplay);
      document.body.appendChild(p);
      acc = new Accelerometer({frequency: 60});
      acc.addEventListener("reading", readAcc);
      acc.start();

      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "x: ";
      p.appendChild(label);
      xLinAccDisplay = document.createElement("span");
      xLinAccDisplay.innerHTML = "";
      p.appendChild(xLinAccDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "y: ";
      p.appendChild(label);
      yLinAccDisplay = document.createElement("span");
      yLinAccDisplay.innerHTML = "";
      p.appendChild(yLinAccDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "z: ";
      p.appendChild(label);
      zLinAccDisplay = document.createElement("span");
      zLinAccDisplay.innerHTML = "";
      p.appendChild(zLinAccDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "mag: ";
      p.appendChild(label);
      magLinAccDisplay = document.createElement("span");
      magLinAccDisplay.innerHTML = "";
      p.appendChild(magLinAccDisplay);
      document.body.appendChild(p);
      linAcc = new LinearAccelerationSensor({frequency: 60});
      linAcc.addEventListener("reading", readLinAcc);
      linAcc.start();

      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "x: ";
      p.appendChild(label);
      xGravDisplay = document.createElement("span");
      xGravDisplay.innerHTML = "";
      p.appendChild(xGravDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "y: ";
      p.appendChild(label);
      yGravDisplay = document.createElement("span");
      yGravDisplay.innerHTML = "";
      p.appendChild(yGravDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "z: ";
      p.appendChild(label);
      zGravDisplay = document.createElement("span");
      zGravDisplay.innerHTML = "";
      p.appendChild(zGravDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "mag: ";
      p.appendChild(label);
      magGravDisplay = document.createElement("span");
      magGravDisplay.innerHTML = "";
      p.appendChild(magGravDisplay);
      document.body.appendChild(p);
      grav = new GravitySensor({frequency: 60});
      grav.addEventListener("reading", readGrav);
      grav.start();
    }
    if (mapSensors.get("gyroscope")?.state === "granted") {
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "x: ";
      p.appendChild(label);
      xGyroDisplay = document.createElement("span");
      xGyroDisplay.innerHTML = "";
      p.appendChild(xGyroDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "y: ";
      p.appendChild(label);
      yGyroDisplay = document.createElement("span");
      yGyroDisplay.innerHTML = "";
      p.appendChild(yGyroDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "z: ";
      p.appendChild(label);
      zGyroDisplay = document.createElement("span");
      zGyroDisplay.innerHTML = "";
      p.appendChild(zGyroDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "mag: ";
      p.appendChild(label);
      magGyroDisplay = document.createElement("span");
      magGyroDisplay.innerHTML = "";
      p.appendChild(magGyroDisplay);
      document.body.appendChild(p);
      gyro = new Gyroscope({frequency: 60});
      gyro.addEventListener("reading", readGyro);
      gyro.start();
    }
    if (mapSensors.get("magnetometer")?.state === "granted") {
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "x: ";
      p.appendChild(label);
      xMagDisplay = document.createElement("span");
      xMagDisplay.innerHTML = "";
      p.appendChild(xMagDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "y: ";
      p.appendChild(label);
      yMagDisplay = document.createElement("span");
      yMagDisplay.innerHTML = "";
      p.appendChild(yMagDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "z: ";
      p.appendChild(label);
      zMagDisplay = document.createElement("span");
      zMagDisplay.innerHTML = "";
      p.appendChild(zMagDisplay);
      document.body.appendChild(p);
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "mag: ";
      p.appendChild(label);
      magMagDisplay = document.createElement("span");
      magMagDisplay.innerHTML = "";
      p.appendChild(magMagDisplay);
      document.body.appendChild(p);
      mag = new Magnetometer({frequency: 60});
      mag.addEventListener("reading", readMag);
      mag.start();
    }
    const devices = await window.navigator.mediaDevices.enumerateDevices();
    const video = document.createElement("video");
    for (const device of devices) {
      const btn = document.createElement("button");
      btn.innerHTML = device.kind;
      btn.addEventListener("click", btnHandler(device));
      document.body.appendChild(btn);
    }
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "start",
      error: e,
    });
  }
}

function btnHandler(device) {
  switch (device.type) {
    case "videoinput":
      return function (evt) {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: {
              exact: device.deviceId,
            }
          }
        });
        video.srcObject = stream;
      }
      break;
    case "audioinput":
      return function (evt) {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: {
              exact: device.deviceId,
            }
          }
        });
        video.srcObject = stream;
      }
      break;
    case "audiooutput":
      return function (evt) {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: {
              exact: device.deviceId,
            }
          }
        });
      }
      break;
    default:
      return function (evt) {
      }
      break;
  };
}

function readAcc(evt) {
  xAccDisplay.innerHTML = acc.x.toFixed(2) + "m/s^2";
  yAccDisplay.innerHTML = acc.y.toFixed(2) + "m/s^2";
  zAccDisplay.innerHTML = acc.z.toFixed(2) + "m/s^2";
  magAccDisplay.innerHTML = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z).toFixed(2) + "m/s^2";
}

function readLinAcc(evt) {
  xLinAccDisplay.innerHTML = linAcc.x.toFixed(2) + "m/s^2";
  yLinAccDisplay.innerHTML = linAcc.y.toFixed(2) + "m/s^2";
  zLinAccDisplay.innerHTML = linAcc.z.toFixed(2) + "m/s^2";
  magLinAccDisplay.innerHTML = Math.sqrt(linAcc.x * linAcc.x + linAcc.y * linAcc.y + linAcc.z * linAcc.z).toFixed(2) + "m/s^2";
}

function readGrav(evt) {
  xGravDisplay.innerHTML = grav.x.toFixed(2) + "m/s^2";
  yGravDisplay.innerHTML = grav.y.toFixed(2) + "m/s^2";
  zGravDisplay.innerHTML = grav.z.toFixed(2) + "m/s^2";
  magGravDisplay.innerHTML = Math.sqrt(grav.x * grav.x + grav.y * grav.y + grav.z * grav.z).toFixed(2) + "m/s^2";
}

function readGyro(evt) {
  xGyroDisplay.innerHTML = gyro.x.toFixed(2) + "rad/s";
  yGyroDisplay.innerHTML = gyro.y.toFixed(2) + "rad/s";
  zGyroDisplay.innerHTML = gyro.z.toFixed(2) + "rad/s";
  magGyroDisplay.innerHTML = Math.sqrt(gyro.x * gyro.x + gyro.y * gyro.y + gyro.z * gyro.z).toFixed(2) + "rad/s";
}

function readMag(evt) {
  xMagDisplay.innerHTML = mag.x.toFixed(2) + "uT";
  yMagDisplay.innerHTML = mag.y.toFixed(2) + "uT";
  zMagDisplay.innerHTML = mag.z.toFixed(2) + "uT";
  magMagDisplay.innerHTML = Math.sqrt(mag.x * mag.x + mag.y * mag.y + mag.z * mag.z).toFixed(2) + "uT";
}
