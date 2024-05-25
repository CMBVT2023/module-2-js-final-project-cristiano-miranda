// Imports the various classes from their respective modules
import * as timerModule from "./timer.js";
import * as rteModule from "./rte.js";
import * as cookiecrumbModule from "./cookiecrumb.js";
import * as storageModule from "./storage.js";

// TODO:
// Add comments to the various methods and properties to explain my logic

class PlayThrough {
  constructor(ui) {
    // Initializes new objects for the game to utilize.
    this._cookie = new cookiecrumbModule.CookieCrumb();
    this._timer = new timerModule.Timer(this);
    this._rte = new rteModule.RealTimeEvent(this);

    // Initializes a variable to set the default click value increase to 1.
    this._cookieCrumbValue = 1;

    // Initializes a variable to store the total number of power ups activated during a play through.
    this._powerUpNum = 0;

    // Initializes booleans associated with power ups.
    this._holdEnabled = false;
    this._powerUpSuperClickActive = false;

    // Initializes a variable that stores when a random event will occur, based on the user's total clicks.
    this._randomEventClicks = 0;

    // Loads all the main HTML elements for the game.
    this._loadHTMLElements();

    // Loads all the event listeners for the game
    this._loadDefaultEventListeners();

    // Displays the initializes cost of power ups
    this._powerUpDisplayPrice();

    this._gameUI = ui;
  }

  // Loads all necessary HTML elements for the game to utilize.
  _loadHTMLElements() {
    // Elements involved with the cookie crumb that will be clicked by the user.
    this._cookieCrumb = document.getElementById("cookie-crumb");
    this._brokenCookieCrumb = document.getElementById("broken-cookie");

    // Element involved with displaying information about the game.
    this._currentCookiesInfo = document.getElementById("current-cookies");
    this._totalClicksInfo = document.getElementById("total-clicks");

    // Elements involved with the power ups within the game.
    this._MainPowerUpDisplay = document.getElementById("powerup-display");
    this._currentPowerUpDisplay = document.getElementById("current-powerup");
    this._freezeTimePriceDisplay = document.getElementById("freeze-time-cost");
    this._boostValuePriceDisplay = document.getElementById("boost-value-cost");
    this._superClickPriceDisplay = document.getElementById("super-click-cost");
    this._boostValueBtn = document.getElementById("boost-value");
    this._superClickBtn = document.getElementById("super-click");
    this._freezeTimeBtn = document.getElementById("freeze-time");
  }

  // Loads the default event listeners for the game.
  _loadDefaultEventListeners() {
    // Event listeners associated with the power ups for the game.
    this._cookieCrumb.addEventListener("click", this._userClick.bind(this));
    this._boostValueBtn.addEventListener(
      "click",
      this._powerUpPreCheck.bind(this, "boost-value")
    );
    this._superClickBtn.addEventListener(
      "click",
      this._powerUpPreCheck.bind(this, "super-click")
    );
    this._freezeTimeBtn.addEventListener(
      "click",
      this._powerUpPreCheck.bind(this, "freeze-time")
    );
  }

  // All methods below are related to the RTEs portion of the game.

  // Returns if any of the three RTEs are currently active.
  _eventActive() {
    return (
      this._rte.enemyAlive ||
      this._rte.cookieTrailActive ||
      this._rte.cookieHuntActive
    );
  }

  // Calculates when an RTE will occur
  _eventClickCalculator() {
    // Sets the randomEventClicks equal to a random amount
    // // This amount is based on the current value of the user's total clicks.
    this._randomEventClicks =
      Math.ceil(Math.random() * 50) + this._cookie.totalClicks + 30;
  }

