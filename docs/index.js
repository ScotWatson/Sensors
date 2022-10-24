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
    let mapSensors = new Map()
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
      acc = new Magnetometer({frequency: 60});
      acc.addEventListener("reading", readAcc);
      acc.start();
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
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "start",
      error: e,
    });
  }
}

function readAcc(evt) {
  xAccDisplay.innerHTML = acc.x.toFixed(2) + "m/s^2";
  yAccDisplay.innerHTML = acc.y.toFixed(2) + "m/s^2";
  zAccDisplay.innerHTML = acc.z.toFixed(2) + "m/s^2";
  magAccDisplay.innerHTML = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z).toFixed(2) + "m/s^2";
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
