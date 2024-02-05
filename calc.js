const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const resultDiv = document.getElementById("result");
const userInput = document.getElementById("ans");
const timeDiv = document.getElementById("timeup");
const newgame = document.getElementById("newgame");

let qcount = document.getElementById("qcount");
let pcount = document.getElementById("pcount");

let sumCounter = 0;
let timeUp;
let timeLimit = 10;
let allCounters = [];
let timeArray = [];
let correctAns;
let firstNum, lastNum, sign;
let anza;
//let timer = 0;

function generateSum() {
  let fnum1 = Math.floor(Math.random() * 9) + 1;
  let fnum2 = Math.floor(Math.random() * 9) + 1;
  let fnum3 = Math.floor(Math.random() * 9) + 1;
  let fnum = String(fnum1) + String(fnum2) + String(fnum3);
  let lnum1 = Math.floor(Math.random() * 9) + 1;
  let lnum2 = Math.floor(Math.random() * 9) + 1;
  let lnum3 = Math.floor(Math.random() * 9) + 1;
  let lnum = String(lnum1) + String(lnum2) + String(lnum3);
  let currsign = ["+"];

  function shuffleSign(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffleSign(currsign);
  let randomSign = currsign[0];
  sign = randomSign;
  firstNum = parseInt(fnum);
  lastNum = parseInt(lnum);

  context.clearRect(0, 0, canvas.width, canvas.height);
  if(window.innerWidth < 768){
    context.font = "20px Times New Romans";
    context.fillStyle = "black";
    context.fillText(`${firstNum} ${sign} ${lastNum}`, 110, 75);
  }else{
  context.font = "60px Arial";
  context.fillStyle = "maroon";
  context.fillText(`${firstNum} ${sign} ${lastNum}`, 25, 75);
  }
  //25 75
  switch (sign) {
    case "x":
      correctAns = firstNum * lastNum;
      break;
    case "+":
      correctAns = firstNum + lastNum;
      break;
    case "-":
      correctAns = firstNum - lastNum;
      break;
    case "%":
      correctAns = firstNum % lastNum;
      break;
    case "/":
      correctAns = firstNum / lastNum;
      break;
    default:
      correctAns = 0;
      break;
  }

  timer = 0;
  anza = setInterval(() => {
    timer++;
    timeDiv.innerHTML = timer;
  }, 1000);

  timeUp = setTimeout(() => {
    timeDiv.innerHTML = "Time Up!";
    clearInterval(anza);
  }, timeLimit * 1000);

  return correctAns;
}

function checkEnterKey(event) {
  if (event.keyCode === 13) {
    validateAns();
  }
}

function validateAns() {
  const playerAns = Number(userInput.value);
  if (isNaN(playerAns) || userInput.value === "") {
    resultDiv.innerHTML = "Enter a valid Number";
    userInput.value = "";
    setTimeout(() => {
      resultDiv.innerHTML = "";
    }, 3000);
  } else {
    submit(playerAns);
  }
}

function submit(yourans) {
  if (!correctAns) {
    correctAns = generateSum();
  }

  clearInterval(anza);
  clearTimeout(timeUp);
  timeDiv.innerHTML = "";
  const expression = `${firstNum} ${sign} ${lastNum}`;
  const isTimeUp = timer === 10;
  const timeTaken = isTimeUp ? "Time up" : timer;
  const isCorrect = yourans === correctAns;
  pcount.innerHTML = isCorrect ? parseInt(pcount.innerHTML) + 3 : parseInt(pcount.innerHTML);
  resultDiv.innerHTML = isCorrect
    ? "Correct!"
    : `Wrong!,answer is ${correctAns}`;
  userInput.value = "";
  setTimeout(() => {
    resultDiv.innerHTML = "";
  }, 3000);

  sumCounter++;
  qcount.innerHTML = sumCounter;
  allCounters.push({
    questionNumber: sumCounter,
    expression,
    userAnswer: yourans,
    timeTaken,
    correctAnswer: correctAns,
    isCorrect,
  });
  timeArray.push(timer);

  if (sumCounter < 20) {
    correctAns = null;
    generateSum();
  } else {
    displayGameOverAnimation();
  }
}

function displayGameOverAnimation() {
  const gameOverContainer = document.getElementById("gameOverContainer");
  const gameOverText = document.getElementById("gameOverText");
  const allCountersDiv = document.getElementById("allCounters");

  gameOverContainer.style.display = "block";
  gameOverText.style.opacity = "1";
  timeDiv.style.display = "none";
  userInput.disabled = true;

  let totalTime = timeArray.reduce((acc, currValue) => acc + currValue, 0);
  let correctCount = allCounters.filter((counter) => counter.isCorrect).length;
  let totalCount = allCounters.length;
  let accuracyPercent = Math.floor((correctCount / totalCount) * 100);
  let genEfficiency = totalTime / totalCount;
  let efficiency = genEfficiency.toFixed(3);

  let accuracyStatement = "";
  if (accuracyPercent < 40) {
    accuracyStatement = `You got ${correctCount} out of ${totalCount} [${accuracyPercent}%]<br>Remarks: WEAK!<br>`;
  } else if (accuracyPercent < 60) {
    accuracyStatement = `You got ${correctCount} out of ${totalCount} [${accuracyPercent}%]<br>Remarks: AVERAGE!<br>`;
  } else if (accuracyPercent < 75) {
    accuracyStatement = `You got ${correctCount} out of ${totalCount} [${accuracyPercent}%]<br>Remarks: GOOD!<br>`;
  } else if (accuracyPercent < 80) {
    accuracyStatement = `You got ${correctCount} out of ${totalCount} [${accuracyPercent}%]<br>Remarks: EXCELLENT!<br>`;
  } else if (accuracyPercent < 100) {
    accuracyStatement = `You got ${correctCount} out of ${totalCount} 
        [${accuracyPercent}%]<br>Remarks: SUPER EXCELLENT!<br>`;
  } else {
    accuracyStatement = `You got ${correctCount} out of ${totalCount} 
          [${accuracyPercent}%]<br>Remarks: GENIUS!<br>`;
  }

  const resultsContainer = document.createElement("div");
  allCountersDiv.innerHTML = `Efficiency: ${efficiency} sec/quiz<br> ${accuracyStatement}<br>`;
  allCountersDiv.innerHTML += "Math Quizs: <br>";
  allCounters.forEach((counter) => {
    const resultLine = document.createElement("div");

    resultLine.innerHTML += `Quiz ${counter.questionNumber}: ${counter.expression} = ${counter.userAnswer} ${counter.isCorrect ? "✔ " : "🗴"} Time taken: ${counter.timeTaken}s ||  Correct ans[${counter.correctAnswer}]<br><br>`;
    resultsContainer.appendChild(resultLine);
  });

  allCountersDiv.appendChild(resultsContainer);
  if(window.innerWidth < 768){
    allCountersDiv.style.fontSize = "16px";
  }else{
    allCountersDiv.style.fontSize = "30px";
  }
  

  const usedWidth = window.innerWidth * 0.07;
  let fontSize = 24;

  let interval = setInterval(() => {
    if (fontSize < usedWidth) {
      fontSize += 2;
      gameOverText.style.fontSize = fontSize + "px";
    } else {
      clearInterval(interval);
      newgame.style.display = "block";
      canvas.style.display = "none";
      userInput.style.display = "none";
      document.getElementById("lower").style.display = "none";
    }
  }, 80);
}

function animate() {
  requestAnimationFrame(animate);

  // Your animation logic here, if needed
}

generateSum();
animate();  // Start the animation loop
