DROP PROCEDURE IF EXISTS dbo.register;  
GO  

CREATE PROCEDURE register 
	@user_name nvarchar(30),
	@password VARCHAR(60),
	@salt VARCHAR(8)
AS
	INSERT INTO users (user_name,password_hash,password_salt) VALUES (@user_name, @password, @salt)


/* 
	EXEC register 'billyovo', '4d5d90e142a7450ea604b33647ba70da125cfc898e2fa5c8849666bbc1a026a5', 's3h4t6wq' 

	PW: 12345678


	salt = 8 random bits
	hash = pw+salt --> sha256

	hash 12345678s3h4t6wq = 4d5d90e142a7450ea604b33647ba70da125cfc898e2fa5c8849666bbc1a026a5
*/