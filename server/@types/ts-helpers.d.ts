type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };
type NonNullable<T> = Exclude<T, null | undefined>;
