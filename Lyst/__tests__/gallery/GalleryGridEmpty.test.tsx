// Resorted to creating a new file because it seems that I cannot remock with no data
import React from "react";
import { render } from "@testing-library/react-native";

import GalleryGrid from "../../app/(gallery)/GalleryGrid";

jest.mock("../../providers/GalleryProvider", () => ({
  useGallery: () => ({
    photos: [],
    albums: [],
    deletePhoto: jest.fn(),
  }),
  GalleryProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("GalleryGrid (empty state)", () => {
  it("shows no photos message when no photos exist", () => {
    const { getByTestId } = render(<GalleryGrid />);
    expect(getByTestId("no-photos-found")).toBeTruthy();
  });
});
