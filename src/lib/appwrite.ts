import { Client, Account, TablesDB, Storage} from 'appwrite';

export const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 

export const account = new Account(client);
export const database = new TablesDB(client);
export const storage = new Storage(client);

export { ID, Query} from 'appwrite';
