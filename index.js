let plateArray = [];
let size = 12;
let grid = size*size
let gridX = 1;
let gridY = 1;
let playerPos = randomPos();
let goalPos = randomPos();
let score = 0
let highScore = localStorage.getItem('highscore') | 0;
let gameActive = false
const gridElement = document.querySelector('.grid');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score')
const timerElement = document.querySelector('.timer');
const playGameButtonElement = document.querySelector('.playGameButton')

function randomPos() {
  let x = Math.ceil(Math.random() * size);
  let y = Math.ceil(Math.random() * size);
  return {x, y}
}

function setValues() {
  gridX = 1;
  gridY = 1;
  playerPos = randomPos();
  goalPos = randomPos();
  plateArray = [];

  for (let i = 0; i < grid; i++) {
    const ranNum = (Math.random().toFixed(2)) * 100;
    let isGrey = false;
    if (ranNum <= 20) {
      if (gridX === playerPos.x && gridY === playerPos.y) {
        isGrey = false;
      } else if (gridX === goalPos.x && gridY === goalPos.y) {
        isGrey = false;
      } else {
        isGrey = true;
      }
      
    }
    if (gridX < size) {
      plateArray.push({active: false, grey: isGrey, x: gridX, y: gridY})
      gridX++;
    } else if (gridX === size) {
      plateArray.push({active: false, grey: isGrey, x: gridX, y: gridY})
      gridX = 1;
      gridY++;
    }
  }
}

function plateCreator(colour, x, y) {
  if (colour === 'green' || colour === 'grey') {
    if (score < 1) {
      return `<div class="plate ${colour}-one"></div>`
    } else if (score >= 1 && score < 2) {
      return `<div class="plate ${colour}-two"></div>`
    } else if (score >= 2 && score < 3) {
      return `<div class="plate ${colour}-three"></div>`
    } else if (score >= 3) {
      return `<div class="plate ${colour}-four"></div>`
    }
  } else {
    return `<div class="plate ${colour}"></div>`
  }
  
}

function renderGrid() {
  let gridElementHTML = '';
  plateArray.forEach((plate) => {
    if (plate.grey) {
      gridElementHTML += plateCreator('grey', plate.x, plate.y)
    } else if (plate.x === playerPos.x && plate.y === playerPos.y) {
      gridElementHTML += plateCreator('blue', plate.x, plate.y)
    } else if (plate.x === goalPos.x && plate.y === goalPos.y) {
      gridElementHTML += plateCreator('gold', plate.x, plate.y)
    } else {
      gridElementHTML += plateCreator('green', plate.x, plate.y)
    }
  })
  gridElement.innerHTML = gridElementHTML;
  renderScores()
  if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
    if (gameActive) {
      score++;
    }
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highscore', highScore)
    }
    setValues()
    renderGrid()
  }
}

function renderScores() {
  scoreElement.innerHTML = `Score: ${score}`;
  highScoreElement.innerHTML = `High Score: ${highScore}`
}

setValues();
renderGrid();

function playGame() {
  playGameButtonElement.disabled = true;
  setValues();
  renderGrid();
  gameActive = true
  let timer = 300
  const clock = setInterval(() => {
    if (timer > 0) {
      timer--;
      timerElement.innerHTML = `${(timer / 10).toFixed(1)}`
    } else {
      playGameButtonElement.disabled = false;
      let endMessage = '';
      if (score === highScore) {
        endMessage = 'That\'s a new highscore!'
      } else if (highScore - score < 3) {
        endMessage = 'So close! You almost made it to your highscore!'
      } else if (highScore - score >= 3) {
        endMessage = 'Better luck next time!'
      }
      alert(`Game over! ${endMessage}
Your score: ${score}
High score: ${highScore}`)
      score = 0
      gameActive = false
      clearInterval(clock)
    }
  }, 100)
}

function resetHighScore() {
  highScore = 0;
  localStorage.setItem('highscore', highScore)
  renderScores()
}

function movePos(direction) {
  if (playerPos.x > 1 && direction === 'ArrowLeft') {
    if (checkPos(direction)) {
      playerPos.x --;
      renderGrid()
    }
  } else if (playerPos.x < size && direction === 'ArrowRight') {
    if (checkPos(direction)) {
      playerPos.x ++;
      renderGrid()
    }
  } else if (playerPos.y > 1 && direction === 'ArrowUp') {
    if (checkPos('ArrowUp')) {
      playerPos.y--
      renderGrid()
    }
  } else if (playerPos.y < size && direction === 'ArrowDown') {
    if (checkPos('ArrowDown')) {
      playerPos.y++
      renderGrid()
    }
  }
}

addEventListener('keydown', (input) => {
  if (gameActive) {
    movePos(input.key);
    if (input.key === 'Enter') {
      setValues();
      renderGrid();
    }
  }
})

function checkPos(move) {
  let result = true;

  plateArray.forEach((plate) => {
    if (move === 'ArrowLeft' && plate.x === playerPos.x - 1 && plate.y === playerPos.y) {
      if (plate.grey) {result = false}
    } else if (move === 'ArrowRight' && plate.x === playerPos.x + 1 && plate.y === playerPos.y) {
      if (plate.grey) {result = false}
    } else if (move === 'ArrowUp' && plate.x === playerPos.x && plate.y === playerPos.y - 1) {
      if (plate.grey) {result = false}
    } else if (move === 'ArrowDown' && plate.x === playerPos.x && plate.y === playerPos.y + 1) {
      if (plate.grey) {result = false}
    }
  })
  return result
}