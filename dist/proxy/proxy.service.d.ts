import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
export declare class ProxyService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    proxyRequest(method: string, path: string, request: Request, correlationId: string): Promise<{
        status: any;
        data: any;
    }>;
}
