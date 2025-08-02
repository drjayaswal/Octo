"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { dayNames, monthNames } from "@/lib/const";
import { redirect, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { authClient } from "@/lib/auth-client";

type Meeting = {
  id: string;
  title: string;
  time: string;
  participants: string[];
};

type DayData = {
  date: Date;
  meetings: Meeting[];
  isToday: boolean;
  isCurrentMonth: boolean;
};

export default function CalendarPage() {
  const { data: session, isPending } = authClient.useSession();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [showDayDialog, setShowDayDialog] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = new URL(window.location.href);
    const via = url.searchParams.get("via");
    if (via === "signup") {
      toast.success("Account Created");
    } else if (via === "signin") {
      toast.success("Logged in successfully");
    }
    if (via) {
      url.searchParams.delete("via");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [searchParams]);

  if (isPending) {
    return <Loading />;
  }
  if (!session) {
    redirect("/signin");
  }

  // Dummy meetings for demonstration
  const getMeetingsForDate = (date: Date): Meeting[] => {
    // Example: Add a couple of meetings for today and tomorrow
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return [
        {
          id: "1",
          title: "Team Standup",
          time: "10:00 AM",
          participants: ["Alice", "Bob", "Charlie"],
        },
        {
          id: "2",
          title: "Client Sync",
          time: "2:00 PM",
          participants: ["Alice", "Dana"],
        },
      ];
    }
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return [
        {
          id: "3",
          title: "Project Planning",
          time: "11:00 AM",
          participants: ["Bob", "Charlie"],
        },
      ];
    }
    return [];
  };

  const getDaysInMonth = (date: Date): DayData[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: DayData[] = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: prevDate,
        meetings: getMeetingsForDate(prevDate),
        isToday: false,
        isCurrentMonth: false,
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      days.push({
        date: currentDay,
        meetings: getMeetingsForDate(currentDay),
        isToday: isSameDay(currentDay, today),
        isCurrentMonth: true,
      });
    }

    // Add empty cells for days after the last day of the month
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        meetings: getMeetingsForDate(nextDate),
        isToday: false,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDayClick = (dayData: DayData) => {
    setSelectedDay(dayData);
    setShowDayDialog(true);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-full">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            className="bg-emerald-700/10 text-emerald-700 hover:bg-emerald-700/20 hover:text-emerald-700 cursor-pointer"
            size="icon"
            onClick={handlePrevMonth}
            aria-label="Previous Month"
          >
            <ChevronLeft className="h-4 w-4 sm:scale-150 scale-125" />
          </Button>
          <h2 className="text-base sm:text-lg font-semibold text-emerald-700">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            className="bg-emerald-700/10 text-emerald-700 hover:bg-emerald-700/20 hover:text-emerald-700 cursor-pointer"
            size="icon"
            onClick={handleNextMonth}
            aria-label="Next Month"
          >
            <ChevronRight className="h-4 w-4 sm:scale-150 scale-125" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-2 sm:p-4 mt-3 sm:mt-5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-1 text-center text-xs sm:text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div
            className="grid grid-cols-7 gap-0.5 sm:gap-1"
            style={{
              gridAutoRows: "1fr",
              height: "100%",
              minHeight: 0,
            }}
          >
            {days.map((dayData, index) => (
              <Card
                key={index}
                className={cn(
                  "aspect-square sm:aspect-video min-h-0 h-full w-full p-1 sm:p-2 lg:p-3 cursor-pointer transition-all shadow-xs border-transparent border-2 duration-200 flex flex-col",
                  dayData.isCurrentMonth ? "bg-white hover:shadow-md" : "-z-10",
                  dayData.meetings.length > 0 &&
                    "border-transparent hover:shadow-xl shadow-none bg-emerald-500/10",
                  dayData.isToday &&
                    "border-transparent bg-emerald-500/20 hover:shadow-xl"
                )}
                onClick={() => handleDayClick(dayData)}
              >
                <div className="flex flex-col flex-1 h-full">
                  <div className="flex items-center justify-between mb-1 sm:mb-2 relative">
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-medium",
                        dayData.isCurrentMonth
                          ? "text-gray-800"
                          : "text-gray-400",
                        dayData.isToday && "text-emerald-500 font-semibold"
                      )}
                    >
                      {dayData.date.getDate()}
                    </span>
                    {dayData.meetings.length > 0 && (
                      <>
                        <span className="absolute top-5 right-0 items-center font-extrabold text-emerald-500 text-xs sm:hidden">
                          {dayData.meetings.length}
                        </span>
                        <span className="absolute top-10 right-2 items-center font-extrabold text-emerald-600 text-sm hidden sm:inline">
                          {dayData.meetings.length}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showDayDialog && selectedDay && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowDayDialog(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-4 max-w-xs sm:max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-5 w-5 text-emerald-500" />
              <span className="font-semibold text-sm sm:text-base">
                {selectedDay.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="mb-2">
              {selectedDay.meetings.length > 0 ? (
                <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm">
                  {selectedDay.meetings.map((meeting) => (
                    <li key={meeting.id} className="mb-2">
                      <div className="font-medium">{meeting.title}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500">
                        {meeting.time} &middot; Participants:{" "}
                        {meeting.participants.join(", ")}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500 text-xs sm:text-sm">
                  No meetings scheduled for this day.
                </span>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-emerald-500 hover:bg-emerald-600/80 text-white px-4 py-1 text-xs sm:text-sm rounded-xl"
                onClick={() => setShowDayDialog(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
