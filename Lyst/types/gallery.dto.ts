export interface Photo {
  id: string;
  userId: string;
  url: string;
  createdAt: Date;
  storagePath: string;
  
};

export interface UploadPhoto {
  uri: string;
  name: string;
  type: string;
}