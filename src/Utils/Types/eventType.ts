export interface Event { 
    id?: string;
    title: string;
    description: string;
    start_date:Date;
    end_date:Date;
    created_by?: string;
    created_at?: Date;
    updated_at?: Date

}