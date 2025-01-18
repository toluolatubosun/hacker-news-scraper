interface APIResponse<T = any> {
    message: string;
    data: T;
    success: T extends null ? false : boolean;
}