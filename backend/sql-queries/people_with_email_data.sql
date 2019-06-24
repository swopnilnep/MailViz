WITH 
tbl_emails_received AS
    (
        SELECT RecepientID, count(FileID) AS EmailsReceived 
        FROM tbl_ex_EmailAddresses
        WHERE GroupDate >= '2001-05-06' 
            AND GroupDate <= '2001-05-09'
        GROUP BY RecepientID
    ),
tbl_emails_sent AS
    (
        SELECT SenderId, count(FileID) AS EmailsSent
        FROM tbl_ex_EmailAddresses
        WHERE GroupDate >= '2001-05-06' 
            AND GroupDate <= '2001-05-09'
        GROUP BY SenderID
    )

SELECT e.EmailAddressID as Id, r.EmailsReceived, s.EmailsSent
    FROM tbl_ex_EmailAddresses e
    
    LEFT JOIN tbl_emails_received r
        ON r.RecepientID = e.EmailAddressID
    LEFT JOIN tbl_emails_sent s
        ON s.SenderID = e.EmailAddressID


    WHERE r.EmailsReceived IS NOT NULL
        OR 
         s.EmailsSent IS NOT NULL

    ORDER BY Id     