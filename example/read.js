var Dio7055=require('../lib/dio7055.js');
dio=new Dio7055();
dio.read('01',1,1,function(data,error){
	console.log("data: "+data);
	if(error){
		console.error(error);
	}
});
