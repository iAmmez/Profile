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
stopBtn.disabled = true

const burl = "https://api.binance.com"
const ourRequest = new XMLHttpRequest()
let myInterval = {}
let price1 = 0
let price2 = 0
let data = [{
	x: [],
	y: [],
	type: 'scatter',}]
const layout = {
		autosize: true,
		title: 'Receiving amount',
		xaxis: {title:{text: 'Time',standoff: 20}},
		yaxis: {title:{text: '',standoff: 60}},
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
	let receivingAmount = (price1*amountInput.value*(1-tradingFeeInput.value/100)**2)/price2
	receivingAmount = receivingAmount.toFixed(4)
	data[0].y.push(receivingAmount)
	data[0].x.push(data[0].y.length)
	if(data[0].y.length>60){
		data[0].y.shift()
		data[0].x.shift()
		for(let i=0;i<data[0].x.length;i++){
			data[0].x[i] = data[0].x[i]-1
		}
	}

	Plotly.newPlot('graph', data,layout)

	log.innerHTML=`
	<p>Sell ${holdingCoinInput.value} at ${price1} USDT</p>
	<p>Buy ${buyingCoinInput.value} at ${price2} USDT</p>
	<p>Receive ${receivingAmount} ${buyingCoinInput.value}
	`
	
}

Plotly.newPlot('graph', data,layout)

runBtn.addEventListener("click",function(){
	layout.yaxis.title.text = buyingCoinInput.value
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
	data = [{x: [],y: [],mode: "lines",type: 'scatter'}]
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
