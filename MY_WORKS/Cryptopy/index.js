const mainContainer = document.getElementById("main-container")
const firstExpBtn = document.getElementById("first-exp-btn")
const secondExpBtn = document.getElementById("second-exp-btn")
const thirdExpBtn = document.getElementById("third-exp-btn")
const swapContainer = document.getElementById("swap-container")
const secondExpStateContainer = document.getElementById("second-exp-state-container")
const thirdExpStateContainer = document.getElementById("third-exp-state-container")
const swapBtn = document.getElementById("swap-btn")
const holdingCoinInput = document.getElementById("holding-coin-input")
const amountInput = document.getElementById("amount-input")
const buyingCoinInput = document.getElementById("buying-coin-input")
const feeInput = document.getElementById("fee-input")
const logMessage = document.getElementById("log-message")
const swapTrackerSettingBtn = document.getElementById("swap-tracker-setting-btn")
const swapTrackerAutoBtn = document.getElementById("swap-tracker-auto-btn")
const swapTrackerSetting = document.getElementById("swap-tracker-setting")
const clsTrackerSettingBtn = document.getElementById("cls-tracker-setting-btn")
const probOfSuccessSettingBtn = document.getElementById("prob-of-success-setting-btn")
const probOfSuccessSetting = document.getElementById("prob-of-success-setting")
const clsProbOfSuccessSettingBtn = document.getElementById("cls-prob-of-success-setting-btn")
const probOfSuccessAutoBtn = document.getElementById("prob-of-success-auto-btn")
const numRateSwapping = document.getElementById("num-rate-swapping")
const swappingRateUnit = document.getElementById("swapping-rate-unit")
const timeIntervalInput = document.getElementById("time-interval-input")
const resolutionInput = document.getElementById("resolution-input")
const consideringDayInput = document.getElementById("considering-day-input")
const waitingDayInput = document.getElementById("waiting-day-input")
const initProfitInput = document.getElementById("init-profit-input")
const finalProfitInput = document.getElementById("final-profit-input")
const probOfSuccessMessage = document.getElementById("prob-of-success-message")
const specificPriceInput = document.getElementById("specific-price-input")

const delay = 200
let timer = 0
let swapTrackerRun = 0
let swapTrackerRunState = false
let prevent = false
let expState = 0
let holding_coin_price = 0
let buying_coin_price = 0
let receivingAmount = 0
const xhttp = new XMLHttpRequest()

let swapTrackerData = [{
	x: [],
	y: [],
	type: 'scatter',
	line: {color: '#FDE74C'},}]
const swapTrackerLayout = {
	margin: {t:0,r:0,l:50,b:35},
	xaxis: {title:{text: 'time'},
			gridcolor: '#ffffff',},
	yaxis: {title:{text: 'receiving amount'},
			gridcolor: '#ffffff',},
	paper_bgcolor: "#4C5B5C",
	plot_bgcolor: "#4C5B5C",
	font: {
		family: 'Oswald',
		size: 10,
		color: "#FFFFFF"
	}
}

let probOfSuccessTrackerData = [{
	x: [],
	y: [],
	type: 'scatter',
	line: {color: '#FDE74C'},}]
const probOfSuccessTrackerLayout = {
	margin: {t:0,r:0,l:50,b:35},
	xaxis: {title:{text: 'profit(%)'},
			gridcolor: '#ffffff',},
	yaxis: {title:{text: 'probability'},
			gridcolor: '#ffffff',},
	paper_bgcolor: "#4C5B5C",
	plot_bgcolor: "#4C5B5C",
	font: {
		family: 'Oswald',
		size: 10,
		color: "#FFFFFF"
	}
}

Plotly.newPlot('swap-tracker-graph', swapTrackerData,swapTrackerLayout)
Plotly.newPlot('prob-of-success-graph', probOfSuccessTrackerData,probOfSuccessTrackerLayout)

