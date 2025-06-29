import React, { act } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MansonryPhotoCard from "../../app/(gallery)/MasonryPhotoCard";
import { Image } from "react-native";

const mockPhoto = {
  id: "1",
  albumId: "test-album",
  createdAt: new Date(),
  storagePath: "test-path.app/test-image",
  url: "https://example.com/photo.jpg",
  userId: "test-id"
};

describe("MansonryPhotoCard", () => {
  beforeAll(() => {
    jest
      .spyOn(Image, "getSize")
      .mockImplementation(
        (uri: string, success: (w: number, h: number) => void) => {
          success(400, 200); // simulate a successful image load
        }
      );
  });

  it("renders image", async () => {
    const { getByTestId, queryByTestId } = render(
      <MansonryPhotoCard
        photo={mockPhoto}
        onDelete={jest.fn()}
        toggleDeleteIcons={true}
      />
    );
    await waitFor(() => {
      expect(getByTestId("image")).toBeTruthy();
    });
  });

  it("doesnt show delete button when toggleDeleteIcons is false", async () => {
    const { queryByTestId } = render(
      <MansonryPhotoCard
        photo={mockPhoto}
        onDelete={jest.fn()}
        toggleDeleteIcons={false}
      />
    );
    await waitFor(() => {
      expect(queryByTestId("delete-button")).toBeNull();
    });
  });

  it("shows delete button when toggleDeleteIcons is true", async () => {
    const { getByTestId } = render(
      <MansonryPhotoCard
        photo={mockPhoto}
        onDelete={jest.fn()}
        toggleDeleteIcons={true}
      />
    );
    await waitFor(() => {
      expect(getByTestId("trash-icon")).toBeTruthy();
    });
  });

  it("calls onDelete when delete button is pressed", async () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <MansonryPhotoCard
        photo={mockPhoto}
        onDelete={onDelete}
        toggleDeleteIcons={true}
      />
    );
    await waitFor(() => {
      fireEvent.press(getByTestId("trash-icon"));
      expect(onDelete).toHaveBeenCalledWith("1");
    });
  });

});
