export interface IRbacNode {
	path: string;
	description?: string|null;
}

export interface IRbacSection extends IRbacNode {
	sections: IRbacSection[];
	permissions: IRbacPermission[];
}

export interface IRbacPermission extends IRbacNode {}