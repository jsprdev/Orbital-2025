import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import AddImageScreen from "../../app/(gallery)/AddImage";
import { GalleryProvider } from "../../providers/GalleryProvider";
import { Alert } from "react-native";

// Mocking Alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});
jest.useFakeTimers();

// Mock the useGallery hook
const mockUseGallery = {
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
  photos: [],
  loading: false,
  uploadPhoto: jest.fn(),
  addAlbum: jest.fn(),
  fetchAlbums: jest.fn(),
};

jest.mock("../../providers/GalleryProvider", () => ({
  useGallery: () => mockUseGallery,
  GalleryProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

// Mock expo-image-picker
jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "test-image-uri" }],
    })
  ),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "camera-image-uri" }],
    })
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<GalleryProvider>{component}</GalleryProvider>);
};

describe("AddImageScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders add photo header", () => {
    const { getByText } = renderWithProvider(<AddImageScreen />);
    expect(getByText("Add Photo")).toBeTruthy();
  });

  it("renders album dropdown", () => {
    const { getByText } = renderWithProvider(<AddImageScreen />);
    expect(getByText("Album (Optional)")).toBeTruthy();
  });

  it("handles camera capture", async () => {
    const { getByTestId } = renderWithProvider(<AddImageScreen />);
    await act(async () => {
      const cameraButton = getByTestId("camera-button");
      fireEvent.press(cameraButton);
    });
    await act(async () => {
      expect(getByTestId("image-carousel")).toBeTruthy();
    });
  });

  it("shows upload button when images are selected", async () => {
    const { getByText, getByTestId } = renderWithProvider(<AddImageScreen />);
    const uploadButton = getByText("Upload");
    expect(uploadButton).toBeTruthy();
    await act(async () => {
      const pickImageButton = getByTestId("sample-image-button");
      fireEvent.press(pickImageButton);
    });
    await act(async () => {
      expect(getByText("Upload")).toBeTruthy();
    });
  });

  it("calls uploadPhoto when upload button is pressed", async () => {
    mockUseGallery.uploadPhoto.mockResolvedValue(undefined);
    mockUseGallery.addAlbum.mockResolvedValueOnce({
      id: "album1",
      userId: "u1",
      name: "New Album",
      createdAt: new Date(),
    });
    const { getByText, getByTestId, getByPlaceholderText } = renderWithProvider(
      <AddImageScreen />
    );
    await act(async () => {
      const pickImageButton = getByTestId("sample-image-button");
      fireEvent.press(pickImageButton);
    });
    await act(async () => {
      expect(getByTestId("image-carousel")).toBeTruthy();
    });
    const albumInput = getByPlaceholderText(
      "Select existing or enter new album"
    );
    await act(async () => {
      fireEvent.changeText(albumInput, "New Album");
    });
    await act(async () => {
      const uploadButton = getByText("Upload");
      fireEvent.press(uploadButton);
    });
    await act(async () => {
      expect(mockUseGallery.uploadPhoto).toHaveBeenCalledWith("album1", [
        "test-image-uri",
      ]);
    });
  });

  it("creates new album if it doesn't exist", async () => {
    mockUseGallery.addAlbum.mockResolvedValue({
      id: "new-album-id",
      userId: "u1",
      name: "New Album",
      createdAt: new Date(),
    });
    const { getByText, getByTestId, getByPlaceholderText } = renderWithProvider(
      <AddImageScreen />
    );
    await act(async () => {
      const pickImageButton = getByTestId("sample-image-button");
      fireEvent.press(pickImageButton);
    });
    await waitFor(() => {
      const albumInput = getByPlaceholderText(
        "Select existing or enter new album"
      );
      fireEvent.changeText(albumInput, "New Album");
      const uploadButton = getByText("Upload");
      fireEvent.press(uploadButton);
      expect(mockUseGallery.addAlbum).toHaveBeenCalledWith("New Album");
    });
  });
});
