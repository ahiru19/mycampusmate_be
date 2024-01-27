const path = require("path");

const getFileInfo = async(file, folder) => {

    let result = {}

    result.file_name = file.name
    result.file_path = `/public/${folder}/`
    result.file_rand_name =  require('crypto').randomBytes(12).toString('hex') + path.extname(file.name);

    return result;
}

const calculateAge = async(user_birthdate) => {
    const d = new Date();
    const birthdate = new Date(user_birthdate);
    let curr_year = d.getFullYear();
    let birth_year = birthdate.getFullYear();

    let age = parseInt(curr_year) - parseInt(birth_year); //get the age

    let curr_month = d.getMonth();
    let birth_month = birthdate.getMonth();

    if(birth_month > curr_month){
        age = age - 1;//if birth month does not come yet minus 1
    }

    return age;
}

const checkIfUserExist = async function(tbl_name, cond_for_where, cond_for_includes){
    try{
        //check if condition is null
        let where = cond_for_where
        let include = []

        if(cond_for_includes !== null){
            //always remember to pass an array of object
            include = cond_for_includes
        }

        const result = await tbl_name.findOne({
            where,
            include
        })

        if(result){
            return result
        } else{
            return false
        }
    }
    catch(e){
        console.log(e)
        return e
    }
}
module.exports = {getFileInfo, calculateAge, checkIfUserExist}