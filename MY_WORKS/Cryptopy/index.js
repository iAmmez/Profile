	//-----------------Get elements from HTML------------------------------------------------------
//Main part
const mainContainer = document.getElementById("main-container")
const firstExpBtn 	= document.getElementById("first-exp-btn")
const secondExpBtn 	= document.getElementById("second-exp-btn")
const thirdExpBtn 	= document.getElementById("third-exp-btn")

//Swapping part
const swapContainer 	= document.getElementById("swap-container")
const swapBtn 			= document.getElementById("swap-btn")
const logMessage 		= document.getElementById("log-message")
const holdingCoinInput 	= document.getElementById("holding-coin-input")
const amountInput 		= document.getElementById("amount-input")
const buyingCoinInput 	= document.getElementById("buying-coin-input")
const feeInput 			= document.getElementById("fee-input")

//Swap tracker and probability of success parts
const secondExpStateContainer 	= document.getElementById("second-exp-state-container")
//Swap tracker
const swapTrackerSetting 		= document.getElementById("swap-tracker-setting")
const swapTrackerSettingBtn 	= document.getElementById("swap-tracker-setting-btn")
const clsTrackerSettingBtn 		= document.getElementById("cls-tracker-setting-btn")
const numRateSwapping 			= document.getElementById("num-rate-swapping")
const swappingRateUnit 			= document.getElementById("swapping-rate-unit")
const timeIntervalSize			= document.getElementById("time-interval-size")
const targetPrice				= document.getElementById("target-price")
const swapTrackerAutoBtn 		= document.getElementById("swap-tracker-auto-btn")
const clrSwapTrackerGraphBtn 	= document.getElementById("clr-swap-tracker-graph-btn")

//Probability of success
const probOfSuccessSetting 			= document.getElementById("prob-of-success-setting")
const probOfSuccessSettingBtn 		= document.getElementById("prob-of-success-setting-btn")
const clsProbOfSuccessSettingBtn 	= document.getElementById("cls-prob-of-success-setting-btn")
const probOfSuccessCalBtn 			= document.getElementById("prob-of-success-cal-btn")
const probOfSuccessAutoBtn 			= document.getElementById("prob-of-success-auto-btn")
const timeIntervalInput 			= document.getElementById("time-interval-input")
const resolutionInput 				= document.getElementById("resolution-input")
const consideringDayInput 			= document.getElementById("considering-day-input")
const waitingDayInput 				= document.getElementById("waiting-day-input")
const initProfitInput 				= document.getElementById("init-profit-input")
const finalProfitInput 				= document.getElementById("final-profit-input")
const specificPriceInput 			= document.getElementById("specific-price-input")
const probOfSuccessMessage 			= document.getElementById("prob-of-success-message")
const probOfSuccessLoading 			= document.getElementById("prob-of-success-loading")

//Relative price tracker and statistical data
const thirdExpStateContainer 		= document.getElementById("third-exp-state-container")
//Relative price tracker
const relPriceTrackerSetting		= document.getElementById("rel-price-tracker-setting")
const relPriceTrackerSettingBtn 	= document.getElementById("rel-price-tracker-setting-btn")
const clsRelPriceTrackerSettingBtn 	= document.getElementById("cls-rel-price-tracker-setting-btn")
const relPriceTrackerCalBtn 		= document.getElementById("rel-price-tracker-cal-btn")
const timeUnit						= document.getElementById("time-unit")
const startingTime					= document.getElementById("starting-time")
const endingTime					= document.getElementById("ending-time")
const showingTimeUnit				= document.getElementById("showing-time-unit")
const samplingFre					= document.getElementById("sampling-fre")
const priceType						= document.getElementById("price-type")

//-------------------------------Variable declaration-----------------------------------------------------
let expState 			= 0			//There are 4 states, i.e., 0 1 2 3
const xhttp 			= new XMLHttpRequest() //For GET data from API
const sleep 			= ms => new Promise(r => setTimeout(r, ms)) //Sleeping function
//Prices
let holding_coin_price 	= 0
let buying_coin_price 	= 0
let receivingAmount 	= 0

