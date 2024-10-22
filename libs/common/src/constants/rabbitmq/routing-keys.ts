import { QUEUES } from './queues';

export const ROUTING_KEYS = QUEUES;

export type RoutingKeyType = (typeof ROUTING_KEYS)[keyof typeof ROUTING_KEYS];
