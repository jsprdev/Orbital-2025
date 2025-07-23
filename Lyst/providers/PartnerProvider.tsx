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

  useEffect(() => {
    async function fetchPartner() {
      if (!token) return;
      try {
        const { partnerUserId, name, coupleAnniversaryDate } =
          await getPartnerDetails(token);
        setPartnerName(name);
        setPartnerUserId(partnerUserId);
        setAnniversaryDate(coupleAnniversaryDate);
      } catch (error) {
        console.error("Error fetching partner details", error);
      }
    }
    fetchPartner();
  }, [token]);

  const uploadAnniversaryDate = async (date: Date) => {
    if (!token) return;
    try {
      await uploadCoupleAnniversaryDate(token, date);
      setAnniversaryDate(date);
    } catch (error: any) {
      console.error("Error uploading anniversary date", error);
    }
  };

  return (
    <PartnerContext.Provider
      value={{
        partnerName,
        partnerUserId,
        anniversaryDate,
        uploadAnniversaryDate,
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
