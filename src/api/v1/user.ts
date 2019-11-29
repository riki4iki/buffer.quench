import Router from "koa-router";
import User from "../../models/user";
import { getManager, Repository } from "typeorm";
import { validate, ValidationError } from "class-validator";
import { Context, Next } from "koa";

const router = new Router();
const validateUUID = async (ctx: Context, next: Next) => {
  //validation middleware for cheking uuid cause it's can crush server with 500 status...
  const id: string = ctx.params.id;
  const uuid = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(
    //validate by regex
    id
  );
  if (!uuid) {
    ctx.status = 400;
    ctx.body = "uuid validation error";
  } else {
    await next(); // next endpoint
  }
};

router.get("/", async (ctx: Context, next: Next) => {
  const userRepository: Repository<User> = getManager().getRepository(User); //get user repos
  const users: User[] = await userRepository.find(); // find all user from table
  ctx.status = 200; //status OK
  ctx.body = users; // send array
  await next();
});

router.get("/:id", validateUUID, async (ctx: Context, next: Next) => {
  const userRepository: Repository<User> = getManager().getRepository(User); //get user repos
  const id: string = ctx.params.id;

  const user: User = await userRepository.findOne({ where: { id: id } }); //find user this target id
  if (!user) {
    //user doesnt exist in db
    ctx.status = 400;
    ctx.body = "user with this id doesn't exist ";
  } else {
    //return user
    ctx.status = 200;
    ctx.body = user;
  }
  await next();
});

router.post("/", async (ctx, next) => {
  const userRepository: Repository<User> = getManager().getRepository(User); //get user repos

  const targetUser: User = new User(); //create new entity
  targetUser.email = ctx.request.body.email;
  targetUser.password = ctx.request.body.password;
  const errors: ValidationError[] = await validate(targetUser); //validate

  if (errors.length > 0) {
    //if error exist
    ctx.status = 400;
    ctx.body = errors;
  } else if (await userRepository.findOne({ email: targetUser.email })) {
    //if user with email exist (email must be unique)
    ctx.status = 400;
    ctx.body = "email already exist";
  } else {
    //0 errors, new email
    const user = await userRepository.save(targetUser);
    ctx.status = 201;
    ctx.body = user;
  }
  await next();
});

router.put("/:id/update", validateUUID, async (ctx, next) => {
  const userRepository: Repository<User> = getManager().getRepository(User); // get user repos
  const nextUser: User = new User(); // create data thta will replace previous user
  const id: string = ctx.params.id;
  nextUser.id = id;
  nextUser.email = ctx.request.body.email;
  nextUser.password = ctx.request.body.password;

  const errors: ValidationError[] = await validate(nextUser);
  //validate errors (Problem: i can't update with target prop. Need send all user data)
  if (errors.length > 0) {
    //validation errors
    ctx.status = 400;
    ctx.body = errors;
  } else if (!(await userRepository.findOne(id))) {
    //if user doesn't exist - dont need to update user....
    ctx.status = 400;
    ctx.body = "target user doesn't exist";
  } else if (await userRepository.findOne({ email: nextUser.email })) {
    //if next user email already exist
    ctx.status = 400;
    ctx.body = "input email already exist";
  } else {
    //replace precious user
    const updated: User = await userRepository.save(nextUser);
    ctx.status = 201;
    ctx.body = updated;
  }
});
router.delete("/:id/delete", validateUUID, async (ctx: Context, next: Next) => {
  const userRepository = getManager().getRepository(User); // get user Repos
  const id: string = ctx.params.id;
  const user = await userRepository.findOne(id); // find user with target id
  if (!user) {
    //id user doesn't exist send bad request
    ctx.status = 400;
    ctx.body = "target user doesn't exist";
  } else {
    await userRepository.remove(user); //remove from db
    ctx.status = 204; //send no content
  }
});
export = router;
