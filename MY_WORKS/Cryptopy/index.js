const mainContainer = document.getElementById("main-container")
const firstExpBtn = document.getElementById("first-exp-btn")
const secondExpBtn = document.getElementById("second-exp-btn")
const thirdExpBtn = document.getElementById("third-exp-btn")
const swapContainer = document.getElementById("swap-container")
const secondExpStateContainer = document.getElementById("second-exp-state-container")
const swapTrackergraph = document.getElementById("swap-tracker-graph")
const thirdExpStateContainer = document.getElementById("third-exp-state-container")
const swapBtn = document.getElementById("swap-btn")
const holdingCoinInput = document.getElementById("holding-coin-input")
const amountInput = document.getElementById("amount-input")
const buyingCoinInput = document.getElementById("buying-coin-input")
const feeInput = document.getElementById("fee-input")
const logMessage = document.getElementById("log-message")
const swapTrackerSettingBtn = document.getElementById("swap-tracker-setting-btn")
const swapTrackerSetting = document.getElementById("swap-tracker-setting")
const clsTrackerSettingBtn = document.getElementById("cls-tracker-setting-btn")
const probOfSuccessSettingBtn = document.getElementById("prob-of-success-setting-btn")
const probOfSuccessSetting = document.getElementById("prob-of-success-setting")
const clsProbOfSuccessSettingBtn = document.getElementById("cls-prob-of-success-setting-btn")

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
	yaxis: {title:{text: 'coin'},
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

Plotly.newPlot(swapTrackergraph, swapTrackerData,swapTrackerLayout)
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
	getSource(holdingCoinInput.value.toUpperCase(),getPrice)
	getSource(buyingCoinInput.value.toUpperCase(),getPrice)

	receivingAmount = (holding_coin_price*amountInput.value*(1-feeInput.value/100)**2)/buying_coin_price
	receivingAmount = receivingAmount.toFixed(4)

	logMessage.innerHTML=`
	<p>Sell <strong>${holdingCoinInput.value.toUpperCase()}</strong> at <strong>${holding_coin_price}</strong> USDT</p>
	<p>Buy <strong>${buyingCoinInput.value.toUpperCase()}</strong> at <strong>${buying_coin_price}</strong> USDT</p>
	<p>Receive <strong>${receivingAmount} ${buyingCoinInput.value.toUpperCase()}</strong>
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

probOfSuccessSettingBtn.addEventListener("click",function(){
	probOfSuccessSetting.classList.remove("inactive")
	probOfSuccessSetting.classList.add("active")
})

clsProbOfSuccessSettingBtn.addEventListener("click", function(){
	probOfSuccessSetting.classList.remove("active")
	probOfSuccessSetting.classList.add("inactive")
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
