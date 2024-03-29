/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Makes T a union of T, null, and undefined
 */
export type Nullable<T> = T | null | undefined;

/**
 * Makes all properties of T mutable
 */
export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

/**
 * Picks the element type of the given iterable.
 * For example, for the given array literal type: ["foo", "bar", "baz"],
 * the type is "foo"|"bar"|"baz"
 */
export type ElementOf<Iterable> = Iterable extends (infer ArrayElementType)[]
	? ArrayElementType
	: Iterable extends readonly (infer ReadonlyArrayElementType)[]
	? ReadonlyArrayElementType
	: Iterable extends Set<infer SetElementType>
	? SetElementType
	: Iterable extends string
	? Iterable
	: never;

/**
 * Something that is an array of T's or a single T
 */
export type MaybeArray<T> = T[] | T;

/**
 * Ensures that T is an array of the element type of T
 */
export type EnsureArray<T> = T extends (infer U)[] ? U[] : T[];

/**
 * A variant of Required where not only the keys are required, but also the values
 */
export type RequiredValues<T> = {
	[P in keyof T]-?: Exclude<T[P], null | undefined>;
};

/**
 * Picks only keys for which there is an optional modifier
 */
export type PickOptional<T> = Pick<
	T,
	Exclude<
		{
			[K in keyof T]: T extends Record<K, T[K]> ? never : K;
		}[keyof T],
		undefined
	>
>;

/**
 * Picks only keys for which there is no optional modifier
 */
export type PickRequired<T> = Pick<
	T,
	Exclude<
		{
			[K in keyof T]: T extends Record<K, T[K]> ? K : never;
		}[keyof T],
		undefined
	>
>;

/**
 * Picks those keys from A that intersects with those from B
 */
export type PickIntersectingKeys<A, B> = Pick<
	A,
	Exclude<
		{
			[Key in keyof A]: Key extends keyof B ? Key : never;
		}[keyof A],
		undefined
	>
>;

/**
 * Picks from T the properties for which their type matches Type
 */
export type PickMembersOfType<T, Type> = Pick<
	T,
	{
		[Key in keyof T]: T[Key] extends Type ? Key : never;
	}[keyof T]
>;

export type PickMembersOfNotOfType<T, Type> = Pick<
	T,
	{
		[Key in keyof T]: T[Key] extends Type ? never : T[Key] extends Type | undefined ? never : Key;
	}[keyof T]
>;

/**
 * Builds up a lookup path into a record via tuple elements. For example, for the record `{ a: {b: {c: string}}}`, a valid value could be `["a", "b", "c"]`
 * It takes as the second optional type argument the maximum depth it can recursively descent into the target object (default: 10).
 * When an Array is discovered, indexes into the array can be provided. For example, for the record `{a: {foo: string}[]}`, a value like `["a", 0, "foo"]` is allowed.
 */
export type ObjectLookupTuple<T, MaxDepth extends number = 10> = ObjectLookupTupleHelper<T, [], MaxDepth>;
type ObjectLookupTupleHelper<T, Acc extends PropertyKey[], MaxDepth extends number, CurrentDepth extends number = 0> = {
	[Key in keyof T]: CurrentDepth extends MaxDepth
		? [...Acc, Key]
		: T[Key] extends IgnoredLookupValue
		? [...Acc, Key]
		: T[Key] extends (infer El)[] | readonly (infer El)[]
		? [...Acc, Key] | ObjectLookupTupleHelper<El, [...Acc, Key, number], MaxDepth, Next<CurrentDepth>>
		: [...Acc, Key] | ObjectLookupTupleHelper<NonNullable<T[Key]>, [...Acc, Key, number], MaxDepth, Next<CurrentDepth>>;
}[keyof T];

/**
 * A variant of ObjectLookupTuple that will walk into arrays and allow looking up members of their records as part of the lookup path. For
 * example, for the record `{a: {foo: string}[]}`, a value like `["a", "foo"]` is allowed, even though 'foo' is part of a record within an array
 */
export type ArrayPiercingObjectLookupTuple<T, MaxDepth extends number = 10> = ArrayPiercingObjectLookupTupleHelper<T, [], MaxDepth>;
type ArrayPiercingObjectLookupTupleHelper<T, Acc extends PropertyKey[], MaxDepth extends number, CurrentDepth extends number = 0> = {
	[Key in keyof T]: CurrentDepth extends MaxDepth
		? [...Acc, Key]
		: T[Key] extends IgnoredLookupValue
		? [...Acc, Key]
		: T[Key] extends (infer El)[] | readonly (infer El)[]
		? [...Acc, Key] | ArrayPiercingObjectLookupTupleHelper<El, [...Acc, Key], MaxDepth, Next<CurrentDepth>>
		: [...Acc, Key] | ArrayPiercingObjectLookupTupleHelper<NonNullable<T[Key]>, [...Acc, Key], MaxDepth, Next<CurrentDepth>>;
}[keyof T];

