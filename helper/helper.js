const path = require("path");

const getFileInfo = async(file, folder) => {

    let result = {}

    result.file_name = file.name
    result.file_path = `/public/${folder}/`
    result.file_rand_name =  require('crypto').randomBytes(12).toString('hex') + path.extname(file.name);

    return result;
}

module.exports = {getFileInfo}