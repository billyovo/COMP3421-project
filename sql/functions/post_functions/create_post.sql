DROP PROCEDURE IF EXISTS dbo.create_post  
GO  

CREATE PROCEDURE create_post
	@category INT,
    @title VARCHAR(40),
	@content TEXT,
    @authorID INT 
    
AS
	INSERT INTO posts (category, title, authorID) VALUES (@category, @title, @authorID);
	DECLARE @postID AS INT;
	SET @postID = (
		SELECT IDENT_CURRENT('posts') AS result
	);
	EXEC reply_post @content, @authorID, @postID, NULL

/*
	EXEC create_post 1,'Is COMP3421 a good subject?', 'I want to take this course but I am not sure. Anyone has taken this course before?', 1

	EXEC create_post 5,'I want to go Japan!!', 'Open the border!!!!', 1

	select * from posts

*/