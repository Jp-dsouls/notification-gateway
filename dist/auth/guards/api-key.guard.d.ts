import { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare const PRODUCT_ID_HEADER = "x-product-id";
export declare class ApiKeyGuard implements CanActivate {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
