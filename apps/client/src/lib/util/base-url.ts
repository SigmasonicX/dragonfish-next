export const baseUrl =
    process.env.NODE_ENV === 'production'
        ? `https://api.offprint.net/api`
        : `http://127.0.0.1:3333/api`;
