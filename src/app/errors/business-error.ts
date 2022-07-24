export default class BusinessError {
    public type: string;
    public message: string;
    public extraInfo: any[];
    public errorLocation: string;
    public data: any;
    constructor(type: string, message: string, extraInfo: any[], errorLocation: string, data: any = {}) {
        this.type = type;
        this.message = message;
        this.extraInfo = extraInfo;
        this.errorLocation = errorLocation;
        this.data = data;
    }
};