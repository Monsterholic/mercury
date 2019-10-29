export interface OptionsMap {
    appName: string;
    brokerHostName: string;
    brokerUserName: string;
    brokerPassword: string;
    serviceName: string;
    retryDelay: number;
    filterMessages: boolean;
}

export interface MessageBus {
    configure(args: OptionsMap): Promise<boolean>;
    terminate(): Promise<boolean>;
}
