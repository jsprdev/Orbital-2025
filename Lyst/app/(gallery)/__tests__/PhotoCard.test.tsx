import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PhotoCard from "../PhotoCard";

const mockPhoto = {
  id: "test-id",
  userId: "user-1",
  url: "https://example.com/photo.jpg",
  createdAt: new Date(),
  storagePath: "images/test.jpg",
};

describe("PhotoCard", () => {
  it("renders the image", () => {
    const { getByTestId } = render(
      <PhotoCard photo={mockPhoto} onDelete={jest.fn()} />
    );
    const image = getByTestId("photo-image");
    expect(image.props.source.uri).toBe(mockPhoto.url);
  });

  it("calls onDelete with the correct id when trash is pressed", () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <PhotoCard photo={mockPhoto} onDelete={onDelete} />
    );
    const trashButton = getByTestId("delete-button");
    fireEvent.press(trashButton);
    expect(onDelete).toHaveBeenCalledWith("test-id");
  });
});
