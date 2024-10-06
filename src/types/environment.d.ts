declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      DATABASE_AUTH_TOKEN?: string
    }
  }
}

export {}
