import { Authorizer } from 'casbin.js';
export interface CasbinPluginOptions {
    useGlobalProperties?: boolean;
    customProperties?: Array<string>;
}
declare const install: (app: any, authorizer: Authorizer, options?: CasbinPluginOptions) => void;
export { install };
