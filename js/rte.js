export class RealTimeEvent {
    constructor(playThrough) {
        // Initializes the variables for the enemy RTE
        this._enemyHealth = 0;
        this._enemyAlive;

        // Initializes the variables for the cookie trail RTE
        this._currentTrailCrumb = 0;
        this._cookieTrailActive;

        // Initializes the variables for the cookie hunt RTE
        this._cookieHuntNum = 0;
        this._currentHuntCrumb = 0;
        this._cookieHuntActive;

        // Calls the function to load all the HTML elements related to the RTE events
        this._loadHTMLElements();

        // Sets the object instance passed in by the main PlayThrough class to a variable
        this._mainGame = playThrough;
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
            this.clearRTE(false);
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
            this.clearRTE(false);
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
            this.clearRTE(false);
        };
    };

    // Returns the value of the enemyAlive boolean.
    get enemyAlive() {
        return this._enemyAlive;
    };

    // Returns the value of the cookieTrailActive boolean.
    get cookieTrailActive() {
        return this._cookieTrailActive;
    };

    // Returns the value of the cookieHuntActive boolean.
    get cookieHuntActive() {
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

        // Sets the cookieTrailActive variable to true.
        this._cookieTrailActive = true;

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

    // Clears the currently active RTE
    // // The parameter is a boolean that is used to signify if the reset is a manual reset, if it is, then the eventComplete method from the main game is not 
    // // required to execute
    clearRTE(value) {
        // Sets the container associated with the RTEs to an empty string.
        this._rteContainer.innerHTML = ``;

        // Sets the cookie trail RTE variables to 0 and false respectively.
        this._currentTrailCrumb = 0;
        this._cookieTrailActive = false;

        // Sets the enemy RTE variables to 0 and false respectively.
        this._enemyHealth = 0;
        this._enemyAlive = false;

        // Sets the cookie hunt RTE variables to 0 and false.
        this._cookieHuntNum = 0;
        this._currentHuntCrumb = 0;
        this._cookieHuntActive = false;

        // Calls the function to display the current RTE, but passes in a parameter that instead disables it.
        this.displayRTE(false);

        // Checks if this was a manual reset, if it was, then it the eventComplete method will not be executed.
        value ? '' : this._mainGame.eventComplete();
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