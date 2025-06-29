import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import GalleryScreen from "../../app/(tabs)/Gallery";
import { GalleryProvider } from "../../providers/GalleryProvider";

// Mock useGallery hook
const mockUseGallery = {
  photos: [
    {
      id: "1",
      userId: "u1",
      url: "url1",
      createdAt: new Date(),
      storagePath: "",
      albumId: "album1",
    },
    {
      id: "2",
      userId: "u1",
      url: "url2",
      createdAt: new Date(),
      storagePath: "",
      albumId: "album2",
    },
  ],
  albums: [
    {
      id: "album1",
      userId: "u1",
      name: "Food",
      createdAt: new Date(),
    },
    {
      id: "album2",
      userId: "u1",
      name: "Travel",
      createdAt: new Date(),
    },
  ],
  loading: false,
  fetchPhotos: jest.fn(),
  fetchAlbums: jest.fn(),
  deletePhoto: jest.fn(),
};

jest.mock("../../providers/GalleryProvider", () => ({
  useGallery: () => mockUseGallery,
  GalleryProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<GalleryProvider>{component}</GalleryProvider>);
};

describe("GalleryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders gallery header", () => {
    const { getByTestId } = renderWithProvider(<GalleryScreen />);
    expect(getByTestId("gallery-header")).toBeTruthy();
  });

  it("renders add photo button", () => {
    const { getByTestId } = renderWithProvider(<GalleryScreen />);
    expect(getByTestId("add-icon")).toBeTruthy();
  });

  it("renders GalleryGrid component", () => {
    const { getByTestId } = renderWithProvider(<GalleryScreen />);
    expect(getByTestId("photo-grid")).toBeTruthy();
  });
});
