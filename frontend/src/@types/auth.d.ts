interface User {
    id: string;
    role: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

// Definition of types for authentication
// API Version 1

// Registration
// ============================================================
interface APIVersion1RegisterPayload {
    name: string;
    email: string;
    password: string;
}

interface APIVersion1RegisterResponse {
    user: User;
    tokens: Token;
}

// Login
// ============================================================
interface APIVersion1LoginPayload {
    email: string;
    password: string;
}
interface APIVersion1LoginResponse extends APIVersion1RegisterResponse {}
