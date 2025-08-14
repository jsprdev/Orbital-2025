import React from "react";
import { View, Text, Button } from "react-native";
import { render, act, fireEvent } from "@testing-library/react-native";
import { CalendarProvider, useCalendar } from "@/providers/CalendarProvider";
import { getEvents, createEvent, deleteEvent } from "@/utils/calendar.api";

// Mock the API functions
jest.mock("@/utils/calendar.api", () => ({
  getEvents: jest.fn(),
  createEvent: jest.fn(),
  deleteEvent: jest.fn(),
}));

// Test component that uses the hook
const TestComponent = () => {
  const { events, addEvent, deleteEvent } = useCalendar();
  return (
    <View>
      <Text testID="events-count">{events.length}</Text>
      <Button
        testID="add-button"
        onPress={() =>
          addEvent({
            id: "1",
            title: "Test",
            startTime: "2023-01-01",
            endTime: "2023-01-01",
            location: "Test",
            userId: "1",
            createdAt: new Date(),
          })
        }
        title="Add"
      />
      <Button
        testID="delete-button"
        onPress={() => deleteEvent("1")}
        title="Delete"
      />
    </View>
  );
};

describe("CalendarProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should provide events", async () => {
    (getEvents as jest.Mock).mockResolvedValue([
      {
        id: "1",
        title: "Test Event",
        startTime: "2023-01-01",
        endTime: "2023-01-01",
        location: "Test",
        userId: "1",
        createdAt: new Date().toISOString(),
      },
    ]);

    const { findByText } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    // Wait for initial load
    expect(await findByText("1")).toBeTruthy();
  });

  it("should add events", async () => {
    (createEvent as jest.Mock).mockResolvedValue({});
    (getEvents as jest.Mock).mockResolvedValue([]);

    const { getByTestId, findByText } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    await act(async () => {
      fireEvent.press(getByTestId("add-button"));
    });

    expect(createEvent).toHaveBeenCalled();
  });

  it("should delete events", async () => {
    (deleteEvent as jest.Mock).mockResolvedValue({});
    (getEvents as jest.Mock).mockResolvedValue([
      {
        id: "1",
        title: "Test Event",
        // ... other required fields
      },
    ]);

    const { getByTestId } = render(
      <CalendarProvider>
        <TestComponent />
      </CalendarProvider>
    );

    await act(async () => {
      fireEvent.press(getByTestId("delete-button"));
    });

    expect(deleteEvent).toHaveBeenCalledWith("1");
  });
});
