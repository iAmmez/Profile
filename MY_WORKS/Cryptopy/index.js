const mainBody = document.getElementById("main-body")
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

let expState = 0
let holding_coin_price = 0
let buying_coin_price = 0
let receivingAmount = 0
const xhttp = new XMLHttpRequest()

firstExpBtn.addEventListener("click",function(){
	if(expState===0){
		swapContainer.classList.remove("inactive")
		mainBody.classList.remove("zero-exp")
		secondExpBtn.classList.remove("inactive")

		swapContainer.classList.add("active")
		mainBody.classList.add("first-exp")
		secondExpBtn.classList.add("active")

		firstExpBtn.innerHTML = '<i class="fa-solid fa-caret-up"></i>'

		expState++
	} else if(expState===1) {
		swapContainer.classList.remove("active")
		mainBody.classList.remove("first-exp")
		secondExpBtn.classList.remove("active")

		swapContainer.classList.add("inactive")
		mainBody.classList.add("zero-exp")
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
		mainBody.classList.remove("first-exp")
		secondExpStateContainer.classList.remove("inactive")
		firstExpBtn.classList.remove("active")
		thirdExpBtn.classList.remove("inactive")

		mainBody.classList.add("second-exp")
		secondExpStateContainer.classList.add("active")
		firstExpBtn.classList.add("inactive")
		thirdExpBtn.classList.add("active")

		secondExpBtn.innerHTML = '<i class="fa-solid fa-caret-left"></i>'
		expState++
	} else if(expState===2){
		mainBody.classList.remove("second-exp")
		secondExpStateContainer.classList.remove("active")
		firstExpBtn.classList.remove("inactive")
		thirdExpBtn.classList.remove("active")

		mainBody.classList.add("first-exp")
		secondExpStateContainer.classList.add("inactive")
		firstExpBtn.classList.add("active")
		thirdExpBtn.classList.add("inactive")

		secondExpBtn.innerHTML = '<i class="fa-solid fa-caret-right"></i>'

		expState--
	}
})
thirdExpBtn.addEventListener("click",function(){
	if(expState===2){
		mainBody.classList.remove("second-exp")
		secondExpBtn.classList.remove("active")
		thirdExpStateContainer.classList.remove("inactive")

		mainBody.classList.add("third-exp")
		secondExpBtn.classList.add("inactive")
		thirdExpStateContainer.classList.add("active")

		thirdExpBtn.innerHTML = '<i class="fa-solid fa-caret-left"></i>'
		expState++
	} else if(expState===3){
		mainBody.classList.remove("third-exp")
		secondExpBtn.classList.remove("inactive")
		thirdExpStateContainer.classList.remove("active")

		mainBody.classList.add("second-exp")
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
