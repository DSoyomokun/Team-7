"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const config = {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    options: {
        auth: { persistSession: true },
        realtime: { params: { eventsPerSecond: 10 } }
    }
};
class CustomSupabaseClient {
    constructor() {
        if (!config.url || !config.key) {
            throw new Error('Missing Supabase URL or Key in environment');
        }
        this.client = (0, supabase_js_1.createClient)(config.url, config.key, config.options);
        this._initialize();
    }
    async _initialize() {
        try {
            const { error } = await this.client
                .from('profiles')
                .select('*')
                .limit(1);
            if (!error)
                console.log('Supabase ready');
        }
        catch (error) {
            console.error('Supabase init failed:', error.message || error);
        }
    }
    // Table shortcuts
    get transactions() {
        return this.client.from('transactions');
    }
    get users() {
        return this.client.from('users');
    }
    // Auth shortcut
    get auth() {
        return this.client.auth;
    }
    // Storage shortcut
    get storage() {
        return this.client.storage;
    }
}
exports.default = new CustomSupabaseClient().client;
//# sourceMappingURL=supabase.js.map