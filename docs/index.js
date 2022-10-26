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

class Averager {
  #array;
  constructor(length) {
    this.#array = new Array(length);
    for (let i = 0; i < length; ++i) {
      this.#array[i] = 0;
    }
  }
  sample(value) {
    this.#array.shift();
    this.#array.push(value);
    let ret = 0;
    for (let i = 0; i < this.#array.length; ++i) {
      ret += this.#array[i];
    }
    ret /= this.#array.length;
    return ret;
  }
}

let xAccDisplay;
let yAccDisplay;
let zAccDisplay;
let magAccDisplay;
let timeAccDisplay;
let acc;
let xLinAccDisplay;
let yLinAccDisplay;
let zLinAccDisplay;
let magLinAccDisplay;
let timeLinAccDisplay;
let linAcc;
let xGravDisplay;
let yGravDisplay;
let zGravDisplay;
let magGravDisplay;
let timeGravDisplay;
let grav;
let xGyroDisplay;
let yGyroDisplay;
let zGyroDisplay;
let magGyroDisplay;
let timeGyroDisplay;
let gyro;
let xMagDisplay;
let yMagDisplay;
let zMagDisplay;
let magMagDisplay;
let timeMagDisplay;
let mag;
let video;

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
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "time: ";
      p.appendChild(label);
      timeAccDisplay = document.createElement("span");
      timeAccDisplay.innerHTML = "";
      p.appendChild(timeAccDisplay);
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
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "time: ";
      p.appendChild(label);
      timeLinAccDisplay = document.createElement("span");
      timeLinAccDisplay.innerHTML = "";
      p.appendChild(timeLinAccDisplay);
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
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "time: ";
      p.appendChild(label);
      timeGravDisplay = document.createElement("span");
      timeGravDisplay.innerHTML = "";
      p.appendChild(timeGravDisplay);
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
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "time: ";
      p.appendChild(label);
      timeGyroDisplay = document.createElement("span");
      timeGyroDisplay.innerHTML = "";
      p.appendChild(timeGyroDisplay);
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
      p = document.createElement("p");
      label = document.createElement("span");
      label.innerHTML = "time: ";
      p.appendChild(label);
      timeMagDisplay = document.createElement("span");
      timeMagDisplay.innerHTML = "";
      p.appendChild(timeMagDisplay);
      document.body.appendChild(p);
      mag = new Magnetometer({frequency: 10});
      mag.addEventListener("reading", readMag);
      mag.start();
    }
    const devices = await window.navigator.mediaDevices.enumerateDevices();
    video = document.createElement("video");
    for (const device of devices) {
      const btn = document.createElement("button");
      btn.innerHTML = device.kind;
      btn.addEventListener("click", btnHandler(device));
//      function () {
//        console.log("clicked");
//      }
      document.body.appendChild(btn);
    }
    document.body.appendChild(video);
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "start",
      error: e,
    });
  }
}

function btnHandler(device) {
  switch (device.kind) {
    case "videoinput":
      async function startVideoInput(evt) {
        try {
          const stream = await window.navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: {
                exact: device.deviceId,
              }
            }
          });
          video.srcObject = stream;
          video.play();
          console.log("video start");
        } catch (e) {
          console.error(e);
        }
      }
      return function (evt) {
        console.log("start video input");
        startVideoInput(evt);
        console.log("end video input");
      };
      break;
    case "audioinput":
      async function startAudioInput(evt) {
        try {
          const stream = await window.navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: {
                exact: device.deviceId,
              }
            }
          });
          video.srcObject = stream;
          video.play();
          console.log("audio start");
        } catch (e) {
          console.error(e);
        }
      }
      return function (evt) {
        console.log("start audio input");
        startAudioInput(evt);
        console.log("end audio input");
      };
      break;
    case "audiooutput":
      async function startAudioOutput(evt) {
        try {
          const stream = await window.navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: {
                exact: device.deviceId,
              }
            }
          });
        } catch (e) {
          console.error(e);
        }
      }
      return function (evt) {
        console.log("start audio output");
        startAudioOutput(evt);
        console.log("end audio output");
      };
      break;
    default:
      async function startUnknown(evt) {
        console.log("unknown");
      }
      return function (evt) {
        console.log("start unknown");
        startUnknown(evt);
        console.log("end unknown");
      };
      break;
  };
}

