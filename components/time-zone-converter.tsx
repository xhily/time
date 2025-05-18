"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftRight, Clock, Plus, X } from "lucide-react"

// 导入时区数据
import { timeZones } from "@/lib/time-zones"

export default function TimeZoneConverter() {
  const [sourceTimeZone, setSourceTimeZone] = useState("8") // 默认北京时间 UTC+8
  const [sourceCity, setSourceCity] = useState("北京")
  const [targetTimeZones, setTargetTimeZones] = useState([{ offset: "-5", city: "纽约" }]) // 默认纽约
  const [sourceDate, setSourceDate] = useState("")
  const [sourceTime, setSourceTime] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("current")

  // 初始化日期和时间
  useEffect(() => {
    const now = new Date()
    const formattedDate = now.toISOString().split("T")[0]
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const formattedTime = `${hours}:${minutes}`

    setSourceDate(formattedDate)
    setSourceTime(formattedTime)

    // 更新当前时间
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // 添加目标时区
  const addTargetTimeZone = () => {
    // 找到一个尚未添加的时区
    const existingOffsets = targetTimeZones.map((tz) => tz.offset)
    const availableTimeZone = timeZones.find(
      (tz) => !existingOffsets.includes(tz.offset.toString()) && tz.offset.toString() !== sourceTimeZone,
    )

    if (availableTimeZone) {
      setTargetTimeZones([
        ...targetTimeZones,
        { offset: availableTimeZone.offset.toString(), city: availableTimeZone.name },
      ])
    }
  }

  // 移除目标时区
  const removeTargetTimeZone = (index) => {
    const newTargetTimeZones = [...targetTimeZones]
    newTargetTimeZones.splice(index, 1)
    setTargetTimeZones(newTargetTimeZones)
  }

  // 交换源和目标时区
  const swapTimeZones = () => {
    if (targetTimeZones.length > 0) {
      const newSourceOffset = targetTimeZones[0].offset
      const newSourceCity = targetTimeZones[0].city
      const newTargetOffset = sourceTimeZone
      const newTargetCity = sourceCity

      setSourceTimeZone(newSourceOffset)
      setSourceCity(newSourceCity)
      setTargetTimeZones([{ offset: newTargetOffset, city: newTargetCity }])
    }
  }

  // 更新源时区
  const handleSourceTimeZoneChange = (value) => {
    setSourceTimeZone(value)
    const selectedZone = timeZones.find((tz) => tz.offset.toString() === value)
    if (selectedZone) {
      setSourceCity(selectedZone.name)
    }
  }

  // 更新目标时区
  const handleTargetTimeZoneChange = (value, index) => {
    const newTargetTimeZones = [...targetTimeZones]
    newTargetTimeZones[index].offset = value
    const selectedZone = timeZones.find((tz) => tz.offset.toString() === value)
    if (selectedZone) {
      newTargetTimeZones[index].city = selectedZone.name
    }
    setTargetTimeZones(newTargetTimeZones)
  }

  // 计算转换后的时间
  const convertTime = (sourceOffset, targetOffset, date, time) => {
    let dateTime

    if (activeTab === "current") {
      dateTime = new Date(currentTime)
    } else {
      if (!date || !time) return "请选择日期和时间"
      dateTime = new Date(`${date}T${time}:00`)
    }

    if (isNaN(dateTime.getTime())) return "无效的日期或时间"

    // 转换为UTC时间
    const utcTime = dateTime.getTime() + dateTime.getTimezoneOffset() * 60000

    // 源时区的时间
    const sourceTime = new Date(utcTime + 3600000 * Number.parseFloat(sourceOffset))

    // 目标时区的时间
    const targetTime = new Date(utcTime + 3600000 * Number.parseFloat(targetOffset))

    // 计算时差（小时）
    const hourDiff = Number.parseFloat(targetOffset) - Number.parseFloat(sourceOffset)

    return {
      time: targetTime,
      diff: hourDiff,
    }
  }

  // 格式化时间显示
  const formatDateTime = (date) => {
    if (!date || !(date instanceof Date)) return ""

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return {
      date: `${year}年${month}月${day}日`,
      time: `${hours}:${minutes}:${seconds}`,
      weekday: date.toLocaleDateString("zh-CN", { weekday: "long" }),
    }
  }

  // 获取时区城市选项
  const getTimeZoneOptions = () => {
    // 按照偏移量排序
    const sortedTimeZones = [...timeZones].sort((a, b) => a.offset - b.offset)

    // 按区域分组
    const groupedTimeZones = sortedTimeZones.reduce((acc, tz) => {
      if (!acc[tz.region]) {
        acc[tz.region] = []
      }
      acc[tz.region].push(tz)
      return acc
    }, {})

    return Object.entries(groupedTimeZones).map(([region, zones]) => (
      <div key={region} className="px-2 py-1">
        <div className="text-xs text-white/70 mb-1">{region}</div>
        {zones.map((zone) => (
          <SelectItem key={`${zone.name}-${zone.offset}`} value={zone.offset.toString()}>
            {zone.name} (UTC{zone.offset >= 0 ? "+" : ""}
            {zone.offset})
          </SelectItem>
        ))}
      </div>
    ))
  }

  return (
    <Card className="backdrop-blur-md bg-white/30 border-none shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="h-6 w-6" />
        时区转换器
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-white/20 text-white">
          <TabsTrigger value="current" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
            使用当前时间
          </TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
            自定义时间
          </TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white text-sm mb-1">日期</label>
              <Input
                type="date"
                value={sourceDate}
                onChange={(e) => setSourceDate(e.target.value)}
                className="bg-white/20 border-none text-white"
              />
            </div>
            <div>
              <label className="block text-white text-sm mb-1">时间</label>
              <Input
                type="time"
                value={sourceTime}
                onChange={(e) => setSourceTime(e.target.value)}
                className="bg-white/20 border-none text-white"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 源时区 */}
        <div>
          <label className="block text-white text-sm mb-1">源时区</label>
          <Select value={sourceTimeZone} onValueChange={handleSourceTimeZoneChange}>
            <SelectTrigger className="bg-white/20 border-none text-white">
              <SelectValue placeholder="选择源时区" />
            </SelectTrigger>
            <SelectContent className="bg-blue-900/90 backdrop-blur-md border-none max-h-[300px]">
              {getTimeZoneOptions()}
            </SelectContent>
          </Select>

          {activeTab === "current" && (
            <div className="mt-4 bg-white/20 p-3 rounded-md">
              <div className="text-white text-sm">当前时间：</div>
              <div className="text-white text-2xl font-bold mt-1">
                {formatDateTime(convertTime(sourceTimeZone, sourceTimeZone, sourceDate, sourceTime).time).time}
              </div>
              <div className="text-white/70 text-sm">
                {formatDateTime(convertTime(sourceTimeZone, sourceTimeZone, sourceDate, sourceTime).time).date}{" "}
                {formatDateTime(convertTime(sourceTimeZone, sourceTimeZone, sourceDate, sourceTime).time).weekday}
              </div>
            </div>
          )}
        </div>

        {/* 交换按钮 */}
        <div className="flex items-center justify-center md:justify-start md:self-start md:mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={swapTimeZones}
            className="bg-white/20 border-none text-white hover:bg-white/40 hover:text-white"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span className="sr-only">交换时区</span>
          </Button>
        </div>
      </div>

      {/* 目标时区 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-white text-sm">目标时区</label>
          <Button
            variant="outline"
            size="sm"
            onClick={addTargetTimeZone}
            className="bg-white/20 border-none text-white hover:bg-white/40 hover:text-white"
            disabled={targetTimeZones.length >= 5}
          >
            <Plus className="h-4 w-4 mr-1" />
            添加时区
          </Button>
        </div>

        {targetTimeZones.map((targetTz, index) => {
          const convertedTime = convertTime(sourceTimeZone, targetTz.offset, sourceDate, sourceTime)
          const formattedTime = formatDateTime(convertedTime.time)
          const hourDiff = convertedTime.diff

          return (
            <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-4 bg-white/10 p-4 rounded-md">
              <div>
                <div className="flex justify-between">
                  <Select value={targetTz.offset} onValueChange={(value) => handleTargetTimeZoneChange(value, index)}>
                    <SelectTrigger className="bg-white/20 border-none text-white">
                      <SelectValue placeholder="选择目标时区" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-900/90 backdrop-blur-md border-none max-h-[300px]">
                      {getTimeZoneOptions()}
                    </SelectContent>
                  </Select>

                  {targetTimeZones.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTargetTimeZone(index)}
                      className="ml-2 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">移除</span>
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-white/20 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white text-2xl font-bold">{formattedTime.time}</div>
                    <div className="text-white/70 text-sm">
                      {formattedTime.date} {formattedTime.weekday}
                    </div>
                  </div>
                  <div className="text-white/80 text-sm bg-white/10 px-2 py-1 rounded">
                    {hourDiff > 0 ? "+" : ""}
                    {hourDiff} 小时
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
