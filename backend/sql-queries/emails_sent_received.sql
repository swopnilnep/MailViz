WITH 
tbl_emails_received AS
    (
        SELECT RecepientID, count(FileID) AS EmailsRecieved 
        FROM tbl_ex_EmailAddresses
        GROUP BY RecepientID
    ),
tbl_emails_sent AS
    (
        SELECT SenderId, count(FileID) AS EmailsSent
        FROM tbl_ex_EmailAddresses
        GROUP BY SenderID
    )

SELECT s.SenderID as Id, r.EmailsRecieved, s.EmailsSent, 
    r.EmailsRecieved + s.EmailsSent as TotalEmails,
    slist.EmailAddress, slist.EmailName, slist.DomainName
FROM tbl_emails_received r
    JOIN tbl_emails_sent s
        ON r.RecepientID = s.SenderID
    JOIN tbl_ex_emailaddresslist slist
        ON slist.EmailAddressID = s.SenderID
ORDER BY Id ASC
;