firstExpBtn.addEventListener("click",function(){
	if(expState===0){
		mainContainer.classList.remove("zero-exp")
		swapContainer.classList.remove("inactive")
		secondExpBtn.classList.remove("inactive")

		mainContainer.classList.add("first-exp")
		swapContainer.classList.add("active")
		secondExpBtn.classList.add("active")

		firstExpBtn.innerHTML = '<i class="fa-solid fa-caret-up"></i>'

		expState++
	} else if(expState===1) {
		mainContainer.classList.remove("first-exp")
		swapContainer.classList.remove("active")
		secondExpBtn.classList.remove("active")

		mainContainer.classList.add("zero-exp")
		swapContainer.classList.add("inactive")
		secondExpBtn.classList.add("inactive")

		firstExpBtn.innerHTML = '<i class="fa-solid fa-caret-down"></i>'
		logMessage.innerHTML = ''
		holdingCoinInput.value = ''
		amountInput.value = 0
		buyingCoinInput.value = ''
		feeInput.value = 0.1
		expState--
	}
})
secondExpBtn.addEventListener("click",function(){
	if(expState===1){
		mainContainer.classList.remove("first-exp")
		secondExpStateContainer.classList.remove("inactive")
		firstExpBtn.classList.remove("active")
		thirdExpBtn.classList.remove("inactive")

		mainContainer.classList.add("second-exp")
		secondExpStateContainer.classList.add("active")
		firstExpBtn.classList.add("inactive")
		thirdExpBtn.classList.add("active")

		secondExpBtn.innerHTML = '<i class="fa-solid fa-caret-left"></i>'
		expState++
	} else if(expState===2){
		mainContainer.classList.remove("second-exp")
		secondExpStateContainer.classList.remove("active")
		firstExpBtn.classList.remove("inactive")
		thirdExpBtn.classList.remove("active")

		mainContainer.classList.add("first-exp")
		secondExpStateContainer.classList.add("inactive")
		firstExpBtn.classList.add("active")
		thirdExpBtn.classList.add("inactive")

		secondExpBtn.innerHTML = '<i class="fa-solid fa-caret-right"></i>'

		expState--
	}
})
thirdExpBtn.addEventListener("click",function(){
	if(expState===2){
		mainContainer.classList.remove("second-exp")
		secondExpBtn.classList.remove("active")
		thirdExpStateContainer.classList.remove("inactive")

		mainContainer.classList.add("third-exp")
		secondExpBtn.classList.add("inactive")
		thirdExpStateContainer.classList.add("active")

		thirdExpBtn.innerHTML = '<i class="fa-solid fa-caret-left"></i>'
		expState++
	} else if(expState===3){
		mainContainer.classList.remove("third-exp")
		secondExpBtn.classList.remove("inactive")
		thirdExpStateContainer.classList.remove("active")

		mainContainer.classList.add("second-exp")
		secondExpBtn.classList.add("active")
		thirdExpStateContainer.classList.add("inactive")

		thirdExpBtn.innerHTML = '<i class="fa-solid fa-caret-right"></i>'
		expState--
	}
})

swapBtn.addEventListener("click", function(){
	holdingCoinInput.value = holdingCoinInput.value.toUpperCase()
	buyingCoinInput.value = buyingCoinInput.value.toUpperCase()
	getSource(holdingCoinInput.value,getPrice)
	getSource(buyingCoinInput.value,getPrice)

	receivingAmount = (holding_coin_price*amountInput.value*(1-feeInput.value/100)**2)/buying_coin_price

	logMessage.innerHTML=`
	<p>Sell <strong>${holdingCoinInput.value}</strong> at <strong>${holding_coin_price}</strong> USDT</p>
	<p>Buy <strong>${buyingCoinInput.value}</strong> at <strong>${buying_coin_price}</strong> USDT</p>
	<p>Receive <strong>${receivingAmount} ${buyingCoinInput.value}</strong>
	`	
})

swapTrackerSettingBtn.addEventListener("click",function(){
	swapTrackerSetting.classList.remove("inactive")
	swapTrackerSetting.classList.add("active")
})

clsTrackerSettingBtn.addEventListener("click", function(){
	swapTrackerSetting.classList.remove("active")
	swapTrackerSetting.classList.add("inactive")
})

swapTrackerAutoBtn.addEventListener("click",function(){
	timer = setTimeout(function() {
	if (!prevent) {
		trackingSwapping()
	}
	prevent = false;
	}, delay);
})

