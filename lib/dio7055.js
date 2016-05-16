var SerialPort=require("serialport").SerialPort;
function Dio7055(mport,mbaud,mtimeout){
	if(typeof mport=='undefined') mport='/dev/ttyUSB0';
	if(typeof mbaud=='undefined')mbaud=57600;
	if(typeof mtimeout=='undefined'||mtimeout<5) mtimeout=50;
	var com=new SerialPort(mport,{baudrate:mbaud},false);
	var subdata='';
	var sub;
	var temp;
	var result;
	var length;
	this.digitalRead=function(address,channel,io,callback){
		var response;
		var regexp=new RegExp(/[g-zG-Z]/);
		if(address.length!=2 || address.match(regexp)!=null){
			callback('Err: Parameter 0 must be a string or in range \'00\'-\'ff\'');return;}
		if(io!=1 && io!=0){callback('Err: Parameter 1 must be 1 or 0,indicate to input and output'); return;}
		if(channel >7 || channel <0){callback('Err: Parameter 2 must be in range 0~7');return;}
		com.open(function(err){if(err){callback('Err: '+err);return;}});
		com.on('open',function(err){
			response=0;
			if(err){callback("Err: "+err);return;};
			console.log('Port opened');
			console.log("Sending: @"+address+'\r');
			com.write('@'+address+'\r');
			setTimeout(function(){
				if(response==1){
					com.close(function(err){if(err){callback('Err: '+err);return;}});
					return;
				}
				else{
					com.close(function(err){if(err){callback('Err: '+err);return;}});
					callback("TimeOut");
					return;
				}
			},mtimeout);
			com.on('data',function(data){
				if(data.toString().search(">")!=-1){
					subdata='';
				}
				subdata=subdata+data.toString();
				if(data.toString().search("\r")!=-1){
					if(io==1) subdata=subdata.substr(3,2);
					else subdata=subdata.substr(1,2);
					temp=parseInt(subdata,16);
					result=temp.toString(2);			
					length=result.length;
					if(result.length!=8)
						for(var i=0;i<8-length;i++){
							result='0'+result;
						}
					console.log("Result:"+result);
					response=1;
				}
			});
			com.on('close',function(){
				console.log("Port closed");
				if(result!=null)
					callback(result.substr(7-channel,1));
			});
			com.on('error',function(err){callback('Err: '+err);return;});
		});
	};
	this.digitalWrite=function(address,channel,out,callback){
		reusult='';
		var response;
		var regexp=new RegExp(/[g-zG-Z]/);
		if(out!=1 && out!=0){callback('Err: Parameter 2 must be 1 or 0,indicate to output 1 or 0'); return;}
		if(address.length!=2 || address.match(regexp)!=null){
			callback('Err: Parameter 0 must be a string or in range \'00\'-\'ff\''); return;}
		if(channel >7 || channel <0){callback('Err: Parameter 1 must be in range 0~7');return;}
		com.open(function(err){if(err){callback('Err: '+err);return;}});
		com.on('open',function(err){
			response=0;
			if(err){callback("Err: "+err);return;};
			console.log('Port opened');
			console.log("Sending: #"+address+'1'+channel+'0'+out+'\r');
			com.write("#"+address+'1'+channel+'0'+out+'\r');
			setTimeout(function(){
				if(response==1){
					com.close(function(err){if(err){callback('Err: '+err);return;}});
					return;
				}
				else{
					com.close(function(err){if(err){callback('Err: '+err);return;}});
					callback("TimeOut");
					return;
				}
			},mtimeout);
			com.on('data',function(data){
				if(data.toString().search(">")!=-1){
					subdata='';
				}
				subdata=subdata+data.toString();
				if(data.toString().search("\r")!=-1){
					response=1;
					result=subdata.toString();
					console.log("Result:"+result);
				}
			});
			com.on('close',function(){
				console.log("Port closed");
				if(result!=null)
					callback(result);
			});
			com.on('error',function(err){callback('Err: '+err);return;});
		});
	};
	this.digitalReadall=function(address,io,callback){
		var response;
		var regexp=new RegExp(/[g-zG-Z]/);
		if(address.length!=2 || address.match(regexp)!=null){ 
			callback('Err: Parameter 0 must be a string or in range \'00\'-\'ff\''); return;}
		if(io!=1 && io!=0){callback('Err: Parameter 1 must be 1 or 0,indicate to input and output'); return;}
		com.open(function(err){if(err){callback('Err: '+err);return;}});
		com.on('open',function(err){
			response=0;
			if(err){callback("Err:"+err);return;};
			console.log('Port opened');
			console.log("Sending: @"+address+'\r');
			com.write('@'+address+'\r');
			setTimeout(function(){
				if(response==1){
					com.close(function(err){if(err){callback('Err: '+err);return;}});
					return;
				}
				else{
					com.close(function(err){if(err){callback('Err: '+err);return;}});
					callback("TimeOut");
					return;
				}
			},mtimeout);
			com.on('data',function(data){
				if(data.toString().search(">")!=-1){
					subdata='';
				}
				subdata=subdata+data.toString();
				if(data.toString().search("\r")!=-1){
					if(io==1) subdata=subdata.substr(3,2);
					else subdata=subdata.substr(1,2);
					temp=parseInt(subdata,16);
					result=temp.toString(2);			
					length=result.length;
					if(result.length!=8)
						for(var i=0;i<8-length;i++){
							result='0'+result;
						}
					console.log("Result:"+result);
					response=1;
				}
			});
			com.on('close',function(){
				console.log("Port closed");
				if(result!=null)
					callback(result);
			});
			com.on('error',function(err){callback('Err: '+err);return;});
		});
	};
};
module.exports=Dio7055;
