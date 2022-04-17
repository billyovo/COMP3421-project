DROP PROCEDURE IF EXISTS dbo.get_salt_by_username
GO  

CREATE PROCEDURE dbo.get_salt_by_username
	@user_name nvarchar(30)
AS
	SELECT password_salt FROM users WHERE user_name = @user_name;


/* 
	EXEC get_salt_by_username 'billyovo'
*/