class Time {
    constructor() {
        this._gameStartTime = Date.now();
        this._powerUpStartTime;
        this._frozenTime = 0;
    }

    totalTime() {
        return Math.floor((Date.now() - this._gameStartTime) / 1000) - this._frozenTime;
    }

    powerUpStartTime() {
        this._powerUpStartTime = Date.now();
    }

    powerUpCurrentTime() {
        return Math.floor((Date.now() - this._powerUpStartTime) / 1000) % 60;
    }
    
    powerUpElapsedTime() {
        return Math.floor((Date.now() - this._powerUpStartTime) / 1000);
    }

    freezeTime() {
        this._frozenTime += 1;
    }

    timerReset() {
        this._gameStartTime = Date.now();
        this._frozenTime = 0;
    }

    displayTime(time) {
        let seconds = time % 60;
        let minutes = Math.floor(time / 60);
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
}

class RealTimeEvent {
    constructor() {
        this._enemyHealth = 0;
        this._enemyAlive;

        this._loadHTMLElements();
        this.hideEnemies();
    }

    _loadHTMLElements() {
        this._enemyOne = document.getElementById('enemy-one');
        this._enemyTwo = document.getElementById('enemy-two');
        this._enemyThree = document.getElementById('enemy-three');
        
        this._rteDisplay = document.getElementById('rte-display');
        this._rteEventDisplay = document.getElementById('current-rte');
        this._rteRemainingDisplay = document.getElementById('rte-remain');
    }

    _enemyDamage() {
        this._enemyHealth -= 1;
        if (this._enemyHealth < 0) {
            this._enemyAlive = false;
            this.displayRTE(false);
            return;
        }
        this._rteRemainingDisplay.innerText = this._enemyHealth;
    }

    get enemyAlive() {
        return this._enemyAlive;
    }

    randomEnemySelection() {
        let randomNum = Math.ceil(Math.random() * 3);
        this._enemyHealth = Math.ceil(Math.random() * 25) + 10;
        this._enemyAlive = true;

        if (randomNum === 1) {
            this._enemyOne.style.visibility = 'visible';
            this._enemyOne.addEventListener('click', this._enemyDamage.bind(this))
        } else if (randomNum === 2) {
            this._enemyTwo.style.visibility = 'visible';
            this._enemyTwo.addEventListener('click', this._enemyDamage.bind(this))
            
        } else {
            this._enemyThree.style.visibility = 'visible';
            this._enemyThree.addEventListener('click', this._enemyDamage.bind(this))
        }
        this.displayRTE(true);
    }

    displayRTE(value, currentEvent) {
        if (value) {
            this._rteDisplay.style.visibility = 'visible';
            this._rteEventDisplay.innerText = 'Enemy Health Remaining:'
            this._rteRemainingDisplay.innerText = this._enemyHealth;
        } else {
            this._rteDisplay.style.visibility = 'hidden';
            this._rteEventDisplay.innerText = ``;
            this._rteRemainingDisplay.innerText = ``;
        }
    }

    hideEnemies() {
        this._enemyOne.style.visibility = 'hidden';
        this._enemyTwo.style.visibility = 'hidden';
        this._enemyThree.style.visibility = 'hidden';
    }
}

class CookieCrumb {
    constructor() {
        this._currentCookies = 0;
        this._totalClicks = 0;
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
    
    scoreReset() {
        this._currentCookies = 0
        this._totalClicks = 0;
    }
}

class Storage {
    static loadHighScore() {
        let currentHighScore;

        if (localStorage.getItem('highScore') === null) {
            currentHighScore = 0;
        } else {
            currentHighScore = +localStorage.getItem('highScore');
        }

        return currentHighScore;
    };

    static setHighScore(currentScore) {
        let oldScore = this.loadHighScore();

        if (oldScore > currentScore || oldScore === 0) {
            localStorage.setItem('highScore', currentScore);
        };
    };
}


class PlayThrough {
    constructor() {
      this._cookie = new CookieCrumb();
      this._timer = new Time();
      this._rte = new RealTimeEvent();

      this._cookieCrumbValue = 1;

      this._holdEnabled = false;
      this._powerUpSuperClickActive = false;
      this._timeFreeze = false;
      this._powerUpActive = false;
      this._powerUpTime = 0;
      
    //   For testing purposes, setting this to between 1-10, upon finishing set it to 51-100
      this._randomEventClicks = Math.ceil(Math.random() * 10);
    //   this._randomEventClicks = Math.ceil(Math.random() * 50) + 50;
      this._eventActive = false;
      
      this._loadHTMLElements();
      this._loadDefaultEventListeners();
      this._loadHighScoreDisplay();
      this._updateTime(this._timeFreeze);
    }

