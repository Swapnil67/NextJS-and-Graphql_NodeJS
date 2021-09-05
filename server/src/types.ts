import { Request, Response } from "express";

export type MyContext = {
  req: Request;
  res: Response;
  userId?: number | null;
} 

// ------------------- Context For Mikro-ORM -----------------------
/*
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
  userId?: number | null;
} 
*/