import axios from 'axios';

export const getShopNetworks = () => axios.get(`${import.meta.env.REMOTE_API}/shop-network`);

export const getShopsByShopNetwork = (shopNetworkId: string) => axios.get(`${import.meta.env.REMOTE_API}/shop/${shopNetworkId}`);

export const getShopReceipts = (shopNetworkId: string, shopId: string, from: string, to: string) => axios.get(`${import.meta.env.REMOTE_API}/receipt/${shopNetworkId}/${shopId}`, { params: { from, to } });

export const getReceiptLines = (receiptId: Number, oneLinePattern: String, twoLinePattern1: String, twoLinePattern2: String, endLinePattern: string) => axios.get(`${import.meta.env.REMOTE_API}/receipt/${receiptId}/parse`, {
  params: {
    oneLinePattern,
    twoLinePattern1,
    twoLinePattern2,
    endLinePattern,
  },
});

export const validatedPattern = (receiptId: Number, patternType: String) => axios.put(`${import.meta.env.REMOTE_API}/Validated/${receiptId}/${patternType}`);

export const updateReceipLines = (receiptId: Number, patternType: String) => axios.put(`${import.meta.env.REMOTE_API}/receiptline/${receiptId}/${patternType}`);
