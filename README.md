#buffer.quench
domain name - http://buffer-quench-api.herokuapp.com/

    api: /api/v1/auth/localAuth/sign-up - post - body:[email,password] - create new user with email/password
    			return jwt pair[accesstoken, refreshtoken, expiresIn]
    	/api/v1/auth/localAuth/sign-up - post - body:[email, password] - auth by email/password
    			return jwt pair[accesstoken, refreshtoken, expiresIn]
    	/api/v1/auth/refresh - post - headers:[refresh_token] - update refresh token
    			return new jwt pair[accesstoken, refreshtoken, expiresIn]
    	/api/v1/user - get - headers:[access_token] - current user
    			return user object (email, id)
    	/api/v1/user - put - headers:[access_token] -uddate current user information (email, password)
    			return updated user
    	/api/v1/user - delete - headers:[access_token] - delete current user
    			return 204
