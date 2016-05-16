A node.js package for DIO7055 module

## Initial parameters
```
var dio=new Dio7055(port,baudrate,timeout)
```
* defulat port: '/dev/ttyUSB0'
* default baudrate: 57600
* default timeout: 50


## Functions
```
digitalRead(address,channel,io,callback(data))
digitalWrite(address,channel,out,callback(data))
digitalReadall(address,io,callback(data))
```
* address: a heximal string of DIO's address,'00'-'ff'
* channel: Input/Output chanel number,0-7
* io: 1=Input,0=Output
* out: Output signal, 1 or 0
* digitalRead data: Status of an I/O channel
* digitalWrite data: Response string from dio module
* digitalReadall data: Status of eight channels of I/O
