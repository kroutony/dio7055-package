var SerialPort = require("serialport").SerialPort;

function Dio7055(mport, mbaud, mtimeout) {
    this.dataTimeout = 50;
    if (typeof mport == 'undefined') mport = '/dev/ttyUSB0';
    if (typeof mbaud == 'undefined') mbaud = 57600;
    if (typeof mtimeout == 'undefined' || mtimeout < 5) {} else {
        this.dataTimeout = mtimeout;
    }
    Dio7055.com = new SerialPort(mport, {
        baudrate: mbaud
    }, false);
    Dio7055.com = Dio7055.com;
    Dio7055.timeout = this.dataTimeout;
    Dio7055.com.on('close', Dio7055.closeEventFunc);
    Dio7055.com.on('error', Dio7055.errorEventFunc);
};
Dio7055.subdata='';
Dio7055.result = '';
Dio7055.timeout = null;
Dio7055.com = null;
Dio7055.callback = null;
Dio7055.closeCallback = function(err) {
    if (err) {
        Dio7055.callback(null, 'Err: ' + err);
        return;
    }
    if (Dio7055.response) {
        Dio7055.callback(Dio7055.result, null);
    } else {
        Dio7055.callback(null, "Err: Timeout");
    }
}
Dio7055.closeEventFunc = function() {
    console.log('on close');
    Dio7055.callback(Dio7055.result, null);
    return;
}
Dio7055.errorEventFunc = function(err) {
    Dio7055.callback(null, 'Err: ' + err);
    return;
}
Dio7055.prototype.checkAddress = function(address) {
    var regexp = new RegExp(/[0-9a-f]{2}/);
    if (typeof address != 'string' || address.match(regexp) == null)
        return false;
    return true;
}
Dio7055.prototype.read = function(address, channel, io, callback) {
    Dio7055.callback = callback;
		Dio7055.result='';
		Dio7055.subdata='';
    if (!this.checkAddress(address)) {
        callback(null, 'Err: Parameter 0 must be a string or in range \'00\'-\'ff\'');
        return;
    }
    if (io != 1 && io != 0) {
        callback(null, 'Err: Parameter 1 must be 1 or 0,indicate to input and output');
        return;
    }
    if (!(channel >= 0 && channel <= 7)) {
        callback(null, 'Err: Parameter 2 must be in range 0~7');
        return;
    }
    Dio7055.com.on('open', function(err) {
        Dio7055.response = false;
        if (err) {
            callback(null, "Err: " + err);
            return;
        };
        console.log("Sending to: @" + address + '\r');
        Dio7055.com.write('@' + address + '\r');
        Dio7055.com.on('data', function(data) {
            if (data.toString().search(">") != -1) {
                Dio7055.subdata = '';
            }
            Dio7055.subdata = Dio7055.subdata + data.toString();

            if (data.toString().search("\r") != -1) {
                if (io == 1) Dio7055.subdata = Dio7055.subdata.substr(3, 2);
                else Dio7055.subdata = Dio7055.subdata.substr(1, 2);
                Dio7055.result = parseInt(Dio7055.subdata, 16).toString(2);
                var length = Dio7055.result.length;
                if (Dio7055.result.length != 8)
                    for (var i = 0; i < 8 - length; i++) {
                        Dio7055.result = '0' + Dio7055.result;
                    }
                Dio7055.response = true;
                Dio7055.result = Dio7055.result.substr(7 - channel, 1);
            }
        });
    });
    Dio7055.com.open(function(err) {
        if (err) {
            callback(null, 'Err: ' + err);
            return;
        }
        var count = 0;
        var timer = setInterval(function() {
            count++;
            if (count == 1) {
                Dio7055.com.close(Dio7055.closeCallback);
                clearInterval(timer);
                return;
            }
        }, Dio7055.timeout);
    });
};
Dio7055.prototype.write = function(address, channel, out, callback) {
    Dio7055.callback = callback;
		Dio7055.result='';
		Dio7055.subdata='';
    if (out != 1 && out != 0) {
        callback(null, 'Err: Parameter 2 must be 1 or 0,indicate to output 1 or 0');
        return;
    }
    if (!this.checkAddress(address)) {
        callback(null, 'Err: Parameter 0 must be a string or in range \'00\'-\'ff\'');
        return;
    }
    if (!(channel >= 0 && channel <= 7)) {
        callback(null, 'Err: Parameter 1 must be in range 0~7');
        return;
    }
    Dio7055.com.on('open', function(err) {
        Dio7055.response = false;
        if (err) {
            callback(null, "Err: " + err);
            return;
        };
        console.log("Sending to: #" + address + '1' + channel + '0' + out + '\r');
        Dio7055.com.write("#" + address + '1' + channel + '0' + out + '\r');
        Dio7055.com.on('data', function(data) {
            if (data.toString().search(">") != -1) {
                Dio7055.subdata = '';
            }
            Dio7055.subdata = Dio7055.subdata + data.toString();
            if (data.toString().search("\r") != -1) {
                Dio7055.response = true;
                Dio7055.result = Dio7055.subdata.toString();
            }
        });
    });
    Dio7055.com.open(function(err) {
        if (err) {
            callback(null, 'Err: ' + err);
            return;
        }
        var count = 0;
        var timer = setInterval(function() {
            count++;
            if (count == 1) {
							Dio7055.com.close(Dio7055.closeCallback);
							clearInterval(timer);
							return;
            }
        }, Dio7055.timeout);
    });
};
Dio7055.prototype.readall = function(address, io, callback) {
    Dio7055.callback = callback;
		Dio7055.result='';
		Dio7055.subdata='';
    if (!this.checkAddress(address)) {
        callback(null, 'Err: Parameter 0 must be a string or in range \'00\'-\'ff\'');
        return;
    }
    if (io != 1 && io != 0) {
        callback(null, 'Err: Parameter 1 must be 1 or 0,indicate to input and output');
        return;
    }
    Dio7055.com.on('open', function(err) {
        Dio7055.response = false;
        if (err) {
            callback(null, "Err:" + err);
            return;
        };
        console.log("Sending to: @" + address + '\r');
        Dio7055.com.write('@' + address + '\r');
        Dio7055.com.on('data', function(data) {
            if (data.toString().search(">") != -1) {
                Dio7055.subdata = '';
            }
            Dio7055.subdata = Dio7055.subdata + data.toString();
            if (data.toString().search("\r") != -1) {
                if (io == 1) Dio7055.subdata = Dio7055.subdata.substr(3, 2);
                else Dio7055.subdata = Dio7055.subdata.substr(1, 2);
                Dio7055.result = parseInt(Dio7055.subdata, 16).toString(2);
								var length=Dio7055.result.length;
                if (Dio7055.result.length != 8)
                    for (var i = 0; i < 8 - length; i++) {
                        Dio7055.result = '0' + Dio7055.result;
                    }
                Dio7055.response = true;
            }
        });
    });
		Dio7055.com.open(function(err) {
        if (err) {
            callback(null, 'Err: ' + err);
            return;
        }
        var count = 0;
        var timer = setInterval(function() {
            count++;
            if (count == 1) {
							Dio7055.com.close(Dio7055.closeCallback);
							clearInterval(timer);
							return;
            }
        }, Dio7055.timeout);
    });
};
module.exports = Dio7055;
