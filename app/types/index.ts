export interface Talk { 
    id: string;
    title: string;
    speaker: string;
    track: string;
    day: string;
    time: string;
    room: string;
    duration_minutes: number;
    description: string;
    tags: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    reply: string;
    suggested_talks?: Talk[];
}

export interface AuthRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user_id: string;
    email: string;
}

export interface User { 
    user_id: string;
    email: string;
}