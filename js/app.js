// Imports the various classes from their respective modules
import * as timerModule from "./timer.js";
import * as rteModule from "./rte.js";
import * as cookiecrumbModule from "./cookiecrumb.js";
import * as storageModule from "./storage.js";

class Game {
    constructor() {
        // Initializes new objects for the game to utilize.
        this._cookie = new cookiecrumbModule.CookieCrumb();
        this._timer = new timerModule.Timer();
        this._rte = new rteModule.RealTimeEvent();

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
        this._currentHighScoreDisplay.innerText = this._timer.convertTime(storageModule.Storage.loadHighScore());
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
            storageModule.Storage.setHighScore(this._timer.totalTime());
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

        this._toggleUserSelectionMenu();
    }

    _loadHTMLElements() {
        this._userCreationModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('username-dialog'));
        this._userNameDisplay = document.getElementById('username-display')

        this._userNameBtn = document.getElementById('username-set');
        this._userNameTextBox = document.getElementById('username-text')


        this._userSelectionModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('user-selector-dialog'));
        this._createUserBtn = document.getElementById('create-new-user');
    }

    _loadDefaultEventListeners() {
        this._userNameBtn.addEventListener('click', this._setUserName.bind(this))
        this._userNameDisplay.addEventListener('click', this._toggleUserSelectionMenu.bind(this))

        this._createUserBtn.addEventListener('click', this._toggleUserCreationMenu.bind(this))
    }

    _capitalizeName(value) {
        return value[0].toUpperCase() + value.slice(1, value.length)
    }

    _toggleUserSelectionMenu(value) {
        if (value) {
            let userResult = confirm("Warning! Changing your user will reset your current game\'s progress.")
            if (userResult) {
                this._game.haltGame();
                this._userSelectionModal.show();
            }
        } else {
                this._userSelectionModal.show();
        }
    }

    _selectUser() {

    }

    _toggleUserCreationMenu(value) {
        this._userSelectionModal.hide();
        this._userNameTextBox.value = ``;
        this._userCreationModal.show();
    }

    _setUserName() {
        let userName = this._userNameTextBox.value.toLowerCase()
        if (userName != '') {
            userName = this._capitalizeName(userName);
            this._userSelectionModal.hide();
            this._userCreationModal.hide();
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