let lastAccReadingTime = initPageTime;
const accTimeAverager = new Averager(25);
function readAcc(evt) {
  let thisAccReadingTime = performance.now();
  xAccDisplay.innerHTML = acc.x.toFixed(2) + "m/s^2";
  yAccDisplay.innerHTML = acc.y.toFixed(2) + "m/s^2";
  zAccDisplay.innerHTML = acc.z.toFixed(2) + "m/s^2";
  magAccDisplay.innerHTML = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z).toFixed(2) + "m/s^2";
  let duration = accTimeAverager.sample(thisAccReadingTime - lastAccReadingTime);
  timeAccDisplay.innerHTML = duration.toFixed(2) + "ms";
  lastAccReadingTime = thisAccReadingTime;
}

let lastLinAccReadingTime = initPageTime;
const linAccTimeAverager = new Averager(25);
function readLinAcc(evt) {
  let thisLinAccReadingTime = performance.now();
  xLinAccDisplay.innerHTML = linAcc.x.toFixed(2) + "m/s^2";
  yLinAccDisplay.innerHTML = linAcc.y.toFixed(2) + "m/s^2";
  zLinAccDisplay.innerHTML = linAcc.z.toFixed(2) + "m/s^2";
  magLinAccDisplay.innerHTML = Math.sqrt(linAcc.x * linAcc.x + linAcc.y * linAcc.y + linAcc.z * linAcc.z).toFixed(2) + "m/s^2";
  let duration = linAccTimeAverager.sample(thisLinAccReadingTime - lastLinAccReadingTime);
  timeLinAccDisplay.innerHTML = duration.toFixed(2) + "ms";
  lastLinAccReadingTime = thisLinAccReadingTime;
}

let lastGravReadingTime = initPageTime;
const gravTimeAverager = new Averager(25);
function readGrav(evt) {
  let thisGravReadingTime = performance.now();
  xGravDisplay.innerHTML = grav.x.toFixed(2) + "m/s^2";
  yGravDisplay.innerHTML = grav.y.toFixed(2) + "m/s^2";
  zGravDisplay.innerHTML = grav.z.toFixed(2) + "m/s^2";
  magGravDisplay.innerHTML = Math.sqrt(grav.x * grav.x + grav.y * grav.y + grav.z * grav.z).toFixed(2) + "m/s^2";
  let duration = gravTimeAverager.sample(thisGravReadingTime - lastGravReadingTime);
  timeGravDisplay.innerHTML = duration.toFixed(2) + "ms";
  lastGravReadingTime = thisGravReadingTime;
}

let lastGyroReadingTime = initPageTime;
const gyroTimeAverager = new Averager(25);
function readGyro(evt) {
  let thisGyroReadingTime = performance.now();
  xGyroDisplay.innerHTML = gyro.x.toFixed(4) + "rad/s";
  yGyroDisplay.innerHTML = gyro.y.toFixed(4) + "rad/s";
  zGyroDisplay.innerHTML = gyro.z.toFixed(4) + "rad/s";
  magGyroDisplay.innerHTML = Math.sqrt(gyro.x * gyro.x + gyro.y * gyro.y + gyro.z * gyro.z).toFixed(4) + "rad/s";
  let duration = gyroTimeAverager.sample(thisGyroReadingTime - lastGyroReadingTime);
  timeGyroDisplay.innerHTML = duration.toFixed(2) + "ms";
  lastGyroReadingTime = thisGyroReadingTime;
}

let lastMagReadingTime = initPageTime;
const magTimeAverager = new Averager(25);
function readMag(evt) {
  let thisMagReadingTime = performance.now();
  xMagDisplay.innerHTML = mag.x.toFixed(2) + "uT";
  yMagDisplay.innerHTML = mag.y.toFixed(2) + "uT";
  zMagDisplay.innerHTML = mag.z.toFixed(2) + "uT";
  magMagDisplay.innerHTML = Math.sqrt(mag.x * mag.x + mag.y * mag.y + mag.z * mag.z).toFixed(2) + "uT";
  let duration = magTimeAverager.sample(thisMagReadingTime - lastMagReadingTime);
  timeMagDisplay.innerHTML = duration.toFixed(2) + "ms";
  lastMagReadingTime = thisMagReadingTime;
}
