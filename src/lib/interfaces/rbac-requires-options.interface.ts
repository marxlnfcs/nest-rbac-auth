export interface IRbacRequiresOptions<Metadata extends object = any> {
    skipValidation: boolean;
    meta?: Metadata;
}