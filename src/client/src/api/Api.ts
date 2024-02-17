import {IApi} from "../models/IApi";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Api implements IApi {
    async getFormulas(): Promise<string[]> {
        return ["a", "b", "c"];
    }
}