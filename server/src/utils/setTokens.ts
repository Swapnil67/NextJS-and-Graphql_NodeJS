import { Request } from "express";

const jwt = require('jsonwebtoken');
const APP_SECRET = "keep_it_secret";

function getTokenPayload(token: string) {
  return jwt.verify(token, APP_SECRET);
}

export function getUserId(req: Request) {
  if (req) {
    const authHeader = req.headers.authorization;
    // console.log("Auth Header: ", authHeader);
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      // console.log("Auth token: ", token);
      
      if (!token) {
        throw new Error('No token found');
      }
      const { sub } = getTokenPayload(token);
      return sub;
    }
  }

  throw new Error('Not authenticated');
}
