import { type Profile } from "@prisma/client";

interface SessionData {
    myProfile?: Profile;
    profiles?: Array<Profile>;
    globalRoutes: "profile" | 'fillProfile';
    profileRoutes?: "1" | "2" | "3" | "4";
}

export { SessionData };