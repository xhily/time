/**
 * 农历日期计算工具
 * 基于农历算法实现公历日期到农历日期的转换
 */

// 农历年的天干
const CELESTIAL_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
// 农历年的地支
const TERRESTRIAL_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
// 生肖
const CHINESE_ZODIAC = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]
// 农历月份
const LUNAR_MONTHS = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"]
// 农历日期
const LUNAR_DAYS = [
  "初一",
  "初二",
  "初三",
  "初四",
  "初五",
  "初六",
  "初七",
  "初八",
  "初九",
  "初十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
  "廿一",
  "廿二",
  "廿三",
  "廿四",
  "廿五",
  "廿六",
  "廿七",
  "廿八",
  "廿九",
  "三十",
]

// 农历数据，从1900年到2100年
// 每个农历年用16进制表示，解析规则如下：
// 1. 前12位或13位表示12或13个农历月的大小月，大月30天，小月29天
// 2. 最后4位表示闰月月份，如果没有闰月为0
const LUNAR_INFO = [
  0x04bd8,
  0x04ae0,
  0x0a570,
  0x054d5,
  0x0d260,
  0x0d950,
  0x16554,
  0x056a0,
  0x09ad0,
  0x055d2, // 1900-1909
  0x04ae0,
  0x0a5b6,
  0x0a4d0,
  0x0d250,
  0x1d255,
  0x0b540,
  0x0d6a0,
  0x0ada2,
  0x095b0,
  0x14977, // 1910-1919
  0x04970,
  0x0a4b0,
  0x0b4b5,
  0x06a50,
  0x06d40,
  0x1ab54,
  0x02b60,
  0x09570,
  0x052f2,
  0x04970, // 1920-1929
  0x06566,
  0x0d4a0,
  0x0ea50,
  0x06e95,
  0x05ad0,
  0x02b60,
  0x186e3,
  0x092e0,
  0x1c8d7,
  0x0c950, // 1930-1939
  0x0d4a0,
  0x1d8a6,
  0x0b550,
  0x056a0,
  0x1a5b4,
  0x025d0,
  0x092d0,
  0x0d2b2,
  0x0a950,
  0x0b557, // 1940-1949
  0x06ca0,
  0x0b550,
  0x15355,
  0x04da0,
  0x0a5b0,
  0x14573,
  0x052b0,
  0x0a9a8,
  0x0e950,
  0x06aa0, // 1950-1959
  0x0aea6,
  0x0ab50,
  0x04b60,
  0x0aae4,
  0x0a570,
  0x05260,
  0x0f263,
  0x0d950,
  0x05b57,
  0x056a0, // 1960-1969
  0x096d0,
  0x04dd5,
  0x04ad0,
  0x0a4d0,
  0x0d4d4,
  0x0d250,
  0x0d558,
  0x0b540,
  0x0b6a0,
  0x195a6, // 1970-1979
  0x095b0,
  0x049b0,
  0x0a974,
  0x0a4b0,
  0x0b27a,
  0x06a50,
  0x06d40,
  0x0af46,
  0x0ab60,
  0x09570, // 1980-1989
  0x04af5,
  0x04970,
  0x064b0,
  0x074a3,
  0x0ea50,
  0x06b58,
  0x055c0,
  0x0ab60,
  0x096d5,
  0x092e0, // 1990-1999
  0x0c960,
  0x0d954,
  0x0d4a0,
  0x0da50,
  0x07552,
  0x056a0,
  0x0abb7,
  0x025d0,
  0x092d0,
  0x0cab5, // 2000-2009
  0x0a950,
  0x0b4a0,
  0x0baa4,
  0x0ad50,
  0x055d9,
  0x04ba0,
  0x0a5b0,
  0x15176,
  0x052b0,
  0x0a930, // 2010-2019
  0x07954,
  0x06aa0,
  0x0ad50,
  0x05b52,
  0x04b60,
  0x0a6e6,
  0x0a4e0,
  0x0d260,
  0x0ea65,
  0x0d530, // 2020-2029
  0x05aa0,
  0x076a3,
  0x096d0,
  0x04afb,
  0x04ad0,
  0x0a4d0,
  0x1d0b6,
  0x0d250,
  0x0d520,
  0x0dd45, // 2030-2039
  0x0b5a0,
  0x056d0,
  0x055b2,
  0x049b0,
  0x0a577,
  0x0a4b0,
  0x0aa50,
  0x1b255,
  0x06d20,
  0x0ada0, // 2040-2049
  0x14b63,
  0x09370,
  0x049f8,
  0x04970,
  0x064b0,
  0x168a6,
  0x0ea50,
  0x06b20,
  0x1a6c4,
  0x0aae0, // 2050-2059
  0x0a2e0,
  0x0d2e3,
  0x0c960,
  0x0d557,
  0x0d4a0,
  0x0da50,
  0x05d55,
  0x056a0,
  0x0a6d0,
  0x055d4, // 2060-2069
  0x052d0,
  0x0a9b8,
  0x0a950,
  0x0b4a0,
  0x0b6a6,
  0x0ad50,
  0x055a0,
  0x0aba4,
  0x0a5b0,
  0x052b0, // 2070-2079
  0x0b273,
  0x06930,
  0x07337,
  0x06aa0,
  0x0ad50,
  0x14b55,
  0x04b60,
  0x0a570,
  0x054e4,
  0x0d160, // 2080-2089
  0x0e968,
  0x0d520,
  0x0daa0,
  0x16aa6,
  0x056d0,
  0x04ae0,
  0x0a9d4,
  0x0a2d0,
  0x0d150,
  0x0f252, // 2090-2099
  0x0d520, // 2100
]

