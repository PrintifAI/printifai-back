export enum ReplicateStatus {
    Starting = 'starting',
    Processing = 'processing',
    Succeeded = 'succeeded',
    Failed = 'failed',
    Canceled = 'canceled',
}

export type ReplicatePrediction = {
    id: string;
    error: string | null;
    status: ReplicateStatus;
    metrics: {
        predict_time?: number;
    };
    output?: string[];
};

export type ReplicateWebhookBody = {
    id: string;
    error: string | null;
};
