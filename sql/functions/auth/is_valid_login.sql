DROP PROCEDURE IF EXISTS is_valid_login
GO  

CREATE PROCEDURE is_valid_login
    @user_name VARCHAR(30),
	@password_hash VARCHAR(64)
AS
	SELECT user_name, userID FROM users WHERE password_hash = @password_hash AND user_name = @user_name;

/* 
	EXEC is_valid_login 'billyovo', '4d5d90e142a7450ea604b33647ba70da125cfc898e2fa5c8849666bbc1a026a5'
*/