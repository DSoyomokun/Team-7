const { supabase } = require('../config/database');
const {hashPassword, comparePasswords} = require('../utils/auth');

class AuthService{
    static async signUp(email,password){
        const{data,error} = await supabase.auth.signUp({
            email,
            password,
            options:{
                data:{
                    created_at: new Date().toISOString()
                }
            }
        });

        if(error) throw new Error(error.message);
        return data;
    }

    static async login(email, password){
        const{data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if(error)throw new Error(error.message);
        return data;
    }
    static async logout(){
        const {error} = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    }
    static async getSession(){
        const{data, error} = await supabase.auth.getSession();
        if (error) throw new Error(error.message);
        return data.session;
    }
}

module.exports = AuthService;