  // Randomly activates one of the three potential RTEs.
  _activateEvent() {
    // Initializes a variable and assigns it a random value of 1, 2, or 3.
    let num = Math.ceil(Math.random() * 3);

    // Disables and resets any current user power ups.
    this.powerUpReset();

    // Sets the cookieCrumb to hidden from the user and sets the brokenCookieCrumb to visible.
    this._cookieCrumb.style.visibility = "hidden";
    this._brokenCookieCrumb.style.visibility = "visible";

    // Checks to see the value of num.
    switch (num) {
      case 1: {
        // If num = 1, summon the enemy RTE event and set the enemy RTE boolean to true.
        this._rte.summonEnemy();
        break;
      }
      case 2: {
        // If num = 2, summon the cookie trail RTE event and set the cookie trail RTE boolean to true.
        this._rte.summonCookieTrail();
        break;
      }
      case 3: {
        // If num = 3, summon the cookie hunt RTE event and set the cookie hunt RTE boolean to true.
        this._rte.summonCookieHunt();
        break;
      }
    }
  }

  // Used to manually clear the currently active RTE event and redisplay the main cookie element.
  _eventManualReset() {
    // Calls the clearRTE method to clear the currently active event
    this._rte.clearRTE(true);

    // Sets the main cookie crumb to visible and hides the broken cookie crumb from the user.
    this._cookieCrumb.style.visibility = "visible";
    this._brokenCookieCrumb.style.visibility = "hidden";
  }

  // Provide a cookie crumb bonus once the user finishes the currently active event, recalculates the necessary clicks to trigger the next event,
  // and displays the main cookie crumb again.
  eventComplete() {
    // Recalculates the next occurrence of an RTE using the user's current total clicks.
    this._eventClickCalculator();

    // Increases the user's current cookie amount by a random amount and updates the scoreboard to reflect the increase.
    this._cookie.randomIncrease();
    this._updateScoreBoard();

    // Sets the main cookie crumb to visible and hides the broken cookie crumb from the user.
    this._cookieCrumb.style.visibility = "visible";
    this._brokenCookieCrumb.style.visibility = "hidden";
  }

  // All methods below are related to the power ups portion of the game.

  // Calculates the price of each power up.
  //  // Parameter is the initial cost of a powerup.
  _powerUpPriceCalculator(baseCost) {
    // Price is calculated based on the number of power ups purchased so far, each purchase adds an extra 75% cost to the base cost.
    return Math.ceil(this._powerUpNum * 0.75 * baseCost + baseCost);
  }

  // Displays the price of every power up
  _powerUpDisplayPrice() {
    // Calls the function to calculate the price of each powerup and sets the return value to the inner text of each powerup display element.
    this._boostValuePriceDisplay.innerText = this._powerUpPriceCalculator(50);
    this._superClickPriceDisplay.innerText = this._powerUpPriceCalculator(30);
    this._freezeTimePriceDisplay.innerText = this._powerUpPriceCalculator(20);
  }

  // Displays the currently active power up
  // // Parameter is the string that contains the name of the currently active power up
  _displayPowerUp(powerUp) {
    // Sets the power up display inner text to a string that shows the currently active power up
    this._currentPowerUpDisplay.innerText = `${powerUp} Currently Active`;
    // Makes the power up display element visible to the user.
    this._MainPowerUpDisplay.style.visibility = "visible";
  }

  // Pre-checks if certain there are certain conditions met before activating a power up.
  // // Parameter is the power up the user wants to activate.
  _powerUpPreCheck(powerUp) {
    // Checks if there is a power up or event current active.
    if (this._timer.powerUpTimerActive != true && this._eventActive() != true) {
      // If no event or power up is currently active.

      // Initializes a variable that will store the power up's price.
      let powerUpPrice;

      // Checks which power up the user is attempting to activate.
      switch (powerUp) {
        case "boost-value": {
          // If the power up is the boost value powerup

          // Set the powerup price to the value returned by the calculated price.
          powerUpPrice = this._powerUpPriceCalculator(50);
          break;
        }
        case "super-click": {
          // If the power up is the super click powerup

          // Set the powerup price to the value returned by the calculated price.
          powerUpPrice = this._powerUpPriceCalculator(30);
          break;
        }
        case "freeze-time": {
          // If the power up is the freeze time powerup

          // Set the powerup price to the value returned by the calculated price.
          powerUpPrice = this._powerUpPriceCalculator(20);
          break;
        }
      }

      // Checks if the user has the necessary cookies to pay for the price of the power up.
      if (powerUpPrice <= this._cookie.currentCookies) {
        // If so, call the cookie function to remove the power up cost from the user's total cookies.
        this._cookie.powerUp(powerUpPrice);

        // Call the function to toggle the user's desired power up.
        this._powerUpToggle(powerUp);
      }
    }
  }

