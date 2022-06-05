const dot = document.getElementById("dot")
const rateInput = document.getElementById("rate-input")
const calculatingRateUnit = document.getElementById("calculating-rate-unit")
const log = document.getElementById("log")
const holdingCoinInput = document.getElementById("holding-coin-input")
const amountInput = document.getElementById("amount-input")
const buyingCoinInput = document.getElementById("buying-coin-input")
const tradingFeeInput = document.getElementById("trading-fee-input")
const runBtn = document.getElementById("run-btn")
const stopBtn = document.getElementById("stop-btn")
const pluginOpenBtn = document.getElementById("plugin-open-btn")
const pluginCloseBtn = document.getElementById("plugin-close-btn")
const pluginControl = document.getElementById("plugin-control")
const timeIntervalInput = document.getElementById("time-interval-input")
const incomeResolutionInput = document.getElementById("income-resolution-input")
const consideringDayInput = document.getElementById("considering-day-input")
const waitingDayInput = document.getElementById("waiting-day-input")

stopBtn.disabled = true
pluginCloseBtn.style.display = "none"

const burl = "https://api.binance.com"
const ourRequest = new XMLHttpRequest()
let myInterval = {}
let receivingAmount = 0
let price1 = 0
let price2 = 0

let mainData = [{
	x: [],
	y: [],
	type: 'scatter',}]
const mainLayout = {
		margin: {t:40,r:0,l:80,b:40},
		title: 'Receiving amount',
		xaxis: {title:{text: 'Time',standoff: 0}},
		yaxis: {title:{text: '',standoff: 0}},
		paper_bgcolor: "#B3D89C",
		plot_bgcolor: "#D0EFB1",
		font: {
			family: 'Ubuntu',
			size: 16
	}
}

let pluginData = [{
	x: [],
	y: [],
	type: 'scatter',}]
const pluginLayout = {
		margin: {t:40,r:0,l:80,b:40},
		title: 'Probability of success',
		xaxis: {title:{text: 'profit(%)',standoff: 0}},
		yaxis: {title:{text: 'probability',standoff: 0}},
		paper_bgcolor: "#B3D89C",
		plot_bgcolor: "#D0EFB1",
		font: {
			family: 'Ubuntu',
			size: 16
	}
}

function getCalculatingRate(){
	const stringUnit = calculatingRateUnit.value
	let unit = 0
	if(stringUnit==="sec"){
		unit = 1000
	} else if(stringUnit==="min"){
		unit = 60000
	} else if(stringUnit==="hr"){
		unit = 3600000
	} 
	return  Math.floor(rateInput.value*unit)
}

function getSource(CoinInput,callback) {
	ourRequest.onreadystatechange = function () {
		if (ourRequest.readyState === 4 && ourRequest.status === 200 && callback){
			callback(ourRequest.responseText)
			dot.style.color = "#7BE0AD"
		} else {
			dot.style.color = "#FF5858"
		}
	}
	URL = burl+`/api/v3/ticker/price?symbol=${CoinInput}USDT`
	ourRequest.open('GET',URL,false)
	ourRequest.send();
}

function getPrice(stringData){
	if (stringData!=""){
		const objectData = JSON.parse(stringData)
		if (objectData.symbol.replace('USDT', '')===holdingCoinInput.value){
			price1 = parseFloat(objectData.price)
			price1 = price1.toFixed(4)
		} else if (objectData.symbol.replace('USDT', '')===buyingCoinInput.value){
			price2 = parseFloat(objectData.price)
			price2 = price2.toFixed(4)
		}
	}
		
}

