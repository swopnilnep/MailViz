SELECT 
    -- meta.FileID, 
    meta.Subject,
    -- emails.RecepientID,
    -- emails.SenderID,
    MIN(emails.GroupDate) AS startDate,
    MAX(emails.GroupDate) AS endDate
FROM
tbl_ex_emailmeta meta
JOIN tbl_ex_EmailAddresses emails
ON meta.FileID = emails.FileID
WHERE emails.SenderID = 3
    AND emails.RecepientID = 3
GROUP BY meta.Subject

;

-- SELECT * FROM tbl_ex_EmailAddresses