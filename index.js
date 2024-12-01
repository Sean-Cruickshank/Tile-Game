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
  // return `<div class="plate ${colour}">${x}:${y}</div>`

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

function loadPage() {
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
    loadPage()
  }
}

function renderScores() {
  scoreElement.innerHTML = `Score: ${score}`;
  highScoreElement.innerHTML = `High Score: ${highScore}`
}

setValues();
loadPage();

function playGame() {
  playGameButtonElement.disabled = true;
  setValues();
  loadPage();
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


function moveLeft() {
  if (playerPos.x > 1) {
    if (checkPos('left')) {
      playerPos.x --
      loadPage()
    }
    
  }
}

function moveRight() {
  if (playerPos.x < size) {
    if (checkPos('right')) {
      playerPos.x++
      loadPage()
    }
    
  }
}

function moveUp() {
  if (playerPos.y > 1) {
    if (checkPos('up')) {
      playerPos.y--
      loadPage()
    }
    
  }
}

function moveDown() {
  if (playerPos.y < size) {
    if (checkPos('down')) {
      playerPos.y++
      loadPage()
    }

  }
}

addEventListener('keydown', (input) => {
  if (gameActive) {
    if (input.key === 'ArrowLeft') {
      moveLeft();
    }
    if (input.key === 'ArrowRight') {
      moveRight();
    }
    if (input.key === 'ArrowUp') {
      moveUp();
    }
    if (input.key === 'ArrowDown') {
      moveDown();
    }
    if (input.key === 'Enter') {
      setValues();
      loadPage();
    }
  }
})

function checkPos(move) {
  let result;
  if (move === 'left') {
    plateArray.forEach((plate) => {
      if (plate.x === playerPos.x - 1 && plate.y === playerPos.y) {
        if (plate.grey) {
          result = false
        } else {
          result = true
        }
      }
    })
  } else if (move === 'right') {
    plateArray.forEach((plate) => {
      if (plate.x === playerPos.x + 1 && plate.y === playerPos.y) {
        if (plate.grey) {
          result = false
        } else {
          result = true
        }
      }
    })
  } else if (move === 'up') {
    plateArray.forEach((plate) => {
      if (plate.x === playerPos.x && plate.y === playerPos.y - 1) {
        if (plate.grey) {
          result = false
        } else {
          result = true
        }
      }
    })
  } else if (move === 'down') {
    plateArray.forEach((plate) => {
      if (plate.x === playerPos.x && plate.y === playerPos.y + 1) {
        if (plate.grey) {
          result = false
        } else {
          result = true
        }
      }
    })
  }
  return result
}
