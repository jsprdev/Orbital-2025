export interface Photo {
  id: string;
  userId: string;
  url: string;
  createdAt: any;
  storagePath: string;
  albumName?: string;
};

export interface UploadPhoto {
  uri: string;
  name: string;
  type: string;
}