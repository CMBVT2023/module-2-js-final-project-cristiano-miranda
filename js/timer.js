export class Timer {
    constructor() {
        // Initializes variables for the main timer and the powerup timer.
        this._gameStartTime;
        this._powerUpStartTime;
        this._frozenTime = 0;

        // Initializes two booleans that will be used to check if a powerup is active.
        this._powerUpTimerActive = false;
        this._freezeTime = false;

        // Function call that will load all HTML elements related to the timers.
        this._loadHTMLElements();
    };

    // Loads all HTML elements related to the timer.
    _loadHTMLElements() {
        this._timeElapsedDisplay = document.getElementById('time-elapsed');

        this._powerUpTimeDisplay = document.getElementById('powerup-time');
    };

    // Updates the timer element with the current game time elapsed 
    _displayElapsedTime() {
        // If the freeze time powerup is active, then this timer will not update until said powerup gets disabled
        if (this._freezeTime != true) {
            this._timeElapsedDisplay.innerText = `${this.convertTime(this.totalTime())}`;
        };
    };

    // Updates the powerup timer with the remaining time for the currently active powerup.
    // // The parameter signifies how long the powerup should last.
    _powerUpElapsedTime(time) {
        // Updates the powerup time remaining
        this._powerUpTimeDisplay.innerText = `${time - this.powerUpCurrentTime()}`;

        // Checks if the powerup has reached the time limit passed in as a parameter,
        // if so then call the function to stop the powerup timer.
        if (this.powerUpCurrentTime() >= time) {
            this.stopPowerUpTimer();
        };
    };

    // Clears the timer display resetting its display back to 0
    clearTimerDisplay() {
        this._timeElapsedDisplay.innerText = `00:00`;
    };

    // Returns the value for the powerUpTimerActive boolean.
    get powerUpTimerActive() {
        return this._powerUpTimerActive;
    };

    // Returns the total elapsed game time, the amount of time from the games start subtracted by the amount of time the freeze ability was active,
    // this value is returned in seconds. 
    totalTime() {
        return Math.floor((Date.now() - this._gameStartTime) / 1000) - this._frozenTime;
    };

    // Sets the current time when the functions is called to the powerup timer's start time,
    // and sets the powerUpTimerActive variable to true
    powerUpSetTime() {
        this._powerUpStartTime = Date.now();
        this._powerUpTimerActive = true;
    };

    // Returns the amount of elapsed time has pasted since a powerup has activated in seconds
    powerUpCurrentTime() {
        return Math.floor((Date.now() - this._powerUpStartTime) / 1000);
    };

    // Disables the powerup timer and sets the sets the powerUpTimerActive variable to false
    stopPowerUpTimer() {
        clearInterval(this._powerUpCounter);
        this._powerUpTimerActive = false;
    };

    // Calls the function to sets the powerup's starting time,
    // displays the amount of time the powerup will last through the parameter passed in,
    // and Creates the loop using setInterval that will update the display every second with the powerup's remaining time.
    // // The parameter signifies how long the powerup should last.
    startPowerUpTimer(time) {
        this.powerUpSetTime();
        this._powerUpTimeDisplay.innerText = `${time}`
        this._powerUpCounter = setInterval(this._powerUpElapsedTime.bind(this, time), 1000);
    };

    // Activates the freeze time powerup.
    // // The parameter signifies how long the powerup should last.
    freezeTimeCounter(time) {
        // Calls the function to set the powerup's starting time.
        this.powerUpSetTime();

        // Sets freeze time to true, to signify that the freeze time powerup is specifically activated
        this._freezeTime = true;

        // Displays the amount of time the powerup will last through the parameter passed in
        this._powerUpTimeDisplay.innerText = `${time}`;

        // Creates a loop that will iterate every second.
        this._powerUpCounter = setInterval(() => {
            // Adds 1 second to the total amount of time frozen during the game
            this._frozenTime += 1;
            // Calls the function to display the amount of time remaining for this powerup.
            this._powerUpElapsedTime(time);

            // Checks if the current powerup's elapsed time has reached its allotted time, which is the parameter passed in.
            // If so, set the freeze time to false to signify that the time freeze powerup is deactivated.
            if (this.powerUpCurrentTime() >= time) {
                this._freezeTime = false;
            };
        }, 1000);
    };

    // Disables the powerup timer and sets the powerup booleans to false, showing that power ups are current deactivated. 
    clearPowerUp() {
        // Disables the 1 second powerup counter loop
        clearInterval(this._powerUpCounter);

        // Sets the powerup booleans to false
        this._powerUpTimerActive = false;
        this._freezeTime = false;
    };

    // Disables the game's main timer
    timerStop() {
        // Disables the 1 second timer counter loop.
        clearInterval(this._timerCounter);
        // Calls the function to reset the display.
        this.clearTimerDisplay();
    };

    // Enables the game's main timer
    timerStart() {
        // Resets all values for the timer.
        this._timerReset();
        // Creates the 1 second timer counter loop.
        this._timerCounter = setInterval(this._displayElapsedTime.bind(this), 1000);
    };

    // Resets the variables needed for the game's main timer
    _timerReset() {
        // Sets the game's start time to the current time
        this._gameStartTime = Date.now();
        // Resets the total allotted frozen time to 0.
        this._frozenTime = 0;
        // Resets the timer's display
        this.clearTimerDisplay();
    };

    // Converts the amount of seconds passed in to minutes and returns the newly calculated time in a stopwatch time format, 00:00.
    // // The parameter passed in is the amount of seconds to be converted.
    convertTime(time) {
        // Initializes a seconds and minutes variable, seconds is calculated using Modulus and minutes is calculated using division and taking the rounded down whole number using Math.floor(). 
        let seconds = time % 60;
        let minutes = Math.floor(time / 60);

        // Initializes variables that will store the final seconds and minutes after they are formatted
        let secondsDisplay;
        let minutesDisplay;

        // Checks if minutes is greater than ten,
        // If so, set the minutesDisplay variable equal to minutes
        // Else, it will append a 0 to the front of minutes and then set to the minutesDisplay variable.
        if (minutes >= 10) {
            minutesDisplay = `${minutes}`
        } else {
            minutesDisplay = `0${minutes}`;
        };

        // Checks if seconds is greater than ten,
        // If so, set the secondsDisplay variable equal to seconds
        // Else, it will append a 0 to the front of seconds and then set to the secondsDisplay variable.
        if (seconds >= 10) {
            secondsDisplay = `${seconds}`
        } else {
            secondsDisplay = `0${seconds}`;
        };

        // Returns the minutes in the proper time display format.
        return `${minutesDisplay}:${secondsDisplay}`
    };
};