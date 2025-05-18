"use client"

import { useEffect, useState } from "react"

interface AnalogClockProps {
  time: Date
  size?: number
  showSeconds?: boolean
}

export default function AnalogClock({ time, size = 80, showSeconds = true }: AnalogClockProps) {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  // 更新时钟指针角度
  useEffect(() => {
    const h = time.getHours() % 12
    const m = time.getMinutes()
    const s = time.getSeconds()

    // 计算时针、分针、秒针的角度
    // 时针: 每小时旋转30度 (360/12)，分钟也会影响时针位置
    // 分针: 每分钟旋转6度 (360/60)
    // 秒针: 每秒旋转6度 (360/60)
    setHours(h * 30 + m * 0.5)
    setMinutes(m * 6)
    setSeconds(s * 6)
  }, [time])

  // 计算中心点和半径
  const center = size / 2
  const radius = size / 2 - 4

  // 时钟刻度
  const hourMarks = []
  const minuteMarks = []

  // 创建时钟刻度
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180 // 每小时30度
    const x1 = center + (radius - 8) * Math.sin(angle)
    const y1 = center - (radius - 8) * Math.cos(angle)
    const x2 = center + radius * Math.sin(angle)
    const y2 = center - radius * Math.cos(angle)

    hourMarks.push(
      <line
        key={`hour-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
      />,
    )
  }

  // 创建分钟刻度（不与小时刻度重叠）
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) {
      // 跳过与小时刻度重叠的位置
      const angle = (i * 6 * Math.PI) / 180 // 每分钟6度
      const x1 = center + (radius - 4) * Math.sin(angle)
      const y1 = center - (radius - 4) * Math.cos(angle)
      const x2 = center + radius * Math.sin(angle)
      const y2 = center - radius * Math.cos(angle)

      minuteMarks.push(
        <line
          key={`minute-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="white"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeLinecap="round"
        />,
      )
    }
  }

  return (
    <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 时钟外圈 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="2"
        />

        {/* 时钟刻度 */}
        {hourMarks}
        {minuteMarks}

        {/* 时针 */}
        <line
          x1={center}
          y1={center}
          x2={center + radius * 0.5 * Math.sin((hours * Math.PI) / 180)}
          y2={center - radius * 0.5 * Math.cos((hours * Math.PI) / 180)}
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: "all 0.1s" }}
        />

        {/* 分针 */}
        <line
          x1={center}
          y1={center}
          x2={center + radius * 0.7 * Math.sin((minutes * Math.PI) / 180)}
          y2={center - radius * 0.7 * Math.cos((minutes * Math.PI) / 180)}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: "all 0.1s" }}
        />

        {/* 秒针 */}
        {showSeconds && (
          <line
            x1={center}
            y1={center}
            x2={center + radius * 0.8 * Math.sin((seconds * Math.PI) / 180)}
            y2={center - radius * 0.8 * Math.cos((seconds * Math.PI) / 180)}
            stroke="#f87171"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ transition: "all 0.1s" }}
          />
        )}

        {/* 中心点 */}
        <circle cx={center} cy={center} r="3" fill="white" />
        {showSeconds && <circle cx={center} cy={center} r="1.5" fill="#f87171" />}
      </svg>
    </div>
  )
}
