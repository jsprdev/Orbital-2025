import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ImageCarousel from "../ImageCarousel";

describe("ImageCarousel", () => {
  const images = ["url1", "url2", "url3"];
  it("renders all images", () => {
    const { getAllByTestId } = render(
      <ImageCarousel images={images} onDelete={jest.fn()} />
    );
    expect(getAllByTestId("carousel-image").length).toBe(3);
  });

  it("calls onDelete with correct index", () => {
    const onDelete = jest.fn();
    const { getAllByTestId } = render(
      <ImageCarousel images={images} onDelete={onDelete} />
    );
    const deleteButtons = getAllByTestId("carousel-delete-button");
    fireEvent.press(deleteButtons[1]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
