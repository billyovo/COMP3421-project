DROP PROCEDURE IF EXISTS dbo.get_reply_by_postID
GO  

CREATE PROCEDURE get_reply_by_postID
	@postID INT,
    @page INT
AS
	SELECT content, order_in_post, vote_count, comment_count, reply_to_order, replyID, user_name, userID FROM reply 
		INNER JOIN users ON users.userID = reply.authorID WHERE postID = @postID ORDER BY order_in_post OFFSET (@page-1)*20 ROWS FETCH NEXT 20 ROWS ONLY;

/*
	EXEC get_reply_by_postID 1, 1
*/