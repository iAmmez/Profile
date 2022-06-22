const addIngreBtn1 			= document.getElementById("add-ingre-btn-1")
const addIngreBtnContainer 	= document.getElementById("add-ingre-btn-container")
const ingreSrcContainer 	= document.getElementById("ingre-src-container")
const orderContainer 		= document.getElementById("order-container")
const servingBtn 			= document.getElementById("serving-btn")
const servingContainer 		= document.getElementById("serving-container")
const gameContainer 		= document.getElementById("game-container")
const startBtn 				= document.getElementById("start-btn")
const chef 					= document.getElementById("chef")
const playerStatus 			= document.getElementById("player-status")
const restartBtn 			= document.getElementById("restart-btn")
const limTimeBar 			= document.getElementById("lim-time-bar")

// Menu and ingredients
const menu = [
	{
		name: "curry rice",
		emoji: "🍛",
		recipe: ["cooked rice", "carrot","curry"],
		score: 3,
	},
	{
		name: "french fries",
		emoji: "🍟",
		recipe: ["potato", "cooking oil"],
		score: 2,
	},
	{
		name: "sushi",
		emoji: "🍣",
		recipe: ["cooked rice", "fish"],
		score: 2,
	},
	{
		name: "bento box",
		emoji: "🍱",
		recipe: ["cooked rice", "cucumber", "bacon"],
		score: 3,
	},
	{
		name: "tropical drink",
		emoji: "🍹",
		recipe: ["peach", "ice"],
		score: 2,
	},
	{
		name: "fried egg",
		emoji: "🍳",
		recipe: ["egg","cooking oil"],
		score: 2,
	},
	{
		name: "sandwich",
		emoji: "🥪",
		recipe: ["bread", "cucumber", "bacon"],
		score: 3,
	},
	{
		name: "green salad",
		emoji: "🥗",
		recipe: ["cucumber", "broccoli","leafy green"],
		score: 2,
	},

	]
const ingredients = [
	{
		name: "carrot",
		emoji: "🥕",
	},
	{
		name: "cooked rice",
		emoji: "🍚",
	},
	{
		name: "fish",
		emoji: "🐟",
	},
	{
		name: "potato",
		emoji: "🥔",
	},
	{
		name: "curry",
		emoji: "🍲",
	},
	{
		name: "cooking oil",
		emoji: "🧴",
	},
	{
		name: "bread",
		emoji: "🍞",
	},
	{
		name: "strawberry",
		emoji: "🍓",
	},
	{
		name: "tomato",
		emoji: "🍅",
	},
	{
		name: "peach",
		emoji: "🍑",
	},
	{
		name: "ice",
		emoji: "🧊",
	},
	{
		name: "meat",
		emoji: "🥩",
	},
	{
		name: "egg",
		emoji: "🥚",
	},
	{
		name: "bacon",
		emoji: "🥓",
	},
	{
		name: "cucumber",
		emoji: "🥒",
	},
	{
		name: "leafy green",
		emoji: "🥬",
	},
	{
		name: "broccoli",
		emoji: "🥦",
	},]

//Game variable declaration
//system
let ingreSlot = [""]
let currentMenu = {}
let currentBtn = 0
let Timer = {}
const timeDelay = 50
const waitingTime = 1000
const limitTime = 20000
//player
let chance = 3
let score = 0

//Function decleration
const setActive = (element) => {
	element.classList.remove("inactive")
	element.classList.add("active")}
const setInactive = (element) => {
	element.classList.remove("active")
	element.classList.add("inactive")}
const randmonMenu = () => menu[Math.floor(Math.random()*menu.length)]
//Array shuffling function from stackoverflow
function shuffle(array) {
  let currentIndex = array.length,  randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }

  return array}
//recipe checking function may need to be improved
function checkRecipe(properRecipe, inputRecipe) {
	inputRecipe.pop()
	if(properRecipe.length===inputRecipe.length){
		const comArray = inputRecipe.reduce((combination,element)=>combination+" "+element)
		for(const ingre of properRecipe){
			if(!comArray.includes(ingre)){ return false}
		}
		return true
	} else {
		return false
	}}
function addNewIngreBtn(){
	//Maximum number of ingredients is 4
	if(addIngreBtnContainer.querySelectorAll("button").length<4){
			//Add new add-ingre-btn
			const addIngreBtn = document.createElement("button")
			addIngreBtn.textContent = "+"
			addIngreBtn.classList.add("btn")
			addIngreBtnContainer.appendChild(addIngreBtn)
	
			//Update currentBtn of each buttons
			const ingreBtnList = addIngreBtnContainer.querySelectorAll("button")
			for(let i=0;i<ingreBtnList.length;i++){
				ingreBtnList[i].addEventListener("click", function(){
					currentBtn = i
					setActive(ingreSrcContainer)
				})
			}
		}}
function removeAllIngreBtn(){
	for(const btn of addIngreBtnContainer.querySelectorAll("button")){btn.remove()}
	ingreSlot = [""]}
