class Users {

    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {

        const user = { id, name, room };
        this.users.push(user);

        return this.users;
        
    }

    getUser(id) {
        
        const user = this.users.filter( user => user.id === id )[0]
        return user;

    }

    getAllUsers() {
        return this.users
    }

    getUsersByRoom(room) {
        return this.users.filter(user => user.room === room);
    }

    deleteUser(id) {

        const deletedUser = this.getUser(id);
        if (deletedUser) {
            this.users = this.users.filter(user => user.id != id);
            return deletedUser;
        } else {
            return false;
        }

    }

}

module.exports = { Users }