export interface User {
	id: string;
	name: string;
	phone: string;
	total_debt: number;
	created_at: string;
}

export interface DebtEntry {
	id: string;
	user_id: string;
	amount: number;
	type: 'add' | 'reduce';
	description: string;
	date: string;
}
