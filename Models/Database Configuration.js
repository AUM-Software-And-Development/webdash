const mongoose = require( 'mongoose' )

// Db connect
const connectDB = async () => {
   try {
      const conn = await mongoose.connect( process.env.MONGO_URI, {
         /* Suppress console warnings */
         useNewUrlParser: true,
         useUnifiedTopology: true,
      } )

      console.log( `MongoDB Connected: ${conn.connection.host}` )

   } catch (err) {

      console.error( err )
      process.exit(1)

   }
}


module.exports = connectDB