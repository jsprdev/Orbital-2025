import axiosInstance from "./index";

// GET requests
export const getPhotos = async (token: string, partnerId?: string) => {
  try {
    const response = await axiosInstance.get("/api/images", {
      params: { partnerId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.photos;
  } catch (error: any) {
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

// POST - Upload a new photo
export const uploadPhoto = async (
  token: string,
  albumId: string = "Uncategorized",
  imageUri: string[],
) => {
  try {
    console.log("123:", albumId);
    const formData = new FormData();
    formData.append("albumId", albumId);
    imageUri.forEach((uri, index) => {
      formData.append("photos", {
        uri,
        name: `photo_${Date.now()}_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });
    const response = await axiosInstance.post("/api/images", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.photo;
  } catch (error: any) {
    console.error("Error uploading photo:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

// DELETE - Delete a photo
export const deletePhoto = async (token: string, photoId: string) => {
  try {
    console.log("galleryAPI: Deleting photo:", photoId);
    const response = await axiosInstance.delete(`/api/images/${photoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw error;
  }
};
