import { google } from 'googleapis';
import { GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_BASE64 } from '$env/static/private';
import type { User, DebtEntry } from '$lib/types';

const credentials = JSON.parse(Buffer.from(GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString());

const auth = new google.auth.GoogleAuth({
	credentials,
	scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = GOOGLE_SHEETS_ID;

// --- Admin ---

export async function validateAdmin(username: string, password: string): Promise<boolean> {
	const res = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: 'Admin!A:B'
	});
	const rows = res.data.values;
	if (!rows) return false;

	// Skip header row, find matching credentials
	return rows.slice(1).some((row) => row[0] === username && row[1] === password);
}

// --- Users ---

export async function getUsers(): Promise<User[]> {
	const res = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: 'Users!A:E'
	});
	const rows = res.data.values;
	if (!rows || rows.length <= 1) return [];

	return rows.slice(1).map((row) => ({
		id: row[0] || '',
		name: row[1] || '',
		phone: row[2] || '',
		total_debt: parseFloat(row[3]) || 0,
		created_at: row[4] || ''
	}));
}

export async function getUserById(id: string): Promise<User | null> {
	const users = await getUsers();
	return users.find((u) => u.id === id) || null;
}

export async function addUser(name: string, phone: string): Promise<User> {
	const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
	const created_at = new Date().toISOString().split('T')[0];
	const newUser: User = { id, name, phone, total_debt: 0, created_at };

	await sheets.spreadsheets.values.append({
		spreadsheetId,
		range: 'Users!A:E',
		valueInputOption: 'RAW',
		requestBody: {
			values: [[id, name, phone, 0, created_at]]
		}
	});

	return newUser;
}

export async function updateUserDebt(userId: string, newTotal: number): Promise<void> {
	// Find the row index for this user
	const res = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: 'Users!A:A'
	});
	const rows = res.data.values;
	if (!rows) return;

	const rowIndex = rows.findIndex((row) => row[0] === userId);
	if (rowIndex === -1) return;

	// Update total_debt column (column D, 1-indexed row)
	await sheets.spreadsheets.values.update({
		spreadsheetId,
		range: `Users!D${rowIndex + 1}`,
		valueInputOption: 'RAW',
		requestBody: {
			values: [[newTotal]]
		}
	});
}

// --- Debt History ---

export async function getDebtHistory(userId: string): Promise<DebtEntry[]> {
	const res = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: 'DebtHistory!A:F'
	});
	const rows = res.data.values;
	if (!rows || rows.length <= 1) return [];

	return rows
		.slice(1)
		.filter((row) => row[1] === userId)
		.map((row) => ({
			id: row[0] || '',
			user_id: row[1] || '',
			amount: parseFloat(row[2]) || 0,
			type: (row[3] as 'add' | 'reduce') || 'add',
			description: row[4] || '',
			date: row[5] || ''
		}))
		.reverse(); // newest first
}

export async function addDebtEntry(
	userId: string,
	amount: number,
	type: 'add' | 'reduce',
	description: string
): Promise<void> {
	const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
	const date = new Date().toISOString().replace('T', ' ').slice(0, 19);

	await sheets.spreadsheets.values.append({
		spreadsheetId,
		range: 'DebtHistory!A:F',
		valueInputOption: 'RAW',
		requestBody: {
			values: [[id, userId, amount, type, description, date]]
		}
	});

	// Update user's total debt
	const user = await getUserById(userId);
	if (user) {
		const newTotal = type === 'add' ? user.total_debt + amount : user.total_debt - amount;
		await updateUserDebt(userId, Math.max(0, newTotal));
	}
}
