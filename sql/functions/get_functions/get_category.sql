DROP PROCEDURE IF EXISTS dbo.get_category
GO  

CREATE PROCEDURE get_category
AS
	SELECT * FROM category;

/*
	EXEC get_category

*/