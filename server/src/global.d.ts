declare namespace NodeJS {
  export interface ProcessEnv {
    USERNAME: string;
    PASSWORD: string;
    PORT?: string;
    JWT_KEY: string;
    JWT_EXPIRE: string;
    SENDGRID_API_KEY: string;
    SERVICE: string;
    HOST: string;
    AUTH_EMAIL: string;
    AUTH_PASSWORD: string;
  }
}
