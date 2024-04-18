class Time {
    constructor() {
        this._gameStartTime = Date.now();
        this._powerUpStartTime;
    }

    elapsedTime() {
        return Math.floor((Date.now() - this._gameStartTime) / 1000);
    }

    powerUpStartTime() {
        this._powerUpStartTime = Date.now();
    }
    
    powerUpElapsedTime() {
        return Math.floor((Date.now() - this._powerUpStartTime) / 1000);
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
      
      this._loadDefaultEventListeners();
      this._updateTime();
    }

    _loadDefaultEventListeners() {
        this._cookieCrumb.addEventListener('click', this._userClick.bind(this));
        const boostValueBtn = document.getElementById('boost-value').addEventListener('click', this._powerUpBoostValue.bind(this));
        const superClickBtn = document.getElementById('super-click').addEventListener('click', this._powerUpSuperClickToggle.bind(this, true));
        const freezeTimeBtn = document.getElementById('freeze-time').addEventListener('click', this._powerUpFreezeTime.bind(this))
    }

    _userClick() {
        this._cookie.increaseClicks();
        this._cookie.increaseCookies(this._cookieCrumbValue);

        this._updateScoreBoard();
    }

    _powerUpFreezeTime() {
        console.log(this._timer.elapsedTime());
    }

    _powerUpSuperClickToggle(value) {
        this._powerUpSuperClickActive = value;
        console.log(this._powerUpSuperClickActive);

        if (value) {
            this._cookieCrumb.addEventListener('mousedown', this._powerUpSuperClickHold.bind(this, true), {once: true});
            this._cookieCrumb.addEventListener('mouseup', this._powerUpSuperClickHold.bind(this, false), {once: true});
        }

        this._timer.powerUpStartTime();
    }

    _powerUpSuperClickHold(value) {
        this._holdEnabled = value;
        this._powerUpSuperClick();

        if (this._timer.powerUpElapsedTime() >= 10) {
            this._powerUpSuperClickToggle(false);
        }
    }

    _powerUpSuperClick() {
        if (this._holdEnabled) {
            this._userClick();
            if (this._timer.powerUpElapsedTime() <= 10) {
                console.log(this._timer.powerUpElapsedTime())
                setTimeout(() => {this._powerUpSuperClick()}, 250)
            };
        };
    };

    _powerUpBoostValue() {
        let boostValue = Math.ceil(Math.random() * 2) + 1;
        this._cookieCrumbValue = boostValue;
    }

    _updateScoreBoard() {
        const currentCookiesInfo = document.getElementById('current-cookies');
        currentCookiesInfo.textContent = this._cookie.currentCookies;

        const totalClicksInfo = document.getElementById('total-clicks');
        totalClicksInfo.textContent = this._cookie.totalClicks;
    }

    _updateTime() {
        setTimeout(() => {
            this._timeElapsed.innerText = `00:${this._timer.elapsedTime()}`
            this._updateTime();
        }, 1000)
    }
};

const game1 = new PlayThrough();
