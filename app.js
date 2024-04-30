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
            this._cookieHuntElement.innerHTML += `<h1 class="cookie-crumb-hunt">Crumb #${i + 1}</h1>`
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
            // Check that this id is unnecessary 
            // this._cookieTrailElement.innerHTML += `<h1 class="cookie-crumb-trail" id="crumb-${i}">Crumb</h1>`
            this._cookieTrailElement.innerHTML += `<h1 class="cookie-crumb-trail">Crumb</h1>`
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
        this._enemyElement.innerHTML = `<h1 id="enemy-entity">Enemy Entity Test</h1>`
        this._enemyElement.classList.add('enemy-rte')
        this._rteContainer.appendChild(this._enemyElement)

        let randomTop = Math.ceil(Math.random() * 55) + 20;
        this._enemyElement.style.top = `${randomTop}%`;

        let randomLeft = Math.ceil(Math.random() * 70) + 5;
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
        if (value && currentEvent === 1) {
            this._rteDisplay.style.visibility = 'visible';
            this._rteEventDisplay.innerText = 'Enemy Health Remaining:'
            this._rteRemainingDisplay.innerText = this._enemyHealth;
        } else if (value && currentEvent === 2) {
            this._rteDisplay.style.visibility = 'visible';
            this._rteEventDisplay.innerText = 'Cookie Trail Crumbs Remaining:'
            this._rteRemainingDisplay.innerText = 10 - this._currentTrailCrumb;
        } else if (value && currentEvent === 3) {
            this._rteDisplay.style.visibility = 'visible';
            this._rteEventDisplay.innerText = 'Cookie Hunt Crumbs Remaining:'
            this._rteRemainingDisplay.innerText = this._cookieHuntNum - this._currentHuntCrumb;
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
        this._timer = new Time();
        this._rte = new RealTimeEvent();

        this._cookieCrumbValue = 1;

        this._holdEnabled = false;
        this._powerUpSuperClickActive = false;
        this._timeFreeze = false;
        this._powerUpActive = false;
        this._powerUpTime = 0;
        
        //   For testing purposes, setting this to between 1-10, upon finishing set it to 51-100
        this._randomEventClicks = 10;
        //   this._randomEventClicks = Math.ceil(Math.random() * 50) + 50;
        this._eventActiveEnemy = false;
        this._eventActiveTrail = false;
        this._eventActiveHunt = false;

        this._gameOver = false;
        this._manualStop = false;

        this._loadHTMLElements();
        this._loadDefaultEventListeners();
        this._loadHighScoreDisplay();
    }

    _loadHTMLElements() {
        this._cookieCrumb = document.getElementById('cookie-crumb');
        this._timeElapsed = document.getElementById('time-elapsed');
        this._MainPowerUpDisplay = document.getElementById('powerup-display');
        this._currentPowerUpDisplay = document.getElementById('current-powerup');
        this._currentPowerUpTimeDisplay = document.getElementById('powerup-time');
        this._currentHighScoreDisplay = document.getElementById('highest-score');
        this._boostValueBtn = document.getElementById('boost-value');
        this._superClickBtn = document.getElementById('super-click');
        this._freezeTimeBtn = document.getElementById('freeze-time');
        this._resetBtn = document.getElementById('reset');
    }

    _loadDefaultEventListeners() {
        this._cookieCrumb.addEventListener('click', this._userClick.bind(this));
        this._boostValueBtn.addEventListener('click', this._powerUpToggle.bind(this, 'boost-value'));
        this._superClickBtn.addEventListener('click', this._powerUpToggle.bind(this, 'super-click'));
        this._freezeTimeBtn.addEventListener('click', this._powerUpToggle.bind(this, 'freeze-time'))

        this._resetBtn.addEventListener('click', this.manualReset.bind(this, false), {once: true});
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

    _eventActive() {
        return (this._eventActiveEnemy || this._eventActiveHunt || this._eventActiveTrail);
    }

    _activateEvent() {
        let num = Math.ceil(Math.random() * 3);

        this._powerUpReset();
        this._cookieCrumb.style.visibility = 'hidden';

        if (num === 1) {
            this._rte.summonEnemy();
            this._eventActiveEnemy = true;
        } else if (num === 2) {
            this._rte.summonCookieTrail();
            this._eventActiveTrail = true;
        } else if (num === 3) {
            this._rte.summonCookieHunt();
            this._eventActiveHunt = true;
        }
        this._eventCheck();
    }

    _updateScoreBoard() {
        const currentCookiesInfo = document.getElementById('current-cookies');
        currentCookiesInfo.textContent = this._cookie.currentCookies;

        const totalClicksInfo = document.getElementById('total-clicks');
        totalClicksInfo.textContent = this._cookie.totalClicks;

        if (this._cookie.currentCookies > 100) {
            Storage.setHighScore(this._timer.totalTime());
            this._gameOver = true;
        } else if (this._powerUpActive != true && this._cookie.totalClicks === this._randomEventClicks && this._eventActive() != true) {
            this._activateEvent();
        }
    }

    _powerUpToggle(powerUp) {
        if ((this._powerUpActive != true && this._eventActive() != true)) {
            if (powerUp === 'boost-value' && this._cookie.currentCookies >= 10) {
                this._timer.powerUpStartTime()
                let boostValue = Math.ceil(Math.random() * 2) + 1;
                this._cookieCrumbValue = boostValue;
    
                this._cookie.powerUp(10);
                this._powerUpTime = 15;
                this._powerUpActive = true;
                this._displayPowerUp('Boost Value');
                this._updateScoreBoard();
            } else if (powerUp === 'super-click' && this._cookie.currentCookies >= 10) {
                this._timer.powerUpStartTime()
                this._cookieCrumb.addEventListener('click', this._powerUpSuperClickToggle.bind(this, true), {once: true});
    
                this._cookie.powerUp(10);
                this._powerUpTime = 20;
                this._powerUpActive = true;
                this._displayPowerUp('Super Click');
                this._updateScoreBoard();
            } else if (powerUp === 'freeze-time' && this._cookie.currentCookies >= 10) {
                this._timer.powerUpStartTime()
                this._timeFreeze = true;
    
                this._cookie.powerUp(10);
                this._powerUpTime = 10;
                this._powerUpActive = true;
                this._displayPowerUp('Freeze Time');
                this._updateScoreBoard();
            };
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
        setTimeout(() => {
            if ((this._eventActiveEnemy && this._rte.enemyAlive === false) || (this._eventActiveTrail && this._rte.cookieTrailComplete) || (this._eventActiveHunt && this._rte._cookieHuntActive === false)) {
                this._cookieCrumb.style.visibility = 'visible';
                this._cookie.randomIncrease();
                this._updateScoreBoard();
                this._rte.clearRTE();
                this._eventActiveEnemy = false;
                this._eventActiveTrail = false;
                this._eventActiveHunt = false;
                return;
            }
            this._eventCheck();
        }, 250)
    }

    _updateTime() {
        if (this._gameOver) {
            this._gameReset(this._manualStop);
            return;
        }
        setTimeout(() => {
            if (this._powerUpActive && this._timer.powerUpElapsedTime() >= this._powerUpTime) {
                this._powerUpReset();
            } else if (this._powerUpActive) {
                this._displayPowerUpTime();
            }

            if (this._timeFreeze === false) {
                this._timeElapsed.innerText = `${this._timer.displayTime(this._timer.totalTime())}`
                console.log(this._timer.totalTime())
            } else {
                this._timer.freezeTime();
                console.log("Frozen Time: " + this._timer._frozenTime)
            }
            
            this._updateTime();
            }, 1000)
    }

    _displayPowerUpTime() {
        this._currentPowerUpTimeDisplay.innerText = `${this._powerUpTime - this._timer.powerUpCurrentTime()}`
    }

    _gameReset(value) {
        this._gameOver = false;

        this._powerUpReset();
        this._rte.clearRTE();
        this._cookieCrumb.style.visibility = 'visible';
        this._eventActiveEnemy = false;
        this._eventActiveTrail = false;
        this._eventActiveHunt = false;

        this._cookie.scoreReset();
        this._updateScoreBoard();
        this._loadHighScoreDisplay();

        this._timeElapsed.innerText = `00:00`;
        if (value == false) {
            this.startCountDown();
        } else {
            this._manualStop = false;
        }
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

    manualReset(value) {
        if (value) {
            this._manualStop = true;
            this._gameOver = true;
        } else {
            this._gameOver = true;
            setTimeout(() => {
                this._resetBtn.addEventListener('click', this.manualReset.bind(this, false), {once: true});
            }, 1000)
        }
    }

    startCountDown() {
        this._timer.timerReset();
        this._updateTime();
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
            let userResult = confirm('Warning! Changing your name will reset your current game\'s progress.')
            if (userResult) {
                this._userNameModal.toggle();
                this._game.manualReset(true);
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
            this._game.startCountDown();
        } else {
            confirm('Please Enter a Valid User Name');   
        }   
    }

    _displayUserName(value) {
        this._userNameDisplay.innerText = value;
    }
}

const newUser = new User();