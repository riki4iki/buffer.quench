/* eslint-disable @typescript-eslint/camelcase */
import { config } from "dotenv";

config();

//To work with test facebook user need put into enviroments access token in TEST_FACEBOOK_TOKEN property
//that token can be obtained from site facebook developers -> your facebook application -> roles ->
// -> test users -> add new test user -> button 'edit' new test user -> get access token for test user
//after, facebook will generate access token on 2 hours.
//For getting user access token for 60 hours - https://developers.facebook.com/docs/facebook-login/access-tokens/refreshing/
const facebook_test_user = {
   name: "Patricia Aldeiiicdahgh Sadanson",
   id: "105339111009400",
   access_token: process.env.TEST_FACEBOOK_TOKEN,
   email: "vcketdnleo_1579130459@tfbnw.net",
};

export { facebook_test_user };
