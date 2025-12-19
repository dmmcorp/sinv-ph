import { FileText, CheckCircle2, Eye, Clock, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    type: "payment",
    description: "Payment received for INV-001",
    client: "Acme Corp",
    time: "2 hours ago",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    id: 2,
    type: "created",
    description: "Invoice INV-009 created",
    client: "TechStart Inc",
    time: "4 hours ago",
    icon: FileText,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50",
  },
  {
    id: 3,
    type: "viewed",
    description: "Invoice INV-007 viewed",
    client: "Global Services",
    time: "Yesterday",
    icon: Eye,
    iconColor: "text-slate-600",
    iconBg: "bg-slate-100",
  },
  {
    id: 4,
    type: "reminder",
    description: "Reminder sent for INV-005",
    client: "Digital Agency",
    time: "Yesterday",
    icon: Send,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
  {
    id: 5,
    type: "overdue",
    description: "Invoice INV-003 is overdue",
    client: "StartUp Labs",
    time: "2 days ago",
    icon: Clock,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
  },
];

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest updates on your invoices
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
            >
              <div className={`rounded-lg p-2 ${activity.iconBg}`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.client}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
