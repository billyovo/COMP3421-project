DROP PROCEDURE IF EXISTS dbo.vote_reply
GO  

CREATE PROCEDURE vote_reply
	@replyID INT,
    @userID INT,
    @voteType VARCHAR(7)
AS
	BEGIN
		IF EXISTS (SELECT 1 FROM vote WHERE replyID = @replyID AND userID = @userID)
			BEGIN
				 RAISERROR('Alreaday voted!', 18, 1)
				 RETURN
			END
        INSERT INTO vote (replyID, userID, voteType) VALUES (@replyID, @userID, @voteType);
		IF @voteType = 'like'
            BEGIN
                UPDATE reply SET vote_count = vote_count + 1 WHERE replyID = @replyID
            END
        ELSE
            BEGIN
                UPDATE reply SET vote_count = vote_count - 1 WHERE replyID = @replyID
            END     
	END;
/*
	
	EXEC vote_reply 1, 1, 'dislike'

	SELECT * from reply
	SELECT * FROM vote
*/