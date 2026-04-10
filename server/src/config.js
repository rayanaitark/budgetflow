const isProduction = process.env.NODE_ENV === 'production'

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/budgetflow',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  cookieName: 'budgetflow_token',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  cookieSecure: isProduction
}
