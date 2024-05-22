export class Storage {
    // Sets the users array equal to the array passed in.
    static _setUserList(arr) {
        localStorage.setItem('users', JSON.stringify(arr))
    }

    // Returns the users array saved in localStorage or if one doesn't exist, it returns an empty array.
    static getUserList() {
        // Initializes a variable to store the users list
        let list;

        // Checks if localStorage already has a users list saved.
        if (localStorage.getItem('users') === null) {
            // If not, then it sets the users list variable equal to an empty array.
            list = [];
        } else {
            // If a list exists, then the users array is pulled from local storage and the users list variable is set equal to it.
            list = JSON.parse(localStorage.getItem('users'))
        };

        // Returns the users list
        return list;
    };

    // Appends a user to the users array that is saved in localStorage.
    // // Parameter is a user object that will be appended to the users array.
    static addUser(userObj) {
        // Calls the getUserList method and sets a variable equal to the returned list.
        let list = this.getUserList();
        
        // Pushes the passed in userObj to the end of the users array.
        list.push(userObj)

        // Calls the method to update the localStorage users array with the new list .
        this._setUserList(list);
    }

    // Updates a user that is within the saved users array.
    // // The first parameter is the new user object, with the updated values, that will overwrite the current user object, and the second parameter is the index at which
    // // the user's original object is saved.
    static updateUser(userObj, index) {
        // Calls the getUserList method and sets a variable equal to the returned list.
        let list = this.getUserList();

        // Sets the user object at the specified index within the array to the new userObj that was passed in.
        list[index] = userObj;

        // Calls the method to update the localStorage users array with the new list.
        this._setUserList(list);
    }

    // Removes a user within the array at the specified index.
    // // The parameter is the index value at which the user to be removed is stored.
    static removeUser(index) {
        // Calls the getUserList method and sets a variable equal to the returned list.
        let list = this.getUserList();

        // Removes the user profile using the splice method.
        let profile = list.splice(index, 1);

        // Provides a confirmation popup to ensure that the user wants to delete the profile.
        let confirmation = confirm(`Are you sure you want to delete this profile?`)
        
        // Checks the result from the confirm popup
        if(confirmation) {
            // If the user confirms,
            // The method to update the localStorage users array with the new list is called.
            this._setUserList(list);
        }
    }
};