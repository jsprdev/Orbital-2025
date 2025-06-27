import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PhotoCard from "../../app/(gallery)/PhotoCard";

const mockPhoto = {
  id: "test-id",
  userId: "user-1",
  url: "https://example.com/photo.jpg",
  createdAt: new Date(),
  storagePath: "images/test.jpg",
  albumId: "WVQI5GMQW2",
};

describe("PhotoCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads the image with correct source", () => {
    const { getByTestId } = render(
      <PhotoCard photo={mockPhoto} onDelete={jest.fn()} />
    );

    const image = getByTestId("photo");
    expect(image.props.source.uri).toBe(mockPhoto.url);
  });

  /** 
  it("calls onDelete with the correct id when trash is pressed", async () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <PhotoCard photo={mockPhoto} onDelete={onDelete} />
    );

    const image = getByTestId("photo");

    // Simulate image load to make delete button visible
    fireEvent(image, "loadEnd");

    // Wait for the delete button to appear
    await waitFor(() => {
      const trashButton = getByTestId("delete-button");
      fireEvent.press(trashButton);
    });

    expect(onDelete).toHaveBeenCalledWith("test-id");
  });

  it("shows delete and heart buttons after image loads", async () => {
    const { getByTestId, queryByTestId } = render(
      <PhotoCard photo={mockPhoto} onDelete={jest.fn()} />
    );

    const image = getByTestId("photo");

    // Initially buttons should not be visible (loading is false)
    expect(queryByTestId("delete-button")).toBeNull();

    // Simulate image load
    fireEvent(image, "loadEnd");

    await waitFor(() => {
      expect(getByTestId("delete-button")).toBeTruthy();
    });
  });
  */
});
