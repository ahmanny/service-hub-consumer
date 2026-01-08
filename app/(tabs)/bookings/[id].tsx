import BookingDetailsScreen from "@/components/screens/BookingDetailsScreen";
import { MOCK_BOOKING_DATA } from "@/data/testDatas";
import { useLocalSearchParams } from "expo-router";

export default function BookingPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const booking = MOCK_BOOKING_DATA;

  return <BookingDetailsScreen booking={booking} />;
}
