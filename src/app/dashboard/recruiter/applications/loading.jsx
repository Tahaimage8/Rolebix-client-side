import { Card, Skeleton } from "@heroui/react";

const RecruiterApplicationsLoading = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-6 w-36 rounded-full" />
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-5 w-full max-w-xl rounded-xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            variant="default"
            className="border border-border/70 bg-surface"
          >
            <Card.Content className="gap-3">
              <Skeleton className="h-4 w-28 rounded-lg" />
              <Skeleton className="h-9 w-16 rounded-lg" />
            </Card.Content>
          </Card>
        ))}
      </div>

      <Card
        variant="default"
        className="border border-border/70 bg-surface"
      >
        <Card.Content>
          <Skeleton className="h-11 w-full rounded-field" />
        </Card.Content>
      </Card>

      <Card
        variant="default"
        className="border border-border/70 bg-surface p-0"
      >
        <Card.Content className="gap-3 p-5">
          <Skeleton className="h-6 w-52 rounded-lg" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </Card.Content>
      </Card>
    </div>
  );
};

export default RecruiterApplicationsLoading;
