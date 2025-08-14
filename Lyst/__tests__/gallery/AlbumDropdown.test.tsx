import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AlbumDropdown from "../../app/(gallery)/AlbumDropdown";
import { GalleryProvider } from "../../providers/GalleryProvider";

// Mock the useGallery hook
const mockUseGallery = {
  albums: [
    {
      id: "album1",
      userId: "user1",
      name: "Food",
      createdAt: new Date(),
    },
    {
      id: "album2",
      userId: "user1",
      name: "Travel",
      createdAt: new Date(),
    },
    {
      id: "album3",
      userId: "user1",
      name: "People",
      createdAt: new Date(),
    },
  ],
  photos: [
    {
      id: "1",
      userId: "user1",
      url: "url1",
      createdAt: new Date(),
      storagePath: "",
      albumId: "album1",
    },
    {
      id: "2",
      userId: "user1",
      url: "url2",
      createdAt: new Date(),
      storagePath: "",
      albumId: "album2",
    },
  ],
};

jest.mock("../../providers/GalleryProvider", () => ({
  useGallery: () => mockUseGallery,
  GalleryProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<GalleryProvider>{component}</GalleryProvider>);
};

describe("AlbumDropdown", () => {
  const mockSetAlbumName = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all albums by their name", () => {
    const { getByPlaceholderText, getByText } = renderWithProvider(
      <AlbumDropdown albumName="" setAlbumName={mockSetAlbumName} />
    );

    const input = getByPlaceholderText("Select existing or enter new album");
    fireEvent.changeText(input, "Travel");

    expect(getByText("Travel")).toBeTruthy();
  });

  it("field is populated when an album is selected", () => {
    const { getByPlaceholderText, getByText } = renderWithProvider(
      <AlbumDropdown albumName="" setAlbumName={mockSetAlbumName} />
    );

    fireEvent.changeText(
      getByPlaceholderText("Select existing or enter new album"),
      "Fo"
    );

    fireEvent.press(getByText("Food"));
    expect(mockSetAlbumName).toHaveBeenCalledWith("Food");
  });

  it("opens and close dropdown when albums icon is pressed", () => {
    const { getByText, queryByText, getByTestId } = renderWithProvider(
      <AlbumDropdown albumName="" setAlbumName={mockSetAlbumName} />
    );

    expect(queryByText("Food")).toBeFalsy();
    const albumsIcon = getByTestId("album-icon");
    fireEvent.press(albumsIcon);
    expect(getByText("Food")).toBeTruthy();
    fireEvent.press(albumsIcon);
    expect(queryByText("Food")).toBeFalsy();
  });

  it("filters out empty albums", () => {
    const mockWithEmptyAlbum = {
      ...mockUseGallery,
      albums: [
        ...mockUseGallery.albums,
        {
          id: "empty-album",
          userId: "u1",
          name: "",
          createdAt: new Date(),
        },
      ],
    };

    jest.doMock("../../providers/GalleryProvider", () => ({
      useGallery: () => mockWithEmptyAlbum,
      GalleryProvider: ({ children }: { children: React.ReactNode }) =>
        children,
    }));

    const { queryByText } = renderWithProvider(
      <AlbumDropdown albumName="" setAlbumName={mockSetAlbumName} />
    );

    // Empty album should not appear in dropdown
    expect(queryByText("")).toBeFalsy();
  });
});
