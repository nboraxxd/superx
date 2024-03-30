import envConfig from '@/config'
import { MongoClient } from 'mongodb'

const uri = `mongodb+srv://${envConfig.DATABASE_USERNAME}:${envConfig.DATABASE_PASSWORD}@ap-southeast-1.5mtehqr.mongodb.net/?retryWrites=true&w=majority&appName=${envConfig.DATABASE_CLUSTER}`

class DatabaseService {
  private client: MongoClient

  constructor() {
    this.client = new MongoClient(uri)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.client.db('admin').command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close()
    }
  }
}

// Create a new object of the DatabaseService class
const databaseService = new DatabaseService()
export default databaseService
