export enum DateFormatter {
  DATE_UTC = "yyyy-MM-dd'T'HH:mm:ss'Z'",
  yyyy_MM_dd = "yyyy-MM-dd", // DATE_ONLY
  FULL_DATE_TIME = "dd MMM yyyy - hh:mm a", // DATE_TIME_FULL
  DATE_TIME_SEMI = 'yyyy/MM/dd - hh:mm a',
  MMM_D_YYY_Time = "MMM dd ,YYYY - hh:mm a",
  DATE_TIME_SEMI_TWO = 'hh:mm a - yyyy/MM/dd',
  DATE = 'dd MMMM yyyy',
  DATE_TWO = 'yyyy/MM/dd',
  DAY_ONLY = 'cccc',
  TIME_ONLY = 'hh:mm',
  TIME_SECONDS = 'mm:ss',
  AM_PM = 'a',
  TIME = 'hh:mm a',
  YEAR = 'yyyy',
  MONTH = 'MM',
  DAY = 'dd',
  FULL_DATE_TIME_12H = 'dd MMMM, yyyy, hh:mm a',
  DATE_TIME_ZONE = "yyyy-MM-dd'T'HH:mm:ssxxx",
  dd_MM_yyyy = "dd-MM-yyyy",
  MMM_dd_yyyy = "MMM dd ,yyyy",
  MM_D_yyy = "MM dd ,yyy",
  MMM_d_y_Time = "MMM d, y, h:mm a",
  d_MM_y = "d MMM y",
  MMM_D_Y = "MMM d, y",
  DD_MM = "dd MMM",
  DATE_PICKER = "dd/MM/yyyy",
}

export enum TimeFormatter {
  HOURS12Format = 'hh',
  HOURS24Format = 'HH',
  MINUTES = 'mm',
  SECONDS = 'ss',
}
