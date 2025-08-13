class APIManager {
    private static instance: APIManager;
    private apiAddress: string;

    /** Private constructor to prevent direct instantiation */
    private constructor() {
        // Use VUE_APP_BACKEND_URL from environment variables
        this.apiAddress = process.env.VUE_APP_BACKEND_URL || '';
    }

    /** Static method to get the singleton instance */
    public static getInstance(): APIManager {
        if (!APIManager.instance) {
            APIManager.instance = new APIManager();
        }
        return APIManager.instance;
    }
}

export default APIManager;