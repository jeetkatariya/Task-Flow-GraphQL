export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'archived';

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export type Filter<T> = {
  [K in keyof T]?: T[K] | { eq?: T[K]; ne?: T[K]; in?: T[K][]; notIn?: T[K][] };
};

export type Sort<T> = {
  field: keyof T;
  direction: 'ASC' | 'DESC';
};

export interface PaginationInput {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type QueryOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn' | 'like' | 'ilike' | 'isNull' | 'isNotNull';

export interface QueryCondition<T> {
  field: keyof T;
  operator: QueryOperator;
  value: any;
}

export type QueryBuilder<T> = {
  where(condition: QueryCondition<T>): QueryBuilder<T>;
  andWhere(condition: QueryCondition<T>): QueryBuilder<T>;
  orWhere(condition: QueryCondition<T>): QueryBuilder<T>;
  orderBy(field: keyof T, direction: 'ASC' | 'DESC'): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  offset(count: number): QueryBuilder<T>;
  build(): any;
};

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  byDay?: number[];
  byMonth?: number[];
  byMonthDay?: number[];
  count?: number;
  until?: Date;
  timezone?: string;
}
