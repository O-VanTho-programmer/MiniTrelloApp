export interface ActivityLog {
    id: string;
    board_id: string;
    user_id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'MOVE' | 'ASSIGN' | 'UNASSIGN';
    entity_type: 'CARD' | 'TASK';
    entity_id: string;
    details: string;
    created_at: string;
}
