export type User = {
    "_id": string,
    "name": string,
    "email": string,
    "role": "user" | "admin",
    "createdAt": string,
    "status": string,
    "verificationStatus": {
        "identityVerified": boolean,
        "emailVerified": boolean,
        "phoneVerified": boolean
    },
    "profile": {
        "avatar": string,
        "bio": string,
        "contactInfo": {}
    },
    "updatedAt": string
}