/**
 * Behaves similar to ObjectLookupTuple, but builds up strings that dot into objects. For example, for the record `{ a: {b: {c: string}}}`, a valid value could be `a.b.c`
 */
export type ObjectLookupString<T, MaxDepth extends number = 10, StopAtArrays extends boolean = false> = ObjectLookupStringHelper<T, ``, MaxDepth, 0, StopAtArrays>;
type MaybeSuffixWithDot<T extends string> = T extends `` ? T : `${T}.`;
type ObjectLookupStringHelper<T, Acc extends string, MaxDepth extends number, CurrentDepth extends number = 0, StopAtArrays extends boolean = false> = {
	[Key in keyof T]: Key extends string
		? CurrentDepth extends MaxDepth
			? `${MaybeSuffixWithDot<Acc>}${Key}`
			: T[Key] extends IgnoredLookupValue
			? `${MaybeSuffixWithDot<Acc>}${Key}`
			: T[Key] extends (infer El)[] | readonly (infer El)[]
			? StopAtArrays extends true
				? `${MaybeSuffixWithDot<Acc>}${Key}`
				: `${MaybeSuffixWithDot<Acc>}${Key}.${number}` | El extends IgnoredLookupValue
				? `${MaybeSuffixWithDot<Acc>}${Key}.${number}`
				: ObjectLookupStringHelper<El, `${MaybeSuffixWithDot<Acc>}${Key}.${number}`, MaxDepth, Next<CurrentDepth>, StopAtArrays>
			: `${MaybeSuffixWithDot<Acc>}${Key}` | ObjectLookupStringHelper<NonNullable<T[Key]>, `${MaybeSuffixWithDot<Acc>}${Key}`, MaxDepth, Next<CurrentDepth>, StopAtArrays>
		: never;
}[keyof T];

/**
 * A variant of Partial that is deep.
 * This means that every value is a partial recursively
 * while still preserving primitive or built-in types as they are
 */
export type PartialDeep<T, MaxDepth extends number = 10, CurrentDepth extends number = 0> = CurrentDepth extends MaxDepth
	? T
	: T extends IgnoredLookupValue
	? T
	: T extends (infer ArrayElement)[]
	? PartialDeep<ArrayElement, MaxDepth, Next<CurrentDepth>>[]
	: T extends readonly (infer ReadonlyArrayElement)[]
	? readonly PartialDeep<ReadonlyArrayElement, MaxDepth, Next<CurrentDepth>>[]
	: T extends Iterable<infer IterableType>
	? Iterable<PartialDeep<IterableType, MaxDepth, Next<CurrentDepth>>>
	: {[P in keyof T]?: PartialDeep<T[P], MaxDepth, Next<CurrentDepth>>};

/**
 * A variant of Required that is deep.
 * This means that every key is required recursively
 * while still preserving primitive or built-in types as they are
 */
export type RequiredDeep<T, MaxDepth extends number = 10, CurrentDepth extends number = 0> = CurrentDepth extends MaxDepth
	? T
	: T extends IgnoredLookupValue
	? T
	: T extends (infer ArrayElement)[]
	? RequiredDeep<ArrayElement, MaxDepth, Next<CurrentDepth>>[]
	: T extends readonly (infer ReadonlyArrayElement)[]
	? readonly RequiredDeep<ReadonlyArrayElement, MaxDepth, Next<CurrentDepth>>[]
	: T extends Iterable<infer IterableType>
	? Iterable<RequiredDeep<IterableType, MaxDepth, Next<CurrentDepth>>>
	: {[P in keyof T]-?: RequiredDeep<T[P], MaxDepth, Next<CurrentDepth>>};

/**
 * A partial of T except for the keys given in K
 */
export type PartialExcept<T, K extends keyof T> = Omit<Partial<T>, K> & Pick<T, K>;

/**
 * A partial of T except for the keys given in K
 */
export type PartialDeepExcept<T, K extends keyof T> = Omit<PartialDeep<T>, K> & Pick<T, K>;

/**
 * Require all keys in T, except for the keys given in K
 */
export type RequiredExcept<T, K extends keyof T> = Omit<Required<T>, K> & Pick<T, K>;

/**
 * Splits a record into all of its possible property intersections.
 * For example, for the record {a: 1; b: 2>}, splitting the record will
 * get the type {a: 1} | {b: 2} back.
 */
export type SplitRecord<T, U = T> = Exclude<
	{
		[Key in keyof T]: {
			[K in Key]: K extends keyof U ? T[K] : never;
		};
	}[keyof T],
	undefined
>;

/**
 * A variant of `SplitRecord` that includes all similar keys.
 * See the documentation for `SimilarObjectKeys` for more details.
 */
export type SplitRecordWithSimilarKeys<T, U = T> = Exclude<
	{
		[Key in keyof T]: Key extends keyof U ? SimilarObjectKeys<T, Key & string> : never;
	}[keyof T],
	undefined
>;

