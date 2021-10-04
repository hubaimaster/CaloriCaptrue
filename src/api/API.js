
import Database from "./database";
import Storage from "./storage";
import Logic from "./logic";
import Auth from './auth';

class API {
    static auth = new Auth();
    static database = new Database();
    static storage = new Storage();
    static logic = new Logic();
}

export default API;