//swapping and calculaing probability of success
let swapTrackerRun 		= 0
let swapTrackerRunState = false
let probCalRun 			= 0
let probCalRunState 	= false

//Graphing
const 	config = {displayModeBar: false,}
let 	swapTrackerData = [{
	x: [],
	y: [],
	type: 'scatter',
	line: {color: '#FDE74C'},},{
	x: [],
	y: [],
	type: 'scatter',
	line: {color: '#DB5461'},			
	}]
const 	swapTrackerLayout = {
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
	},
	showlegend: false}
let 	probOfSuccessTrackerData = [{
	x: [],
	y: [],
	type: 'scatter',
	line: {color: '#FDE74C'},}]
const 	probOfSuccessTrackerLayout = {
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
	}}
let 	relativePriceTrackerData = [{
	x: [],
	y: [],
	type: 'scatter',
	line: {color: '#FDE74C'},}]
const 	relativePriceTrackeLayout = {
	margin: {t:0,r:0,l:50,b:35},
	xaxis: {title:{text: 'time'},
			gridcolor: '#ffffff',},
	yaxis: {title:{text: 'relative price'},
			gridcolor: '#ffffff',},
	paper_bgcolor: "#4C5B5C",
	plot_bgcolor: "#4C5B5C",
	font: {
		family: 'Oswald',
		size: 10,
		color: "#FFFFFF"
	}}



//--------------------------Beginning-of-program-----------------------------------
Plotly.newPlot('swap-tracker-graph', swapTrackerData,swapTrackerLayout,config)
Plotly.newPlot('prob-of-success-graph', probOfSuccessTrackerData,probOfSuccessTrackerLayout,config)
Plotly.newPlot('rel-price-tracker-graph', relativePriceTrackerData,relativePriceTrackeLayout,config)

//Waiting for clicking
//Expansion
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
		expState--
	}})
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
	}})
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
	}})

//Swapping
swapBtn.addEventListener("click", function(){
	holdingCoinInput.value = holdingCoinInput.value.toUpperCase()
	buyingCoinInput.value = buyingCoinInput.value.toUpperCase()
	getSource(holdingCoinInput.value,getPrice)
	getSource(buyingCoinInput.value,getPrice)

	receivingAmount = (holding_coin_price*amountInput.value*(1-feeInput.value/100)**2)/buying_coin_price
	receivingAmount = receivingAmount.toFixed(4)
	logMessage.innerHTML=`
	<p>Sell <strong>${holdingCoinInput.value}</strong> at <strong>${holding_coin_price}</strong> USDT</p>
	<p>Buy <strong>${buyingCoinInput.value}</strong> at <strong>${buying_coin_price}</strong> USDT</p>
	<p>Receive <strong>${receivingAmount} ${buyingCoinInput.value}</strong>
	`	})
swapTrackerAutoBtn.addEventListener("click",function(){
	if(!swapTrackerRunState){
		trackingSwapping()
		swapTrackerRun = window.setInterval('trackingSwapping()',  getSwappingRate());
		swapTrackerRunState = true
		swapTrackerAutoBtn.style.background = "#E3655B"
		swapTrackerAutoBtn.innerHTML = '<i class="fa-solid fa-x"></i>'
	} else {
		clearInterval(swapTrackerRun)
		swapTrackerRunState = false
		swapTrackerAutoBtn.style.background = "#3891A6"
		swapTrackerAutoBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
	}})
swapTrackerSettingBtn.addEventListener("click",function(){
	swapTrackerSetting.classList.remove("inactive")
	swapTrackerSetting.classList.add("active")})
clsTrackerSettingBtn.addEventListener("click", function(){
	swapTrackerSetting.classList.remove("active")
	swapTrackerSetting.classList.add("inactive")})
clrSwapTrackerGraphBtn.addEventListener("click",function(){
	swapTrackerData = [{
	x: [],
	y: [],
	type: 'scatter',
	line: {color: '#FDE74C'},},{
	x: [],
	y: [],
	type: 'scatter',
	line: {color: '#DB5461'},			
	}]
	Plotly.newPlot('swap-tracker-graph', swapTrackerData,swapTrackerLayout,config)})

