import { prop } from "@typegoose/typegoose";
import { v4 as uuidv4 } from "uuid";

export abstract class BaseEntity {
  @prop({ type: String, required: true, _id: true, default: () => uuidv4() })
  _id: string;
}
