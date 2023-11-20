import type { Add, Eq } from "ts-arithmetic"
import type { ArrayConcat, ArrayLength, ArrayOnlyIncludesTruthyBooleans, ArrayRemoveEmptyStrings, ArrayRemoveNonArrayElems, ObjectPrettify, ObjectValues, StringEndsWith, StringRemoveAllWhitespaces, StringRemoveFirstChar, StringRemoveLastChar, StringSplit, StringStartsWith, UnionToArray } from "../utils/utils.types"


export type SplitPathStr<PathStr extends string> = (
  StringSplit<ArrayConcat<StringSplit<StringRemoveAllWhitespaces<PathStr>, "?]">, "!]">, "?", 1>
)


type PathStringToArray_PrettifyParamArg<
  ParamArgKey extends string,

  _SplitParamArgKey extends string[] = StringSplit<ParamArgKey, "[", 1>
> = (
  ArrayOnlyIncludesTruthyBooleans<[ StringStartsWith<ParamArgKey, ":">, StringEndsWith<ParamArgKey, "]"> ]> extends true ?
    [
      StringRemoveFirstChar<_SplitParamArgKey[0]>,
      StringRemoveLastChar<_SplitParamArgKey[1]>
    ] & {}
  : _SplitParamArgKey[0]
)

export type PathStringToArray<
  PathStr extends string,
  Sep extends string,

  _SplitPathStr extends string[] = ArrayRemoveEmptyStrings<StringSplit<PathStr, Sep>>
> = UnionToArray<ObjectValues<{
  [ParamArgKey in _SplitPathStr[number]]: PathStringToArray_PrettifyParamArg<ParamArgKey>
}>>


type ParseParamsFromPathArray_StringToType<
  BaseTypeStr extends string,

  _TypeStr_RemovedAtStart extends string = (
    StringStartsWith<BaseTypeStr, "!"> extends true
    ? StringRemoveFirstChar<BaseTypeStr>
    : BaseTypeStr
  ),

  _TypeStr_RemovedAtStartAndEnd extends string = (
    StringEndsWith<_TypeStr_RemovedAtStart, "!"> extends true
    ? StringRemoveLastChar<_TypeStr_RemovedAtStart>
    : _TypeStr_RemovedAtStart
  ),

  _TypeStr extends string = _TypeStr_RemovedAtStartAndEnd,

  _IsArrayType = StringEndsWith<_TypeStr, "[]">,
  _BaseTypeFromArrayType = _IsArrayType extends true ? StringRemoveLastChar<StringRemoveLastChar<_TypeStr>> : false
> = (
  _IsArrayType extends false
    ? _TypeStr extends "string" ? string
    : _TypeStr extends "number" ? number
    : _TypeStr extends "boolean" ? boolean
    : "ERROR: invalid type"

  : 
    _BaseTypeFromArrayType extends "string" ? string[]
    : _BaseTypeFromArrayType extends "number" ? number[]
    : _BaseTypeFromArrayType extends "boolean" ? boolean[]
    : "ERROR: invalid type"

)

type ParseParamsFromPathArray_SeparateRequiredAndOptionalParams<
  Params extends any[],

  _CurrIter extends number = 0,
  _ParamsLength extends number = ArrayLength<Params>,
  _RequiredParams extends [string, string][] = [],
  _OptionalParams  extends [string, string][] = [],
> = (
  Eq<_CurrIter, _ParamsLength> extends 1 ? [ _RequiredParams, _OptionalParams ]
  : StringEndsWith<Params[_CurrIter][1], "!"> extends true
  ? ParseParamsFromPathArray_SeparateRequiredAndOptionalParams<Params, Add<_CurrIter, 1>, _ParamsLength, _RequiredParams, [..._OptionalParams, Params[_CurrIter]]>
  : ParseParamsFromPathArray_SeparateRequiredAndOptionalParams<Params, Add<_CurrIter, 1>, _ParamsLength, [..._RequiredParams, Params[_CurrIter]], _OptionalParams>
)

export type ParseParamsFromPathArray<
  PathArr,

  _PathArrWithRemovedNonArrays extends [[string, string], [string, string]] =
  // @ts-ignore
  ParseParamsFromPathArray_SeparateRequiredAndOptionalParams<UnionToArray<ArrayRemoveNonArrayElems<PathArr>>>,
> = ObjectPrettify<{
  [Key in _PathArrWithRemovedNonArrays[0][number] as Key[0]]: ParseParamsFromPathArray_StringToType<Key[1]>
} & {
  [Key in _PathArrWithRemovedNonArrays[1][number] as Key[0]]?: ParseParamsFromPathArray_StringToType<Key[1]>
}>






