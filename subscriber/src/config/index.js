import dotenv from 'dotenv';
import path from 'path';

try {
  dotenv.config({ path: path.resolve(__dirname, `.env`) })
} catch (e) {
  throw new Error(`Unable to load '${process.env.PROFILE}' configuration.`);
}