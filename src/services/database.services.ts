import { Collection, Db, MongoClient } from 'mongodb'

import User from '@/models/schemas/User.schema'
import RefreshToken from '@/models/schemas/RefreshToken.schema'
import { envVariables } from '@/env-variables'
console.log('🔥 ~ envVariables:', envVariables.DB_USERNAME)

const uri = `mongodb+srv://${envVariables.DB_USERNAME}:${envVariables.DB_PASSWORD}@ap-southeast-1.5mtehqr.mongodb.net/?retryWrites=true&w=majority&appName=${envVariables.DB_CLUSTER}`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envVariables.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('🎉 Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('😥 Error', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(envVariables.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envVariables.DB_REFRESH_TOKENS_COLLECTION as string)
  }
}

// Create a new object of the DatabaseService class
const databaseService = new DatabaseService()
export default databaseService