  // Toggles a specific power up.
  // // Parameter is the power up that is to be activated.
  _powerUpToggle(powerUp) {
    // Increments the total powerup purchased by one.
    this._powerUpNum += 1;

    // Checks the value of powerUp parameter.
    switch (powerUp) {
      case "boost-value": {
        // If the power up to be activated is boost value.

        // Randomizes the amount of cookies collected on each click, either 2 or 3, and sets the cookieCrumbValue equal to this number.
        let boostValue = Math.ceil(Math.random() * 2) + 1;
        this._cookieCrumbValue = boostValue;

        // Calls the timer function to start timing for the power up.
        this._timer.startPowerUpTimer(10);

        // Calls the function to display the current power up.
        this._displayPowerUp("Boost Value");
        break;
      }
      case "super-click": {
        // If the power up to be activated is super click.

        // Creates a event listener that will activate the super click power up upon the user's next click of the cookie crumb element.
        this._cookieCrumb.addEventListener(
          "click",
          this._powerUpSuperClickToggle.bind(this, true),
          { once: true }
        );

        // Calls the timer function to start timing for the power up.
        this._timer.startPowerUpTimer(15);

        // Calls the function to display the current power up.
        this._displayPowerUp("Super Click");
        break;
      }
      case "freeze-time": {
        // If the power up to be activated is freeze time.

        // Calls the timer function to freeze the main timer and to activate and time the freeze time power up.
        this._timer.freezeTimeCounter(10);

        // Calls the function to display the current power up.
        this._displayPowerUp("Freeze Time");
        break;
      }
    }

    // Calls the power up display price to recalculate the new power up costs.
    this._powerUpDisplayPrice();

    // Calls the update score board function to show the user's new cookie crumb count
    this._updateScoreBoard();
  }

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
    }
  }

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
      setTimeout(() => {
        this._powerUpSuperClick();
      }, 250);
    }
  }

  // Resets all variables and methods related to the game's power ups.
  powerUpReset() {
    // Sets the cookieCrumbValue variable back to 1.
    this._cookieCrumbValue = 1;

    // Triggers the super click power up off.
    this._powerUpSuperClickToggle(false);

    // Calls the timer object's function to clear any method and variables relating to power ups.
    this._timer.clearPowerUp();

    // Sets the power up display to hidden and sets its innerText to an empty string.
    this._MainPowerUpDisplay.style.visibility = "hidden";
    this._currentPowerUpDisplay.innerText = ``;
  }

  // All methods below are related to score and displaying information of the game.

  // Increments the user's cookies and total clicks and updates the scoreboard afterwards.
  _userClick() {
    // Calls the function that increase total clicks
    this._cookie.increaseClicks();
    // Calls the function that increase total clicks and passes in the current value from the cookieCrumbValue
    this._cookie.increaseCookies(this._cookieCrumbValue);

    // Calls the function that updates the scoreboard
    this._updateScoreBoard();
  }

  // Updates the scoreboard display
  _updateScoreBoard() {
    // Sets the total clicks and total cookies display values
    this._currentCookiesInfo.innerText = this._cookie.currentCookies;
    this._totalClicksInfo.innerText = this._cookie.totalClicks;

    // Checks if the total amount of cookies is achieved, currently set to 250.
    // Setting to only 20 cookies to win for testing purposes
    if (this._cookie.currentCookies >= 250) {
      // If the amount of cookies is achieved,

      // Calls the function to end the game.
      this.endGame();
    } else if (
      this._cookie.totalClicks === this._randomEventClicks &&
      this._eventActive() != true
    ) {
      // Checks if the amount of total clicks reaches the amount needed to activate an RTE, and checks that an RTE is currently not active.
      // If so, calls the function to activate the event.
      this._activateEvent();
    }
  }

  // All methods below are related to starting, resetting, and stopping the game.

  // Resets all features of the game to prepare for a new play through.
  _gameReset() {
    // Calls the timer function to stop the timer from timing.
    this._timer.timerStop();

    // Sets the powerUpNum back to zero and resets any currently active RTEs or power ups.
    this._powerUpNum = 0;
    this.powerUpReset();
    this._eventManualReset();

    // Calls the cookie object's function to reset the total clicks and current cookies.
    this._cookie.scoreReset();

    // Calls the function to recalculate the power ups cost, which will be the base cost.
    this._powerUpDisplayPrice();

    // Updates the scoreboard to reflect the reset values.
    this._updateScoreBoard();
  }

  // Ends the currently active game, only occurs upon the user reaching the necessary cookie amount.
  endGame() {
    // Calls the function to reset all of the game's methods and variables.
    this._gameReset();

    // Calls the gameOver function to signal the Game UI Class to show the endScreenModal
    // and passes the user's run time through to the Game UI class
    this._gameUI.gameOver(this._timer.totalTime());
  }

  // Halts the currently running game, occurs when the user chooses to switch their name/account or hit the reset button.
  haltGame() {
    // Calls the function to reset all of the game's methods and variables.
    this._gameReset();
  }

  // Begin the games main timer and calculates the needed total clicks for RTEs to activate.
  startGame() {
    // Begins the game's main timer to keep track of the user's potential completion time.
    this._timer.timerStart();

    // Calls the function to calculate when an RTE event will occur based on the user's total clicks.
    // // In this case, upon the game starting, the event will occur from 30-80 clicks.
    this._eventClickCalculator();
  }
}

