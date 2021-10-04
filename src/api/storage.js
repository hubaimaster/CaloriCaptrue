import Network from "./network";


class Storage {

    downloadB64 = (fileId, use_plain=false) => {
        return Network.instance.post({
            module_name: 'cloud.storage.download_b64',
            file_id: fileId,
            use_plain: use_plain
        })
    };

    uploadB64 = (fileB64, use_plain=false) => {
        return Network.instance.post({
            module_name: 'cloud.storage.upload_b64',
            file_b64: fileB64,
            use_plain: use_plain
        });
    };

    getBase64(file) {
        return new Promise(function(resolve, reject){
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                if (reader.result.startsWith('data:image/png')){
                    let result = reader.result.replace('data:image/png;base64,', '');
                    resolve(result);
                }else if (reader.result.startsWith('data:image/jpg') || reader.result.includes('data:image/jpeg')){
                    let result = reader.result.replace('data:image/jpeg;base64,', '');
                    resolve(result);
                }else{
                    resolve(file);
                }
            };
            reader.onerror = function (error) {
                reject(error);
                console.log('Error: ', error);
            };
        });
    }

    uploadFile(file, use_plain=false){
        return this.getBase64(file).then(function(fileB64){
            return Network.instance.post({
                module_name: 'cloud.storage.upload_b64',
                file_b64: fileB64,
                use_plain: use_plain
            });
        })
    }

}

export default Storage;