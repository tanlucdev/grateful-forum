import type { AppLocale } from "@/i18n/routing";

export function getCompanionTimeCopy(hour: number, locale: AppLocale = "vi") {
  if (locale === "en") {
    if (hour >= 5 && hour < 11) {
      return {
        greeting: "Gentle morning.",
        nudge: "Write one small thing you want to carry into today.",
        label: "Morning",
      };
    }

    if (hour >= 11 && hour < 14) {
      return {
        greeting: "Peaceful noon.",
        nudge: "Pause for three minutes to thank one thing that held you up.",
        label: "Noon",
      };
    }

    if (hour >= 14 && hour < 18) {
      return {
        greeting: "Soft afternoon.",
        nudge: "Look back at one moment that made today brighter.",
        label: "Afternoon",
      };
    }

    if (hour >= 18 && hour < 23) {
      return {
        greeting: "Quiet evening.",
        nudge: "Close the day with one nearby gratitude.",
        label: "Evening",
      };
    }

    return {
      greeting: "Still late night.",
      nudge: "Write lightly, just enough to set your heart down.",
      label: "Late night",
    };
  }

  if (hour >= 5 && hour < 11) {
    return {
      greeting: "Chào buổi sáng lành.",
      nudge: "Ghi một điều nhỏ bạn muốn mang theo hôm nay.",
      label: "Buổi sáng",
    };
  }

  if (hour >= 11 && hour < 14) {
    return {
      greeting: "Chào buổi trưa an yên.",
      nudge: "Dừng 3 phút để cảm ơn một điều đã nâng đỡ bạn.",
      label: "Buổi trưa",
    };
  }

  if (hour >= 14 && hour < 18) {
    return {
      greeting: "Chào buổi chiều dịu nhẹ.",
      nudge: "Nhìn lại một khoảnh khắc đã làm ngày hôm nay sáng hơn.",
      label: "Buổi chiều",
    };
  }

  if (hour >= 18 && hour < 23) {
    return {
      greeting: "Chào buổi tối bình yên.",
      nudge: "Khép ngày bằng một lời biết ơn thật gần.",
      label: "Buổi tối",
    };
  }

  return {
    greeting: "Chào đêm khuya tĩnh lặng.",
    nudge: "Viết nhẹ thôi, đủ để lòng mình được đặt xuống.",
    label: "Đêm khuya",
  };
}
