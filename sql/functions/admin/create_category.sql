DROP PROCEDURE IF EXISTS dbo.create_category
GO  

CREATE PROCEDURE create_category
	@category VARCHAR(40)
    
AS
	INSERT INTO category (name) VALUES (@category)

/*
	EXEC create_category 'Study'

*/