import Network from "./network";


class Logic {

    runFunction = (functionName, payload) => {
        return Network.instance.post({
            logging: true,
            module_name: 'cloud.logic.run_function',
            function_name: functionName,
            payload
        }).then((data) => {
            return data.response;
        })
    };

}

export default Logic;