export class CookieCrumb {
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