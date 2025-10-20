import NodeCache from "node-cache";

export const groupCache =  new NodeCache({ stdTTL: 5 * 60, useClones: false });