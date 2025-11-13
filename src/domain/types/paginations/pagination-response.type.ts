export type PaginationResponse<T> = {
	data: T[];
	page: number;
	total: number;
};
