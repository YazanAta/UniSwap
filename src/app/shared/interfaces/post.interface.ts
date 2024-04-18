export interface Post {

    id?: string,
    title?: string,
    description?: string,
    category?: string,
    subCategory?: string,
    subSubCategory?: string,
    pricing?: string,
    condition?: string,
    price?: string,
    image?: string | null,
    createdAt?: Date,

    ownerId?: string,

    state?: PostState,

    requestId?: string,

    requestFrom?:{
        id,
        name,
    } 
}

export type PostState = 'pending' | 'approved' | 'rejected' | 'waiting' | 'swapped' | 'deleted';
