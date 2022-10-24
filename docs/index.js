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

let xDisplay;
let yDisplay;
let zDisplay;
let magDisplay;
let mag;

const strPermissions = [
  "accelerometer",
  "accessibility-events",
  "ambient-light-sensor",
  "background-fetch",
  "background-sync",
  "bluetooth",
  "camera",
  "clipboard",
  "clipboard-read",
  "clipboard-write",
  "device-info",
  "display-capture",
  "geolocation",
  "gyroscope",
  "idle-detection",
  "local-fonts",
  "magnetometer",
  "microphone",
  "midi",
  "nfc",
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
    for (const elem of strPermissions) {
      let p = document.createElement("p");
      try {
        const status = await navigator.permissions.query({ name: elem });
        p.innerHTML = elem + ": " + status.state;
      } catch (e) {
        p.innerHTML = elem + ": " + e.message;
      }
      document.body.appendChild(p);
    }
    let p = document.createElement("p");
    let label = document.createElement("span");
    label.innerHTML = "x: ";
    p.appendChild(label);
    xDisplay = document.createElement("span");
    xDisplay.innerHTML = "";
    p.appendChild(xDisplay);
    document.body.appendChild(p);
    p = document.createElement("p");
    label = document.createElement("span");
    label.innerHTML = "y: ";
    p.appendChild(label);
    yDisplay = document.createElement("span");
    yDisplay.innerHTML = "";
    p.appendChild(yDisplay);
    document.body.appendChild(p);
    p = document.createElement("p");
    label = document.createElement("span");
    label.innerHTML = "z: ";
    p.appendChild(label);
    zDisplay = document.createElement("span");
    zDisplay.innerHTML = "";
    p.appendChild(zDisplay);
    document.body.appendChild(p);
    p = document.createElement("p");
    label = document.createElement("span");
    label.innerHTML = "mag: ";
    p.appendChild(label);
    magDisplay = document.createElement("span");
    magDisplay.innerHTML = "";
    p.appendChild(magDisplay);
    document.body.appendChild(p);
    console.log("start query");
    const result = await navigator.permissions.query({ name: "magnetometer" });
    console.log("end query");
    let permitDisplay = document.createElement("p");
    permitDisplay.innerHTML = result.state;
    document.body.appendChild(permitDisplay);
    console.log(Magnetometer);
    mag = new Magnetometer({frequency: 60});
    console.log(mag);
    mag.addEventListener("reading", readMag);
    mag.start();
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "start",
      error: e,
    });
  }
}

function readMag(evt) {
  xDisplay.innerHTML = mag.x.toFixed(2) + "uT";
  yDisplay.innerHTML = mag.y.toFixed(2) + "uT";
  zDisplay.innerHTML = mag.z.toFixed(2) + "uT";
  magDisplay.innerHTML = Math.sqrt(mag.x * mag.x + mag.y * mag.y + mag.z * mag.z).toFixed(2) + "uT";
}
