# COMP3421 Project
Backend for COMP3421 project forum system.

## API endpoints
<br>

### Auth
> POST **/auth/name_availability** 

<pre>
check duplicate account name before register
</pre>

POST body
<pre>
{
    "name": "test123test"
}
</pre>

POST response
<pre>
available: 200
not available: 409
</pre>
---
<br>
    
> POST **/auth/register**

<pre>
register a new account
</pre>

POST body
<pre>
{
    "name": "testaccount01",
    "password: "12345678"
}
</pre>

POST response
<pre>
success: 201
not success: 400
</pre>
---
<br>

> POST **/auth/login**

<pre>
login and get refresh token
</pre>

POST body
<pre>
{
    "name": "testaccount01",
    "password: "12345678"
}
</pre>

POST response
<pre>
200 success
{
    "user_name": "testaccount01",
    "userID:" 5
}
</pre>

not success: 
<pre>
401 Unauthorized.
</pre>
---
<br>

> POST **/auth/refresh_access**
<pre>
    get new access token with refresh token
</pre>

POST body
<pre>
nothing (from cookie)
</pre>

POST response
<pre>
Success: 200
Not success: 401

nothing (set cookie)
</pre>

### forum POST functions (need auth token to use)
---
<br>

> POST **/api/create_post**
<pre>
    create a new post
</pre>

POST body
<pre>
    {
        "category": 1,
        "title": "Is COMP3421 a good subject?",
        "content": "Has anyone tried it before? I want to take it",
        "userID": 1
    }
</pre>

POST response
<pre>
    Success: 201
    No Token: 401
    Error: 400
</pre>
---
<br>

> POST **/api/reply_post**
<pre>
    reply to existing reply
</pre>

POST body
<pre>
    {
        "content": "Yes that is a good subject",
        "userID": 2,
        "postID": 3,
        "reply_to_order": 1
    }

    reply_to_order is reply to the nth reply of the post. Can be null.
</pre>

POST response
<pre>
    Success: 201
    No Token: 401
    Error: 400
</pre>

---
<br>

> POST **/api/vote_post**
<pre>
    like or dislike a reply
</pre>

POST body
<pre>
    {
        "replyID" : 6,
        "userID": 1,
        "voteType": "like"
    }

    voteType can be "like" or "dislike"
</pre>

POST response
<pre>
    Success: 201
    No Token: 401
    Error: 400
</pre>

### forum GET functions (can be used without token)
---
<br>

> GET **/api/category**
<pre>
get existing topic category name and ID of the forum.
</pre>

Response
<pre>
[
	{
		"name": "Study",
		"id": 1
	},
	{
		"name": "News",
		"id": 2
	},

	etc...
]
</pre>
---
<br>

> GET **/api/category/:category/page/:page**
<pre>
get post title, author etc
</pre>

URL example
<pre>
/api/category/2/page/1
</pre>

Response
<pre>
[
	{
		"title": "News Fresh: world war started",
		"user_name": "billyovo",
		"postID": 5,
		"vote_count": 0,
		"created_at": "2022-04-17T13:59:52.843Z"
	}
]
</pre>
---
<br>

> GET **/api/post/:postID/page/:page**
<pre>
get reply of a post by postID. 
</pre>

URL example
<pre>
/api/post/1/page/1
</pre>

Response
<pre>
[
	{
		"content": "I want to take this course but I am not sure. Anyone has taken this course before?",
		"order_in_post": 1,
		"vote_count": 0,
		"comment_count": 0,
		"created_at": "2022-04-17T08:37:01.860Z",
		"reply_to_order": null,
		"replyID": 1,
		"user_name": "billyovo",
		"userID": 1
	},
	{
		"content": "Yes, it is very good. I have taken it before",
		"order_in_post": 2,
		"vote_count": 1,
		"comment_count": 1,
		"created_at": "2022-04-17T08:38:22.283Z",
		"reply_to_order": null,
		"replyID": 2,
		"user_name": "handsome_man01",
		"userID": 2
	},
    
	etc...
]
</pre>