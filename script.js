class Time {
    constructor() {
        this._gameStartTime = Date.now();
        this._powerUpStartTime;
        this._frozenTime = 0;
    }

    elapsedTime() {
        let totalTime = Math.floor((Date.now() - this._gameStartTime) / 1000) - this._frozenTime;
        let seconds = totalTime % 60;
        let minutes = Math.floor(totalTime / 60);
        let secondsDisplay;
        let minutesDisplay;
        
        if (minutes >= 10) {
            minutesDisplay = `${minutes}`
        } else {
            minutesDisplay = `0${minutes}`;
        }

        if (seconds >= 10) {
            secondsDisplay =  `${seconds}`
        } else {
            secondsDisplay =  `0${seconds}`;
        }

        return `${minutesDisplay}:${secondsDisplay}`
    }

    powerUpStartTime() {
        this._powerUpStartTime = Date.now();
    }
    
    powerUpElapsedTime() {
        return Math.floor((Date.now() - this._powerUpStartTime) / 1000);
    }

    freezeTime() {
        this._frozenTime += 1;
    }
}

class CookieCrumb {
    constructor() {
        this._currentCookies = 0;
        this._totalClicks = 0;
        this._timeElapsed = 0;
    }

    get currentCookies() {
        return this._currentCookies;
    }

    get totalClicks() {
        return this._totalClicks;
    }

    increaseCookies(value) {
        this._currentCookies += value;
    }

    increaseClicks() {
        this._totalClicks += 1;
    };

    powerUp(cost) {
        this._currentCookies -= cost;
    }
}


class PlayThrough {
    constructor() {
      this._cookie = new CookieCrumb();
      this._timer = new Time();
      this._cookieCrumbValue = 1;
      this._holdEnabled = false;
      this._powerUpSuperClickActive = false;
      this._cookieCrumb = document.getElementById('cookie-crumb');
      this._timeElapsed = document.getElementById('time-elapsed');
      this._timeFreeze = false;
      this._powerUpActive = false;
      this._powerUpTime = 0;
      
      this._loadDefaultEventListeners();
      this._updateTime(this._timeFreeze);
    }

    _loadDefaultEventListeners() {
        this._cookieCrumb.addEventListener('click', this._userClick.bind(this));
        const boostValueBtn = document.getElementById('boost-value').addEventListener('click', this._powerUpToggle.bind(this, 'boost-value'));
        const superClickBtn = document.getElementById('super-click').addEventListener('click', this._powerUpToggle.bind(this, 'super-click'));
        const freezeTimeBtn = document.getElementById('freeze-time').addEventListener('click', this._powerUpToggle.bind(this, 'freeze-time'))
    }

    _userClick() {
        this._cookie.increaseClicks();
        this._cookie.increaseCookies(this._cookieCrumbValue);

        this._updateScoreBoard();
    }

    _powerUpToggle(powerUp) {
        if (this._powerUpActive != true && powerUp === 'boost-value' && this._cookie.currentCookies >= 10) {
            this._timer.powerUpStartTime()
            let boostValue = Math.ceil(Math.random() * 2) + 1;
            this._cookieCrumbValue = boostValue;

            this._cookie.powerUp(10);
            this._powerUpTime = 15;
            this._powerUpActive = true;
        } else if (this._powerUpActive != true && powerUp === 'super-click' && this._cookie.currentCookies >= 10) {
            this._timer.powerUpStartTime()
            this._cookieCrumb.addEventListener('mousedown', this._powerUpSuperClickToggle.bind(this, true), {once: true});

            this._cookie.powerUp(10);
            this._powerUpTime = 20;
            this._powerUpActive = true;
        } else if (this._powerUpActive != true && powerUp === 'freeze-time' && this._cookie.currentCookies >= 10) {
            this._timer.powerUpStartTime()
            this._timeFreeze = true;

            this._cookie.powerUp(10);
            this._powerUpTime = 10;
            this._powerUpActive = true;
        };

        this._updateScoreBoard();
    }

    _powerUpSuperClickToggle(value) {
        if (value) {
            this._holdEnabled = true;
            this._powerUpSuperClick();
        } else {
            this._holdEnabled = false;
        }
    }

    _powerUpSuperClick() {
        if (this._holdEnabled) {
            this._userClick();
            setTimeout(() => {this._powerUpSuperClick()}, 250)
        };
    };

    _updateScoreBoard() {
        const currentCookiesInfo = document.getElementById('current-cookies');
        currentCookiesInfo.textContent = this._cookie.currentCookies;

        const totalClicksInfo = document.getElementById('total-clicks');
        totalClicksInfo.textContent = this._cookie.totalClicks;
    }

    _updateTime() {
        setTimeout(() => {
            if (this._timeFreeze === false) {
                this._timeElapsed.innerText = `${this._timer.elapsedTime()}`   
            } else {
                this._timer.freezeTime();
            }

            if (this._powerUpActive && this._timer.powerUpElapsedTime() >= this._powerUpTime) {
                this._timeFreeze = false;
                this._cookieCrumbValue = 1;
                this._powerUpSuperClickToggle(false);
                this._powerUpActive = false;
                this._powerUpTime = 0;
            }

            this._updateTime();
        }, 1000)
    }


};

const game1 = new PlayThrough();
