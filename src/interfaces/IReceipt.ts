import type IShop from './IShop';

interface IReceipt{
    id: number;
    reference: string;
    dateCreation: string;
    originalFiles: string;
    originalFilesCount: string;
    ocrText: string;
    isValidated: string;
    shopId: string;
    Shop: string;
    shopNetworkId: string;
    shopNetwork: string;
    shop : IShop
}

export default IReceipt;
