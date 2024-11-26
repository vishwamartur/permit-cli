import { PERMIT_API_URL } from '../config.js';

interface ApiResponseData {
	id?: string;
	name?: string;
}

type ApiResponse = {
	headers: Headers;
	response: ApiResponseData;
	status: number;
};

export const apiCall = async (
	endpoint: string,
	token: string,
	cookie?: string,
	method = 'GET',
	body?: string,
): Promise<ApiResponse> => {
	const options: RequestInit = {
		method,
		headers: {
			Accept: '*/*',
			Origin: 'https://app.permit.io',
			Authorization: `Bearer ${token}`,
			Cookie: cookie ?? '',
		},
	};

	if (body) {
		options.body = body;
	}

	const res = await fetch(`${PERMIT_API_URL}/${endpoint}`, options);
	const response: ApiResponseData = await res.json();

	return {
		headers: res.headers,
		response,
		status: res.status,
	};
};

export const fetchResourceInstances = async (token: string, cookie?: string): Promise<ApiResponse> => {
	return apiCall('v2/resource-instances', token, cookie);
};

export const fetchRoles = async (token: string, cookie?: string): Promise<ApiResponse> => {
	return apiCall('v2/roles', token, cookie);
};

export const fetchRelationships = async (token: string, cookie?: string): Promise<ApiResponse> => {
	return apiCall('v2/relationships', token, cookie);
};
