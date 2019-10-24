import * as bluebird from "bluebird";
import jwt from "jsonwebtoken";

export default class JWT {
    public static sign = bluebird.promisify(jwt.sign);
    public static verify = bluebird.promisify(jwt.verify);
    public static decode = bluebird.promisify(jwt.decode);
}
