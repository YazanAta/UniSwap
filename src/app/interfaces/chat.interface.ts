export interface Chat {
    id?: string;
    user1Id: string;
    user2Id: string;
    messages: Message[];
}

export interface Message {
    sentBy: string;
    content: string;
    timestamp: firebase.default.firestore.FieldValue;
}