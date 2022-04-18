DROP PROCEDURE IF EXISTS dbo.get_post_by_category
GO  

CREATE PROCEDURE get_post_by_category
	@category INT,
	@page INT
AS
	SELECT title, users.user_name, posts.postID, reply.vote_count FROM posts 
	INNER JOIN users ON users.userID = posts.authorID 
	INNER JOIN reply ON reply.postID = posts.postID 
	WHERE category = @category AND reply.order_in_post = 1
	ORDER BY created_at
	OFFSET (@page-1)*20 ROWS FETCH NEXT 20 ROWS ONLY;
/*
	EXEC get_post_by_category 3, 1
*/