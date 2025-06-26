import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import GalleryGrid from "../GalleryGrid";

const mockPhotos = [
  {
    id: "1",
    userId: "u1",
    url: "url1",
    createdAt: new Date(),
    storagePath: "",
    albumName: "A",
  },
  {
    id: "2",
    userId: "u1",
    url: "url2",
    createdAt: new Date(),
    storagePath: "",
    albumName: "A",
  },
  {
    id: "3",
    userId: "u1",
    url: "url3",
    createdAt: new Date(),
    storagePath: "",
    albumName: "B",
  },
];
const mockAlbums = ["A", "B"];
const mockAlbumsId = ["DFJ456JIOSDFJIO7, JIDSJSDFJKL342KL"]

describe("GalleryGrid", () => {
  it("renders album sections and photo counts", () => {
    const { getByText } = render(
      <GalleryGrid
        photos={mockPhotos}
        albums={mockAlbums}
        albumsId={mockAlbumsId}
        onDelete={jest.fn()}
      />
    );
    expect(getByText("A (2)")).toBeTruthy();
    expect(getByText("B (1)")).toBeTruthy();
  });

  it("calls onDelete with correct id when delete is pressed", () => {
    const onDelete = jest.fn();
    const { getAllByTestId } = render(
      <GalleryGrid
        photos={mockPhotos}
        albums={mockAlbums}
        albumsId={mockAlbumsId}
        onDelete={onDelete}
      />
    );
    // Find the first delete button and press it
    const deleteButtons = getAllByTestId("delete-button");
    fireEvent.press(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
