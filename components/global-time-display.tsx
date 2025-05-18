"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { timeZones, getTimeZoneInfo } from "@/lib/time-zones"
import AnalogClock from "@/components/analog-clock"

export default function GlobalTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("全部")
  const [use24HourFormat, setUse24HourFormat] = useState(true) // 默认使用24小时制
  const [showAnalogClock, setShowAnalogClock] = useState(true) // 默认显示模拟时钟

  // 更新时间
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // 格式化时间
  const formatTime = (date, offset) => {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000
    const newDate = new Date(utc + 3600000 * offset)

    return newDate.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !use24HourFormat, // 根据用户选择决定是否使用12小时制
    })
  }

  // 格式化日期
  const formatDate = (date, offset) => {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000
    const newDate = new Date(utc + 3600000 * offset)

    return newDate.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  // 获取调整后的时间
  const getAdjustedTime = (date, offset) => {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000
    return new Date(utc + 3600000 * offset)
  }

  // 获取所有可用的地区
  const regions = ["全部", ...Array.from(new Set(timeZones.map((tz) => tz.region)))]

  // 过滤时区
  const filteredTimeZones = timeZones.filter(
    (tz) =>
      (selectedRegion === "全部" || tz.region === selectedRegion) &&
      (tz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tz.region.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // 按区域分组
  const groupedTimeZones = filteredTimeZones.reduce((acc, tz) => {
    if (!acc[tz.region]) {
      acc[tz.region] = []
    }
    acc[tz.region].push(tz)
    return acc
  }, {})

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-white mb-8">全球时间</h1>

      {/* 设置选项 */}
      <div className="flex flex-wrap justify-end gap-4 mb-6">
        {/* 时间格式切换 */}
        <div className="bg-white/20 backdrop-blur-md rounded-full p-2 flex items-center gap-2">
          <Label htmlFor="time-format" className="text-white text-sm">
            {use24HourFormat ? "24小时制" : "12小时制"}
          </Label>
          <Switch
            id="time-format"
            checked={use24HourFormat}
            onCheckedChange={setUse24HourFormat}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>

        {/* 模拟时钟切换 */}
        <div className="bg-white/20 backdrop-blur-md rounded-full p-2 flex items-center gap-2">
          <Label htmlFor="analog-clock" className="text-white text-sm">
            模拟时钟
          </Label>
          <Switch
            id="analog-clock"
            checked={showAnalogClock}
            onCheckedChange={setShowAnalogClock}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
      </div>

      {/* 搜索框 */}
      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="搜索城市或地区..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="backdrop-blur-md bg-white/30 border-none text-white placeholder:text-white/70 pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/70"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        <div className="mt-2 text-white/70 text-sm">
          {searchTerm ? `找到 ${filteredTimeZones.length} 个匹配的城市` : `共显示 ${timeZones.length} 个城市`}
        </div>
      </div>

      {/* 地区筛选器 */}
      <div className="flex flex-wrap gap-2 mt-4 mb-6">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedRegion === region
                ? "bg-white text-blue-600 font-medium"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* 各地区时间 */}
      {Object.keys(groupedTimeZones).length > 0 ? (
        Object.entries(groupedTimeZones).map(([region, zones]) => (
          <div key={region} className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">{region}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {zones.map((zone) => {
                const tzInfo = getTimeZoneInfo(zone.offset, currentTime)
                const adjustedTime = getAdjustedTime(currentTime, zone.offset)

                return (
                  <Card key={zone.name} className="backdrop-blur-md bg-white/20 border-none shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-white/80" />
                          <h3 className="font-semibold text-white">{zone.name}</h3>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-white/10 text-white border-white/20 text-xs font-mono"
                          title={tzInfo.name}
                        >
                          {tzInfo.abbreviation}
                          {tzInfo.isDST && <span className="ml-1 text-yellow-300">*</span>}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">{formatTime(currentTime, zone.offset)}</div>
                          <div className="text-white/70 text-sm">{formatDate(currentTime, zone.offset)}</div>
                          <div className="mt-1 text-xs text-white/60 flex items-center">
                            <span>
                              UTC{zone.offset >= 0 ? "+" : ""}
                              {zone.offset}
                            </span>
                            {tzInfo.isDST && <span className="ml-2 text-yellow-300 text-xs">夏令时</span>}
                          </div>
                        </div>

                        {/* 模拟时钟 */}
                        {showAnalogClock && (
                          <div className="ml-2">
                            <AnalogClock time={adjustedTime} size={80} showSeconds={false} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-white">没有找到匹配的城市或地区</p>
      )}
    </div>
  )
}
