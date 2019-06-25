WITH tbl_sender AS
    (
        SELECT
            EmailAddressID,
            FileID,
            SenderID,
            RecepientID,
            Category,
            GroupDate
        FROM tbl_ex_EmailAddresses
        WHERE SenderID = 1721
    ),
    tbl_union AS (
        SELECT 
            SenderID as Id
            FROM tbl_sender t1
        UNION
        SELECT
            RecepientID
            FROM tbl_sender t2
    )
SELECT DomainName, COUNT(Id) AS EmailsReceived FROM
tbl_union
JOIN tbl_ex_emailaddresslist tlist 
ON tbl_union.Id = tlist.EmailAddressID
GROUP BY DomainName
ORDER BY EmailsReceived DESC