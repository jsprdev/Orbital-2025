import axiosInstance from "./index";

export const getPartnerDetails = async (token: string) => {
  try {
    const response = await axiosInstance.get("/api/partner/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.partnerDetails;
  } catch (error: any) {
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error; 
  }
}

export const uploadCoupleAnniversaryDate = async (token: string, date: Date) => {
  try {
    const response = await axiosInstance.post("/api/partner/anniversaryDate", 
      { date: date.toISOString() },
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.partnerDetails;
  } catch (error: any) {
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error; 
  }
}

export const generateCode = async (token: string) => {
  try {
    const response = await axiosInstance.get("/api/partner/generate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.code;
  } catch (error: any) {
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error; 
  }
}

export const joinCode = async (token: string, code: string) => {
  try {
    const response = await axiosInstance.post("/api/partner/join", 
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}` }
      }
    );
    return response.data.code;
  } catch (error: any) {
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error; 
  }
}