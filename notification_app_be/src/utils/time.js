import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export function parseTimestamp(value) {
  if (!value) {
    return 0;
  }

  const parsed = dayjs(value, "YYYY-MM-DD HH:mm:ss", true);
  if (parsed.isValid()) {
    return parsed.valueOf();
  }

  const fallback = dayjs(value);
  return fallback.isValid() ? fallback.valueOf() : 0;
}
