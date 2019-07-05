SELECT 
    DISTINCT FileID,
    DATEPART(YEAR, [GroupDate]) as Year,
    DATEPART(DAYOFYEAR, [GroupDate]) as DayOfYear,
    DATEPART(WEEKDAY, [GroupDate]) as DayOfWeek, 
    DATEPART(HOUR, [GroupDate]) as Hour,
    DATEPART(QUARTER, [GroupDate]) as Quarter
FROM tbl_ex_EmailAddresses