export type Permission = `${"create" | "read" | "update" | "delete"}: ${string}`;

export const Actions = ["create", "read", "update", "delete"]

export const Resources = ["event",
    "profile",
    "progress", 
    "report", 
    " notification",
    "mentor"
] as const;
