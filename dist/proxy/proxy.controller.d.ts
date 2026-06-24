import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
export declare class ProxyController {
    private readonly proxyService;
    constructor(proxyService: ProxyService);
    getProducts(req: Request, res: Response, correlationId: string): Promise<void>;
    createProduct(req: Request, res: Response, correlationId: string): Promise<void>;
    updateProduct(req: Request, res: Response, correlationId: string): Promise<void>;
    getChannels(req: Request, res: Response, correlationId: string): Promise<void>;
    createChannel(req: Request, res: Response, correlationId: string): Promise<void>;
    updateChannel(req: Request, res: Response, correlationId: string): Promise<void>;
    getTemplates(req: Request, res: Response, correlationId: string): Promise<void>;
    createTemplate(req: Request, res: Response, correlationId: string): Promise<void>;
    updateTemplate(req: Request, res: Response, correlationId: string): Promise<void>;
    deleteTemplate(req: Request, res: Response, correlationId: string): Promise<void>;
    getNotifications(req: Request, res: Response, correlationId: string): Promise<void>;
    sendNotification(req: Request, res: Response, correlationId: string): Promise<void>;
}