// 传统节日
const TRADITIONAL_FESTIVALS = {
  正月初一: "春节",
  正月十五: "元宵节",
  五月初五: "端午节",
  七月初七: "七夕节",
  八月十五: "中秋节",
  九月初九: "重阳节",
  腊月三十: "除夕",
  腊月廿三: "小年",
  腊月廿四: "小年",
}

// 二十四节气
const SOLAR_TERMS = [
  "小寒",
  "大寒",
  "立春",
  "雨水",
  "惊蛰",
  "春分",
  "清明",
  "谷雨",
  "立夏",
  "小满",
  "芒种",
  "夏至",
  "小暑",
  "大暑",
  "立秋",
  "处暑",
  "白露",
  "秋分",
  "寒露",
  "霜降",
  "立冬",
  "小雪",
  "大雪",
  "冬至",
]

// 节气对应的公历日期（从1900-2100年的节气数据）
// 这里简化处理，使用2000年附近的平均值
const TERM_INFO = [
  0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033,
  353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758,
]

/**
 * 获取农历年的天干地支
 * @param year 公历年份
 * @returns 天干地支纪年
 */
function getLunarYearName(year: number): string {
  const offset = year - 1900
  const stemIndex = offset % 10
  const branchIndex = offset % 12
  return CELESTIAL_STEMS[stemIndex] + TERRESTRIAL_BRANCHES[branchIndex] + "年"
}

/**
 * 获取农历年的生肖
 * @param year 公历年份
 * @returns 生肖
 */
function getChineseZodiac(year: number): string {
  const offset = year - 1900
  const zodiacIndex = offset % 12
  return CHINESE_ZODIAC[zodiacIndex]
}

/**
 * 获取某年的闰月月份，如果没有闰月返回0
 * @param year 农历年份
 * @returns 闰月月份，0表示没有闰月
 */
function getLeapMonth(year: number): number {
  const yearIndex = year - 1900
  if (yearIndex < 0 || yearIndex >= LUNAR_INFO.length) return 0
  return LUNAR_INFO[yearIndex] & 0xf
}

/**
 * 获取农历某年某月的天数
 * @param year 农历年份
 * @param month 农历月份
 * @param isLeapMonth 是否是闰月
 * @returns 该月天数
 */
function getLunarMonthDays(year: number, month: number, isLeapMonth: boolean): number {
  const yearIndex = year - 1900
  if (yearIndex < 0 || yearIndex >= LUNAR_INFO.length) return 30

  let monthInfo = LUNAR_INFO[yearIndex]
  const leapMonth = getLeapMonth(year)

  // 如果请求的是闰月，但该年没有闰月，返回30
  if (isLeapMonth && leapMonth !== month) return 30

  // 如果月份超过闰月，需要调整位置
  if ((!isLeapMonth && leapMonth > 0 && month > leapMonth) || (isLeapMonth && month === leapMonth)) {
    monthInfo = monthInfo >> 1
  }

  // 获取第month个月的大小月信息
  // 大月30天，小月29天
  return (monthInfo >> (16 - month)) & 0x1 ? 30 : 29
}

/**
 * 获取农历某年的总天数
 * @param year 农历年份
 * @returns 该年总天数
 */
function getLunarYearDays(year: number): number {
  let days = 0
  const leapMonth = getLeapMonth(year)

  // 计算12个月的天数
  for (let i = 1; i <= 12; i++) {
    days += getLunarMonthDays(year, i, false)
  }

  // 如果有闰月，加上闰月的天数
  if (leapMonth > 0) {
    days += getLunarMonthDays(year, leapMonth, true)
  }

  return days
}

/**
 * 公历日期转农历日期
 * @param date 公历日期
 * @returns 农历日期信息
 */
