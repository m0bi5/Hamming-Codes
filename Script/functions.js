var correc=0,no_errors=0;
function msgIsValid(msg)
{
	var i=""
	var found=0
	for (i in msg)
	{
		if (msg[i]!=='0' && msg[i]!=='1')
		{
			return false
		}
	}
	return true
}
function power_2(num)
{
	if(num===0)
		return true
	return ((num & (num - 1)) == 0)
}
function gencode(message,parity)
{
	var codeword=[]
	var i=0
	var j=0
	var message=message.split('')	
	var n=message.length
	var k=parity.length
	var m=0
	for(i=1;i<n+k+1;i+=1)
	{
		if(power_2(i)===true)
		{
			codeword.push(parity[j].toString())
			j+=1
		}
		else
		{	
			codeword.push(message[m].toString())
			m+=1
		}
	}
	return codeword
}
function encode(message)
{
	document.getElementById("introinput").setAttribute("style","width:29%;")
	document.getElementsByClassName("ibox")[0].setAttribute("style","transition:height 2s ease;height:81%;")
	document.getElementById("top").setAttribute("style","transition:margin-left 2s ease;margin-left:-10%;")
	document.getElementById("intro").setAttribute("style","display:none;")

	document.getElementById("received").setAttribute("style","transition:margin-top 2s ease;margin-top:0%;animation:2s fadeIn;animation-fill-mode:forwards;")
	document.getElementById("result").setAttribute("style","animation:2s fadeIn;animation-fill-mode: forwards;margin-right:15%;")
	var n=message.length
	if(msgIsValid(message)===false)
	{
		alert('Input should be in binary')
		return 0
	}
	var messageLength=message.length
	for(var k=0;Math.pow(2,k)-1-k<messageLength;k+=1);
	var parityLength=k
	var parity=[]
	for(var i=0;i<parityLength;i+=1)
		parity[i]=0
	var codeword=[]
	var codeLength=n+k
	codeword=gencode(message,parity)
	for(var j=0;j<parityLength;j+=1)
	{
		var count=0
		var increment=Math.pow(2,j)
		codeword=gencode(message,parity)
		for(var x=Math.pow(2,j)-1;x<messageLength+parityLength;x+=2*increment)
		{
			for(var y=0;y<increment;y+=1)
			{
				if(x+y<messageLength+parityLength)
				{
					if(codeword[x+y]==='1')
					{
						count+=1
					}
				}
			}
		}
		parity[j]=(count%2)
	}
	codeword=gencode(message,parity)
	document.getElementById("encoded").innerHTML=""
	for(var i in codeword)
		if(power_2(parseInt(i)+1)==true)
			document.getElementById("encoded").innerHTML+="<u>"+codeword[i]+"</u>"
		else
			document.getElementById("encoded").innerHTML+=codeword[i]

}
function transmit()
{
	message=document.getElementById("encoded").textContent
	recv=[]
	var j=Math.floor(Math.random()*message.length)
	var k=Math.floor(Math.random()*message.length)
	var i
	no_errors=Math.floor(Math.random() * (1 - 0 + 1)) + 0;
	if(no_errors==1)
	{
		for(i in message)
		{
			if(i==j)
			{
				if(message[i]=='0')
					recv.push('1')
				else
					recv.push('0')
			}
			else
				recv.push(message[i])
		}
	}
	if(no_errors==0)
	{
		for(i in message)
		{
			recv.push(message[i])
		}
	}

	document.getElementById("receive").innerHTML=""
	for(i in recv)
		document.getElementById("receive").innerHTML+=recv[i]
}
function decode()
{
	var message=document.getElementById("receive").textContent
	var messageLength=message.length
	var parityLength=document.getElementById("receive").textContent.length-document.getElementById('message').value.length
	var parity=[]
	var parityCheck=[]
	var i
	for(i=0;i<parityLength;i+=1)
		parity[i]=0
	for(var j=0;j<parityLength;j+=1)
	{
		var count=0
		var increment=Math.pow(2,j)
		for(var x=Math.pow(2,j)-1;x<messageLength;x+=2*increment)
		{
			for(var y=0;y<increment;y+=1)
			{
				if(x+y<messageLength+parityLength)
				{
					if(message[x+y]==='1')
					{
						count+=1
					}
				}
			}
		}
		parity[j]=(count%2)
	}
	var indexToCorrect=0
	if(no_errors==1)
	{
		for(i=0;i<parity.length;i+=1)
		{
			if(parity[i]%2==0)
				parityCheck.push(true)
			else
				parityCheck.push(false)
		}
		for(i=0;i<parity.length;i+=1)
		{
			if(parityCheck[i]==false)
			{
				indexToCorrect+=Math.pow(2,i)
			}
		}
		document.getElementById("error").innerHTML=("Error detected at index "+indexToCorrect.toString())
		document.getElementById("receive").innerHTML=""
	}
	if(no_errors==0)
	{
		document.getElementById("error").innerHTML=("No Error detected");
		document.getElementById("receive").innerHTML=""
	}


	for(i in message)
		if(i==indexToCorrect-1)			
			document.getElementById("receive").innerHTML+="<u>"+message[i]+"</u>"
		else
			document.getElementById("receive").innerHTML+=message[i]
}
function correct()
{
	if(no_errors!=1)
		alert("No errors to correct");
	else
	{
		var error=document.getElementById("receive").textContent
		var posString=document.getElementById("error").innerHTML
		var pos=posString.replace( /^\D+/g, '');
		pos-=1
		var data=[]
		for(var i=0;i<error.length;i+=1)
		{
			if(i==pos)
			{
				if(error[pos]=='0')
					data.push('1')
				else
					data.push('0')				
			}
			else
			{
				data.push(error[i])
			}
		}
		document.getElementById("receive").innerHTML=""
		for(i in data)
			document.getElementById("receive").innerHTML+=data[i]
		correc=1
	}
}
function extract()
{
	var message=document.getElementById("receive").textContent
	if(correc!=1)
		alert("Extracted data has errors, make sure to correct it!")
	var i
	var data=[]
	for(i=0;i<message.length;i+=1)
	{
		if(power_2(i+1)==false)
			data.push(message[i])
	}
	if(correc==1)
		document.getElementById("originaldata").innerHTML="Original data sent was "
	else
		document.getElementById("originaldata").innerHTML="Dataword received with errors is "

	for(i in data)
		document.getElementById("originaldata").innerHTML+=data[i]
}
function getindex(d)
{
	var message=document.getElementById("dc").textContent.split(': ')[1]
	var messageLength=message.length

	for(var k=0;Math.pow(2,k)-1-k<messageLength;k+=1);
	var parityLength=k
	var ind=[]
	var i
	var j=d
	var count=0
	var increment=Math.pow(2,j)
	for(var x=Math.pow(2,j)-1;x<messageLength;x+=2*increment)
	{
		for(var y=0;y<increment;y+=1)
		{
			if(x+y<messageLength)
			{
				ind.push(x+y)
			}
		}
	}
	return ind
}
function getcalc(d)
{
	document.getElementById(d).innerHTML=""
	var indexes=getindex(parseInt(d.split('b')[1])) 
	for (var i in indexes)
		if(i==(indexes.length-1))
			document.getElementById(d).innerHTML+=document.getElementById("dc").textContent.split(':')[1][indexes[i]+1]
		else
			document.getElementById(d).innerHTML+=document.getElementById("dc").textContent.split(':')[1][indexes[i]+1]+'+'
	document.getElementById(d).innerHTML+='='+document.getElementById("codeword").textContent.split(':')[1][Math.pow(2,parseInt(d.split('b')[1]))]
}
function getcalct(d)
{
	document.getElementById(d).innerHTML=""
	var indexes=getindex(parseInt(d.split('t')[1])) 
	for (var i in indexes)
		if(i==(indexes.length-1))
			document.getElementById(d).innerHTML+=document.getElementById("rec").textContent.split(':')[1][indexes[i]+1]
		else
			document.getElementById(d).innerHTML+=document.getElementById("rec").textContent.split(':')[1][indexes[i]+1]+','



}
function learnEncode()
{
	document.getElementById('about2').style.display='none'
	document.getElementById('about').setAttribute("style","margin-top:15%;width:70%;margin-left:15%;");document.getElementById("main").setAttribute("style","margin-top:-54%;transition:margin-top 2s ease;")
	document.getElementById("codeword").innerHTML="Codeword : "
	document.getElementById("dataword").innerHTML="Dataword Entered: "
	document.getElementById("dc").innerHTML="Dataword + Parity bits : "
	document.getElementById("codeword").innerHTML+=document.getElementById("encoded").innerHTML
	var pb=0;
	for (var i=1;i<=document.getElementById("encoded").textContent.length;i+=1)
		if(power_2(i)==false)
		{
			document.getElementById("dataword").innerHTML+=document.getElementById("encoded").textContent[i-1]
			document.getElementById("dc").innerHTML+=document.getElementById("encoded").textContent[i-1]
		}
		else
		{
			document.getElementById("dc").innerHTML+='<u>'+'0'+'</u>'
			pb+=1
		}
	document.getElementById("info").innerHTML=""
	for (var i=0;i<pb;i+=1)
	{

		message="<p>To calculate parity bit "+(Math.pow(2,parseInt(i+1)-1))+", from position "+(Math.pow(2,parseInt(i+1)-1))+" consider "+(Math.pow(2,parseInt(i+1)-1))+" bit(s), skip the next "+(Math.pow(2,parseInt(i+1)-1))+" bit(s) and repeat this process till the end of the data, count the number of 1s and check if the number of 1s is even or odd. If even, the parity is 0, else 1.<br>"+"P"+(Math.pow(2,parseInt(i+1)-1))+" : "+"<span id='pb"+i+"'></span>"+"</p>"
		document.getElementById("info").innerHTML+=message
		getcalc("pb"+i)
	}

}
function learnError()
{	
	learnEncode();
	document.getElementById('about').style.display='none'
	document.getElementById('about2').setAttribute("style","margin-top:15%;width:70%;margin-left:15%;");document.getElementById("main").setAttribute("style","margin-top:-54%;transition:margin-top 2s ease;")
	document.getElementById("codeword2").innerHTML="Transmitted Codeword : "
	document.getElementById("codeword2").innerHTML+=document.getElementById("encoded").textContent
	document.getElementById("rec").innerHTML="Received Codeword : "
	document.getElementById("rec").innerHTML+=document.getElementById("receive").textContent		
	var pb=0;
	for(pb=0;Math.pow(2,pb)-1<=document.getElementById("rec").textContent.split(":")[1].length;pb+=1);
	document.getElementById("info2").innerHTML=""
	for (var i=0;i<pb-1;i+=1)
	{

		message="<p>To calculate parity bit "+(Math.pow(2,parseInt(i+1)-1))+", from position "+(Math.pow(2,parseInt(i+1)-1))+" consider "+(Math.pow(2,parseInt(i+1)-1))+" bit(s), skip the next "+(Math.pow(2,parseInt(i+1)-1))+" bit(s) and repeat this process till the end of the data, count the number of 1s and check if the number of 1s is even or odd. If even, the parity is 0, else 1.<br>"+"P"+(Math.pow(2,parseInt(i+1)-1))+" : "+"<span class='scam' id='pbt"+i+"'></span>"+"</p>"
		document.getElementById("info2").innerHTML+=message
		getcalct("pbt"+i)
	}
	oi=[]
	for(var i in document.getElementsByClassName('scam'))
	{
		var count=0
		for(var c in document.getElementsByClassName('scam')[i].textContent)
			if(document.getElementsByClassName('scam')[i].textContent[c]=='1')
				count+=1
		if(count%2)

			oi.push(Math.pow(2,i))

	}
	var sum=0;
	if(no_errors==0)				
		document.getElementById("info2").innerHTML+="Since all the newly calculated parity bits are 0, there are no errors to be corrected"
	else
	{

		document.getElementById("info2").innerHTML+="The positions of parity bits which have an odd number of 1s are added to obtain the position of the error. In this case : "
		for (var i in oi)
		{
			if(i==oi.length-1)
				document.getElementById("info2").innerHTML+=oi[i]
			else
				document.getElementById("info2").innerHTML+=oi[i]+'+'
			sum+=parseInt(oi[i])
		}
		if (oi.length!=1)
			document.getElementById("info2").innerHTML+='='+sum.toString()
	}
}