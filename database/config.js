const mongoose = require('mongoose');

const dbConnection = async() =>{


    try {
        
        await mongoose.connect(process.env.MONGODB_ATLAS);

        console.log('Base de datos online');

    } catch (error) {
        throw new Error('Error a la hora de inicar la bda');
    }

}


module.exports = {
    dbConnection,
}