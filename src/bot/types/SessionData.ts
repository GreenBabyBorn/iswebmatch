import { type Profile } from "@prisma/client";

interface SessionData {
  myProfile: Profile;
  profiles?: Array<Profile>;
  shownProfile?: number;
  route:
    | "idle"
    | "profile"
    | "fillProfileAge"
    | "fillProfileSex"
    | "fillProfileInterest"
    | "fillProfileCity"
    | "fillProfileName"
    | "fillProfileDescription"
    | "fillProfileMedia"
    | "fillProfileConfirm"
    | "updateProfileDescription"
    | "updateProfileMedia"
    | "showNewProfiles"
    | "pauseShow"
    | "showMatchesProfiles";
}

export { SessionData };
