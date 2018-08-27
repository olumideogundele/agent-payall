
// (c) 2013-2015 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, refreshButton, statusDiv */
/* global detailPage, resultDiv, messageInput, sendButton, disconnectButton */
/* global cordova, bluetoothSerial  */
/* jshint browser: true , devel: true*/
'use strict';

var app = {
    initialize: function() {
        this.bindEvents();
        this.showMainPage();
    },
    bindEvents: function() {

        var TOUCH_START = 'touchstart';
        if (window.navigator.msPointerEnabled) { // windows phone
            TOUCH_START = 'MSPointerDown';
        }
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener(TOUCH_START, this.refreshDeviceList, false);
        sendButton.addEventListener(TOUCH_START, this.sendData, false);
        disconnectButton.addEventListener(TOUCH_START, this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false);
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        bluetoothSerial.list(app.onDeviceList, app.onError);
    },
    onDeviceList: function(devices) {
        var option;

        // remove existing devices
        deviceList.innerHTML = "";
        app.setStatus("");

        devices.forEach(function(device) {

            var listItem = document.createElement('li'),
                html = '<b>' + device.name + '</b><br/>' + device.id;

            listItem.innerHTML = html;

            if (cordova.platformId === 'windowsphone') {
              // This is a temporary hack until I get the list tap working
              var button = document.createElement('button');
              button.innerHTML = "Connect";
              button.addEventListener('click', app.connect, false);
              button.dataset = {};
              button.dataset.deviceId = device.id;
              listItem.appendChild(button);
            } else {
              listItem.dataset.deviceId = device.id;
            }
            deviceList.appendChild(listItem);
        });

        if (devices.length === 0) {

            option = document.createElement('option');
            option.innerHTML = "No Bluetooth Devices";
            deviceList.appendChild(option);

            if (cordova.platformId === "ios") { // BLE
                app.setStatus("No Bluetooth Peripherals Discovered.");
            } else { // Android or Windows Phone
                app.setStatus("Please Pair a Bluetooth Device.");
            }

        } else {
            app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
        }

    },
    connect: function(e) {
        var onConnect = function() {
                // subscribe for incoming data
                bluetoothSerial.subscribe('\n', app.onData, app.onError);

                resultDiv.innerHTML = "";
                app.setStatus("Connected");
                app.showDetailPage();
            };

        var deviceId = e.target.dataset.deviceId;
        if (!deviceId) { // try the parent
            deviceId = e.target.parentNode.dataset.deviceId;
        }

        bluetoothSerial.connect(deviceId, onConnect, app.onError);
    },
    onData: function(data) { // data received from Arduino
        console.log(data);
        resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + data + "<br/>";
        resultDiv.scrollTop = resultDiv.scrollHeight;
    },
    sendData: function(event) { // send data to Arduino

        var success = function() {
            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed writing data to Bluetooth peripheral");
        };

        var data = messageInput.value;
        //var data = new Uint8Array(4);
//data[0] = 0x41;
//data[1] = 0x42;
//data[2] = 0x43;
//data[3] = 0x44;
        var deviceId = e.target.dataset.deviceId;
        if (!deviceId) { // try the parent
            deviceId = e.target.parentNode.dataset.deviceId;
        }

        bluetoothSerial.connect(deviceId, onConnect, app.onError);
    },
    onData: function(data) { // data received from Arduino
        console.log(data);
        resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + data + "<br/>";
        resultDiv.scrollTop = resultDiv.scrollHeight;
    },
    sendData: function(event) { // send data to Arduino

        var success = function() {
            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed writing data to Bluetooth peripheral");
        };

        var data = messageInput.value;
        //var data = new Uint8Array(4);
//data[0] = 0x41;
//data[1] = 0x42;
//data[2] = 0x43;
//data[3] = 0x44;
bluetoothSerial.write(data, success, failure);

// Array Buffer
//bluetoothSerial.write(data.buffer, success, failure);
        
        //I'll &quot;walk&quot; the &lt;b&gt;dog&lt;/b&gt; now
  //  var bytes=[84,104,97,110,107,32,89,111,117,32,102,111,114,32,99,104,111,111,115,105,110,103,32,80,97,121,65,108,108,46,10,11,66,101,108,111,119,32,97,114,101,32,116,104,101,32,105,110,102,111,114,109,97,116,105,111,110,32,111,102,32,121,111,117,32,116,114,97,110,115,97,99,116,105,111,110,46,10];
        
	    // var bytes2=[1B 2D 01];
	   // var double [1D 21 01];
        
	//    bluetoothSerial.write([27, 69, 1, 104, 101, 108, 108, 111, 27, 69, 0], success, failure);
	 
	    
	   // bluetoothSerial.write(bytes2, success, failure);
	    
	    
		
		
		
		  // bluetoothSerial.write("I'll &quot;walk&quot; the &lt;b&gt;dog&lt;/b&gt; now", success, failure);
		   
		   
		     // bluetoothSerial.write([0, 10], success, failure);
		
		
    },
    disconnect: function(event) {
        bluetoothSerial.disconnect(app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.style.display = "";
        detailPage.style.display = "none";
    },
    showDetailPage: function() {
        mainPage.style.display = "none";
        detailPage.style.display = "";
    },
    setStatus: function(message) {
        console.log(message);

        window.clearTimeout(app.statusTimeout);
        statusDiv.innerHTML = message;
        statusDiv.className = 'fadein';

        // automatically clear the status with a timer
        app.statusTimeout = setTimeout(function () {
            statusDiv.className = 'fadeout';
        }, 5000);
    },
    onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
//bluetoothSerial.write(data, success, failure);

// Array Buffer
//bluetoothSerial.write(data.buffer, success, failure);
        
        //I'll &quot;walk&quot; the &lt;b&gt;dog&lt;/b&gt; now
    var bytes=[84,104,97,110,107,32,89,111,117,32,102,111,114,32,99,104,111,111,115,105,110,103,32,80,97,121,65,108,108,46,10,11,66,101,108,111,119,32,97,114,101,32,116,104,101,32,105,110,102,111,114,109,97,116,105,111,110,32,111,102,32,121,111,117,32,116,114,97,110,115,97,99,116,105,111,110,46,10];
        
	    // var bytes2=[1B 2D 01];
	   // var double [1D 21 01];
        
	    bluetoothSerial.write([27, 69, 1, 104, 101, 108, 108, 111, 27, 69, 0], success, failure);
	 
	    
	   // bluetoothSerial.write(bytes2, success, failure);
	    
	    
		
		
		
		  // bluetoothSerial.write("I'll &quot;walk&quot; the &lt;b&gt;dog&lt;/b&gt; now", success, failure);
		   
		   
		     // bluetoothSerial.write([0, 10], success, failure);
		
		
    },
    disconnect: function(event) {
        bluetoothSerial.disconnect(app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.style.display = "";
        detailPage.style.display = "none";
    },
    showDetailPage: function() {
        mainPage.style.display = "none";
        detailPage.style.display = "";
    },
    setStatus: function(message) {
        console.log(message);

        window.clearTimeout(app.statusTimeout);
        statusDiv.innerHTML = message;
        statusDiv.className = 'fadein';

        // automatically clear the status with a timer
        app.statusTimeout = setTimeout(function () {
            statusDiv.className = 'fadeout';
        }, 5000);
    },
    onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
