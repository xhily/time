// 获取用户位置信息
export async function getUserLocation() {
  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()

    // 如果获取成功，返回城市名和时区偏移
    if (data && data.city && data.timezone) {
      // 从时区字符串中提取偏移量
      let offset = 8 // 默认为北京时间 (UTC+8)

      if (data.utc_offset) {
        offset = Number.parseInt(data.utc_offset) / 100
      }

      return {
        city: data.city,
        offset: offset,
      }
    }

    throw new Error("无法获取位置信息")
  } catch (error) {
    console.error("获取位置信息失败:", error)
    // 默认返回北京时间
    return {
      city: "未知位置",
      offset: 8,
    }
  }
}
