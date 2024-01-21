import { type Profile } from "@prisma/client";

interface SessionData {
  myProfile: Profile;
  profiles?: Array<Profile>;
  shownMatchProfile?: number;
  activeMatchProfile?: Profile;
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
    | "chooseMatchesProfiles"
    | "showMatchesProfiles";
}

export { SessionData };
