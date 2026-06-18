import type { OrderStatus } from "@/lib/data";
import { orderStatuses, statusMeta, timelineSteps } from "@/lib/data";
import { cn } from "@/lib/utils";

export function StatusTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const currentIndex = orderStatuses.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      {timelineSteps.map((step, index) => {
        const complete = index <= currentIndex;
        const active = index === currentIndex;

        return (
          <div key={step.status} className="relative flex gap-3">
            {index < timelineSteps.length - 1 ? (
              <span
                className={cn(
                  "absolute left-[11px] top-7 h-full w-0.5",
                  index < currentIndex ? "bg-sage-500" : "bg-cocoa-100",
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                complete ? "border-sage-600" : "border-cocoa-200",
              )}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full", complete ? statusMeta[step.status].dot : "bg-cocoa-200")} />
            </span>
            <div className={cn("rounded-lg px-1 pb-3", active && "text-cocoa-900")}>
              <p className="font-bold text-cocoa-900">{step.title}</p>
              <p className="mt-1 text-sm text-cocoa-500">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
