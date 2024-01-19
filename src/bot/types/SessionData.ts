import { type Profile } from "@prisma/client";

interface SessionData {
    myProfile: Profile;
    profiles?: Array<Profile>;
    route: "idle" | "profile" | 'fillProfileAge' | 'fillProfileSex' | 'fillProfileInterest' | 'fillProfileCity' | 'fillProfileName' | 'fillProfileDescription' | 'fillProfileMedia' | 'fillProfileConfirm';
}

export { SessionData };