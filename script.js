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
      
      this._loadEventListeners();
    }

    _loadEventListeners() {
        const cookieCrumb = document.getElementById('cookie-crumb').addEventListener('click', this._userClick.bind(this));
    }

    _userClick() {
        this._cookie.increaseClicks();
        this._cookie.increaseCookies(2);

        this._updateScoreBoard();
    }

    _updateScoreBoard() {
        const currentCookiesInfo = document.getElementById('current-cookies');
        currentCookiesInfo.textContent = this._cookie.currentCookies;

        const totalClicksInfo = document.getElementById('total-clicks');
        totalClicksInfo.textContent = this._cookie.totalClicks;


    }
};

const game1 = new PlayThrough();
