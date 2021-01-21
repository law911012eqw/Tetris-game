# tetris-game
This is my tetris game implementation using vanilla Javascript with an objective idea of how the tetris logic game works from a video so I can write the code by myself without empirically validating the behavior and functionality of the game by playing it over and over until I fully understand the logic behind it and its hidden rules such as 'shift rotate' or whatever even though it is my favorite game 9 years ago.

### Purpose of this mini-project
These are the main reasons for this simple game recreation project: to polish my refactoring skills, to simply recreate my childhood game, and identify my programming weaknesses to improved.

#### Notes for myself
* Pay more attention to details - Imagine debugging a simple error that can be approximately fixed at less than 5 seconds and it takes you 20 minutes just to find that there is a missing evil parentheses from the const function which is supposedly a factory function. This occured to me several times, atleast averagely of 3 times per coding projects which leads to "while (condition) { const frustration = Infinite" };
* Practice entering flow state - I recently discovered that there are certain days where I'm in a state of godlike coding where I somehow code efficiently/productively and actually knows what I'm doing without losing any motivation to stop moving forward until the goal for the day has been achieved. 
* Understand the project before code implementation
* Code efficiently by:
    *   Prioritizing the aspects of the project
    *   Finish the essential aspects of the code before moving on to the other problems



### Tetris Rules:
These are the following rules that are new to me:
- Added shifting rule when close to the wall while rotating.
- The "7 bag".
- Tetris Glossary: The proper term is 'tetrominos' instead of tetrominoes.
- Floor kick and right/wall kick

### TODOS
- [X] Create simple user interface
- [X] Implement a better score and leveling system
- [X] Implement Tetromino holder
- [X] Implement proper random tetromino generator (tetromino bag)
- [X] Display tetrominos preview (max of 4 pieces)
- [X] Display top 5 user high score
- [X] Display Game Over Screen
- [X] Reverse piece rotation
- [X] Add Hard Drop 

### BUGS to fix
- Current piece is slowly generated especially in early levels