function randomMenuHTML(){
	currentMenu = randmonMenu()
	orderContainer.innerHTML = `
		<h1 id="order-title">${currentMenu.name}</h1>
		<div class="emoji" id="order-emoji">${currentMenu.emoji}</div>
	`}
function initializing(){

	// Set player status
	playerStatus.innerHTML = `
	<p>Chance: ${chance}</p>
	<p>Score: ${score}</p>
	`
	// Turn on serving container
	setActive(servingContainer)
	// Add the first add-ingre-btn
	addNewIngreBtn()

	// Load ingredients
	shuffle(ingredients)
	for(const ingre of ingredients){
		const ingreBtn = document.createElement("button")
		ingreBtn.textContent = ingre.emoji
		ingreBtn.classList.add("btn")
		ingreBtn.classList.add("ingre-emoji-btn")
		ingreBtn.addEventListener("click", function(){
			//Add new add-ingre-btn and new ingre-slot if the last add-ingre-btn is clicked
			if(ingreSlot[currentBtn]===""){
				addNewIngreBtn()
				ingreSlot.push("")
			}

			//Display the emoji on the clicked slot
			addIngreBtnContainer.querySelectorAll("button")[currentBtn].textContent = ingre.emoji
			//Add the ingredient to the ingredient set
			ingreSlot[currentBtn]=ingre.name

			setInactive(ingreSrcContainer)
		})
		ingreSrcContainer.appendChild(ingreBtn)}

	//Add X button
	const xBtn = document.createElement("button")
	xBtn.textContent = "X"
	xBtn.classList.add("btn")
	xBtn.classList.add("ingre-emoji-btn")
	xBtn.style.color = "#F48498"
	xBtn.addEventListener("click", () => setInactive(ingreSrcContainer))
	ingreSrcContainer.appendChild(xBtn)

	randomMenuHTML() // random menu
}
function newTurn(){
	Timer = setTimeout(()=>timeUp(),limitTime)
	setTimeout(()=>limTimeBar.classList.add("loading"),timeDelay) //Changing class needs some time delay?

	removeAllIngreBtn()
	addNewIngreBtn()
	randomMenuHTML()}
function endGame(){
	clearTimeout(Timer) //Stop timer
	setInactive(limTimeBar)
	setInactive(servingBtn)
	setInactive(ingreSrcContainer)

	setTimeout(function(){
		removeAllIngreBtn()
		setActive(restartBtn)
		orderContainer.innerHTML = ``
		playerStatus.innerHTML = `
		<p>Game Over</p>
		<p>Score:${score}</p>
		`
	},waitingTime)
}
function timeUp(){
	setInactive(ingreSrcContainer) //Player may be selecting ingredients

	if(chance>1){
		limTimeBar.classList.remove("loading")
		chance--
		playerStatus.innerHTML = `
		<p>Try again!</p>
		<p>Chance: ${chance}</p>
		<p>Score: ${score}</p>
		`
		newTurn()
	} else {
		limTimeBar.classList.remove("loading")
		playerStatus.innerHTML = `<p>Time out!</p>`
		setInactive(limTimeBar)
		setInactive(servingBtn)
		setInactive(ingreSrcContainer)
		setTimeout(()=>endGame(),500)
	}}


//Execution
chef.addEventListener("click",()=>chef.textContent = chef.textContent==="👨‍🍳" ? "👩‍🍳":"👨‍🍳" )
startBtn.addEventListener("click",function(){
	setInactive(startBtn)
	setTimeout(function(){
		//Initialize the game
		initializing()
		//Set timer
		Timer = setTimeout(()=>timeUp(),limitTime) 
		setTimeout(()=>limTimeBar.classList.add("loading"),timeDelay)
	},waitingTime)
})
restartBtn.addEventListener("click", function(){
	limTimeBar.classList.remove("loading")
	chance = 3
	score = 0
	playerStatus.innerHTML = `
	<p>Chance: ${chance}</p>
	<p>Score: ${score}</p>
	`

	setActive(limTimeBar)
	setInactive(restartBtn)
	setTimeout(function(){
		setActive(servingBtn)
		newTurn()
	},waitingTime)
})
servingBtn.addEventListener("click", function(){
	limTimeBar.classList.remove("loading")
	clearTimeout(Timer)

	if(checkRecipe(currentMenu.recipe,ingreSlot)){
		score+=currentMenu.score
		playerStatus.innerHTML = `
		<p>Great job!</p>
		<p>Chance: ${chance}</p>
		<p>Score: ${score}</p>
		`
		newTurn()
	} else {
		if(chance>1){
			score-=currentMenu.score
			chance--
			playerStatus.innerHTML = `
			<p>Try again!</p>
			<p>Chance: ${chance}</p>
			<p>Score: ${score}</p>
		`
		newTurn()
		} else {
			endGame()
		}}
})