    _loadHTMLElements() {
        this._cookieCrumb = document.getElementById('cookie-crumb');
        this._timeElapsed = document.getElementById('time-elapsed');
        this._MainPowerUpDisplay = document.getElementById('powerup-display');
        this._currentPowerUpDisplay = document.getElementById('current-powerup');
        this._currentPowerUpTimeDisplay = document.getElementById('powerup-time');
        this._currentHighScoreDisplay = document.getElementById('highest-score');
    }

    _loadDefaultEventListeners() {
        this._cookieCrumb.addEventListener('click', this._userClick.bind(this));
        const boostValueBtn = document.getElementById('boost-value').addEventListener('click', this._powerUpToggle.bind(this, 'boost-value'));
        const superClickBtn = document.getElementById('super-click').addEventListener('click', this._powerUpToggle.bind(this, 'super-click'));
        const freezeTimeBtn = document.getElementById('freeze-time').addEventListener('click', this._powerUpToggle.bind(this, 'freeze-time'))
    }

    _loadHighScoreDisplay() {
        this._currentHighScoreDisplay.innerText = this._timer.displayTime(Storage.loadHighScore());
    }

    _userClick() {
        this._cookie.increaseClicks();
        this._cookie.increaseCookies(this._cookieCrumbValue);

        this._updateScoreBoard();
    }

    _displayPowerUp(powerUp) {
        this._currentPowerUpDisplay.innerText = `${powerUp} Currently Active`;
        this._displayPowerUpTime();
        this._MainPowerUpDisplay.style.visibility = 'visible';
    }

    _enemyEvent() {
        this._powerUpReset();
        this._cookieCrumb.style.visibility = 'hidden';
        this._rte.randomEnemySelection();
        this._eventActive = true;
    }

    _updateScoreBoard() {
        const currentCookiesInfo = document.getElementById('current-cookies');
        currentCookiesInfo.textContent = this._cookie.currentCookies;

        const totalClicksInfo = document.getElementById('total-clicks');
        totalClicksInfo.textContent = this._cookie.totalClicks;

        if (this._cookie.currentCookies > 50) {
            Storage.setHighScore(this._timer.totalTime());
            this._gameReset(); 
        } else if (this._cookie.totalClicks === this._randomEventClicks) {
            this._enemyEvent();
        }
    }

    _powerUpToggle(powerUp) {
        if (this._powerUpActive != true && this._eventActive != true) {
            if (powerUp === 'boost-value' && this._cookie.currentCookies >= 10) {
                this._timer.powerUpStartTime()
                let boostValue = Math.ceil(Math.random() * 2) + 1;
                this._cookieCrumbValue = boostValue;
    
                this._cookie.powerUp(10);
                this._powerUpTime = 15;
                this._powerUpActive = true;
                this._displayPowerUp('Boost Value');
            } else if (powerUp === 'super-click' && this._cookie.currentCookies >= 10) {
                this._timer.powerUpStartTime()
                this._cookieCrumb.addEventListener('click', this._powerUpSuperClickToggle.bind(this, true), {once: true});
    
                this._cookie.powerUp(10);
                this._powerUpTime = 20;
                this._powerUpActive = true;
                this._displayPowerUp('Super Click');
            } else if (powerUp === 'freeze-time' && this._cookie.currentCookies >= 10) {
                this._timer.powerUpStartTime()
                this._timeFreeze = true;
    
                this._cookie.powerUp(10);
                this._powerUpTime = 10;
                this._powerUpActive = true;
                this._displayPowerUp('Freeze Time');
            };
        }

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

    _updateTime() {
        setTimeout(() => {
            if (this._timeFreeze === false) {
                this._timeElapsed.innerText = `${this._timer.displayTime(this._timer.totalTime())}`   
            } else {
                this._timer.freezeTime();
            }

            if (this._powerUpActive && this._timer.powerUpElapsedTime() >= this._powerUpTime) {
                this._powerUpReset();
            } else if (this._powerUpActive) {
                this._displayPowerUpTime();
            }

            if (this._eventActive && this._rte.enemyAlive === false) {
                this._cookieCrumb.style.visibility = 'visible';
                this._rte.hideEnemies();
                this._eventActive = false;
            }

            this._updateTime();
        }, 1000)
    }

    _displayPowerUpTime() {
        this._currentPowerUpTimeDisplay.innerText = `${this._powerUpTime - this._timer.powerUpCurrentTime()}`
    }

    _gameReset() {
        this._cookie.scoreReset();
        this._updateScoreBoard();
        this._timer.timerReset();
        this._powerUpReset();
        this._updateTime();
        this._loadHighScoreDisplay();
    }

    _powerUpReset() {
        this._timeFreeze = false;
        this._cookieCrumbValue = 1;
        this._powerUpSuperClickToggle(false);
        this._powerUpActive = false;
        this._powerUpTime = 0;

        this._currentPowerUpDisplay.innerText = ``;
        this._currentPowerUpTimeDisplay.innerText = ``;
        this._MainPowerUpDisplay.style.visibility = 'hidden';
    }

};

const game1 = new PlayThrough();