swapTrackerAutoBtn.addEventListener("dblclick",function(){
	clearTimeout(timer);
	prevent = true;
	if(!swapTrackerRunState){
		swapTrackerRun = window.setInterval('trackingSwapping()',  getSwappingRate());
		swapTrackerRunState = true
	} else {
		clearInterval(swapTrackerRun)
		swapTrackerRunState = false
	}
})

probOfSuccessSettingBtn.addEventListener("click",function(){
	probOfSuccessSetting.classList.remove("inactive")
	probOfSuccessSetting.classList.add("active")
})

clsProbOfSuccessSettingBtn.addEventListener("click", function(){
	probOfSuccessSetting.classList.remove("active")
	probOfSuccessSetting.classList.add("inactive")
})

probOfSuccessAutoBtn.addEventListener("click",function(){
	timer = setTimeout(function() {
	if (!prevent) {
		calProOfSuccess()
	}
	prevent = false;
	}, delay);
})

probOfSuccessAutoBtn.addEventListener("dblclick",function(){
	clearTimeout(timer);
	prevent = true;
	console.log("double clicked!")
})

function getSource(CoinInput,callback) {
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState === 4 && xhttp.status === 200){
			callback(xhttp.responseText)
		} else {
			console.log("No connection")
		}
	}
	URL = `https://api.binance.com/api/v3/ticker/price?symbol=${CoinInput}USDT`
	xhttp.open('GET',URL,false)
	xhttp.send();
}

function getPrice(stringData){
	 let price = 0
	 const objectData = JSON.parse(stringData)
	 if (stringData!=""){
	 	if (objectData.symbol.replace('USDT', '')===holdingCoinInput.value.toUpperCase()){
	 		holding_coin_price = parseFloat(objectData.price)
	 	} else if (objectData.symbol.replace('USDT', '')===buyingCoinInput.value.toUpperCase()){
	 		buying_coin_price = parseFloat(objectData.price)
	 	}
	 }
}

function trackingSwapping(){
	getSource(buyingCoinInput.value,getPrice)
	getSource(holdingCoinInput.value,getPrice)
	receivingAmount = (holding_coin_price*amountInput.value*(1-feeInput.value/100)**2)/buying_coin_price
	swapTrackerData[0].y.push(receivingAmount)
	swapTrackerData[0].x.push(swapTrackerData[0].y.length)
	if(swapTrackerData[0].y.length>60){
		swapTrackerData[0].y.shift()
		swapTrackerData[0].x.shift()
		for(let i=0;i<swapTrackerData[0].x.length;i++){
			swapTrackerData[0].x[i] = swapTrackerData[0].x[i]-1
		}
	}
	Plotly.newPlot('swap-tracker-graph', swapTrackerData,swapTrackerLayout)

	logMessage.innerHTML=`
	<p>Sell <strong>${holdingCoinInput.value.toUpperCase()}</strong> at <strong>${holding_coin_price}</strong> USDT</p>
	<p>Buy <strong>${buyingCoinInput.value.toUpperCase()}</strong> at <strong>${buying_coin_price}</strong> USDT</p>
	<p>Receive <strong>${receivingAmount} ${buyingCoinInput.value.toUpperCase()}</strong>
	`
}

function getSwappingRate(){
	const stringUnit = swappingRateUnit.value
	let unit = 0
	if(stringUnit==="sec"){
		unit = 1000
	} else if(stringUnit==="min"){
		unit = 60000
	} else if(stringUnit==="hr"){
		unit = 3600000
	} 
	return  Math.floor(numRateSwapping.value*unit)
}

