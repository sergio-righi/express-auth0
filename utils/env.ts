import dotenv from 'dotenv'
import convict from 'convict'

dotenv.config()
export default convict({
  env: {
    default: 'dev',
    env: 'NODE_ENV',
  },
  http: {
    port: {
      doc: 'The port to listen on',
      default: 4000,
      env: 'PORT',
    },
    host: {
      default: 'http://localhost',
      env: 'HOST',
    },
  },
  api: {
    doc: 'Auth key for making requests',
    default: '',
    env: 'API_KEY',
  },
  mongoose: {
    doc: 'Mongoose connection string',
    default: 'mongodb://127.0.0.1:27017/auth0',
    env: 'MONGODB_URI',
  },
  url: {
    frontend: {
      default: 'http://localhost:3000',
      env: 'FRONTEND_URL',
    },
    backend: {
      default: 'http://localhost:4000',
      env: 'BACKEND_URL',
    },
  },
  cors: {
    default: '/*/',
    env: 'CORS_ORIGIN',
  },
  mail: {
    gmail: {
      account: {
        default: '',
        env: 'GMAIL_ACCOUNT',
      },
      clientID: {
        default: '',
        env: 'GMAIL_CLIENT_ID',
      },
      clientSecret: {
        default: '',
        env: 'GMAIL_SECRET',
      },
      refreshToken: {
        default: '',
        env: 'GMAIL_REFRESH_TOKEN',
      },
    },
  },
  authentication: {
    secret: {
      doc: 'The signing key for the AUTH',
      default: '',
      env: 'AUTH_SECRET',
    },
    iv: {
      doc: 'The signing iv for the AUTH',
      default: '',
      env: 'AUTH_IV',
    },
    accessToken: {
      expiresIn: {
        doc: 'expressed in seconds or a string describing a time span zeit/ms.',
        default: '10m',
        env: 'JWT_EXPIRES_IN',
      },
    },
    refreshToken: {
      expiresIn: {
        doc: 'expressed in seconds or a string describing a time span zeit/ms.',
        default: '24h',
        env: 'REFRESH_JWT_EXPIRES_IN',
      },
    },
  },
  provider: {
    github: {
      clientID: {
        doc: 'The Client ID from Github to use for authentication',
        default: '',
        env: 'GITHUB_CLIENT_ID',
      },
      clientSecret: {
        doc: 'The Client Secret from Github to use for authentication',
        default: '',
        env: 'GITHUB_SECRET',
      },
      scope: {
        default: ['read:user'],
      },
    },
    google: {
      clientID: {
        doc: 'The Client ID from Google to use for authentication',
        default: '',
        env: 'GOOGLE_CLIENT_ID',
      },
      clientSecret: {
        doc: 'The Client Secret from Google to use for authentication',
        default: '',
        env: 'GOOGLE_SECRET',
      },
      scope: {
        default: ['profile email'],
      },
    }
  },
}).validate()
