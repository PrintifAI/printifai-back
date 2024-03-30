import { Config } from '../config/config';

export const getImageLink = (id: string) => {
    return `${Config.WEBHOOK_HOST}/api/query/${id}/image`;
};
