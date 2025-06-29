import React from "react";
import { render, waitFor, act } from "@testing-library/react-native";
import { View } from "react-native";

// Functions from Providers
import { GalleryProvider, useGallery } from "../../providers/GalleryProvider";
import { AuthProvider } from "../../providers/AuthProvider";

// Functions from the API
import { getPhotos, uploadPhoto, deletePhoto } from "../../utils/gallery.api";
import { getAlbums, addAlbum, deleteAlbum } from "../../utils/albums.api";

// Mock the API functions
jest.mock("../../utils/gallery.api", () => ({
  getPhotos: jest.fn(),
  uploadPhoto: jest.fn(),
  deletePhoto: jest.fn(),
}));

jest.mock("../../utils/albums.api", () => ({
  getAlbums: jest.fn(),
  addAlbum: jest.fn(),
  deleteAlbum: jest.fn(),
}));

// Mock the AuthProvider
jest.mock("../../providers/AuthProvider", () => ({
  useAuth: () => ({
    token: "mock-token",
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockGetPhotos = getPhotos as jest.MockedFunction<typeof getPhotos>;
const mockUploadPhoto = uploadPhoto as jest.MockedFunction<typeof uploadPhoto>;
const mockDeletePhoto = deletePhoto as jest.MockedFunction<typeof deletePhoto>;
const mockGetAlbums = getAlbums as jest.MockedFunction<typeof getAlbums>;
const mockAddAlbum = addAlbum as jest.MockedFunction<typeof addAlbum>;
const mockDeleteAlbum = deleteAlbum as jest.MockedFunction<typeof deleteAlbum>;

// ACTUAL TESTS
describe("GalleryProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Initial Stage", async () => {
    let galleryContext: any;

    const TestWrapper = () => {
      galleryContext = useGallery();
      return <View />;
    };

    render(
      <AuthProvider>
        <GalleryProvider>
          <TestWrapper />
        </GalleryProvider>
      </AuthProvider>,
    );

    expect(galleryContext.photos.length).toBe(0);
    expect(galleryContext.albums.length).toBe(0);
    expect(galleryContext.loading).toBe(true);
  });

  // fetchPhotos
  describe("fetchPhotos", () => {
    it("fetches photos correctly", async () => {
      const mockPhotos = [
        {
          id: "1",
          albumId: "123",
          userId: "u1",
          url: "url1",
          createdAt: new Date(),
          storagePath: "",
        },
      ];
      mockGetPhotos.mockResolvedValue(mockPhotos);

      let galleryContext: any;

      const TestWrapper = () => {
        galleryContext = useGallery();
        return <View />;
      };

      render(
        <AuthProvider>
          <GalleryProvider>
            <TestWrapper />
          </GalleryProvider>
        </AuthProvider>,
      );

      expect(mockGetPhotos).toHaveBeenCalledWith("mock-token");

      await waitFor(() => {
        expect(galleryContext.photos.length).toBe(1);
      });
    });

    it("handles error", async () => {
      mockGetPhotos.mockRejectedValue(new Error("API Error"));

      let galleryContext: any;

      const TestWrapper = () => {
        galleryContext = useGallery();
        return <View />;
      };

      render(
        <AuthProvider>
          <GalleryProvider>
            <TestWrapper />
          </GalleryProvider>
        </AuthProvider>,
      );

      await act(async () => {
        await galleryContext.fetchPhotos();
      });

      expect(mockGetPhotos).toHaveBeenCalled();
      expect(galleryContext.photos.length).toBe(0);
    });
  });

  describe("fetchAlbums", () => {
    it("fetches albums correctly", async () => {
      const mockAlbums = [
        { id: "123", userId: "u1", name: "Album 1", createdAt: new Date() },
      ];
      mockGetAlbums.mockResolvedValue(mockAlbums);

      let galleryContext: any;

      const TestWrapper = () => {
        galleryContext = useGallery();
        return <View />;
      };

      render(
        <AuthProvider>
          <GalleryProvider>
            <TestWrapper />
          </GalleryProvider>
        </AuthProvider>,
      );

      expect(mockGetAlbums).toHaveBeenCalledWith("mock-token");
      await waitFor(() => {
        expect(galleryContext.albums.length).toBe(1);
      });
    });

    it("handles error", async () => {
      mockGetAlbums.mockRejectedValue(new Error("API Error"));

      let galleryContext: any;

      const TestWrapper = () => {
        galleryContext = useGallery();
        return <View />;
      };

      render(
        <AuthProvider>
          <GalleryProvider>
            <TestWrapper />
          </GalleryProvider>
        </AuthProvider>,
      );

      await act(async () => {
        await galleryContext.fetchAlbums();
      });

      expect(mockGetAlbums).toHaveBeenCalled();
      expect(galleryContext.albums.length).toBe(0);
    });
  });

  describe("uploadPhoto", () => {
    it("uploads photo correctly", async () => {
      mockUploadPhoto.mockResolvedValue({ success: true });
      mockGetPhotos.mockResolvedValue([]);
      mockGetAlbums.mockResolvedValue([]);

      let galleryContext: any;

      const TestWrapper = () => {
        galleryContext = useGallery();
        return <View />;
      };

      render(
        <AuthProvider>
          <GalleryProvider>
            <TestWrapper />
          </GalleryProvider>
        </AuthProvider>,
      );

      await act(async () => {
        await galleryContext.uploadPhoto("album1", ["uri1"]);
      });

      expect(mockUploadPhoto).toHaveBeenCalledWith("mock-token", "album1", [
        "uri1",
      ]);
    });
  });

  describe("deletePhoto", () => {
    it("deletes photo correctly", async () => {
      mockDeletePhoto.mockResolvedValue(undefined);
      mockGetPhotos.mockResolvedValue([]);
      mockGetAlbums.mockResolvedValue([]);

      let galleryContext: any;

      const TestWrapper = () => {
        galleryContext = useGallery();
        return <View />;
      };

      render(
        <AuthProvider>
          <GalleryProvider>
            <TestWrapper />
          </GalleryProvider>
        </AuthProvider>,
      );

      await act(async () => {
        await galleryContext.deletePhoto("photo1");
      });

      expect(mockDeletePhoto).toHaveBeenCalledWith("mock-token", "photo1");
    });
  });

  describe("addAlbum", () => {
    it("adds album correctly", async () => {
      const newAlbum = {
        id: "new-album",
        userId: "u1",
        name: "New Album",
        createdAt: new Date(),
      };
      mockAddAlbum.mockResolvedValue(newAlbum);
      mockGetPhotos.mockResolvedValue([]);
      mockGetAlbums.mockResolvedValue([]);

      let galleryContext: any;

      const TestWrapper = () => {
        galleryContext = useGallery();
        return <View />;
      };

      render(
        <AuthProvider>
          <GalleryProvider>
            <TestWrapper />
          </GalleryProvider>
        </AuthProvider>,
      );

      await act(async () => {
        await galleryContext.addAlbum("New Album");
      });

      expect(mockAddAlbum).toHaveBeenCalledWith("mock-token", "New Album");
    });
  });

  describe("deleteAlbum", () => {
    it("deletes album correctly", async () => {
      mockDeleteAlbum.mockResolvedValue(undefined);
      mockGetPhotos.mockResolvedValue([]);
      mockGetAlbums.mockResolvedValue([]);

      let galleryContext: any;

      const TestWrapper = () => {
        galleryContext = useGallery();
        return <View />;
      };

      render(
        <AuthProvider>
          <GalleryProvider>
            <TestWrapper />
          </GalleryProvider>
        </AuthProvider>,
      );

      await act(async () => {
        await galleryContext.deleteAlbum("album1");
      });

      expect(mockDeleteAlbum).toHaveBeenCalledWith("mock-token", "album1");
    });
  });

  it("[Provider] throws error when useGallery is used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      const TestComponent = () => {
        useGallery();
        return <View />;
      };
      render(<TestComponent />);
    }).toThrow("useGallery must be used within a GalleryProvider");

    consoleSpy.mockRestore();
  });
});
