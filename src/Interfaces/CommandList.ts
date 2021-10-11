export interface CommandList {
    id: string;
    application_id: string;
    name: string;
    description?: string;
    version: string;
    default_permission: boolean;
    type: number;
    guild_id: string;
}