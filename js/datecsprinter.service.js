(function() {
  'use strict';
  angular.module('app.service.datecsprinter', [])
    .factory('DatecsPrinter', DatecsPrinter);

  function DatecsPrinter($q, $timeout, $window) {
    if (!$window.cordova && !$window.DatecsPrinter) {
      console.log("DatecsPrinter plugin is missing. Have you installed the plugin? \nRun 'cordova plugin add cordova-plugin-datecs-printer'");
    }

    var defaultTimeout = 100;

    var listBluetoothDevices = function () {
      var deferred = $q.defer();

      $timeout(function() {
        $window.DatecsPrinter.listBluetoothDevices(
          function (success) {
            deferred.resolve(success);
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }, defaultTimeout);

      return deferred.promise;
    };

    var connect = function (device) {
      var deferred = $q.defer();

      $timeout(function() {
        $window.DatecsPrinter.connect(
          device.address,
          function (success) {
            deferred.resolve(success);
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }, defaultTimeout);

      return deferred.promise;
    };

    var disconnect = function () {
      var deferred = $q.defer();

      $timeout(function() {
        $window.DatecsPrinter.disconnect(
          function (success) {
            deferred.resolve(success);
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }, defaultTimeout);

      return deferred.promise;
    };

    var feedPaper = function (lines) {
      var deferred = $q.defer();

      $timeout(function() {
        $window.DatecsPrinter.feedPaper(
          lines,
          function (success) {
            deferred.resolve(success);
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }, defaultTimeout);

      return deferred.promise;
    };

    var printText = function (text, charset) {
      var deferred = $q.defer();

      if (charset == null) {
        charset = 'ISO-8859-1';
      }

      $timeout(function() {
        $window.DatecsPrinter.printText(
          text,
          charset,
          function (success) {
            deferred.resolve(success);
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }, defaultTimeout);

      return deferred.promise;
    };

    var setBarcode = function (align, small, scale, hri, height) {
      var deferred = $q.defer();

      $timeout(function() {
        $window.DatecsPrinter.setBarcode(
          align,
          small,
          scale,
          hri,
          height,
          function (success) {
            deferred.resolve(success);
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }, defaultTimeout);

      return deferred.promise;
    };

    var printBarcode = function (type, data) {
      var deferred = $q.defer();

      $timeout(function() {
        $window.DatecsPrinter.printBarcode(
          type,
          data,
          function (success) {
            deferred.resolve(success);
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }, defaultTimeout);

      return deferred.promise;
    };

    var getStatus = function () {
      var deferred = $q.defer();

      $timeout(function() {
        $window.DatecsPrinter.getStatus(
          function (success) {
            deferred.resolve(success);
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }, 10);

      return deferred.promise;
    };

    var getTemperature = function () {
      var deferred = $q.defer();

      $timeout(function() {
        $window.DatecsPrinter.getTemperature(
          function (success) {
            deferred.resolve(success);
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }, defaultTimeout);

      return deferred.promise;
    };

    var printImage = function (image, height, width, align) {
      var deferred = $q.defer();

      if (align == null) {
        align = 0;
      }

      $timeout(function() {
        $window.DatecsPrinter.printImage(
          image,
          height,
          width,
          align,
          function (success) {
            deferred.resolve(success);
          },
          function (error) {
            deferred.reject(error);
          }
        );
      }, defaultTimeout);

      return deferred.promise;
    };

    return {
      listBluetoothDevices: listBluetoothDevices,
      connect: connect,
      disconnect: disconnect,
      feedPaper: feedPaper,
      printText: printText,
      setBarcode: setBarcode,
      printBarcode: printBarcode,
      getStatus: getStatus,
      getTemperature: getTemperature,
      printImage: printImage
    }
  }
})();