//Calculating probability of success
probOfSuccessCalBtn.addEventListener("click",async function(){
	if(!probCalRunState)
	{
		probCalRunState = true
		calProOfSuccess()
		probCalRunState = false
	}})
probOfSuccessAutoBtn.addEventListener("click", function(){
	if(!probCalRunState)
	{
		probCalRunState = true
		probOfSuccessAutoBtn.style.background = "#2BB6D6"
		calProOfSuccess()
		probCalRun = window.setInterval('calProOfSuccess()',  getSwappingRate());
	} else {
		clearInterval(probCalRun)
		probCalRunState = false
		probOfSuccessAutoBtn.style.background = "#3891A6"
	}})
probOfSuccessSettingBtn.addEventListener("click",function(){
	probOfSuccessSetting.classList.remove("inactive")
	probOfSuccessSetting.classList.add("active")})
clsProbOfSuccessSettingBtn.addEventListener("click", function(){
	probOfSuccessSetting.classList.remove("active")
	probOfSuccessSetting.classList.add("inactive")})

//Relative price tracker
relPriceTrackerSettingBtn.addEventListener("click",function(){
	relPriceTrackerSetting.classList.remove("inactive")
	relPriceTrackerSetting.classList.add("active")})
clsRelPriceTrackerSettingBtn.addEventListener("click", function(){
	relPriceTrackerSetting.classList.remove("active")
	relPriceTrackerSetting.classList.add("inactive")})
relPriceTrackerCalBtn.addEventListener("click", function(){
	console.log("Clicked!")
	priceTracking()
})
timeUnit.addEventListener("change",function (){
	if(timeUnit.value==="h"){
		showingTimeUnit.textContent = "hours ago"
	} else if(timeUnit.value==="d"){
		showingTimeUnit.textContent = "days ago"
	} else if(timeUnit.value==="w"){
		showingTimeUnit.textContent = "weeks ago"
	} else if(timeUnit.value==="M"){
		showingTimeUnit.textContent = "months ago"
	}
})


//--------------------------------Function declaration-----------------------------------------------
//Utility
function linspace(startValue, stopValue, cardinality) {
	let arr = []
	let step = (stopValue - startValue) / (cardinality - 1)
	for (let i = 0; i < cardinality; i++) {
		arr.push(startValue + (step * i))
	}
	return arr}
function klines(holdingCoin,buyingCoin,timeInterval,timeUnitStr,start,end){
	let timeUnit = 0

	if(timeUnitStr==="h"){
		timeUnit = 3600*1000
	} else if(timeUnitStr==="d"){
		timeUnit = 24*3600*1000
	} else if(timeUnitStr==="w"){
		timeUnit = 7*24*3600*1000
	} else if(timeUnitStr==="M"){
		timeUnit = 30*24*3600*1000
	}

	const endTime = String(new Date().getTime())-end*timeUnit;
	const startTime = String(new Date().getTime()-start*timeUnit);
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

	return [Data1,Data2]}
function getSource(CoinInput,callback) {
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState === 4 && xhttp.status === 200){
			callback(xhttp.responseText)
		}}
	URL = `https://api.binance.com/api/v3/ticker/price?symbol=${CoinInput}USDT`
	xhttp.open('GET',URL,false)
	xhttp.send();}
function getPrice(stringData){
	 let price = 0
	 const objectData = JSON.parse(stringData)
	 if (stringData!=""){
	 	if (objectData.symbol.replace('USDT', '')===holdingCoinInput.value.toUpperCase()){
	 		holding_coin_price = parseFloat(objectData.price)
	 	} else if (objectData.symbol.replace('USDT', '')===buyingCoinInput.value.toUpperCase()){
	 		buying_coin_price = parseFloat(objectData.price)
	 	}
	 }}

//Swapping
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
	return  Math.floor(numRateSwapping.value*unit)}
