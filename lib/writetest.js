var Dio7055=require('./dio7055.js');
dio=new Dio7055();
dio.digitalWrite('01',0,0,function(data){
	console.log("data: "+data);
});
