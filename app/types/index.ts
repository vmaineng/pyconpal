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