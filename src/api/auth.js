import Network from "./network";


class Auth {

    getMe = () => {
        return Network.instance.post({
            module_name: 'cloud.auth.get_me'
        }).then((data)=> {
            return data.item;
        });
    };

    login = (email, password) => {
        return Network.instance.post({
            module_name: 'cloud.auth.login',
            email, password
        })
    };

    register = (email, password, extra) => {
        return Network.instance.post({
            module_name: 'cloud.auth.register',
            email, password, extra
        })
    };

    hasAccount = (emailAddr) => {
        return Network.instance.post({
            module_name: 'cloud.auth.has_account',
            email: emailAddr,
        })
    };

    logout = () => {
        return Network.instance.post({
            module_name: 'cloud.auth.logout'
        }).then((data) => {
            Network.instance.setSessionId(null);
            return true;
        }).catch((data) => {
            return false;
        });
    };

    isLogin = () => {
        return this.getMe().then((me) => {
            return !!me;
        });
    };

    getUsers = (startKey=null) => {
        return Network.instance.post({
            module_name: 'cloud.auth.get_users',
            start_key: startKey,
            limit: 500,
        });
    };

    getUser = (userId) => {
        return Network.instance.post({
            module_name: 'cloud.auth.get_user',
            user_id: userId
        });
    };

    updateUser = (userId, item) => {
        return Network.instance.post({
            module_name: 'cloud.auth.update_user',
            user_id: userId,
            user: item,
        });
    };

    userCount = () => {
        return Network.instance.post({
            module_name: 'cloud.auth.get_user_count',
            count_system_user: false
        });
    }

    deleteUser = (user_id) => {
        return Network.instance.post({
            module_name: 'cloud.auth.delete_user',
            user_id
        });
    };

    deleteMyMembership = () => {
        return Network.instance.post({
            module_name: 'cloud.auth.delete_my_membership',
        });
    };

    setMe = (field, value) => {
        return Network.instance.post({
            module_name: 'cloud.auth.set_me',
            field, value
        });
    };

}

export default Auth;
