import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import {
  getPartnerDetails,
  uploadCoupleAnniversaryDate,
} from "@/utils/partner.api";

interface PartnerContextType {
  partnerName: string;
  partnerUserId: string;
  anniversaryDate: Date | undefined;
  uploadAnniversaryDate: (date: Date) => Promise<void>;
  fetchPartner: () => Promise<void>;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export const PartnerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAuth();
  const [partnerName, setPartnerName] = useState<string>("");
  const [partnerUserId, setPartnerUserId] = useState<string>("");
  const [anniversaryDate, setAnniversaryDate] = useState<Date | undefined>();

  const fetchPartner = async () => {
    if (!token) {
      setPartnerUserId("");
      return;
    }
    try {
      const { partnerUserId, name, anniversaryDate } = await getPartnerDetails(token);

      setPartnerName(name);
      setPartnerUserId(partnerUserId);

      let convertedDate: Date | undefined;
      if (anniversaryDate._seconds) {
        convertedDate = new Date(anniversaryDate._seconds * 1000);
      }
      setAnniversaryDate(convertedDate);
    } catch (error) {
      console.error("Error fetching partner details", error);
    }
  };

  useEffect(() => {
    fetchPartner();
  }, [token]);

  const uploadAnniversaryDate = async (date: Date) => {
    if (!token) {
      return;
    }
    try {
      console.log("1");
      await uploadCoupleAnniversaryDate(token, date);
      await fetchPartner();
    } catch (error: any) {
      console.error("Error uploading anniversary date", error);
      throw error;
    }
  };

  return (
    <PartnerContext.Provider
      value={{
        partnerName,
        partnerUserId,
        anniversaryDate,
        uploadAnniversaryDate,
        fetchPartner
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error("usePartner must be used within a PartnerProvider");
  }
  return context;
};
