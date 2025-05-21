export interface SubscriptionPackage {
    credits: number;
    price: number;
    label: string;
    best?: boolean;
}

export interface SubscriptionFormData {
    input: string;
}

export class SubscriptionModel {
    private data: SubscriptionFormData;

    constructor(data: SubscriptionFormData) {
        this.data = data;
    }

    validate(): string | null {
        if (!this.data.input) {
            return 'Please enter an amount';
        }
        const amount = parseInt(this.data.input, 10);
        if (isNaN(amount) || amount < 10) {
            return 'Minimum amount is 10 credits';
        }
        return null;
    }

    toJSON(): { amount: number } {
        return {
            amount: parseInt(this.data.input, 10)
        };
    }

    static getPackages(): SubscriptionPackage[] {
        return [
            { credits: 50, price: 10, label: "Basic" },
            { credits: 150, price: 30, label: "Popular", best: true },
            { credits: 500, price: 100, label: "Power User" }
        ];
    }
} 