class DataStore{
    constructor(){
        this.users = new Map;
        this.transactions = new Map;
        this.nextId = 1;

    }

    //user
    async createUser(userData){
        const id = `user_${this.nextId++}`;
        this.users.set(id,{...userData,id});
        return this.users.get(id);
    }

    async getUser(userId){
        return this.users.get(UserId);
    }


    //transactions
    async createTransaction(transactionData){
        const id = `txn_${this.nextId++}`;
        this.transactions.set
    }
}