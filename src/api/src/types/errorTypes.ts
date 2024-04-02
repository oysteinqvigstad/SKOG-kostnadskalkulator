export class BadRequestError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BadRequestErrorCustom'
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'NotFoundError'
    }
}


export class DatabaseError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'DatabaseError'
    }
}

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AuthenticationError'
    }
}

