import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AlbumDropdown from "../AlbumDropdown";

describe("AlbumDropdown", () => {
  const albumsArray = ["Food", "Travel", "People"];
  it("renders input and filters albums", () => {
    const setAlbumName = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <AlbumDropdown
        albumsArray={albumsArray}
        albumName=""
        setAlbumName={setAlbumName}
      />
    );
    const input = getByPlaceholderText("Select or create album");
    fireEvent.changeText(input, "Tr");
    expect(getByText("Travel")).toBeTruthy();
  });

  it("calls setAlbumName when an album is selected", () => {
    const setAlbumName = jest.fn();
    const { getByText } = render(
      <AlbumDropdown
        albumsArray={albumsArray}
        albumName=""
        setAlbumName={setAlbumName}
      />
    );
    fireEvent.press(getByText("Food"));
    expect(setAlbumName).toHaveBeenCalledWith("Food");
  });
});