// Initializes a new user object to allow a user's to retain their previous runs and user name in localStorage.
function User(name) {
  this.userName = name;
  this.highestScore = 0;
  this.pastScores = [];
}

class GameUI {
  constructor() {
    // Initializes variables for creating the user.
    this._currentUser;
    this._currentUserIndex;
    this._newUser = false;

    // Calls the methods to load all the html elements and default event listeners.
    this._loadHTMLElements();
    this._loadDefaultEventListeners();

    // Calls the method for the user selection modal.
    this._toggleUserSelectionMenu(false);

    // Loads a new PlayThrough object and passes the GamUI object through to it.
    this._mainGame = new PlayThrough(this);
  }

  _loadHTMLElements() {
    // Loads all elements associated with the user selection modal.
    this._userSelectionModal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("user-selector-dialog")
    );
    this._createUserBtn = document.getElementById("create-new-user");
    this._userListGroup = document.getElementById("user-list");
    this._userSelectBtn = document.getElementById("user-select");
    this._userDeleteBtn = document.getElementById("user-remove");

    // Loads the start container element.
    this._startingContainer = document.getElementById("click-to-start");

    // Loads the current high score display element.
    this._currentHighScoreDisplay = document.getElementById("highest-score");

    // Loads all elements associated with the user creation modal.
    this._userCreationModal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("username-dialog")
    );
    this._userNameDisplay = document.getElementById("username-display");
    this._userNameBtn = document.getElementById("username-set");
    this._userNameTextBox = document.getElementById("username-text");
    this._userCreationReturnButton = document.getElementById("go-back");

    // Element involved with manually resetting the game.
    this._resetBtn = document.getElementById("reset");

    // Loads all elements associated with the endScreenModal.
    this._endScreenModal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("end-screen-dialog")
    );
    this._endScreenMainText = document.getElementById("end-screen-text");
    this._endScreenFinalScore = document.getElementById(
      "end-screen-final-score"
    );
    this._endScreenPreviousScoresDisplay = document.getElementById(
      "end-screen-previous-scores"
    );
    this._endScreenHighScoreText = document.getElementById(
      "previous-highscore-text"
    );
    this._endScreenUserScore = document.getElementById("game-score");
    this._endScreenPlayAgainBtn = document.getElementById("play-again");
    this._endScreenChangeUserBtn = document.getElementById("change-user");
  }

  _loadDefaultEventListeners() {
    // Event listeners associated with the user selection menu.
    this._createUserBtn.addEventListener(
      "click",
      this._toggleUserCreationMenu.bind(this)
    );
    this._userSelectBtn.addEventListener(
      "click",
      this._findSelectedUser.bind(this)
    );
    this._userDeleteBtn.addEventListener(
      "click",
      this._deleteSelectedUser.bind(this)
    );

    // Event listeners associated with the user creation menu.
    this._userNameBtn.addEventListener("click", this._createNewUser.bind(this));
    this._userNameDisplay.addEventListener(
      "click",
      this._toggleUserSelectionMenu.bind(this)
    );
    this._userCreationReturnButton.addEventListener(
      "click",
      this._toggleUserSelectionMenu.bind(this, false)
    );

    // Event listener associated with manually resetting the game.
    this._resetBtn.addEventListener("click", this._restartGame.bind(this), {
      once: true,
    });
  }

  // Resets the game and reinitialize the reset button.
  _restartGame() {
    // Calls the function to halt the game from within the PlayThrough object.
    this._mainGame.haltGame();

    // After a second, reinitialize the reset button.
    setTimeout(() => {
      this._resetBtn.addEventListener(
        "click",
        this._restartGame.bind(this, false),
        { once: true }
      );
    }, 1000);

    // Loads and starts the main game.
    this._loadPlayThrough();
  }

  // Capitalizes the first character of any string passed in.
  // // The parameter passed in is a string that will be capitalized.
  _capitalizeName(value) {
    return value[0].toUpperCase() + value.slice(1, value.length);
  }

  // Displays all of the users in the stored within localStorage in the userSelectionModal.
  _displayUsers() {
    // Pulls the user array from localStorage.
    let userList = storageModule.Storage.getUserList();

    // Clears the users list group.
    this._userListGroup.innerHTML = ``;

    // Checks if the user array is empty or populated.
    if (userList.length !== 0) {
      // If the array is populated, display the user list element.
      this._userListGroup.style.display = "block";
      this._userSelectBtn.style.display = "block";
      this._userDeleteBtn.style.display = "block";

      // Loops through and display all users within the user array.
      for (let i in userList) {
        this._userListGroup.innerHTML += `<label class="list-group-item fw-bold bg-transparent bg-gradient user-list-item"><input type="radio" name="user"> ${userList[i].userName}</label>`;
      }
    } else {
      // If the array is not populated, hide all the user list elements.
      this._userSelectBtn.style.display = "none";
      this._userDeleteBtn.style.display = "none";
      this._userListGroup.style.display = "none";
    }
  }

  // Deletes the selected user from the localStorage.
  _deleteSelectedUser() {
    // Initializes all of the radio buttons in a radios variable.
    let radios = this._userListGroup.querySelectorAll("input");

    // Loops through all of the radio buttons.
    for (let i = 0; i < radios.length; i++) {
      // Checks if the radio button is checked.
      if (radios[i].checked) {
        // If so, the current user index is set to the loops iteration value.
        this._currentUserIndex = i;
        // Calls the method to remove the user from the user array at the specified index.
        storageModule.Storage.removeUser(this._currentUserIndex);
        // Calls the method to redisplay the users array.
        this._displayUsers();
        // Returns and stops the loop.
        return;
      }
    }
  }

  // Finds the selected user from the user selection list and sets them as the active user.
  _findSelectedUser() {
    // Initializes all of the radio buttons in a radios variable.
    let radios = this._userListGroup.querySelectorAll("input");

    // Loops through all of the radio buttons.
    for (let i = 0; i < radios.length; i++) {
      // Checks if the radio button is checked.
      if (radios[i].checked) {
        // If so, the current user index is set to the loops iteration value.
        this._currentUserIndex = i;
        // Sets the current active user to the user at the specified index.
        this._setActiveUser(false);
        // Returns and stops the loop.
        return;
      }
    }

    // If no user is selected, then popup a confirm modal to alert the user.
    confirm("Please select a user.");
  }

  // Sets the currently active user.
  // // The parameter is a boolean value that determines if the user is a new user or a already existing user.
  _setActiveUser(value) {
    // Pulls the user array from localStorage.
    let userList = storageModule.Storage.getUserList();

    // Checks if the passed in boolean is true or false, true being it is a new user and false being a already existing user.
    if (value) {
      // If true, the user was a new user and just appended to the end of the array.
      // Sets the current user index value to the last element on the array.
      this._currentUserIndex = userList.length - 1;
      
      // Sets the current user to the user at the end of the array.
      this._currentUser = userList[this._currentUserIndex];
    } else {
      // If false, the user is already an existing user.
      // Resets the current user to the same user from the array.
      this._currentUser = userList[this._currentUserIndex];
      
      // Loads the user's highscore, true is passed in to signify that the user has a previous highscore.
      this._loadHighScore(true);

      // Calls the function to load the main game.
      this._loadPlayThrough();
    }
  }

  // Loads the user's previous highscore, or if they are a new user, loads a default value.
  // // The parameter is a boolean that signifies if the user is a new user or an already existing user.
  _loadHighScore(value) {
    // Checks the value of the boolean passed in.
    if (value) {
      // If it is true, then the user is an already existing user.
      
      // Loads the user's previous highscore into the highscore display.
      this._currentHighScoreDisplay.innerHTML =
        this._mainGame._timer.convertTime(this._currentUser.highestScore);
    } else {
      // If it is false, then it is a new user.

      // Loads a default value into the highscore display.
      this._currentHighScoreDisplay.innerHTML = `00:00`;
    }
  }

  // Begins the main game.
  _beginPlayThrough() {
    // Sets the starting container to hidden and removes the "click to start" child element from the container.
    this._startingContainer.style.visibility = "hidden";
    this._startingContainer.lastChild.remove();

    // Calls the function to start the main game from within the PlayThrough object.
    this._mainGame.startGame();
  }

  // Loads the elements necessary to begin the game.
  _loadPlayThrough() {
    // Sets the starting container to visible and appends a new child element to the container that contains "click to start".
    this._startingContainer.style.visibility = "visible";
    this._startingContainer.innerHTML = `<h1>Click To Start</h1>`;

    // Adds an event listener to the "click to start" text that will call the game start method.
    this._startingContainer.lastChild.addEventListener(
      "click",
      this._beginPlayThrough.bind(this),
      { once: true }
    );

    // Displays the current user's username in the username display.
    this._displayUserName(this._currentUser.userName);

    // Hides all modals from the screen.
    this._userSelectionModal.hide();
    this._userCreationModal.hide();
    this._endScreenModal.hide();
  }

  // Clears the current user variables.
  _clearCurrentUser() {
    this._currentUser = null;
    this._currentUserIndex = null;
    this._newUser = false;
  }

  // Toggles the selectionModal and displays all of the users from localStorage.
  // // The parameter passed in is a boolean that signifies if the command is called from the page loading or if it is called from the end game method.
  _toggleUserSelectionMenu(value) {
    // Clears the currently selected users.
    this._clearCurrentUser();

    // Hides the userCreationModal and the endScreenModal.
    this._userCreationModal.hide();
    this._endScreenModal.hide();

    // Loads the default highscore display value via the highscore display method.
    this._loadHighScore(false);

    // Checks the value of the passed in boolean.
    if (value) {
      // If the value is true, which means the method was called from the end game method.

      // Popup a confirm modal to check if the user wants to end the game.
      let userResult = confirm(
        "Warning! Changing your user will reset your current game's progress."
      );
      // Checks the result of the confirm modal.
      if (userResult) {
        // If the user confirms,

        // Calls the function to halt the game from within the PlayThrough object.
        this._mainGame.haltGame();

        // Calls the function to display all of the users from the users array.
        this._displayUsers();

        // Displays the userSelectionModal.
        this._userSelectionModal.show();
      }
    } else {
      // If the value is false, then the method was called on page load.
      
      // Calls the function to display all of the users from the users array.
      this._displayUsers();

      // Displays the userSelectionModal.
      this._userSelectionModal.show();
    }
  }

  // Toggles the userCreationModal and clears all values from within the inputs.
  _toggleUserCreationMenu() {
    // Hides the userSelectionModal.
    this._userSelectionModal.hide();

    // Clears any value from the userNameTextBox.
    this._userNameTextBox.value = ``;

    // Displays the userCreationModal.
    this._userCreationModal.show();
  }

  // Checks if a username is already taken or occupied by another user.
  // // The parameter passed in is the username that will be checked.
  _checkName(name) {
    // Pulls the user array from localStorage.
    let userList = storageModule.Storage.getUserList();

    // Loops through the user array.
    for (let i = 0; i < userList.length; i++) {
      // Checks if the user at the current index has a matching name to the username passed in.
      if (userList[i].userName === name) {
        // If so, return false.
        return false;
      }
    }

    return true;
  }

  _createNewUser() {
    let userName = this._userNameTextBox.value.toLowerCase();
    userName = this._capitalizeName(userName);
    if (userName != "") {
      if (this._checkName(userName)) {
        this._currentUser = new User(userName);
        this._newUser = true;
        this._loadPlayThrough();
      } else {
        confirm("User name already taken.");
      }
    } else {
      confirm("Please Enter a Valid User Name");
    }
  }

  _displayUserName(value) {
    this._userNameDisplay.innerText = value;
  }

  _addUserScore(score) {
    let newHighScore = false;

    if (
      this._currentUser.highestScore === 0 ||
      score < this._currentUser.highestScore
    ) {
      this._currentUser.highestScore = score;
      newHighScore = true;
    }

    this._currentUser.pastScores.unshift(score);
    while (this._currentUser.pastScores.length > 5) {
      this._currentUser.pastScores.pop();
    }

    return newHighScore;
  }

  _loadEndScreenModal(outCome) {
    let newHighScore = this._addUserScore(outCome);

    if (this._newUser) {
      this._endScreenMainText.innerText = "Congratulations!";
      this._endScreenFinalScore.innerText = `Time: ${this._mainGame._timer.convertTime(
        outCome
      )}`;
      this._endScreenHighScoreText.innerText = "New Best Time!";
      this._endScreenUserScore.innerText = this._mainGame._timer.convertTime(
        this._currentUser.highestScore
      );
      this._endScreenPreviousScoresDisplay.innerHTML = `<p>Play Again to try and beat your time!</p>`;

      storageModule.Storage.addUser(this._currentUser);
      this._newUser = false;

      this._setActiveUser(true);
    } else {
      if (newHighScore) {
        this._endScreenMainText.innerText = "Congratulations!";
        this._endScreenHighScoreText.innerText = "New Best Time!";
      } else {
        this._endScreenMainText.innerText = "Sorry... Try Again";
        this._endScreenHighScoreText.innerText = "Highest Score";
      }

      this._endScreenFinalScore.innerText = `Time: ${outCome}`;
      this._endScreenUserScore.innerText = this._mainGame._timer.convertTime(
        this._currentUser.highestScore
      );

      this._endScreenPreviousScoresDisplay.innerHTML = `<h5>Previous Runs:</h5>`;
      for (let i = 0; i < this._currentUser.pastScores.length; i++) {
        this._endScreenPreviousScoresDisplay.innerHTML += `<h6>${this._mainGame._timer.convertTime(
          this._currentUser.pastScores[i]
        )}</h6>`;
      }

      storageModule.Storage.updateUser(
        this._currentUser,
        this._currentUserIndex
      );
    }

    this._loadHighScore(true);

    this._endScreenPlayAgainBtn.addEventListener(
      "click",
      this._loadPlayThrough.bind(this),
      { once: true }
    );
    this._endScreenChangeUserBtn.addEventListener(
      "click",
      this._toggleUserSelectionMenu.bind(this, false),
      { once: true }
    );
    this._endScreenModal.show();
  }

  gameOver(value) {
    confirm("You Win!!!!");

    this._loadEndScreenModal(value);
  }
}

const Begin = new GameUI();
