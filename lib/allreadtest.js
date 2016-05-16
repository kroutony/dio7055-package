var Dio7055=require('./dio7055.js');
dio=new Dio7055('/dev/ttyUSB0',57600);
dio.digitalRead('01',1,1,function(data){
	console.log("data: "+data);
});
