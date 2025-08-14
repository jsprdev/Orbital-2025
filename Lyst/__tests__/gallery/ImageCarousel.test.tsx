import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ImageCarousel from "../../app/(gallery)/ImageCarousel";

describe("ImageCarousel", () => {
  const images = ["url1", "url2", "url3"];
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all images", () => {
    const { getAllByTestId } = render(
      <ImageCarousel images={images} onDelete={mockOnDelete} flag="" />
    );

    expect(getAllByTestId("carousel-image").length).toBe(3);
  });

  it("handles single image", () => {
    const { getAllByTestId } = render(
      <ImageCarousel
        images={["single-image"]}
        onDelete={mockOnDelete}
        flag=""
      />
    );

    expect(getAllByTestId("carousel-image")).toHaveLength(1);
    expect(getAllByTestId("carousel-delete-button")).toHaveLength(1);
  });

  it("does not show cover page text when flag is empty", () => {
    const { queryByText } = render(
      <ImageCarousel images={images} onDelete={mockOnDelete} flag="" />
    );

    expect(queryByText("Cover Page")).toBeFalsy();
  });

  it("shows cover page text for first image when flag is provided", () => {
    const { getByText } = render(
      <ImageCarousel images={images} onDelete={mockOnDelete} flag="Food" />
    );

    expect(getByText("Cover Page")).toBeTruthy();
  });

  it("renders delete buttons for all images", () => {
    const { getAllByTestId } = render(
      <ImageCarousel images={images} onDelete={mockOnDelete} flag="" />
    );

    const deleteButtons = getAllByTestId("carousel-delete-button");
    expect(deleteButtons).toHaveLength(3);
  });

  it("calls onDelete with correct index", () => {
    const { getAllByTestId } = render(
      <ImageCarousel images={images} onDelete={mockOnDelete} flag="" />
    );

    const deleteButtons = getAllByTestId("carousel-delete-button");
    fireEvent.press(deleteButtons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });
});
