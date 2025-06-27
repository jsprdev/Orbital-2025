// Resorted to creating a new file because it seems that I cannot remock with no data
import React from "react";
import { render } from "@testing-library/react-native";

jest.mock("../../providers/GalleryProvider", () => ({
  useGallery: () => ({
    photos: [],
    albums: [],
    deletePhoto: jest.fn(),
  }),
  GalleryProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import GalleryGrid from "../../app/(gallery)/GalleryGrid";

describe("GalleryGrid (empty state)", () => {
  it("shows no photos message when no photos exist", () => {
    const { getByTestId } = render(<GalleryGrid />);
    expect(getByTestId("no-photos-found")).toBeTruthy();
  });
});
