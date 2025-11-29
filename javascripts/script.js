// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
  canvas: {
    width: 500,
    height: 700,
    backgroundColor: '#000000'
  },
  paddle: {
    width: 50,
    height: 10,
    color: '#FFFFFF',
    offset: 20,
    player: 0,
    computer: 1
  },
  ball: {
    radius: 5,
    color: '#FFFFFF',
    initialSpeedY: 3,
    maxSpeedY: 5,
    speedIncrement: 1,
    trajectoryMultiplier: 0.3
  },
  computer: {
    initialSpeed: 4,
    maxSpeed: 6,
    speedIncrement: 0.5,
    errorMargin: 5
  },
  game: {
    winningScore: 5,
    font: 'Courier New',
    fontSize: {
      score: 32,
      title: 40,
      subtitle: 20,
      small: 16
    }
  },
  colors: {
    primary: '#FFFFFF',
    secondary: '#888888',
    accent: '#00FF00',
    danger: '#FF0000',
    particle: '#FFFFFF'
  },
  particles: {
    count: 8,
    maxLife: 30,
    maxSpeed: 3
  }
};

// ========================================
// GAME STATES
// ========================================
const GameState = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over'
};

// ========================================
// PARTICLE CLASS
// ========================================
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * CONFIG.particles.maxSpeed;
    this.vy = (Math.random() - 0.5) * CONFIG.particles.maxSpeed;
    this.life = CONFIG.particles.maxLife;
    this.maxLife = CONFIG.particles.maxLife;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  isAlive() {
    return this.life > 0;
  }

  render(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = CONFIG.colors.particle;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ========================================
// BALL CLASS
// ========================================
class Ball {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = CONFIG.canvas.width / 2;
    this.y = CONFIG.canvas.height / 2;
    this.speedY = CONFIG.ball.initialSpeedY;
    this.speedX = 0;
    this.direction = 1;
  }

  update(playerMoved) {
    this.y += this.speedY * this.direction;
    if (playerMoved) {
      this.x += this.speedX;
    }
  }

  checkWallCollision() {
    if (this.x < CONFIG.ball.radius && this.speedX < 0) {
      this.speedX = -this.speedX;
      return true;
    }
    if (this.x > CONFIG.canvas.width - CONFIG.ball.radius && this.speedX > 0) {
      this.speedX = -this.speedX;
      return true;
    }
    return false;
  }

  checkPaddleCollision(paddle, playerMoved) {
    const ballLeft = this.x;
    const ballRight = this.x;
    const paddleLeft = paddle.x;
    const paddleRight = paddle.x + CONFIG.paddle.width;

    if (ballLeft >= paddleLeft && ballRight <= paddleRight) {
      if (playerMoved) {
        this.speedY = Math.min(
          this.speedY + CONFIG.ball.speedIncrement,
          CONFIG.ball.maxSpeedY
        );
      }
      this.direction = -this.direction;

      const hitPosition = this.x - (paddle.x + CONFIG.paddle.width / 2);
      this.speedX = hitPosition * CONFIG.ball.trajectoryMultiplier;

      return true;
    }
    return false;
  }

  render(ctx) {
    // Glow effect
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = CONFIG.colors.primary;

    ctx.fillStyle = CONFIG.ball.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, CONFIG.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// ========================================
// PADDLE CLASS
// ========================================
class Paddle {
  constructor(isPlayer = true) {
    this.isPlayer = isPlayer;
    this.x = CONFIG.canvas.width / 2 - CONFIG.paddle.width / 2;
    this.y = isPlayer ?
      CONFIG.canvas.height - CONFIG.paddle.offset :
      CONFIG.paddle.offset - CONFIG.paddle.height;
    this.speed = CONFIG.computer.initialSpeed;
  }

  reset() {
    this.x = CONFIG.canvas.width / 2 - CONFIG.paddle.width / 2;
    this.speed = CONFIG.computer.initialSpeed;
  }

  moveTo(targetX) {
    this.x = Math.max(0, Math.min(targetX, CONFIG.canvas.width - CONFIG.paddle.width));
  }

  updateAI(ballX, playerMoved) {
    if (!playerMoved) return;

    const targetX = ballX - CONFIG.paddle.width / 2;
    const paddleCenter = this.x + CONFIG.paddle.width / 2;
    const diff = targetX - paddleCenter;

    if (Math.abs(diff) > CONFIG.computer.errorMargin) {
      if (diff > 0) {
        this.x += Math.min(this.speed, diff);
      } else {
        this.x += Math.max(-this.speed, diff);
      }
    }

    this.x = Math.max(0, Math.min(this.x, CONFIG.canvas.width - CONFIG.paddle.width));
  }

  increaseSpeed() {
    this.speed = Math.min(this.speed + CONFIG.computer.speedIncrement, CONFIG.computer.maxSpeed);
  }

  render(ctx) {
    ctx.save();
    ctx.shadowBlur = 5;
    ctx.shadowColor = CONFIG.colors.primary;

    ctx.fillStyle = CONFIG.paddle.color;
    ctx.fillRect(this.x, this.y, CONFIG.paddle.width, CONFIG.paddle.height);

    ctx.restore();
  }
}

// ========================================
// RENDERER CLASS
// ========================================
class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  clear() {
    this.ctx.fillStyle = CONFIG.canvas.backgroundColor;
    this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
  }

  drawCenterLine() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.setLineDash([4, 4]);
    this.ctx.moveTo(0, CONFIG.canvas.height / 2);
    this.ctx.lineTo(CONFIG.canvas.width, CONFIG.canvas.height / 2);
    this.ctx.strokeStyle = CONFIG.colors.secondary;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawScore(score) {
    this.ctx.fillStyle = CONFIG.colors.primary;
    this.ctx.font = `${CONFIG.game.fontSize.score}px ${CONFIG.game.font}`;
    this.ctx.fillText(score[0], 20, CONFIG.canvas.height / 2 + 50);
    this.ctx.fillText(score[1], 20, CONFIG.canvas.height / 2 - 30);
  }

  drawPauseScreen() {
    this.ctx.save();

    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    // Pause text
    this.ctx.fillStyle = CONFIG.colors.primary;
    this.ctx.font = `${CONFIG.game.fontSize.title}px ${CONFIG.game.font}`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', CONFIG.canvas.width / 2, CONFIG.canvas.height / 2);

    this.ctx.font = `${CONFIG.game.fontSize.small}px ${CONFIG.game.font}`;
    this.ctx.fillText('Press ESC to resume', CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 + 30);
    this.ctx.fillText('Press R to restart', CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 + 50);

    this.ctx.textAlign = 'left';
    this.ctx.restore();
  }

  drawGameOver(winner) {
    this.ctx.save();

    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    // Winner text
    this.ctx.fillStyle = winner === 'player' ? CONFIG.colors.accent : CONFIG.colors.danger;
    this.ctx.font = `${CONFIG.game.fontSize.title}px ${CONFIG.game.font}`;
    this.ctx.textAlign = 'center';

    const winnerText = winner === 'player' ? 'YOU WIN!' : 'COMPUTER WINS!';
    this.ctx.fillText(winnerText, CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 - 20);

    // Instructions
    this.ctx.fillStyle = CONFIG.colors.primary;
    this.ctx.font = `${CONFIG.game.fontSize.subtitle}px ${CONFIG.game.font}`;
    this.ctx.fillText('Press R to play again', CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 + 40);

    this.ctx.textAlign = 'left';
    this.ctx.restore();
  }

  drawParticles(particles) {
    particles.forEach(particle => particle.render(this.ctx));
  }
}

// ========================================
// GAME CLASS
// ========================================
class Game {
  constructor() {
    this.canvas = this.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    this.renderer = new Renderer(this.canvas, this.ctx);

    this.ball = new Ball();
    this.playerPaddle = new Paddle(true);
    this.computerPaddle = new Paddle(false);

    this.score = [0, 0];
    this.state = GameState.PLAYING;
    this.playerMoved = false;
    this.particles = [];

    this.setupEventListeners();
    this.animate();
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = CONFIG.canvas.width;
    canvas.height = CONFIG.canvas.height;
    document.body.appendChild(canvas);
    return canvas;
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  handleMouseMove(e) {
    if (this.state !== GameState.PLAYING) return;

    this.playerMoved = true;
    this.playerPaddle.moveTo(e.offsetX - CONFIG.paddle.width / 2);
    this.canvas.style.cursor = 'none';
  }

  handleKeyPress(e) {
    if (e.key === 'Escape' && this.state !== GameState.GAME_OVER) {
      this.togglePause();
    } else if (e.key === 'r' || e.key === 'R') {
      this.reset();
    }
  }

  togglePause() {
    this.state = this.state === GameState.PAUSED ?
      GameState.PLAYING : GameState.PAUSED;
  }

  reset() {
    this.ball.reset();
    this.playerPaddle.reset();
    this.computerPaddle.reset();
    this.score = [0, 0];
    this.state = GameState.PLAYING;
    this.playerMoved = false;
    this.particles = [];
    this.canvas.style.cursor = 'default';
  }

  createParticles(x, y) {
    for (let i = 0; i < CONFIG.particles.count; i++) {
      this.particles.push(new Particle(x, y));
    }
  }

  updateParticles() {
    this.particles = this.particles.filter(particle => {
      particle.update();
      return particle.isAlive();
    });
  }

  checkCollisions() {
    // Wall collision
    if (this.ball.checkWallCollision()) {
      this.createParticles(this.ball.x, this.ball.y);
    }

    // Player paddle collision
    const playerPaddleY = CONFIG.canvas.height - CONFIG.paddle.offset;
    if (this.ball.y > playerPaddleY - CONFIG.paddle.height / 2) {
      if (this.ball.checkPaddleCollision(this.playerPaddle, this.playerMoved)) {
        this.createParticles(this.ball.x, this.ball.y);
      } else if (this.ball.y > CONFIG.canvas.height) {
        // Computer scores
        this.score[1]++;
        this.ball.reset();
        this.checkWinner();
      }
    }

    // Computer paddle collision
    const computerPaddleY = CONFIG.paddle.offset;
    if (this.ball.y < computerPaddleY + CONFIG.paddle.height / 2) {
      if (this.ball.checkPaddleCollision(this.computerPaddle, this.playerMoved)) {
        this.computerPaddle.increaseSpeed();
        this.createParticles(this.ball.x, this.ball.y);
      } else if (this.ball.y < 0) {
        // Player scores
        this.score[0]++;
        this.ball.reset();
        this.checkWinner();
      }
    }
  }

  checkWinner() {
    if (this.score[0] >= CONFIG.game.winningScore) {
      this.state = GameState.GAME_OVER;
      this.winner = 'player';
    } else if (this.score[1] >= CONFIG.game.winningScore) {
      this.state = GameState.GAME_OVER;
      this.winner = 'computer';
    }
  }

  update() {
    if (this.state !== GameState.PLAYING) return;

    this.ball.update(this.playerMoved);
    this.computerPaddle.updateAI(this.ball.x, this.playerMoved);
    this.checkCollisions();
    this.updateParticles();
  }

  render() {
    this.renderer.clear();
    this.renderer.drawCenterLine();
    this.ball.render(this.ctx);
    this.playerPaddle.render(this.ctx);
    this.computerPaddle.render(this.ctx);
    this.renderer.drawScore(this.score);
    this.renderer.drawParticles(this.particles);

    if (this.state === GameState.PAUSED) {
      this.renderer.drawPauseScreen();
    } else if (this.state === GameState.GAME_OVER) {
      this.renderer.drawGameOver(this.winner);
    }
  }

  animate() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.animate());
  }
}

// ========================================
// INITIALIZE GAME
// ========================================
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
