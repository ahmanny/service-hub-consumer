import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

// Components
import ProviderDetailsScreen from "@/components/screens/ProviderDetailsScreen";
import ProviderDetailSkeleton from "@/components/skeletons/ProviderDetailSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useProviderDetails } from "@/hooks/useProviders";

export default function ProviderDetailsPage() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const { data, isLoading, error, refetch, isRefetching } = useProviderDetails({
    providerId,
  });

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Loading..." }} />
        <ProviderDetailSkeleton />
      </>
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        message={error?.message || "We couldn't find this provider."}
        onRetry={onRefresh}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: data.firstName }} />
      <ProviderDetailsScreen
        data={data}
        isRefetching={isRefetching}
        onRefresh={onRefresh}
      />
    </>
  );
}
