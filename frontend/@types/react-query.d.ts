import "@tanstack/react-query";

interface MyMeta extends Record<string, any> {
    onError?: (error: any) => void;
}

declare module "@tanstack/react-query" {
    interface Register {
        queryMeta: MyMeta;
    }
}
