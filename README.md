# A node.js package for DIO7055 module

## System Environment
In order to have dependency 'serialport' work.

Firstly,please read https://github.com/voodootikigod/node-serialport/blob/master/README.md.

## DIO Setting
Please have checksum disabled in DIO module.

## Installation Instructions
```
npm install dio7055
```
## Initial parameters
```
var dio=new Dio7055(port,baudrate,timeout)
```
* defulat port: '/dev/ttyUSB0'
* default baudrate: 57600
* default timeout: 50


## Functions
```
read(address,channel,io,callback)
write(address,channel,out,callback)
readall(address,io,callback)
```
* **address**: a heximal string of DIO's address,expect '00'-'ff' in lowercase
* **channel**: chanel number,expect 0-7
* **io**: 1=Input,0=Output
* **out**: Output signal,expect 1 or 0


## Code Examples
### function read(address,channel,io,callback)
```js
var Dio7055=require('dio7055.js');
dio=new Dio7055();
dio.read('01',1,1,function(data,error){
	console.log(data);
	//data should be result,expect '0' or '1',
	if(error){
		console.error(error);
	}
});
```
### function write(address,channel,out,callback)
```js
var Dio7055=require('../lib/dio7055.js');
dio=new Dio7055();
dio.write('01',1,1,function(data,error){
	console.log(data);
	//data should be '>',it's default return value from DIO module
	if(error){
		console.error(error);
	}
});
```
### funciton readall(address,io,callback)
```js
var Dio7055=require('../lib/dio7055.js');
dio=new Dio7055();
dio.readall('01',1,function(data,error){
	console.log(data);
	//data should be 8 digits numeric string in binary
	if(error){
		console.error(error);
	}
});

```
