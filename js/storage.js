export class Storage {
    // Loads the user's previous high score from localStorage.
    static loadHighScore() {
        // Initializes a variable to store the user's highest score.
        let currentHighScore;

        // Checks if localStorage has a value associated with the key 'highScore'
        if (localStorage.getItem('highScore') === null) {
            // If no value is found, sets currentHighScore equal to 0.
            currentHighScore = 0;
        } else {
            // Else, the currentHighScore variable is set equal to the value.
            currentHighScore = +localStorage.getItem('highScore');
        };

        // Returns the value of currentHighScore variable.
        return currentHighScore;
    };

    // Sets a user's high score.
    static setHighScore(currentScore) {
        // Initializes and sets a variable equal to the user's previous high score.
        let oldScore = this.loadHighScore();

        // Checks if the user's previous score is then what they just achieved, lower total time is better.
        if (oldScore > currentScore || oldScore === 0) {
            // If so, store the newly achieved high score in localStorage.
            localStorage.setItem('highScore', currentScore);
        };
    };

    static setUserList(arr) {
        localStorage.setItem('users', JSON.stringify(arr))
    }

    static getUserList() {
        let list;

        if (localStorage.getItem('users') === null) {
            list = [];
        } else {
            list = JSON.parse(localStorage.getItem('users'))
        };

        return list;
    };

    static addUser(userObj) {
        let list = this.getUserList();
            
        list.push(userObj)

        this.setUserList(list);
    }
};