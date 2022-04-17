DROP PROCEDURE IF EXISTS dbo.reply_post
GO  

CREATE PROCEDURE reply_post
	@content TEXT,
    @authorID INT,
    @postID INT,
	@reply_to_order INT
AS
	BEGIN
		DECLARE @order_in_post AS INT;
		IF EXISTS (SELECT 1 FROM reply WHERE postID = @postID)
			BEGIN
				SET @order_in_post = (
					SELECT MAX(order_in_post) FROM reply WHERE postID = @postID
				);
			END
		ELSE
			BEGIN
				SET @order_in_post = 0;
			END
		IF @reply_to_order IS NOT NULL
			BEGIN
				UPDATE reply SET comment_count = comment_count + 1 WHERE postID = @postID AND order_in_post = @reply_to_order
			END
		INSERT INTO reply (content, authorID, postID, order_in_post,comment_count, vote_count, reply_to_order, created_at) 
		VALUES (@content, @authorID, @postID, @order_in_post+1, 0, 0, @reply_to_order, getdate())
	END;
/*
	EXEC reply_post 'Yes, it is very good. I have taken it before', 2, 1, NULL


	EXEC reply_post 'agree!', 2, 1, 2

*/