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
)
SELECT RecepientID as Id, COUNT(FileID) AS EmailsReceived FROM tbl_sender
GROUP BY RecepientID
ORDER BY EmailsReceived DESC;