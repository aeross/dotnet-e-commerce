export interface ErrorResponse {
    status: number,
    title: string,
    traceId?: string,
    type?: string,
    errors?: any
}