class HTTPError {
    message: string;
    status: number;
    constructor(message: string, statusCode?: number) {
        this.message = message;
        if (!statusCode) statusCode = 500;
        this.status = statusCode;
    }
}

export { HTTPError };
