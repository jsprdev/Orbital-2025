import axiosInstance from "./index";

// GET all the albums
export const getAlbums = async (token: string, partnerId?: string) => {
  try {
    const response = await axiosInstance.get("/api/albums", {
      params: { partnerId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.albums;
  } catch (error: any) {
    console.error("Error fetching photos:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

// POST a new album
export const addAlbum = async (token: string, albumName: string) => {
  try {
    const response = await axiosInstance.post(
      "/api/albums",
      { albumName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.addedAlbum;
  } catch (error: any) {
    console.error("Error fetching photos:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

// DELETE an album
export const deleteAlbum = async (token: string, albumId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};
