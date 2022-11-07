import { connectDatabase } from './config/pool.js.js';
connectDatabase();

const user =
	`CREATE TABLE IF NOT EXISTS "user"(
	    "id" SERIAL,
	    "username" TEXT NOT NULL,
	    "role" TEXT NOT NULL,
	    PRIMARY KEY ("id")
    )`;

export default user;
    




	//how to assign the roles of Admin and User
