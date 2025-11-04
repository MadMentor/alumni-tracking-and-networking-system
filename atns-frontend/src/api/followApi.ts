import axiosInstance from "./axiosInstance";

function getProfileIdHeader(profileId: number) {
    return { "X-Profile-Id": profileId };
}

export async function followUser(profileId: number, targetId: number) {
    await axiosInstance.post(`/profiles/${profileId}/follows/${targetId}`, null, {
        headers: getProfileIdHeader(profileId),
    });
}

export async function unfollowUser(profileId: number, targetId: number) {
    await axiosInstance.delete(`/profiles/${profileId}/follows/${targetId}`, {
        headers: getProfileIdHeader(profileId),
    });
}

export async function fetchFollowingIds(profileId: number) {
    const res = await axiosInstance.get<number[]>(`/profiles/${profileId}/follows/following`, {
        headers: getProfileIdHeader(profileId),
    });
    return res.data; // adapt depending on API response
}
