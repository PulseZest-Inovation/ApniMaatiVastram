import { Timestamp } from "firebase/firestore";

export interface PageType{
    id: string;
    modifiedAt: Timestamp;
    title: string;
    content: string;
}