// export const apiBaseUrl: string = 'https://kostnad.skogkurs.no/api/v0/'
export const apiBaseUrl: string = (process.env.NODE_ENV === 'production') ? '/api/v0/' : 'http://localhost:80/api/v0/'
