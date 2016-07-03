// i2c master.js

(function(ext) {
    var device = null;
    var _rxBuf = [];

	var values = {};
	var indexs = [];
	var lines = [""];
	var nextID = 0;
	var startTimer = 0;
	var versionIndex = 0xFA;
	var isReceived = false;
	var lastLine = "";
    ext.resetAll = function(){};
	
	ext.writeLine = function(line) {
		line+="\n";
		device.send(string2array(line));
    };
    	ext.taLine0022 = function(line) {
		line+="\n";
		device.send(string2array(line));
    };
	ext.whenReceived0022 = function(){
		var temp = isReceived;
		isReceived = false;
		return temp;
	};    
    function processData(bytes) {
		isReceived = bytes.indexOf(0xA) >= 0;
		if(isReceived){
			lastLine = array2string(bytes);
			lastLine = lastLine.replace(/^\s+|\s+$/g, "");
		}
    }
	function readFloat(arr,position){
		var f= [arr[position],arr[position+1],arr[position+2],arr[position+3]];
		return parseFloat(f);
	}
	function readShort(arr,position){
		var s= [arr[position],arr[position+1]];
		return parseShort(s);
	}
	function readDouble(arr,position){
		return readFloat(arr,position);
	}
	function readString(arr,position,len){
		var value = "";
		for(var ii=0;ii<len;ii++){
			value += String.fromCharCode(_rxBuf[ii+position]);
		}
		return value;
	}
    function appendBuffer( buffer1, buffer2 ) {
        return buffer1.concat( buffer2 );
    }

    // Extension API interactions
    var potentialDevices = [];
    ext._deviceConnected = function(dev) {
        potentialDevices.push(dev);

        if (!device) {
            tryNextDevice();
        }
    }

    function tryNextDevice() {
        // If potentialDevices is empty, device will be undefined.
        // That will get us back here next time a device is connected.
        device = potentialDevices.shift();
        if (device) {
            device.open({ stopBits: 0, bitRate: 115200, ctsFlowControl: 0 }, deviceOpened);
        }
    }

    var watchdog = null;
    function deviceOpened(dev) {
        if (!dev) {
            // Opening the port failed.
            tryNextDevice();
            return;
        }
        device.set_receive_handler('serial',processData);
    };

})({});



//Extension coded by: Tanweer Ahmad 14TL02@students.muet.edu.pk for theedvolution.com