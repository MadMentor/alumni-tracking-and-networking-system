import axiosInstance from "./axiosInstance";

function getProfileIdHeader(profileId: number) {
    return { "X-Profile-Id": profileId };
}

// Follow a user
export async function followUser(profileId: number, targetId: number) {
    await axiosInstance.post(
        `/profiles/${profileId}/follows/${targetId}`,
        null,
        { headers: getProfileIdHeader(profileId) }
    );
}

// Unfollow a user
export async function unfollowUser(profileId: number, targetId: number) {
    await axiosInstance.delete(
        `/profiles/${profileId}/follows/${targetId}`,
        { headers: getProfileIdHeader(profileId) }
    );
}

// Fetch all following IDs
export async function fetchFollowingIds(profileId: number): Promise<number[]> {
    const res = await axiosInstance.get<number[]>(
        `/profiles/${profileId}/follows/following/ids`,
        { headers: getProfileIdHeader(profileId) }
    );
    return res.data;
}

// Optional: fetch connection status between current user and target
export async function fetchConnectionStatus(profileId: number, targetId: number) {
    const res = await axiosInstance.get<string>(
        `/profiles/${profileId}/follows/status/${targetId}`,
        { headers: getProfileIdHeader(profileId) }
    );
    return res.data; // "CONNECTED" | "FOLLOWED" | "NONE"
}
