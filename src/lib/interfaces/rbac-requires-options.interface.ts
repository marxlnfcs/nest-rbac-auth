export interface IRbacRequiresOptions<Metadata extends object = any> {
    skipValidation?: boolean;
    description?: string;
    meta?: Metadata;
}