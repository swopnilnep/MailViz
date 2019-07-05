SELECT 
    DATEPART(YEAR, GroupDate) AS Year,
    DATEPART(MONTH, GroupDate) AS Month,
    COUNT(FileID) AS EmailsSent
FROM tbl_ex_EmailAddresses
    GROUP BY 
        DATEPART(YEAR, GroupDate), 
        DATEPART(MONTH, GroupDate)
    ORDER BY 1, 2