/**
 * Selects only the properties from an object for which the keys include the substring(s) given in U.
 * For example, for the object {foo: 1, fooBar: 2, barFoo: 3, baz: 4}, a value of "foo" for U will return an object with only the keys "foo", "fooBar", and "barFoo"
 */
export type SimilarObjectKeys<T, U extends keyof T & string> = PickMembersOfNotOfType<
	{
		[TKey in keyof T]: TKey extends U
			? T[TKey]
			: TKey extends `${infer _Prefix}${Capitalize<U>}`
			? T[TKey] | undefined
			: TKey extends `${infer _Prefix}${U}`
			? T[TKey] | undefined
			: TKey extends `${U}${infer _Suffix}`
			? T[TKey] | undefined
			: never;
	},
	never
>;

/**
 * An arbitrary Function that takes any amount of arguments and returns anything
 */
export type ArbitraryFunction<ReturnType = unknown> = (...args: never[]) => ReturnType;
export type ArbitraryConstructor<T> = new (...args: never[]) => T;

/**
 * Gets the length of T
 */
export type GetLength<T extends unknown[]> = T extends {length: infer L} ? L : never;

/**
 * Gets the first element of T
 */
export type GetFirst<T extends unknown[]> = T[0];

/**
 * Gets the last element of T
 */
export type GetLast<T extends unknown[]> = T[Prev<GetLength<T>>];

/**
 * Gets the Nth parameter of the given function
 */
export type NthParameter<T extends ArbitraryFunction, Parameter extends number> = Parameters<T>[Parameter];

/**
 * Gets the first parameter of the given function
 */
export type FirstParameter<T extends ArbitraryFunction> = GetFirst<Parameters<T>>;

/**
 * Gets the last parameter of the given function
 */
export type LastParameter<T extends ArbitraryFunction> = GetLast<Parameters<T>>;

export type UncapitalizeKeys<T> = {[Key in keyof T as Uncapitalize<string & Key>]: T[Key]};
export type CapitalizeKeys<T> = {[Key in keyof T as Capitalize<string & Key>]: T[Key]};
export type LowercaseKeys<T> = {[Key in keyof T as Lowercase<string & Key>]: T[Key]};
export type UppercaseKeys<T> = {[Key in keyof T as Uppercase<string & Key>]: T[Key]};

export type PrefixObjectKeys<T, Prefix extends string, EnsureCamelCase = false> = {[Key in keyof T as SuffixKey<Key & string, Prefix, EnsureCamelCase>]: T[Key]};
export type SuffixObjectKeys<T, Suffix extends string, EnsureCamelCase = false> = {[Key in keyof T as PrefixKey<Key & string, Suffix, EnsureCamelCase>]: T[Key]};
export type PrefixKey<T extends string, Prefix extends string, EnsureCamelCase = false> = `${Prefix}${EnsureCamelCase extends true ? Capitalize<T> : T}`;
export type SuffixKey<T extends string, Suffix extends string, EnsureCamelCase = false> = `${T}${EnsureCamelCase extends true ? Capitalize<Suffix> : Suffix}`;

// Internal helpers

// Internal helpers
export type Prev<T extends number> = [
	-1,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25,
	26,
	27,
	28,
	29,
	30,
	31,
	32,
	33,
	34,
	35,
	36,
	37,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	46,
	47,
	48,
	49,
	50,
	51,
	52,
	53,
	54,
	55,
	56,
	57,
	58,
	59,
	60,
	61,
	62,
	63,
	64,
	65,
	66,
	67,
	68,
	69,
	70,
	71,
	72,
	73,
	74,
	75,
	76,
	77,
	78,
	79,
	80,
	81,
	82,
	83,
	84,
	85,
	86,
	87,
	88,
	89,
	90,
	91,
	92,
	93,
	94,
	95,
	96,
	97,
	98,
	99,
	100
][T];

export type Next<T extends number> = [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25,
	26,
	27,
	28,
	29,
	30,
	31,
	32,
	33,
	34,
	35,
	36,
	37,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	46,
	47,
	48,
	49,
	50,
	51,
	52,
	53,
	54,
	55,
	56,
	57,
	58,
	59,
	60,
	61,
	62,
	63,
	64,
	65,
	66,
	67,
	68,
	69,
	70,
	71,
	72,
	73,
	74,
	75,
	76,
	77,
	78,
	79,
	80,
	81,
	82,
	83,
	84,
	85,
	86,
	87,
	88,
	89,
	90,
	91,
	92,
	93,
	94,
	95,
	96,
	97,
	98,
	99,
	100,
	101
][T];

/**
 * A type indicating something that shouldn't be traversed into when mapping over objects, lists, or other similar data structures
 */
export type IgnoredLookupValue =
	| string
	| number
	| bigint
	| symbol
	| boolean
	| undefined
	| null
	| Date
	| RegExp
	| CallableFunction
	| Set<unknown>
	| WeakSet<never>
	| Map<unknown, unknown>
	| WeakMap<never, unknown>;
