import type { Add, Eq } from "ts-arithmetic"


// [ String ] //////////////////////////////////////////////////////////////////////////////////////////////////////////
// Returns true if string starts with a specific set of characters.
export type StringStartsWith<FullString extends string, Start extends string> = FullString extends `${Start}${infer _}` ? true : false;

// Returns true if string ends with a specific set of characters.
export type StringEndsWith<FullString extends string, End extends string> = FullString extends `${infer _}${End}` ? true : false;

export type StringRemoveFirstChar<S extends string> = S extends `${infer _}${infer Rest}` ? Rest : never;

export type StringRemoveLastChar<S extends string> = (
  S extends `${infer First}${infer Rest}`
  ? Rest extends "" 
    ? "" 
    : `${First}${StringRemoveLastChar<Rest>}`
  : never
);

export type StringRemoveAllWhitespaces<S extends string> = (
  S extends `${infer Before} ${infer After}`
  ? StringRemoveAllWhitespaces<`${Before}${After}`>
  : S
);

export type StringSplit<
  Str extends string,
  Sep extends string,
  MaxSplits extends number = -1,

  _Iter extends number = 1,
> = (
  Str extends `${infer First}${Sep}${infer Rest}` ?
    Eq<MaxSplits, _Iter> extends 1 ? [First, Rest] :
    [First, ...StringSplit<Rest, Sep, MaxSplits, Add<_Iter, 1>>]

  : [Str]
);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// [ UNION ] ///////////////////////////////////////////////////////////////////////////////////////////////////////////
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>
type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A]
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// [ ARRAY ] ///////////////////////////////////////////////////////////////////////////////////////////////////////////
export type ArrayToUnion<T extends any[]> = T[number]

// Returns true if all the booleans inside of the array equal true.
export type ArrayOnlyIncludesTruthyBooleans<T extends boolean[]> = T extends [true, ...infer Rest]
  ? Rest extends boolean[]
    ? ArrayOnlyIncludesTruthyBooleans<Rest>
    : false
  : T extends []
  ? true
  : false;

// Removes elements from a given array if their type is not an array.
export type ArrayRemoveNonArrayElems<T> = T extends (infer U)[]
? U extends any[] ? U : never
: never;

export type ArrayConcat<
  T extends string[], Delimiter extends string
> = (
  T extends []
  ? ''
  : T extends [infer F extends string | number | bigint | boolean | null | undefined, ...infer R extends string[]]
  ? `${F}${Eq<ArrayLength<T>, 1> extends 0 ? Delimiter : ""}${ArrayConcat<R, Delimiter>}`
  : never
);

export type ArrayRemoveEmptyStrings<T extends any[]> = T extends [infer Head, ...infer Tail]
  ? Head extends '' 
    ? ArrayRemoveEmptyStrings<Tail>
    : [Head, ...ArrayRemoveEmptyStrings<Tail>]
  : [];

export type ArrayLength<T extends any[]> = T extends { length: infer L } ? L : never;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// [ OBJECT ] //////////////////////////////////////////////////////////////////////////////////////////////////////////
export type ObjectPrettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type ObjectValues<Obj extends Object> = Obj[keyof Obj]
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////