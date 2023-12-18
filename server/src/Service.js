import HTTP from "./HTTP.js";
import Firebase from "./Firebase.js";
import Auth from "./Auth.js";
import Api from "./Api.js";

export default class Service {
    constructor(config) {
        this.config = config;
        this.http = new HTTP(this, this.config.http);
        this.firebase = new Firebase(this, this.config.firebase);
        this.auth = new Auth(this, this.config);
        this.api = new Api(this, this.config);

        this._ready = false;
        this._healthy = false;
    }

    async run() {
        this._healthy = true;

        await this.firebase.init();
        const _intv = setInterval(async () => {
            (await this.isHealthy())
                ? (this._healthy = true)
                : (this._healthy = false);
        }, 3000);

        await this.auth.init();

        await this.http.init();
        await this.http.listen();

        this._ready = true;
    }

    async isHealthy() {
        if (!this._healthy) {
            return false;
        }

        try {
            await this.firebase.checkHealth();
        } catch (error) {
            return false;
        }

        return true;
    }

    close() {
        this.http.close();
        this.http = null;
    }
}
