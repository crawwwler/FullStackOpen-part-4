const helper = require('./utils/list_helper')

const x = async () => {
    return await helper.inDB()
}


console.log(x)