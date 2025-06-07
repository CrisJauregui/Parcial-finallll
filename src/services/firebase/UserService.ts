import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase-config";
import { UserType } from "../../utils/types/Types";

export async function fetchUsers(): Promise<UserType[]> {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const users: UserType[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            username: data.username || "Unknown",
        };
    });
    return users;
}