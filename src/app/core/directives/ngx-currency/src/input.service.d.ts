export declare class InputService {
    private htmlInputElement;
    private options;
    private inputManager;
    constructor(htmlInputElement: any, options: any);
    addNumber(keyCode: number): void;
    applyMask(isNumber: boolean, rawValue: string): string;
    clearMask(rawValue: string): number;
    changeToNegative(): void;
    changeToPositive(): void;
    removeNumber(keyCode: number): void;
    updateFieldValue(selectionStart?: number): void;
    updateOptions(options: any): void;
    readonly canInputMoreNumbers: boolean;
    readonly inputSelection: any;
    rawValue: string;
    readonly storedRawValue: string;
    value: number;
}
