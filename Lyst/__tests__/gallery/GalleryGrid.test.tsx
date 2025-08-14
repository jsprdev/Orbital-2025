import React from "react";
import { render } from "@testing-library/react-native";
import GalleryGrid from "../../app/(gallery)/GalleryGrid";
import { GalleryProvider } from "../../providers/GalleryProvider";

// Mock the useGallery data
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
      albumId: "album1",
    },
    {
      id: "3",
      userId: "u1",
      url: "url3",
      createdAt: new Date(),
      storagePath: "",
      albumId: "album2",
    },
    {
      id: "4",
      userId: "u1",
      url: "url4",
      createdAt: new Date(),
      storagePath: "",
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
  deletePhoto: jest.fn(),
};

jest.mock("../../providers/GalleryProvider", () => ({
  useGallery: () => mockUseGallery,
  GalleryProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<GalleryProvider>{component}</GalleryProvider>);
};

describe("GalleryGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders album sections and photo counts", () => {
    const { getByText } = renderWithProvider(<GalleryGrid />);

    expect(getByText("Food (2)")).toBeTruthy();
    expect(getByText("Travel (1)")).toBeTruthy();
  });

  it("renders uncategorized photos", () => {
    const { getByText } = renderWithProvider(<GalleryGrid />);

    expect(getByText("Uncategorized (1)")).toBeTruthy();
  });

  it("renders See All button for each album", () => {
    const { getAllByText } = renderWithProvider(<GalleryGrid />);

    const seeAllButtons = getAllByText("See All");
    expect(seeAllButtons).toHaveLength(3);
  });
});