function calProOfSuccess(){
	holdingCoinInput.value = holdingCoinInput.value.toUpperCase()
	buyingCoinInput.value = buyingCoinInput.value.toUpperCase()
	let varAmount = 0
	let holding_price = 0

	if(specificPriceInput.value){
		varAmount = (specificPriceInput.value*amountInput.value*(1-feeInput.value/100)**2)/buying_coin_price
		holding_price = specificPriceInput.value
	} else {
		varAmount = receivingAmount
		holding_price = holding_coin_price
	}

	const infor = {
		holdingCoin : holdingCoinInput.value,
		buyingCoin : buyingCoinInput.value,
		timeInterval : timeIntervalInput.value,
		res_income : parseInt(resolutionInput.value),
		day : parseInt(consideringDayInput.value),
		wday :  parseInt(waitingDayInput.value),
		price_ration: varAmount/amountInput.value,
		income_m : initProfitInput.value,
		income_M : finalProfitInput.value
	}

	data = calWhole(infor)
	probOfSuccessTrackerData[0].x = data[0]
	probOfSuccessTrackerData[0].y = data[1]
	probOfSuccessMessage.innerHTML = `
	<p>at <strong>${holdingCoinInput.value} ${holding_price}</strong> USDT and 
	<strong>${buyingCoinInput.value} ${buying_coin_price}</strong> USDT</p>
	<p>prob day: <strong>${String(data[3].toFixed(2))}</strong>, avg num evnts: <strong>${String(parseInt(data[2]))}</strong></p>
	`
	Plotly.newPlot('prob-of-success-graph', probOfSuccessTrackerData, probOfSuccessTrackerLayout)
}

function klines(holdingCoin,buyingCoin,timeInterval,startDay,endDay){
	const endTime = String(new Date().getTime())-endDay*24*3600*1000;
	const startTime = String(new Date().getTime()-startDay*24*3600*1000);
	const xhttp = new XMLHttpRequest()
	const burl = "https://api.binance.com"
	const text1 = `/api/v3/klines?symbol=${holdingCoin}USDT&interval=${timeInterval}&startTime=${startTime}&endTime=${endTime}`
	const text2 = `/api/v3/klines?symbol=${buyingCoin}USDT&interval=${timeInterval}&startTime=${startTime}&endTime=${endTime}`
	let Data = []

	function getSource(text,callback) {
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState === 4 && xhttp.status === 200){
				callback(JSON.parse(xhttp.responseText))
			}
		}
		xhttp.open('GET',burl+text,false)
		xhttp.send();
	}

	function recievingData1(data) {
		Data1 = data
	}

	function recievingData2(data) {
		Data2 = data
	}
	getSource(text1,recievingData1)
	getSource(text2,recievingData2)

	return [Data1,Data2]
}

function calOnce(holdingCoin,buyingCoin,timeInterval,prefer_R,R0,day,wday){
	const sday = day
	let p = 0
	let p_event = 0
	for( let d = wday+1;d<sday+1; d++){
		const Data = klines(holdingCoin,buyingCoin,timeInterval,d,d-(wday+1))

		let count1 = 0
		let count2 = 0

		for (let i = 0; i<Math.floor(Data[0].length/(wday+1));i++){
			const klines1 = Data[0]
			const klines2 = Data[1]
			if (parseFloat(klines1[i][4])/parseFloat(klines2[i][4])>prefer_R){
				count1++
				for(let j=i;j<i+Math.floor(Data[0].length*(wday/(wday+1)));j++){
					const R = (parseFloat(klines1[i][4])/parseFloat(klines2[i][4]))/(parseFloat(klines1[j][4])/parseFloat(klines2[j][4]))
					if (R>R0){
						count2 += 1
						break
					}
				}
			}
		}
		if (count1==0){
			day -= 1
		} else{
			p += count2/count1
		}
		p_event += count1
	}
	if (day-wday==0){
		return [0,0,0]
	} else{
		return [p/(day-wday),p_event/(day-wday),(day-wday)/(sday-wday)]	
	}
}

function calWhole(infor,callback){
	const x = linspace(1+infor.income_m/100,1+infor.income_M/100,infor.res_income)
	let z1 = []
	let data = []
	for(let i = 0; i<infor.res_income; i++){
		console.log(parseInt((i+1)*100/infor.res_income))
		data = calOnce(infor.holdingCoin,infor.buyingCoin,infor.timeInterval,infor.price_ration,x[i],infor.day+infor.wday,infor.wday)
		z1.push(data[0])
	}
	return [x, z1, data[1], data[2]]
}

function linspace(startValue, stopValue, cardinality) {
	let arr = []
	let step = (stopValue - startValue) / (cardinality - 1)
	for (let i = 0; i < cardinality; i++) {
		arr.push(startValue + (step * i))
	}
	return arr
}
