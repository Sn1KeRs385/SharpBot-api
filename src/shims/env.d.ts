// @ts-ignore

namespace NodeJS {
  interface ProcessEnv {
    DB_DEFAULT_CONNECTION?: 'pg';

    DB_PG_CLIENT?: string;
    DB_PG_HOST?: string;
    DB_PG_PORT?: string;
    DB_PG_DATABASE?: string;
    DB_PG_USER?: string;
    DB_PG_PASSWORD?: string;

    REDIS_HOST?: string;
    REDIS_PORT?: string;

    TELEGRAM_BOT_API_KEY: string;
  }
}