export function solarToLunar(date: Date): {
  year: number
  month: number
  day: number
  isLeapMonth: boolean
  yearName: string
  monthName: string
  dayName: string
  zodiac: string
  festival: string
  solarTerm: string
} {
  // 公历1900年1月31日为农历1900年正月初一
  const baseDate = new Date(1900, 0, 31)

  // 计算与基准日期相差的天数
  const offset = Math.floor((date.getTime() - baseDate.getTime()) / 86400000)

  // 计算农历年份
  let lunarYear = 1900
  let daysInLunarYear = getLunarYearDays(lunarYear)

  while (offset >= daysInLunarYear) {
    lunarYear++
    daysInLunarYear = getLunarYearDays(lunarYear)
  }

  // 计算农历月份
  let lunarMonth = 1
  let daysInLunarMonth = getLunarMonthDays(lunarYear, lunarMonth, false)
  const leapMonth = getLeapMonth(lunarYear)
  let isLeapMonth = false
  let offsetInYear = offset - (getLunarYearDays(lunarYear - 1) - getLunarYearDays(1900) + 0)

  while (offsetInYear >= daysInLunarMonth) {
    offsetInYear -= daysInLunarMonth

    if (lunarMonth === leapMonth) {
      if (!isLeapMonth) {
        isLeapMonth = true
        daysInLunarMonth = getLunarMonthDays(lunarYear, lunarMonth, true)
        if (offsetInYear < daysInLunarMonth) break
        offsetInYear -= daysInLunarMonth
      }
      isLeapMonth = false
    }

    lunarMonth++
    daysInLunarMonth = getLunarMonthDays(lunarYear, lunarMonth, false)
  }

  // 计算农历日期
  const lunarDay = offsetInYear + 1

  // 获取农历年月日的中文表示
  const yearName = getLunarYearName(lunarYear)
  const monthName = (isLeapMonth ? "闰" : "") + LUNAR_MONTHS[lunarMonth - 1] + "月"
  const dayName = LUNAR_DAYS[lunarDay - 1]

  // 获取生肖
  const zodiac = getChineseZodiac(lunarYear)

  // 获取传统节日
  const festivalKey = `${LUNAR_MONTHS[lunarMonth - 1]}月${LUNAR_DAYS[lunarDay - 1]}`
  const festival = TRADITIONAL_FESTIVALS[festivalKey] || ""

  // 获取节气（简化处理，实际上需要更复杂的算法）
  let solarTerm = ""
  const solarMonth = date.getMonth()
  const solarDay = date.getDate()

  // 简化的节气判断，仅作为示例
  // 实际应用中应该使用更精确的算法
  if ((solarMonth === 1 && solarDay === 4) || (solarMonth === 1 && solarDay === 5)) {
    solarTerm = "立春"
  } else if ((solarMonth === 2 && solarDay === 20) || (solarMonth === 2 && solarDay === 21)) {
    solarTerm = "春分"
  } else if ((solarMonth === 4 && solarDay === 5) || (solarMonth === 4 && solarDay === 6)) {
    solarTerm = "立夏"
  } else if ((solarMonth === 5 && solarDay === 21) || (solarMonth === 5 && solarDay === 22)) {
    solarTerm = "夏至"
  } else if ((solarMonth === 7 && solarDay === 7) || (solarMonth === 7 && solarDay === 8)) {
    solarTerm = "立秋"
  } else if ((solarMonth === 8 && solarDay === 22) || (solarMonth === 8 && solarDay === 23)) {
    solarTerm = "秋分"
  } else if ((solarMonth === 10 && solarDay === 7) || (solarMonth === 10 && solarDay === 8)) {
    solarTerm = "立冬"
  } else if ((solarMonth === 11 && solarDay === 21) || (solarMonth === 11 && solarDay === 22)) {
    solarTerm = "冬至"
  }

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeapMonth,
    yearName,
    monthName,
    dayName,
    zodiac,
    festival,
    solarTerm,
  }
}

/**
 * 获取完整的农历日期字符串
 * @param date 公历日期
 * @returns 农历日期字符串
 */
export function getLunarDateString(date: Date): string {
  const lunar = solarToLunar(date)
  let result = `${lunar.yearName} ${lunar.zodiac}年 ${lunar.monthName}${lunar.dayName}`

  if (lunar.festival) {
    result += ` 【${lunar.festival}】`
  }

  if (lunar.solarTerm) {
    result += ` 【${lunar.solarTerm}】`
  }

  return result
}

/**
 * 获取简短的农历日期字符串
 * @param date 公历日期
 * @returns 农历日期字符串
 */
export function getShortLunarDateString(date: Date): string {
  const lunar = solarToLunar(date)
  let result = `农历${lunar.monthName}${lunar.dayName}`

  if (lunar.festival) {
    result += ` | ${lunar.festival}`
  }

  if (lunar.solarTerm) {
    result += ` | ${lunar.solarTerm}`
  }

  return result
}
