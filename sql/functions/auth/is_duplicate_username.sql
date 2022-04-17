DROP PROCEDURE IF EXISTS dbo.is_duplicate_username
GO  

CREATE PROCEDURE dbo.is_duplicate_username
	@user_name nvarchar(30)
AS
	IF EXISTS (SELECT user_name FROM users WHERE user_name = @user_name AS is_duplicate)
        SELECT 1 AS is_duplicate;
    ELSE
        SELECT 0 AS is_duplicate;


/* 
	EXEC is_duplicate_username 'billyovo'
*/