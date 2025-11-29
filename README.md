# Pong Clone - Professional Edition

A classic Pong game clone built with vanilla JavaScript using object-oriented architecture and development best practices.

## Features

- Object-oriented architecture with separation of concerns
- Particle system for visual effects
- Glow effects on game elements
- State management system (Playing, Paused, Game Over)
- Scoring system with winning condition (5 points)
- Improved AI with realistic imperfections
- Centralized configuration for easy customization
- Clean and well-documented code

## Controls

- **Mouse**: Control your paddle (bottom)
- **ESC**: Pause/resume the game
- **R**: Restart the game

## Code Architecture

### Class Structure

```
CONFIG (Object)
├── canvas
├── paddle
├── ball
├── computer
├── game
├── colors
└── particles

GameState (Enum)
├── PLAYING
├── PAUSED
└── GAME_OVER

Particle (Class)
├── update()
├── isAlive()
└── render()

Ball (Class)
├── reset()
├── update()
├── checkWallCollision()
├── checkPaddleCollision()
└── render()

Paddle (Class)
├── reset()
├── moveTo()
├── updateAI()
├── increaseSpeed()
└── render()

Renderer (Class)
├── clear()
├── drawCenterLine()
├── drawScore()
├── drawPauseScreen()
├── drawGameOver()
└── drawParticles()

Game (Class)
├── createCanvas()
├── setupEventListeners()
├── handleMouseMove()
├── handleKeyPress()
├── togglePause()
├── reset()
├── createParticles()
├── updateParticles()
├── checkCollisions()
├── checkWinner()
├── update()
├── render()
└── animate()
```

### Applied Principles

1. **Separation of Concerns**: Each class has a specific purpose
2. **Encapsulation**: Data and methods are contained within their classes
3. **Centralized Configuration**: All game values in a single CONFIG object
4. **Single Source of Truth**: No data duplication
5. **Maintainability**: Easy to modify and extend code
6. **Scalability**: Architecture ready for new features

## Customization

You can customize the game by editing the `CONFIG` object in `script.js`:

```javascript
const CONFIG = {
  game: {
    winningScore: 5,  // Change the winning score
  },
  colors: {
    accent: '#00FF00',  // Color when player wins
    danger: '#FF0000',  // Color when computer wins
  },
  particles: {
    count: 8,  // Number of particles per collision
  }
};
```

## Improvements Over Original Version

1. Object-oriented architecture
2. Particle system for visual effects
3. Game over screen with winner announcement
4. Glow effects on ball and paddles
5. Semi-transparent overlay on pause/game over
6. Better code organization
7. Easy configuration and customization
8. Cleaner and more maintainable code
9. Better variable and function naming
10. Clear documentation with comments

## Technologies

- JavaScript ES6+ (Classes, Arrow Functions, Template Literals)
- Canvas API
- requestAnimationFrame for smooth animations

## File Structure

```
Game/
├── index.html
├── README.md
├── javascripts/
│   └── script.js
└── stylesheets/
    └── style.css
```

## Game Flow

1. **Initialization**: Game object is created when DOM loads
2. **Playing State**: Ball moves, paddles respond, collisions are detected
3. **Scoring**: Points awarded when ball passes a paddle
4. **Winning Condition**: First to reach 5 points wins
5. **Game Over State**: Winner is displayed, game can be restarted
6. **Pause State**: Game can be paused/resumed anytime

## Code Highlights

### Particle System
```javascript
class Particle {
  // Creates visual feedback on collisions
  // Particles fade out over time
  // Random velocity for organic look
}
```

### State Management
```javascript
const GameState = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over'
};
```

### Centralized Configuration
```javascript
const CONFIG = {
  // All game parameters in one place
  // Easy to modify and balance
  // No magic numbers in code
};
```

## Performance

- Optimized render loop using requestAnimationFrame
- Particle cleanup to prevent memory leaks
- Efficient collision detection
- Smooth 60 FPS gameplay

## Browser Compatibility

Works on all modern browsers supporting:
- ES6 Classes
- Canvas API
- requestAnimationFrame

## Future Enhancements

Potential features that could be added:
- Sound effects
- Difficulty levels
- Two-player mode
- Power-ups
- Mobile touch controls
- Score persistence (localStorage)
- Start menu
- Game settings panel

## Author

Refactored with Claude Code
