import { config } from "dotenv";

config();

const facebook_test_user = {
   name: "Patricia Aldeiiicdahgh Sadanson",
   id: "105339111009400",
   access_token: process.env.TEST_FACEBOOK_TOKEN,
};

export { facebook_test_user };
