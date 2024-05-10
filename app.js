class Timer {
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

    // Disables the powerup timer and sets the powerup booleans to false, showing that powerups are current deactivated. 
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

class RealTimeEvent {
    constructor() {
        // Initializes the variables for the enemy RTE
        this._enemyHealth = 0;
        this._enemyAlive;

        // Initializes the variables for the cookie trail RTE
        this._currentTrailCrumb = 0;
        this._cookieTrailComplete;

        // Initializes the variables for the cookie hunt RTE
        this._cookieHuntNum = 0;
        this._currentHuntCrumb = 0;
        this._cookieHuntActive;

        // Calls the function to load all the HTML elements related to the RTE events
        this._loadHTMLElements();
    };

    // Loads all HTML elements related to the RTE events
    _loadHTMLElements() {
        this._rteContainer = document.getElementById('rte-spawn');

        this._rteDisplay = document.getElementById('rte-display');
        this._rteEventDisplay = document.getElementById('current-rte');
        this._rteRemainingDisplay = document.getElementById('rte-remain');
    };

    // Reduces the enemy's "health" and checks if the enemy is defeated
    _enemyDamage() {
        // Reduces the enemy's health by one 
        this._enemyHealth -= 1;
        // Checks if the enemy's health is depleted
        // If it is below or at 0, it will call the function to clear the rte and halt updating the enemy's remaining health display.
        if (this._enemyHealth <= 0) {
            this.clearRTE();
            return;
        };

        // Updates the enemy's remaining health display if the enemy still has not been defeated yet.
        this._rteRemainingDisplay.innerText = this._enemyHealth;
    };

    // Sets the next cookie in the cookie trail to active or clickable for the user.
    _nextCookieTrailCrumb() {
        // Hides the previously active cookie in the cookie trail
        this._cookieTrailList[this._currentTrailCrumb].style.visibility = 'hidden';

        // Iterates the current cookie by one.
        this._currentTrailCrumb++;

        // Checks if the currentTrailCrumb value is still below 10,
        if (this._currentTrailCrumb < 10) {
            // If the value is still below 10,
            // Creates a new eventlistener on the next cookie in the cookie trail and calls the function to display the current info for the RTE.
            const crumbEvent = this._cookieTrailList[this._currentTrailCrumb].addEventListener('click', this._nextCookieTrailCrumb.bind(this), { once: true });
            this.displayRTE(true, 2);
        } else if (this._currentTrailCrumb === 10) {
            // If the value is equal to 10, calls the function to clear the RTE.
            this.clearRTE();
        };
    };

    // Sets the next cookie in the cookie hunt to visible and clickable for the user.
    _nextCookieHuntCrumb() {
        // Hides the previous cookie.
        this._cookieHuntList[this._currentHuntCrumb].style.visibility = 'hidden';

        // Iterates the current cookie by one.
        this._currentHuntCrumb++;

        // Checks if the currentHuntCrumb value is still below the total cookies in the cookie hunt.
        if (this._currentHuntCrumb < this._cookieHuntNum) {
            // If the value is below the total cookies in the cookie hunt,
            // Creates a new eventlistener on the next cookie in the cookie hunt.
            const crumbEvent = this._cookieHuntList[this._currentHuntCrumb].addEventListener('click', this._nextCookieHuntCrumb.bind(this), { once: true });
            // Sets the current cookie in the cookie hunt to visible.
            this._cookieHuntList[this._currentHuntCrumb].style.visibility = 'visible';
            // Calls the function to display the current info for the RTE
            this.displayRTE(true, 3);
        } else if (this._currentHuntCrumb === this._cookieHuntNum) {
            // If the value is equal to the total cookies in the cookie hunt, calls the function to clear the RTE.
            this.clearRTE();
        };
    };

    // Returns the value of the enemyAlive boolean.
    get enemyAlive() {
        return this._enemyAlive;
    };

    // Returns the value of the cookieTrailComplete boolean.
    get cookieTrailComplete() {
        return this._cookieTrailComplete;
    };

    // Returns the value of the cookieHuntComplete boolean.
    get cookieHuntComplete() {
        return this._cookieHuntActive;
    };

    // Creates the cookie hunt RTE
    summonCookieHunt() {
        // Initializes a new HTML div element.
        this._cookieHuntElement = document.createElement('div');

        // Randomly decides the number of cookies that will be in the cookie hunt.
        this._cookieHuntNum = Math.ceil(Math.random() * 5) + 5;

        // Loops through based on the amount of cookies being added to the cookie hunt.
        for (let i = 0; i < this._cookieHuntNum; i++) {
            // On each loop, appends a new <img> tag with the cookie-crumb-hunt class to the cookie hunt div element.
            this._cookieHuntElement.innerHTML += `<img src="./assets/Mini Cookie Asset.png" class="cookie-crumb-hunt"></img>`;
        };

        // Appends the div element to the RTE HTML element.
        this._rteContainer.appendChild(this._cookieHuntElement);

        // Selects all cookie hunt img HTML elements in a nodeList.
        this._cookieHuntList = document.querySelectorAll('.cookie-crumb-hunt');

        // Loops through based on the amount of cookies being added to the cookie hunt.
        for (let i = 0; i < this._cookieHuntNum; i++) {
            // Randomly decides the values for the top and left positioning of each cookie in the cookie hunt.
            let randomTop = Math.ceil(Math.random() * 55) + 20;
            let randomLeft = Math.ceil(Math.random() * 70) + 5;

            // Sets the top and left style of a cookie to the randomized values.
            this._cookieHuntList[i].style.top = `${randomTop}%`;
            this._cookieHuntList[i].style.left = `${randomLeft}%`;
        };

        // Sets the cookieHuntActive boolean to true.
        this._cookieHuntActive = true;

        // Creates a new eventlistener on the first cookie in the cookie hunt.
        const crumbEvent = this._cookieHuntList[0].addEventListener('click', this._nextCookieHuntCrumb.bind(this), { once: true });
        // Sets the first cookie in the cookie hunt to visible.
        this._cookieHuntList[0].style.visibility = 'visible';
        // Calls the function to display the current info for the RTE
        this.displayRTE(true, 3);
    };

    // Creates the cookie trail RTE
    summonCookieTrail() {
        // Initializes a new HTML div element.
        this._cookieTrailElement = document.createElement('div');

        // Loops through based on the amount of cookies being added to the cookie trail.
        for (let i = 0; i < 10; i++) {
            // On each loop, appends a new <img> tag with the cookie-crumb-trail class to the cookie trail div element.
            this._cookieTrailElement.innerHTML += `<img src="./assets/Mini Cookie Asset.png" class="cookie-crumb-trail"></img>`
        };
        // Appends the div element to the RTE HTML element.
        this._rteContainer.appendChild(this._cookieTrailElement);

        // Selects all cookie hunt img HTML elements in a nodeList.
        this._cookieTrailList = document.querySelectorAll('.cookie-crumb-trail');

        // Initializes a variables with the initial starting position from the left.
        let leftNum = 2;
        // Loops through based on the amount of cookies being added to the cookie trail.
        for (let i = 0; i < 10; i++) {
            // Randomly assigns a value for the positioning from the top.
            let randomTop = Math.ceil(Math.random() * 55) + 20

            // Sets the top and left positioning equal to the assigned values.
            this._cookieTrailList[i].style.top = `${randomTop}%`;
            this._cookieTrailList[i].style.left = `${leftNum}%`

            // Iterates the left positioning value by 10 each time.
            leftNum += 10;
        };

        // Sets the cookieTrailComplete variable to false.
        this._cookieTrailComplete = false;

        // Creates a new eventlistener on the first cookie in the cookie trail.
        const crumbEvent = this._cookieTrailList[0].addEventListener('click', this._nextCookieTrailCrumb.bind(this), { once: true });
        // Calls the function to display the current info for the RTE
        this.displayRTE(true, 2);
    };

    summonEnemy() {
        // Initializes a new HTML div element.
        this._enemyElement = document.createElement('div')
        // Appends a new <img> element to the enemy div
        this._enemyElement.innerHTML = `<img src="./assets/Monster Asset.png" id="enemy-entity"></img>`
        // Adds the 'enemy-rte' class to the enemy div element.
        this._enemyElement.classList.add('enemy-rte')
        // Appends the enemy div element to the RTE element.
        this._rteContainer.appendChild(this._enemyElement)

        // Randomizes a value and sets the enemy element's top positioning equal to it.
        let randomTop = Math.ceil(Math.random() * 55) + 10;
        this._enemyElement.style.top = `${randomTop}%`;

        // Randomizes a value and sets the enemy element's left positioning equal to it.
        let randomLeft = Math.ceil(Math.random() * 85);
        this._enemyElement.style.left = `${randomLeft}%`;

        // Creates an event listener for the enemy element,
        // Once it is clicked it will call the function that 'damages' the enemy and reduces its health.
        this._enemyElement.addEventListener('click', this._enemyDamage.bind(this))

        // Randomizes the enemy's health value.
        this._enemyHealth = Math.ceil(Math.random() * 25) + 10;

        // Sets the enemyAlive boolean to true
        this._enemyAlive = true;

        // Calls the function to display the current info for the RTE
        this.displayRTE(true, 1);
    };

    // Clears the any RTE
    clearRTE() {
        // Sets the container associated with the RTEs to an empty string.
        this._rteContainer.innerHTML = ``;

        // Sets the cookie trail RTE variables to 0 and true respectively.
        this._currentTrailCrumb = 0;
        this._cookieTrailComplete = true;

        // Sets the enemy RTE variables to 0 and false respectively.
        this._enemyHealth = 0;
        this._enemyAlive = false;

        // Sets the cookie hunt RTE variables to 0 and false.
        this._cookieHuntNum = 0;
        this._currentHuntCrumb = 0;
        this._cookieHuntActive = false;

        // Calls the function to display the current RTE, but passes in a parameter that instead disables it.
        this.displayRTE(false);
    };

    // Displays information about the currently active RTE or clears the currently active RTE from being displayed.
    // // Parameter one is a boolean that determines if the RTE will display or clear information, and two is the value that specifies which RTE to display.
    displayRTE(value, currentEvent) {
        // Checks if the passed in parameter is true
        if (value) {
            // If So, 
            // The RTE display element is made visible.
            this._rteDisplay.style.visibility = 'visible';

            // Calls a switch statement with second parameter of the function passed in,
            switch (currentEvent) {
                case 1: {
                    // If currentEvents is equal to one, sets the text of the HTML element to show the enemy's remaining health. 
                    this._rteEventDisplay.innerText = 'Enemy Health Remaining:'
                    this._rteRemainingDisplay.innerText = this._enemyHealth;
                    break;
                };
                case 2: {
                    // If currentEvents is equal to two, sets the text of the HTML element to show the cookie trail's remaining cookies. 
                    this._rteEventDisplay.innerText = 'Cookie Trail Crumbs Remaining:'
                    this._rteRemainingDisplay.innerText = 10 - this._currentTrailCrumb;
                    break;
                };
                case 3: {
                    // If currentEvents is equal to three, sets the text of the HTML element to show the cookie hunt's remaining cookies. 
                    this._rteEventDisplay.innerText = 'Cookie Hunt Crumbs Remaining:'
                    this._rteRemainingDisplay.innerText = this._cookieHuntNum - this._currentHuntCrumb;
                    break;
                };
            };
        } else {
            // If the passed in parameter is false, sets the RTE html element to hidden and sets the text within equal to an empty string.
            this._rteDisplay.style.visibility = 'hidden';
            this._rteEventDisplay.innerText = ``;
            this._rteRemainingDisplay.innerText = ``;
        };
    };
};

class CookieCrumb {
    constructor() {
        // Initializes the variables to monitor the total cookies and total clicks obtained by the user
        this._currentCookies = 0;
        this._totalClicks = 0;
    }

    // Returns the value of currentCookies
    get currentCookies() {
        return this._currentCookies;
    };

    // Returns the value of totalClicks
    get totalClicks() {
        return this._totalClicks;
    };

    // Increases the value of currentCookies by the number passed in each time it is called.
    // // The parameter is the value that currentCookies will be increased by.
    increaseCookies(value) {
        this._currentCookies += value;
    };

    // Increments the value of total by one each time it is called.
    increaseClicks() {
        this._totalClicks += 1;
    };

    // Increases the value of current cookies by a random amount.
    randomIncrease() {
        this._currentCookies += Math.ceil(Math.random() * 25);
    };

    // Decreases currentCookies by the value passed in.
    // // Parameter is the value that currentCookies will decrease by.
    powerUp(cost) {
        this._currentCookies -= cost;
    };

    // Sets the variables for currentCookies and totalClicks to 0.
    scoreReset() {
        this._currentCookies = 0
        this._totalClicks = 0;
    };
};

class Storage {
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
};

class Game {
    constructor() {
        // Initializes new objects for the game to utilize.
        this._cookie = new CookieCrumb();
        this._timer = new Timer();
        this._rte = new RealTimeEvent();

        // Initializes a variable to set the default click value increase to 1.
        this._cookieCrumbValue = 1;

        // Initializes a variable to store the total number of power ups activated during a play through.
        this._powerUpNum = 0;

        // Initializes booleans associated with power ups.
        this._holdEnabled = false;
        this._powerUpSuperClickActive = false;
        this._powerUpActive = false;

        // Initializes a variable that stores when a random event will occur, based on the user's total clicks.
        this._randomEventClicks = 0;

        // Initializes booleans associated with RTEs.
        this._eventActiveEnemy = false;
        this._eventActiveTrail = false;
        this._eventActiveHunt = false;

        // Loads all the main HTML elements for the game.
        this._loadHTMLElements();

        // Loads all the event listeners for the game
        this._loadDefaultEventListeners();

        // Displays the initializes cost of power ups
        this._powerUpDisplayPrice();

        // Loads the user's previous high score in the info display.
        this._loadHighScoreDisplay();
    };

    // Loads all necessary HTML elements for the game to utilize.
    _loadHTMLElements() {
        // Elements involved with the cookie crumb that will be clicked by the user.
        this._cookieCrumb = document.getElementById('cookie-crumb');
        this._brokenCookieCrumb = document.getElementById('broken-cookie');

        // Element involved with displaying information about the game.
        this._currentHighScoreDisplay = document.getElementById('highest-score');
        this._currentCookiesInfo = document.getElementById('current-cookies');
        this._totalClicksInfo = document.getElementById('total-clicks');

        // Elements involved with the power ups within the game.
        this._MainPowerUpDisplay = document.getElementById('powerup-display');
        this._currentPowerUpDisplay = document.getElementById('current-powerup');
        this._freezeTimePriceDisplay = document.getElementById('freeze-time-cost');
        this._boostValuePriceDisplay = document.getElementById('boost-value-cost');
        this._superClickPriceDisplay = document.getElementById('super-click-cost');
        this._boostValueBtn = document.getElementById('boost-value');
        this._superClickBtn = document.getElementById('super-click');
        this._freezeTimeBtn = document.getElementById('freeze-time');

        // Element involved with manually resetting the display.
        this._resetBtn = document.getElementById('reset');
    };

    // Loads the default event listeners for the game.
    _loadDefaultEventListeners() {
        // Event listeners associated with the power ups for the game.
        this._cookieCrumb.addEventListener('click', this._userClick.bind(this));
        this._boostValueBtn.addEventListener('click', this._powerUpPreCheck.bind(this, 'boost-value'));
        this._superClickBtn.addEventListener('click', this._powerUpPreCheck.bind(this, 'super-click'));
        this._freezeTimeBtn.addEventListener('click', this._powerUpPreCheck.bind(this, 'freeze-time'))

        // Event listener associated with manually resetting the game.
        this._resetBtn.addEventListener('click', this.resetGame.bind(this), { once: true });
    };

    // All methods below are related to the RTEs portion of the game.

    // Returns if any of the three RTEs are currently active.
    _eventActive() {
        return (this._eventActiveEnemy || this._eventActiveHunt || this._eventActiveTrail);
    };

    // Calculates when an RTE will occur
    _eventClickCalculator() {
        // Sets the randomEventClicks equal to a random amount
        // // This amount is based on the current value of the user's total clicks.
        this._randomEventClicks = Math.ceil(Math.random() * 50) + this._cookie.totalClicks + 30;
    };

    // Randomly activates one of the three potential RTEs.
    _activateEvent() {
        // Initializes a variable and assigns it a random value of 1, 2, or 3.
        let num = Math.ceil(Math.random() * 3);

        // Disables and resets any current user power ups.
        this._powerUpReset();

        // Sets the cookieCrumb to hidden from the user and sets the brokenCookieCrumb to visible.
        this._cookieCrumb.style.visibility = 'hidden';
        this._brokenCookieCrumb.style.visibility = 'visible';

        // Checks to see the value of num.
        switch (num) {
            case 1: {
                // If num = 1, summon the enemy RTE event and set the enemy RTE boolean to true.
                this._rte.summonEnemy();
                this._eventActiveEnemy = true;
                break;
            };
            case 2: {
                // If num = 2, summon the cookie trail RTE event and set the cookie trail RTE boolean to true.
                this._rte.summonCookieTrail();
                this._eventActiveTrail = true;
                break;
            };
            case 3: {
                // If num = 3, summon the cookie hunt RTE event and set the cookie hunt RTE boolean to true.
                this._rte.summonCookieHunt();
                this._eventActiveHunt = true;
                break;
            };
        };

        // Calls the function that checks when the current event is completed.
        this._eventCheck();
    };

    // Resets all variables and methods related to the game's RTEs.
    _eventReset() {
        // Calls the RTE object's function to clear the currently active RTE.
        this._rte.clearRTE();

        // Sets the main cookie crumb to visible and hides the broken cookie crumb from the user.
        this._cookieCrumb.style.visibility = 'visible';
        this._brokenCookieCrumb.style.visibility = 'hidden';

        // Sets all RTE active booleans to false.
        this._eventActiveEnemy = false;
        this._eventActiveTrail = false;
        this._eventActiveHunt = false;

        // Clears the event checking loop.
        clearInterval(this._eventCounter);
    };

    // Checks when the user finishes the currently active event and then clears it.
    _eventCheck() {
        // Creates a loop using setInterval that will run every 250 milliseconds
        this._eventCounter = setInterval(() => {
            // Checks if the enemy event is active and if the RTE enemy alive variable is false,
            // or checks if the cookie trail event is active and if the RTE cookieTrailComplete variable is true,
            // or checks if the cookie hunt event is active and if the RTE cookieHuntActive variable is false
            if ((this._eventActiveEnemy && this._rte.enemyAlive === false) || (this._eventActiveTrail && this._rte.cookieTrailComplete) || (this._eventActiveHunt && this._rte._cookieHuntActive === false)) {
                // If any of the three conditions are true.

                // Increases the user's current cookie amount by a random amount and updates the scoreboard to reflect the increase.
                this._cookie.randomIncrease();
                this._updateScoreBoard();

                // Recalculates the next occurrence of an RTE using the user's current total clicks.
                this._eventClickCalculator();

                // Calls the reset event function to clear and reset the current RTE.
                this._eventReset();
            };
        }, 250);
    };

    // All methods below are related to the power ups portion of the game.

    // Calculates the price of each power up.
    //  // Parameter is the initial cost of a powerup.
    _powerUpPriceCalculator(baseCost) {
        // Price is calculated based on the number of power ups purchased so far, each purchase adds an extra 75% cost to the base cost.
        return Math.ceil(((this._powerUpNum * .75) * baseCost) + baseCost);
    };

    // Displays the price of every power up
    _powerUpDisplayPrice() {
        // Calls the function to calculate the price of each powerup and sets the return value to the inner text of each powerup display element. 
        this._boostValuePriceDisplay.innerText = this._powerUpPriceCalculator(50);
        this._superClickPriceDisplay.innerText = this._powerUpPriceCalculator(30);
        this._freezeTimePriceDisplay.innerText = this._powerUpPriceCalculator(20);
    };

    // Displays the currently active power up
    // // Parameter is the string that contains the name of the currently active power up 
    _displayPowerUp(powerUp) {
        // Sets the power up display inner text to a string that shows the currently active power up
        this._currentPowerUpDisplay.innerText = `${powerUp} Currently Active`;
        // Makes the power up display element visible to the user.
        this._MainPowerUpDisplay.style.visibility = 'visible';
    };

    // Pre-checks if certain there are certain conditions met before activating a power up.
    // // Parameter is the power up the user wants to activate.
    _powerUpPreCheck(powerUp) {
        // Checks if there is a power up or event current active.
        if ((this._powerUpActive != true && this._eventActive() != true)) {
            // If no event or power up is currently active.

            // Initializes a variable that will store the power up's price.
            let powerUpPrice;

            // Checks which power up the user is attempting to activate.
            switch (powerUp) {
                case 'boost-value': {
                    // If the power up is the boost value powerup

                    // Set the powerup price to the value returned by the calculated price.
                    powerUpPrice = this._powerUpPriceCalculator(50);
                    break;
                };
                case 'super-click': {
                    // If the power up is the super click powerup

                    // Set the powerup price to the value returned by the calculated price.
                    powerUpPrice = this._powerUpPriceCalculator(30);
                    break;
                };
                case 'freeze-time': {
                    // If the power up is the freeze time powerup

                    // Set the powerup price to the value returned by the calculated price.
                    powerUpPrice = this._powerUpPriceCalculator(20);
                    break;
                };
            };

            // Checks if the user has the necessary cookies to pay for the price of the power up. 
            if (powerUpPrice <= this._cookie.currentCookies) {
                // If so, call the cookie function to remove the power up cost from the user's total cookies.
                this._cookie.powerUp(powerUpPrice);

                // Call the function to toggle the user's desired power up.
                this._powerUpToggle(powerUp);
            };
        };
    }

    // Toggles a specific power up.
    // // Parameter is the power up that is to be activated.
    _powerUpToggle(powerUp) {
        // Increments the total powerup purchased by one.
        this._powerUpNum += 1;

        // Checks the value of powerUp parameter.
        switch (powerUp) {
            case 'boost-value': {
                // If the power up to be activated is boost value.

                // Randomizes the amount of cookies collected on each click, either 2 or 3, and sets the cookieCrumbValue equal to this number.
                let boostValue = Math.ceil(Math.random() * 2) + 1;
                this._cookieCrumbValue = boostValue;

                // Calls the timer function to start timing for the power up.
                this._timer.startPowerUpTimer(10);

                // Calls the function to display the current power up.
                this._displayPowerUp('Boost Value');
                break;
            }
            case 'super-click': {
                // If the power up to be activated is super click.

                // Creates a event listener that will activate the super click power up upon the user's next click of the cookie crumb element.
                this._cookieCrumb.addEventListener('click', this._powerUpSuperClickToggle.bind(this, true), { once: true });

                // Calls the timer function to start timing for the power up.
                this._timer.startPowerUpTimer(15)

                // Calls the function to display the current power up.
                this._displayPowerUp('Super Click');
                break;
            }
            case 'freeze-time': {
                // If the power up to be activated is freeze time.

                // Calls the timer function to freeze the main timer and to activate and time the freeze time power up.
                this._timer.freezeTimeCounter(10)

                // Calls the function to display the current power up.
                this._displayPowerUp('Freeze Time');
                break;
            };
        };

        // Calls the power up display price to recalculate the new power up costs.
        this._powerUpDisplayPrice();

        // Sets the powerUpActive boolean to true.
        this._powerUpActive = true;

        // Calls the update score board function to show the user's new cookie crumb count
        this._updateScoreBoard();

        // Calls the function that checks when the current power up has timed out.
        this._powerUpCheck();
    };

    // Activates the super click power up.
    // // Parameter is a boolean that determines if the power up will be toggled on or off. 
    _powerUpSuperClickToggle(value) {
        // Checks if the passed in boolean is true or false.
        if (value) {
            // If the boolean is true.

            // Sets the holdEnabled boolean to true.
            this._holdEnabled = true;

            // Calls the function to trigger the super click power up feature.
            this._powerUpSuperClick();
        } else {
            // If the boolean is false

            // Sets the holdEnabled boolean to false.
            this._holdEnabled = false;
        };
    };

    // Activates the super click power up feature.
    _powerUpSuperClick() {
        // Checks if the holdEnabled boolean is true.
        if (this._holdEnabled) {
            // If the boolean is true.

            // Calls the function to increase the user's current cookies.
            this._cookie.increaseCookies(this._cookieCrumbValue);

            // Calls the function to update the scoreboard.
            this._updateScoreBoard();

            // Creates a timeout that will recursively call this function once 250 milliseconds has passed.
            setTimeout(() => { this._powerUpSuperClick() }, 250);
        };
    };

    // Resets all variables and methods related to the game's power ups.
    _powerUpReset() {
        // Sets the cookieCrumbValue variable back to 1.
        this._cookieCrumbValue = 1;

        // Triggers the super click power up off.
        this._powerUpSuperClickToggle(false);

        // Calls the timer object's function to clear any method and variables relating to power ups.
        this._timer.clearPowerUp();

        // Clears the power up checking loop.
        clearInterval(this._powerUpCounter);

        // Sets the powerUpActive boolean to false.
        this._powerUpActive = false;

        // Sets the power up display to hidden and sets its innerText to an empty string.
        this._MainPowerUpDisplay.style.visibility = 'hidden';
        this._currentPowerUpDisplay.innerText = ``;
    };

    // Checks when the currently active power up times out and then clears it.
    _powerUpCheck() {
        // Creates a loop using setInterval that will run every 1 second.
        this._powerUpCounter = setInterval(() => {
            // Checks if the powerUpActive boolean is true and if the timer's powerUpTimerActive boolean becomes false.
            if (this._powerUpActive && this._timer.powerUpTimerActive === false) {
                // If so the function to reset the power ups is called.
                this._powerUpReset();
            }
        }, 1000);
    };

    // All methods below are related to score and displaying information of the game.

    // Increments the user's cookies and total clicks and updates the scoreboard afterwards.
    _userClick() {
        // Calls the function that increase total clicks
        this._cookie.increaseClicks();
        // Calls the function that increase total clicks and passes in the current value from the cookieCrumbValue
        this._cookie.increaseCookies(this._cookieCrumbValue);

        // Calls the function that updates the scoreboard
        this._updateScoreBoard();
    };

    // Displays the User's previous high score.
    _loadHighScoreDisplay() {
        // Calls the function convertTime, found in the timer object, and converts the high score acquired from the Storage class into the high score display.
        this._currentHighScoreDisplay.innerText = this._timer.convertTime(Storage.loadHighScore());
    };

    // Updates the scoreboard display
    _updateScoreBoard() {
        // Sets the total clicks and total cookies display values
        this._currentCookiesInfo.innerText = this._cookie.currentCookies;
        this._totalClicksInfo.innerText = this._cookie.totalClicks;

        // Checks if the total amount of cookies is achieved, currently set to 250.
        if (this._cookie.currentCookies >= 250) {
            // If the amount of cookies is achieved, 
            // Call the storage object function to check if the user's acquired score is higher than their previous high score.
            Storage.setHighScore(this._timer.totalTime());
            // Calls the function to end the game.
            this.endGame();
        } else if (this._cookie.totalClicks === this._randomEventClicks && this._eventActive() != true) {
            // Checks if the amount of total clicks reaches the amount needed to activate an RTE, and checks that an RTE is currently not active.
            // If so, calls the function to activate the event.
            this._activateEvent();
        };
    };

    // All methods below are related to starting, resetting, and stopping the game.

    // Resets all features of the game to prepare for a new play through.
    _gameReset() {
        // Calls the timer function to stop the timer from timing.
        this._timer.timerStop();

        // Sets the powerUpNum back to zero and resets any currently active RTEs or power ups.
        this._powerUpNum = 0;
        this._powerUpReset();
        this._eventReset();

        // Calls the cookie object's function to reset the total clicks and current cookies.
        this._cookie.scoreReset();

        // Calls the function to recalculate the power ups cost, which will be the base cost.
        this._powerUpDisplayPrice();

        // Updates the scoreboard to reflect the reset values.
        this._updateScoreBoard();

        // Call the function to load the user's current high score from local storage.
        this._loadHighScoreDisplay();
    };

    // Ends the currently active game, only occurs upon the user reaching the necessary cookie amount.
    endGame() {
        // Calls the function to reset all of the game's methods and variables.
        this._gameReset();

        // Activates a confirmation modal informing the user they have won, and halts any further processes until the user confirms.
        confirm("You Win");

        // Calls the method to start the game.
        this.startGame();
    };

    // Halts the currently running game, only occurs when the user chooses to switch their name/account.
    haltGame() {
        // Calls the function to reset all of the game's methods and variables.
        this._gameReset();
    };

    // Quickly resets the currently running game, only occurs when the user clicks the reset button.
    resetGame() {
        // Calls the function to reset all of the game's methods and variables.
        this._gameReset();

        // Reinitialize the reset button's eventlistener after a second has passed.
        // // The reset buttons event listener can only be trigger once before needing to be reinitialized to prevent the user from calling this function multiple times.  
        setTimeout(() => {
            this._resetBtn.addEventListener('click', this.resetGame.bind(this, false), { once: true });
        }, 1000);

        // Calls the method to start the game.
        this.startGame();
    };

    // Begin the games main timer and calculates the needed total clicks for RTEs to activate.
    startGame() {
        // Begins the game's main timer to keep track of the user's potential completion time.
        this._timer.timerStart();

        // Calls the function to calculate when an RTE event will occur based on the user's total clicks.
        // // In this case, upon the game starting, the event will occur from 30-80 clicks.
        this._eventClickCalculator();
    };
};

class User {
    constructor() {
        this._game = new Game();

        this._userName;
        this._userScore;
        this._userHighestScore;

        this._loadHTMLElements();
        this._loadDefaultEventListeners()

        this._toggleUserNameMenu(false);
    }

    _loadHTMLElements() {
        this._userNameModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('username-dialog'));
        this._userNameDisplay = document.getElementById('username-display')

        this._userNameBtn = document.getElementById('username-set');
        this._userNameTextBox = document.getElementById('username-text')
    }

    _loadDefaultEventListeners() {
        this._userNameBtn.addEventListener('click', this._setUserName.bind(this))
        this._userNameDisplay.addEventListener('click', this._toggleUserNameMenu.bind(this))
    }

    _capitalizeName(value) {
        return value[0].toUpperCase() + value.slice(1, value.length)
    }

    _toggleUserNameMenu(value) {
        if (value) {
            let userResult = confirm("Warning! Changing your name will reset your current game\'s progress.")
            if (userResult) {
                this._game.haltGame();
                this._userNameModal.toggle();
            }
        } else {
            this._userNameModal.toggle();
        }
    }

    _setUserName() {
        let userName = this._userNameTextBox.value.toLowerCase()
        if (userName != '') {
            userName = this._capitalizeName(userName);
            this._userNameModal.toggle();
            this._displayUserName(userName);
            this._game.startGame();
        } else {
            confirm('Please Enter a Valid User Name');
        }
    }

    _displayUserName(value) {
        this._userNameDisplay.innerText = value;
    }
}

const newUser = new User();
