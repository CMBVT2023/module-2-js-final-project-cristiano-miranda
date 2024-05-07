class Timer {
    constructor() {
        this._gameStartTime;
        this._powerUpStartTime;
        this._frozenTime = 0;

        this._powerUpTimerActive = false;
        this._freezeTime = false;

        this._loadHTMLElements();
    }
    
    _loadHTMLElements() {
        this._timeElapsedDisplay = document.getElementById('time-elapsed');

        this._powerUpTimeDisplay = document.getElementById('powerup-time');
    }

    
    _displayElapsedTime() {
        if (this._freezeTime != true) {
            this._timeElapsedDisplay.innerText = `${this.convertTime(this.totalTime())}`
        }
    }

    _powerUpElapsedTime(time) {
        this._powerUpTimeDisplay.innerText = `${time - this.powerUpCurrentTime()}`
        if (this.powerUpCurrentTime() >= time) {
            this.stopPowerUpTimer();
        }
    }

    clearTimerDisplay() {
        this._timeElapsedDisplay.innerText = `00:00`;
    }

    get powerUpTimerActive() {
        return this._powerUpTimerActive;
    }

    totalTime() {
        return Math.floor((Date.now() - this._gameStartTime) / 1000) - this._frozenTime;
    }

    powerUpSetTime() {
        this._powerUpStartTime = Date.now();
        this._powerUpTimerActive = true;
    }

    powerUpCurrentTime() {
        return Math.floor((Date.now() - this._powerUpStartTime) / 1000);
    }

    stopPowerUpTimer() {
        clearInterval(this._powerUpCounter);
        this._powerUpTimerActive = false;
    }

    startPowerUpTimer(time) {
        this.powerUpSetTime();
        this._powerUpTimeDisplay.innerText = `${time}`
        this._powerUpCounter = setInterval(this._powerUpElapsedTime.bind(this, time), 1000);
    }

    freezeTimeCounter(time) {
        this.powerUpSetTime();
        this._freezeTime = true;
        this._powerUpTimeDisplay.innerText = `${time}`
        this._powerUpCounter = setInterval(() => {
            this._frozenTime += 1;
            this._powerUpElapsedTime(time);
            if (this.powerUpCurrentTime() >= time) {
                this._freezeTime = false;
            }
        }, 1000)
    }

    clearPowerUp() {
        clearInterval(this._powerUpCounter);
        this._powerUpTimerActive = false;
        this._freezeTime = false;
    }

    timerStop() {
        clearInterval(this._timerCounter);
        this.clearTimerDisplay();
    }

    timerStart() {
        this._timerReset();
        this._timerCounter = setInterval(this._displayElapsedTime.bind(this), 1000);
    }

    _timerReset() {
        this._gameStartTime = Date.now();
        this._frozenTime = 0;
        this.clearTimerDisplay();
    }

    convertTime(time) {
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
        
        this._currentTrailCrumb = 0;
        this._cookieTrailComplete;

        this._cookieHuntNum = 0;
        this._currentHuntCrumb = 0;
        this._cookieHuntActive;

        this._loadHTMLElements();
        
    }

    _loadHTMLElements() {
        this._rteContainer = document.getElementById('rte-spawn');
        
        this._rteDisplay = document.getElementById('rte-display');
        this._rteEventDisplay = document.getElementById('current-rte');
        this._rteRemainingDisplay = document.getElementById('rte-remain');
    }

    _enemyDamage() {
        this._enemyHealth -= 1;
        if (this._enemyHealth <= 0) {
            this.clearRTE();
            return;
        }
        this._rteRemainingDisplay.innerText = this._enemyHealth;
    }

    _nextCookieTrailCrumb() {
        this._cookieTrailList[this._currentTrailCrumb].style.visibility = 'hidden';

        this._currentTrailCrumb++;

        if (this._currentTrailCrumb < 10) {
            const crumbEvent = this._cookieTrailList[this._currentTrailCrumb].addEventListener('click', this._nextCookieTrailCrumb.bind(this), {once: true})
            this.displayRTE(true, 2);
        } else if (this._currentTrailCrumb === 10) {
            this.clearRTE();
        }
    }

    _nextCookieHuntCrumb() {
        this._cookieHuntList[this._currentHuntCrumb].style.visibility = 'hidden';

        this._currentHuntCrumb++;

        if (this._currentHuntCrumb < this._cookieHuntNum) {
            const crumbEvent = this._cookieHuntList[this._currentHuntCrumb].addEventListener('click', this._nextCookieHuntCrumb.bind(this), {once: true})
            this._cookieHuntList[this._currentHuntCrumb].style.visibility = 'visible';
            this.displayRTE(true, 3);
        } else if (this._currentHuntCrumb === this._cookieHuntNum) {
            this.clearRTE();
        }
    }

    get enemyAlive() {
        return this._enemyAlive;
    }

    get cookieTrailComplete() {
        return this._cookieTrailComplete;
    }

    get cookieHuntComplete() {
        return this._cookieHuntActive;
    }

    summonCookieHunt() {
        this._cookieHuntElement = document.createElement('div');
        this._cookieHuntNum = Math.ceil(Math.random() * 5) + 5;
        for (let i = 0; i < this._cookieHuntNum; i++) {
            this._cookieHuntElement.innerHTML += `<img src="./assets/Mini Cookie Asset.png" class="cookie-crumb-hunt"></img>`
        }
        this._rteContainer.appendChild(this._cookieHuntElement);

        this._cookieHuntList = document.querySelectorAll('.cookie-crumb-hunt');
        
        for (let i = 0; i < this._cookieHuntNum; i++) {
            let randomTop = Math.ceil(Math.random() * 55) + 20;
            let randomLeft = Math.ceil(Math.random() * 70) + 5;

            this._cookieHuntList[i].style.top = `${randomTop}%`
            this._cookieHuntList[i].style.left = `${randomLeft}%`
        }

        this._cookieHuntActive = true;

        const crumbEvent = this._cookieHuntList[0].addEventListener('click', this._nextCookieHuntCrumb.bind(this), {once: true})
        this._cookieHuntList[0].style.visibility = 'visible';
        this.displayRTE(true, 3);
    }

    summonCookieTrail() {
        this._cookieTrailElement = document.createElement('div')
        for (let i = 0; i < 10; i++) {
            this._cookieTrailElement.innerHTML += `<img src="./assets/Mini Cookie Asset.png" class="cookie-crumb-trail"></img>`
        }
        this._rteContainer.appendChild(this._cookieTrailElement);

        this._cookieTrailList = document.querySelectorAll('.cookie-crumb-trail')
        let leftNum = 2;
        for (let i = 0; i < 10; i++) {
            let randomTop = Math.ceil(Math.random() * 55) + 20
            this._cookieTrailList[i].style.top = `${randomTop}%`;
            this._cookieTrailList[i].style.left = `${leftNum}%`
            leftNum += 10;
        }

        this._cookieTrailComplete = false;

        const crumbEvent = this._cookieTrailList[0].addEventListener('click', this._nextCookieTrailCrumb.bind(this), {once: true});
        this.displayRTE(true, 2);
    }

    summonEnemy() {
        this._enemyElement = document.createElement('div')
        this._enemyElement.innerHTML = `<img src="./assets/Monster Asset.png" id="enemy-entity"></img>`
        this._enemyElement.classList.add('enemy-rte')
        this._rteContainer.appendChild(this._enemyElement)

        let randomTop = Math.ceil(Math.random() * 55) + 10;
        this._enemyElement.style.top = `${randomTop}%`;

        let randomLeft = Math.ceil(Math.random() * 85);
        this._enemyElement.style.left = `${randomLeft}%`;

        this._enemyElement.addEventListener('click', this._enemyDamage.bind(this))

        this._enemyHealth = Math.ceil(Math.random() * 25) + 10;
        this._enemyAlive = true;

        this.displayRTE(true, 1);
    }

    clearRTE() {
        this._rteContainer.innerHTML = ``;
        this._currentTrailCrumb = 0;
        this._cookieTrailComplete = true;

        this._enemyAlive = false;
        this._enemyHealth = 0;

        this._cookieHuntNum = 0;
        this._currentHuntCrumb = 0;
        this._cookieHuntActive = false;

        this.displayRTE(false);
    }

    displayRTE(value, currentEvent) {
        if (value) {
            this._rteDisplay.style.visibility = 'visible';
            switch (currentEvent) {
                case 1: {
                    this._rteEventDisplay.innerText = 'Enemy Health Remaining:'
                    this._rteRemainingDisplay.innerText = this._enemyHealth;
                    break;
                }
                case 2: {
                    this._rteEventDisplay.innerText = 'Cookie Trail Crumbs Remaining:'
                    this._rteRemainingDisplay.innerText = 10 - this._currentTrailCrumb;
                    break;
                }
                case 3: {
                    this._rteEventDisplay.innerText = 'Cookie Hunt Crumbs Remaining:'
                    this._rteRemainingDisplay.innerText = this._cookieHuntNum - this._currentHuntCrumb;
                    break;
                }
            }
        } else {
            this._rteDisplay.style.visibility = 'hidden';
            this._rteEventDisplay.innerText = ``;
            this._rteRemainingDisplay.innerText = ``;
        }
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

    randomIncrease() {
        this._currentCookies += Math.ceil(Math.random() * 25);
    }

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

class Game {
    constructor() {
        this._cookie = new CookieCrumb();
        this._timer = new Timer();
        this._rte = new RealTimeEvent();

        this._cookieCrumbValue = 1;
        this._powerUpNum = 0;

        this._holdEnabled = false;
        this._powerUpSuperClickActive = false;
        this._powerUpActive = false;
        
        this._randomEventClicks = 0;
        this._eventActiveEnemy = false;
        this._eventActiveTrail = false;
        this._eventActiveHunt = false;

        this._loadHTMLElements();
        this._loadDefaultEventListeners();
        this._powerUpDisplayPrice();
        this._loadHighScoreDisplay();
    }

    _loadHTMLElements() {
        this._cookieCrumb = document.getElementById('cookie-crumb');
        this._brokenCookieCrumb = document.getElementById('broken-cookie');
        
        this._MainPowerUpDisplay = document.getElementById('powerup-display');
        this._currentPowerUpDisplay = document.getElementById('current-powerup');
        this._currentHighScoreDisplay = document.getElementById('highest-score');
        this._freezeTimePriceDisplay = document.getElementById('freeze-time-cost');
        this._boostValuePriceDisplay = document.getElementById('boost-value-cost');
        this._superClickPriceDisplay = document.getElementById('super-click-cost');
        
        this._boostValueBtn = document.getElementById('boost-value');
        this._superClickBtn = document.getElementById('super-click');
        this._freezeTimeBtn = document.getElementById('freeze-time');
        this._resetBtn = document.getElementById('reset');
    }

    _loadDefaultEventListeners() {
        this._cookieCrumb.addEventListener('click', this._userClick.bind(this));
        this._boostValueBtn.addEventListener('click', this._powerUpPreCheck.bind(this, 'boost-value'));
        this._superClickBtn.addEventListener('click', this._powerUpPreCheck.bind(this, 'super-click'));
        this._freezeTimeBtn.addEventListener('click', this._powerUpPreCheck.bind(this, 'freeze-time'))

        this._resetBtn.addEventListener('click', this.resetGame.bind(this), {once: true});
    }

    _loadHighScoreDisplay() {
        this._currentHighScoreDisplay.innerText = this._timer.convertTime(Storage.loadHighScore());
    }

    _userClick() {
        this._cookie.increaseClicks();
        this._cookie.increaseCookies(this._cookieCrumbValue);

        this._updateScoreBoard();
    }

    _displayPowerUp(powerUp) {
        this._currentPowerUpDisplay.innerText = `${powerUp} Currently Active`;
        this._MainPowerUpDisplay.style.visibility = 'visible';
    }

    _eventClickCalculator() {
        this._randomEventClicks = Math.ceil(Math.random() * 50) + this._cookie.totalClicks + 30;
    }

    _eventActive() {
        return (this._eventActiveEnemy || this._eventActiveHunt || this._eventActiveTrail);
    }

    _activateEvent() {
        let num = Math.ceil(Math.random() * 3);

        this._powerUpReset();
        this._cookieCrumb.style.visibility = 'hidden';
        this._brokenCookieCrumb.style.visibility = 'visible';

        switch(num) {
            case 1: {
                this._rte.summonEnemy();
                this._eventActiveEnemy = true;
                break;
            }
            case 2: {
                this._rte.summonCookieTrail();
                this._eventActiveTrail = true;
                break;
            }
            case 3: {
                this._rte.summonCookieHunt();
                this._eventActiveHunt = true;
                break;
            }
        }

        this._eventCheck();
    }

    _updateScoreBoard() {
        const currentCookiesInfo = document.getElementById('current-cookies');
        currentCookiesInfo.textContent = this._cookie.currentCookies;

        const totalClicksInfo = document.getElementById('total-clicks');
        totalClicksInfo.textContent = this._cookie.totalClicks;

        if (this._cookie.currentCookies >= 100) {
            Storage.setHighScore(this._timer.totalTime());
            this.endGame();
        } else if (this._cookie.totalClicks === this._randomEventClicks && this._eventActive() != true) {
            this._activateEvent();
        }
    }

    _powerUpDisplayPrice() {
        this._boostValuePriceDisplay.innerText = this._powerUpPriceCalculator(50);
        this._superClickPriceDisplay.innerText = this._powerUpPriceCalculator(30);
        this._freezeTimePriceDisplay.innerText = this._powerUpPriceCalculator(20);
    }

    _powerUpPriceCalculator(baseCost) {
        return Math.ceil(((this._powerUpNum * .75) * baseCost) + baseCost);
    }

    _powerUpToggle(powerUp) {
        this._powerUpNum += 1;

        switch (powerUp) {
            case 'boost-value': {
                let boostValue = Math.ceil(Math.random() * 2) + 1;
                this._cookieCrumbValue = boostValue;
    
                this._timer.startPowerUpTimer(10);
                this._displayPowerUp('Boost Value');
                break;
            }
            case 'super-click': {
                this._cookieCrumb.addEventListener('click', this._powerUpSuperClickToggle.bind(this, true), {once: true});
    
                this._timer.startPowerUpTimer(15)
                this._displayPowerUp('Super Click');
                break;
            }
            case 'freeze-time': {
                this._timer.freezeTimeCounter(10)

                this._displayPowerUp('Freeze Time');
                break;
            }
        }

            this._powerUpDisplayPrice();
            this._powerUpActive = true;
            this._updateScoreBoard();
            this._powerUpCheck();
    }

    _powerUpPreCheck(powerUp) {
        if ((this._powerUpActive != true && this._eventActive() != true)) {
            let powerUpPrice;

            switch (powerUp) {
                case 'boost-value': {
                    powerUpPrice = this._powerUpPriceCalculator(50);
                    break;
                }
                case 'super-click': {
                    powerUpPrice = this._powerUpPriceCalculator(30);
                    break;
                }
                case 'freeze-time': {
                    powerUpPrice = this._powerUpPriceCalculator(20);
                    break;
                }
            }

            if (powerUpPrice <= this._cookie.currentCookies) {
                this._cookie.powerUp(powerUpPrice);
                this._powerUpToggle(powerUp);
            }
        }
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
            this._cookie.increaseCookies(this._cookieCrumbValue);
            this._updateScoreBoard();
            setTimeout(() => {this._powerUpSuperClick()}, 250)
        };
    };

    _eventCheck() {
        this._eventCounter = setInterval(() => {
            if ((this._eventActiveEnemy && this._rte.enemyAlive === false) || (this._eventActiveTrail && this._rte.cookieTrailComplete) || (this._eventActiveHunt && this._rte._cookieHuntActive === false)) {
                this._cookie.randomIncrease();
                this._updateScoreBoard();
                this._eventClickCalculator();
                this._eventReset();
            }
        }, 250)
    }

    _powerUpCheck() {
        this._powerUpCounter = setInterval(() => {
            if (this._powerUpActive && this._timer.powerUpTimerActive === false) {
                this._powerUpReset();
            }
        }, 1000)
    }

    _gameReset() {
        this._timer.timerStop();

        this._powerUpNum = 0;
        this._powerUpReset();
        this._eventReset();

        this._cookie.scoreReset();
        this._powerUpDisplayPrice();        
        this._updateScoreBoard();
        this._loadHighScoreDisplay();
    }

    _powerUpReset() {
        this._cookieCrumbValue = 1;
        this._powerUpSuperClickToggle(false);
        this._powerUpActive = false;

        this._timer.clearPowerUp();
        clearInterval(this._powerUpCounter);

        this._MainPowerUpDisplay.style.visibility = 'hidden';
        this._currentPowerUpDisplay.innerText = ``;
    }

    _eventReset() {
        this._rte.clearRTE();
        this._cookieCrumb.style.visibility = 'visible';
        this._brokenCookieCrumb.style.visibility = 'hidden';
        this._eventActiveEnemy = false;
        this._eventActiveTrail = false;
        this._eventActiveHunt = false;
        clearInterval(this._eventCounter);
    }

    endGame() {
        this._gameReset();

        confirm("You Win");
        this.startGame();
    }

    haltGame() {
        this._gameReset();
    }

    resetGame() {
        this._gameReset();

        setTimeout(() => {            
            this._resetBtn.addEventListener('click', this.resetGame.bind(this, false), {once: true});
        }, 1000);

        this.startGame();
    }

    startGame() {
        this._timer.timerStart();
        this._eventClickCalculator();
    }

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
