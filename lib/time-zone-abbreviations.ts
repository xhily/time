// 时区缩写映射表
// 包含主要时区的标准缩写和夏令时缩写

export const timeZoneAbbreviations = {
  // 北美洲
  "-10": { standard: "HST", daylight: "HDT", name: "Hawaii–Aleutian" }, // 夏威夷-阿留申时间
  "-9": { standard: "AKST", daylight: "AKDT", name: "Alaska" }, // 阿拉斯加时间
  "-8": { standard: "PST", daylight: "PDT", name: "Pacific" }, // 太平洋时间
  "-7": { standard: "MST", daylight: "MDT", name: "Mountain" }, // 山地时间
  "-6": { standard: "CST", daylight: "CDT", name: "Central" }, // 中部时间
  "-5": { standard: "EST", daylight: "EDT", name: "Eastern" }, // 东部时间
  "-4": { standard: "AST", daylight: "ADT", name: "Atlantic" }, // 大西洋时间
  "-3.5": { standard: "NST", daylight: "NDT", name: "Newfoundland" }, // 纽芬兰时间
  "-3": { standard: "ART", daylight: "ART", name: "Argentina" }, // 阿根廷时间

  // 欧洲和非洲
  "0": { standard: "GMT", daylight: "BST", name: "Greenwich Mean" }, // 格林威治标准时间/英国夏令时
  "1": { standard: "CET", daylight: "CEST", name: "Central European" }, // 中欧时间
  "2": { standard: "EET", daylight: "EEST", name: "Eastern European" }, // 东欧时间
  "3": { standard: "MSK", daylight: "MSK", name: "Moscow" }, // 莫斯科时间

  // 亚洲
  "3.5": { standard: "IRST", daylight: "IRDT", name: "Iran" }, // 伊朗时间
  "4": { standard: "GST", daylight: "GST", name: "Gulf" }, // 海湾时间
  "4.5": { standard: "AFT", daylight: "AFT", name: "Afghanistan" }, // 阿富汗时间
  "5": { standard: "PKT", daylight: "PKT", name: "Pakistan" }, // 巴基斯坦时间
  "5.5": { standard: "IST", daylight: "IST", name: "India" }, // 印度时间
  "5.75": { standard: "NPT", daylight: "NPT", name: "Nepal" }, // 尼泊尔时间
  "6": { standard: "BST", daylight: "BST", name: "Bangladesh" }, // 孟加拉时间
  "6.5": { standard: "MMT", daylight: "MMT", name: "Myanmar" }, // 缅甸时间
  "7": { standard: "ICT", daylight: "ICT", name: "Indochina" }, // 印度支那时间
  "8": { standard: "CST", daylight: "CST", name: "China" }, // 中国标准时间
  "9": { standard: "JST", daylight: "JST", name: "Japan" }, // 日本标准时间
  "9.5": { standard: "ACST", daylight: "ACDT", name: "Australian Central" }, // 澳大利亚中部时间
  "10": { standard: "AEST", daylight: "AEDT", name: "Australian Eastern" }, // 澳大利亚东部时间
  "11": { standard: "AEDT", daylight: "AEDT", name: "Australian Eastern Daylight" }, // 澳大利亚东部夏令时
  "12": { standard: "NZST", daylight: "NZDT", name: "New Zealand" }, // 新西兰时间
  "13": { standard: "TOT", daylight: "TOT", name: "Tonga" }, // 汤加时间

  // 负时区（西半球）
  "-1": { standard: "AZOST", daylight: "AZOST", name: "Azores" }, // 亚速尔群岛时间
  "-2": { standard: "GST", daylight: "GST", name: "South Georgia" }, // 南乔治亚时间
  "-11": { standard: "SST", daylight: "SST", name: "Samoa" }, // 萨摩亚时间
  "-12": { standard: "BIT", daylight: "BIT", name: "Baker Island" }, // 贝克岛时间
}

/**
 * 获取时区缩写
 * @param offset 时区偏移量
 * @param isDST 是否是夏令时
 * @returns 时区缩写对象
 */
export function getTimeZoneAbbreviation(
  offset: number,
  isDST = false,
): {
  abbr: string
  name: string
} {
  const offsetStr = offset.toString()
  const tzInfo = timeZoneAbbreviations[offsetStr]

  if (tzInfo) {
    return {
      abbr: isDST ? tzInfo.daylight : tzInfo.standard,
      name: tzInfo.name,
    }
  }

  // 如果没有找到匹配的缩写，返回通用格式
  const sign = offset >= 0 ? "+" : ""
  return {
    abbr: `UTC${sign}${offset}`,
    name: `Coordinated Universal Time ${sign}${offset}`,
  }
}

/**
 * 判断指定日期在指定时区是否处于夏令时
 * 这是一个简化的实现，实际上夏令时的规则非常复杂，因地区而异
 *
 * @param date 日期
 * @param offset 时区偏移量
 * @returns 是否是夏令时
 */
export function isDaylightSavingTime(date: Date, offset: number): boolean {
  // 简化处理：北半球4月到10月为夏令时，南半球10月到4月为夏令时
  // 这只是一个粗略的估计，实际上每个国家和地区的夏令时规则都不同
  const month = date.getMonth() // 0-11

  // 只有某些时区使用夏令时
  const usesDST = [-10, -9, -8, -7, -6, -5, -4, -3.5, 0, 1, 2].includes(offset)
  if (!usesDST) return false

  // 北半球夏令时：4月到10月
  if (offset >= -5 && offset <= 2) {
    return month >= 3 && month <= 9
  }

  // 南半球夏令时：10月到4月
  if (offset <= -6 || offset >= 8) {
    return month >= 9 || month <= 3
  }

  return false
}
