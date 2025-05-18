"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { getLunarDateString, getShortLunarDateString } from "@/lib/lunar-calendar"

interface LunarCalendarDisplayProps {
  date: Date
  timeZoneOffset: number
}

export default function LunarCalendarDisplay({ date, timeZoneOffset }: LunarCalendarDisplayProps) {
  const [lunarDate, setLunarDate] = useState("")
  const [shortLunarDate, setShortLunarDate] = useState("")

  useEffect(() => {
    // 根据时区偏移调整日期
    const utc = date.getTime() + date.getTimezoneOffset() * 60000
    const adjustedDate = new Date(utc + 3600000 * timeZoneOffset)

    // 计算农历日期
    setLunarDate(getLunarDateString(adjustedDate))
    setShortLunarDate(getShortLunarDateString(adjustedDate))
  }, [date, timeZoneOffset])

  return (
    <Card className="backdrop-blur-md bg-white/20 border-none shadow-md p-4">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="h-5 w-5 text-white/80" />
        <h3 className="font-semibold text-white">农历日期</h3>
      </div>
      <div className="text-white text-lg font-medium">{shortLunarDate}</div>
      <div className="text-white/70 text-sm mt-1">{lunarDate}</div>
    </Card>
  )
}
