DECLARE @noName BIGINT
SELECT @noName = EmailAddressID FROM tbl_ex_emailaddresslist
WHERE EmailName = '[NO_NAME]' AND EmailAddress = '[NO_ADDRESS]';

SELECT SenderID, RecepientID, COUNT(DISTINCT FileID) as EmailsSent 
    FROM tbl_ex_EmailAddresses
    WHERE SenderID != @noName AND RecepientID != @noName
    GROUP BY SenderID, RecepientID
    ORDER BY EmailsSent DESC;