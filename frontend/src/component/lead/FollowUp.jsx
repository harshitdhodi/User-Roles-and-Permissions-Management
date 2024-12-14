'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addDays, format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"



const events = [
  {
    id: "1",
    title: "Aliens vs Humans",
    start: new Date(2024, 11, 4, 10, 0),
    end: new Date(2024, 11, 4, 11, 0),
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "Life on Mars",
    start: new Date(2024, 11, 14, 9, 0),
    end: new Date(2024, 11, 14, 10, 0),
    color: "bg-blue-500",
  },
  {
    id: "3",
    title: "Space Galaxies",
    start: new Date(2024, 11, 9, 17, 0),
    end: new Date(2024, 11, 9, 18, 0),
    color: "bg-orange-500",
  },
]

export default function FollowUp() {
  const [view, setView] = React.useState("month")
  const [currentDate, setCurrentDate] = React.useState(new Date(2024, 11, 1))
  const [selectedDate, setSelectedDate] = useState(null)
  const [eventTitle, setEventTitle] = useState("")

  const handlePrevious = () => {
    setCurrentDate((prev) => addDays(prev, -1))
  }

  const handleNext = () => {
    setCurrentDate((prev) => addDays(prev, 1))
  }

  const handleAddEvent = () => {
    if (selectedDate && eventTitle) {
      const newEvent = {
        id: String(events.length + 1),
        title: eventTitle,
        start: selectedDate,
        end: addDays(selectedDate, 1),
        color: "bg-blue-500",
      }
      events.push(newEvent)
      setEventTitle("")
      setSelectedDate(null)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">December 2024</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="font-medium">
            Today
          </Button>
          <Select value={view} onValueChange={(value) => setView(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-7 divide-x divide-y">
        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
          <div key={day} className="px-4 py-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => {
          const date = addDays(currentDate, i - 4)
          const dayEvents = events.filter(
            (event) => format(event.start, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
          )

          return (
            <Dialog>
              <DialogTrigger asChild>
                <div
                  key={i}
                  className={cn(
                    "h-32 overflow-hidden p-2 cursor-pointer hover:bg-gray-100",
                    format(date, "MM") !== format(currentDate, "MM") && "bg-muted"
                  )}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="font-medium">{format(date, "d")}</div>
                  <div className="mt-2 space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "rounded px-2 py-1 text-xs text-white",
                          event.color
                        )}
                      >
                        {format(event.start, "h:mm a")} {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Event for {selectedDate && format(selectedDate, "MMMM d, yyyy")}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Event title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          )
        })}
      </div>
    </div>
  )
}