function update(){
	getSource(buyingCoinInput.value,getPrice)
	getSource(holdingCoinInput.value,getPrice)
	receivingAmount = (price1*amountInput.value*(1-tradingFeeInput.value/100)**2)/price2
	receivingAmount = receivingAmount.toFixed(4)
	mainData[0].y.push(receivingAmount)
	mainData[0].x.push(mainData[0].y.length)
	if(mainData[0].y.length>60){
		mainData[0].y.shift()
		mainData[0].x.shift()
		for(let i=0;i<mainData[0].x.length;i++){
			mainData[0].x[i] = mainData[0].x[i]-1
		}
	}
	Plotly.newPlot('main-graph', mainData,mainLayout)

	const infor = {
		holdingCoin : holdingCoinInput.value,
		buyingCoin : buyingCoinInput.value,
		timeInterval : timeIntervalInput.value,
		res_income : parseInt(incomeResolutionInput.value),
		day : parseInt(consideringDayInput.value),
		wday :  parseInt(waitingDayInput.value),
		price_ration: receivingAmount/amountInput.value,
		income_m : 1.01,
		income_M : 1.1
	}

	data = calWhole(infor)
	pluginData[0].x = data[0]
	pluginData[0].y = data[1]
	pluginLayout.annotations = [
    {
      x: 1.02,
      y: 0.3,
      xref: 'x',
      yref: 'y',
      text: 'avg num evnts: '+String(parseInt(data[2])),
      showarrow: false,
    },
    {
      x: 1.02,
      y: 0.2,
      xref: 'x',
      yref: 'y',
      text: 'prob day: '+String(data[3].toFixed(2)),
      showarrow: false,
    }
  ]
	Plotly.newPlot('plugin-graph', pluginData, pluginLayout)

	log.innerHTML=`
	<p>Sell ${holdingCoinInput.value} at ${price1} USDT</p>
	<p>Buy ${buyingCoinInput.value} at ${price2} USDT</p>
	<p>Receive ${receivingAmount} ${buyingCoinInput.value}
	`	
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

function linspace(startValue, stopValue, cardinality) {
  let arr = []
  let step = (stopValue - startValue) / (cardinality - 1)
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i))
  }
  return arr
}

function calWhole(infor,callback){
	const x = linspace(infor.income_m,infor.income_M,infor.res_income)
	let z1 = []
	let data = []
	for(let i = 0; i<infor.res_income; i++){
		console.log(parseInt((i+1)*100/infor.res_income))
		data = calOnce(infor.holdingCoin,infor.buyingCoin,infor.timeInterval,infor.price_ration,x[i],infor.day+infor.wday,infor.wday)
		z1.push(data[0])
	}
	return [x, z1, data[1], data[2]]
}

runBtn.addEventListener("click",function(){
	mainLayout.yaxis.title.text = buyingCoinInput.value
	update()
	myInterval = window.setInterval('update()',  getCalculatingRate());
	rateInput.disabled = true
	calculatingRateUnit.disabled = true
	holdingCoinInput.disabled = true
	amountInput.disabled = true
	buyingCoinInput.disabled = true
	tradingFeeInput.disabled = true
	runBtn.disabled = true
	stopBtn.disabled = false
})

stopBtn.addEventListener("click",function(){
	mainData = [{x: [],y: [],mode: "lines",type: 'scatter'}]
	clearInterval(myInterval)
	rateInput.disabled = false
	calculatingRateUnit.disabled = false
	holdingCoinInput.disabled = false
	amountInput.disabled = false
	buyingCoinInput.disabled = false
	tradingFeeInput.disabled = false
	runBtn.disabled = false
	stopBtn.disabled = true
})

pluginOpenBtn.addEventListener("click",function(){
	pluginControl.style.display = "flex"
	pluginOpenBtn.style.display = "none"
	pluginCloseBtn.style.display = "block"
})

pluginCloseBtn.addEventListener("click",function(){
	pluginControl.style.display = "none"
	pluginOpenBtn.style.display = "block"
	pluginCloseBtn.style.display = "none"
})

Plotly.newPlot('main-graph', mainData,mainLayout)
Plotly.newPlot('plugin-graph', pluginData,pluginLayout)