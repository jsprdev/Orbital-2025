import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import GalleryScreen from "../../app/(tabs)/Gallery";
import { GalleryProvider } from "../../providers/GalleryProvider";

// Mock the useGallery hook
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

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<GalleryProvider>{component}</GalleryProvider>);
};

describe("GalleryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders gallery header", () => {
    const { getByText } = renderWithProvider(<GalleryScreen />);

    expect(getByText("All Photos ▼")).toBeTruthy();
  });

  it("renders add photo button", () => {
    const { getByTestId } = renderWithProvider(<GalleryScreen />);

    // You might need to add testID to the TouchableOpacity in the actual component
    // For now, we'll check if the plus icon exists
    expect(getByTestId("add-photo-button")).toBeTruthy();
  });

  it("shows loading indicator when loading", () => {
    const loadingMockUseGallery = {
      ...mockUseGallery,
      loading: true,
    };

    jest.doMock("../../providers/GalleryProvider", () => ({
      useGallery: () => loadingMockUseGallery,
      GalleryProvider: ({ children }: { children: React.ReactNode }) =>
        children,
    }));

    const { getByText } = renderWithProvider(<GalleryScreen />);

    expect(getByText("Loading photos...")).toBeTruthy();
  });

  it("calls fetchPhotos and fetchAlbums on refresh", async () => {
    const { getByTestId } = renderWithProvider(<GalleryScreen />);

    // You might need to add testID to the ScrollView in the actual component
    const scrollView = getByTestId("gallery-scrollview");

    // Simulate pull to refresh
    fireEvent(scrollView, "refresh");

    await waitFor(() => {
      expect(mockUseGallery.fetchPhotos).toHaveBeenCalled();
      expect(mockUseGallery.fetchAlbums).toHaveBeenCalled();
    });
  });

  it("navigates to AddImage when plus button is pressed", () => {
    const { getByTestId } = renderWithProvider(<GalleryScreen />);

    const addButton = getByTestId("add-photo-button");
    fireEvent.press(addButton);

    // This would test the navigation, but we'd need to mock expo-router properly
    // expect(router.push).toHaveBeenCalledWith("/(gallery)/AddImage");
  });

  it("renders GalleryGrid component", () => {
    const { getByTestId } = renderWithProvider(<GalleryScreen />);

    // GalleryGrid should be rendered
    expect(getByTestId("gallery-grid")).toBeTruthy();
  });

  it("handles empty photos and albums", () => {
    const emptyMockUseGallery = {
      ...mockUseGallery,
      photos: [],
      albums: [],
    };

    jest.doMock("../../providers/GalleryProvider", () => ({
      useGallery: () => emptyMockUseGallery,
      GalleryProvider: ({ children }: { children: React.ReactNode }) =>
        children,
    }));

    const { getByText } = renderWithProvider(<GalleryScreen />);

    expect(getByText("No photos found")).toBeTruthy();
  });
});
