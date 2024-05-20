export class Storage {
    static _setUserList(arr) {
        localStorage.setItem('users', JSON.stringify(arr))
    }

    static getUserList() {
        let list;

        if (localStorage.getItem('users') === null) {
            list = [];
        } else {
            list = JSON.parse(localStorage.getItem('users'))
        };

        return list;
    };

    static addUser(userObj) {
        let list = this.getUserList();
            
        list.push(userObj)

        this._setUserList(list);
    }

    static updateUser(userObj, index) {
        let list = this.getUserList();

        list[index] = userObj;

        this._setUserList(list);
    }

    static removeUser(index) {
        let list = this.getUserList();

        let profile = list.splice(index, 1);
        let confirmation = confirm(`Are you sure you want to delete this profile?`)
        
        if(confirmation) {
            this._setUserList(list);
        }
    }
};