function trackingSwapping(){
	getSource(buyingCoinInput.value,getPrice)
	getSource(holdingCoinInput.value,getPrice)
	receivingAmount = (holding_coin_price*amountInput.value*(1-feeInput.value/100)**2)/buying_coin_price
	receivingAmount = receivingAmount.toFixed(4)
	swapTrackerData[0].y.push(receivingAmount)
	swapTrackerData[0].x.push(swapTrackerData[0].y.length)
	if(targetPrice.value && swapTrackerData[1].y.length<timeIntervalSize.value){
		swapTrackerData[1].y.push(targetPrice.value)
		swapTrackerData[1].x.push(swapTrackerData[1].y.length)
	}
	if(swapTrackerData[0].y.length>timeIntervalSize.value){
		swapTrackerData[0].y.shift()
		swapTrackerData[0].x.shift()
		for(let i=0;i<swapTrackerData[0].x.length;i++){
			swapTrackerData[0].x[i] = swapTrackerData[0].x[i]-1
		}
	}
	Plotly.newPlot('swap-tracker-graph', swapTrackerData,swapTrackerLayout,config)

	logMessage.innerHTML=`
	<p>Sell <strong>${holdingCoinInput.value.toUpperCase()}</strong> at <strong>${holding_coin_price}</strong> USDT</p>
	<p>Buy <strong>${buyingCoinInput.value.toUpperCase()}</strong> at <strong>${buying_coin_price}</strong> USDT</p>
	<p>Receive <strong>${receivingAmount} ${buyingCoinInput.value.toUpperCase()}</strong>
	`}

//Probability of success
function calOnce(holdingCoin,buyingCoin,timeInterval,prefer_R,R0,day,wday){
	const sday = day
	let p = 0
	let p_event = 0
	for( let d = wday+1;d<sday+1; d++){
		const Data = klines(holdingCoin,buyingCoin,timeInterval,"d",d,d-(wday+1))

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
	}}
function calWhole(infor,callback){
	const x = linspace(1+infor.income_m/100,1+infor.income_M/100,infor.res_income)
	let z1 = []
	let data = []
	for(let i = 0; i<infor.res_income; i++){
		console.log(parseInt((i+1)*100/infor.res_income))
		data = calOnce(infor.holdingCoin,infor.buyingCoin,infor.timeInterval,infor.price_ration,x[i],infor.day+infor.wday,infor.wday)
		z1.push(data[0])
	}
	return [x, z1, data[1], data[2]]}
async function calProOfSuccess(){
	probOfSuccessLoading.classList.remove("inactive")
	probOfSuccessLoading.classList.add("active")
	await sleep(500)

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
	<p>at receive amount: <strong>${varAmount} ${buyingCoinInput.value}</strong></p>
	<p>prob day: <strong>${String(data[3].toFixed(2))}</strong>, avg num evnts: <strong>${String(parseInt(data[2]))}</strong></p>
	`
	Plotly.newPlot('prob-of-success-graph', probOfSuccessTrackerData, probOfSuccessTrackerLayout,config)
	
	probOfSuccessLoading.classList.remove("active")
	probOfSuccessLoading.classList.add("inactive")}


//Relative price tracker
function priceTracking(){
	let relative_price = []
	let x = []
	let type = 4
	const Data = klines(holdingCoinInput.value,buyingCoinInput.value,samplingFre.value,timeUnit.value,startingTime.value,endingTime.value)

	if(priceType.value==="open"){
		type = 1
	} else if(priceType.value==="high"){
		type = 2
	} else if(priceType.value==="low"){
		type = 3
	} else if(priceType.value==="close"){
		type = 4
	}

	for(let i=0;i<Data[0].length;i++){
	 	relative_price.push(Data[0][i][type]/Data[1][i][type])
		x.push(i)
	}
	relativePriceTrackerData[0].x = x
	relativePriceTrackerData[0].y = relative_price
	Plotly.newPlot('rel-price-tracker-graph', relativePriceTrackerData,relativePriceTrackeLayout,config)
}
