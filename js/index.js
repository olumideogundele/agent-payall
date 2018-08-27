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
		
	    var encoded= Utf8Utils.encode(data);
		
		
        bluetoothSerial.write([encoded], success, failure);
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

     Utf8Utils= function() {
          function _encode(stringToEncode, insertBOM) {
              stringToEncode = stringToEncode.replace(/\r\n/g,"\n");
              var utftext = [];
              if( insertBOM == true )  {
                  utftext[0]=  0xef;
                  utftext[1]=  0xbb;
                  utftext[2]=  0xbf;
              }

              for (var n = 0; n < stringToEncode.length; n++) {

                  var c = stringToEncode.charCodeAt(n);

                  if (c < 128) {
                      utftext[utftext.length]= c;
                  }
                  else if((c > 127) && (c < 2048)) {
                      utftext[utftext.length]= (c >> 6) | 192;
                      utftext[utftext.length]= (c & 63) | 128;
                  }
                  else {
                      utftext[utftext.length]= (c >> 12) | 224;
                      utftext[utftext.length]= ((c >> 6) & 63) | 128;
                      utftext[utftext.length]= (c & 63) | 128;
                  }

              }
              return utftext;  
          };

          var obj= {
              /**
               * Encode javascript string as utf8 byte array
               */
              encode : function(stringToEncode) {
                  return _encode( stringToEncode, false);
              },
            
              /**
               * Encode javascript string as utf8 byte array, with a BOM at the start
               */
              encodeWithBOM: function(stringToEncode) {
                  return _encode(stringToEncode, true);
              },
            
              /**
               * Decode utf8 byte array to javascript string....
               */
              decode : function(dotNetBytes) {
                  var result= "";
                  var i= 0;
                  var c=c1=c2=0;
                
                  // Perform byte-order check.
                  if( dotNetBytes.length >= 3 ) {
                      if(   (dotNetBytes[0] & 0xef) == 0xef
                          && (dotNetBytes[1] & 0xbb) == 0xbb
                          && (dotNetBytes[2] & 0xbf) == 0xbf ) {
                          // Hmm byte stream has a BOM at the start, we'll skip this.
                          i= 3;
                      }
                  }
                
                  while( i < dotNetBytes.length ) {
                      c= dotNetBytes[i]&0xff;
                    
                      if( c < 128 ) {
                          result+= String.fromCharCode(c);
                          i++;
                      }
                      else if( (c > 191) && (c < 224) ) {
                          if( i+1 >= dotNetBytes.length )
                              throw "Un-expected encoding error, UTF-8 stream truncated, or incorrect";
                          c2= dotNetBytes[i+1]&0xff;
                          result+= String.fromCharCode( ((c&31)<<6) | (c2&63) );
                          i+=2;
                      }
                      else {
                          if( i+2 >= dotNetBytes.length  || i+1 >= dotNetBytes.length )
                              throw "Un-expected encoding error, UTF-8 stream truncated, or incorrect";
                          c2= dotNetBytes[i+1]&0xff;
                          c3= dotNetBytes[i+2]&0xff;
                          result+= String.fromCharCode( ((c&15)<<12) | ((c2&63)<<6) | (c3&63) );
                          i+=3;
                      }          
                  }                
                  return result;
              }
          };
          return obj;
      }();
	  
	  
	  
