/**
 * Makes T a union of T, null, and undefined
 */
export type Nullable<T> = T | null | undefined;

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
 * Picks from T the properties for which their type matches Type
 */
export type PickMembersOfType<T, Type> = Pick<
	T,
	{
		[Key in keyof T]: T[Key] extends Type ? Key : never;
	}[keyof T]
>;

/**
 * A variant of Partial that is deep.
 * This means that every value is a partial recursively
 * while still preserving primitive or built-in types as they are
 */
export type PartialDeep<T> = {
	[P in keyof T]?: T[P] extends (infer ArrayElement)[]
		? PartialDeep<ArrayElement>[]
		: T[P] extends readonly (infer ReadonlyArrayElement)[]
		? PartialDeep<ReadonlyArrayElement>[]
		: T[P] extends string | number | bigint | symbol | boolean | undefined | null | Date | Set<unknown> | WeakSet<never> | Map<unknown, unknown> | WeakMap<never, unknown>
		? T[P]
		: PartialDeep<T[P]>;
};

/**
 * A partial of T except for the keys given in K
 */
export type PartialExcept<T, K extends keyof T> = Omit<Partial<T>, K> & Pick<T, K>;

/**
 * A partial of T except for the keys given in K
 */
export type PartialDeepExcept<T, K extends keyof T> = Omit<PartialDeep<T>, K> & Pick<T, K>;

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

// Internal helpers
type Prev<T extends number> = [
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
	100
][T];