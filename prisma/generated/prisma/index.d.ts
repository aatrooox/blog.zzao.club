/**
 * Client
 */

import * as runtime from './runtime/library.js'
import $Types = runtime.Types // general types
import $Extensions = runtime.Types.Extensions
import $Public = runtime.Types.Public
import $Result = runtime.Types.Result
import $Utils = runtime.Types.Utils

export type PrismaPromise<T> = $Public.PrismaPromise<T>

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserConfig
 *
 */
export type UserConfig = $Result.DefaultSelection<Prisma.$UserConfigPayload>
/**
 * Model AccessToken
 *
 */
export type AccessToken = $Result.DefaultSelection<Prisma.$AccessTokenPayload>
/**
 * Model OAuth
 *
 */
export type OAuth = $Result.DefaultSelection<Prisma.$OAuthPayload>
/**
 * Model BlogComment
 *
 */
export type BlogComment = $Result.DefaultSelection<Prisma.$BlogCommentPayload>
/**
 * Model BlogExplain
 *
 */
export type BlogExplain = $Result.DefaultSelection<Prisma.$BlogExplainPayload>
/**
 * Model BlogSubComment
 *
 */
export type BlogSubComment = $Result.DefaultSelection<Prisma.$BlogSubCommentPayload>
/**
 * Model BlogLike
 *
 */
export type BlogLike = $Result.DefaultSelection<Prisma.$BlogLikePayload>
/**
 * Model BlogMemo
 *
 */
export type BlogMemo = $Result.DefaultSelection<Prisma.$BlogMemoPayload>
/**
 * Model MemoTag
 *
 */
export type MemoTag = $Result.DefaultSelection<Prisma.$MemoTagPayload>
/**
 * Model MemoTagRelations
 *
 */
export type MemoTagRelations = $Result.DefaultSelection<Prisma.$MemoTagRelationsPayload>
/**
 * Model GarminActivity
 *
 */
export type GarminActivity = $Result.DefaultSelection<Prisma.$GarminActivityPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>)
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.userConfig`: Exposes CRUD operations for the **UserConfig** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more UserConfigs
   * const userConfigs = await prisma.userConfig.findMany()
   * ```
   */
  get userConfig(): Prisma.UserConfigDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.accessToken`: Exposes CRUD operations for the **AccessToken** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AccessTokens
   * const accessTokens = await prisma.accessToken.findMany()
   * ```
   */
  get accessToken(): Prisma.AccessTokenDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.oAuth`: Exposes CRUD operations for the **OAuth** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more OAuths
   * const oAuths = await prisma.oAuth.findMany()
   * ```
   */
  get oAuth(): Prisma.OAuthDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.blogComment`: Exposes CRUD operations for the **BlogComment** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more BlogComments
   * const blogComments = await prisma.blogComment.findMany()
   * ```
   */
  get blogComment(): Prisma.BlogCommentDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.blogExplain`: Exposes CRUD operations for the **BlogExplain** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more BlogExplains
   * const blogExplains = await prisma.blogExplain.findMany()
   * ```
   */
  get blogExplain(): Prisma.BlogExplainDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.blogSubComment`: Exposes CRUD operations for the **BlogSubComment** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more BlogSubComments
   * const blogSubComments = await prisma.blogSubComment.findMany()
   * ```
   */
  get blogSubComment(): Prisma.BlogSubCommentDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.blogLike`: Exposes CRUD operations for the **BlogLike** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more BlogLikes
   * const blogLikes = await prisma.blogLike.findMany()
   * ```
   */
  get blogLike(): Prisma.BlogLikeDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.blogMemo`: Exposes CRUD operations for the **BlogMemo** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more BlogMemos
   * const blogMemos = await prisma.blogMemo.findMany()
   * ```
   */
  get blogMemo(): Prisma.BlogMemoDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.memoTag`: Exposes CRUD operations for the **MemoTag** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more MemoTags
   * const memoTags = await prisma.memoTag.findMany()
   * ```
   */
  get memoTag(): Prisma.MemoTagDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.memoTagRelations`: Exposes CRUD operations for the **MemoTagRelations** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more MemoTagRelations
   * const memoTagRelations = await prisma.memoTagRelations.findMany()
   * ```
   */
  get memoTagRelations(): Prisma.MemoTagRelationsDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.garminActivity`: Exposes CRUD operations for the **GarminActivity** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more GarminActivities
   * const garminActivities = await prisma.garminActivity.findMany()
   * ```
   */
  get garminActivity(): Prisma.GarminActivityDelegate<ExtArgs, ClientOptions>
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export interface PrismaVersion {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  interface SelectAndInclude {
    select: any
    include: any
  }

  interface SelectAndOmit {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  }

  export type Enumerable<T> = T | Array<T>

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  }

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  }
  & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  }
  & K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U>
    = T extends object
      ? U extends object
        ? (Without<T, U> & U) | (Without<U, T> & T)
        : U : T

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
    ? False
    : T extends Date
      ? False
      : T extends Uint8Array
        ? False
        : T extends bigint
          ? False
          : T extends object
            ? True
            : False

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K>
    & {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean,
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" */
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {}

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
  }>>

  type Key = string | number | symbol
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never
  type AtStrict<O extends object, K extends Key> = O[K & keyof O]
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>
    0: AtLoose<O, K>
  }[strict]

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {}

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {}

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  }

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | { [P in keyof O as P extends K ? P : never]-?: O[P] } & O
      : never
>

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>
  /** End Helper Types for "Merge" */

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>

  /**
  A [[Boolean]]
   */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
   */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B

  export const type: unique symbol

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>,
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
    // based on the brilliant idea of Pierre-Antoine Mills
    // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
      T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
          ? never
          : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  export const ModelName: {
    User: 'User'
    UserConfig: 'UserConfig'
    AccessToken: 'AccessToken'
    OAuth: 'OAuth'
    BlogComment: 'BlogComment'
    BlogExplain: 'BlogExplain'
    BlogSubComment: 'BlogSubComment'
    BlogLike: 'BlogLike'
    BlogMemo: 'BlogMemo'
    MemoTag: 'MemoTag'
    MemoTagRelations: 'MemoTagRelations'
    GarminActivity: 'GarminActivity'
  }

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]

  export interface Datasources {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{ extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: 'user' | 'userConfig' | 'accessToken' | 'oAuth' | 'blogComment' | 'blogExplain' | 'blogSubComment' | 'blogLike' | 'blogMemo' | 'memoTag' | 'memoTagRelations' | 'garminActivity'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserConfig: {
        payload: Prisma.$UserConfigPayload<ExtArgs>
        fields: Prisma.UserConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserConfigPayload>
          }
          findFirst: {
            args: Prisma.UserConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserConfigPayload>
          }
          findMany: {
            args: Prisma.UserConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserConfigPayload>[]
          }
          create: {
            args: Prisma.UserConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserConfigPayload>
          }
          createMany: {
            args: Prisma.UserConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserConfigPayload>
          }
          update: {
            args: Prisma.UserConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserConfigPayload>
          }
          deleteMany: {
            args: Prisma.UserConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserConfigPayload>
          }
          aggregate: {
            args: Prisma.UserConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserConfig>
          }
          groupBy: {
            args: Prisma.UserConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserConfigCountArgs<ExtArgs>
            result: $Utils.Optional<UserConfigCountAggregateOutputType> | number
          }
        }
      }
      AccessToken: {
        payload: Prisma.$AccessTokenPayload<ExtArgs>
        fields: Prisma.AccessTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccessTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccessTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          findFirst: {
            args: Prisma.AccessTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccessTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          findMany: {
            args: Prisma.AccessTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>[]
          }
          create: {
            args: Prisma.AccessTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          createMany: {
            args: Prisma.AccessTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AccessTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          update: {
            args: Prisma.AccessTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          deleteMany: {
            args: Prisma.AccessTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccessTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccessTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessTokenPayload>
          }
          aggregate: {
            args: Prisma.AccessTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccessToken>
          }
          groupBy: {
            args: Prisma.AccessTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccessTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccessTokenCountArgs<ExtArgs>
            result: $Utils.Optional<AccessTokenCountAggregateOutputType> | number
          }
        }
      }
      OAuth: {
        payload: Prisma.$OAuthPayload<ExtArgs>
        fields: Prisma.OAuthFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OAuthFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OAuthFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthPayload>
          }
          findFirst: {
            args: Prisma.OAuthFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OAuthFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthPayload>
          }
          findMany: {
            args: Prisma.OAuthFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthPayload>[]
          }
          create: {
            args: Prisma.OAuthCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthPayload>
          }
          createMany: {
            args: Prisma.OAuthCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.OAuthDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthPayload>
          }
          update: {
            args: Prisma.OAuthUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthPayload>
          }
          deleteMany: {
            args: Prisma.OAuthDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OAuthUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OAuthUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthPayload>
          }
          aggregate: {
            args: Prisma.OAuthAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOAuth>
          }
          groupBy: {
            args: Prisma.OAuthGroupByArgs<ExtArgs>
            result: $Utils.Optional<OAuthGroupByOutputType>[]
          }
          count: {
            args: Prisma.OAuthCountArgs<ExtArgs>
            result: $Utils.Optional<OAuthCountAggregateOutputType> | number
          }
        }
      }
      BlogComment: {
        payload: Prisma.$BlogCommentPayload<ExtArgs>
        fields: Prisma.BlogCommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BlogCommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BlogCommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCommentPayload>
          }
          findFirst: {
            args: Prisma.BlogCommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BlogCommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCommentPayload>
          }
          findMany: {
            args: Prisma.BlogCommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCommentPayload>[]
          }
          create: {
            args: Prisma.BlogCommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCommentPayload>
          }
          createMany: {
            args: Prisma.BlogCommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BlogCommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCommentPayload>
          }
          update: {
            args: Prisma.BlogCommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCommentPayload>
          }
          deleteMany: {
            args: Prisma.BlogCommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BlogCommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BlogCommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogCommentPayload>
          }
          aggregate: {
            args: Prisma.BlogCommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlogComment>
          }
          groupBy: {
            args: Prisma.BlogCommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlogCommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.BlogCommentCountArgs<ExtArgs>
            result: $Utils.Optional<BlogCommentCountAggregateOutputType> | number
          }
        }
      }
      BlogExplain: {
        payload: Prisma.$BlogExplainPayload<ExtArgs>
        fields: Prisma.BlogExplainFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BlogExplainFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogExplainPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BlogExplainFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogExplainPayload>
          }
          findFirst: {
            args: Prisma.BlogExplainFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogExplainPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BlogExplainFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogExplainPayload>
          }
          findMany: {
            args: Prisma.BlogExplainFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogExplainPayload>[]
          }
          create: {
            args: Prisma.BlogExplainCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogExplainPayload>
          }
          createMany: {
            args: Prisma.BlogExplainCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BlogExplainDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogExplainPayload>
          }
          update: {
            args: Prisma.BlogExplainUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogExplainPayload>
          }
          deleteMany: {
            args: Prisma.BlogExplainDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BlogExplainUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BlogExplainUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogExplainPayload>
          }
          aggregate: {
            args: Prisma.BlogExplainAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlogExplain>
          }
          groupBy: {
            args: Prisma.BlogExplainGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlogExplainGroupByOutputType>[]
          }
          count: {
            args: Prisma.BlogExplainCountArgs<ExtArgs>
            result: $Utils.Optional<BlogExplainCountAggregateOutputType> | number
          }
        }
      }
      BlogSubComment: {
        payload: Prisma.$BlogSubCommentPayload<ExtArgs>
        fields: Prisma.BlogSubCommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BlogSubCommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogSubCommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BlogSubCommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogSubCommentPayload>
          }
          findFirst: {
            args: Prisma.BlogSubCommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogSubCommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BlogSubCommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogSubCommentPayload>
          }
          findMany: {
            args: Prisma.BlogSubCommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogSubCommentPayload>[]
          }
          create: {
            args: Prisma.BlogSubCommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogSubCommentPayload>
          }
          createMany: {
            args: Prisma.BlogSubCommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BlogSubCommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogSubCommentPayload>
          }
          update: {
            args: Prisma.BlogSubCommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogSubCommentPayload>
          }
          deleteMany: {
            args: Prisma.BlogSubCommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BlogSubCommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BlogSubCommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogSubCommentPayload>
          }
          aggregate: {
            args: Prisma.BlogSubCommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlogSubComment>
          }
          groupBy: {
            args: Prisma.BlogSubCommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlogSubCommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.BlogSubCommentCountArgs<ExtArgs>
            result: $Utils.Optional<BlogSubCommentCountAggregateOutputType> | number
          }
        }
      }
      BlogLike: {
        payload: Prisma.$BlogLikePayload<ExtArgs>
        fields: Prisma.BlogLikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BlogLikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogLikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BlogLikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogLikePayload>
          }
          findFirst: {
            args: Prisma.BlogLikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogLikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BlogLikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogLikePayload>
          }
          findMany: {
            args: Prisma.BlogLikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogLikePayload>[]
          }
          create: {
            args: Prisma.BlogLikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogLikePayload>
          }
          createMany: {
            args: Prisma.BlogLikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BlogLikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogLikePayload>
          }
          update: {
            args: Prisma.BlogLikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogLikePayload>
          }
          deleteMany: {
            args: Prisma.BlogLikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BlogLikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BlogLikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogLikePayload>
          }
          aggregate: {
            args: Prisma.BlogLikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlogLike>
          }
          groupBy: {
            args: Prisma.BlogLikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlogLikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.BlogLikeCountArgs<ExtArgs>
            result: $Utils.Optional<BlogLikeCountAggregateOutputType> | number
          }
        }
      }
      BlogMemo: {
        payload: Prisma.$BlogMemoPayload<ExtArgs>
        fields: Prisma.BlogMemoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BlogMemoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogMemoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BlogMemoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogMemoPayload>
          }
          findFirst: {
            args: Prisma.BlogMemoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogMemoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BlogMemoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogMemoPayload>
          }
          findMany: {
            args: Prisma.BlogMemoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogMemoPayload>[]
          }
          create: {
            args: Prisma.BlogMemoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogMemoPayload>
          }
          createMany: {
            args: Prisma.BlogMemoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BlogMemoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogMemoPayload>
          }
          update: {
            args: Prisma.BlogMemoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogMemoPayload>
          }
          deleteMany: {
            args: Prisma.BlogMemoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BlogMemoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BlogMemoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogMemoPayload>
          }
          aggregate: {
            args: Prisma.BlogMemoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlogMemo>
          }
          groupBy: {
            args: Prisma.BlogMemoGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlogMemoGroupByOutputType>[]
          }
          count: {
            args: Prisma.BlogMemoCountArgs<ExtArgs>
            result: $Utils.Optional<BlogMemoCountAggregateOutputType> | number
          }
        }
      }
      MemoTag: {
        payload: Prisma.$MemoTagPayload<ExtArgs>
        fields: Prisma.MemoTagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MemoTagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MemoTagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagPayload>
          }
          findFirst: {
            args: Prisma.MemoTagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MemoTagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagPayload>
          }
          findMany: {
            args: Prisma.MemoTagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagPayload>[]
          }
          create: {
            args: Prisma.MemoTagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagPayload>
          }
          createMany: {
            args: Prisma.MemoTagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MemoTagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagPayload>
          }
          update: {
            args: Prisma.MemoTagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagPayload>
          }
          deleteMany: {
            args: Prisma.MemoTagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MemoTagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MemoTagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagPayload>
          }
          aggregate: {
            args: Prisma.MemoTagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMemoTag>
          }
          groupBy: {
            args: Prisma.MemoTagGroupByArgs<ExtArgs>
            result: $Utils.Optional<MemoTagGroupByOutputType>[]
          }
          count: {
            args: Prisma.MemoTagCountArgs<ExtArgs>
            result: $Utils.Optional<MemoTagCountAggregateOutputType> | number
          }
        }
      }
      MemoTagRelations: {
        payload: Prisma.$MemoTagRelationsPayload<ExtArgs>
        fields: Prisma.MemoTagRelationsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MemoTagRelationsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagRelationsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MemoTagRelationsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagRelationsPayload>
          }
          findFirst: {
            args: Prisma.MemoTagRelationsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagRelationsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MemoTagRelationsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagRelationsPayload>
          }
          findMany: {
            args: Prisma.MemoTagRelationsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagRelationsPayload>[]
          }
          create: {
            args: Prisma.MemoTagRelationsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagRelationsPayload>
          }
          createMany: {
            args: Prisma.MemoTagRelationsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MemoTagRelationsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagRelationsPayload>
          }
          update: {
            args: Prisma.MemoTagRelationsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagRelationsPayload>
          }
          deleteMany: {
            args: Prisma.MemoTagRelationsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MemoTagRelationsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MemoTagRelationsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemoTagRelationsPayload>
          }
          aggregate: {
            args: Prisma.MemoTagRelationsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMemoTagRelations>
          }
          groupBy: {
            args: Prisma.MemoTagRelationsGroupByArgs<ExtArgs>
            result: $Utils.Optional<MemoTagRelationsGroupByOutputType>[]
          }
          count: {
            args: Prisma.MemoTagRelationsCountArgs<ExtArgs>
            result: $Utils.Optional<MemoTagRelationsCountAggregateOutputType> | number
          }
        }
      }
      GarminActivity: {
        payload: Prisma.$GarminActivityPayload<ExtArgs>
        fields: Prisma.GarminActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GarminActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GarminActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GarminActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GarminActivityPayload>
          }
          findFirst: {
            args: Prisma.GarminActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GarminActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GarminActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GarminActivityPayload>
          }
          findMany: {
            args: Prisma.GarminActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GarminActivityPayload>[]
          }
          create: {
            args: Prisma.GarminActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GarminActivityPayload>
          }
          createMany: {
            args: Prisma.GarminActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GarminActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GarminActivityPayload>
          }
          update: {
            args: Prisma.GarminActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GarminActivityPayload>
          }
          deleteMany: {
            args: Prisma.GarminActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GarminActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GarminActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GarminActivityPayload>
          }
          aggregate: {
            args: Prisma.GarminActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGarminActivity>
          }
          groupBy: {
            args: Prisma.GarminActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<GarminActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.GarminActivityCountArgs<ExtArgs>
            result: $Utils.Optional<GarminActivityCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]]
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]]
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]]
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]]
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export interface GlobalOmitConfig {
    user?: UserOmit
    userConfig?: UserConfigOmit
    accessToken?: AccessTokenOmit
    oAuth?: OAuthOmit
    blogComment?: BlogCommentOmit
    blogExplain?: BlogExplainOmit
    blogSubComment?: BlogSubCommentOmit
    blogLike?: BlogLikeOmit
    blogMemo?: BlogMemoOmit
    memoTag?: MemoTagOmit
    memoTagRelations?: MemoTagRelationsOmit
    garminActivity?: GarminActivityOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export interface LogDefinition {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never

  export interface QueryEvent {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export interface LogEvent {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */

  export type PrismaAction
    = | 'findUnique'
      | 'findUniqueOrThrow'
      | 'findMany'
      | 'findFirst'
      | 'findFirstOrThrow'
      | 'create'
      | 'createMany'
      | 'createManyAndReturn'
      | 'update'
      | 'updateMany'
      | 'updateManyAndReturn'
      | 'upsert'
      | 'delete'
      | 'deleteMany'
      | 'executeRaw'
      | 'queryRaw'
      | 'aggregate'
      | 'count'
      | 'runCommandRaw'
      | 'findRaw'
      | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export interface MiddlewareParams {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export interface Datasource {
    url?: string
  }

  /**
   * Count Types
   */

  /**
   * Count Type UserCountOutputType
   */

  export interface UserCountOutputType {
    comments: number
    sub_comments: number
    likes: number
    oauth: number
    tokens: number
    memos: number
    tags: number
  }

  export interface UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    comments?: boolean | UserCountOutputTypeCountCommentsArgs
    sub_comments?: boolean | UserCountOutputTypeCountSub_commentsArgs
    likes?: boolean | UserCountOutputTypeCountLikesArgs
    oauth?: boolean | UserCountOutputTypeCountOauthArgs
    tokens?: boolean | UserCountOutputTypeCountTokensArgs
    memos?: boolean | UserCountOutputTypeCountMemosArgs
    tags?: boolean | UserCountOutputTypeCountTagsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export interface UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export interface UserCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogCommentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export interface UserCountOutputTypeCountSub_commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogSubCommentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export interface UserCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogLikeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export interface UserCountOutputTypeCountOauthArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: OAuthWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export interface UserCountOutputTypeCountTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: AccessTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export interface UserCountOutputTypeCountMemosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogMemoWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export interface UserCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: MemoTagWhereInput
  }

  /**
   * Count Type BlogCommentCountOutputType
   */

  export interface BlogCommentCountOutputType {
    sub_comments: number
    likes: number
  }

  export interface BlogCommentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    sub_comments?: boolean | BlogCommentCountOutputTypeCountSub_commentsArgs
    likes?: boolean | BlogCommentCountOutputTypeCountLikesArgs
  }

  // Custom InputTypes
  /**
   * BlogCommentCountOutputType without action
   */
  export interface BlogCommentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogCommentCountOutputType
     */
    select?: BlogCommentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BlogCommentCountOutputType without action
   */
  export interface BlogCommentCountOutputTypeCountSub_commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogSubCommentWhereInput
  }

  /**
   * BlogCommentCountOutputType without action
   */
  export interface BlogCommentCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogLikeWhereInput
  }

  /**
   * Count Type BlogSubCommentCountOutputType
   */

  export interface BlogSubCommentCountOutputType {
    likes: number
  }

  export interface BlogSubCommentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    likes?: boolean | BlogSubCommentCountOutputTypeCountLikesArgs
  }

  // Custom InputTypes
  /**
   * BlogSubCommentCountOutputType without action
   */
  export interface BlogSubCommentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubCommentCountOutputType
     */
    select?: BlogSubCommentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BlogSubCommentCountOutputType without action
   */
  export interface BlogSubCommentCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogLikeWhereInput
  }

  /**
   * Count Type BlogMemoCountOutputType
   */

  export interface BlogMemoCountOutputType {
    tags: number
    comments: number
    likes: number
  }

  export interface BlogMemoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    tags?: boolean | BlogMemoCountOutputTypeCountTagsArgs
    comments?: boolean | BlogMemoCountOutputTypeCountCommentsArgs
    likes?: boolean | BlogMemoCountOutputTypeCountLikesArgs
  }

  // Custom InputTypes
  /**
   * BlogMemoCountOutputType without action
   */
  export interface BlogMemoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemoCountOutputType
     */
    select?: BlogMemoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BlogMemoCountOutputType without action
   */
  export interface BlogMemoCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: MemoTagRelationsWhereInput
  }

  /**
   * BlogMemoCountOutputType without action
   */
  export interface BlogMemoCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogCommentWhereInput
  }

  /**
   * BlogMemoCountOutputType without action
   */
  export interface BlogMemoCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogLikeWhereInput
  }

  /**
   * Count Type MemoTagCountOutputType
   */

  export interface MemoTagCountOutputType {
    memos: number
  }

  export interface MemoTagCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    memos?: boolean | MemoTagCountOutputTypeCountMemosArgs
  }

  // Custom InputTypes
  /**
   * MemoTagCountOutputType without action
   */
  export interface MemoTagCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagCountOutputType
     */
    select?: MemoTagCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MemoTagCountOutputType without action
   */
  export interface MemoTagCountOutputTypeCountMemosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: MemoTagRelationsWhereInput
  }

  /**
   * Models
   */

  /**
   * Model User
   */

  export interface AggregateUser {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export interface UserAvgAggregateOutputType {
    status: number | null
  }

  export interface UserSumAggregateOutputType {
    status: number | null
  }

  export interface UserMinAggregateOutputType {
    id: string | null
    email: string | null
    phone: string | null
    username: string | null
    nickname: string | null
    password: string | null
    avatar_url: string | null
    website: string | null
    role: string | null
    status: number | null
  }

  export interface UserMaxAggregateOutputType {
    id: string | null
    email: string | null
    phone: string | null
    username: string | null
    nickname: string | null
    password: string | null
    avatar_url: string | null
    website: string | null
    role: string | null
    status: number | null
  }

  export interface UserCountAggregateOutputType {
    id: number
    email: number
    phone: number
    username: number
    nickname: number
    password: number
    avatar_url: number
    website: number
    role: number
    status: number
    _all: number
  }

  export interface UserAvgAggregateInputType {
    status?: true
  }

  export interface UserSumAggregateInputType {
    status?: true
  }

  export interface UserMinAggregateInputType {
    id?: true
    email?: true
    phone?: true
    username?: true
    nickname?: true
    password?: true
    avatar_url?: true
    website?: true
    role?: true
    status?: true
  }

  export interface UserMaxAggregateInputType {
    id?: true
    email?: true
    phone?: true
    username?: true
    nickname?: true
    password?: true
    avatar_url?: true
    website?: true
    role?: true
    status?: true
  }

  export interface UserCountAggregateInputType {
    id?: true
    email?: true
    phone?: true
    username?: true
    nickname?: true
    password?: true
    avatar_url?: true
    website?: true
    role?: true
    status?: true
    _all?: true
  }

  export interface UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     */
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     */
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     */
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }

  export interface UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export interface UserGroupByOutputType {
    id: string
    email: string | null
    phone: string | null
    username: string
    nickname: string | null
    password: string
    avatar_url: string | null
    website: string | null
    role: string
    status: number
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>
      }
      >
    >

  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    username?: boolean
    nickname?: boolean
    password?: boolean
    avatar_url?: boolean
    website?: boolean
    role?: boolean
    status?: boolean
    comments?: boolean | User$commentsArgs<ExtArgs>
    sub_comments?: boolean | User$sub_commentsArgs<ExtArgs>
    likes?: boolean | User$likesArgs<ExtArgs>
    oauth?: boolean | User$oauthArgs<ExtArgs>
    tokens?: boolean | User$tokensArgs<ExtArgs>
    user_config?: boolean | User$user_configArgs<ExtArgs>
    memos?: boolean | User$memosArgs<ExtArgs>
    tags?: boolean | User$tagsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs['result']['user']>

  export interface UserSelectScalar {
    id?: boolean
    email?: boolean
    phone?: boolean
    username?: boolean
    nickname?: boolean
    password?: boolean
    avatar_url?: boolean
    website?: boolean
    role?: boolean
    status?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'email' | 'phone' | 'username' | 'nickname' | 'password' | 'avatar_url' | 'website' | 'role' | 'status', ExtArgs['result']['user']>
  export interface UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    comments?: boolean | User$commentsArgs<ExtArgs>
    sub_comments?: boolean | User$sub_commentsArgs<ExtArgs>
    likes?: boolean | User$likesArgs<ExtArgs>
    oauth?: boolean | User$oauthArgs<ExtArgs>
    tokens?: boolean | User$tokensArgs<ExtArgs>
    user_config?: boolean | User$user_configArgs<ExtArgs>
    memos?: boolean | User$memosArgs<ExtArgs>
    tags?: boolean | User$tagsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export interface $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'User'
    objects: {
      comments: Prisma.$BlogCommentPayload<ExtArgs>[]
      sub_comments: Prisma.$BlogSubCommentPayload<ExtArgs>[]
      likes: Prisma.$BlogLikePayload<ExtArgs>[]
      oauth: Prisma.$OAuthPayload<ExtArgs>[]
      tokens: Prisma.$AccessTokenPayload<ExtArgs>[]
      user_config: Prisma.$UserConfigPayload<ExtArgs> | null
      memos: Prisma.$BlogMemoPayload<ExtArgs>[]
      tags: Prisma.$MemoTagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string | null
      phone: string | null
      username: string
      nickname: string | null
      password: string
      avatar_url: string | null
      website: string | null
      role: string
      status: number
    }, ExtArgs['result']['user']>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     */
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    comments<T extends User$commentsArgs<ExtArgs> = {}>(args?: Subset<T, User$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    sub_comments<T extends User$sub_commentsArgs<ExtArgs> = {}>(args?: Subset<T, User$sub_commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    likes<T extends User$likesArgs<ExtArgs> = {}>(args?: Subset<T, User$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    oauth<T extends User$oauthArgs<ExtArgs> = {}>(args?: Subset<T, User$oauthArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    tokens<T extends User$tokensArgs<ExtArgs> = {}>(args?: Subset<T, User$tokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    user_config<T extends User$user_configArgs<ExtArgs> = {}>(args?: Subset<T, User$user_configArgs<ExtArgs>>): Prisma__UserConfigClient<$Result.GetResult<Prisma.$UserConfigPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    memos<T extends User$memosArgs<ExtArgs> = {}>(args?: Subset<T, User$memosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    tags<T extends User$tagsArgs<ExtArgs> = {}>(args?: Subset<T, User$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<'User', 'String'>
    readonly email: FieldRef<'User', 'String'>
    readonly phone: FieldRef<'User', 'String'>
    readonly username: FieldRef<'User', 'String'>
    readonly nickname: FieldRef<'User', 'String'>
    readonly password: FieldRef<'User', 'String'>
    readonly avatar_url: FieldRef<'User', 'String'>
    readonly website: FieldRef<'User', 'String'>
    readonly role: FieldRef<'User', 'String'>
    readonly status: FieldRef<'User', 'Int'>
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export interface UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export interface UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export interface UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export interface UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export interface UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export interface UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export interface UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export interface UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export interface UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export interface UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export interface UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export interface UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.comments
   */
  export interface User$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    where?: BlogCommentWhereInput
    orderBy?: BlogCommentOrderByWithRelationInput | BlogCommentOrderByWithRelationInput[]
    cursor?: BlogCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogCommentScalarFieldEnum | BlogCommentScalarFieldEnum[]
  }

  /**
   * User.sub_comments
   */
  export interface User$sub_commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    where?: BlogSubCommentWhereInput
    orderBy?: BlogSubCommentOrderByWithRelationInput | BlogSubCommentOrderByWithRelationInput[]
    cursor?: BlogSubCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogSubCommentScalarFieldEnum | BlogSubCommentScalarFieldEnum[]
  }

  /**
   * User.likes
   */
  export interface User$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    where?: BlogLikeWhereInput
    orderBy?: BlogLikeOrderByWithRelationInput | BlogLikeOrderByWithRelationInput[]
    cursor?: BlogLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogLikeScalarFieldEnum | BlogLikeScalarFieldEnum[]
  }

  /**
   * User.oauth
   */
  export interface User$oauthArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
    where?: OAuthWhereInput
    orderBy?: OAuthOrderByWithRelationInput | OAuthOrderByWithRelationInput[]
    cursor?: OAuthWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OAuthScalarFieldEnum | OAuthScalarFieldEnum[]
  }

  /**
   * User.tokens
   */
  export interface User$tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    where?: AccessTokenWhereInput
    orderBy?: AccessTokenOrderByWithRelationInput | AccessTokenOrderByWithRelationInput[]
    cursor?: AccessTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccessTokenScalarFieldEnum | AccessTokenScalarFieldEnum[]
  }

  /**
   * User.user_config
   */
  export interface User$user_configArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
    where?: UserConfigWhereInput
  }

  /**
   * User.memos
   */
  export interface User$memosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    where?: BlogMemoWhereInput
    orderBy?: BlogMemoOrderByWithRelationInput | BlogMemoOrderByWithRelationInput[]
    cursor?: BlogMemoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogMemoScalarFieldEnum | BlogMemoScalarFieldEnum[]
  }

  /**
   * User.tags
   */
  export interface User$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
    where?: MemoTagWhereInput
    orderBy?: MemoTagOrderByWithRelationInput | MemoTagOrderByWithRelationInput[]
    cursor?: MemoTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemoTagScalarFieldEnum | MemoTagScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export interface UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }

  /**
   * Model UserConfig
   */

  export interface AggregateUserConfig {
    _count: UserConfigCountAggregateOutputType | null
    _avg: UserConfigAvgAggregateOutputType | null
    _sum: UserConfigSumAggregateOutputType | null
    _min: UserConfigMinAggregateOutputType | null
    _max: UserConfigMaxAggregateOutputType | null
  }

  export interface UserConfigAvgAggregateOutputType {
    allowEmailNotify: number | null
  }

  export interface UserConfigSumAggregateOutputType {
    allowEmailNotify: number | null
  }

  export interface UserConfigMinAggregateOutputType {
    id: string | null
    userId: string | null
    allowEmailNotify: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export interface UserConfigMaxAggregateOutputType {
    id: string | null
    userId: string | null
    allowEmailNotify: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export interface UserConfigCountAggregateOutputType {
    id: number
    userId: number
    allowEmailNotify: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export interface UserConfigAvgAggregateInputType {
    allowEmailNotify?: true
  }

  export interface UserConfigSumAggregateInputType {
    allowEmailNotify?: true
  }

  export interface UserConfigMinAggregateInputType {
    id?: true
    userId?: true
    allowEmailNotify?: true
    createdAt?: true
    updatedAt?: true
  }

  export interface UserConfigMaxAggregateInputType {
    id?: true
    userId?: true
    allowEmailNotify?: true
    createdAt?: true
    updatedAt?: true
  }

  export interface UserConfigCountAggregateInputType {
    id?: true
    userId?: true
    allowEmailNotify?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export interface UserConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which UserConfig to aggregate.
     */
    where?: UserConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserConfigs to fetch.
     */
    orderBy?: UserConfigOrderByWithRelationInput | UserConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UserConfigs
     */
    _count?: true | UserConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     */
    _avg?: UserConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     */
    _sum?: UserConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: UserConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: UserConfigMaxAggregateInputType
  }

  export type GetUserConfigAggregateType<T extends UserConfigAggregateArgs> = {
    [P in keyof T & keyof AggregateUserConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserConfig[P]>
      : GetScalarType<T[P], AggregateUserConfig[P]>
  }

  export interface UserConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: UserConfigWhereInput
    orderBy?: UserConfigOrderByWithAggregationInput | UserConfigOrderByWithAggregationInput[]
    by: UserConfigScalarFieldEnum[] | UserConfigScalarFieldEnum
    having?: UserConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserConfigCountAggregateInputType | true
    _avg?: UserConfigAvgAggregateInputType
    _sum?: UserConfigSumAggregateInputType
    _min?: UserConfigMinAggregateInputType
    _max?: UserConfigMaxAggregateInputType
  }

  export interface UserConfigGroupByOutputType {
    id: string
    userId: string
    allowEmailNotify: number | null
    createdAt: Date
    updatedAt: Date
    _count: UserConfigCountAggregateOutputType | null
    _avg: UserConfigAvgAggregateOutputType | null
    _sum: UserConfigSumAggregateOutputType | null
    _min: UserConfigMinAggregateOutputType | null
    _max: UserConfigMaxAggregateOutputType | null
  }

  type GetUserConfigGroupByPayload<T extends UserConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserConfigGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof UserConfigGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserConfigGroupByOutputType[P]>
          : GetScalarType<T[P], UserConfigGroupByOutputType[P]>
      }
      >
    >

  export type UserConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    allowEmailNotify?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userInfo?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs['result']['userConfig']>

  export interface UserConfigSelectScalar {
    id?: boolean
    userId?: boolean
    allowEmailNotify?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'userId' | 'allowEmailNotify' | 'createdAt' | 'updatedAt', ExtArgs['result']['userConfig']>
  export interface UserConfigInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    userInfo?: boolean | UserDefaultArgs<ExtArgs>
  }

  export interface $UserConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'UserConfig'
    objects: {
      userInfo: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      allowEmailNotify: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs['result']['userConfig']>
    composites: {}
  }

  type UserConfigGetPayload<S extends boolean | null | undefined | UserConfigDefaultArgs> = $Result.GetResult<Prisma.$UserConfigPayload, S>

  type UserConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<UserConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserConfigCountAggregateInputType | true
    }

  export interface UserConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserConfig'], meta: { name: 'UserConfig' } }
    /**
     * Find zero or one UserConfig that matches the filter.
     * @param {UserConfigFindUniqueArgs} args - Arguments to find a UserConfig
     * @example
     * // Get one UserConfig
     * const userConfig = await prisma.userConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserConfigFindUniqueArgs>(args: SelectSubset<T, UserConfigFindUniqueArgs<ExtArgs>>): Prisma__UserConfigClient<$Result.GetResult<Prisma.$UserConfigPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserConfigFindUniqueOrThrowArgs} args - Arguments to find a UserConfig
     * @example
     * // Get one UserConfig
     * const userConfig = await prisma.userConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, UserConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserConfigClient<$Result.GetResult<Prisma.$UserConfigPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserConfigFindFirstArgs} args - Arguments to find a UserConfig
     * @example
     * // Get one UserConfig
     * const userConfig = await prisma.userConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserConfigFindFirstArgs>(args?: SelectSubset<T, UserConfigFindFirstArgs<ExtArgs>>): Prisma__UserConfigClient<$Result.GetResult<Prisma.$UserConfigPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserConfigFindFirstOrThrowArgs} args - Arguments to find a UserConfig
     * @example
     * // Get one UserConfig
     * const userConfig = await prisma.userConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, UserConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserConfigClient<$Result.GetResult<Prisma.$UserConfigPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserConfigs
     * const userConfigs = await prisma.userConfig.findMany()
     *
     * // Get first 10 UserConfigs
     * const userConfigs = await prisma.userConfig.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userConfigWithIdOnly = await prisma.userConfig.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserConfigFindManyArgs>(args?: SelectSubset<T, UserConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserConfigPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a UserConfig.
     * @param {UserConfigCreateArgs} args - Arguments to create a UserConfig.
     * @example
     * // Create one UserConfig
     * const UserConfig = await prisma.userConfig.create({
     *   data: {
     *     // ... data to create a UserConfig
     *   }
     * })
     *
     */
    create<T extends UserConfigCreateArgs>(args: SelectSubset<T, UserConfigCreateArgs<ExtArgs>>): Prisma__UserConfigClient<$Result.GetResult<Prisma.$UserConfigPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserConfigs.
     * @param {UserConfigCreateManyArgs} args - Arguments to create many UserConfigs.
     * @example
     * // Create many UserConfigs
     * const userConfig = await prisma.userConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserConfigCreateManyArgs>(args?: SelectSubset<T, UserConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserConfig.
     * @param {UserConfigDeleteArgs} args - Arguments to delete one UserConfig.
     * @example
     * // Delete one UserConfig
     * const UserConfig = await prisma.userConfig.delete({
     *   where: {
     *     // ... filter to delete one UserConfig
     *   }
     * })
     *
     */
    delete<T extends UserConfigDeleteArgs>(args: SelectSubset<T, UserConfigDeleteArgs<ExtArgs>>): Prisma__UserConfigClient<$Result.GetResult<Prisma.$UserConfigPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserConfig.
     * @param {UserConfigUpdateArgs} args - Arguments to update one UserConfig.
     * @example
     * // Update one UserConfig
     * const userConfig = await prisma.userConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserConfigUpdateArgs>(args: SelectSubset<T, UserConfigUpdateArgs<ExtArgs>>): Prisma__UserConfigClient<$Result.GetResult<Prisma.$UserConfigPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserConfigs.
     * @param {UserConfigDeleteManyArgs} args - Arguments to filter UserConfigs to delete.
     * @example
     * // Delete a few UserConfigs
     * const { count } = await prisma.userConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserConfigDeleteManyArgs>(args?: SelectSubset<T, UserConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserConfigs
     * const userConfig = await prisma.userConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserConfigUpdateManyArgs>(args: SelectSubset<T, UserConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserConfig.
     * @param {UserConfigUpsertArgs} args - Arguments to update or create a UserConfig.
     * @example
     * // Update or create a UserConfig
     * const userConfig = await prisma.userConfig.upsert({
     *   create: {
     *     // ... data to create a UserConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserConfig we want to update
     *   }
     * })
     */
    upsert<T extends UserConfigUpsertArgs>(args: SelectSubset<T, UserConfigUpsertArgs<ExtArgs>>): Prisma__UserConfigClient<$Result.GetResult<Prisma.$UserConfigPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of UserConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserConfigCountArgs} args - Arguments to filter UserConfigs to count.
     * @example
     * // Count the number of UserConfigs
     * const count = await prisma.userConfig.count({
     *   where: {
     *     // ... the filter for the UserConfigs we want to count
     *   }
     * })
     */
    count<T extends UserConfigCountArgs>(
      args?: Subset<T, UserConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends UserConfigAggregateArgs>(args: Subset<T, UserConfigAggregateArgs>): Prisma.PrismaPromise<GetUserConfigAggregateType<T>>

    /**
     * Group by UserConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends UserConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserConfigGroupByArgs['orderBy'] }
        : { orderBy?: UserConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, UserConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the UserConfig model
     */
    readonly fields: UserConfigFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    userInfo<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the UserConfig model
   */
  interface UserConfigFieldRefs {
    readonly id: FieldRef<'UserConfig', 'String'>
    readonly userId: FieldRef<'UserConfig', 'String'>
    readonly allowEmailNotify: FieldRef<'UserConfig', 'Int'>
    readonly createdAt: FieldRef<'UserConfig', 'DateTime'>
    readonly updatedAt: FieldRef<'UserConfig', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * UserConfig findUnique
   */
  export interface UserConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
    /**
     * Filter, which UserConfig to fetch.
     */
    where: UserConfigWhereUniqueInput
  }

  /**
   * UserConfig findUniqueOrThrow
   */
  export interface UserConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
    /**
     * Filter, which UserConfig to fetch.
     */
    where: UserConfigWhereUniqueInput
  }

  /**
   * UserConfig findFirst
   */
  export interface UserConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
    /**
     * Filter, which UserConfig to fetch.
     */
    where?: UserConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserConfigs to fetch.
     */
    orderBy?: UserConfigOrderByWithRelationInput | UserConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserConfigs.
     */
    cursor?: UserConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserConfigs.
     */
    distinct?: UserConfigScalarFieldEnum | UserConfigScalarFieldEnum[]
  }

  /**
   * UserConfig findFirstOrThrow
   */
  export interface UserConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
    /**
     * Filter, which UserConfig to fetch.
     */
    where?: UserConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserConfigs to fetch.
     */
    orderBy?: UserConfigOrderByWithRelationInput | UserConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserConfigs.
     */
    cursor?: UserConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserConfigs.
     */
    distinct?: UserConfigScalarFieldEnum | UserConfigScalarFieldEnum[]
  }

  /**
   * UserConfig findMany
   */
  export interface UserConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
    /**
     * Filter, which UserConfigs to fetch.
     */
    where?: UserConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserConfigs to fetch.
     */
    orderBy?: UserConfigOrderByWithRelationInput | UserConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UserConfigs.
     */
    cursor?: UserConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserConfigs.
     */
    skip?: number
    distinct?: UserConfigScalarFieldEnum | UserConfigScalarFieldEnum[]
  }

  /**
   * UserConfig create
   */
  export interface UserConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
    /**
     * The data needed to create a UserConfig.
     */
    data: XOR<UserConfigCreateInput, UserConfigUncheckedCreateInput>
  }

  /**
   * UserConfig createMany
   */
  export interface UserConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many UserConfigs.
     */
    data: UserConfigCreateManyInput | UserConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserConfig update
   */
  export interface UserConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
    /**
     * The data needed to update a UserConfig.
     */
    data: XOR<UserConfigUpdateInput, UserConfigUncheckedUpdateInput>
    /**
     * Choose, which UserConfig to update.
     */
    where: UserConfigWhereUniqueInput
  }

  /**
   * UserConfig updateMany
   */
  export interface UserConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update UserConfigs.
     */
    data: XOR<UserConfigUpdateManyMutationInput, UserConfigUncheckedUpdateManyInput>
    /**
     * Filter which UserConfigs to update
     */
    where?: UserConfigWhereInput
    /**
     * Limit how many UserConfigs to update.
     */
    limit?: number
  }

  /**
   * UserConfig upsert
   */
  export interface UserConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
    /**
     * The filter to search for the UserConfig to update in case it exists.
     */
    where: UserConfigWhereUniqueInput
    /**
     * In case the UserConfig found by the `where` argument doesn't exist, create a new UserConfig with this data.
     */
    create: XOR<UserConfigCreateInput, UserConfigUncheckedCreateInput>
    /**
     * In case the UserConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserConfigUpdateInput, UserConfigUncheckedUpdateInput>
  }

  /**
   * UserConfig delete
   */
  export interface UserConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
    /**
     * Filter which UserConfig to delete.
     */
    where: UserConfigWhereUniqueInput
  }

  /**
   * UserConfig deleteMany
   */
  export interface UserConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which UserConfigs to delete
     */
    where?: UserConfigWhereInput
    /**
     * Limit how many UserConfigs to delete.
     */
    limit?: number
  }

  /**
   * UserConfig without action
   */
  export interface UserConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the UserConfig
     */
    select?: UserConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserConfig
     */
    omit?: UserConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserConfigInclude<ExtArgs> | null
  }

  /**
   * Model AccessToken
   */

  export interface AggregateAccessToken {
    _count: AccessTokenCountAggregateOutputType | null
    _avg: AccessTokenAvgAggregateOutputType | null
    _sum: AccessTokenSumAggregateOutputType | null
    _min: AccessTokenMinAggregateOutputType | null
    _max: AccessTokenMaxAggregateOutputType | null
  }

  export interface AccessTokenAvgAggregateOutputType {
    status: number | null
  }

  export interface AccessTokenSumAggregateOutputType {
    status: number | null
  }

  export interface AccessTokenMinAggregateOutputType {
    id: string | null
    userId: string | null
    token: string | null
    roles: string | null
    status: number | null
    scope: string | null
    isRevoked: boolean | null
    ip: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export interface AccessTokenMaxAggregateOutputType {
    id: string | null
    userId: string | null
    token: string | null
    roles: string | null
    status: number | null
    scope: string | null
    isRevoked: boolean | null
    ip: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export interface AccessTokenCountAggregateOutputType {
    id: number
    userId: number
    token: number
    roles: number
    status: number
    scope: number
    isRevoked: number
    ip: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export interface AccessTokenAvgAggregateInputType {
    status?: true
  }

  export interface AccessTokenSumAggregateInputType {
    status?: true
  }

  export interface AccessTokenMinAggregateInputType {
    id?: true
    userId?: true
    token?: true
    roles?: true
    status?: true
    scope?: true
    isRevoked?: true
    ip?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export interface AccessTokenMaxAggregateInputType {
    id?: true
    userId?: true
    token?: true
    roles?: true
    status?: true
    scope?: true
    isRevoked?: true
    ip?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export interface AccessTokenCountAggregateInputType {
    id?: true
    userId?: true
    token?: true
    roles?: true
    status?: true
    scope?: true
    isRevoked?: true
    ip?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export interface AccessTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which AccessToken to aggregate.
     */
    where?: AccessTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccessTokens to fetch.
     */
    orderBy?: AccessTokenOrderByWithRelationInput | AccessTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AccessTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccessTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccessTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AccessTokens
     */
    _count?: true | AccessTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     */
    _avg?: AccessTokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     */
    _sum?: AccessTokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: AccessTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: AccessTokenMaxAggregateInputType
  }

  export type GetAccessTokenAggregateType<T extends AccessTokenAggregateArgs> = {
    [P in keyof T & keyof AggregateAccessToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccessToken[P]>
      : GetScalarType<T[P], AggregateAccessToken[P]>
  }

  export interface AccessTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: AccessTokenWhereInput
    orderBy?: AccessTokenOrderByWithAggregationInput | AccessTokenOrderByWithAggregationInput[]
    by: AccessTokenScalarFieldEnum[] | AccessTokenScalarFieldEnum
    having?: AccessTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccessTokenCountAggregateInputType | true
    _avg?: AccessTokenAvgAggregateInputType
    _sum?: AccessTokenSumAggregateInputType
    _min?: AccessTokenMinAggregateInputType
    _max?: AccessTokenMaxAggregateInputType
  }

  export interface AccessTokenGroupByOutputType {
    id: string
    userId: string
    token: string
    roles: string
    status: number
    scope: string
    isRevoked: boolean
    ip: string | null
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: AccessTokenCountAggregateOutputType | null
    _avg: AccessTokenAvgAggregateOutputType | null
    _sum: AccessTokenSumAggregateOutputType | null
    _min: AccessTokenMinAggregateOutputType | null
    _max: AccessTokenMaxAggregateOutputType | null
  }

  type GetAccessTokenGroupByPayload<T extends AccessTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccessTokenGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof AccessTokenGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AccessTokenGroupByOutputType[P]>
          : GetScalarType<T[P], AccessTokenGroupByOutputType[P]>
      }
      >
    >

  export type AccessTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    roles?: boolean
    status?: boolean
    scope?: boolean
    isRevoked?: boolean
    ip?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userInfo?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs['result']['accessToken']>

  export interface AccessTokenSelectScalar {
    id?: boolean
    userId?: boolean
    token?: boolean
    roles?: boolean
    status?: boolean
    scope?: boolean
    isRevoked?: boolean
    ip?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccessTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'userId' | 'token' | 'roles' | 'status' | 'scope' | 'isRevoked' | 'ip' | 'expiresAt' | 'createdAt' | 'updatedAt', ExtArgs['result']['accessToken']>
  export interface AccessTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    userInfo?: boolean | UserDefaultArgs<ExtArgs>
  }

  export interface $AccessTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'AccessToken'
    objects: {
      userInfo: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      token: string
      roles: string
      status: number
      scope: string
      isRevoked: boolean
      ip: string | null
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs['result']['accessToken']>
    composites: {}
  }

  type AccessTokenGetPayload<S extends boolean | null | undefined | AccessTokenDefaultArgs> = $Result.GetResult<Prisma.$AccessTokenPayload, S>

  type AccessTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<AccessTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccessTokenCountAggregateInputType | true
    }

  export interface AccessTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccessToken'], meta: { name: 'AccessToken' } }
    /**
     * Find zero or one AccessToken that matches the filter.
     * @param {AccessTokenFindUniqueArgs} args - Arguments to find a AccessToken
     * @example
     * // Get one AccessToken
     * const accessToken = await prisma.accessToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccessTokenFindUniqueArgs>(args: SelectSubset<T, AccessTokenFindUniqueArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AccessToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccessTokenFindUniqueOrThrowArgs} args - Arguments to find a AccessToken
     * @example
     * // Get one AccessToken
     * const accessToken = await prisma.accessToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccessTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, AccessTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccessToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenFindFirstArgs} args - Arguments to find a AccessToken
     * @example
     * // Get one AccessToken
     * const accessToken = await prisma.accessToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccessTokenFindFirstArgs>(args?: SelectSubset<T, AccessTokenFindFirstArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccessToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenFindFirstOrThrowArgs} args - Arguments to find a AccessToken
     * @example
     * // Get one AccessToken
     * const accessToken = await prisma.accessToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccessTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, AccessTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AccessTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccessTokens
     * const accessTokens = await prisma.accessToken.findMany()
     *
     * // Get first 10 AccessTokens
     * const accessTokens = await prisma.accessToken.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const accessTokenWithIdOnly = await prisma.accessToken.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AccessTokenFindManyArgs>(args?: SelectSubset<T, AccessTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a AccessToken.
     * @param {AccessTokenCreateArgs} args - Arguments to create a AccessToken.
     * @example
     * // Create one AccessToken
     * const AccessToken = await prisma.accessToken.create({
     *   data: {
     *     // ... data to create a AccessToken
     *   }
     * })
     *
     */
    create<T extends AccessTokenCreateArgs>(args: SelectSubset<T, AccessTokenCreateArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AccessTokens.
     * @param {AccessTokenCreateManyArgs} args - Arguments to create many AccessTokens.
     * @example
     * // Create many AccessTokens
     * const accessToken = await prisma.accessToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AccessTokenCreateManyArgs>(args?: SelectSubset<T, AccessTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AccessToken.
     * @param {AccessTokenDeleteArgs} args - Arguments to delete one AccessToken.
     * @example
     * // Delete one AccessToken
     * const AccessToken = await prisma.accessToken.delete({
     *   where: {
     *     // ... filter to delete one AccessToken
     *   }
     * })
     *
     */
    delete<T extends AccessTokenDeleteArgs>(args: SelectSubset<T, AccessTokenDeleteArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AccessToken.
     * @param {AccessTokenUpdateArgs} args - Arguments to update one AccessToken.
     * @example
     * // Update one AccessToken
     * const accessToken = await prisma.accessToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AccessTokenUpdateArgs>(args: SelectSubset<T, AccessTokenUpdateArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AccessTokens.
     * @param {AccessTokenDeleteManyArgs} args - Arguments to filter AccessTokens to delete.
     * @example
     * // Delete a few AccessTokens
     * const { count } = await prisma.accessToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AccessTokenDeleteManyArgs>(args?: SelectSubset<T, AccessTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccessTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccessTokens
     * const accessToken = await prisma.accessToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AccessTokenUpdateManyArgs>(args: SelectSubset<T, AccessTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AccessToken.
     * @param {AccessTokenUpsertArgs} args - Arguments to update or create a AccessToken.
     * @example
     * // Update or create a AccessToken
     * const accessToken = await prisma.accessToken.upsert({
     *   create: {
     *     // ... data to create a AccessToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccessToken we want to update
     *   }
     * })
     */
    upsert<T extends AccessTokenUpsertArgs>(args: SelectSubset<T, AccessTokenUpsertArgs<ExtArgs>>): Prisma__AccessTokenClient<$Result.GetResult<Prisma.$AccessTokenPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of AccessTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenCountArgs} args - Arguments to filter AccessTokens to count.
     * @example
     * // Count the number of AccessTokens
     * const count = await prisma.accessToken.count({
     *   where: {
     *     // ... the filter for the AccessTokens we want to count
     *   }
     * })
     */
    count<T extends AccessTokenCountArgs>(
      args?: Subset<T, AccessTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccessTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccessToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends AccessTokenAggregateArgs>(args: Subset<T, AccessTokenAggregateArgs>): Prisma.PrismaPromise<GetAccessTokenAggregateType<T>>

    /**
     * Group by AccessToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends AccessTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccessTokenGroupByArgs['orderBy'] }
        : { orderBy?: AccessTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, AccessTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccessTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the AccessToken model
     */
    readonly fields: AccessTokenFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccessToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccessTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    userInfo<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the AccessToken model
   */
  interface AccessTokenFieldRefs {
    readonly id: FieldRef<'AccessToken', 'String'>
    readonly userId: FieldRef<'AccessToken', 'String'>
    readonly token: FieldRef<'AccessToken', 'String'>
    readonly roles: FieldRef<'AccessToken', 'String'>
    readonly status: FieldRef<'AccessToken', 'Int'>
    readonly scope: FieldRef<'AccessToken', 'String'>
    readonly isRevoked: FieldRef<'AccessToken', 'Boolean'>
    readonly ip: FieldRef<'AccessToken', 'String'>
    readonly expiresAt: FieldRef<'AccessToken', 'DateTime'>
    readonly createdAt: FieldRef<'AccessToken', 'DateTime'>
    readonly updatedAt: FieldRef<'AccessToken', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * AccessToken findUnique
   */
  export interface AccessTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter, which AccessToken to fetch.
     */
    where: AccessTokenWhereUniqueInput
  }

  /**
   * AccessToken findUniqueOrThrow
   */
  export interface AccessTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter, which AccessToken to fetch.
     */
    where: AccessTokenWhereUniqueInput
  }

  /**
   * AccessToken findFirst
   */
  export interface AccessTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter, which AccessToken to fetch.
     */
    where?: AccessTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccessTokens to fetch.
     */
    orderBy?: AccessTokenOrderByWithRelationInput | AccessTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AccessTokens.
     */
    cursor?: AccessTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccessTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccessTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AccessTokens.
     */
    distinct?: AccessTokenScalarFieldEnum | AccessTokenScalarFieldEnum[]
  }

  /**
   * AccessToken findFirstOrThrow
   */
  export interface AccessTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter, which AccessToken to fetch.
     */
    where?: AccessTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccessTokens to fetch.
     */
    orderBy?: AccessTokenOrderByWithRelationInput | AccessTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AccessTokens.
     */
    cursor?: AccessTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccessTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccessTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AccessTokens.
     */
    distinct?: AccessTokenScalarFieldEnum | AccessTokenScalarFieldEnum[]
  }

  /**
   * AccessToken findMany
   */
  export interface AccessTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter, which AccessTokens to fetch.
     */
    where?: AccessTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccessTokens to fetch.
     */
    orderBy?: AccessTokenOrderByWithRelationInput | AccessTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AccessTokens.
     */
    cursor?: AccessTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccessTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccessTokens.
     */
    skip?: number
    distinct?: AccessTokenScalarFieldEnum | AccessTokenScalarFieldEnum[]
  }

  /**
   * AccessToken create
   */
  export interface AccessTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a AccessToken.
     */
    data: XOR<AccessTokenCreateInput, AccessTokenUncheckedCreateInput>
  }

  /**
   * AccessToken createMany
   */
  export interface AccessTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many AccessTokens.
     */
    data: AccessTokenCreateManyInput | AccessTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccessToken update
   */
  export interface AccessTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a AccessToken.
     */
    data: XOR<AccessTokenUpdateInput, AccessTokenUncheckedUpdateInput>
    /**
     * Choose, which AccessToken to update.
     */
    where: AccessTokenWhereUniqueInput
  }

  /**
   * AccessToken updateMany
   */
  export interface AccessTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update AccessTokens.
     */
    data: XOR<AccessTokenUpdateManyMutationInput, AccessTokenUncheckedUpdateManyInput>
    /**
     * Filter which AccessTokens to update
     */
    where?: AccessTokenWhereInput
    /**
     * Limit how many AccessTokens to update.
     */
    limit?: number
  }

  /**
   * AccessToken upsert
   */
  export interface AccessTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the AccessToken to update in case it exists.
     */
    where: AccessTokenWhereUniqueInput
    /**
     * In case the AccessToken found by the `where` argument doesn't exist, create a new AccessToken with this data.
     */
    create: XOR<AccessTokenCreateInput, AccessTokenUncheckedCreateInput>
    /**
     * In case the AccessToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccessTokenUpdateInput, AccessTokenUncheckedUpdateInput>
  }

  /**
   * AccessToken delete
   */
  export interface AccessTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
    /**
     * Filter which AccessToken to delete.
     */
    where: AccessTokenWhereUniqueInput
  }

  /**
   * AccessToken deleteMany
   */
  export interface AccessTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which AccessTokens to delete
     */
    where?: AccessTokenWhereInput
    /**
     * Limit how many AccessTokens to delete.
     */
    limit?: number
  }

  /**
   * AccessToken without action
   */
  export interface AccessTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the AccessToken
     */
    select?: AccessTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessToken
     */
    omit?: AccessTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessTokenInclude<ExtArgs> | null
  }

  /**
   * Model OAuth
   */

  export interface AggregateOAuth {
    _count: OAuthCountAggregateOutputType | null
    _min: OAuthMinAggregateOutputType | null
    _max: OAuthMaxAggregateOutputType | null
  }

  export interface OAuthMinAggregateOutputType {
    id: string | null
    userId: string | null
    provider: string | null
    providerId: string | null
    providerUnionId: string | null
    providerToken: string | null
    providerRefreshToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export interface OAuthMaxAggregateOutputType {
    id: string | null
    userId: string | null
    provider: string | null
    providerId: string | null
    providerUnionId: string | null
    providerToken: string | null
    providerRefreshToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export interface OAuthCountAggregateOutputType {
    id: number
    userId: number
    provider: number
    providerId: number
    providerUnionId: number
    providerToken: number
    providerRefreshToken: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export interface OAuthMinAggregateInputType {
    id?: true
    userId?: true
    provider?: true
    providerId?: true
    providerUnionId?: true
    providerToken?: true
    providerRefreshToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export interface OAuthMaxAggregateInputType {
    id?: true
    userId?: true
    provider?: true
    providerId?: true
    providerUnionId?: true
    providerToken?: true
    providerRefreshToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export interface OAuthCountAggregateInputType {
    id?: true
    userId?: true
    provider?: true
    providerId?: true
    providerUnionId?: true
    providerToken?: true
    providerRefreshToken?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export interface OAuthAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which OAuth to aggregate.
     */
    where?: OAuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OAuths to fetch.
     */
    orderBy?: OAuthOrderByWithRelationInput | OAuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: OAuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OAuths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OAuths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned OAuths
     */
    _count?: true | OAuthCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: OAuthMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: OAuthMaxAggregateInputType
  }

  export type GetOAuthAggregateType<T extends OAuthAggregateArgs> = {
    [P in keyof T & keyof AggregateOAuth]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOAuth[P]>
      : GetScalarType<T[P], AggregateOAuth[P]>
  }

  export interface OAuthGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: OAuthWhereInput
    orderBy?: OAuthOrderByWithAggregationInput | OAuthOrderByWithAggregationInput[]
    by: OAuthScalarFieldEnum[] | OAuthScalarFieldEnum
    having?: OAuthScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OAuthCountAggregateInputType | true
    _min?: OAuthMinAggregateInputType
    _max?: OAuthMaxAggregateInputType
  }

  export interface OAuthGroupByOutputType {
    id: string
    userId: string | null
    provider: string
    providerId: string
    providerUnionId: string | null
    providerToken: string | null
    providerRefreshToken: string | null
    createdAt: Date
    updatedAt: Date
    _count: OAuthCountAggregateOutputType | null
    _min: OAuthMinAggregateOutputType | null
    _max: OAuthMaxAggregateOutputType | null
  }

  type GetOAuthGroupByPayload<T extends OAuthGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OAuthGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof OAuthGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], OAuthGroupByOutputType[P]>
          : GetScalarType<T[P], OAuthGroupByOutputType[P]>
      }
      >
    >

  export type OAuthSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    providerId?: boolean
    providerUnionId?: boolean
    providerToken?: boolean
    providerRefreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | OAuth$userArgs<ExtArgs>
  }, ExtArgs['result']['oAuth']>

  export interface OAuthSelectScalar {
    id?: boolean
    userId?: boolean
    provider?: boolean
    providerId?: boolean
    providerUnionId?: boolean
    providerToken?: boolean
    providerRefreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OAuthOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'userId' | 'provider' | 'providerId' | 'providerUnionId' | 'providerToken' | 'providerRefreshToken' | 'createdAt' | 'updatedAt', ExtArgs['result']['oAuth']>
  export interface OAuthInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    user?: boolean | OAuth$userArgs<ExtArgs>
  }

  export interface $OAuthPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'OAuth'
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      provider: string
      providerId: string
      providerUnionId: string | null
      providerToken: string | null
      providerRefreshToken: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs['result']['oAuth']>
    composites: {}
  }

  type OAuthGetPayload<S extends boolean | null | undefined | OAuthDefaultArgs> = $Result.GetResult<Prisma.$OAuthPayload, S>

  type OAuthCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<OAuthFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OAuthCountAggregateInputType | true
    }

  export interface OAuthDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OAuth'], meta: { name: 'OAuth' } }
    /**
     * Find zero or one OAuth that matches the filter.
     * @param {OAuthFindUniqueArgs} args - Arguments to find a OAuth
     * @example
     * // Get one OAuth
     * const oAuth = await prisma.oAuth.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OAuthFindUniqueArgs>(args: SelectSubset<T, OAuthFindUniqueArgs<ExtArgs>>): Prisma__OAuthClient<$Result.GetResult<Prisma.$OAuthPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OAuth that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OAuthFindUniqueOrThrowArgs} args - Arguments to find a OAuth
     * @example
     * // Get one OAuth
     * const oAuth = await prisma.oAuth.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OAuthFindUniqueOrThrowArgs>(args: SelectSubset<T, OAuthFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OAuthClient<$Result.GetResult<Prisma.$OAuthPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OAuth that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthFindFirstArgs} args - Arguments to find a OAuth
     * @example
     * // Get one OAuth
     * const oAuth = await prisma.oAuth.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OAuthFindFirstArgs>(args?: SelectSubset<T, OAuthFindFirstArgs<ExtArgs>>): Prisma__OAuthClient<$Result.GetResult<Prisma.$OAuthPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OAuth that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthFindFirstOrThrowArgs} args - Arguments to find a OAuth
     * @example
     * // Get one OAuth
     * const oAuth = await prisma.oAuth.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OAuthFindFirstOrThrowArgs>(args?: SelectSubset<T, OAuthFindFirstOrThrowArgs<ExtArgs>>): Prisma__OAuthClient<$Result.GetResult<Prisma.$OAuthPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OAuths that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OAuths
     * const oAuths = await prisma.oAuth.findMany()
     *
     * // Get first 10 OAuths
     * const oAuths = await prisma.oAuth.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const oAuthWithIdOnly = await prisma.oAuth.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OAuthFindManyArgs>(args?: SelectSubset<T, OAuthFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a OAuth.
     * @param {OAuthCreateArgs} args - Arguments to create a OAuth.
     * @example
     * // Create one OAuth
     * const OAuth = await prisma.oAuth.create({
     *   data: {
     *     // ... data to create a OAuth
     *   }
     * })
     *
     */
    create<T extends OAuthCreateArgs>(args: SelectSubset<T, OAuthCreateArgs<ExtArgs>>): Prisma__OAuthClient<$Result.GetResult<Prisma.$OAuthPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OAuths.
     * @param {OAuthCreateManyArgs} args - Arguments to create many OAuths.
     * @example
     * // Create many OAuths
     * const oAuth = await prisma.oAuth.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OAuthCreateManyArgs>(args?: SelectSubset<T, OAuthCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a OAuth.
     * @param {OAuthDeleteArgs} args - Arguments to delete one OAuth.
     * @example
     * // Delete one OAuth
     * const OAuth = await prisma.oAuth.delete({
     *   where: {
     *     // ... filter to delete one OAuth
     *   }
     * })
     *
     */
    delete<T extends OAuthDeleteArgs>(args: SelectSubset<T, OAuthDeleteArgs<ExtArgs>>): Prisma__OAuthClient<$Result.GetResult<Prisma.$OAuthPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OAuth.
     * @param {OAuthUpdateArgs} args - Arguments to update one OAuth.
     * @example
     * // Update one OAuth
     * const oAuth = await prisma.oAuth.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OAuthUpdateArgs>(args: SelectSubset<T, OAuthUpdateArgs<ExtArgs>>): Prisma__OAuthClient<$Result.GetResult<Prisma.$OAuthPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OAuths.
     * @param {OAuthDeleteManyArgs} args - Arguments to filter OAuths to delete.
     * @example
     * // Delete a few OAuths
     * const { count } = await prisma.oAuth.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OAuthDeleteManyArgs>(args?: SelectSubset<T, OAuthDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OAuths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OAuths
     * const oAuth = await prisma.oAuth.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OAuthUpdateManyArgs>(args: SelectSubset<T, OAuthUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OAuth.
     * @param {OAuthUpsertArgs} args - Arguments to update or create a OAuth.
     * @example
     * // Update or create a OAuth
     * const oAuth = await prisma.oAuth.upsert({
     *   create: {
     *     // ... data to create a OAuth
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OAuth we want to update
     *   }
     * })
     */
    upsert<T extends OAuthUpsertArgs>(args: SelectSubset<T, OAuthUpsertArgs<ExtArgs>>): Prisma__OAuthClient<$Result.GetResult<Prisma.$OAuthPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of OAuths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthCountArgs} args - Arguments to filter OAuths to count.
     * @example
     * // Count the number of OAuths
     * const count = await prisma.oAuth.count({
     *   where: {
     *     // ... the filter for the OAuths we want to count
     *   }
     * })
     */
    count<T extends OAuthCountArgs>(
      args?: Subset<T, OAuthCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OAuthCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OAuth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends OAuthAggregateArgs>(args: Subset<T, OAuthAggregateArgs>): Prisma.PrismaPromise<GetOAuthAggregateType<T>>

    /**
     * Group by OAuth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends OAuthGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OAuthGroupByArgs['orderBy'] }
        : { orderBy?: OAuthGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, OAuthGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOAuthGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the OAuth model
     */
    readonly fields: OAuthFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for OAuth.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OAuthClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user<T extends OAuth$userArgs<ExtArgs> = {}>(args?: Subset<T, OAuth$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the OAuth model
   */
  interface OAuthFieldRefs {
    readonly id: FieldRef<'OAuth', 'String'>
    readonly userId: FieldRef<'OAuth', 'String'>
    readonly provider: FieldRef<'OAuth', 'String'>
    readonly providerId: FieldRef<'OAuth', 'String'>
    readonly providerUnionId: FieldRef<'OAuth', 'String'>
    readonly providerToken: FieldRef<'OAuth', 'String'>
    readonly providerRefreshToken: FieldRef<'OAuth', 'String'>
    readonly createdAt: FieldRef<'OAuth', 'DateTime'>
    readonly updatedAt: FieldRef<'OAuth', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * OAuth findUnique
   */
  export interface OAuthFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
    /**
     * Filter, which OAuth to fetch.
     */
    where: OAuthWhereUniqueInput
  }

  /**
   * OAuth findUniqueOrThrow
   */
  export interface OAuthFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
    /**
     * Filter, which OAuth to fetch.
     */
    where: OAuthWhereUniqueInput
  }

  /**
   * OAuth findFirst
   */
  export interface OAuthFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
    /**
     * Filter, which OAuth to fetch.
     */
    where?: OAuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OAuths to fetch.
     */
    orderBy?: OAuthOrderByWithRelationInput | OAuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OAuths.
     */
    cursor?: OAuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OAuths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OAuths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OAuths.
     */
    distinct?: OAuthScalarFieldEnum | OAuthScalarFieldEnum[]
  }

  /**
   * OAuth findFirstOrThrow
   */
  export interface OAuthFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
    /**
     * Filter, which OAuth to fetch.
     */
    where?: OAuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OAuths to fetch.
     */
    orderBy?: OAuthOrderByWithRelationInput | OAuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OAuths.
     */
    cursor?: OAuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OAuths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OAuths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OAuths.
     */
    distinct?: OAuthScalarFieldEnum | OAuthScalarFieldEnum[]
  }

  /**
   * OAuth findMany
   */
  export interface OAuthFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
    /**
     * Filter, which OAuths to fetch.
     */
    where?: OAuthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OAuths to fetch.
     */
    orderBy?: OAuthOrderByWithRelationInput | OAuthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing OAuths.
     */
    cursor?: OAuthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OAuths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OAuths.
     */
    skip?: number
    distinct?: OAuthScalarFieldEnum | OAuthScalarFieldEnum[]
  }

  /**
   * OAuth create
   */
  export interface OAuthCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
    /**
     * The data needed to create a OAuth.
     */
    data: XOR<OAuthCreateInput, OAuthUncheckedCreateInput>
  }

  /**
   * OAuth createMany
   */
  export interface OAuthCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many OAuths.
     */
    data: OAuthCreateManyInput | OAuthCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OAuth update
   */
  export interface OAuthUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
    /**
     * The data needed to update a OAuth.
     */
    data: XOR<OAuthUpdateInput, OAuthUncheckedUpdateInput>
    /**
     * Choose, which OAuth to update.
     */
    where: OAuthWhereUniqueInput
  }

  /**
   * OAuth updateMany
   */
  export interface OAuthUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update OAuths.
     */
    data: XOR<OAuthUpdateManyMutationInput, OAuthUncheckedUpdateManyInput>
    /**
     * Filter which OAuths to update
     */
    where?: OAuthWhereInput
    /**
     * Limit how many OAuths to update.
     */
    limit?: number
  }

  /**
   * OAuth upsert
   */
  export interface OAuthUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
    /**
     * The filter to search for the OAuth to update in case it exists.
     */
    where: OAuthWhereUniqueInput
    /**
     * In case the OAuth found by the `where` argument doesn't exist, create a new OAuth with this data.
     */
    create: XOR<OAuthCreateInput, OAuthUncheckedCreateInput>
    /**
     * In case the OAuth was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OAuthUpdateInput, OAuthUncheckedUpdateInput>
  }

  /**
   * OAuth delete
   */
  export interface OAuthDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
    /**
     * Filter which OAuth to delete.
     */
    where: OAuthWhereUniqueInput
  }

  /**
   * OAuth deleteMany
   */
  export interface OAuthDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which OAuths to delete
     */
    where?: OAuthWhereInput
    /**
     * Limit how many OAuths to delete.
     */
    limit?: number
  }

  /**
   * OAuth.user
   */
  export interface OAuth$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * OAuth without action
   */
  export interface OAuthDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the OAuth
     */
    select?: OAuthSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuth
     */
    omit?: OAuthOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthInclude<ExtArgs> | null
  }

  /**
   * Model BlogComment
   */

  export interface AggregateBlogComment {
    _count: BlogCommentCountAggregateOutputType | null
    _min: BlogCommentMinAggregateOutputType | null
    _max: BlogCommentMaxAggregateOutputType | null
  }

  export interface BlogCommentMinAggregateOutputType {
    id: string | null
    content: string | null
    create_ts: Date | null
    updated_ts: Date | null
    type: string | null
    quoteContent: string | null
    article_id: string | null
    user_id: string | null
    visitorName: string | null
    memo_id: string | null
  }

  export interface BlogCommentMaxAggregateOutputType {
    id: string | null
    content: string | null
    create_ts: Date | null
    updated_ts: Date | null
    type: string | null
    quoteContent: string | null
    article_id: string | null
    user_id: string | null
    visitorName: string | null
    memo_id: string | null
  }

  export interface BlogCommentCountAggregateOutputType {
    id: number
    content: number
    create_ts: number
    updated_ts: number
    type: number
    quoteContent: number
    article_id: number
    user_id: number
    visitorName: number
    memo_id: number
    _all: number
  }

  export interface BlogCommentMinAggregateInputType {
    id?: true
    content?: true
    create_ts?: true
    updated_ts?: true
    type?: true
    quoteContent?: true
    article_id?: true
    user_id?: true
    visitorName?: true
    memo_id?: true
  }

  export interface BlogCommentMaxAggregateInputType {
    id?: true
    content?: true
    create_ts?: true
    updated_ts?: true
    type?: true
    quoteContent?: true
    article_id?: true
    user_id?: true
    visitorName?: true
    memo_id?: true
  }

  export interface BlogCommentCountAggregateInputType {
    id?: true
    content?: true
    create_ts?: true
    updated_ts?: true
    type?: true
    quoteContent?: true
    article_id?: true
    user_id?: true
    visitorName?: true
    memo_id?: true
    _all?: true
  }

  export interface BlogCommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which BlogComment to aggregate.
     */
    where?: BlogCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogComments to fetch.
     */
    orderBy?: BlogCommentOrderByWithRelationInput | BlogCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: BlogCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned BlogComments
     */
    _count?: true | BlogCommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: BlogCommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: BlogCommentMaxAggregateInputType
  }

  export type GetBlogCommentAggregateType<T extends BlogCommentAggregateArgs> = {
    [P in keyof T & keyof AggregateBlogComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlogComment[P]>
      : GetScalarType<T[P], AggregateBlogComment[P]>
  }

  export interface BlogCommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogCommentWhereInput
    orderBy?: BlogCommentOrderByWithAggregationInput | BlogCommentOrderByWithAggregationInput[]
    by: BlogCommentScalarFieldEnum[] | BlogCommentScalarFieldEnum
    having?: BlogCommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlogCommentCountAggregateInputType | true
    _min?: BlogCommentMinAggregateInputType
    _max?: BlogCommentMaxAggregateInputType
  }

  export interface BlogCommentGroupByOutputType {
    id: string
    content: string
    create_ts: Date
    updated_ts: Date
    type: string
    quoteContent: string | null
    article_id: string | null
    user_id: string | null
    visitorName: string | null
    memo_id: string | null
    _count: BlogCommentCountAggregateOutputType | null
    _min: BlogCommentMinAggregateOutputType | null
    _max: BlogCommentMaxAggregateOutputType | null
  }

  type GetBlogCommentGroupByPayload<T extends BlogCommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlogCommentGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof BlogCommentGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], BlogCommentGroupByOutputType[P]>
          : GetScalarType<T[P], BlogCommentGroupByOutputType[P]>
      }
      >
    >

  export type BlogCommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    type?: boolean
    quoteContent?: boolean
    article_id?: boolean
    user_id?: boolean
    visitorName?: boolean
    memo_id?: boolean
    user_info?: boolean | BlogComment$user_infoArgs<ExtArgs>
    sub_comments?: boolean | BlogComment$sub_commentsArgs<ExtArgs>
    likes?: boolean | BlogComment$likesArgs<ExtArgs>
    memo_info?: boolean | BlogComment$memo_infoArgs<ExtArgs>
    _count?: boolean | BlogCommentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs['result']['blogComment']>

  export interface BlogCommentSelectScalar {
    id?: boolean
    content?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    type?: boolean
    quoteContent?: boolean
    article_id?: boolean
    user_id?: boolean
    visitorName?: boolean
    memo_id?: boolean
  }

  export type BlogCommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'content' | 'create_ts' | 'updated_ts' | 'type' | 'quoteContent' | 'article_id' | 'user_id' | 'visitorName' | 'memo_id', ExtArgs['result']['blogComment']>
  export interface BlogCommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    user_info?: boolean | BlogComment$user_infoArgs<ExtArgs>
    sub_comments?: boolean | BlogComment$sub_commentsArgs<ExtArgs>
    likes?: boolean | BlogComment$likesArgs<ExtArgs>
    memo_info?: boolean | BlogComment$memo_infoArgs<ExtArgs>
    _count?: boolean | BlogCommentCountOutputTypeDefaultArgs<ExtArgs>
  }

  export interface $BlogCommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'BlogComment'
    objects: {
      user_info: Prisma.$UserPayload<ExtArgs> | null
      sub_comments: Prisma.$BlogSubCommentPayload<ExtArgs>[]
      likes: Prisma.$BlogLikePayload<ExtArgs>[]
      memo_info: Prisma.$BlogMemoPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      create_ts: Date
      updated_ts: Date
      type: string
      quoteContent: string | null
      article_id: string | null
      user_id: string | null
      visitorName: string | null
      memo_id: string | null
    }, ExtArgs['result']['blogComment']>
    composites: {}
  }

  type BlogCommentGetPayload<S extends boolean | null | undefined | BlogCommentDefaultArgs> = $Result.GetResult<Prisma.$BlogCommentPayload, S>

  type BlogCommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<BlogCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BlogCommentCountAggregateInputType | true
    }

  export interface BlogCommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BlogComment'], meta: { name: 'BlogComment' } }
    /**
     * Find zero or one BlogComment that matches the filter.
     * @param {BlogCommentFindUniqueArgs} args - Arguments to find a BlogComment
     * @example
     * // Get one BlogComment
     * const blogComment = await prisma.blogComment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BlogCommentFindUniqueArgs>(args: SelectSubset<T, BlogCommentFindUniqueArgs<ExtArgs>>): Prisma__BlogCommentClient<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BlogComment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BlogCommentFindUniqueOrThrowArgs} args - Arguments to find a BlogComment
     * @example
     * // Get one BlogComment
     * const blogComment = await prisma.blogComment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BlogCommentFindUniqueOrThrowArgs>(args: SelectSubset<T, BlogCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BlogCommentClient<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogComment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCommentFindFirstArgs} args - Arguments to find a BlogComment
     * @example
     * // Get one BlogComment
     * const blogComment = await prisma.blogComment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BlogCommentFindFirstArgs>(args?: SelectSubset<T, BlogCommentFindFirstArgs<ExtArgs>>): Prisma__BlogCommentClient<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogComment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCommentFindFirstOrThrowArgs} args - Arguments to find a BlogComment
     * @example
     * // Get one BlogComment
     * const blogComment = await prisma.blogComment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BlogCommentFindFirstOrThrowArgs>(args?: SelectSubset<T, BlogCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__BlogCommentClient<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BlogComments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BlogComments
     * const blogComments = await prisma.blogComment.findMany()
     *
     * // Get first 10 BlogComments
     * const blogComments = await prisma.blogComment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const blogCommentWithIdOnly = await prisma.blogComment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BlogCommentFindManyArgs>(args?: SelectSubset<T, BlogCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a BlogComment.
     * @param {BlogCommentCreateArgs} args - Arguments to create a BlogComment.
     * @example
     * // Create one BlogComment
     * const BlogComment = await prisma.blogComment.create({
     *   data: {
     *     // ... data to create a BlogComment
     *   }
     * })
     *
     */
    create<T extends BlogCommentCreateArgs>(args: SelectSubset<T, BlogCommentCreateArgs<ExtArgs>>): Prisma__BlogCommentClient<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BlogComments.
     * @param {BlogCommentCreateManyArgs} args - Arguments to create many BlogComments.
     * @example
     * // Create many BlogComments
     * const blogComment = await prisma.blogComment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BlogCommentCreateManyArgs>(args?: SelectSubset<T, BlogCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BlogComment.
     * @param {BlogCommentDeleteArgs} args - Arguments to delete one BlogComment.
     * @example
     * // Delete one BlogComment
     * const BlogComment = await prisma.blogComment.delete({
     *   where: {
     *     // ... filter to delete one BlogComment
     *   }
     * })
     *
     */
    delete<T extends BlogCommentDeleteArgs>(args: SelectSubset<T, BlogCommentDeleteArgs<ExtArgs>>): Prisma__BlogCommentClient<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BlogComment.
     * @param {BlogCommentUpdateArgs} args - Arguments to update one BlogComment.
     * @example
     * // Update one BlogComment
     * const blogComment = await prisma.blogComment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BlogCommentUpdateArgs>(args: SelectSubset<T, BlogCommentUpdateArgs<ExtArgs>>): Prisma__BlogCommentClient<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BlogComments.
     * @param {BlogCommentDeleteManyArgs} args - Arguments to filter BlogComments to delete.
     * @example
     * // Delete a few BlogComments
     * const { count } = await prisma.blogComment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BlogCommentDeleteManyArgs>(args?: SelectSubset<T, BlogCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BlogComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BlogComments
     * const blogComment = await prisma.blogComment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BlogCommentUpdateManyArgs>(args: SelectSubset<T, BlogCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BlogComment.
     * @param {BlogCommentUpsertArgs} args - Arguments to update or create a BlogComment.
     * @example
     * // Update or create a BlogComment
     * const blogComment = await prisma.blogComment.upsert({
     *   create: {
     *     // ... data to create a BlogComment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BlogComment we want to update
     *   }
     * })
     */
    upsert<T extends BlogCommentUpsertArgs>(args: SelectSubset<T, BlogCommentUpsertArgs<ExtArgs>>): Prisma__BlogCommentClient<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of BlogComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCommentCountArgs} args - Arguments to filter BlogComments to count.
     * @example
     * // Count the number of BlogComments
     * const count = await prisma.blogComment.count({
     *   where: {
     *     // ... the filter for the BlogComments we want to count
     *   }
     * })
     */
    count<T extends BlogCommentCountArgs>(
      args?: Subset<T, BlogCommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlogCommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BlogComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends BlogCommentAggregateArgs>(args: Subset<T, BlogCommentAggregateArgs>): Prisma.PrismaPromise<GetBlogCommentAggregateType<T>>

    /**
     * Group by BlogComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogCommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends BlogCommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BlogCommentGroupByArgs['orderBy'] }
        : { orderBy?: BlogCommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, BlogCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the BlogComment model
     */
    readonly fields: BlogCommentFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for BlogComment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BlogCommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user_info<T extends BlogComment$user_infoArgs<ExtArgs> = {}>(args?: Subset<T, BlogComment$user_infoArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sub_comments<T extends BlogComment$sub_commentsArgs<ExtArgs> = {}>(args?: Subset<T, BlogComment$sub_commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    likes<T extends BlogComment$likesArgs<ExtArgs> = {}>(args?: Subset<T, BlogComment$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    memo_info<T extends BlogComment$memo_infoArgs<ExtArgs> = {}>(args?: Subset<T, BlogComment$memo_infoArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the BlogComment model
   */
  interface BlogCommentFieldRefs {
    readonly id: FieldRef<'BlogComment', 'String'>
    readonly content: FieldRef<'BlogComment', 'String'>
    readonly create_ts: FieldRef<'BlogComment', 'DateTime'>
    readonly updated_ts: FieldRef<'BlogComment', 'DateTime'>
    readonly type: FieldRef<'BlogComment', 'String'>
    readonly quoteContent: FieldRef<'BlogComment', 'String'>
    readonly article_id: FieldRef<'BlogComment', 'String'>
    readonly user_id: FieldRef<'BlogComment', 'String'>
    readonly visitorName: FieldRef<'BlogComment', 'String'>
    readonly memo_id: FieldRef<'BlogComment', 'String'>
  }

  // Custom InputTypes
  /**
   * BlogComment findUnique
   */
  export interface BlogCommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    /**
     * Filter, which BlogComment to fetch.
     */
    where: BlogCommentWhereUniqueInput
  }

  /**
   * BlogComment findUniqueOrThrow
   */
  export interface BlogCommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    /**
     * Filter, which BlogComment to fetch.
     */
    where: BlogCommentWhereUniqueInput
  }

  /**
   * BlogComment findFirst
   */
  export interface BlogCommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    /**
     * Filter, which BlogComment to fetch.
     */
    where?: BlogCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogComments to fetch.
     */
    orderBy?: BlogCommentOrderByWithRelationInput | BlogCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BlogComments.
     */
    cursor?: BlogCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BlogComments.
     */
    distinct?: BlogCommentScalarFieldEnum | BlogCommentScalarFieldEnum[]
  }

  /**
   * BlogComment findFirstOrThrow
   */
  export interface BlogCommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    /**
     * Filter, which BlogComment to fetch.
     */
    where?: BlogCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogComments to fetch.
     */
    orderBy?: BlogCommentOrderByWithRelationInput | BlogCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BlogComments.
     */
    cursor?: BlogCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BlogComments.
     */
    distinct?: BlogCommentScalarFieldEnum | BlogCommentScalarFieldEnum[]
  }

  /**
   * BlogComment findMany
   */
  export interface BlogCommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    /**
     * Filter, which BlogComments to fetch.
     */
    where?: BlogCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogComments to fetch.
     */
    orderBy?: BlogCommentOrderByWithRelationInput | BlogCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing BlogComments.
     */
    cursor?: BlogCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogComments.
     */
    skip?: number
    distinct?: BlogCommentScalarFieldEnum | BlogCommentScalarFieldEnum[]
  }

  /**
   * BlogComment create
   */
  export interface BlogCommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    /**
     * The data needed to create a BlogComment.
     */
    data: XOR<BlogCommentCreateInput, BlogCommentUncheckedCreateInput>
  }

  /**
   * BlogComment createMany
   */
  export interface BlogCommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many BlogComments.
     */
    data: BlogCommentCreateManyInput | BlogCommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BlogComment update
   */
  export interface BlogCommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    /**
     * The data needed to update a BlogComment.
     */
    data: XOR<BlogCommentUpdateInput, BlogCommentUncheckedUpdateInput>
    /**
     * Choose, which BlogComment to update.
     */
    where: BlogCommentWhereUniqueInput
  }

  /**
   * BlogComment updateMany
   */
  export interface BlogCommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update BlogComments.
     */
    data: XOR<BlogCommentUpdateManyMutationInput, BlogCommentUncheckedUpdateManyInput>
    /**
     * Filter which BlogComments to update
     */
    where?: BlogCommentWhereInput
    /**
     * Limit how many BlogComments to update.
     */
    limit?: number
  }

  /**
   * BlogComment upsert
   */
  export interface BlogCommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    /**
     * The filter to search for the BlogComment to update in case it exists.
     */
    where: BlogCommentWhereUniqueInput
    /**
     * In case the BlogComment found by the `where` argument doesn't exist, create a new BlogComment with this data.
     */
    create: XOR<BlogCommentCreateInput, BlogCommentUncheckedCreateInput>
    /**
     * In case the BlogComment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BlogCommentUpdateInput, BlogCommentUncheckedUpdateInput>
  }

  /**
   * BlogComment delete
   */
  export interface BlogCommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    /**
     * Filter which BlogComment to delete.
     */
    where: BlogCommentWhereUniqueInput
  }

  /**
   * BlogComment deleteMany
   */
  export interface BlogCommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which BlogComments to delete
     */
    where?: BlogCommentWhereInput
    /**
     * Limit how many BlogComments to delete.
     */
    limit?: number
  }

  /**
   * BlogComment.user_info
   */
  export interface BlogComment$user_infoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * BlogComment.sub_comments
   */
  export interface BlogComment$sub_commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    where?: BlogSubCommentWhereInput
    orderBy?: BlogSubCommentOrderByWithRelationInput | BlogSubCommentOrderByWithRelationInput[]
    cursor?: BlogSubCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogSubCommentScalarFieldEnum | BlogSubCommentScalarFieldEnum[]
  }

  /**
   * BlogComment.likes
   */
  export interface BlogComment$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    where?: BlogLikeWhereInput
    orderBy?: BlogLikeOrderByWithRelationInput | BlogLikeOrderByWithRelationInput[]
    cursor?: BlogLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogLikeScalarFieldEnum | BlogLikeScalarFieldEnum[]
  }

  /**
   * BlogComment.memo_info
   */
  export interface BlogComment$memo_infoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    where?: BlogMemoWhereInput
  }

  /**
   * BlogComment without action
   */
  export interface BlogCommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
  }

  /**
   * Model BlogExplain
   */

  export interface AggregateBlogExplain {
    _count: BlogExplainCountAggregateOutputType | null
    _min: BlogExplainMinAggregateOutputType | null
    _max: BlogExplainMaxAggregateOutputType | null
  }

  export interface BlogExplainMinAggregateOutputType {
    id: string | null
    create_ts: Date | null
    updated_ts: Date | null
    text: string | null
    content: string | null
    article_id: string | null
  }

  export interface BlogExplainMaxAggregateOutputType {
    id: string | null
    create_ts: Date | null
    updated_ts: Date | null
    text: string | null
    content: string | null
    article_id: string | null
  }

  export interface BlogExplainCountAggregateOutputType {
    id: number
    create_ts: number
    updated_ts: number
    text: number
    content: number
    article_id: number
    _all: number
  }

  export interface BlogExplainMinAggregateInputType {
    id?: true
    create_ts?: true
    updated_ts?: true
    text?: true
    content?: true
    article_id?: true
  }

  export interface BlogExplainMaxAggregateInputType {
    id?: true
    create_ts?: true
    updated_ts?: true
    text?: true
    content?: true
    article_id?: true
  }

  export interface BlogExplainCountAggregateInputType {
    id?: true
    create_ts?: true
    updated_ts?: true
    text?: true
    content?: true
    article_id?: true
    _all?: true
  }

  export interface BlogExplainAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which BlogExplain to aggregate.
     */
    where?: BlogExplainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogExplains to fetch.
     */
    orderBy?: BlogExplainOrderByWithRelationInput | BlogExplainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: BlogExplainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogExplains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogExplains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned BlogExplains
     */
    _count?: true | BlogExplainCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: BlogExplainMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: BlogExplainMaxAggregateInputType
  }

  export type GetBlogExplainAggregateType<T extends BlogExplainAggregateArgs> = {
    [P in keyof T & keyof AggregateBlogExplain]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlogExplain[P]>
      : GetScalarType<T[P], AggregateBlogExplain[P]>
  }

  export interface BlogExplainGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogExplainWhereInput
    orderBy?: BlogExplainOrderByWithAggregationInput | BlogExplainOrderByWithAggregationInput[]
    by: BlogExplainScalarFieldEnum[] | BlogExplainScalarFieldEnum
    having?: BlogExplainScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlogExplainCountAggregateInputType | true
    _min?: BlogExplainMinAggregateInputType
    _max?: BlogExplainMaxAggregateInputType
  }

  export interface BlogExplainGroupByOutputType {
    id: string
    create_ts: Date
    updated_ts: Date
    text: string
    content: string
    article_id: string
    _count: BlogExplainCountAggregateOutputType | null
    _min: BlogExplainMinAggregateOutputType | null
    _max: BlogExplainMaxAggregateOutputType | null
  }

  type GetBlogExplainGroupByPayload<T extends BlogExplainGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlogExplainGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof BlogExplainGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], BlogExplainGroupByOutputType[P]>
          : GetScalarType<T[P], BlogExplainGroupByOutputType[P]>
      }
      >
    >

  export type BlogExplainSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    text?: boolean
    content?: boolean
    article_id?: boolean
  }, ExtArgs['result']['blogExplain']>

  export interface BlogExplainSelectScalar {
    id?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    text?: boolean
    content?: boolean
    article_id?: boolean
  }

  export type BlogExplainOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'create_ts' | 'updated_ts' | 'text' | 'content' | 'article_id', ExtArgs['result']['blogExplain']>

  export interface $BlogExplainPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'BlogExplain'
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      create_ts: Date
      updated_ts: Date
      text: string
      content: string
      article_id: string
    }, ExtArgs['result']['blogExplain']>
    composites: {}
  }

  type BlogExplainGetPayload<S extends boolean | null | undefined | BlogExplainDefaultArgs> = $Result.GetResult<Prisma.$BlogExplainPayload, S>

  type BlogExplainCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<BlogExplainFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BlogExplainCountAggregateInputType | true
    }

  export interface BlogExplainDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BlogExplain'], meta: { name: 'BlogExplain' } }
    /**
     * Find zero or one BlogExplain that matches the filter.
     * @param {BlogExplainFindUniqueArgs} args - Arguments to find a BlogExplain
     * @example
     * // Get one BlogExplain
     * const blogExplain = await prisma.blogExplain.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BlogExplainFindUniqueArgs>(args: SelectSubset<T, BlogExplainFindUniqueArgs<ExtArgs>>): Prisma__BlogExplainClient<$Result.GetResult<Prisma.$BlogExplainPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BlogExplain that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BlogExplainFindUniqueOrThrowArgs} args - Arguments to find a BlogExplain
     * @example
     * // Get one BlogExplain
     * const blogExplain = await prisma.blogExplain.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BlogExplainFindUniqueOrThrowArgs>(args: SelectSubset<T, BlogExplainFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BlogExplainClient<$Result.GetResult<Prisma.$BlogExplainPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogExplain that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogExplainFindFirstArgs} args - Arguments to find a BlogExplain
     * @example
     * // Get one BlogExplain
     * const blogExplain = await prisma.blogExplain.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BlogExplainFindFirstArgs>(args?: SelectSubset<T, BlogExplainFindFirstArgs<ExtArgs>>): Prisma__BlogExplainClient<$Result.GetResult<Prisma.$BlogExplainPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogExplain that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogExplainFindFirstOrThrowArgs} args - Arguments to find a BlogExplain
     * @example
     * // Get one BlogExplain
     * const blogExplain = await prisma.blogExplain.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BlogExplainFindFirstOrThrowArgs>(args?: SelectSubset<T, BlogExplainFindFirstOrThrowArgs<ExtArgs>>): Prisma__BlogExplainClient<$Result.GetResult<Prisma.$BlogExplainPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BlogExplains that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogExplainFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BlogExplains
     * const blogExplains = await prisma.blogExplain.findMany()
     *
     * // Get first 10 BlogExplains
     * const blogExplains = await prisma.blogExplain.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const blogExplainWithIdOnly = await prisma.blogExplain.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BlogExplainFindManyArgs>(args?: SelectSubset<T, BlogExplainFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogExplainPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a BlogExplain.
     * @param {BlogExplainCreateArgs} args - Arguments to create a BlogExplain.
     * @example
     * // Create one BlogExplain
     * const BlogExplain = await prisma.blogExplain.create({
     *   data: {
     *     // ... data to create a BlogExplain
     *   }
     * })
     *
     */
    create<T extends BlogExplainCreateArgs>(args: SelectSubset<T, BlogExplainCreateArgs<ExtArgs>>): Prisma__BlogExplainClient<$Result.GetResult<Prisma.$BlogExplainPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BlogExplains.
     * @param {BlogExplainCreateManyArgs} args - Arguments to create many BlogExplains.
     * @example
     * // Create many BlogExplains
     * const blogExplain = await prisma.blogExplain.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BlogExplainCreateManyArgs>(args?: SelectSubset<T, BlogExplainCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BlogExplain.
     * @param {BlogExplainDeleteArgs} args - Arguments to delete one BlogExplain.
     * @example
     * // Delete one BlogExplain
     * const BlogExplain = await prisma.blogExplain.delete({
     *   where: {
     *     // ... filter to delete one BlogExplain
     *   }
     * })
     *
     */
    delete<T extends BlogExplainDeleteArgs>(args: SelectSubset<T, BlogExplainDeleteArgs<ExtArgs>>): Prisma__BlogExplainClient<$Result.GetResult<Prisma.$BlogExplainPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BlogExplain.
     * @param {BlogExplainUpdateArgs} args - Arguments to update one BlogExplain.
     * @example
     * // Update one BlogExplain
     * const blogExplain = await prisma.blogExplain.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BlogExplainUpdateArgs>(args: SelectSubset<T, BlogExplainUpdateArgs<ExtArgs>>): Prisma__BlogExplainClient<$Result.GetResult<Prisma.$BlogExplainPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BlogExplains.
     * @param {BlogExplainDeleteManyArgs} args - Arguments to filter BlogExplains to delete.
     * @example
     * // Delete a few BlogExplains
     * const { count } = await prisma.blogExplain.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BlogExplainDeleteManyArgs>(args?: SelectSubset<T, BlogExplainDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BlogExplains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogExplainUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BlogExplains
     * const blogExplain = await prisma.blogExplain.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BlogExplainUpdateManyArgs>(args: SelectSubset<T, BlogExplainUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BlogExplain.
     * @param {BlogExplainUpsertArgs} args - Arguments to update or create a BlogExplain.
     * @example
     * // Update or create a BlogExplain
     * const blogExplain = await prisma.blogExplain.upsert({
     *   create: {
     *     // ... data to create a BlogExplain
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BlogExplain we want to update
     *   }
     * })
     */
    upsert<T extends BlogExplainUpsertArgs>(args: SelectSubset<T, BlogExplainUpsertArgs<ExtArgs>>): Prisma__BlogExplainClient<$Result.GetResult<Prisma.$BlogExplainPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of BlogExplains.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogExplainCountArgs} args - Arguments to filter BlogExplains to count.
     * @example
     * // Count the number of BlogExplains
     * const count = await prisma.blogExplain.count({
     *   where: {
     *     // ... the filter for the BlogExplains we want to count
     *   }
     * })
     */
    count<T extends BlogExplainCountArgs>(
      args?: Subset<T, BlogExplainCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlogExplainCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BlogExplain.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogExplainAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends BlogExplainAggregateArgs>(args: Subset<T, BlogExplainAggregateArgs>): Prisma.PrismaPromise<GetBlogExplainAggregateType<T>>

    /**
     * Group by BlogExplain.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogExplainGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends BlogExplainGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BlogExplainGroupByArgs['orderBy'] }
        : { orderBy?: BlogExplainGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, BlogExplainGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogExplainGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the BlogExplain model
     */
    readonly fields: BlogExplainFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for BlogExplain.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BlogExplainClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the BlogExplain model
   */
  interface BlogExplainFieldRefs {
    readonly id: FieldRef<'BlogExplain', 'String'>
    readonly create_ts: FieldRef<'BlogExplain', 'DateTime'>
    readonly updated_ts: FieldRef<'BlogExplain', 'DateTime'>
    readonly text: FieldRef<'BlogExplain', 'String'>
    readonly content: FieldRef<'BlogExplain', 'String'>
    readonly article_id: FieldRef<'BlogExplain', 'String'>
  }

  // Custom InputTypes
  /**
   * BlogExplain findUnique
   */
  export interface BlogExplainFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogExplain
     */
    select?: BlogExplainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogExplain
     */
    omit?: BlogExplainOmit<ExtArgs> | null
    /**
     * Filter, which BlogExplain to fetch.
     */
    where: BlogExplainWhereUniqueInput
  }

  /**
   * BlogExplain findUniqueOrThrow
   */
  export interface BlogExplainFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogExplain
     */
    select?: BlogExplainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogExplain
     */
    omit?: BlogExplainOmit<ExtArgs> | null
    /**
     * Filter, which BlogExplain to fetch.
     */
    where: BlogExplainWhereUniqueInput
  }

  /**
   * BlogExplain findFirst
   */
  export interface BlogExplainFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogExplain
     */
    select?: BlogExplainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogExplain
     */
    omit?: BlogExplainOmit<ExtArgs> | null
    /**
     * Filter, which BlogExplain to fetch.
     */
    where?: BlogExplainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogExplains to fetch.
     */
    orderBy?: BlogExplainOrderByWithRelationInput | BlogExplainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BlogExplains.
     */
    cursor?: BlogExplainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogExplains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogExplains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BlogExplains.
     */
    distinct?: BlogExplainScalarFieldEnum | BlogExplainScalarFieldEnum[]
  }

  /**
   * BlogExplain findFirstOrThrow
   */
  export interface BlogExplainFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogExplain
     */
    select?: BlogExplainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogExplain
     */
    omit?: BlogExplainOmit<ExtArgs> | null
    /**
     * Filter, which BlogExplain to fetch.
     */
    where?: BlogExplainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogExplains to fetch.
     */
    orderBy?: BlogExplainOrderByWithRelationInput | BlogExplainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BlogExplains.
     */
    cursor?: BlogExplainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogExplains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogExplains.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BlogExplains.
     */
    distinct?: BlogExplainScalarFieldEnum | BlogExplainScalarFieldEnum[]
  }

  /**
   * BlogExplain findMany
   */
  export interface BlogExplainFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogExplain
     */
    select?: BlogExplainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogExplain
     */
    omit?: BlogExplainOmit<ExtArgs> | null
    /**
     * Filter, which BlogExplains to fetch.
     */
    where?: BlogExplainWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogExplains to fetch.
     */
    orderBy?: BlogExplainOrderByWithRelationInput | BlogExplainOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing BlogExplains.
     */
    cursor?: BlogExplainWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogExplains from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogExplains.
     */
    skip?: number
    distinct?: BlogExplainScalarFieldEnum | BlogExplainScalarFieldEnum[]
  }

  /**
   * BlogExplain create
   */
  export interface BlogExplainCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogExplain
     */
    select?: BlogExplainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogExplain
     */
    omit?: BlogExplainOmit<ExtArgs> | null
    /**
     * The data needed to create a BlogExplain.
     */
    data: XOR<BlogExplainCreateInput, BlogExplainUncheckedCreateInput>
  }

  /**
   * BlogExplain createMany
   */
  export interface BlogExplainCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many BlogExplains.
     */
    data: BlogExplainCreateManyInput | BlogExplainCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BlogExplain update
   */
  export interface BlogExplainUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogExplain
     */
    select?: BlogExplainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogExplain
     */
    omit?: BlogExplainOmit<ExtArgs> | null
    /**
     * The data needed to update a BlogExplain.
     */
    data: XOR<BlogExplainUpdateInput, BlogExplainUncheckedUpdateInput>
    /**
     * Choose, which BlogExplain to update.
     */
    where: BlogExplainWhereUniqueInput
  }

  /**
   * BlogExplain updateMany
   */
  export interface BlogExplainUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update BlogExplains.
     */
    data: XOR<BlogExplainUpdateManyMutationInput, BlogExplainUncheckedUpdateManyInput>
    /**
     * Filter which BlogExplains to update
     */
    where?: BlogExplainWhereInput
    /**
     * Limit how many BlogExplains to update.
     */
    limit?: number
  }

  /**
   * BlogExplain upsert
   */
  export interface BlogExplainUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogExplain
     */
    select?: BlogExplainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogExplain
     */
    omit?: BlogExplainOmit<ExtArgs> | null
    /**
     * The filter to search for the BlogExplain to update in case it exists.
     */
    where: BlogExplainWhereUniqueInput
    /**
     * In case the BlogExplain found by the `where` argument doesn't exist, create a new BlogExplain with this data.
     */
    create: XOR<BlogExplainCreateInput, BlogExplainUncheckedCreateInput>
    /**
     * In case the BlogExplain was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BlogExplainUpdateInput, BlogExplainUncheckedUpdateInput>
  }

  /**
   * BlogExplain delete
   */
  export interface BlogExplainDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogExplain
     */
    select?: BlogExplainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogExplain
     */
    omit?: BlogExplainOmit<ExtArgs> | null
    /**
     * Filter which BlogExplain to delete.
     */
    where: BlogExplainWhereUniqueInput
  }

  /**
   * BlogExplain deleteMany
   */
  export interface BlogExplainDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which BlogExplains to delete
     */
    where?: BlogExplainWhereInput
    /**
     * Limit how many BlogExplains to delete.
     */
    limit?: number
  }

  /**
   * BlogExplain without action
   */
  export interface BlogExplainDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogExplain
     */
    select?: BlogExplainSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogExplain
     */
    omit?: BlogExplainOmit<ExtArgs> | null
  }

  /**
   * Model BlogSubComment
   */

  export interface AggregateBlogSubComment {
    _count: BlogSubCommentCountAggregateOutputType | null
    _min: BlogSubCommentMinAggregateOutputType | null
    _max: BlogSubCommentMaxAggregateOutputType | null
  }

  export interface BlogSubCommentMinAggregateOutputType {
    id: string | null
    content: string | null
    create_ts: Date | null
    updated_ts: Date | null
    comment_id: string | null
    reply_sub_comment_id: string | null
    user_id: string | null
  }

  export interface BlogSubCommentMaxAggregateOutputType {
    id: string | null
    content: string | null
    create_ts: Date | null
    updated_ts: Date | null
    comment_id: string | null
    reply_sub_comment_id: string | null
    user_id: string | null
  }

  export interface BlogSubCommentCountAggregateOutputType {
    id: number
    content: number
    create_ts: number
    updated_ts: number
    comment_id: number
    reply_sub_comment_id: number
    user_id: number
    _all: number
  }

  export interface BlogSubCommentMinAggregateInputType {
    id?: true
    content?: true
    create_ts?: true
    updated_ts?: true
    comment_id?: true
    reply_sub_comment_id?: true
    user_id?: true
  }

  export interface BlogSubCommentMaxAggregateInputType {
    id?: true
    content?: true
    create_ts?: true
    updated_ts?: true
    comment_id?: true
    reply_sub_comment_id?: true
    user_id?: true
  }

  export interface BlogSubCommentCountAggregateInputType {
    id?: true
    content?: true
    create_ts?: true
    updated_ts?: true
    comment_id?: true
    reply_sub_comment_id?: true
    user_id?: true
    _all?: true
  }

  export interface BlogSubCommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which BlogSubComment to aggregate.
     */
    where?: BlogSubCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogSubComments to fetch.
     */
    orderBy?: BlogSubCommentOrderByWithRelationInput | BlogSubCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: BlogSubCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogSubComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogSubComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned BlogSubComments
     */
    _count?: true | BlogSubCommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: BlogSubCommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: BlogSubCommentMaxAggregateInputType
  }

  export type GetBlogSubCommentAggregateType<T extends BlogSubCommentAggregateArgs> = {
    [P in keyof T & keyof AggregateBlogSubComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlogSubComment[P]>
      : GetScalarType<T[P], AggregateBlogSubComment[P]>
  }

  export interface BlogSubCommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogSubCommentWhereInput
    orderBy?: BlogSubCommentOrderByWithAggregationInput | BlogSubCommentOrderByWithAggregationInput[]
    by: BlogSubCommentScalarFieldEnum[] | BlogSubCommentScalarFieldEnum
    having?: BlogSubCommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlogSubCommentCountAggregateInputType | true
    _min?: BlogSubCommentMinAggregateInputType
    _max?: BlogSubCommentMaxAggregateInputType
  }

  export interface BlogSubCommentGroupByOutputType {
    id: string
    content: string
    create_ts: Date
    updated_ts: Date
    comment_id: string
    reply_sub_comment_id: string | null
    user_id: string | null
    _count: BlogSubCommentCountAggregateOutputType | null
    _min: BlogSubCommentMinAggregateOutputType | null
    _max: BlogSubCommentMaxAggregateOutputType | null
  }

  type GetBlogSubCommentGroupByPayload<T extends BlogSubCommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlogSubCommentGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof BlogSubCommentGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], BlogSubCommentGroupByOutputType[P]>
          : GetScalarType<T[P], BlogSubCommentGroupByOutputType[P]>
      }
      >
    >

  export type BlogSubCommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    comment_id?: boolean
    reply_sub_comment_id?: boolean
    user_id?: boolean
    comment_info?: boolean | BlogCommentDefaultArgs<ExtArgs>
    user_info?: boolean | BlogSubComment$user_infoArgs<ExtArgs>
    likes?: boolean | BlogSubComment$likesArgs<ExtArgs>
    _count?: boolean | BlogSubCommentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs['result']['blogSubComment']>

  export interface BlogSubCommentSelectScalar {
    id?: boolean
    content?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    comment_id?: boolean
    reply_sub_comment_id?: boolean
    user_id?: boolean
  }

  export type BlogSubCommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'content' | 'create_ts' | 'updated_ts' | 'comment_id' | 'reply_sub_comment_id' | 'user_id', ExtArgs['result']['blogSubComment']>
  export interface BlogSubCommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    comment_info?: boolean | BlogCommentDefaultArgs<ExtArgs>
    user_info?: boolean | BlogSubComment$user_infoArgs<ExtArgs>
    likes?: boolean | BlogSubComment$likesArgs<ExtArgs>
    _count?: boolean | BlogSubCommentCountOutputTypeDefaultArgs<ExtArgs>
  }

  export interface $BlogSubCommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'BlogSubComment'
    objects: {
      comment_info: Prisma.$BlogCommentPayload<ExtArgs>
      user_info: Prisma.$UserPayload<ExtArgs> | null
      likes: Prisma.$BlogLikePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      create_ts: Date
      updated_ts: Date
      comment_id: string
      reply_sub_comment_id: string | null
      user_id: string | null
    }, ExtArgs['result']['blogSubComment']>
    composites: {}
  }

  type BlogSubCommentGetPayload<S extends boolean | null | undefined | BlogSubCommentDefaultArgs> = $Result.GetResult<Prisma.$BlogSubCommentPayload, S>

  type BlogSubCommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<BlogSubCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BlogSubCommentCountAggregateInputType | true
    }

  export interface BlogSubCommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BlogSubComment'], meta: { name: 'BlogSubComment' } }
    /**
     * Find zero or one BlogSubComment that matches the filter.
     * @param {BlogSubCommentFindUniqueArgs} args - Arguments to find a BlogSubComment
     * @example
     * // Get one BlogSubComment
     * const blogSubComment = await prisma.blogSubComment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BlogSubCommentFindUniqueArgs>(args: SelectSubset<T, BlogSubCommentFindUniqueArgs<ExtArgs>>): Prisma__BlogSubCommentClient<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BlogSubComment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BlogSubCommentFindUniqueOrThrowArgs} args - Arguments to find a BlogSubComment
     * @example
     * // Get one BlogSubComment
     * const blogSubComment = await prisma.blogSubComment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BlogSubCommentFindUniqueOrThrowArgs>(args: SelectSubset<T, BlogSubCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BlogSubCommentClient<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogSubComment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogSubCommentFindFirstArgs} args - Arguments to find a BlogSubComment
     * @example
     * // Get one BlogSubComment
     * const blogSubComment = await prisma.blogSubComment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BlogSubCommentFindFirstArgs>(args?: SelectSubset<T, BlogSubCommentFindFirstArgs<ExtArgs>>): Prisma__BlogSubCommentClient<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogSubComment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogSubCommentFindFirstOrThrowArgs} args - Arguments to find a BlogSubComment
     * @example
     * // Get one BlogSubComment
     * const blogSubComment = await prisma.blogSubComment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BlogSubCommentFindFirstOrThrowArgs>(args?: SelectSubset<T, BlogSubCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__BlogSubCommentClient<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BlogSubComments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogSubCommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BlogSubComments
     * const blogSubComments = await prisma.blogSubComment.findMany()
     *
     * // Get first 10 BlogSubComments
     * const blogSubComments = await prisma.blogSubComment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const blogSubCommentWithIdOnly = await prisma.blogSubComment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BlogSubCommentFindManyArgs>(args?: SelectSubset<T, BlogSubCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a BlogSubComment.
     * @param {BlogSubCommentCreateArgs} args - Arguments to create a BlogSubComment.
     * @example
     * // Create one BlogSubComment
     * const BlogSubComment = await prisma.blogSubComment.create({
     *   data: {
     *     // ... data to create a BlogSubComment
     *   }
     * })
     *
     */
    create<T extends BlogSubCommentCreateArgs>(args: SelectSubset<T, BlogSubCommentCreateArgs<ExtArgs>>): Prisma__BlogSubCommentClient<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BlogSubComments.
     * @param {BlogSubCommentCreateManyArgs} args - Arguments to create many BlogSubComments.
     * @example
     * // Create many BlogSubComments
     * const blogSubComment = await prisma.blogSubComment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BlogSubCommentCreateManyArgs>(args?: SelectSubset<T, BlogSubCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BlogSubComment.
     * @param {BlogSubCommentDeleteArgs} args - Arguments to delete one BlogSubComment.
     * @example
     * // Delete one BlogSubComment
     * const BlogSubComment = await prisma.blogSubComment.delete({
     *   where: {
     *     // ... filter to delete one BlogSubComment
     *   }
     * })
     *
     */
    delete<T extends BlogSubCommentDeleteArgs>(args: SelectSubset<T, BlogSubCommentDeleteArgs<ExtArgs>>): Prisma__BlogSubCommentClient<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BlogSubComment.
     * @param {BlogSubCommentUpdateArgs} args - Arguments to update one BlogSubComment.
     * @example
     * // Update one BlogSubComment
     * const blogSubComment = await prisma.blogSubComment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BlogSubCommentUpdateArgs>(args: SelectSubset<T, BlogSubCommentUpdateArgs<ExtArgs>>): Prisma__BlogSubCommentClient<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BlogSubComments.
     * @param {BlogSubCommentDeleteManyArgs} args - Arguments to filter BlogSubComments to delete.
     * @example
     * // Delete a few BlogSubComments
     * const { count } = await prisma.blogSubComment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BlogSubCommentDeleteManyArgs>(args?: SelectSubset<T, BlogSubCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BlogSubComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogSubCommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BlogSubComments
     * const blogSubComment = await prisma.blogSubComment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BlogSubCommentUpdateManyArgs>(args: SelectSubset<T, BlogSubCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BlogSubComment.
     * @param {BlogSubCommentUpsertArgs} args - Arguments to update or create a BlogSubComment.
     * @example
     * // Update or create a BlogSubComment
     * const blogSubComment = await prisma.blogSubComment.upsert({
     *   create: {
     *     // ... data to create a BlogSubComment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BlogSubComment we want to update
     *   }
     * })
     */
    upsert<T extends BlogSubCommentUpsertArgs>(args: SelectSubset<T, BlogSubCommentUpsertArgs<ExtArgs>>): Prisma__BlogSubCommentClient<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of BlogSubComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogSubCommentCountArgs} args - Arguments to filter BlogSubComments to count.
     * @example
     * // Count the number of BlogSubComments
     * const count = await prisma.blogSubComment.count({
     *   where: {
     *     // ... the filter for the BlogSubComments we want to count
     *   }
     * })
     */
    count<T extends BlogSubCommentCountArgs>(
      args?: Subset<T, BlogSubCommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlogSubCommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BlogSubComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogSubCommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends BlogSubCommentAggregateArgs>(args: Subset<T, BlogSubCommentAggregateArgs>): Prisma.PrismaPromise<GetBlogSubCommentAggregateType<T>>

    /**
     * Group by BlogSubComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogSubCommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends BlogSubCommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BlogSubCommentGroupByArgs['orderBy'] }
        : { orderBy?: BlogSubCommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, BlogSubCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogSubCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the BlogSubComment model
     */
    readonly fields: BlogSubCommentFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for BlogSubComment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BlogSubCommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    comment_info<T extends BlogCommentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BlogCommentDefaultArgs<ExtArgs>>): Prisma__BlogCommentClient<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user_info<T extends BlogSubComment$user_infoArgs<ExtArgs> = {}>(args?: Subset<T, BlogSubComment$user_infoArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    likes<T extends BlogSubComment$likesArgs<ExtArgs> = {}>(args?: Subset<T, BlogSubComment$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the BlogSubComment model
   */
  interface BlogSubCommentFieldRefs {
    readonly id: FieldRef<'BlogSubComment', 'String'>
    readonly content: FieldRef<'BlogSubComment', 'String'>
    readonly create_ts: FieldRef<'BlogSubComment', 'DateTime'>
    readonly updated_ts: FieldRef<'BlogSubComment', 'DateTime'>
    readonly comment_id: FieldRef<'BlogSubComment', 'String'>
    readonly reply_sub_comment_id: FieldRef<'BlogSubComment', 'String'>
    readonly user_id: FieldRef<'BlogSubComment', 'String'>
  }

  // Custom InputTypes
  /**
   * BlogSubComment findUnique
   */
  export interface BlogSubCommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    /**
     * Filter, which BlogSubComment to fetch.
     */
    where: BlogSubCommentWhereUniqueInput
  }

  /**
   * BlogSubComment findUniqueOrThrow
   */
  export interface BlogSubCommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    /**
     * Filter, which BlogSubComment to fetch.
     */
    where: BlogSubCommentWhereUniqueInput
  }

  /**
   * BlogSubComment findFirst
   */
  export interface BlogSubCommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    /**
     * Filter, which BlogSubComment to fetch.
     */
    where?: BlogSubCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogSubComments to fetch.
     */
    orderBy?: BlogSubCommentOrderByWithRelationInput | BlogSubCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BlogSubComments.
     */
    cursor?: BlogSubCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogSubComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogSubComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BlogSubComments.
     */
    distinct?: BlogSubCommentScalarFieldEnum | BlogSubCommentScalarFieldEnum[]
  }

  /**
   * BlogSubComment findFirstOrThrow
   */
  export interface BlogSubCommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    /**
     * Filter, which BlogSubComment to fetch.
     */
    where?: BlogSubCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogSubComments to fetch.
     */
    orderBy?: BlogSubCommentOrderByWithRelationInput | BlogSubCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BlogSubComments.
     */
    cursor?: BlogSubCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogSubComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogSubComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BlogSubComments.
     */
    distinct?: BlogSubCommentScalarFieldEnum | BlogSubCommentScalarFieldEnum[]
  }

  /**
   * BlogSubComment findMany
   */
  export interface BlogSubCommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    /**
     * Filter, which BlogSubComments to fetch.
     */
    where?: BlogSubCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogSubComments to fetch.
     */
    orderBy?: BlogSubCommentOrderByWithRelationInput | BlogSubCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing BlogSubComments.
     */
    cursor?: BlogSubCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogSubComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogSubComments.
     */
    skip?: number
    distinct?: BlogSubCommentScalarFieldEnum | BlogSubCommentScalarFieldEnum[]
  }

  /**
   * BlogSubComment create
   */
  export interface BlogSubCommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    /**
     * The data needed to create a BlogSubComment.
     */
    data: XOR<BlogSubCommentCreateInput, BlogSubCommentUncheckedCreateInput>
  }

  /**
   * BlogSubComment createMany
   */
  export interface BlogSubCommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many BlogSubComments.
     */
    data: BlogSubCommentCreateManyInput | BlogSubCommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BlogSubComment update
   */
  export interface BlogSubCommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    /**
     * The data needed to update a BlogSubComment.
     */
    data: XOR<BlogSubCommentUpdateInput, BlogSubCommentUncheckedUpdateInput>
    /**
     * Choose, which BlogSubComment to update.
     */
    where: BlogSubCommentWhereUniqueInput
  }

  /**
   * BlogSubComment updateMany
   */
  export interface BlogSubCommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update BlogSubComments.
     */
    data: XOR<BlogSubCommentUpdateManyMutationInput, BlogSubCommentUncheckedUpdateManyInput>
    /**
     * Filter which BlogSubComments to update
     */
    where?: BlogSubCommentWhereInput
    /**
     * Limit how many BlogSubComments to update.
     */
    limit?: number
  }

  /**
   * BlogSubComment upsert
   */
  export interface BlogSubCommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    /**
     * The filter to search for the BlogSubComment to update in case it exists.
     */
    where: BlogSubCommentWhereUniqueInput
    /**
     * In case the BlogSubComment found by the `where` argument doesn't exist, create a new BlogSubComment with this data.
     */
    create: XOR<BlogSubCommentCreateInput, BlogSubCommentUncheckedCreateInput>
    /**
     * In case the BlogSubComment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BlogSubCommentUpdateInput, BlogSubCommentUncheckedUpdateInput>
  }

  /**
   * BlogSubComment delete
   */
  export interface BlogSubCommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    /**
     * Filter which BlogSubComment to delete.
     */
    where: BlogSubCommentWhereUniqueInput
  }

  /**
   * BlogSubComment deleteMany
   */
  export interface BlogSubCommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which BlogSubComments to delete
     */
    where?: BlogSubCommentWhereInput
    /**
     * Limit how many BlogSubComments to delete.
     */
    limit?: number
  }

  /**
   * BlogSubComment.user_info
   */
  export interface BlogSubComment$user_infoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * BlogSubComment.likes
   */
  export interface BlogSubComment$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    where?: BlogLikeWhereInput
    orderBy?: BlogLikeOrderByWithRelationInput | BlogLikeOrderByWithRelationInput[]
    cursor?: BlogLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogLikeScalarFieldEnum | BlogLikeScalarFieldEnum[]
  }

  /**
   * BlogSubComment without action
   */
  export interface BlogSubCommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
  }

  /**
   * Model BlogLike
   */

  export interface AggregateBlogLike {
    _count: BlogLikeCountAggregateOutputType | null
    _avg: BlogLikeAvgAggregateOutputType | null
    _sum: BlogLikeSumAggregateOutputType | null
    _min: BlogLikeMinAggregateOutputType | null
    _max: BlogLikeMaxAggregateOutputType | null
  }

  export interface BlogLikeAvgAggregateOutputType {
    id: number | null
  }

  export interface BlogLikeSumAggregateOutputType {
    id: number | null
  }

  export interface BlogLikeMinAggregateOutputType {
    id: number | null
    create_ts: Date | null
    updated_ts: Date | null
    target: string | null
    article_id: string | null
    sub_comment_id: string | null
    comment_id: string | null
    user_id: string | null
    blogMemoId: string | null
  }

  export interface BlogLikeMaxAggregateOutputType {
    id: number | null
    create_ts: Date | null
    updated_ts: Date | null
    target: string | null
    article_id: string | null
    sub_comment_id: string | null
    comment_id: string | null
    user_id: string | null
    blogMemoId: string | null
  }

  export interface BlogLikeCountAggregateOutputType {
    id: number
    create_ts: number
    updated_ts: number
    target: number
    article_id: number
    sub_comment_id: number
    comment_id: number
    user_id: number
    blogMemoId: number
    _all: number
  }

  export interface BlogLikeAvgAggregateInputType {
    id?: true
  }

  export interface BlogLikeSumAggregateInputType {
    id?: true
  }

  export interface BlogLikeMinAggregateInputType {
    id?: true
    create_ts?: true
    updated_ts?: true
    target?: true
    article_id?: true
    sub_comment_id?: true
    comment_id?: true
    user_id?: true
    blogMemoId?: true
  }

  export interface BlogLikeMaxAggregateInputType {
    id?: true
    create_ts?: true
    updated_ts?: true
    target?: true
    article_id?: true
    sub_comment_id?: true
    comment_id?: true
    user_id?: true
    blogMemoId?: true
  }

  export interface BlogLikeCountAggregateInputType {
    id?: true
    create_ts?: true
    updated_ts?: true
    target?: true
    article_id?: true
    sub_comment_id?: true
    comment_id?: true
    user_id?: true
    blogMemoId?: true
    _all?: true
  }

  export interface BlogLikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which BlogLike to aggregate.
     */
    where?: BlogLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogLikes to fetch.
     */
    orderBy?: BlogLikeOrderByWithRelationInput | BlogLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: BlogLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned BlogLikes
     */
    _count?: true | BlogLikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     */
    _avg?: BlogLikeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     */
    _sum?: BlogLikeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: BlogLikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: BlogLikeMaxAggregateInputType
  }

  export type GetBlogLikeAggregateType<T extends BlogLikeAggregateArgs> = {
    [P in keyof T & keyof AggregateBlogLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlogLike[P]>
      : GetScalarType<T[P], AggregateBlogLike[P]>
  }

  export interface BlogLikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogLikeWhereInput
    orderBy?: BlogLikeOrderByWithAggregationInput | BlogLikeOrderByWithAggregationInput[]
    by: BlogLikeScalarFieldEnum[] | BlogLikeScalarFieldEnum
    having?: BlogLikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlogLikeCountAggregateInputType | true
    _avg?: BlogLikeAvgAggregateInputType
    _sum?: BlogLikeSumAggregateInputType
    _min?: BlogLikeMinAggregateInputType
    _max?: BlogLikeMaxAggregateInputType
  }

  export interface BlogLikeGroupByOutputType {
    id: number
    create_ts: Date
    updated_ts: Date
    target: string
    article_id: string | null
    sub_comment_id: string | null
    comment_id: string | null
    user_id: string
    blogMemoId: string | null
    _count: BlogLikeCountAggregateOutputType | null
    _avg: BlogLikeAvgAggregateOutputType | null
    _sum: BlogLikeSumAggregateOutputType | null
    _min: BlogLikeMinAggregateOutputType | null
    _max: BlogLikeMaxAggregateOutputType | null
  }

  type GetBlogLikeGroupByPayload<T extends BlogLikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlogLikeGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof BlogLikeGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], BlogLikeGroupByOutputType[P]>
          : GetScalarType<T[P], BlogLikeGroupByOutputType[P]>
      }
      >
    >

  export type BlogLikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    target?: boolean
    article_id?: boolean
    sub_comment_id?: boolean
    comment_id?: boolean
    user_id?: boolean
    blogMemoId?: boolean
    sub_comment_info?: boolean | BlogLike$sub_comment_infoArgs<ExtArgs>
    comment_info?: boolean | BlogLike$comment_infoArgs<ExtArgs>
    user_info?: boolean | UserDefaultArgs<ExtArgs>
    blogMemoInfo?: boolean | BlogLike$blogMemoInfoArgs<ExtArgs>
  }, ExtArgs['result']['blogLike']>

  export interface BlogLikeSelectScalar {
    id?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    target?: boolean
    article_id?: boolean
    sub_comment_id?: boolean
    comment_id?: boolean
    user_id?: boolean
    blogMemoId?: boolean
  }

  export type BlogLikeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'create_ts' | 'updated_ts' | 'target' | 'article_id' | 'sub_comment_id' | 'comment_id' | 'user_id' | 'blogMemoId', ExtArgs['result']['blogLike']>
  export interface BlogLikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    sub_comment_info?: boolean | BlogLike$sub_comment_infoArgs<ExtArgs>
    comment_info?: boolean | BlogLike$comment_infoArgs<ExtArgs>
    user_info?: boolean | UserDefaultArgs<ExtArgs>
    blogMemoInfo?: boolean | BlogLike$blogMemoInfoArgs<ExtArgs>
  }

  export interface $BlogLikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'BlogLike'
    objects: {
      sub_comment_info: Prisma.$BlogSubCommentPayload<ExtArgs> | null
      comment_info: Prisma.$BlogCommentPayload<ExtArgs> | null
      user_info: Prisma.$UserPayload<ExtArgs>
      blogMemoInfo: Prisma.$BlogMemoPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      create_ts: Date
      updated_ts: Date
      target: string
      article_id: string | null
      sub_comment_id: string | null
      comment_id: string | null
      user_id: string
      blogMemoId: string | null
    }, ExtArgs['result']['blogLike']>
    composites: {}
  }

  type BlogLikeGetPayload<S extends boolean | null | undefined | BlogLikeDefaultArgs> = $Result.GetResult<Prisma.$BlogLikePayload, S>

  type BlogLikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<BlogLikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BlogLikeCountAggregateInputType | true
    }

  export interface BlogLikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BlogLike'], meta: { name: 'BlogLike' } }
    /**
     * Find zero or one BlogLike that matches the filter.
     * @param {BlogLikeFindUniqueArgs} args - Arguments to find a BlogLike
     * @example
     * // Get one BlogLike
     * const blogLike = await prisma.blogLike.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BlogLikeFindUniqueArgs>(args: SelectSubset<T, BlogLikeFindUniqueArgs<ExtArgs>>): Prisma__BlogLikeClient<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BlogLike that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BlogLikeFindUniqueOrThrowArgs} args - Arguments to find a BlogLike
     * @example
     * // Get one BlogLike
     * const blogLike = await prisma.blogLike.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BlogLikeFindUniqueOrThrowArgs>(args: SelectSubset<T, BlogLikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BlogLikeClient<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogLike that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogLikeFindFirstArgs} args - Arguments to find a BlogLike
     * @example
     * // Get one BlogLike
     * const blogLike = await prisma.blogLike.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BlogLikeFindFirstArgs>(args?: SelectSubset<T, BlogLikeFindFirstArgs<ExtArgs>>): Prisma__BlogLikeClient<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogLike that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogLikeFindFirstOrThrowArgs} args - Arguments to find a BlogLike
     * @example
     * // Get one BlogLike
     * const blogLike = await prisma.blogLike.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BlogLikeFindFirstOrThrowArgs>(args?: SelectSubset<T, BlogLikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__BlogLikeClient<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BlogLikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogLikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BlogLikes
     * const blogLikes = await prisma.blogLike.findMany()
     *
     * // Get first 10 BlogLikes
     * const blogLikes = await prisma.blogLike.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const blogLikeWithIdOnly = await prisma.blogLike.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BlogLikeFindManyArgs>(args?: SelectSubset<T, BlogLikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a BlogLike.
     * @param {BlogLikeCreateArgs} args - Arguments to create a BlogLike.
     * @example
     * // Create one BlogLike
     * const BlogLike = await prisma.blogLike.create({
     *   data: {
     *     // ... data to create a BlogLike
     *   }
     * })
     *
     */
    create<T extends BlogLikeCreateArgs>(args: SelectSubset<T, BlogLikeCreateArgs<ExtArgs>>): Prisma__BlogLikeClient<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BlogLikes.
     * @param {BlogLikeCreateManyArgs} args - Arguments to create many BlogLikes.
     * @example
     * // Create many BlogLikes
     * const blogLike = await prisma.blogLike.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BlogLikeCreateManyArgs>(args?: SelectSubset<T, BlogLikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BlogLike.
     * @param {BlogLikeDeleteArgs} args - Arguments to delete one BlogLike.
     * @example
     * // Delete one BlogLike
     * const BlogLike = await prisma.blogLike.delete({
     *   where: {
     *     // ... filter to delete one BlogLike
     *   }
     * })
     *
     */
    delete<T extends BlogLikeDeleteArgs>(args: SelectSubset<T, BlogLikeDeleteArgs<ExtArgs>>): Prisma__BlogLikeClient<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BlogLike.
     * @param {BlogLikeUpdateArgs} args - Arguments to update one BlogLike.
     * @example
     * // Update one BlogLike
     * const blogLike = await prisma.blogLike.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BlogLikeUpdateArgs>(args: SelectSubset<T, BlogLikeUpdateArgs<ExtArgs>>): Prisma__BlogLikeClient<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BlogLikes.
     * @param {BlogLikeDeleteManyArgs} args - Arguments to filter BlogLikes to delete.
     * @example
     * // Delete a few BlogLikes
     * const { count } = await prisma.blogLike.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BlogLikeDeleteManyArgs>(args?: SelectSubset<T, BlogLikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BlogLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogLikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BlogLikes
     * const blogLike = await prisma.blogLike.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BlogLikeUpdateManyArgs>(args: SelectSubset<T, BlogLikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BlogLike.
     * @param {BlogLikeUpsertArgs} args - Arguments to update or create a BlogLike.
     * @example
     * // Update or create a BlogLike
     * const blogLike = await prisma.blogLike.upsert({
     *   create: {
     *     // ... data to create a BlogLike
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BlogLike we want to update
     *   }
     * })
     */
    upsert<T extends BlogLikeUpsertArgs>(args: SelectSubset<T, BlogLikeUpsertArgs<ExtArgs>>): Prisma__BlogLikeClient<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of BlogLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogLikeCountArgs} args - Arguments to filter BlogLikes to count.
     * @example
     * // Count the number of BlogLikes
     * const count = await prisma.blogLike.count({
     *   where: {
     *     // ... the filter for the BlogLikes we want to count
     *   }
     * })
     */
    count<T extends BlogLikeCountArgs>(
      args?: Subset<T, BlogLikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlogLikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BlogLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogLikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends BlogLikeAggregateArgs>(args: Subset<T, BlogLikeAggregateArgs>): Prisma.PrismaPromise<GetBlogLikeAggregateType<T>>

    /**
     * Group by BlogLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogLikeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends BlogLikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BlogLikeGroupByArgs['orderBy'] }
        : { orderBy?: BlogLikeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, BlogLikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the BlogLike model
     */
    readonly fields: BlogLikeFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for BlogLike.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BlogLikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    sub_comment_info<T extends BlogLike$sub_comment_infoArgs<ExtArgs> = {}>(args?: Subset<T, BlogLike$sub_comment_infoArgs<ExtArgs>>): Prisma__BlogSubCommentClient<$Result.GetResult<Prisma.$BlogSubCommentPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    comment_info<T extends BlogLike$comment_infoArgs<ExtArgs> = {}>(args?: Subset<T, BlogLike$comment_infoArgs<ExtArgs>>): Prisma__BlogCommentClient<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user_info<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    blogMemoInfo<T extends BlogLike$blogMemoInfoArgs<ExtArgs> = {}>(args?: Subset<T, BlogLike$blogMemoInfoArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the BlogLike model
   */
  interface BlogLikeFieldRefs {
    readonly id: FieldRef<'BlogLike', 'Int'>
    readonly create_ts: FieldRef<'BlogLike', 'DateTime'>
    readonly updated_ts: FieldRef<'BlogLike', 'DateTime'>
    readonly target: FieldRef<'BlogLike', 'String'>
    readonly article_id: FieldRef<'BlogLike', 'String'>
    readonly sub_comment_id: FieldRef<'BlogLike', 'String'>
    readonly comment_id: FieldRef<'BlogLike', 'String'>
    readonly user_id: FieldRef<'BlogLike', 'String'>
    readonly blogMemoId: FieldRef<'BlogLike', 'String'>
  }

  // Custom InputTypes
  /**
   * BlogLike findUnique
   */
  export interface BlogLikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    /**
     * Filter, which BlogLike to fetch.
     */
    where: BlogLikeWhereUniqueInput
  }

  /**
   * BlogLike findUniqueOrThrow
   */
  export interface BlogLikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    /**
     * Filter, which BlogLike to fetch.
     */
    where: BlogLikeWhereUniqueInput
  }

  /**
   * BlogLike findFirst
   */
  export interface BlogLikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    /**
     * Filter, which BlogLike to fetch.
     */
    where?: BlogLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogLikes to fetch.
     */
    orderBy?: BlogLikeOrderByWithRelationInput | BlogLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BlogLikes.
     */
    cursor?: BlogLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BlogLikes.
     */
    distinct?: BlogLikeScalarFieldEnum | BlogLikeScalarFieldEnum[]
  }

  /**
   * BlogLike findFirstOrThrow
   */
  export interface BlogLikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    /**
     * Filter, which BlogLike to fetch.
     */
    where?: BlogLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogLikes to fetch.
     */
    orderBy?: BlogLikeOrderByWithRelationInput | BlogLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BlogLikes.
     */
    cursor?: BlogLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BlogLikes.
     */
    distinct?: BlogLikeScalarFieldEnum | BlogLikeScalarFieldEnum[]
  }

  /**
   * BlogLike findMany
   */
  export interface BlogLikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    /**
     * Filter, which BlogLikes to fetch.
     */
    where?: BlogLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogLikes to fetch.
     */
    orderBy?: BlogLikeOrderByWithRelationInput | BlogLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing BlogLikes.
     */
    cursor?: BlogLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogLikes.
     */
    skip?: number
    distinct?: BlogLikeScalarFieldEnum | BlogLikeScalarFieldEnum[]
  }

  /**
   * BlogLike create
   */
  export interface BlogLikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    /**
     * The data needed to create a BlogLike.
     */
    data: XOR<BlogLikeCreateInput, BlogLikeUncheckedCreateInput>
  }

  /**
   * BlogLike createMany
   */
  export interface BlogLikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many BlogLikes.
     */
    data: BlogLikeCreateManyInput | BlogLikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BlogLike update
   */
  export interface BlogLikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    /**
     * The data needed to update a BlogLike.
     */
    data: XOR<BlogLikeUpdateInput, BlogLikeUncheckedUpdateInput>
    /**
     * Choose, which BlogLike to update.
     */
    where: BlogLikeWhereUniqueInput
  }

  /**
   * BlogLike updateMany
   */
  export interface BlogLikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update BlogLikes.
     */
    data: XOR<BlogLikeUpdateManyMutationInput, BlogLikeUncheckedUpdateManyInput>
    /**
     * Filter which BlogLikes to update
     */
    where?: BlogLikeWhereInput
    /**
     * Limit how many BlogLikes to update.
     */
    limit?: number
  }

  /**
   * BlogLike upsert
   */
  export interface BlogLikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    /**
     * The filter to search for the BlogLike to update in case it exists.
     */
    where: BlogLikeWhereUniqueInput
    /**
     * In case the BlogLike found by the `where` argument doesn't exist, create a new BlogLike with this data.
     */
    create: XOR<BlogLikeCreateInput, BlogLikeUncheckedCreateInput>
    /**
     * In case the BlogLike was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BlogLikeUpdateInput, BlogLikeUncheckedUpdateInput>
  }

  /**
   * BlogLike delete
   */
  export interface BlogLikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    /**
     * Filter which BlogLike to delete.
     */
    where: BlogLikeWhereUniqueInput
  }

  /**
   * BlogLike deleteMany
   */
  export interface BlogLikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which BlogLikes to delete
     */
    where?: BlogLikeWhereInput
    /**
     * Limit how many BlogLikes to delete.
     */
    limit?: number
  }

  /**
   * BlogLike.sub_comment_info
   */
  export interface BlogLike$sub_comment_infoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogSubComment
     */
    select?: BlogSubCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogSubComment
     */
    omit?: BlogSubCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogSubCommentInclude<ExtArgs> | null
    where?: BlogSubCommentWhereInput
  }

  /**
   * BlogLike.comment_info
   */
  export interface BlogLike$comment_infoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    where?: BlogCommentWhereInput
  }

  /**
   * BlogLike.blogMemoInfo
   */
  export interface BlogLike$blogMemoInfoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    where?: BlogMemoWhereInput
  }

  /**
   * BlogLike without action
   */
  export interface BlogLikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
  }

  /**
   * Model BlogMemo
   */

  export interface AggregateBlogMemo {
    _count: BlogMemoCountAggregateOutputType | null
    _min: BlogMemoMinAggregateOutputType | null
    _max: BlogMemoMaxAggregateOutputType | null
  }

  export interface BlogMemoMinAggregateOutputType {
    id: string | null
    content: string | null
    create_ts: Date | null
    updated_ts: Date | null
    visible: string | null
    defalt_floded: boolean | null
    flod_tip: string | null
    user_id: string | null
    from: string | null
    courier: string | null
  }

  export interface BlogMemoMaxAggregateOutputType {
    id: string | null
    content: string | null
    create_ts: Date | null
    updated_ts: Date | null
    visible: string | null
    defalt_floded: boolean | null
    flod_tip: string | null
    user_id: string | null
    from: string | null
    courier: string | null
  }

  export interface BlogMemoCountAggregateOutputType {
    id: number
    content: number
    create_ts: number
    updated_ts: number
    visible: number
    defalt_floded: number
    flod_tip: number
    user_id: number
    from: number
    courier: number
    _all: number
  }

  export interface BlogMemoMinAggregateInputType {
    id?: true
    content?: true
    create_ts?: true
    updated_ts?: true
    visible?: true
    defalt_floded?: true
    flod_tip?: true
    user_id?: true
    from?: true
    courier?: true
  }

  export interface BlogMemoMaxAggregateInputType {
    id?: true
    content?: true
    create_ts?: true
    updated_ts?: true
    visible?: true
    defalt_floded?: true
    flod_tip?: true
    user_id?: true
    from?: true
    courier?: true
  }

  export interface BlogMemoCountAggregateInputType {
    id?: true
    content?: true
    create_ts?: true
    updated_ts?: true
    visible?: true
    defalt_floded?: true
    flod_tip?: true
    user_id?: true
    from?: true
    courier?: true
    _all?: true
  }

  export interface BlogMemoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which BlogMemo to aggregate.
     */
    where?: BlogMemoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogMemos to fetch.
     */
    orderBy?: BlogMemoOrderByWithRelationInput | BlogMemoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: BlogMemoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogMemos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogMemos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned BlogMemos
     */
    _count?: true | BlogMemoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: BlogMemoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: BlogMemoMaxAggregateInputType
  }

  export type GetBlogMemoAggregateType<T extends BlogMemoAggregateArgs> = {
    [P in keyof T & keyof AggregateBlogMemo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlogMemo[P]>
      : GetScalarType<T[P], AggregateBlogMemo[P]>
  }

  export interface BlogMemoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: BlogMemoWhereInput
    orderBy?: BlogMemoOrderByWithAggregationInput | BlogMemoOrderByWithAggregationInput[]
    by: BlogMemoScalarFieldEnum[] | BlogMemoScalarFieldEnum
    having?: BlogMemoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlogMemoCountAggregateInputType | true
    _min?: BlogMemoMinAggregateInputType
    _max?: BlogMemoMaxAggregateInputType
  }

  export interface BlogMemoGroupByOutputType {
    id: string
    content: string | null
    create_ts: Date
    updated_ts: Date
    visible: string
    defalt_floded: boolean
    flod_tip: string | null
    user_id: string
    from: string | null
    courier: string | null
    _count: BlogMemoCountAggregateOutputType | null
    _min: BlogMemoMinAggregateOutputType | null
    _max: BlogMemoMaxAggregateOutputType | null
  }

  type GetBlogMemoGroupByPayload<T extends BlogMemoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlogMemoGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof BlogMemoGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], BlogMemoGroupByOutputType[P]>
          : GetScalarType<T[P], BlogMemoGroupByOutputType[P]>
      }
      >
    >

  export type BlogMemoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    visible?: boolean
    defalt_floded?: boolean
    flod_tip?: boolean
    user_id?: boolean
    from?: boolean
    courier?: boolean
    user_info?: boolean | UserDefaultArgs<ExtArgs>
    tags?: boolean | BlogMemo$tagsArgs<ExtArgs>
    comments?: boolean | BlogMemo$commentsArgs<ExtArgs>
    likes?: boolean | BlogMemo$likesArgs<ExtArgs>
    _count?: boolean | BlogMemoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs['result']['blogMemo']>

  export interface BlogMemoSelectScalar {
    id?: boolean
    content?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    visible?: boolean
    defalt_floded?: boolean
    flod_tip?: boolean
    user_id?: boolean
    from?: boolean
    courier?: boolean
  }

  export type BlogMemoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'content' | 'create_ts' | 'updated_ts' | 'visible' | 'defalt_floded' | 'flod_tip' | 'user_id' | 'from' | 'courier', ExtArgs['result']['blogMemo']>
  export interface BlogMemoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    user_info?: boolean | UserDefaultArgs<ExtArgs>
    tags?: boolean | BlogMemo$tagsArgs<ExtArgs>
    comments?: boolean | BlogMemo$commentsArgs<ExtArgs>
    likes?: boolean | BlogMemo$likesArgs<ExtArgs>
    _count?: boolean | BlogMemoCountOutputTypeDefaultArgs<ExtArgs>
  }

  export interface $BlogMemoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'BlogMemo'
    objects: {
      user_info: Prisma.$UserPayload<ExtArgs>
      tags: Prisma.$MemoTagRelationsPayload<ExtArgs>[]
      comments: Prisma.$BlogCommentPayload<ExtArgs>[]
      likes: Prisma.$BlogLikePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string | null
      create_ts: Date
      updated_ts: Date
      visible: string
      defalt_floded: boolean
      flod_tip: string | null
      user_id: string
      from: string | null
      courier: string | null
    }, ExtArgs['result']['blogMemo']>
    composites: {}
  }

  type BlogMemoGetPayload<S extends boolean | null | undefined | BlogMemoDefaultArgs> = $Result.GetResult<Prisma.$BlogMemoPayload, S>

  type BlogMemoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<BlogMemoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BlogMemoCountAggregateInputType | true
    }

  export interface BlogMemoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BlogMemo'], meta: { name: 'BlogMemo' } }
    /**
     * Find zero or one BlogMemo that matches the filter.
     * @param {BlogMemoFindUniqueArgs} args - Arguments to find a BlogMemo
     * @example
     * // Get one BlogMemo
     * const blogMemo = await prisma.blogMemo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BlogMemoFindUniqueArgs>(args: SelectSubset<T, BlogMemoFindUniqueArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BlogMemo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BlogMemoFindUniqueOrThrowArgs} args - Arguments to find a BlogMemo
     * @example
     * // Get one BlogMemo
     * const blogMemo = await prisma.blogMemo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BlogMemoFindUniqueOrThrowArgs>(args: SelectSubset<T, BlogMemoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogMemo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogMemoFindFirstArgs} args - Arguments to find a BlogMemo
     * @example
     * // Get one BlogMemo
     * const blogMemo = await prisma.blogMemo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BlogMemoFindFirstArgs>(args?: SelectSubset<T, BlogMemoFindFirstArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogMemo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogMemoFindFirstOrThrowArgs} args - Arguments to find a BlogMemo
     * @example
     * // Get one BlogMemo
     * const blogMemo = await prisma.blogMemo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BlogMemoFindFirstOrThrowArgs>(args?: SelectSubset<T, BlogMemoFindFirstOrThrowArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BlogMemos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogMemoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BlogMemos
     * const blogMemos = await prisma.blogMemo.findMany()
     *
     * // Get first 10 BlogMemos
     * const blogMemos = await prisma.blogMemo.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const blogMemoWithIdOnly = await prisma.blogMemo.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BlogMemoFindManyArgs>(args?: SelectSubset<T, BlogMemoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a BlogMemo.
     * @param {BlogMemoCreateArgs} args - Arguments to create a BlogMemo.
     * @example
     * // Create one BlogMemo
     * const BlogMemo = await prisma.blogMemo.create({
     *   data: {
     *     // ... data to create a BlogMemo
     *   }
     * })
     *
     */
    create<T extends BlogMemoCreateArgs>(args: SelectSubset<T, BlogMemoCreateArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BlogMemos.
     * @param {BlogMemoCreateManyArgs} args - Arguments to create many BlogMemos.
     * @example
     * // Create many BlogMemos
     * const blogMemo = await prisma.blogMemo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BlogMemoCreateManyArgs>(args?: SelectSubset<T, BlogMemoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BlogMemo.
     * @param {BlogMemoDeleteArgs} args - Arguments to delete one BlogMemo.
     * @example
     * // Delete one BlogMemo
     * const BlogMemo = await prisma.blogMemo.delete({
     *   where: {
     *     // ... filter to delete one BlogMemo
     *   }
     * })
     *
     */
    delete<T extends BlogMemoDeleteArgs>(args: SelectSubset<T, BlogMemoDeleteArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BlogMemo.
     * @param {BlogMemoUpdateArgs} args - Arguments to update one BlogMemo.
     * @example
     * // Update one BlogMemo
     * const blogMemo = await prisma.blogMemo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BlogMemoUpdateArgs>(args: SelectSubset<T, BlogMemoUpdateArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BlogMemos.
     * @param {BlogMemoDeleteManyArgs} args - Arguments to filter BlogMemos to delete.
     * @example
     * // Delete a few BlogMemos
     * const { count } = await prisma.blogMemo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BlogMemoDeleteManyArgs>(args?: SelectSubset<T, BlogMemoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BlogMemos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogMemoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BlogMemos
     * const blogMemo = await prisma.blogMemo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BlogMemoUpdateManyArgs>(args: SelectSubset<T, BlogMemoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BlogMemo.
     * @param {BlogMemoUpsertArgs} args - Arguments to update or create a BlogMemo.
     * @example
     * // Update or create a BlogMemo
     * const blogMemo = await prisma.blogMemo.upsert({
     *   create: {
     *     // ... data to create a BlogMemo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BlogMemo we want to update
     *   }
     * })
     */
    upsert<T extends BlogMemoUpsertArgs>(args: SelectSubset<T, BlogMemoUpsertArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of BlogMemos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogMemoCountArgs} args - Arguments to filter BlogMemos to count.
     * @example
     * // Count the number of BlogMemos
     * const count = await prisma.blogMemo.count({
     *   where: {
     *     // ... the filter for the BlogMemos we want to count
     *   }
     * })
     */
    count<T extends BlogMemoCountArgs>(
      args?: Subset<T, BlogMemoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlogMemoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BlogMemo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogMemoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends BlogMemoAggregateArgs>(args: Subset<T, BlogMemoAggregateArgs>): Prisma.PrismaPromise<GetBlogMemoAggregateType<T>>

    /**
     * Group by BlogMemo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogMemoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends BlogMemoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BlogMemoGroupByArgs['orderBy'] }
        : { orderBy?: BlogMemoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, BlogMemoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogMemoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the BlogMemo model
     */
    readonly fields: BlogMemoFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for BlogMemo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BlogMemoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user_info<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tags<T extends BlogMemo$tagsArgs<ExtArgs> = {}>(args?: Subset<T, BlogMemo$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    comments<T extends BlogMemo$commentsArgs<ExtArgs> = {}>(args?: Subset<T, BlogMemo$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogCommentPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    likes<T extends BlogMemo$likesArgs<ExtArgs> = {}>(args?: Subset<T, BlogMemo$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogLikePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the BlogMemo model
   */
  interface BlogMemoFieldRefs {
    readonly id: FieldRef<'BlogMemo', 'String'>
    readonly content: FieldRef<'BlogMemo', 'String'>
    readonly create_ts: FieldRef<'BlogMemo', 'DateTime'>
    readonly updated_ts: FieldRef<'BlogMemo', 'DateTime'>
    readonly visible: FieldRef<'BlogMemo', 'String'>
    readonly defalt_floded: FieldRef<'BlogMemo', 'Boolean'>
    readonly flod_tip: FieldRef<'BlogMemo', 'String'>
    readonly user_id: FieldRef<'BlogMemo', 'String'>
    readonly from: FieldRef<'BlogMemo', 'String'>
    readonly courier: FieldRef<'BlogMemo', 'String'>
  }

  // Custom InputTypes
  /**
   * BlogMemo findUnique
   */
  export interface BlogMemoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    /**
     * Filter, which BlogMemo to fetch.
     */
    where: BlogMemoWhereUniqueInput
  }

  /**
   * BlogMemo findUniqueOrThrow
   */
  export interface BlogMemoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    /**
     * Filter, which BlogMemo to fetch.
     */
    where: BlogMemoWhereUniqueInput
  }

  /**
   * BlogMemo findFirst
   */
  export interface BlogMemoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    /**
     * Filter, which BlogMemo to fetch.
     */
    where?: BlogMemoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogMemos to fetch.
     */
    orderBy?: BlogMemoOrderByWithRelationInput | BlogMemoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BlogMemos.
     */
    cursor?: BlogMemoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogMemos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogMemos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BlogMemos.
     */
    distinct?: BlogMemoScalarFieldEnum | BlogMemoScalarFieldEnum[]
  }

  /**
   * BlogMemo findFirstOrThrow
   */
  export interface BlogMemoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    /**
     * Filter, which BlogMemo to fetch.
     */
    where?: BlogMemoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogMemos to fetch.
     */
    orderBy?: BlogMemoOrderByWithRelationInput | BlogMemoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BlogMemos.
     */
    cursor?: BlogMemoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogMemos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogMemos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BlogMemos.
     */
    distinct?: BlogMemoScalarFieldEnum | BlogMemoScalarFieldEnum[]
  }

  /**
   * BlogMemo findMany
   */
  export interface BlogMemoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    /**
     * Filter, which BlogMemos to fetch.
     */
    where?: BlogMemoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BlogMemos to fetch.
     */
    orderBy?: BlogMemoOrderByWithRelationInput | BlogMemoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing BlogMemos.
     */
    cursor?: BlogMemoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BlogMemos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BlogMemos.
     */
    skip?: number
    distinct?: BlogMemoScalarFieldEnum | BlogMemoScalarFieldEnum[]
  }

  /**
   * BlogMemo create
   */
  export interface BlogMemoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    /**
     * The data needed to create a BlogMemo.
     */
    data: XOR<BlogMemoCreateInput, BlogMemoUncheckedCreateInput>
  }

  /**
   * BlogMemo createMany
   */
  export interface BlogMemoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many BlogMemos.
     */
    data: BlogMemoCreateManyInput | BlogMemoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BlogMemo update
   */
  export interface BlogMemoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    /**
     * The data needed to update a BlogMemo.
     */
    data: XOR<BlogMemoUpdateInput, BlogMemoUncheckedUpdateInput>
    /**
     * Choose, which BlogMemo to update.
     */
    where: BlogMemoWhereUniqueInput
  }

  /**
   * BlogMemo updateMany
   */
  export interface BlogMemoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update BlogMemos.
     */
    data: XOR<BlogMemoUpdateManyMutationInput, BlogMemoUncheckedUpdateManyInput>
    /**
     * Filter which BlogMemos to update
     */
    where?: BlogMemoWhereInput
    /**
     * Limit how many BlogMemos to update.
     */
    limit?: number
  }

  /**
   * BlogMemo upsert
   */
  export interface BlogMemoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    /**
     * The filter to search for the BlogMemo to update in case it exists.
     */
    where: BlogMemoWhereUniqueInput
    /**
     * In case the BlogMemo found by the `where` argument doesn't exist, create a new BlogMemo with this data.
     */
    create: XOR<BlogMemoCreateInput, BlogMemoUncheckedCreateInput>
    /**
     * In case the BlogMemo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BlogMemoUpdateInput, BlogMemoUncheckedUpdateInput>
  }

  /**
   * BlogMemo delete
   */
  export interface BlogMemoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
    /**
     * Filter which BlogMemo to delete.
     */
    where: BlogMemoWhereUniqueInput
  }

  /**
   * BlogMemo deleteMany
   */
  export interface BlogMemoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which BlogMemos to delete
     */
    where?: BlogMemoWhereInput
    /**
     * Limit how many BlogMemos to delete.
     */
    limit?: number
  }

  /**
   * BlogMemo.tags
   */
  export interface BlogMemo$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    where?: MemoTagRelationsWhereInput
    orderBy?: MemoTagRelationsOrderByWithRelationInput | MemoTagRelationsOrderByWithRelationInput[]
    cursor?: MemoTagRelationsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemoTagRelationsScalarFieldEnum | MemoTagRelationsScalarFieldEnum[]
  }

  /**
   * BlogMemo.comments
   */
  export interface BlogMemo$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogComment
     */
    select?: BlogCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogComment
     */
    omit?: BlogCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogCommentInclude<ExtArgs> | null
    where?: BlogCommentWhereInput
    orderBy?: BlogCommentOrderByWithRelationInput | BlogCommentOrderByWithRelationInput[]
    cursor?: BlogCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogCommentScalarFieldEnum | BlogCommentScalarFieldEnum[]
  }

  /**
   * BlogMemo.likes
   */
  export interface BlogMemo$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogLike
     */
    select?: BlogLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogLike
     */
    omit?: BlogLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogLikeInclude<ExtArgs> | null
    where?: BlogLikeWhereInput
    orderBy?: BlogLikeOrderByWithRelationInput | BlogLikeOrderByWithRelationInput[]
    cursor?: BlogLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BlogLikeScalarFieldEnum | BlogLikeScalarFieldEnum[]
  }

  /**
   * BlogMemo without action
   */
  export interface BlogMemoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the BlogMemo
     */
    select?: BlogMemoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogMemo
     */
    omit?: BlogMemoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogMemoInclude<ExtArgs> | null
  }

  /**
   * Model MemoTag
   */

  export interface AggregateMemoTag {
    _count: MemoTagCountAggregateOutputType | null
    _min: MemoTagMinAggregateOutputType | null
    _max: MemoTagMaxAggregateOutputType | null
  }

  export interface MemoTagMinAggregateOutputType {
    id: string | null
    tag_name: string | null
    create_ts: Date | null
    updated_ts: Date | null
    user_id: string | null
  }

  export interface MemoTagMaxAggregateOutputType {
    id: string | null
    tag_name: string | null
    create_ts: Date | null
    updated_ts: Date | null
    user_id: string | null
  }

  export interface MemoTagCountAggregateOutputType {
    id: number
    tag_name: number
    create_ts: number
    updated_ts: number
    user_id: number
    _all: number
  }

  export interface MemoTagMinAggregateInputType {
    id?: true
    tag_name?: true
    create_ts?: true
    updated_ts?: true
    user_id?: true
  }

  export interface MemoTagMaxAggregateInputType {
    id?: true
    tag_name?: true
    create_ts?: true
    updated_ts?: true
    user_id?: true
  }

  export interface MemoTagCountAggregateInputType {
    id?: true
    tag_name?: true
    create_ts?: true
    updated_ts?: true
    user_id?: true
    _all?: true
  }

  export interface MemoTagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which MemoTag to aggregate.
     */
    where?: MemoTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MemoTags to fetch.
     */
    orderBy?: MemoTagOrderByWithRelationInput | MemoTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: MemoTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MemoTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MemoTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MemoTags
     */
    _count?: true | MemoTagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: MemoTagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: MemoTagMaxAggregateInputType
  }

  export type GetMemoTagAggregateType<T extends MemoTagAggregateArgs> = {
    [P in keyof T & keyof AggregateMemoTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMemoTag[P]>
      : GetScalarType<T[P], AggregateMemoTag[P]>
  }

  export interface MemoTagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: MemoTagWhereInput
    orderBy?: MemoTagOrderByWithAggregationInput | MemoTagOrderByWithAggregationInput[]
    by: MemoTagScalarFieldEnum[] | MemoTagScalarFieldEnum
    having?: MemoTagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MemoTagCountAggregateInputType | true
    _min?: MemoTagMinAggregateInputType
    _max?: MemoTagMaxAggregateInputType
  }

  export interface MemoTagGroupByOutputType {
    id: string
    tag_name: string
    create_ts: Date
    updated_ts: Date
    user_id: string
    _count: MemoTagCountAggregateOutputType | null
    _min: MemoTagMinAggregateOutputType | null
    _max: MemoTagMaxAggregateOutputType | null
  }

  type GetMemoTagGroupByPayload<T extends MemoTagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MemoTagGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof MemoTagGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], MemoTagGroupByOutputType[P]>
          : GetScalarType<T[P], MemoTagGroupByOutputType[P]>
      }
      >
    >

  export type MemoTagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tag_name?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    user_id?: boolean
    user_info?: boolean | UserDefaultArgs<ExtArgs>
    memos?: boolean | MemoTag$memosArgs<ExtArgs>
    _count?: boolean | MemoTagCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs['result']['memoTag']>

  export interface MemoTagSelectScalar {
    id?: boolean
    tag_name?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    user_id?: boolean
  }

  export type MemoTagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'tag_name' | 'create_ts' | 'updated_ts' | 'user_id', ExtArgs['result']['memoTag']>
  export interface MemoTagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    user_info?: boolean | UserDefaultArgs<ExtArgs>
    memos?: boolean | MemoTag$memosArgs<ExtArgs>
    _count?: boolean | MemoTagCountOutputTypeDefaultArgs<ExtArgs>
  }

  export interface $MemoTagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'MemoTag'
    objects: {
      user_info: Prisma.$UserPayload<ExtArgs>
      memos: Prisma.$MemoTagRelationsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tag_name: string
      create_ts: Date
      updated_ts: Date
      user_id: string
    }, ExtArgs['result']['memoTag']>
    composites: {}
  }

  type MemoTagGetPayload<S extends boolean | null | undefined | MemoTagDefaultArgs> = $Result.GetResult<Prisma.$MemoTagPayload, S>

  type MemoTagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<MemoTagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MemoTagCountAggregateInputType | true
    }

  export interface MemoTagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MemoTag'], meta: { name: 'MemoTag' } }
    /**
     * Find zero or one MemoTag that matches the filter.
     * @param {MemoTagFindUniqueArgs} args - Arguments to find a MemoTag
     * @example
     * // Get one MemoTag
     * const memoTag = await prisma.memoTag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MemoTagFindUniqueArgs>(args: SelectSubset<T, MemoTagFindUniqueArgs<ExtArgs>>): Prisma__MemoTagClient<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MemoTag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MemoTagFindUniqueOrThrowArgs} args - Arguments to find a MemoTag
     * @example
     * // Get one MemoTag
     * const memoTag = await prisma.memoTag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MemoTagFindUniqueOrThrowArgs>(args: SelectSubset<T, MemoTagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MemoTagClient<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MemoTag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagFindFirstArgs} args - Arguments to find a MemoTag
     * @example
     * // Get one MemoTag
     * const memoTag = await prisma.memoTag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MemoTagFindFirstArgs>(args?: SelectSubset<T, MemoTagFindFirstArgs<ExtArgs>>): Prisma__MemoTagClient<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MemoTag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagFindFirstOrThrowArgs} args - Arguments to find a MemoTag
     * @example
     * // Get one MemoTag
     * const memoTag = await prisma.memoTag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MemoTagFindFirstOrThrowArgs>(args?: SelectSubset<T, MemoTagFindFirstOrThrowArgs<ExtArgs>>): Prisma__MemoTagClient<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MemoTags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MemoTags
     * const memoTags = await prisma.memoTag.findMany()
     *
     * // Get first 10 MemoTags
     * const memoTags = await prisma.memoTag.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const memoTagWithIdOnly = await prisma.memoTag.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MemoTagFindManyArgs>(args?: SelectSubset<T, MemoTagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a MemoTag.
     * @param {MemoTagCreateArgs} args - Arguments to create a MemoTag.
     * @example
     * // Create one MemoTag
     * const MemoTag = await prisma.memoTag.create({
     *   data: {
     *     // ... data to create a MemoTag
     *   }
     * })
     *
     */
    create<T extends MemoTagCreateArgs>(args: SelectSubset<T, MemoTagCreateArgs<ExtArgs>>): Prisma__MemoTagClient<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MemoTags.
     * @param {MemoTagCreateManyArgs} args - Arguments to create many MemoTags.
     * @example
     * // Create many MemoTags
     * const memoTag = await prisma.memoTag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MemoTagCreateManyArgs>(args?: SelectSubset<T, MemoTagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MemoTag.
     * @param {MemoTagDeleteArgs} args - Arguments to delete one MemoTag.
     * @example
     * // Delete one MemoTag
     * const MemoTag = await prisma.memoTag.delete({
     *   where: {
     *     // ... filter to delete one MemoTag
     *   }
     * })
     *
     */
    delete<T extends MemoTagDeleteArgs>(args: SelectSubset<T, MemoTagDeleteArgs<ExtArgs>>): Prisma__MemoTagClient<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MemoTag.
     * @param {MemoTagUpdateArgs} args - Arguments to update one MemoTag.
     * @example
     * // Update one MemoTag
     * const memoTag = await prisma.memoTag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MemoTagUpdateArgs>(args: SelectSubset<T, MemoTagUpdateArgs<ExtArgs>>): Prisma__MemoTagClient<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MemoTags.
     * @param {MemoTagDeleteManyArgs} args - Arguments to filter MemoTags to delete.
     * @example
     * // Delete a few MemoTags
     * const { count } = await prisma.memoTag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MemoTagDeleteManyArgs>(args?: SelectSubset<T, MemoTagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MemoTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MemoTags
     * const memoTag = await prisma.memoTag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MemoTagUpdateManyArgs>(args: SelectSubset<T, MemoTagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MemoTag.
     * @param {MemoTagUpsertArgs} args - Arguments to update or create a MemoTag.
     * @example
     * // Update or create a MemoTag
     * const memoTag = await prisma.memoTag.upsert({
     *   create: {
     *     // ... data to create a MemoTag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MemoTag we want to update
     *   }
     * })
     */
    upsert<T extends MemoTagUpsertArgs>(args: SelectSubset<T, MemoTagUpsertArgs<ExtArgs>>): Prisma__MemoTagClient<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of MemoTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagCountArgs} args - Arguments to filter MemoTags to count.
     * @example
     * // Count the number of MemoTags
     * const count = await prisma.memoTag.count({
     *   where: {
     *     // ... the filter for the MemoTags we want to count
     *   }
     * })
     */
    count<T extends MemoTagCountArgs>(
      args?: Subset<T, MemoTagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MemoTagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MemoTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends MemoTagAggregateArgs>(args: Subset<T, MemoTagAggregateArgs>): Prisma.PrismaPromise<GetMemoTagAggregateType<T>>

    /**
     * Group by MemoTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends MemoTagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MemoTagGroupByArgs['orderBy'] }
        : { orderBy?: MemoTagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, MemoTagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemoTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the MemoTag model
     */
    readonly fields: MemoTagFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for MemoTag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MemoTagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    user_info<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    memos<T extends MemoTag$memosArgs<ExtArgs> = {}>(args?: Subset<T, MemoTag$memosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the MemoTag model
   */
  interface MemoTagFieldRefs {
    readonly id: FieldRef<'MemoTag', 'String'>
    readonly tag_name: FieldRef<'MemoTag', 'String'>
    readonly create_ts: FieldRef<'MemoTag', 'DateTime'>
    readonly updated_ts: FieldRef<'MemoTag', 'DateTime'>
    readonly user_id: FieldRef<'MemoTag', 'String'>
  }

  // Custom InputTypes
  /**
   * MemoTag findUnique
   */
  export interface MemoTagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
    /**
     * Filter, which MemoTag to fetch.
     */
    where: MemoTagWhereUniqueInput
  }

  /**
   * MemoTag findUniqueOrThrow
   */
  export interface MemoTagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
    /**
     * Filter, which MemoTag to fetch.
     */
    where: MemoTagWhereUniqueInput
  }

  /**
   * MemoTag findFirst
   */
  export interface MemoTagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
    /**
     * Filter, which MemoTag to fetch.
     */
    where?: MemoTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MemoTags to fetch.
     */
    orderBy?: MemoTagOrderByWithRelationInput | MemoTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MemoTags.
     */
    cursor?: MemoTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MemoTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MemoTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MemoTags.
     */
    distinct?: MemoTagScalarFieldEnum | MemoTagScalarFieldEnum[]
  }

  /**
   * MemoTag findFirstOrThrow
   */
  export interface MemoTagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
    /**
     * Filter, which MemoTag to fetch.
     */
    where?: MemoTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MemoTags to fetch.
     */
    orderBy?: MemoTagOrderByWithRelationInput | MemoTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MemoTags.
     */
    cursor?: MemoTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MemoTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MemoTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MemoTags.
     */
    distinct?: MemoTagScalarFieldEnum | MemoTagScalarFieldEnum[]
  }

  /**
   * MemoTag findMany
   */
  export interface MemoTagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
    /**
     * Filter, which MemoTags to fetch.
     */
    where?: MemoTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MemoTags to fetch.
     */
    orderBy?: MemoTagOrderByWithRelationInput | MemoTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MemoTags.
     */
    cursor?: MemoTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MemoTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MemoTags.
     */
    skip?: number
    distinct?: MemoTagScalarFieldEnum | MemoTagScalarFieldEnum[]
  }

  /**
   * MemoTag create
   */
  export interface MemoTagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
    /**
     * The data needed to create a MemoTag.
     */
    data: XOR<MemoTagCreateInput, MemoTagUncheckedCreateInput>
  }

  /**
   * MemoTag createMany
   */
  export interface MemoTagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many MemoTags.
     */
    data: MemoTagCreateManyInput | MemoTagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MemoTag update
   */
  export interface MemoTagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
    /**
     * The data needed to update a MemoTag.
     */
    data: XOR<MemoTagUpdateInput, MemoTagUncheckedUpdateInput>
    /**
     * Choose, which MemoTag to update.
     */
    where: MemoTagWhereUniqueInput
  }

  /**
   * MemoTag updateMany
   */
  export interface MemoTagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update MemoTags.
     */
    data: XOR<MemoTagUpdateManyMutationInput, MemoTagUncheckedUpdateManyInput>
    /**
     * Filter which MemoTags to update
     */
    where?: MemoTagWhereInput
    /**
     * Limit how many MemoTags to update.
     */
    limit?: number
  }

  /**
   * MemoTag upsert
   */
  export interface MemoTagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
    /**
     * The filter to search for the MemoTag to update in case it exists.
     */
    where: MemoTagWhereUniqueInput
    /**
     * In case the MemoTag found by the `where` argument doesn't exist, create a new MemoTag with this data.
     */
    create: XOR<MemoTagCreateInput, MemoTagUncheckedCreateInput>
    /**
     * In case the MemoTag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MemoTagUpdateInput, MemoTagUncheckedUpdateInput>
  }

  /**
   * MemoTag delete
   */
  export interface MemoTagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
    /**
     * Filter which MemoTag to delete.
     */
    where: MemoTagWhereUniqueInput
  }

  /**
   * MemoTag deleteMany
   */
  export interface MemoTagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which MemoTags to delete
     */
    where?: MemoTagWhereInput
    /**
     * Limit how many MemoTags to delete.
     */
    limit?: number
  }

  /**
   * MemoTag.memos
   */
  export interface MemoTag$memosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    where?: MemoTagRelationsWhereInput
    orderBy?: MemoTagRelationsOrderByWithRelationInput | MemoTagRelationsOrderByWithRelationInput[]
    cursor?: MemoTagRelationsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemoTagRelationsScalarFieldEnum | MemoTagRelationsScalarFieldEnum[]
  }

  /**
   * MemoTag without action
   */
  export interface MemoTagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTag
     */
    select?: MemoTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTag
     */
    omit?: MemoTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagInclude<ExtArgs> | null
  }

  /**
   * Model MemoTagRelations
   */

  export interface AggregateMemoTagRelations {
    _count: MemoTagRelationsCountAggregateOutputType | null
    _min: MemoTagRelationsMinAggregateOutputType | null
    _max: MemoTagRelationsMaxAggregateOutputType | null
  }

  export interface MemoTagRelationsMinAggregateOutputType {
    tagId: string | null
    memoId: string | null
    create_ts: Date | null
    updated_ts: Date | null
  }

  export interface MemoTagRelationsMaxAggregateOutputType {
    tagId: string | null
    memoId: string | null
    create_ts: Date | null
    updated_ts: Date | null
  }

  export interface MemoTagRelationsCountAggregateOutputType {
    tagId: number
    memoId: number
    create_ts: number
    updated_ts: number
    _all: number
  }

  export interface MemoTagRelationsMinAggregateInputType {
    tagId?: true
    memoId?: true
    create_ts?: true
    updated_ts?: true
  }

  export interface MemoTagRelationsMaxAggregateInputType {
    tagId?: true
    memoId?: true
    create_ts?: true
    updated_ts?: true
  }

  export interface MemoTagRelationsCountAggregateInputType {
    tagId?: true
    memoId?: true
    create_ts?: true
    updated_ts?: true
    _all?: true
  }

  export interface MemoTagRelationsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which MemoTagRelations to aggregate.
     */
    where?: MemoTagRelationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MemoTagRelations to fetch.
     */
    orderBy?: MemoTagRelationsOrderByWithRelationInput | MemoTagRelationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: MemoTagRelationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MemoTagRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MemoTagRelations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MemoTagRelations
     */
    _count?: true | MemoTagRelationsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: MemoTagRelationsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: MemoTagRelationsMaxAggregateInputType
  }

  export type GetMemoTagRelationsAggregateType<T extends MemoTagRelationsAggregateArgs> = {
    [P in keyof T & keyof AggregateMemoTagRelations]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMemoTagRelations[P]>
      : GetScalarType<T[P], AggregateMemoTagRelations[P]>
  }

  export interface MemoTagRelationsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: MemoTagRelationsWhereInput
    orderBy?: MemoTagRelationsOrderByWithAggregationInput | MemoTagRelationsOrderByWithAggregationInput[]
    by: MemoTagRelationsScalarFieldEnum[] | MemoTagRelationsScalarFieldEnum
    having?: MemoTagRelationsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MemoTagRelationsCountAggregateInputType | true
    _min?: MemoTagRelationsMinAggregateInputType
    _max?: MemoTagRelationsMaxAggregateInputType
  }

  export interface MemoTagRelationsGroupByOutputType {
    tagId: string
    memoId: string
    create_ts: Date
    updated_ts: Date
    _count: MemoTagRelationsCountAggregateOutputType | null
    _min: MemoTagRelationsMinAggregateOutputType | null
    _max: MemoTagRelationsMaxAggregateOutputType | null
  }

  type GetMemoTagRelationsGroupByPayload<T extends MemoTagRelationsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MemoTagRelationsGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof MemoTagRelationsGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], MemoTagRelationsGroupByOutputType[P]>
          : GetScalarType<T[P], MemoTagRelationsGroupByOutputType[P]>
      }
      >
    >

  export type MemoTagRelationsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tagId?: boolean
    memoId?: boolean
    create_ts?: boolean
    updated_ts?: boolean
    tag?: boolean | MemoTagDefaultArgs<ExtArgs>
    memo?: boolean | BlogMemoDefaultArgs<ExtArgs>
  }, ExtArgs['result']['memoTagRelations']>

  export interface MemoTagRelationsSelectScalar {
    tagId?: boolean
    memoId?: boolean
    create_ts?: boolean
    updated_ts?: boolean
  }

  export type MemoTagRelationsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'tagId' | 'memoId' | 'create_ts' | 'updated_ts', ExtArgs['result']['memoTagRelations']>
  export interface MemoTagRelationsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    tag?: boolean | MemoTagDefaultArgs<ExtArgs>
    memo?: boolean | BlogMemoDefaultArgs<ExtArgs>
  }

  export interface $MemoTagRelationsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'MemoTagRelations'
    objects: {
      tag: Prisma.$MemoTagPayload<ExtArgs>
      memo: Prisma.$BlogMemoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      tagId: string
      memoId: string
      create_ts: Date
      updated_ts: Date
    }, ExtArgs['result']['memoTagRelations']>
    composites: {}
  }

  type MemoTagRelationsGetPayload<S extends boolean | null | undefined | MemoTagRelationsDefaultArgs> = $Result.GetResult<Prisma.$MemoTagRelationsPayload, S>

  type MemoTagRelationsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<MemoTagRelationsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MemoTagRelationsCountAggregateInputType | true
    }

  export interface MemoTagRelationsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MemoTagRelations'], meta: { name: 'MemoTagRelations' } }
    /**
     * Find zero or one MemoTagRelations that matches the filter.
     * @param {MemoTagRelationsFindUniqueArgs} args - Arguments to find a MemoTagRelations
     * @example
     * // Get one MemoTagRelations
     * const memoTagRelations = await prisma.memoTagRelations.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MemoTagRelationsFindUniqueArgs>(args: SelectSubset<T, MemoTagRelationsFindUniqueArgs<ExtArgs>>): Prisma__MemoTagRelationsClient<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MemoTagRelations that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MemoTagRelationsFindUniqueOrThrowArgs} args - Arguments to find a MemoTagRelations
     * @example
     * // Get one MemoTagRelations
     * const memoTagRelations = await prisma.memoTagRelations.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MemoTagRelationsFindUniqueOrThrowArgs>(args: SelectSubset<T, MemoTagRelationsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MemoTagRelationsClient<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MemoTagRelations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagRelationsFindFirstArgs} args - Arguments to find a MemoTagRelations
     * @example
     * // Get one MemoTagRelations
     * const memoTagRelations = await prisma.memoTagRelations.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MemoTagRelationsFindFirstArgs>(args?: SelectSubset<T, MemoTagRelationsFindFirstArgs<ExtArgs>>): Prisma__MemoTagRelationsClient<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MemoTagRelations that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagRelationsFindFirstOrThrowArgs} args - Arguments to find a MemoTagRelations
     * @example
     * // Get one MemoTagRelations
     * const memoTagRelations = await prisma.memoTagRelations.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MemoTagRelationsFindFirstOrThrowArgs>(args?: SelectSubset<T, MemoTagRelationsFindFirstOrThrowArgs<ExtArgs>>): Prisma__MemoTagRelationsClient<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MemoTagRelations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagRelationsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MemoTagRelations
     * const memoTagRelations = await prisma.memoTagRelations.findMany()
     *
     * // Get first 10 MemoTagRelations
     * const memoTagRelations = await prisma.memoTagRelations.findMany({ take: 10 })
     *
     * // Only select the `tagId`
     * const memoTagRelationsWithTagIdOnly = await prisma.memoTagRelations.findMany({ select: { tagId: true } })
     *
     */
    findMany<T extends MemoTagRelationsFindManyArgs>(args?: SelectSubset<T, MemoTagRelationsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a MemoTagRelations.
     * @param {MemoTagRelationsCreateArgs} args - Arguments to create a MemoTagRelations.
     * @example
     * // Create one MemoTagRelations
     * const MemoTagRelations = await prisma.memoTagRelations.create({
     *   data: {
     *     // ... data to create a MemoTagRelations
     *   }
     * })
     *
     */
    create<T extends MemoTagRelationsCreateArgs>(args: SelectSubset<T, MemoTagRelationsCreateArgs<ExtArgs>>): Prisma__MemoTagRelationsClient<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MemoTagRelations.
     * @param {MemoTagRelationsCreateManyArgs} args - Arguments to create many MemoTagRelations.
     * @example
     * // Create many MemoTagRelations
     * const memoTagRelations = await prisma.memoTagRelations.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MemoTagRelationsCreateManyArgs>(args?: SelectSubset<T, MemoTagRelationsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MemoTagRelations.
     * @param {MemoTagRelationsDeleteArgs} args - Arguments to delete one MemoTagRelations.
     * @example
     * // Delete one MemoTagRelations
     * const MemoTagRelations = await prisma.memoTagRelations.delete({
     *   where: {
     *     // ... filter to delete one MemoTagRelations
     *   }
     * })
     *
     */
    delete<T extends MemoTagRelationsDeleteArgs>(args: SelectSubset<T, MemoTagRelationsDeleteArgs<ExtArgs>>): Prisma__MemoTagRelationsClient<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MemoTagRelations.
     * @param {MemoTagRelationsUpdateArgs} args - Arguments to update one MemoTagRelations.
     * @example
     * // Update one MemoTagRelations
     * const memoTagRelations = await prisma.memoTagRelations.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MemoTagRelationsUpdateArgs>(args: SelectSubset<T, MemoTagRelationsUpdateArgs<ExtArgs>>): Prisma__MemoTagRelationsClient<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MemoTagRelations.
     * @param {MemoTagRelationsDeleteManyArgs} args - Arguments to filter MemoTagRelations to delete.
     * @example
     * // Delete a few MemoTagRelations
     * const { count } = await prisma.memoTagRelations.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MemoTagRelationsDeleteManyArgs>(args?: SelectSubset<T, MemoTagRelationsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MemoTagRelations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagRelationsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MemoTagRelations
     * const memoTagRelations = await prisma.memoTagRelations.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MemoTagRelationsUpdateManyArgs>(args: SelectSubset<T, MemoTagRelationsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MemoTagRelations.
     * @param {MemoTagRelationsUpsertArgs} args - Arguments to update or create a MemoTagRelations.
     * @example
     * // Update or create a MemoTagRelations
     * const memoTagRelations = await prisma.memoTagRelations.upsert({
     *   create: {
     *     // ... data to create a MemoTagRelations
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MemoTagRelations we want to update
     *   }
     * })
     */
    upsert<T extends MemoTagRelationsUpsertArgs>(args: SelectSubset<T, MemoTagRelationsUpsertArgs<ExtArgs>>): Prisma__MemoTagRelationsClient<$Result.GetResult<Prisma.$MemoTagRelationsPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of MemoTagRelations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagRelationsCountArgs} args - Arguments to filter MemoTagRelations to count.
     * @example
     * // Count the number of MemoTagRelations
     * const count = await prisma.memoTagRelations.count({
     *   where: {
     *     // ... the filter for the MemoTagRelations we want to count
     *   }
     * })
     */
    count<T extends MemoTagRelationsCountArgs>(
      args?: Subset<T, MemoTagRelationsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MemoTagRelationsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MemoTagRelations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagRelationsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends MemoTagRelationsAggregateArgs>(args: Subset<T, MemoTagRelationsAggregateArgs>): Prisma.PrismaPromise<GetMemoTagRelationsAggregateType<T>>

    /**
     * Group by MemoTagRelations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemoTagRelationsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends MemoTagRelationsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MemoTagRelationsGroupByArgs['orderBy'] }
        : { orderBy?: MemoTagRelationsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, MemoTagRelationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemoTagRelationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the MemoTagRelations model
     */
    readonly fields: MemoTagRelationsFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for MemoTagRelations.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MemoTagRelationsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    tag<T extends MemoTagDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MemoTagDefaultArgs<ExtArgs>>): Prisma__MemoTagClient<$Result.GetResult<Prisma.$MemoTagPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    memo<T extends BlogMemoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BlogMemoDefaultArgs<ExtArgs>>): Prisma__BlogMemoClient<$Result.GetResult<Prisma.$BlogMemoPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the MemoTagRelations model
   */
  interface MemoTagRelationsFieldRefs {
    readonly tagId: FieldRef<'MemoTagRelations', 'String'>
    readonly memoId: FieldRef<'MemoTagRelations', 'String'>
    readonly create_ts: FieldRef<'MemoTagRelations', 'DateTime'>
    readonly updated_ts: FieldRef<'MemoTagRelations', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * MemoTagRelations findUnique
   */
  export interface MemoTagRelationsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    /**
     * Filter, which MemoTagRelations to fetch.
     */
    where: MemoTagRelationsWhereUniqueInput
  }

  /**
   * MemoTagRelations findUniqueOrThrow
   */
  export interface MemoTagRelationsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    /**
     * Filter, which MemoTagRelations to fetch.
     */
    where: MemoTagRelationsWhereUniqueInput
  }

  /**
   * MemoTagRelations findFirst
   */
  export interface MemoTagRelationsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    /**
     * Filter, which MemoTagRelations to fetch.
     */
    where?: MemoTagRelationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MemoTagRelations to fetch.
     */
    orderBy?: MemoTagRelationsOrderByWithRelationInput | MemoTagRelationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MemoTagRelations.
     */
    cursor?: MemoTagRelationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MemoTagRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MemoTagRelations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MemoTagRelations.
     */
    distinct?: MemoTagRelationsScalarFieldEnum | MemoTagRelationsScalarFieldEnum[]
  }

  /**
   * MemoTagRelations findFirstOrThrow
   */
  export interface MemoTagRelationsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    /**
     * Filter, which MemoTagRelations to fetch.
     */
    where?: MemoTagRelationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MemoTagRelations to fetch.
     */
    orderBy?: MemoTagRelationsOrderByWithRelationInput | MemoTagRelationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MemoTagRelations.
     */
    cursor?: MemoTagRelationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MemoTagRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MemoTagRelations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MemoTagRelations.
     */
    distinct?: MemoTagRelationsScalarFieldEnum | MemoTagRelationsScalarFieldEnum[]
  }

  /**
   * MemoTagRelations findMany
   */
  export interface MemoTagRelationsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    /**
     * Filter, which MemoTagRelations to fetch.
     */
    where?: MemoTagRelationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MemoTagRelations to fetch.
     */
    orderBy?: MemoTagRelationsOrderByWithRelationInput | MemoTagRelationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MemoTagRelations.
     */
    cursor?: MemoTagRelationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MemoTagRelations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MemoTagRelations.
     */
    skip?: number
    distinct?: MemoTagRelationsScalarFieldEnum | MemoTagRelationsScalarFieldEnum[]
  }

  /**
   * MemoTagRelations create
   */
  export interface MemoTagRelationsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    /**
     * The data needed to create a MemoTagRelations.
     */
    data: XOR<MemoTagRelationsCreateInput, MemoTagRelationsUncheckedCreateInput>
  }

  /**
   * MemoTagRelations createMany
   */
  export interface MemoTagRelationsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many MemoTagRelations.
     */
    data: MemoTagRelationsCreateManyInput | MemoTagRelationsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MemoTagRelations update
   */
  export interface MemoTagRelationsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    /**
     * The data needed to update a MemoTagRelations.
     */
    data: XOR<MemoTagRelationsUpdateInput, MemoTagRelationsUncheckedUpdateInput>
    /**
     * Choose, which MemoTagRelations to update.
     */
    where: MemoTagRelationsWhereUniqueInput
  }

  /**
   * MemoTagRelations updateMany
   */
  export interface MemoTagRelationsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update MemoTagRelations.
     */
    data: XOR<MemoTagRelationsUpdateManyMutationInput, MemoTagRelationsUncheckedUpdateManyInput>
    /**
     * Filter which MemoTagRelations to update
     */
    where?: MemoTagRelationsWhereInput
    /**
     * Limit how many MemoTagRelations to update.
     */
    limit?: number
  }

  /**
   * MemoTagRelations upsert
   */
  export interface MemoTagRelationsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    /**
     * The filter to search for the MemoTagRelations to update in case it exists.
     */
    where: MemoTagRelationsWhereUniqueInput
    /**
     * In case the MemoTagRelations found by the `where` argument doesn't exist, create a new MemoTagRelations with this data.
     */
    create: XOR<MemoTagRelationsCreateInput, MemoTagRelationsUncheckedCreateInput>
    /**
     * In case the MemoTagRelations was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MemoTagRelationsUpdateInput, MemoTagRelationsUncheckedUpdateInput>
  }

  /**
   * MemoTagRelations delete
   */
  export interface MemoTagRelationsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
    /**
     * Filter which MemoTagRelations to delete.
     */
    where: MemoTagRelationsWhereUniqueInput
  }

  /**
   * MemoTagRelations deleteMany
   */
  export interface MemoTagRelationsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which MemoTagRelations to delete
     */
    where?: MemoTagRelationsWhereInput
    /**
     * Limit how many MemoTagRelations to delete.
     */
    limit?: number
  }

  /**
   * MemoTagRelations without action
   */
  export interface MemoTagRelationsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the MemoTagRelations
     */
    select?: MemoTagRelationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemoTagRelations
     */
    omit?: MemoTagRelationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemoTagRelationsInclude<ExtArgs> | null
  }

  /**
   * Model GarminActivity
   */

  export interface AggregateGarminActivity {
    _count: GarminActivityCountAggregateOutputType | null
    _avg: GarminActivityAvgAggregateOutputType | null
    _sum: GarminActivitySumAggregateOutputType | null
    _min: GarminActivityMinAggregateOutputType | null
    _max: GarminActivityMaxAggregateOutputType | null
  }

  export interface GarminActivityAvgAggregateOutputType {
    distance: Decimal | null
    calories: number | null
    duration: Decimal | null
    movingTime: Decimal | null
    elapsedTime: Decimal | null
    avgHr: number | null
    maxHr: number | null
    aerobicEffect: Decimal | null
    trainingStressScore: Decimal | null
    avgPace: Decimal | null
    bestPace: Decimal | null
    totalStrokes: number | null
    avgSwolf: number | null
    avgStrokeRate: number | null
    steps: number | null
    totalReps: number | null
    totalSets: number | null
    bestLapTime: Decimal | null
    lapCount: number | null
  }

  export interface GarminActivitySumAggregateOutputType {
    distance: Decimal | null
    calories: number | null
    duration: Decimal | null
    movingTime: Decimal | null
    elapsedTime: Decimal | null
    avgHr: number | null
    maxHr: number | null
    aerobicEffect: Decimal | null
    trainingStressScore: Decimal | null
    avgPace: Decimal | null
    bestPace: Decimal | null
    totalStrokes: number | null
    avgSwolf: number | null
    avgStrokeRate: number | null
    steps: number | null
    totalReps: number | null
    totalSets: number | null
    bestLapTime: Decimal | null
    lapCount: number | null
  }

  export interface GarminActivityMinAggregateOutputType {
    id: string | null
    activityType: string | null
    date: Date | null
    isFavorite: boolean | null
    title: string | null
    distance: Decimal | null
    calories: number | null
    duration: Decimal | null
    movingTime: Decimal | null
    elapsedTime: Decimal | null
    avgHr: number | null
    maxHr: number | null
    aerobicEffect: Decimal | null
    trainingStressScore: Decimal | null
    avgPace: Decimal | null
    bestPace: Decimal | null
    totalStrokes: number | null
    avgSwolf: number | null
    avgStrokeRate: number | null
    steps: number | null
    totalReps: number | null
    totalSets: number | null
    isGrit: boolean | null
    bestLapTime: Decimal | null
    lapCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export interface GarminActivityMaxAggregateOutputType {
    id: string | null
    activityType: string | null
    date: Date | null
    isFavorite: boolean | null
    title: string | null
    distance: Decimal | null
    calories: number | null
    duration: Decimal | null
    movingTime: Decimal | null
    elapsedTime: Decimal | null
    avgHr: number | null
    maxHr: number | null
    aerobicEffect: Decimal | null
    trainingStressScore: Decimal | null
    avgPace: Decimal | null
    bestPace: Decimal | null
    totalStrokes: number | null
    avgSwolf: number | null
    avgStrokeRate: number | null
    steps: number | null
    totalReps: number | null
    totalSets: number | null
    isGrit: boolean | null
    bestLapTime: Decimal | null
    lapCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export interface GarminActivityCountAggregateOutputType {
    id: number
    activityType: number
    date: number
    isFavorite: number
    title: number
    distance: number
    calories: number
    duration: number
    movingTime: number
    elapsedTime: number
    avgHr: number
    maxHr: number
    aerobicEffect: number
    trainingStressScore: number
    avgPace: number
    bestPace: number
    totalStrokes: number
    avgSwolf: number
    avgStrokeRate: number
    steps: number
    totalReps: number
    totalSets: number
    isGrit: number
    bestLapTime: number
    lapCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export interface GarminActivityAvgAggregateInputType {
    distance?: true
    calories?: true
    duration?: true
    movingTime?: true
    elapsedTime?: true
    avgHr?: true
    maxHr?: true
    aerobicEffect?: true
    trainingStressScore?: true
    avgPace?: true
    bestPace?: true
    totalStrokes?: true
    avgSwolf?: true
    avgStrokeRate?: true
    steps?: true
    totalReps?: true
    totalSets?: true
    bestLapTime?: true
    lapCount?: true
  }

  export interface GarminActivitySumAggregateInputType {
    distance?: true
    calories?: true
    duration?: true
    movingTime?: true
    elapsedTime?: true
    avgHr?: true
    maxHr?: true
    aerobicEffect?: true
    trainingStressScore?: true
    avgPace?: true
    bestPace?: true
    totalStrokes?: true
    avgSwolf?: true
    avgStrokeRate?: true
    steps?: true
    totalReps?: true
    totalSets?: true
    bestLapTime?: true
    lapCount?: true
  }

  export interface GarminActivityMinAggregateInputType {
    id?: true
    activityType?: true
    date?: true
    isFavorite?: true
    title?: true
    distance?: true
    calories?: true
    duration?: true
    movingTime?: true
    elapsedTime?: true
    avgHr?: true
    maxHr?: true
    aerobicEffect?: true
    trainingStressScore?: true
    avgPace?: true
    bestPace?: true
    totalStrokes?: true
    avgSwolf?: true
    avgStrokeRate?: true
    steps?: true
    totalReps?: true
    totalSets?: true
    isGrit?: true
    bestLapTime?: true
    lapCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export interface GarminActivityMaxAggregateInputType {
    id?: true
    activityType?: true
    date?: true
    isFavorite?: true
    title?: true
    distance?: true
    calories?: true
    duration?: true
    movingTime?: true
    elapsedTime?: true
    avgHr?: true
    maxHr?: true
    aerobicEffect?: true
    trainingStressScore?: true
    avgPace?: true
    bestPace?: true
    totalStrokes?: true
    avgSwolf?: true
    avgStrokeRate?: true
    steps?: true
    totalReps?: true
    totalSets?: true
    isGrit?: true
    bestLapTime?: true
    lapCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export interface GarminActivityCountAggregateInputType {
    id?: true
    activityType?: true
    date?: true
    isFavorite?: true
    title?: true
    distance?: true
    calories?: true
    duration?: true
    movingTime?: true
    elapsedTime?: true
    avgHr?: true
    maxHr?: true
    aerobicEffect?: true
    trainingStressScore?: true
    avgPace?: true
    bestPace?: true
    totalStrokes?: true
    avgSwolf?: true
    avgStrokeRate?: true
    steps?: true
    totalReps?: true
    totalSets?: true
    isGrit?: true
    bestLapTime?: true
    lapCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export interface GarminActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which GarminActivity to aggregate.
     */
    where?: GarminActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of GarminActivities to fetch.
     */
    orderBy?: GarminActivityOrderByWithRelationInput | GarminActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: GarminActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` GarminActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` GarminActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned GarminActivities
     */
    _count?: true | GarminActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     */
    _avg?: GarminActivityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     */
    _sum?: GarminActivitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: GarminActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: GarminActivityMaxAggregateInputType
  }

  export type GetGarminActivityAggregateType<T extends GarminActivityAggregateArgs> = {
    [P in keyof T & keyof AggregateGarminActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGarminActivity[P]>
      : GetScalarType<T[P], AggregateGarminActivity[P]>
  }

  export interface GarminActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    where?: GarminActivityWhereInput
    orderBy?: GarminActivityOrderByWithAggregationInput | GarminActivityOrderByWithAggregationInput[]
    by: GarminActivityScalarFieldEnum[] | GarminActivityScalarFieldEnum
    having?: GarminActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GarminActivityCountAggregateInputType | true
    _avg?: GarminActivityAvgAggregateInputType
    _sum?: GarminActivitySumAggregateInputType
    _min?: GarminActivityMinAggregateInputType
    _max?: GarminActivityMaxAggregateInputType
  }

  export interface GarminActivityGroupByOutputType {
    id: string
    activityType: string
    date: Date
    isFavorite: boolean
    title: string | null
    distance: Decimal | null
    calories: number
    duration: Decimal
    movingTime: Decimal | null
    elapsedTime: Decimal | null
    avgHr: number | null
    maxHr: number | null
    aerobicEffect: Decimal | null
    trainingStressScore: Decimal | null
    avgPace: Decimal | null
    bestPace: Decimal | null
    totalStrokes: number | null
    avgSwolf: number | null
    avgStrokeRate: number | null
    steps: number | null
    totalReps: number | null
    totalSets: number | null
    isGrit: boolean | null
    bestLapTime: Decimal | null
    lapCount: number | null
    createdAt: Date
    updatedAt: Date
    _count: GarminActivityCountAggregateOutputType | null
    _avg: GarminActivityAvgAggregateOutputType | null
    _sum: GarminActivitySumAggregateOutputType | null
    _min: GarminActivityMinAggregateOutputType | null
    _max: GarminActivityMaxAggregateOutputType | null
  }

  type GetGarminActivityGroupByPayload<T extends GarminActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GarminActivityGroupByOutputType, T['by']>
      & {
        [P in ((keyof T) & (keyof GarminActivityGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], GarminActivityGroupByOutputType[P]>
          : GetScalarType<T[P], GarminActivityGroupByOutputType[P]>
      }
      >
    >

  export type GarminActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    activityType?: boolean
    date?: boolean
    isFavorite?: boolean
    title?: boolean
    distance?: boolean
    calories?: boolean
    duration?: boolean
    movingTime?: boolean
    elapsedTime?: boolean
    avgHr?: boolean
    maxHr?: boolean
    aerobicEffect?: boolean
    trainingStressScore?: boolean
    avgPace?: boolean
    bestPace?: boolean
    totalStrokes?: boolean
    avgSwolf?: boolean
    avgStrokeRate?: boolean
    steps?: boolean
    totalReps?: boolean
    totalSets?: boolean
    isGrit?: boolean
    bestLapTime?: boolean
    lapCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs['result']['garminActivity']>

  export interface GarminActivitySelectScalar {
    id?: boolean
    activityType?: boolean
    date?: boolean
    isFavorite?: boolean
    title?: boolean
    distance?: boolean
    calories?: boolean
    duration?: boolean
    movingTime?: boolean
    elapsedTime?: boolean
    avgHr?: boolean
    maxHr?: boolean
    aerobicEffect?: boolean
    trainingStressScore?: boolean
    avgPace?: boolean
    bestPace?: boolean
    totalStrokes?: boolean
    avgSwolf?: boolean
    avgStrokeRate?: boolean
    steps?: boolean
    totalReps?: boolean
    totalSets?: boolean
    isGrit?: boolean
    bestLapTime?: boolean
    lapCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GarminActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<'id' | 'activityType' | 'date' | 'isFavorite' | 'title' | 'distance' | 'calories' | 'duration' | 'movingTime' | 'elapsedTime' | 'avgHr' | 'maxHr' | 'aerobicEffect' | 'trainingStressScore' | 'avgPace' | 'bestPace' | 'totalStrokes' | 'avgSwolf' | 'avgStrokeRate' | 'steps' | 'totalReps' | 'totalSets' | 'isGrit' | 'bestLapTime' | 'lapCount' | 'createdAt' | 'updatedAt', ExtArgs['result']['garminActivity']>

  export interface $GarminActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    name: 'GarminActivity'
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      activityType: string
      date: Date
      isFavorite: boolean
      title: string | null
      distance: Prisma.Decimal | null
      calories: number
      duration: Prisma.Decimal
      movingTime: Prisma.Decimal | null
      elapsedTime: Prisma.Decimal | null
      avgHr: number | null
      maxHr: number | null
      aerobicEffect: Prisma.Decimal | null
      trainingStressScore: Prisma.Decimal | null
      avgPace: Prisma.Decimal | null
      bestPace: Prisma.Decimal | null
      totalStrokes: number | null
      avgSwolf: number | null
      avgStrokeRate: number | null
      steps: number | null
      totalReps: number | null
      totalSets: number | null
      isGrit: boolean | null
      bestLapTime: Prisma.Decimal | null
      lapCount: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs['result']['garminActivity']>
    composites: {}
  }

  type GarminActivityGetPayload<S extends boolean | null | undefined | GarminActivityDefaultArgs> = $Result.GetResult<Prisma.$GarminActivityPayload, S>

  type GarminActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs>
    = Omit<GarminActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GarminActivityCountAggregateInputType | true
    }

  export interface GarminActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GarminActivity'], meta: { name: 'GarminActivity' } }
    /**
     * Find zero or one GarminActivity that matches the filter.
     * @param {GarminActivityFindUniqueArgs} args - Arguments to find a GarminActivity
     * @example
     * // Get one GarminActivity
     * const garminActivity = await prisma.garminActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GarminActivityFindUniqueArgs>(args: SelectSubset<T, GarminActivityFindUniqueArgs<ExtArgs>>): Prisma__GarminActivityClient<$Result.GetResult<Prisma.$GarminActivityPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GarminActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GarminActivityFindUniqueOrThrowArgs} args - Arguments to find a GarminActivity
     * @example
     * // Get one GarminActivity
     * const garminActivity = await prisma.garminActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GarminActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, GarminActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GarminActivityClient<$Result.GetResult<Prisma.$GarminActivityPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GarminActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GarminActivityFindFirstArgs} args - Arguments to find a GarminActivity
     * @example
     * // Get one GarminActivity
     * const garminActivity = await prisma.garminActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GarminActivityFindFirstArgs>(args?: SelectSubset<T, GarminActivityFindFirstArgs<ExtArgs>>): Prisma__GarminActivityClient<$Result.GetResult<Prisma.$GarminActivityPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GarminActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GarminActivityFindFirstOrThrowArgs} args - Arguments to find a GarminActivity
     * @example
     * // Get one GarminActivity
     * const garminActivity = await prisma.garminActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GarminActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, GarminActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__GarminActivityClient<$Result.GetResult<Prisma.$GarminActivityPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GarminActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GarminActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GarminActivities
     * const garminActivities = await prisma.garminActivity.findMany()
     *
     * // Get first 10 GarminActivities
     * const garminActivities = await prisma.garminActivity.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const garminActivityWithIdOnly = await prisma.garminActivity.findMany({ select: { id: true } })
     *
     */
    findMany<T extends GarminActivityFindManyArgs>(args?: SelectSubset<T, GarminActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GarminActivityPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a GarminActivity.
     * @param {GarminActivityCreateArgs} args - Arguments to create a GarminActivity.
     * @example
     * // Create one GarminActivity
     * const GarminActivity = await prisma.garminActivity.create({
     *   data: {
     *     // ... data to create a GarminActivity
     *   }
     * })
     *
     */
    create<T extends GarminActivityCreateArgs>(args: SelectSubset<T, GarminActivityCreateArgs<ExtArgs>>): Prisma__GarminActivityClient<$Result.GetResult<Prisma.$GarminActivityPayload<ExtArgs>, T, 'create', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GarminActivities.
     * @param {GarminActivityCreateManyArgs} args - Arguments to create many GarminActivities.
     * @example
     * // Create many GarminActivities
     * const garminActivity = await prisma.garminActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends GarminActivityCreateManyArgs>(args?: SelectSubset<T, GarminActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GarminActivity.
     * @param {GarminActivityDeleteArgs} args - Arguments to delete one GarminActivity.
     * @example
     * // Delete one GarminActivity
     * const GarminActivity = await prisma.garminActivity.delete({
     *   where: {
     *     // ... filter to delete one GarminActivity
     *   }
     * })
     *
     */
    delete<T extends GarminActivityDeleteArgs>(args: SelectSubset<T, GarminActivityDeleteArgs<ExtArgs>>): Prisma__GarminActivityClient<$Result.GetResult<Prisma.$GarminActivityPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GarminActivity.
     * @param {GarminActivityUpdateArgs} args - Arguments to update one GarminActivity.
     * @example
     * // Update one GarminActivity
     * const garminActivity = await prisma.garminActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends GarminActivityUpdateArgs>(args: SelectSubset<T, GarminActivityUpdateArgs<ExtArgs>>): Prisma__GarminActivityClient<$Result.GetResult<Prisma.$GarminActivityPayload<ExtArgs>, T, 'update', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GarminActivities.
     * @param {GarminActivityDeleteManyArgs} args - Arguments to filter GarminActivities to delete.
     * @example
     * // Delete a few GarminActivities
     * const { count } = await prisma.garminActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends GarminActivityDeleteManyArgs>(args?: SelectSubset<T, GarminActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GarminActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GarminActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GarminActivities
     * const garminActivity = await prisma.garminActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends GarminActivityUpdateManyArgs>(args: SelectSubset<T, GarminActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GarminActivity.
     * @param {GarminActivityUpsertArgs} args - Arguments to update or create a GarminActivity.
     * @example
     * // Update or create a GarminActivity
     * const garminActivity = await prisma.garminActivity.upsert({
     *   create: {
     *     // ... data to create a GarminActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GarminActivity we want to update
     *   }
     * })
     */
    upsert<T extends GarminActivityUpsertArgs>(args: SelectSubset<T, GarminActivityUpsertArgs<ExtArgs>>): Prisma__GarminActivityClient<$Result.GetResult<Prisma.$GarminActivityPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Count the number of GarminActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GarminActivityCountArgs} args - Arguments to filter GarminActivities to count.
     * @example
     * // Count the number of GarminActivities
     * const count = await prisma.garminActivity.count({
     *   where: {
     *     // ... the filter for the GarminActivities we want to count
     *   }
     * })
     */
    count<T extends GarminActivityCountArgs>(
      args?: Subset<T, GarminActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GarminActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GarminActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GarminActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends GarminActivityAggregateArgs>(args: Subset<T, GarminActivityAggregateArgs>): Prisma.PrismaPromise<GetGarminActivityAggregateType<T>>

    /**
     * Group by GarminActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GarminActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     */
    groupBy<
      T extends GarminActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GarminActivityGroupByArgs['orderBy'] }
        : { orderBy?: GarminActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(args: SubsetIntersection<T, GarminActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGarminActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the GarminActivity model
     */
    readonly fields: GarminActivityFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for GarminActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GarminActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the GarminActivity model
   */
  interface GarminActivityFieldRefs {
    readonly id: FieldRef<'GarminActivity', 'String'>
    readonly activityType: FieldRef<'GarminActivity', 'String'>
    readonly date: FieldRef<'GarminActivity', 'DateTime'>
    readonly isFavorite: FieldRef<'GarminActivity', 'Boolean'>
    readonly title: FieldRef<'GarminActivity', 'String'>
    readonly distance: FieldRef<'GarminActivity', 'Decimal'>
    readonly calories: FieldRef<'GarminActivity', 'Int'>
    readonly duration: FieldRef<'GarminActivity', 'Decimal'>
    readonly movingTime: FieldRef<'GarminActivity', 'Decimal'>
    readonly elapsedTime: FieldRef<'GarminActivity', 'Decimal'>
    readonly avgHr: FieldRef<'GarminActivity', 'Int'>
    readonly maxHr: FieldRef<'GarminActivity', 'Int'>
    readonly aerobicEffect: FieldRef<'GarminActivity', 'Decimal'>
    readonly trainingStressScore: FieldRef<'GarminActivity', 'Decimal'>
    readonly avgPace: FieldRef<'GarminActivity', 'Decimal'>
    readonly bestPace: FieldRef<'GarminActivity', 'Decimal'>
    readonly totalStrokes: FieldRef<'GarminActivity', 'Int'>
    readonly avgSwolf: FieldRef<'GarminActivity', 'Int'>
    readonly avgStrokeRate: FieldRef<'GarminActivity', 'Int'>
    readonly steps: FieldRef<'GarminActivity', 'Int'>
    readonly totalReps: FieldRef<'GarminActivity', 'Int'>
    readonly totalSets: FieldRef<'GarminActivity', 'Int'>
    readonly isGrit: FieldRef<'GarminActivity', 'Boolean'>
    readonly bestLapTime: FieldRef<'GarminActivity', 'Decimal'>
    readonly lapCount: FieldRef<'GarminActivity', 'Int'>
    readonly createdAt: FieldRef<'GarminActivity', 'DateTime'>
    readonly updatedAt: FieldRef<'GarminActivity', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * GarminActivity findUnique
   */
  export interface GarminActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the GarminActivity
     */
    select?: GarminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GarminActivity
     */
    omit?: GarminActivityOmit<ExtArgs> | null
    /**
     * Filter, which GarminActivity to fetch.
     */
    where: GarminActivityWhereUniqueInput
  }

  /**
   * GarminActivity findUniqueOrThrow
   */
  export interface GarminActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the GarminActivity
     */
    select?: GarminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GarminActivity
     */
    omit?: GarminActivityOmit<ExtArgs> | null
    /**
     * Filter, which GarminActivity to fetch.
     */
    where: GarminActivityWhereUniqueInput
  }

  /**
   * GarminActivity findFirst
   */
  export interface GarminActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the GarminActivity
     */
    select?: GarminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GarminActivity
     */
    omit?: GarminActivityOmit<ExtArgs> | null
    /**
     * Filter, which GarminActivity to fetch.
     */
    where?: GarminActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of GarminActivities to fetch.
     */
    orderBy?: GarminActivityOrderByWithRelationInput | GarminActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for GarminActivities.
     */
    cursor?: GarminActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` GarminActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` GarminActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of GarminActivities.
     */
    distinct?: GarminActivityScalarFieldEnum | GarminActivityScalarFieldEnum[]
  }

  /**
   * GarminActivity findFirstOrThrow
   */
  export interface GarminActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the GarminActivity
     */
    select?: GarminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GarminActivity
     */
    omit?: GarminActivityOmit<ExtArgs> | null
    /**
     * Filter, which GarminActivity to fetch.
     */
    where?: GarminActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of GarminActivities to fetch.
     */
    orderBy?: GarminActivityOrderByWithRelationInput | GarminActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for GarminActivities.
     */
    cursor?: GarminActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` GarminActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` GarminActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of GarminActivities.
     */
    distinct?: GarminActivityScalarFieldEnum | GarminActivityScalarFieldEnum[]
  }

  /**
   * GarminActivity findMany
   */
  export interface GarminActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the GarminActivity
     */
    select?: GarminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GarminActivity
     */
    omit?: GarminActivityOmit<ExtArgs> | null
    /**
     * Filter, which GarminActivities to fetch.
     */
    where?: GarminActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of GarminActivities to fetch.
     */
    orderBy?: GarminActivityOrderByWithRelationInput | GarminActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing GarminActivities.
     */
    cursor?: GarminActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` GarminActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` GarminActivities.
     */
    skip?: number
    distinct?: GarminActivityScalarFieldEnum | GarminActivityScalarFieldEnum[]
  }

  /**
   * GarminActivity create
   */
  export interface GarminActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the GarminActivity
     */
    select?: GarminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GarminActivity
     */
    omit?: GarminActivityOmit<ExtArgs> | null
    /**
     * The data needed to create a GarminActivity.
     */
    data: XOR<GarminActivityCreateInput, GarminActivityUncheckedCreateInput>
  }

  /**
   * GarminActivity createMany
   */
  export interface GarminActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to create many GarminActivities.
     */
    data: GarminActivityCreateManyInput | GarminActivityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GarminActivity update
   */
  export interface GarminActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the GarminActivity
     */
    select?: GarminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GarminActivity
     */
    omit?: GarminActivityOmit<ExtArgs> | null
    /**
     * The data needed to update a GarminActivity.
     */
    data: XOR<GarminActivityUpdateInput, GarminActivityUncheckedUpdateInput>
    /**
     * Choose, which GarminActivity to update.
     */
    where: GarminActivityWhereUniqueInput
  }

  /**
   * GarminActivity updateMany
   */
  export interface GarminActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * The data used to update GarminActivities.
     */
    data: XOR<GarminActivityUpdateManyMutationInput, GarminActivityUncheckedUpdateManyInput>
    /**
     * Filter which GarminActivities to update
     */
    where?: GarminActivityWhereInput
    /**
     * Limit how many GarminActivities to update.
     */
    limit?: number
  }

  /**
   * GarminActivity upsert
   */
  export interface GarminActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the GarminActivity
     */
    select?: GarminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GarminActivity
     */
    omit?: GarminActivityOmit<ExtArgs> | null
    /**
     * The filter to search for the GarminActivity to update in case it exists.
     */
    where: GarminActivityWhereUniqueInput
    /**
     * In case the GarminActivity found by the `where` argument doesn't exist, create a new GarminActivity with this data.
     */
    create: XOR<GarminActivityCreateInput, GarminActivityUncheckedCreateInput>
    /**
     * In case the GarminActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GarminActivityUpdateInput, GarminActivityUncheckedUpdateInput>
  }

  /**
   * GarminActivity delete
   */
  export interface GarminActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the GarminActivity
     */
    select?: GarminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GarminActivity
     */
    omit?: GarminActivityOmit<ExtArgs> | null
    /**
     * Filter which GarminActivity to delete.
     */
    where: GarminActivityWhereUniqueInput
  }

  /**
   * GarminActivity deleteMany
   */
  export interface GarminActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Filter which GarminActivities to delete
     */
    where?: GarminActivityWhereInput
    /**
     * Limit how many GarminActivities to delete.
     */
    limit?: number
  }

  /**
   * GarminActivity without action
   */
  export interface GarminActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    /**
     * Select specific fields to fetch from the GarminActivity
     */
    select?: GarminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GarminActivity
     */
    omit?: GarminActivityOmit<ExtArgs> | null
  }

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted'
    ReadCommitted: 'ReadCommitted'
    RepeatableRead: 'RepeatableRead'
    Serializable: 'Serializable'
  }

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]

  export const UserScalarFieldEnum: {
    id: 'id'
    email: 'email'
    phone: 'phone'
    username: 'username'
    nickname: 'nickname'
    password: 'password'
    avatar_url: 'avatar_url'
    website: 'website'
    role: 'role'
    status: 'status'
  }

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]

  export const UserConfigScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    allowEmailNotify: 'allowEmailNotify'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type UserConfigScalarFieldEnum = (typeof UserConfigScalarFieldEnum)[keyof typeof UserConfigScalarFieldEnum]

  export const AccessTokenScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    token: 'token'
    roles: 'roles'
    status: 'status'
    scope: 'scope'
    isRevoked: 'isRevoked'
    ip: 'ip'
    expiresAt: 'expiresAt'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type AccessTokenScalarFieldEnum = (typeof AccessTokenScalarFieldEnum)[keyof typeof AccessTokenScalarFieldEnum]

  export const OAuthScalarFieldEnum: {
    id: 'id'
    userId: 'userId'
    provider: 'provider'
    providerId: 'providerId'
    providerUnionId: 'providerUnionId'
    providerToken: 'providerToken'
    providerRefreshToken: 'providerRefreshToken'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type OAuthScalarFieldEnum = (typeof OAuthScalarFieldEnum)[keyof typeof OAuthScalarFieldEnum]

  export const BlogCommentScalarFieldEnum: {
    id: 'id'
    content: 'content'
    create_ts: 'create_ts'
    updated_ts: 'updated_ts'
    type: 'type'
    quoteContent: 'quoteContent'
    article_id: 'article_id'
    user_id: 'user_id'
    visitorName: 'visitorName'
    memo_id: 'memo_id'
  }

  export type BlogCommentScalarFieldEnum = (typeof BlogCommentScalarFieldEnum)[keyof typeof BlogCommentScalarFieldEnum]

  export const BlogExplainScalarFieldEnum: {
    id: 'id'
    create_ts: 'create_ts'
    updated_ts: 'updated_ts'
    text: 'text'
    content: 'content'
    article_id: 'article_id'
  }

  export type BlogExplainScalarFieldEnum = (typeof BlogExplainScalarFieldEnum)[keyof typeof BlogExplainScalarFieldEnum]

  export const BlogSubCommentScalarFieldEnum: {
    id: 'id'
    content: 'content'
    create_ts: 'create_ts'
    updated_ts: 'updated_ts'
    comment_id: 'comment_id'
    reply_sub_comment_id: 'reply_sub_comment_id'
    user_id: 'user_id'
  }

  export type BlogSubCommentScalarFieldEnum = (typeof BlogSubCommentScalarFieldEnum)[keyof typeof BlogSubCommentScalarFieldEnum]

  export const BlogLikeScalarFieldEnum: {
    id: 'id'
    create_ts: 'create_ts'
    updated_ts: 'updated_ts'
    target: 'target'
    article_id: 'article_id'
    sub_comment_id: 'sub_comment_id'
    comment_id: 'comment_id'
    user_id: 'user_id'
    blogMemoId: 'blogMemoId'
  }

  export type BlogLikeScalarFieldEnum = (typeof BlogLikeScalarFieldEnum)[keyof typeof BlogLikeScalarFieldEnum]

  export const BlogMemoScalarFieldEnum: {
    id: 'id'
    content: 'content'
    create_ts: 'create_ts'
    updated_ts: 'updated_ts'
    visible: 'visible'
    defalt_floded: 'defalt_floded'
    flod_tip: 'flod_tip'
    user_id: 'user_id'
    from: 'from'
    courier: 'courier'
  }

  export type BlogMemoScalarFieldEnum = (typeof BlogMemoScalarFieldEnum)[keyof typeof BlogMemoScalarFieldEnum]

  export const MemoTagScalarFieldEnum: {
    id: 'id'
    tag_name: 'tag_name'
    create_ts: 'create_ts'
    updated_ts: 'updated_ts'
    user_id: 'user_id'
  }

  export type MemoTagScalarFieldEnum = (typeof MemoTagScalarFieldEnum)[keyof typeof MemoTagScalarFieldEnum]

  export const MemoTagRelationsScalarFieldEnum: {
    tagId: 'tagId'
    memoId: 'memoId'
    create_ts: 'create_ts'
    updated_ts: 'updated_ts'
  }

  export type MemoTagRelationsScalarFieldEnum = (typeof MemoTagRelationsScalarFieldEnum)[keyof typeof MemoTagRelationsScalarFieldEnum]

  export const GarminActivityScalarFieldEnum: {
    id: 'id'
    activityType: 'activityType'
    date: 'date'
    isFavorite: 'isFavorite'
    title: 'title'
    distance: 'distance'
    calories: 'calories'
    duration: 'duration'
    movingTime: 'movingTime'
    elapsedTime: 'elapsedTime'
    avgHr: 'avgHr'
    maxHr: 'maxHr'
    aerobicEffect: 'aerobicEffect'
    trainingStressScore: 'trainingStressScore'
    avgPace: 'avgPace'
    bestPace: 'bestPace'
    totalStrokes: 'totalStrokes'
    avgSwolf: 'avgSwolf'
    avgStrokeRate: 'avgStrokeRate'
    steps: 'steps'
    totalReps: 'totalReps'
    totalSets: 'totalSets'
    isGrit: 'isGrit'
    bestLapTime: 'bestLapTime'
    lapCount: 'lapCount'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type GarminActivityScalarFieldEnum = (typeof GarminActivityScalarFieldEnum)[keyof typeof GarminActivityScalarFieldEnum]

  export const SortOrder: {
    asc: 'asc'
    desc: 'desc'
  }

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

  export const NullsOrder: {
    first: 'first'
    last: 'last'
  }

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]

  export const UserOrderByRelevanceFieldEnum: {
    id: 'id'
    email: 'email'
    phone: 'phone'
    username: 'username'
    nickname: 'nickname'
    password: 'password'
    avatar_url: 'avatar_url'
    website: 'website'
    role: 'role'
  }

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]

  export const UserConfigOrderByRelevanceFieldEnum: {
    id: 'id'
    userId: 'userId'
  }

  export type UserConfigOrderByRelevanceFieldEnum = (typeof UserConfigOrderByRelevanceFieldEnum)[keyof typeof UserConfigOrderByRelevanceFieldEnum]

  export const AccessTokenOrderByRelevanceFieldEnum: {
    id: 'id'
    userId: 'userId'
    token: 'token'
    roles: 'roles'
    scope: 'scope'
    ip: 'ip'
  }

  export type AccessTokenOrderByRelevanceFieldEnum = (typeof AccessTokenOrderByRelevanceFieldEnum)[keyof typeof AccessTokenOrderByRelevanceFieldEnum]

  export const OAuthOrderByRelevanceFieldEnum: {
    id: 'id'
    userId: 'userId'
    provider: 'provider'
    providerId: 'providerId'
    providerUnionId: 'providerUnionId'
    providerToken: 'providerToken'
    providerRefreshToken: 'providerRefreshToken'
  }

  export type OAuthOrderByRelevanceFieldEnum = (typeof OAuthOrderByRelevanceFieldEnum)[keyof typeof OAuthOrderByRelevanceFieldEnum]

  export const BlogCommentOrderByRelevanceFieldEnum: {
    id: 'id'
    content: 'content'
    type: 'type'
    quoteContent: 'quoteContent'
    article_id: 'article_id'
    user_id: 'user_id'
    visitorName: 'visitorName'
    memo_id: 'memo_id'
  }

  export type BlogCommentOrderByRelevanceFieldEnum = (typeof BlogCommentOrderByRelevanceFieldEnum)[keyof typeof BlogCommentOrderByRelevanceFieldEnum]

  export const BlogExplainOrderByRelevanceFieldEnum: {
    id: 'id'
    text: 'text'
    content: 'content'
    article_id: 'article_id'
  }

  export type BlogExplainOrderByRelevanceFieldEnum = (typeof BlogExplainOrderByRelevanceFieldEnum)[keyof typeof BlogExplainOrderByRelevanceFieldEnum]

  export const BlogSubCommentOrderByRelevanceFieldEnum: {
    id: 'id'
    content: 'content'
    comment_id: 'comment_id'
    reply_sub_comment_id: 'reply_sub_comment_id'
    user_id: 'user_id'
  }

  export type BlogSubCommentOrderByRelevanceFieldEnum = (typeof BlogSubCommentOrderByRelevanceFieldEnum)[keyof typeof BlogSubCommentOrderByRelevanceFieldEnum]

  export const BlogLikeOrderByRelevanceFieldEnum: {
    target: 'target'
    article_id: 'article_id'
    sub_comment_id: 'sub_comment_id'
    comment_id: 'comment_id'
    user_id: 'user_id'
    blogMemoId: 'blogMemoId'
  }

  export type BlogLikeOrderByRelevanceFieldEnum = (typeof BlogLikeOrderByRelevanceFieldEnum)[keyof typeof BlogLikeOrderByRelevanceFieldEnum]

  export const BlogMemoOrderByRelevanceFieldEnum: {
    id: 'id'
    content: 'content'
    visible: 'visible'
    flod_tip: 'flod_tip'
    user_id: 'user_id'
    from: 'from'
    courier: 'courier'
  }

  export type BlogMemoOrderByRelevanceFieldEnum = (typeof BlogMemoOrderByRelevanceFieldEnum)[keyof typeof BlogMemoOrderByRelevanceFieldEnum]

  export const MemoTagOrderByRelevanceFieldEnum: {
    id: 'id'
    tag_name: 'tag_name'
    user_id: 'user_id'
  }

  export type MemoTagOrderByRelevanceFieldEnum = (typeof MemoTagOrderByRelevanceFieldEnum)[keyof typeof MemoTagOrderByRelevanceFieldEnum]

  export const MemoTagRelationsOrderByRelevanceFieldEnum: {
    tagId: 'tagId'
    memoId: 'memoId'
  }

  export type MemoTagRelationsOrderByRelevanceFieldEnum = (typeof MemoTagRelationsOrderByRelevanceFieldEnum)[keyof typeof MemoTagRelationsOrderByRelevanceFieldEnum]

  export const GarminActivityOrderByRelevanceFieldEnum: {
    id: 'id'
    activityType: 'activityType'
    title: 'title'
  }

  export type GarminActivityOrderByRelevanceFieldEnum = (typeof GarminActivityOrderByRelevanceFieldEnum)[keyof typeof GarminActivityOrderByRelevanceFieldEnum]

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>

  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>

  /**
   * Deep Input Types
   */

  export interface UserWhereInput {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<'User'> | string
    email?: StringNullableFilter<'User'> | string | null
    phone?: StringNullableFilter<'User'> | string | null
    username?: StringFilter<'User'> | string
    nickname?: StringNullableFilter<'User'> | string | null
    password?: StringFilter<'User'> | string
    avatar_url?: StringNullableFilter<'User'> | string | null
    website?: StringNullableFilter<'User'> | string | null
    role?: StringFilter<'User'> | string
    status?: IntFilter<'User'> | number
    comments?: BlogCommentListRelationFilter
    sub_comments?: BlogSubCommentListRelationFilter
    likes?: BlogLikeListRelationFilter
    oauth?: OAuthListRelationFilter
    tokens?: AccessTokenListRelationFilter
    user_config?: XOR<UserConfigNullableScalarRelationFilter, UserConfigWhereInput> | null
    memos?: BlogMemoListRelationFilter
    tags?: MemoTagListRelationFilter
  }

  export interface UserOrderByWithRelationInput {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    username?: SortOrder
    nickname?: SortOrderInput | SortOrder
    password?: SortOrder
    avatar_url?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    role?: SortOrder
    status?: SortOrder
    comments?: BlogCommentOrderByRelationAggregateInput
    sub_comments?: BlogSubCommentOrderByRelationAggregateInput
    likes?: BlogLikeOrderByRelationAggregateInput
    oauth?: OAuthOrderByRelationAggregateInput
    tokens?: AccessTokenOrderByRelationAggregateInput
    user_config?: UserConfigOrderByWithRelationInput
    memos?: BlogMemoOrderByRelationAggregateInput
    tags?: MemoTagOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    nickname?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    email?: StringNullableFilter<'User'> | string | null
    phone?: StringNullableFilter<'User'> | string | null
    password?: StringFilter<'User'> | string
    avatar_url?: StringNullableFilter<'User'> | string | null
    website?: StringNullableFilter<'User'> | string | null
    role?: StringFilter<'User'> | string
    status?: IntFilter<'User'> | number
    comments?: BlogCommentListRelationFilter
    sub_comments?: BlogSubCommentListRelationFilter
    likes?: BlogLikeListRelationFilter
    oauth?: OAuthListRelationFilter
    tokens?: AccessTokenListRelationFilter
    user_config?: XOR<UserConfigNullableScalarRelationFilter, UserConfigWhereInput> | null
    memos?: BlogMemoListRelationFilter
    tags?: MemoTagListRelationFilter
  }, 'id' | 'username' | 'nickname'>

  export interface UserOrderByWithAggregationInput {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    username?: SortOrder
    nickname?: SortOrderInput | SortOrder
    password?: SortOrder
    avatar_url?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    role?: SortOrder
    status?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export interface UserScalarWhereWithAggregatesInput {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'User'> | string
    email?: StringNullableWithAggregatesFilter<'User'> | string | null
    phone?: StringNullableWithAggregatesFilter<'User'> | string | null
    username?: StringWithAggregatesFilter<'User'> | string
    nickname?: StringNullableWithAggregatesFilter<'User'> | string | null
    password?: StringWithAggregatesFilter<'User'> | string
    avatar_url?: StringNullableWithAggregatesFilter<'User'> | string | null
    website?: StringNullableWithAggregatesFilter<'User'> | string | null
    role?: StringWithAggregatesFilter<'User'> | string
    status?: IntWithAggregatesFilter<'User'> | number
  }

  export interface UserConfigWhereInput {
    AND?: UserConfigWhereInput | UserConfigWhereInput[]
    OR?: UserConfigWhereInput[]
    NOT?: UserConfigWhereInput | UserConfigWhereInput[]
    id?: StringFilter<'UserConfig'> | string
    userId?: StringFilter<'UserConfig'> | string
    allowEmailNotify?: IntNullableFilter<'UserConfig'> | number | null
    createdAt?: DateTimeFilter<'UserConfig'> | Date | string
    updatedAt?: DateTimeFilter<'UserConfig'> | Date | string
    userInfo?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export interface UserConfigOrderByWithRelationInput {
    id?: SortOrder
    userId?: SortOrder
    allowEmailNotify?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userInfo?: UserOrderByWithRelationInput
    _relevance?: UserConfigOrderByRelevanceInput
  }

  export type UserConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserConfigWhereInput | UserConfigWhereInput[]
    OR?: UserConfigWhereInput[]
    NOT?: UserConfigWhereInput | UserConfigWhereInput[]
    allowEmailNotify?: IntNullableFilter<'UserConfig'> | number | null
    createdAt?: DateTimeFilter<'UserConfig'> | Date | string
    updatedAt?: DateTimeFilter<'UserConfig'> | Date | string
    userInfo?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, 'id' | 'userId'>

  export interface UserConfigOrderByWithAggregationInput {
    id?: SortOrder
    userId?: SortOrder
    allowEmailNotify?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserConfigCountOrderByAggregateInput
    _avg?: UserConfigAvgOrderByAggregateInput
    _max?: UserConfigMaxOrderByAggregateInput
    _min?: UserConfigMinOrderByAggregateInput
    _sum?: UserConfigSumOrderByAggregateInput
  }

  export interface UserConfigScalarWhereWithAggregatesInput {
    AND?: UserConfigScalarWhereWithAggregatesInput | UserConfigScalarWhereWithAggregatesInput[]
    OR?: UserConfigScalarWhereWithAggregatesInput[]
    NOT?: UserConfigScalarWhereWithAggregatesInput | UserConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'UserConfig'> | string
    userId?: StringWithAggregatesFilter<'UserConfig'> | string
    allowEmailNotify?: IntNullableWithAggregatesFilter<'UserConfig'> | number | null
    createdAt?: DateTimeWithAggregatesFilter<'UserConfig'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'UserConfig'> | Date | string
  }

  export interface AccessTokenWhereInput {
    AND?: AccessTokenWhereInput | AccessTokenWhereInput[]
    OR?: AccessTokenWhereInput[]
    NOT?: AccessTokenWhereInput | AccessTokenWhereInput[]
    id?: StringFilter<'AccessToken'> | string
    userId?: StringFilter<'AccessToken'> | string
    token?: StringFilter<'AccessToken'> | string
    roles?: StringFilter<'AccessToken'> | string
    status?: IntFilter<'AccessToken'> | number
    scope?: StringFilter<'AccessToken'> | string
    isRevoked?: BoolFilter<'AccessToken'> | boolean
    ip?: StringNullableFilter<'AccessToken'> | string | null
    expiresAt?: DateTimeFilter<'AccessToken'> | Date | string
    createdAt?: DateTimeFilter<'AccessToken'> | Date | string
    updatedAt?: DateTimeFilter<'AccessToken'> | Date | string
    userInfo?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export interface AccessTokenOrderByWithRelationInput {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    roles?: SortOrder
    status?: SortOrder
    scope?: SortOrder
    isRevoked?: SortOrder
    ip?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userInfo?: UserOrderByWithRelationInput
    _relevance?: AccessTokenOrderByRelevanceInput
  }

  export type AccessTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: AccessTokenWhereInput | AccessTokenWhereInput[]
    OR?: AccessTokenWhereInput[]
    NOT?: AccessTokenWhereInput | AccessTokenWhereInput[]
    userId?: StringFilter<'AccessToken'> | string
    roles?: StringFilter<'AccessToken'> | string
    status?: IntFilter<'AccessToken'> | number
    scope?: StringFilter<'AccessToken'> | string
    isRevoked?: BoolFilter<'AccessToken'> | boolean
    ip?: StringNullableFilter<'AccessToken'> | string | null
    expiresAt?: DateTimeFilter<'AccessToken'> | Date | string
    createdAt?: DateTimeFilter<'AccessToken'> | Date | string
    updatedAt?: DateTimeFilter<'AccessToken'> | Date | string
    userInfo?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, 'id' | 'token'>

  export interface AccessTokenOrderByWithAggregationInput {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    roles?: SortOrder
    status?: SortOrder
    scope?: SortOrder
    isRevoked?: SortOrder
    ip?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccessTokenCountOrderByAggregateInput
    _avg?: AccessTokenAvgOrderByAggregateInput
    _max?: AccessTokenMaxOrderByAggregateInput
    _min?: AccessTokenMinOrderByAggregateInput
    _sum?: AccessTokenSumOrderByAggregateInput
  }

  export interface AccessTokenScalarWhereWithAggregatesInput {
    AND?: AccessTokenScalarWhereWithAggregatesInput | AccessTokenScalarWhereWithAggregatesInput[]
    OR?: AccessTokenScalarWhereWithAggregatesInput[]
    NOT?: AccessTokenScalarWhereWithAggregatesInput | AccessTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'AccessToken'> | string
    userId?: StringWithAggregatesFilter<'AccessToken'> | string
    token?: StringWithAggregatesFilter<'AccessToken'> | string
    roles?: StringWithAggregatesFilter<'AccessToken'> | string
    status?: IntWithAggregatesFilter<'AccessToken'> | number
    scope?: StringWithAggregatesFilter<'AccessToken'> | string
    isRevoked?: BoolWithAggregatesFilter<'AccessToken'> | boolean
    ip?: StringNullableWithAggregatesFilter<'AccessToken'> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<'AccessToken'> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<'AccessToken'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'AccessToken'> | Date | string
  }

  export interface OAuthWhereInput {
    AND?: OAuthWhereInput | OAuthWhereInput[]
    OR?: OAuthWhereInput[]
    NOT?: OAuthWhereInput | OAuthWhereInput[]
    id?: StringFilter<'OAuth'> | string
    userId?: StringNullableFilter<'OAuth'> | string | null
    provider?: StringFilter<'OAuth'> | string
    providerId?: StringFilter<'OAuth'> | string
    providerUnionId?: StringNullableFilter<'OAuth'> | string | null
    providerToken?: StringNullableFilter<'OAuth'> | string | null
    providerRefreshToken?: StringNullableFilter<'OAuth'> | string | null
    createdAt?: DateTimeFilter<'OAuth'> | Date | string
    updatedAt?: DateTimeFilter<'OAuth'> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export interface OAuthOrderByWithRelationInput {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    provider?: SortOrder
    providerId?: SortOrder
    providerUnionId?: SortOrderInput | SortOrder
    providerToken?: SortOrderInput | SortOrder
    providerRefreshToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: OAuthOrderByRelevanceInput
  }

  export type OAuthWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerId?: OAuthProviderProviderIdCompoundUniqueInput
    AND?: OAuthWhereInput | OAuthWhereInput[]
    OR?: OAuthWhereInput[]
    NOT?: OAuthWhereInput | OAuthWhereInput[]
    userId?: StringNullableFilter<'OAuth'> | string | null
    provider?: StringFilter<'OAuth'> | string
    providerId?: StringFilter<'OAuth'> | string
    providerUnionId?: StringNullableFilter<'OAuth'> | string | null
    providerToken?: StringNullableFilter<'OAuth'> | string | null
    providerRefreshToken?: StringNullableFilter<'OAuth'> | string | null
    createdAt?: DateTimeFilter<'OAuth'> | Date | string
    updatedAt?: DateTimeFilter<'OAuth'> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, 'id' | 'provider_providerId'>

  export interface OAuthOrderByWithAggregationInput {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    provider?: SortOrder
    providerId?: SortOrder
    providerUnionId?: SortOrderInput | SortOrder
    providerToken?: SortOrderInput | SortOrder
    providerRefreshToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OAuthCountOrderByAggregateInput
    _max?: OAuthMaxOrderByAggregateInput
    _min?: OAuthMinOrderByAggregateInput
  }

  export interface OAuthScalarWhereWithAggregatesInput {
    AND?: OAuthScalarWhereWithAggregatesInput | OAuthScalarWhereWithAggregatesInput[]
    OR?: OAuthScalarWhereWithAggregatesInput[]
    NOT?: OAuthScalarWhereWithAggregatesInput | OAuthScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'OAuth'> | string
    userId?: StringNullableWithAggregatesFilter<'OAuth'> | string | null
    provider?: StringWithAggregatesFilter<'OAuth'> | string
    providerId?: StringWithAggregatesFilter<'OAuth'> | string
    providerUnionId?: StringNullableWithAggregatesFilter<'OAuth'> | string | null
    providerToken?: StringNullableWithAggregatesFilter<'OAuth'> | string | null
    providerRefreshToken?: StringNullableWithAggregatesFilter<'OAuth'> | string | null
    createdAt?: DateTimeWithAggregatesFilter<'OAuth'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'OAuth'> | Date | string
  }

  export interface BlogCommentWhereInput {
    AND?: BlogCommentWhereInput | BlogCommentWhereInput[]
    OR?: BlogCommentWhereInput[]
    NOT?: BlogCommentWhereInput | BlogCommentWhereInput[]
    id?: StringFilter<'BlogComment'> | string
    content?: StringFilter<'BlogComment'> | string
    create_ts?: DateTimeFilter<'BlogComment'> | Date | string
    updated_ts?: DateTimeFilter<'BlogComment'> | Date | string
    type?: StringFilter<'BlogComment'> | string
    quoteContent?: StringNullableFilter<'BlogComment'> | string | null
    article_id?: StringNullableFilter<'BlogComment'> | string | null
    user_id?: StringNullableFilter<'BlogComment'> | string | null
    visitorName?: StringNullableFilter<'BlogComment'> | string | null
    memo_id?: StringNullableFilter<'BlogComment'> | string | null
    user_info?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    sub_comments?: BlogSubCommentListRelationFilter
    likes?: BlogLikeListRelationFilter
    memo_info?: XOR<BlogMemoNullableScalarRelationFilter, BlogMemoWhereInput> | null
  }

  export interface BlogCommentOrderByWithRelationInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    type?: SortOrder
    quoteContent?: SortOrderInput | SortOrder
    article_id?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    visitorName?: SortOrderInput | SortOrder
    memo_id?: SortOrderInput | SortOrder
    user_info?: UserOrderByWithRelationInput
    sub_comments?: BlogSubCommentOrderByRelationAggregateInput
    likes?: BlogLikeOrderByRelationAggregateInput
    memo_info?: BlogMemoOrderByWithRelationInput
    _relevance?: BlogCommentOrderByRelevanceInput
  }

  export type BlogCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BlogCommentWhereInput | BlogCommentWhereInput[]
    OR?: BlogCommentWhereInput[]
    NOT?: BlogCommentWhereInput | BlogCommentWhereInput[]
    content?: StringFilter<'BlogComment'> | string
    create_ts?: DateTimeFilter<'BlogComment'> | Date | string
    updated_ts?: DateTimeFilter<'BlogComment'> | Date | string
    type?: StringFilter<'BlogComment'> | string
    quoteContent?: StringNullableFilter<'BlogComment'> | string | null
    article_id?: StringNullableFilter<'BlogComment'> | string | null
    user_id?: StringNullableFilter<'BlogComment'> | string | null
    visitorName?: StringNullableFilter<'BlogComment'> | string | null
    memo_id?: StringNullableFilter<'BlogComment'> | string | null
    user_info?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    sub_comments?: BlogSubCommentListRelationFilter
    likes?: BlogLikeListRelationFilter
    memo_info?: XOR<BlogMemoNullableScalarRelationFilter, BlogMemoWhereInput> | null
  }, 'id'>

  export interface BlogCommentOrderByWithAggregationInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    type?: SortOrder
    quoteContent?: SortOrderInput | SortOrder
    article_id?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    visitorName?: SortOrderInput | SortOrder
    memo_id?: SortOrderInput | SortOrder
    _count?: BlogCommentCountOrderByAggregateInput
    _max?: BlogCommentMaxOrderByAggregateInput
    _min?: BlogCommentMinOrderByAggregateInput
  }

  export interface BlogCommentScalarWhereWithAggregatesInput {
    AND?: BlogCommentScalarWhereWithAggregatesInput | BlogCommentScalarWhereWithAggregatesInput[]
    OR?: BlogCommentScalarWhereWithAggregatesInput[]
    NOT?: BlogCommentScalarWhereWithAggregatesInput | BlogCommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'BlogComment'> | string
    content?: StringWithAggregatesFilter<'BlogComment'> | string
    create_ts?: DateTimeWithAggregatesFilter<'BlogComment'> | Date | string
    updated_ts?: DateTimeWithAggregatesFilter<'BlogComment'> | Date | string
    type?: StringWithAggregatesFilter<'BlogComment'> | string
    quoteContent?: StringNullableWithAggregatesFilter<'BlogComment'> | string | null
    article_id?: StringNullableWithAggregatesFilter<'BlogComment'> | string | null
    user_id?: StringNullableWithAggregatesFilter<'BlogComment'> | string | null
    visitorName?: StringNullableWithAggregatesFilter<'BlogComment'> | string | null
    memo_id?: StringNullableWithAggregatesFilter<'BlogComment'> | string | null
  }

  export interface BlogExplainWhereInput {
    AND?: BlogExplainWhereInput | BlogExplainWhereInput[]
    OR?: BlogExplainWhereInput[]
    NOT?: BlogExplainWhereInput | BlogExplainWhereInput[]
    id?: StringFilter<'BlogExplain'> | string
    create_ts?: DateTimeFilter<'BlogExplain'> | Date | string
    updated_ts?: DateTimeFilter<'BlogExplain'> | Date | string
    text?: StringFilter<'BlogExplain'> | string
    content?: StringFilter<'BlogExplain'> | string
    article_id?: StringFilter<'BlogExplain'> | string
  }

  export interface BlogExplainOrderByWithRelationInput {
    id?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    text?: SortOrder
    content?: SortOrder
    article_id?: SortOrder
    _relevance?: BlogExplainOrderByRelevanceInput
  }

  export type BlogExplainWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BlogExplainWhereInput | BlogExplainWhereInput[]
    OR?: BlogExplainWhereInput[]
    NOT?: BlogExplainWhereInput | BlogExplainWhereInput[]
    create_ts?: DateTimeFilter<'BlogExplain'> | Date | string
    updated_ts?: DateTimeFilter<'BlogExplain'> | Date | string
    text?: StringFilter<'BlogExplain'> | string
    content?: StringFilter<'BlogExplain'> | string
    article_id?: StringFilter<'BlogExplain'> | string
  }, 'id'>

  export interface BlogExplainOrderByWithAggregationInput {
    id?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    text?: SortOrder
    content?: SortOrder
    article_id?: SortOrder
    _count?: BlogExplainCountOrderByAggregateInput
    _max?: BlogExplainMaxOrderByAggregateInput
    _min?: BlogExplainMinOrderByAggregateInput
  }

  export interface BlogExplainScalarWhereWithAggregatesInput {
    AND?: BlogExplainScalarWhereWithAggregatesInput | BlogExplainScalarWhereWithAggregatesInput[]
    OR?: BlogExplainScalarWhereWithAggregatesInput[]
    NOT?: BlogExplainScalarWhereWithAggregatesInput | BlogExplainScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'BlogExplain'> | string
    create_ts?: DateTimeWithAggregatesFilter<'BlogExplain'> | Date | string
    updated_ts?: DateTimeWithAggregatesFilter<'BlogExplain'> | Date | string
    text?: StringWithAggregatesFilter<'BlogExplain'> | string
    content?: StringWithAggregatesFilter<'BlogExplain'> | string
    article_id?: StringWithAggregatesFilter<'BlogExplain'> | string
  }

  export interface BlogSubCommentWhereInput {
    AND?: BlogSubCommentWhereInput | BlogSubCommentWhereInput[]
    OR?: BlogSubCommentWhereInput[]
    NOT?: BlogSubCommentWhereInput | BlogSubCommentWhereInput[]
    id?: StringFilter<'BlogSubComment'> | string
    content?: StringFilter<'BlogSubComment'> | string
    create_ts?: DateTimeFilter<'BlogSubComment'> | Date | string
    updated_ts?: DateTimeFilter<'BlogSubComment'> | Date | string
    comment_id?: StringFilter<'BlogSubComment'> | string
    reply_sub_comment_id?: StringNullableFilter<'BlogSubComment'> | string | null
    user_id?: StringNullableFilter<'BlogSubComment'> | string | null
    comment_info?: XOR<BlogCommentScalarRelationFilter, BlogCommentWhereInput>
    user_info?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    likes?: BlogLikeListRelationFilter
  }

  export interface BlogSubCommentOrderByWithRelationInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    comment_id?: SortOrder
    reply_sub_comment_id?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    comment_info?: BlogCommentOrderByWithRelationInput
    user_info?: UserOrderByWithRelationInput
    likes?: BlogLikeOrderByRelationAggregateInput
    _relevance?: BlogSubCommentOrderByRelevanceInput
  }

  export type BlogSubCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BlogSubCommentWhereInput | BlogSubCommentWhereInput[]
    OR?: BlogSubCommentWhereInput[]
    NOT?: BlogSubCommentWhereInput | BlogSubCommentWhereInput[]
    content?: StringFilter<'BlogSubComment'> | string
    create_ts?: DateTimeFilter<'BlogSubComment'> | Date | string
    updated_ts?: DateTimeFilter<'BlogSubComment'> | Date | string
    comment_id?: StringFilter<'BlogSubComment'> | string
    reply_sub_comment_id?: StringNullableFilter<'BlogSubComment'> | string | null
    user_id?: StringNullableFilter<'BlogSubComment'> | string | null
    comment_info?: XOR<BlogCommentScalarRelationFilter, BlogCommentWhereInput>
    user_info?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    likes?: BlogLikeListRelationFilter
  }, 'id'>

  export interface BlogSubCommentOrderByWithAggregationInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    comment_id?: SortOrder
    reply_sub_comment_id?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    _count?: BlogSubCommentCountOrderByAggregateInput
    _max?: BlogSubCommentMaxOrderByAggregateInput
    _min?: BlogSubCommentMinOrderByAggregateInput
  }

  export interface BlogSubCommentScalarWhereWithAggregatesInput {
    AND?: BlogSubCommentScalarWhereWithAggregatesInput | BlogSubCommentScalarWhereWithAggregatesInput[]
    OR?: BlogSubCommentScalarWhereWithAggregatesInput[]
    NOT?: BlogSubCommentScalarWhereWithAggregatesInput | BlogSubCommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'BlogSubComment'> | string
    content?: StringWithAggregatesFilter<'BlogSubComment'> | string
    create_ts?: DateTimeWithAggregatesFilter<'BlogSubComment'> | Date | string
    updated_ts?: DateTimeWithAggregatesFilter<'BlogSubComment'> | Date | string
    comment_id?: StringWithAggregatesFilter<'BlogSubComment'> | string
    reply_sub_comment_id?: StringNullableWithAggregatesFilter<'BlogSubComment'> | string | null
    user_id?: StringNullableWithAggregatesFilter<'BlogSubComment'> | string | null
  }

  export interface BlogLikeWhereInput {
    AND?: BlogLikeWhereInput | BlogLikeWhereInput[]
    OR?: BlogLikeWhereInput[]
    NOT?: BlogLikeWhereInput | BlogLikeWhereInput[]
    id?: IntFilter<'BlogLike'> | number
    create_ts?: DateTimeFilter<'BlogLike'> | Date | string
    updated_ts?: DateTimeFilter<'BlogLike'> | Date | string
    target?: StringFilter<'BlogLike'> | string
    article_id?: StringNullableFilter<'BlogLike'> | string | null
    sub_comment_id?: StringNullableFilter<'BlogLike'> | string | null
    comment_id?: StringNullableFilter<'BlogLike'> | string | null
    user_id?: StringFilter<'BlogLike'> | string
    blogMemoId?: StringNullableFilter<'BlogLike'> | string | null
    sub_comment_info?: XOR<BlogSubCommentNullableScalarRelationFilter, BlogSubCommentWhereInput> | null
    comment_info?: XOR<BlogCommentNullableScalarRelationFilter, BlogCommentWhereInput> | null
    user_info?: XOR<UserScalarRelationFilter, UserWhereInput>
    blogMemoInfo?: XOR<BlogMemoNullableScalarRelationFilter, BlogMemoWhereInput> | null
  }

  export interface BlogLikeOrderByWithRelationInput {
    id?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    target?: SortOrder
    article_id?: SortOrderInput | SortOrder
    sub_comment_id?: SortOrderInput | SortOrder
    comment_id?: SortOrderInput | SortOrder
    user_id?: SortOrder
    blogMemoId?: SortOrderInput | SortOrder
    sub_comment_info?: BlogSubCommentOrderByWithRelationInput
    comment_info?: BlogCommentOrderByWithRelationInput
    user_info?: UserOrderByWithRelationInput
    blogMemoInfo?: BlogMemoOrderByWithRelationInput
    _relevance?: BlogLikeOrderByRelevanceInput
  }

  export type BlogLikeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: BlogLikeWhereInput | BlogLikeWhereInput[]
    OR?: BlogLikeWhereInput[]
    NOT?: BlogLikeWhereInput | BlogLikeWhereInput[]
    create_ts?: DateTimeFilter<'BlogLike'> | Date | string
    updated_ts?: DateTimeFilter<'BlogLike'> | Date | string
    target?: StringFilter<'BlogLike'> | string
    article_id?: StringNullableFilter<'BlogLike'> | string | null
    sub_comment_id?: StringNullableFilter<'BlogLike'> | string | null
    comment_id?: StringNullableFilter<'BlogLike'> | string | null
    user_id?: StringFilter<'BlogLike'> | string
    blogMemoId?: StringNullableFilter<'BlogLike'> | string | null
    sub_comment_info?: XOR<BlogSubCommentNullableScalarRelationFilter, BlogSubCommentWhereInput> | null
    comment_info?: XOR<BlogCommentNullableScalarRelationFilter, BlogCommentWhereInput> | null
    user_info?: XOR<UserScalarRelationFilter, UserWhereInput>
    blogMemoInfo?: XOR<BlogMemoNullableScalarRelationFilter, BlogMemoWhereInput> | null
  }, 'id'>

  export interface BlogLikeOrderByWithAggregationInput {
    id?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    target?: SortOrder
    article_id?: SortOrderInput | SortOrder
    sub_comment_id?: SortOrderInput | SortOrder
    comment_id?: SortOrderInput | SortOrder
    user_id?: SortOrder
    blogMemoId?: SortOrderInput | SortOrder
    _count?: BlogLikeCountOrderByAggregateInput
    _avg?: BlogLikeAvgOrderByAggregateInput
    _max?: BlogLikeMaxOrderByAggregateInput
    _min?: BlogLikeMinOrderByAggregateInput
    _sum?: BlogLikeSumOrderByAggregateInput
  }

  export interface BlogLikeScalarWhereWithAggregatesInput {
    AND?: BlogLikeScalarWhereWithAggregatesInput | BlogLikeScalarWhereWithAggregatesInput[]
    OR?: BlogLikeScalarWhereWithAggregatesInput[]
    NOT?: BlogLikeScalarWhereWithAggregatesInput | BlogLikeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'BlogLike'> | number
    create_ts?: DateTimeWithAggregatesFilter<'BlogLike'> | Date | string
    updated_ts?: DateTimeWithAggregatesFilter<'BlogLike'> | Date | string
    target?: StringWithAggregatesFilter<'BlogLike'> | string
    article_id?: StringNullableWithAggregatesFilter<'BlogLike'> | string | null
    sub_comment_id?: StringNullableWithAggregatesFilter<'BlogLike'> | string | null
    comment_id?: StringNullableWithAggregatesFilter<'BlogLike'> | string | null
    user_id?: StringWithAggregatesFilter<'BlogLike'> | string
    blogMemoId?: StringNullableWithAggregatesFilter<'BlogLike'> | string | null
  }

  export interface BlogMemoWhereInput {
    AND?: BlogMemoWhereInput | BlogMemoWhereInput[]
    OR?: BlogMemoWhereInput[]
    NOT?: BlogMemoWhereInput | BlogMemoWhereInput[]
    id?: StringFilter<'BlogMemo'> | string
    content?: StringNullableFilter<'BlogMemo'> | string | null
    create_ts?: DateTimeFilter<'BlogMemo'> | Date | string
    updated_ts?: DateTimeFilter<'BlogMemo'> | Date | string
    visible?: StringFilter<'BlogMemo'> | string
    defalt_floded?: BoolFilter<'BlogMemo'> | boolean
    flod_tip?: StringNullableFilter<'BlogMemo'> | string | null
    user_id?: StringFilter<'BlogMemo'> | string
    from?: StringNullableFilter<'BlogMemo'> | string | null
    courier?: StringNullableFilter<'BlogMemo'> | string | null
    user_info?: XOR<UserScalarRelationFilter, UserWhereInput>
    tags?: MemoTagRelationsListRelationFilter
    comments?: BlogCommentListRelationFilter
    likes?: BlogLikeListRelationFilter
  }

  export interface BlogMemoOrderByWithRelationInput {
    id?: SortOrder
    content?: SortOrderInput | SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    visible?: SortOrder
    defalt_floded?: SortOrder
    flod_tip?: SortOrderInput | SortOrder
    user_id?: SortOrder
    from?: SortOrderInput | SortOrder
    courier?: SortOrderInput | SortOrder
    user_info?: UserOrderByWithRelationInput
    tags?: MemoTagRelationsOrderByRelationAggregateInput
    comments?: BlogCommentOrderByRelationAggregateInput
    likes?: BlogLikeOrderByRelationAggregateInput
    _relevance?: BlogMemoOrderByRelevanceInput
  }

  export type BlogMemoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BlogMemoWhereInput | BlogMemoWhereInput[]
    OR?: BlogMemoWhereInput[]
    NOT?: BlogMemoWhereInput | BlogMemoWhereInput[]
    content?: StringNullableFilter<'BlogMemo'> | string | null
    create_ts?: DateTimeFilter<'BlogMemo'> | Date | string
    updated_ts?: DateTimeFilter<'BlogMemo'> | Date | string
    visible?: StringFilter<'BlogMemo'> | string
    defalt_floded?: BoolFilter<'BlogMemo'> | boolean
    flod_tip?: StringNullableFilter<'BlogMemo'> | string | null
    user_id?: StringFilter<'BlogMemo'> | string
    from?: StringNullableFilter<'BlogMemo'> | string | null
    courier?: StringNullableFilter<'BlogMemo'> | string | null
    user_info?: XOR<UserScalarRelationFilter, UserWhereInput>
    tags?: MemoTagRelationsListRelationFilter
    comments?: BlogCommentListRelationFilter
    likes?: BlogLikeListRelationFilter
  }, 'id'>

  export interface BlogMemoOrderByWithAggregationInput {
    id?: SortOrder
    content?: SortOrderInput | SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    visible?: SortOrder
    defalt_floded?: SortOrder
    flod_tip?: SortOrderInput | SortOrder
    user_id?: SortOrder
    from?: SortOrderInput | SortOrder
    courier?: SortOrderInput | SortOrder
    _count?: BlogMemoCountOrderByAggregateInput
    _max?: BlogMemoMaxOrderByAggregateInput
    _min?: BlogMemoMinOrderByAggregateInput
  }

  export interface BlogMemoScalarWhereWithAggregatesInput {
    AND?: BlogMemoScalarWhereWithAggregatesInput | BlogMemoScalarWhereWithAggregatesInput[]
    OR?: BlogMemoScalarWhereWithAggregatesInput[]
    NOT?: BlogMemoScalarWhereWithAggregatesInput | BlogMemoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'BlogMemo'> | string
    content?: StringNullableWithAggregatesFilter<'BlogMemo'> | string | null
    create_ts?: DateTimeWithAggregatesFilter<'BlogMemo'> | Date | string
    updated_ts?: DateTimeWithAggregatesFilter<'BlogMemo'> | Date | string
    visible?: StringWithAggregatesFilter<'BlogMemo'> | string
    defalt_floded?: BoolWithAggregatesFilter<'BlogMemo'> | boolean
    flod_tip?: StringNullableWithAggregatesFilter<'BlogMemo'> | string | null
    user_id?: StringWithAggregatesFilter<'BlogMemo'> | string
    from?: StringNullableWithAggregatesFilter<'BlogMemo'> | string | null
    courier?: StringNullableWithAggregatesFilter<'BlogMemo'> | string | null
  }

  export interface MemoTagWhereInput {
    AND?: MemoTagWhereInput | MemoTagWhereInput[]
    OR?: MemoTagWhereInput[]
    NOT?: MemoTagWhereInput | MemoTagWhereInput[]
    id?: StringFilter<'MemoTag'> | string
    tag_name?: StringFilter<'MemoTag'> | string
    create_ts?: DateTimeFilter<'MemoTag'> | Date | string
    updated_ts?: DateTimeFilter<'MemoTag'> | Date | string
    user_id?: StringFilter<'MemoTag'> | string
    user_info?: XOR<UserScalarRelationFilter, UserWhereInput>
    memos?: MemoTagRelationsListRelationFilter
  }

  export interface MemoTagOrderByWithRelationInput {
    id?: SortOrder
    tag_name?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    user_id?: SortOrder
    user_info?: UserOrderByWithRelationInput
    memos?: MemoTagRelationsOrderByRelationAggregateInput
    _relevance?: MemoTagOrderByRelevanceInput
  }

  export type MemoTagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tag_name?: string
    AND?: MemoTagWhereInput | MemoTagWhereInput[]
    OR?: MemoTagWhereInput[]
    NOT?: MemoTagWhereInput | MemoTagWhereInput[]
    create_ts?: DateTimeFilter<'MemoTag'> | Date | string
    updated_ts?: DateTimeFilter<'MemoTag'> | Date | string
    user_id?: StringFilter<'MemoTag'> | string
    user_info?: XOR<UserScalarRelationFilter, UserWhereInput>
    memos?: MemoTagRelationsListRelationFilter
  }, 'id' | 'tag_name'>

  export interface MemoTagOrderByWithAggregationInput {
    id?: SortOrder
    tag_name?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    user_id?: SortOrder
    _count?: MemoTagCountOrderByAggregateInput
    _max?: MemoTagMaxOrderByAggregateInput
    _min?: MemoTagMinOrderByAggregateInput
  }

  export interface MemoTagScalarWhereWithAggregatesInput {
    AND?: MemoTagScalarWhereWithAggregatesInput | MemoTagScalarWhereWithAggregatesInput[]
    OR?: MemoTagScalarWhereWithAggregatesInput[]
    NOT?: MemoTagScalarWhereWithAggregatesInput | MemoTagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'MemoTag'> | string
    tag_name?: StringWithAggregatesFilter<'MemoTag'> | string
    create_ts?: DateTimeWithAggregatesFilter<'MemoTag'> | Date | string
    updated_ts?: DateTimeWithAggregatesFilter<'MemoTag'> | Date | string
    user_id?: StringWithAggregatesFilter<'MemoTag'> | string
  }

  export interface MemoTagRelationsWhereInput {
    AND?: MemoTagRelationsWhereInput | MemoTagRelationsWhereInput[]
    OR?: MemoTagRelationsWhereInput[]
    NOT?: MemoTagRelationsWhereInput | MemoTagRelationsWhereInput[]
    tagId?: StringFilter<'MemoTagRelations'> | string
    memoId?: StringFilter<'MemoTagRelations'> | string
    create_ts?: DateTimeFilter<'MemoTagRelations'> | Date | string
    updated_ts?: DateTimeFilter<'MemoTagRelations'> | Date | string
    tag?: XOR<MemoTagScalarRelationFilter, MemoTagWhereInput>
    memo?: XOR<BlogMemoScalarRelationFilter, BlogMemoWhereInput>
  }

  export interface MemoTagRelationsOrderByWithRelationInput {
    tagId?: SortOrder
    memoId?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    tag?: MemoTagOrderByWithRelationInput
    memo?: BlogMemoOrderByWithRelationInput
    _relevance?: MemoTagRelationsOrderByRelevanceInput
  }

  export type MemoTagRelationsWhereUniqueInput = Prisma.AtLeast<{
    tagId_memoId?: MemoTagRelationsTagIdMemoIdCompoundUniqueInput
    AND?: MemoTagRelationsWhereInput | MemoTagRelationsWhereInput[]
    OR?: MemoTagRelationsWhereInput[]
    NOT?: MemoTagRelationsWhereInput | MemoTagRelationsWhereInput[]
    tagId?: StringFilter<'MemoTagRelations'> | string
    memoId?: StringFilter<'MemoTagRelations'> | string
    create_ts?: DateTimeFilter<'MemoTagRelations'> | Date | string
    updated_ts?: DateTimeFilter<'MemoTagRelations'> | Date | string
    tag?: XOR<MemoTagScalarRelationFilter, MemoTagWhereInput>
    memo?: XOR<BlogMemoScalarRelationFilter, BlogMemoWhereInput>
  }, 'tagId_memoId'>

  export interface MemoTagRelationsOrderByWithAggregationInput {
    tagId?: SortOrder
    memoId?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    _count?: MemoTagRelationsCountOrderByAggregateInput
    _max?: MemoTagRelationsMaxOrderByAggregateInput
    _min?: MemoTagRelationsMinOrderByAggregateInput
  }

  export interface MemoTagRelationsScalarWhereWithAggregatesInput {
    AND?: MemoTagRelationsScalarWhereWithAggregatesInput | MemoTagRelationsScalarWhereWithAggregatesInput[]
    OR?: MemoTagRelationsScalarWhereWithAggregatesInput[]
    NOT?: MemoTagRelationsScalarWhereWithAggregatesInput | MemoTagRelationsScalarWhereWithAggregatesInput[]
    tagId?: StringWithAggregatesFilter<'MemoTagRelations'> | string
    memoId?: StringWithAggregatesFilter<'MemoTagRelations'> | string
    create_ts?: DateTimeWithAggregatesFilter<'MemoTagRelations'> | Date | string
    updated_ts?: DateTimeWithAggregatesFilter<'MemoTagRelations'> | Date | string
  }

  export interface GarminActivityWhereInput {
    AND?: GarminActivityWhereInput | GarminActivityWhereInput[]
    OR?: GarminActivityWhereInput[]
    NOT?: GarminActivityWhereInput | GarminActivityWhereInput[]
    id?: StringFilter<'GarminActivity'> | string
    activityType?: StringFilter<'GarminActivity'> | string
    date?: DateTimeFilter<'GarminActivity'> | Date | string
    isFavorite?: BoolFilter<'GarminActivity'> | boolean
    title?: StringNullableFilter<'GarminActivity'> | string | null
    distance?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    calories?: IntFilter<'GarminActivity'> | number
    duration?: DecimalFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string
    movingTime?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    elapsedTime?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    avgHr?: IntNullableFilter<'GarminActivity'> | number | null
    maxHr?: IntNullableFilter<'GarminActivity'> | number | null
    aerobicEffect?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    trainingStressScore?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    avgPace?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    bestPace?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    totalStrokes?: IntNullableFilter<'GarminActivity'> | number | null
    avgSwolf?: IntNullableFilter<'GarminActivity'> | number | null
    avgStrokeRate?: IntNullableFilter<'GarminActivity'> | number | null
    steps?: IntNullableFilter<'GarminActivity'> | number | null
    totalReps?: IntNullableFilter<'GarminActivity'> | number | null
    totalSets?: IntNullableFilter<'GarminActivity'> | number | null
    isGrit?: BoolNullableFilter<'GarminActivity'> | boolean | null
    bestLapTime?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    lapCount?: IntNullableFilter<'GarminActivity'> | number | null
    createdAt?: DateTimeFilter<'GarminActivity'> | Date | string
    updatedAt?: DateTimeFilter<'GarminActivity'> | Date | string
  }

  export interface GarminActivityOrderByWithRelationInput {
    id?: SortOrder
    activityType?: SortOrder
    date?: SortOrder
    isFavorite?: SortOrder
    title?: SortOrderInput | SortOrder
    distance?: SortOrderInput | SortOrder
    calories?: SortOrder
    duration?: SortOrder
    movingTime?: SortOrderInput | SortOrder
    elapsedTime?: SortOrderInput | SortOrder
    avgHr?: SortOrderInput | SortOrder
    maxHr?: SortOrderInput | SortOrder
    aerobicEffect?: SortOrderInput | SortOrder
    trainingStressScore?: SortOrderInput | SortOrder
    avgPace?: SortOrderInput | SortOrder
    bestPace?: SortOrderInput | SortOrder
    totalStrokes?: SortOrderInput | SortOrder
    avgSwolf?: SortOrderInput | SortOrder
    avgStrokeRate?: SortOrderInput | SortOrder
    steps?: SortOrderInput | SortOrder
    totalReps?: SortOrderInput | SortOrder
    totalSets?: SortOrderInput | SortOrder
    isGrit?: SortOrderInput | SortOrder
    bestLapTime?: SortOrderInput | SortOrder
    lapCount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: GarminActivityOrderByRelevanceInput
  }

  export type GarminActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    date_activityType?: GarminActivityDateActivityTypeCompoundUniqueInput
    AND?: GarminActivityWhereInput | GarminActivityWhereInput[]
    OR?: GarminActivityWhereInput[]
    NOT?: GarminActivityWhereInput | GarminActivityWhereInput[]
    activityType?: StringFilter<'GarminActivity'> | string
    date?: DateTimeFilter<'GarminActivity'> | Date | string
    isFavorite?: BoolFilter<'GarminActivity'> | boolean
    title?: StringNullableFilter<'GarminActivity'> | string | null
    distance?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    calories?: IntFilter<'GarminActivity'> | number
    duration?: DecimalFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string
    movingTime?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    elapsedTime?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    avgHr?: IntNullableFilter<'GarminActivity'> | number | null
    maxHr?: IntNullableFilter<'GarminActivity'> | number | null
    aerobicEffect?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    trainingStressScore?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    avgPace?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    bestPace?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    totalStrokes?: IntNullableFilter<'GarminActivity'> | number | null
    avgSwolf?: IntNullableFilter<'GarminActivity'> | number | null
    avgStrokeRate?: IntNullableFilter<'GarminActivity'> | number | null
    steps?: IntNullableFilter<'GarminActivity'> | number | null
    totalReps?: IntNullableFilter<'GarminActivity'> | number | null
    totalSets?: IntNullableFilter<'GarminActivity'> | number | null
    isGrit?: BoolNullableFilter<'GarminActivity'> | boolean | null
    bestLapTime?: DecimalNullableFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    lapCount?: IntNullableFilter<'GarminActivity'> | number | null
    createdAt?: DateTimeFilter<'GarminActivity'> | Date | string
    updatedAt?: DateTimeFilter<'GarminActivity'> | Date | string
  }, 'id' | 'date_activityType'>

  export interface GarminActivityOrderByWithAggregationInput {
    id?: SortOrder
    activityType?: SortOrder
    date?: SortOrder
    isFavorite?: SortOrder
    title?: SortOrderInput | SortOrder
    distance?: SortOrderInput | SortOrder
    calories?: SortOrder
    duration?: SortOrder
    movingTime?: SortOrderInput | SortOrder
    elapsedTime?: SortOrderInput | SortOrder
    avgHr?: SortOrderInput | SortOrder
    maxHr?: SortOrderInput | SortOrder
    aerobicEffect?: SortOrderInput | SortOrder
    trainingStressScore?: SortOrderInput | SortOrder
    avgPace?: SortOrderInput | SortOrder
    bestPace?: SortOrderInput | SortOrder
    totalStrokes?: SortOrderInput | SortOrder
    avgSwolf?: SortOrderInput | SortOrder
    avgStrokeRate?: SortOrderInput | SortOrder
    steps?: SortOrderInput | SortOrder
    totalReps?: SortOrderInput | SortOrder
    totalSets?: SortOrderInput | SortOrder
    isGrit?: SortOrderInput | SortOrder
    bestLapTime?: SortOrderInput | SortOrder
    lapCount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GarminActivityCountOrderByAggregateInput
    _avg?: GarminActivityAvgOrderByAggregateInput
    _max?: GarminActivityMaxOrderByAggregateInput
    _min?: GarminActivityMinOrderByAggregateInput
    _sum?: GarminActivitySumOrderByAggregateInput
  }

  export interface GarminActivityScalarWhereWithAggregatesInput {
    AND?: GarminActivityScalarWhereWithAggregatesInput | GarminActivityScalarWhereWithAggregatesInput[]
    OR?: GarminActivityScalarWhereWithAggregatesInput[]
    NOT?: GarminActivityScalarWhereWithAggregatesInput | GarminActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'GarminActivity'> | string
    activityType?: StringWithAggregatesFilter<'GarminActivity'> | string
    date?: DateTimeWithAggregatesFilter<'GarminActivity'> | Date | string
    isFavorite?: BoolWithAggregatesFilter<'GarminActivity'> | boolean
    title?: StringNullableWithAggregatesFilter<'GarminActivity'> | string | null
    distance?: DecimalNullableWithAggregatesFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    calories?: IntWithAggregatesFilter<'GarminActivity'> | number
    duration?: DecimalWithAggregatesFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string
    movingTime?: DecimalNullableWithAggregatesFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    elapsedTime?: DecimalNullableWithAggregatesFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    avgHr?: IntNullableWithAggregatesFilter<'GarminActivity'> | number | null
    maxHr?: IntNullableWithAggregatesFilter<'GarminActivity'> | number | null
    aerobicEffect?: DecimalNullableWithAggregatesFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    trainingStressScore?: DecimalNullableWithAggregatesFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    avgPace?: DecimalNullableWithAggregatesFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    bestPace?: DecimalNullableWithAggregatesFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    totalStrokes?: IntNullableWithAggregatesFilter<'GarminActivity'> | number | null
    avgSwolf?: IntNullableWithAggregatesFilter<'GarminActivity'> | number | null
    avgStrokeRate?: IntNullableWithAggregatesFilter<'GarminActivity'> | number | null
    steps?: IntNullableWithAggregatesFilter<'GarminActivity'> | number | null
    totalReps?: IntNullableWithAggregatesFilter<'GarminActivity'> | number | null
    totalSets?: IntNullableWithAggregatesFilter<'GarminActivity'> | number | null
    isGrit?: BoolNullableWithAggregatesFilter<'GarminActivity'> | boolean | null
    bestLapTime?: DecimalNullableWithAggregatesFilter<'GarminActivity'> | Decimal | DecimalJsLike | number | string | null
    lapCount?: IntNullableWithAggregatesFilter<'GarminActivity'> | number | null
    createdAt?: DateTimeWithAggregatesFilter<'GarminActivity'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'GarminActivity'> | Date | string
  }

  export interface UserCreateInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthCreateNestedManyWithoutUserInput
    tokens?: AccessTokenCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagCreateNestedManyWithoutUser_infoInput
  }

  export interface UserUncheckedCreateInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentUncheckedCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthUncheckedCreateNestedManyWithoutUserInput
    tokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigUncheckedCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoUncheckedCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagUncheckedCreateNestedManyWithoutUser_infoInput
  }

  export interface UserUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserUncheckedUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUncheckedUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUncheckedUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUncheckedUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUncheckedUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUncheckedUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserCreateManyInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
  }

  export interface UserUpdateManyMutationInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
  }

  export interface UserUncheckedUpdateManyInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
  }

  export interface UserConfigCreateInput {
    id?: string
    allowEmailNotify?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userInfo: UserCreateNestedOneWithoutUser_configInput
  }

  export interface UserConfigUncheckedCreateInput {
    id?: string
    userId: string
    allowEmailNotify?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface UserConfigUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    allowEmailNotify?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userInfo?: UserUpdateOneRequiredWithoutUser_configNestedInput
  }

  export interface UserConfigUncheckedUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    allowEmailNotify?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface UserConfigCreateManyInput {
    id?: string
    userId: string
    allowEmailNotify?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface UserConfigUpdateManyMutationInput {
    id?: StringFieldUpdateOperationsInput | string
    allowEmailNotify?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface UserConfigUncheckedUpdateManyInput {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    allowEmailNotify?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface AccessTokenCreateInput {
    id?: string
    token: string
    roles?: string
    status?: number
    scope?: string
    isRevoked?: boolean
    ip?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    userInfo: UserCreateNestedOneWithoutTokensInput
  }

  export interface AccessTokenUncheckedCreateInput {
    id?: string
    userId: string
    token: string
    roles?: string
    status?: number
    scope?: string
    isRevoked?: boolean
    ip?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface AccessTokenUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    roles?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    scope?: StringFieldUpdateOperationsInput | string
    isRevoked?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userInfo?: UserUpdateOneRequiredWithoutTokensNestedInput
  }

  export interface AccessTokenUncheckedUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    roles?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    scope?: StringFieldUpdateOperationsInput | string
    isRevoked?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface AccessTokenCreateManyInput {
    id?: string
    userId: string
    token: string
    roles?: string
    status?: number
    scope?: string
    isRevoked?: boolean
    ip?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface AccessTokenUpdateManyMutationInput {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    roles?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    scope?: StringFieldUpdateOperationsInput | string
    isRevoked?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface AccessTokenUncheckedUpdateManyInput {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    roles?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    scope?: StringFieldUpdateOperationsInput | string
    isRevoked?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface OAuthCreateInput {
    id?: string
    provider: string
    providerId: string
    providerUnionId?: string | null
    providerToken?: string | null
    providerRefreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutOauthInput
  }

  export interface OAuthUncheckedCreateInput {
    id?: string
    userId?: string | null
    provider: string
    providerId: string
    providerUnionId?: string | null
    providerToken?: string | null
    providerRefreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface OAuthUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    providerUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerToken?: NullableStringFieldUpdateOperationsInput | string | null
    providerRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutOauthNestedInput
  }

  export interface OAuthUncheckedUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    providerUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerToken?: NullableStringFieldUpdateOperationsInput | string | null
    providerRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface OAuthCreateManyInput {
    id?: string
    userId?: string | null
    provider: string
    providerId: string
    providerUnionId?: string | null
    providerToken?: string | null
    providerRefreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface OAuthUpdateManyMutationInput {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    providerUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerToken?: NullableStringFieldUpdateOperationsInput | string | null
    providerRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface OAuthUncheckedUpdateManyInput {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    providerUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerToken?: NullableStringFieldUpdateOperationsInput | string | null
    providerRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface BlogCommentCreateInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    visitorName?: string | null
    user_info?: UserCreateNestedOneWithoutCommentsInput
    sub_comments?: BlogSubCommentCreateNestedManyWithoutComment_infoInput
    likes?: BlogLikeCreateNestedManyWithoutComment_infoInput
    memo_info?: BlogMemoCreateNestedOneWithoutCommentsInput
  }

  export interface BlogCommentUncheckedCreateInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    user_id?: string | null
    visitorName?: string | null
    memo_id?: string | null
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutComment_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutComment_infoInput
  }

  export interface BlogCommentUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    user_info?: UserUpdateOneWithoutCommentsNestedInput
    sub_comments?: BlogSubCommentUpdateManyWithoutComment_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutComment_infoNestedInput
    memo_info?: BlogMemoUpdateOneWithoutCommentsNestedInput
  }

  export interface BlogCommentUncheckedUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    memo_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutComment_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutComment_infoNestedInput
  }

  export interface BlogCommentCreateManyInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    user_id?: string | null
    visitorName?: string | null
    memo_id?: string | null
  }

  export interface BlogCommentUpdateManyMutationInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogCommentUncheckedUpdateManyInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    memo_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogExplainCreateInput {
    id?: string
    create_ts?: Date | string
    updated_ts?: Date | string
    text: string
    content: string
    article_id: string
  }

  export interface BlogExplainUncheckedCreateInput {
    id?: string
    create_ts?: Date | string
    updated_ts?: Date | string
    text: string
    content: string
    article_id: string
  }

  export interface BlogExplainUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    article_id?: StringFieldUpdateOperationsInput | string
  }

  export interface BlogExplainUncheckedUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    article_id?: StringFieldUpdateOperationsInput | string
  }

  export interface BlogExplainCreateManyInput {
    id?: string
    create_ts?: Date | string
    updated_ts?: Date | string
    text: string
    content: string
    article_id: string
  }

  export interface BlogExplainUpdateManyMutationInput {
    id?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    article_id?: StringFieldUpdateOperationsInput | string
  }

  export interface BlogExplainUncheckedUpdateManyInput {
    id?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    article_id?: StringFieldUpdateOperationsInput | string
  }

  export interface BlogSubCommentCreateInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    reply_sub_comment_id?: string | null
    comment_info: BlogCommentCreateNestedOneWithoutSub_commentsInput
    user_info?: UserCreateNestedOneWithoutSub_commentsInput
    likes?: BlogLikeCreateNestedManyWithoutSub_comment_infoInput
  }

  export interface BlogSubCommentUncheckedCreateInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    comment_id: string
    reply_sub_comment_id?: string | null
    user_id?: string | null
    likes?: BlogLikeUncheckedCreateNestedManyWithoutSub_comment_infoInput
  }

  export interface BlogSubCommentUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_info?: BlogCommentUpdateOneRequiredWithoutSub_commentsNestedInput
    user_info?: UserUpdateOneWithoutSub_commentsNestedInput
    likes?: BlogLikeUpdateManyWithoutSub_comment_infoNestedInput
  }

  export interface BlogSubCommentUncheckedUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    comment_id?: StringFieldUpdateOperationsInput | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    likes?: BlogLikeUncheckedUpdateManyWithoutSub_comment_infoNestedInput
  }

  export interface BlogSubCommentCreateManyInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    comment_id: string
    reply_sub_comment_id?: string | null
    user_id?: string | null
  }

  export interface BlogSubCommentUpdateManyMutationInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogSubCommentUncheckedUpdateManyInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    comment_id?: StringFieldUpdateOperationsInput | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogLikeCreateInput {
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_info?: BlogSubCommentCreateNestedOneWithoutLikesInput
    comment_info?: BlogCommentCreateNestedOneWithoutLikesInput
    user_info: UserCreateNestedOneWithoutLikesInput
    blogMemoInfo?: BlogMemoCreateNestedOneWithoutLikesInput
  }

  export interface BlogLikeUncheckedCreateInput {
    id?: number
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_id?: string | null
    comment_id?: string | null
    user_id: string
    blogMemoId?: string | null
  }

  export interface BlogLikeUpdateInput {
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_info?: BlogSubCommentUpdateOneWithoutLikesNestedInput
    comment_info?: BlogCommentUpdateOneWithoutLikesNestedInput
    user_info?: UserUpdateOneRequiredWithoutLikesNestedInput
    blogMemoInfo?: BlogMemoUpdateOneWithoutLikesNestedInput
  }

  export interface BlogLikeUncheckedUpdateInput {
    id?: IntFieldUpdateOperationsInput | number
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    blogMemoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogLikeCreateManyInput {
    id?: number
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_id?: string | null
    comment_id?: string | null
    user_id: string
    blogMemoId?: string | null
  }

  export interface BlogLikeUpdateManyMutationInput {
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogLikeUncheckedUpdateManyInput {
    id?: IntFieldUpdateOperationsInput | number
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    blogMemoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogMemoCreateInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    from?: string | null
    courier?: string | null
    user_info: UserCreateNestedOneWithoutMemosInput
    tags?: MemoTagRelationsCreateNestedManyWithoutMemoInput
    comments?: BlogCommentCreateNestedManyWithoutMemo_infoInput
    likes?: BlogLikeCreateNestedManyWithoutBlogMemoInfoInput
  }

  export interface BlogMemoUncheckedCreateInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    user_id: string
    from?: string | null
    courier?: string | null
    tags?: MemoTagRelationsUncheckedCreateNestedManyWithoutMemoInput
    comments?: BlogCommentUncheckedCreateNestedManyWithoutMemo_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutBlogMemoInfoInput
  }

  export interface BlogMemoUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
    user_info?: UserUpdateOneRequiredWithoutMemosNestedInput
    tags?: MemoTagRelationsUpdateManyWithoutMemoNestedInput
    comments?: BlogCommentUpdateManyWithoutMemo_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutBlogMemoInfoNestedInput
  }

  export interface BlogMemoUncheckedUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MemoTagRelationsUncheckedUpdateManyWithoutMemoNestedInput
    comments?: BlogCommentUncheckedUpdateManyWithoutMemo_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutBlogMemoInfoNestedInput
  }

  export interface BlogMemoCreateManyInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    user_id: string
    from?: string | null
    courier?: string | null
  }

  export interface BlogMemoUpdateManyMutationInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogMemoUncheckedUpdateManyInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface MemoTagCreateInput {
    id?: string
    tag_name: string
    create_ts?: Date | string
    updated_ts?: Date | string
    user_info: UserCreateNestedOneWithoutTagsInput
    memos?: MemoTagRelationsCreateNestedManyWithoutTagInput
  }

  export interface MemoTagUncheckedCreateInput {
    id?: string
    tag_name: string
    create_ts?: Date | string
    updated_ts?: Date | string
    user_id: string
    memos?: MemoTagRelationsUncheckedCreateNestedManyWithoutTagInput
  }

  export interface MemoTagUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    tag_name?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    user_info?: UserUpdateOneRequiredWithoutTagsNestedInput
    memos?: MemoTagRelationsUpdateManyWithoutTagNestedInput
  }

  export interface MemoTagUncheckedUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    tag_name?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    memos?: MemoTagRelationsUncheckedUpdateManyWithoutTagNestedInput
  }

  export interface MemoTagCreateManyInput {
    id?: string
    tag_name: string
    create_ts?: Date | string
    updated_ts?: Date | string
    user_id: string
  }

  export interface MemoTagUpdateManyMutationInput {
    id?: StringFieldUpdateOperationsInput | string
    tag_name?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface MemoTagUncheckedUpdateManyInput {
    id?: StringFieldUpdateOperationsInput | string
    tag_name?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export interface MemoTagRelationsCreateInput {
    create_ts?: Date | string
    updated_ts?: Date | string
    tag: MemoTagCreateNestedOneWithoutMemosInput
    memo: BlogMemoCreateNestedOneWithoutTagsInput
  }

  export interface MemoTagRelationsUncheckedCreateInput {
    tagId: string
    memoId: string
    create_ts?: Date | string
    updated_ts?: Date | string
  }

  export interface MemoTagRelationsUpdateInput {
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    tag?: MemoTagUpdateOneRequiredWithoutMemosNestedInput
    memo?: BlogMemoUpdateOneRequiredWithoutTagsNestedInput
  }

  export interface MemoTagRelationsUncheckedUpdateInput {
    tagId?: StringFieldUpdateOperationsInput | string
    memoId?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface MemoTagRelationsCreateManyInput {
    tagId: string
    memoId: string
    create_ts?: Date | string
    updated_ts?: Date | string
  }

  export interface MemoTagRelationsUpdateManyMutationInput {
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface MemoTagRelationsUncheckedUpdateManyInput {
    tagId?: StringFieldUpdateOperationsInput | string
    memoId?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface GarminActivityCreateInput {
    id?: string
    activityType: string
    date: Date | string
    isFavorite: boolean
    title?: string | null
    distance?: Decimal | DecimalJsLike | number | string | null
    calories: number
    duration: Decimal | DecimalJsLike | number | string
    movingTime?: Decimal | DecimalJsLike | number | string | null
    elapsedTime?: Decimal | DecimalJsLike | number | string | null
    avgHr?: number | null
    maxHr?: number | null
    aerobicEffect?: Decimal | DecimalJsLike | number | string | null
    trainingStressScore?: Decimal | DecimalJsLike | number | string | null
    avgPace?: Decimal | DecimalJsLike | number | string | null
    bestPace?: Decimal | DecimalJsLike | number | string | null
    totalStrokes?: number | null
    avgSwolf?: number | null
    avgStrokeRate?: number | null
    steps?: number | null
    totalReps?: number | null
    totalSets?: number | null
    isGrit?: boolean | null
    bestLapTime?: Decimal | DecimalJsLike | number | string | null
    lapCount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface GarminActivityUncheckedCreateInput {
    id?: string
    activityType: string
    date: Date | string
    isFavorite: boolean
    title?: string | null
    distance?: Decimal | DecimalJsLike | number | string | null
    calories: number
    duration: Decimal | DecimalJsLike | number | string
    movingTime?: Decimal | DecimalJsLike | number | string | null
    elapsedTime?: Decimal | DecimalJsLike | number | string | null
    avgHr?: number | null
    maxHr?: number | null
    aerobicEffect?: Decimal | DecimalJsLike | number | string | null
    trainingStressScore?: Decimal | DecimalJsLike | number | string | null
    avgPace?: Decimal | DecimalJsLike | number | string | null
    bestPace?: Decimal | DecimalJsLike | number | string | null
    totalStrokes?: number | null
    avgSwolf?: number | null
    avgStrokeRate?: number | null
    steps?: number | null
    totalReps?: number | null
    totalSets?: number | null
    isGrit?: boolean | null
    bestLapTime?: Decimal | DecimalJsLike | number | string | null
    lapCount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface GarminActivityUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    title?: NullableStringFieldUpdateOperationsInput | string | null
    distance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    calories?: IntFieldUpdateOperationsInput | number
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    movingTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    elapsedTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avgHr?: NullableIntFieldUpdateOperationsInput | number | null
    maxHr?: NullableIntFieldUpdateOperationsInput | number | null
    aerobicEffect?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trainingStressScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avgPace?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bestPace?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    totalStrokes?: NullableIntFieldUpdateOperationsInput | number | null
    avgSwolf?: NullableIntFieldUpdateOperationsInput | number | null
    avgStrokeRate?: NullableIntFieldUpdateOperationsInput | number | null
    steps?: NullableIntFieldUpdateOperationsInput | number | null
    totalReps?: NullableIntFieldUpdateOperationsInput | number | null
    totalSets?: NullableIntFieldUpdateOperationsInput | number | null
    isGrit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    bestLapTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lapCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface GarminActivityUncheckedUpdateInput {
    id?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    title?: NullableStringFieldUpdateOperationsInput | string | null
    distance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    calories?: IntFieldUpdateOperationsInput | number
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    movingTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    elapsedTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avgHr?: NullableIntFieldUpdateOperationsInput | number | null
    maxHr?: NullableIntFieldUpdateOperationsInput | number | null
    aerobicEffect?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trainingStressScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avgPace?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bestPace?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    totalStrokes?: NullableIntFieldUpdateOperationsInput | number | null
    avgSwolf?: NullableIntFieldUpdateOperationsInput | number | null
    avgStrokeRate?: NullableIntFieldUpdateOperationsInput | number | null
    steps?: NullableIntFieldUpdateOperationsInput | number | null
    totalReps?: NullableIntFieldUpdateOperationsInput | number | null
    totalSets?: NullableIntFieldUpdateOperationsInput | number | null
    isGrit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    bestLapTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lapCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface GarminActivityCreateManyInput {
    id?: string
    activityType: string
    date: Date | string
    isFavorite: boolean
    title?: string | null
    distance?: Decimal | DecimalJsLike | number | string | null
    calories: number
    duration: Decimal | DecimalJsLike | number | string
    movingTime?: Decimal | DecimalJsLike | number | string | null
    elapsedTime?: Decimal | DecimalJsLike | number | string | null
    avgHr?: number | null
    maxHr?: number | null
    aerobicEffect?: Decimal | DecimalJsLike | number | string | null
    trainingStressScore?: Decimal | DecimalJsLike | number | string | null
    avgPace?: Decimal | DecimalJsLike | number | string | null
    bestPace?: Decimal | DecimalJsLike | number | string | null
    totalStrokes?: number | null
    avgSwolf?: number | null
    avgStrokeRate?: number | null
    steps?: number | null
    totalReps?: number | null
    totalSets?: number | null
    isGrit?: boolean | null
    bestLapTime?: Decimal | DecimalJsLike | number | string | null
    lapCount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface GarminActivityUpdateManyMutationInput {
    id?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    title?: NullableStringFieldUpdateOperationsInput | string | null
    distance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    calories?: IntFieldUpdateOperationsInput | number
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    movingTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    elapsedTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avgHr?: NullableIntFieldUpdateOperationsInput | number | null
    maxHr?: NullableIntFieldUpdateOperationsInput | number | null
    aerobicEffect?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trainingStressScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avgPace?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bestPace?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    totalStrokes?: NullableIntFieldUpdateOperationsInput | number | null
    avgSwolf?: NullableIntFieldUpdateOperationsInput | number | null
    avgStrokeRate?: NullableIntFieldUpdateOperationsInput | number | null
    steps?: NullableIntFieldUpdateOperationsInput | number | null
    totalReps?: NullableIntFieldUpdateOperationsInput | number | null
    totalSets?: NullableIntFieldUpdateOperationsInput | number | null
    isGrit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    bestLapTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lapCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface GarminActivityUncheckedUpdateManyInput {
    id?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    title?: NullableStringFieldUpdateOperationsInput | string | null
    distance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    calories?: IntFieldUpdateOperationsInput | number
    duration?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    movingTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    elapsedTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avgHr?: NullableIntFieldUpdateOperationsInput | number | null
    maxHr?: NullableIntFieldUpdateOperationsInput | number | null
    aerobicEffect?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trainingStressScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avgPace?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bestPace?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    totalStrokes?: NullableIntFieldUpdateOperationsInput | number | null
    avgSwolf?: NullableIntFieldUpdateOperationsInput | number | null
    avgStrokeRate?: NullableIntFieldUpdateOperationsInput | number | null
    steps?: NullableIntFieldUpdateOperationsInput | number | null
    totalReps?: NullableIntFieldUpdateOperationsInput | number | null
    totalSets?: NullableIntFieldUpdateOperationsInput | number | null
    isGrit?: NullableBoolFieldUpdateOperationsInput | boolean | null
    bestLapTime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lapCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface StringFilter<$PrismaModel = never> {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export interface StringNullableFilter<$PrismaModel = never> {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export interface IntFilter<$PrismaModel = never> {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export interface BlogCommentListRelationFilter {
    every?: BlogCommentWhereInput
    some?: BlogCommentWhereInput
    none?: BlogCommentWhereInput
  }

  export interface BlogSubCommentListRelationFilter {
    every?: BlogSubCommentWhereInput
    some?: BlogSubCommentWhereInput
    none?: BlogSubCommentWhereInput
  }

  export interface BlogLikeListRelationFilter {
    every?: BlogLikeWhereInput
    some?: BlogLikeWhereInput
    none?: BlogLikeWhereInput
  }

  export interface OAuthListRelationFilter {
    every?: OAuthWhereInput
    some?: OAuthWhereInput
    none?: OAuthWhereInput
  }

  export interface AccessTokenListRelationFilter {
    every?: AccessTokenWhereInput
    some?: AccessTokenWhereInput
    none?: AccessTokenWhereInput
  }

  export interface UserConfigNullableScalarRelationFilter {
    is?: UserConfigWhereInput | null
    isNot?: UserConfigWhereInput | null
  }

  export interface BlogMemoListRelationFilter {
    every?: BlogMemoWhereInput
    some?: BlogMemoWhereInput
    none?: BlogMemoWhereInput
  }

  export interface MemoTagListRelationFilter {
    every?: MemoTagWhereInput
    some?: MemoTagWhereInput
    none?: MemoTagWhereInput
  }

  export interface SortOrderInput {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export interface BlogCommentOrderByRelationAggregateInput {
    _count?: SortOrder
  }

  export interface BlogSubCommentOrderByRelationAggregateInput {
    _count?: SortOrder
  }

  export interface BlogLikeOrderByRelationAggregateInput {
    _count?: SortOrder
  }

  export interface OAuthOrderByRelationAggregateInput {
    _count?: SortOrder
  }

  export interface AccessTokenOrderByRelationAggregateInput {
    _count?: SortOrder
  }

  export interface BlogMemoOrderByRelationAggregateInput {
    _count?: SortOrder
  }

  export interface MemoTagOrderByRelationAggregateInput {
    _count?: SortOrder
  }

  export interface UserOrderByRelevanceInput {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface UserCountOrderByAggregateInput {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    username?: SortOrder
    nickname?: SortOrder
    password?: SortOrder
    avatar_url?: SortOrder
    website?: SortOrder
    role?: SortOrder
    status?: SortOrder
  }

  export interface UserAvgOrderByAggregateInput {
    status?: SortOrder
  }

  export interface UserMaxOrderByAggregateInput {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    username?: SortOrder
    nickname?: SortOrder
    password?: SortOrder
    avatar_url?: SortOrder
    website?: SortOrder
    role?: SortOrder
    status?: SortOrder
  }

  export interface UserMinOrderByAggregateInput {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    username?: SortOrder
    nickname?: SortOrder
    password?: SortOrder
    avatar_url?: SortOrder
    website?: SortOrder
    role?: SortOrder
    status?: SortOrder
  }

  export interface UserSumOrderByAggregateInput {
    status?: SortOrder
  }

  export interface StringWithAggregatesFilter<$PrismaModel = never> {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export interface StringNullableWithAggregatesFilter<$PrismaModel = never> {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export interface IntWithAggregatesFilter<$PrismaModel = never> {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export interface IntNullableFilter<$PrismaModel = never> {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export interface DateTimeFilter<$PrismaModel = never> {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export interface UserScalarRelationFilter {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export interface UserConfigOrderByRelevanceInput {
    fields: UserConfigOrderByRelevanceFieldEnum | UserConfigOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface UserConfigCountOrderByAggregateInput {
    id?: SortOrder
    userId?: SortOrder
    allowEmailNotify?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface UserConfigAvgOrderByAggregateInput {
    allowEmailNotify?: SortOrder
  }

  export interface UserConfigMaxOrderByAggregateInput {
    id?: SortOrder
    userId?: SortOrder
    allowEmailNotify?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface UserConfigMinOrderByAggregateInput {
    id?: SortOrder
    userId?: SortOrder
    allowEmailNotify?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface UserConfigSumOrderByAggregateInput {
    allowEmailNotify?: SortOrder
  }

  export interface IntNullableWithAggregatesFilter<$PrismaModel = never> {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export interface DateTimeWithAggregatesFilter<$PrismaModel = never> {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export interface BoolFilter<$PrismaModel = never> {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export interface AccessTokenOrderByRelevanceInput {
    fields: AccessTokenOrderByRelevanceFieldEnum | AccessTokenOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface AccessTokenCountOrderByAggregateInput {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    roles?: SortOrder
    status?: SortOrder
    scope?: SortOrder
    isRevoked?: SortOrder
    ip?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface AccessTokenAvgOrderByAggregateInput {
    status?: SortOrder
  }

  export interface AccessTokenMaxOrderByAggregateInput {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    roles?: SortOrder
    status?: SortOrder
    scope?: SortOrder
    isRevoked?: SortOrder
    ip?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface AccessTokenMinOrderByAggregateInput {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    roles?: SortOrder
    status?: SortOrder
    scope?: SortOrder
    isRevoked?: SortOrder
    ip?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface AccessTokenSumOrderByAggregateInput {
    status?: SortOrder
  }

  export interface BoolWithAggregatesFilter<$PrismaModel = never> {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export interface UserNullableScalarRelationFilter {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export interface OAuthOrderByRelevanceInput {
    fields: OAuthOrderByRelevanceFieldEnum | OAuthOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface OAuthProviderProviderIdCompoundUniqueInput {
    provider: string
    providerId: string
  }

  export interface OAuthCountOrderByAggregateInput {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    providerId?: SortOrder
    providerUnionId?: SortOrder
    providerToken?: SortOrder
    providerRefreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface OAuthMaxOrderByAggregateInput {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    providerId?: SortOrder
    providerUnionId?: SortOrder
    providerToken?: SortOrder
    providerRefreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface OAuthMinOrderByAggregateInput {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    providerId?: SortOrder
    providerUnionId?: SortOrder
    providerToken?: SortOrder
    providerRefreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface BlogMemoNullableScalarRelationFilter {
    is?: BlogMemoWhereInput | null
    isNot?: BlogMemoWhereInput | null
  }

  export interface BlogCommentOrderByRelevanceInput {
    fields: BlogCommentOrderByRelevanceFieldEnum | BlogCommentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface BlogCommentCountOrderByAggregateInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    type?: SortOrder
    quoteContent?: SortOrder
    article_id?: SortOrder
    user_id?: SortOrder
    visitorName?: SortOrder
    memo_id?: SortOrder
  }

  export interface BlogCommentMaxOrderByAggregateInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    type?: SortOrder
    quoteContent?: SortOrder
    article_id?: SortOrder
    user_id?: SortOrder
    visitorName?: SortOrder
    memo_id?: SortOrder
  }

  export interface BlogCommentMinOrderByAggregateInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    type?: SortOrder
    quoteContent?: SortOrder
    article_id?: SortOrder
    user_id?: SortOrder
    visitorName?: SortOrder
    memo_id?: SortOrder
  }

  export interface BlogExplainOrderByRelevanceInput {
    fields: BlogExplainOrderByRelevanceFieldEnum | BlogExplainOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface BlogExplainCountOrderByAggregateInput {
    id?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    text?: SortOrder
    content?: SortOrder
    article_id?: SortOrder
  }

  export interface BlogExplainMaxOrderByAggregateInput {
    id?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    text?: SortOrder
    content?: SortOrder
    article_id?: SortOrder
  }

  export interface BlogExplainMinOrderByAggregateInput {
    id?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    text?: SortOrder
    content?: SortOrder
    article_id?: SortOrder
  }

  export interface BlogCommentScalarRelationFilter {
    is?: BlogCommentWhereInput
    isNot?: BlogCommentWhereInput
  }

  export interface BlogSubCommentOrderByRelevanceInput {
    fields: BlogSubCommentOrderByRelevanceFieldEnum | BlogSubCommentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface BlogSubCommentCountOrderByAggregateInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    comment_id?: SortOrder
    reply_sub_comment_id?: SortOrder
    user_id?: SortOrder
  }

  export interface BlogSubCommentMaxOrderByAggregateInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    comment_id?: SortOrder
    reply_sub_comment_id?: SortOrder
    user_id?: SortOrder
  }

  export interface BlogSubCommentMinOrderByAggregateInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    comment_id?: SortOrder
    reply_sub_comment_id?: SortOrder
    user_id?: SortOrder
  }

  export interface BlogSubCommentNullableScalarRelationFilter {
    is?: BlogSubCommentWhereInput | null
    isNot?: BlogSubCommentWhereInput | null
  }

  export interface BlogCommentNullableScalarRelationFilter {
    is?: BlogCommentWhereInput | null
    isNot?: BlogCommentWhereInput | null
  }

  export interface BlogLikeOrderByRelevanceInput {
    fields: BlogLikeOrderByRelevanceFieldEnum | BlogLikeOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface BlogLikeCountOrderByAggregateInput {
    id?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    target?: SortOrder
    article_id?: SortOrder
    sub_comment_id?: SortOrder
    comment_id?: SortOrder
    user_id?: SortOrder
    blogMemoId?: SortOrder
  }

  export interface BlogLikeAvgOrderByAggregateInput {
    id?: SortOrder
  }

  export interface BlogLikeMaxOrderByAggregateInput {
    id?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    target?: SortOrder
    article_id?: SortOrder
    sub_comment_id?: SortOrder
    comment_id?: SortOrder
    user_id?: SortOrder
    blogMemoId?: SortOrder
  }

  export interface BlogLikeMinOrderByAggregateInput {
    id?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    target?: SortOrder
    article_id?: SortOrder
    sub_comment_id?: SortOrder
    comment_id?: SortOrder
    user_id?: SortOrder
    blogMemoId?: SortOrder
  }

  export interface BlogLikeSumOrderByAggregateInput {
    id?: SortOrder
  }

  export interface MemoTagRelationsListRelationFilter {
    every?: MemoTagRelationsWhereInput
    some?: MemoTagRelationsWhereInput
    none?: MemoTagRelationsWhereInput
  }

  export interface MemoTagRelationsOrderByRelationAggregateInput {
    _count?: SortOrder
  }

  export interface BlogMemoOrderByRelevanceInput {
    fields: BlogMemoOrderByRelevanceFieldEnum | BlogMemoOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface BlogMemoCountOrderByAggregateInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    visible?: SortOrder
    defalt_floded?: SortOrder
    flod_tip?: SortOrder
    user_id?: SortOrder
    from?: SortOrder
    courier?: SortOrder
  }

  export interface BlogMemoMaxOrderByAggregateInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    visible?: SortOrder
    defalt_floded?: SortOrder
    flod_tip?: SortOrder
    user_id?: SortOrder
    from?: SortOrder
    courier?: SortOrder
  }

  export interface BlogMemoMinOrderByAggregateInput {
    id?: SortOrder
    content?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    visible?: SortOrder
    defalt_floded?: SortOrder
    flod_tip?: SortOrder
    user_id?: SortOrder
    from?: SortOrder
    courier?: SortOrder
  }

  export interface MemoTagOrderByRelevanceInput {
    fields: MemoTagOrderByRelevanceFieldEnum | MemoTagOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface MemoTagCountOrderByAggregateInput {
    id?: SortOrder
    tag_name?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    user_id?: SortOrder
  }

  export interface MemoTagMaxOrderByAggregateInput {
    id?: SortOrder
    tag_name?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    user_id?: SortOrder
  }

  export interface MemoTagMinOrderByAggregateInput {
    id?: SortOrder
    tag_name?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
    user_id?: SortOrder
  }

  export interface MemoTagScalarRelationFilter {
    is?: MemoTagWhereInput
    isNot?: MemoTagWhereInput
  }

  export interface BlogMemoScalarRelationFilter {
    is?: BlogMemoWhereInput
    isNot?: BlogMemoWhereInput
  }

  export interface MemoTagRelationsOrderByRelevanceInput {
    fields: MemoTagRelationsOrderByRelevanceFieldEnum | MemoTagRelationsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface MemoTagRelationsTagIdMemoIdCompoundUniqueInput {
    tagId: string
    memoId: string
  }

  export interface MemoTagRelationsCountOrderByAggregateInput {
    tagId?: SortOrder
    memoId?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
  }

  export interface MemoTagRelationsMaxOrderByAggregateInput {
    tagId?: SortOrder
    memoId?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
  }

  export interface MemoTagRelationsMinOrderByAggregateInput {
    tagId?: SortOrder
    memoId?: SortOrder
    create_ts?: SortOrder
    updated_ts?: SortOrder
  }

  export interface DecimalNullableFilter<$PrismaModel = never> {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export interface DecimalFilter<$PrismaModel = never> {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export interface BoolNullableFilter<$PrismaModel = never> {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export interface GarminActivityOrderByRelevanceInput {
    fields: GarminActivityOrderByRelevanceFieldEnum | GarminActivityOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export interface GarminActivityDateActivityTypeCompoundUniqueInput {
    date: Date | string
    activityType: string
  }

  export interface GarminActivityCountOrderByAggregateInput {
    id?: SortOrder
    activityType?: SortOrder
    date?: SortOrder
    isFavorite?: SortOrder
    title?: SortOrder
    distance?: SortOrder
    calories?: SortOrder
    duration?: SortOrder
    movingTime?: SortOrder
    elapsedTime?: SortOrder
    avgHr?: SortOrder
    maxHr?: SortOrder
    aerobicEffect?: SortOrder
    trainingStressScore?: SortOrder
    avgPace?: SortOrder
    bestPace?: SortOrder
    totalStrokes?: SortOrder
    avgSwolf?: SortOrder
    avgStrokeRate?: SortOrder
    steps?: SortOrder
    totalReps?: SortOrder
    totalSets?: SortOrder
    isGrit?: SortOrder
    bestLapTime?: SortOrder
    lapCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface GarminActivityAvgOrderByAggregateInput {
    distance?: SortOrder
    calories?: SortOrder
    duration?: SortOrder
    movingTime?: SortOrder
    elapsedTime?: SortOrder
    avgHr?: SortOrder
    maxHr?: SortOrder
    aerobicEffect?: SortOrder
    trainingStressScore?: SortOrder
    avgPace?: SortOrder
    bestPace?: SortOrder
    totalStrokes?: SortOrder
    avgSwolf?: SortOrder
    avgStrokeRate?: SortOrder
    steps?: SortOrder
    totalReps?: SortOrder
    totalSets?: SortOrder
    bestLapTime?: SortOrder
    lapCount?: SortOrder
  }

  export interface GarminActivityMaxOrderByAggregateInput {
    id?: SortOrder
    activityType?: SortOrder
    date?: SortOrder
    isFavorite?: SortOrder
    title?: SortOrder
    distance?: SortOrder
    calories?: SortOrder
    duration?: SortOrder
    movingTime?: SortOrder
    elapsedTime?: SortOrder
    avgHr?: SortOrder
    maxHr?: SortOrder
    aerobicEffect?: SortOrder
    trainingStressScore?: SortOrder
    avgPace?: SortOrder
    bestPace?: SortOrder
    totalStrokes?: SortOrder
    avgSwolf?: SortOrder
    avgStrokeRate?: SortOrder
    steps?: SortOrder
    totalReps?: SortOrder
    totalSets?: SortOrder
    isGrit?: SortOrder
    bestLapTime?: SortOrder
    lapCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface GarminActivityMinOrderByAggregateInput {
    id?: SortOrder
    activityType?: SortOrder
    date?: SortOrder
    isFavorite?: SortOrder
    title?: SortOrder
    distance?: SortOrder
    calories?: SortOrder
    duration?: SortOrder
    movingTime?: SortOrder
    elapsedTime?: SortOrder
    avgHr?: SortOrder
    maxHr?: SortOrder
    aerobicEffect?: SortOrder
    trainingStressScore?: SortOrder
    avgPace?: SortOrder
    bestPace?: SortOrder
    totalStrokes?: SortOrder
    avgSwolf?: SortOrder
    avgStrokeRate?: SortOrder
    steps?: SortOrder
    totalReps?: SortOrder
    totalSets?: SortOrder
    isGrit?: SortOrder
    bestLapTime?: SortOrder
    lapCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export interface GarminActivitySumOrderByAggregateInput {
    distance?: SortOrder
    calories?: SortOrder
    duration?: SortOrder
    movingTime?: SortOrder
    elapsedTime?: SortOrder
    avgHr?: SortOrder
    maxHr?: SortOrder
    aerobicEffect?: SortOrder
    trainingStressScore?: SortOrder
    avgPace?: SortOrder
    bestPace?: SortOrder
    totalStrokes?: SortOrder
    avgSwolf?: SortOrder
    avgStrokeRate?: SortOrder
    steps?: SortOrder
    totalReps?: SortOrder
    totalSets?: SortOrder
    bestLapTime?: SortOrder
    lapCount?: SortOrder
  }

  export interface DecimalNullableWithAggregatesFilter<$PrismaModel = never> {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export interface DecimalWithAggregatesFilter<$PrismaModel = never> {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export interface BoolNullableWithAggregatesFilter<$PrismaModel = never> {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export interface BlogCommentCreateNestedManyWithoutUser_infoInput {
    create?: XOR<BlogCommentCreateWithoutUser_infoInput, BlogCommentUncheckedCreateWithoutUser_infoInput> | BlogCommentCreateWithoutUser_infoInput[] | BlogCommentUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogCommentCreateOrConnectWithoutUser_infoInput | BlogCommentCreateOrConnectWithoutUser_infoInput[]
    createMany?: BlogCommentCreateManyUser_infoInputEnvelope
    connect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
  }

  export interface BlogSubCommentCreateNestedManyWithoutUser_infoInput {
    create?: XOR<BlogSubCommentCreateWithoutUser_infoInput, BlogSubCommentUncheckedCreateWithoutUser_infoInput> | BlogSubCommentCreateWithoutUser_infoInput[] | BlogSubCommentUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogSubCommentCreateOrConnectWithoutUser_infoInput | BlogSubCommentCreateOrConnectWithoutUser_infoInput[]
    createMany?: BlogSubCommentCreateManyUser_infoInputEnvelope
    connect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
  }

  export interface BlogLikeCreateNestedManyWithoutUser_infoInput {
    create?: XOR<BlogLikeCreateWithoutUser_infoInput, BlogLikeUncheckedCreateWithoutUser_infoInput> | BlogLikeCreateWithoutUser_infoInput[] | BlogLikeUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutUser_infoInput | BlogLikeCreateOrConnectWithoutUser_infoInput[]
    createMany?: BlogLikeCreateManyUser_infoInputEnvelope
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
  }

  export interface OAuthCreateNestedManyWithoutUserInput {
    create?: XOR<OAuthCreateWithoutUserInput, OAuthUncheckedCreateWithoutUserInput> | OAuthCreateWithoutUserInput[] | OAuthUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthCreateOrConnectWithoutUserInput | OAuthCreateOrConnectWithoutUserInput[]
    createMany?: OAuthCreateManyUserInputEnvelope
    connect?: OAuthWhereUniqueInput | OAuthWhereUniqueInput[]
  }

  export interface AccessTokenCreateNestedManyWithoutUserInfoInput {
    create?: XOR<AccessTokenCreateWithoutUserInfoInput, AccessTokenUncheckedCreateWithoutUserInfoInput> | AccessTokenCreateWithoutUserInfoInput[] | AccessTokenUncheckedCreateWithoutUserInfoInput[]
    connectOrCreate?: AccessTokenCreateOrConnectWithoutUserInfoInput | AccessTokenCreateOrConnectWithoutUserInfoInput[]
    createMany?: AccessTokenCreateManyUserInfoInputEnvelope
    connect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
  }

  export interface UserConfigCreateNestedOneWithoutUserInfoInput {
    create?: XOR<UserConfigCreateWithoutUserInfoInput, UserConfigUncheckedCreateWithoutUserInfoInput>
    connectOrCreate?: UserConfigCreateOrConnectWithoutUserInfoInput
    connect?: UserConfigWhereUniqueInput
  }

  export interface BlogMemoCreateNestedManyWithoutUser_infoInput {
    create?: XOR<BlogMemoCreateWithoutUser_infoInput, BlogMemoUncheckedCreateWithoutUser_infoInput> | BlogMemoCreateWithoutUser_infoInput[] | BlogMemoUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogMemoCreateOrConnectWithoutUser_infoInput | BlogMemoCreateOrConnectWithoutUser_infoInput[]
    createMany?: BlogMemoCreateManyUser_infoInputEnvelope
    connect?: BlogMemoWhereUniqueInput | BlogMemoWhereUniqueInput[]
  }

  export interface MemoTagCreateNestedManyWithoutUser_infoInput {
    create?: XOR<MemoTagCreateWithoutUser_infoInput, MemoTagUncheckedCreateWithoutUser_infoInput> | MemoTagCreateWithoutUser_infoInput[] | MemoTagUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: MemoTagCreateOrConnectWithoutUser_infoInput | MemoTagCreateOrConnectWithoutUser_infoInput[]
    createMany?: MemoTagCreateManyUser_infoInputEnvelope
    connect?: MemoTagWhereUniqueInput | MemoTagWhereUniqueInput[]
  }

  export interface BlogCommentUncheckedCreateNestedManyWithoutUser_infoInput {
    create?: XOR<BlogCommentCreateWithoutUser_infoInput, BlogCommentUncheckedCreateWithoutUser_infoInput> | BlogCommentCreateWithoutUser_infoInput[] | BlogCommentUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogCommentCreateOrConnectWithoutUser_infoInput | BlogCommentCreateOrConnectWithoutUser_infoInput[]
    createMany?: BlogCommentCreateManyUser_infoInputEnvelope
    connect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
  }

  export interface BlogSubCommentUncheckedCreateNestedManyWithoutUser_infoInput {
    create?: XOR<BlogSubCommentCreateWithoutUser_infoInput, BlogSubCommentUncheckedCreateWithoutUser_infoInput> | BlogSubCommentCreateWithoutUser_infoInput[] | BlogSubCommentUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogSubCommentCreateOrConnectWithoutUser_infoInput | BlogSubCommentCreateOrConnectWithoutUser_infoInput[]
    createMany?: BlogSubCommentCreateManyUser_infoInputEnvelope
    connect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
  }

  export interface BlogLikeUncheckedCreateNestedManyWithoutUser_infoInput {
    create?: XOR<BlogLikeCreateWithoutUser_infoInput, BlogLikeUncheckedCreateWithoutUser_infoInput> | BlogLikeCreateWithoutUser_infoInput[] | BlogLikeUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutUser_infoInput | BlogLikeCreateOrConnectWithoutUser_infoInput[]
    createMany?: BlogLikeCreateManyUser_infoInputEnvelope
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
  }

  export interface OAuthUncheckedCreateNestedManyWithoutUserInput {
    create?: XOR<OAuthCreateWithoutUserInput, OAuthUncheckedCreateWithoutUserInput> | OAuthCreateWithoutUserInput[] | OAuthUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthCreateOrConnectWithoutUserInput | OAuthCreateOrConnectWithoutUserInput[]
    createMany?: OAuthCreateManyUserInputEnvelope
    connect?: OAuthWhereUniqueInput | OAuthWhereUniqueInput[]
  }

  export interface AccessTokenUncheckedCreateNestedManyWithoutUserInfoInput {
    create?: XOR<AccessTokenCreateWithoutUserInfoInput, AccessTokenUncheckedCreateWithoutUserInfoInput> | AccessTokenCreateWithoutUserInfoInput[] | AccessTokenUncheckedCreateWithoutUserInfoInput[]
    connectOrCreate?: AccessTokenCreateOrConnectWithoutUserInfoInput | AccessTokenCreateOrConnectWithoutUserInfoInput[]
    createMany?: AccessTokenCreateManyUserInfoInputEnvelope
    connect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
  }

  export interface UserConfigUncheckedCreateNestedOneWithoutUserInfoInput {
    create?: XOR<UserConfigCreateWithoutUserInfoInput, UserConfigUncheckedCreateWithoutUserInfoInput>
    connectOrCreate?: UserConfigCreateOrConnectWithoutUserInfoInput
    connect?: UserConfigWhereUniqueInput
  }

  export interface BlogMemoUncheckedCreateNestedManyWithoutUser_infoInput {
    create?: XOR<BlogMemoCreateWithoutUser_infoInput, BlogMemoUncheckedCreateWithoutUser_infoInput> | BlogMemoCreateWithoutUser_infoInput[] | BlogMemoUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogMemoCreateOrConnectWithoutUser_infoInput | BlogMemoCreateOrConnectWithoutUser_infoInput[]
    createMany?: BlogMemoCreateManyUser_infoInputEnvelope
    connect?: BlogMemoWhereUniqueInput | BlogMemoWhereUniqueInput[]
  }

  export interface MemoTagUncheckedCreateNestedManyWithoutUser_infoInput {
    create?: XOR<MemoTagCreateWithoutUser_infoInput, MemoTagUncheckedCreateWithoutUser_infoInput> | MemoTagCreateWithoutUser_infoInput[] | MemoTagUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: MemoTagCreateOrConnectWithoutUser_infoInput | MemoTagCreateOrConnectWithoutUser_infoInput[]
    createMany?: MemoTagCreateManyUser_infoInputEnvelope
    connect?: MemoTagWhereUniqueInput | MemoTagWhereUniqueInput[]
  }

  export interface StringFieldUpdateOperationsInput {
    set?: string
  }

  export interface NullableStringFieldUpdateOperationsInput {
    set?: string | null
  }

  export interface IntFieldUpdateOperationsInput {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export interface BlogCommentUpdateManyWithoutUser_infoNestedInput {
    create?: XOR<BlogCommentCreateWithoutUser_infoInput, BlogCommentUncheckedCreateWithoutUser_infoInput> | BlogCommentCreateWithoutUser_infoInput[] | BlogCommentUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogCommentCreateOrConnectWithoutUser_infoInput | BlogCommentCreateOrConnectWithoutUser_infoInput[]
    upsert?: BlogCommentUpsertWithWhereUniqueWithoutUser_infoInput | BlogCommentUpsertWithWhereUniqueWithoutUser_infoInput[]
    createMany?: BlogCommentCreateManyUser_infoInputEnvelope
    set?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    disconnect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    delete?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    connect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    update?: BlogCommentUpdateWithWhereUniqueWithoutUser_infoInput | BlogCommentUpdateWithWhereUniqueWithoutUser_infoInput[]
    updateMany?: BlogCommentUpdateManyWithWhereWithoutUser_infoInput | BlogCommentUpdateManyWithWhereWithoutUser_infoInput[]
    deleteMany?: BlogCommentScalarWhereInput | BlogCommentScalarWhereInput[]
  }

  export interface BlogSubCommentUpdateManyWithoutUser_infoNestedInput {
    create?: XOR<BlogSubCommentCreateWithoutUser_infoInput, BlogSubCommentUncheckedCreateWithoutUser_infoInput> | BlogSubCommentCreateWithoutUser_infoInput[] | BlogSubCommentUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogSubCommentCreateOrConnectWithoutUser_infoInput | BlogSubCommentCreateOrConnectWithoutUser_infoInput[]
    upsert?: BlogSubCommentUpsertWithWhereUniqueWithoutUser_infoInput | BlogSubCommentUpsertWithWhereUniqueWithoutUser_infoInput[]
    createMany?: BlogSubCommentCreateManyUser_infoInputEnvelope
    set?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    disconnect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    delete?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    connect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    update?: BlogSubCommentUpdateWithWhereUniqueWithoutUser_infoInput | BlogSubCommentUpdateWithWhereUniqueWithoutUser_infoInput[]
    updateMany?: BlogSubCommentUpdateManyWithWhereWithoutUser_infoInput | BlogSubCommentUpdateManyWithWhereWithoutUser_infoInput[]
    deleteMany?: BlogSubCommentScalarWhereInput | BlogSubCommentScalarWhereInput[]
  }

  export interface BlogLikeUpdateManyWithoutUser_infoNestedInput {
    create?: XOR<BlogLikeCreateWithoutUser_infoInput, BlogLikeUncheckedCreateWithoutUser_infoInput> | BlogLikeCreateWithoutUser_infoInput[] | BlogLikeUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutUser_infoInput | BlogLikeCreateOrConnectWithoutUser_infoInput[]
    upsert?: BlogLikeUpsertWithWhereUniqueWithoutUser_infoInput | BlogLikeUpsertWithWhereUniqueWithoutUser_infoInput[]
    createMany?: BlogLikeCreateManyUser_infoInputEnvelope
    set?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    disconnect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    delete?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    update?: BlogLikeUpdateWithWhereUniqueWithoutUser_infoInput | BlogLikeUpdateWithWhereUniqueWithoutUser_infoInput[]
    updateMany?: BlogLikeUpdateManyWithWhereWithoutUser_infoInput | BlogLikeUpdateManyWithWhereWithoutUser_infoInput[]
    deleteMany?: BlogLikeScalarWhereInput | BlogLikeScalarWhereInput[]
  }

  export interface OAuthUpdateManyWithoutUserNestedInput {
    create?: XOR<OAuthCreateWithoutUserInput, OAuthUncheckedCreateWithoutUserInput> | OAuthCreateWithoutUserInput[] | OAuthUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthCreateOrConnectWithoutUserInput | OAuthCreateOrConnectWithoutUserInput[]
    upsert?: OAuthUpsertWithWhereUniqueWithoutUserInput | OAuthUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OAuthCreateManyUserInputEnvelope
    set?: OAuthWhereUniqueInput | OAuthWhereUniqueInput[]
    disconnect?: OAuthWhereUniqueInput | OAuthWhereUniqueInput[]
    delete?: OAuthWhereUniqueInput | OAuthWhereUniqueInput[]
    connect?: OAuthWhereUniqueInput | OAuthWhereUniqueInput[]
    update?: OAuthUpdateWithWhereUniqueWithoutUserInput | OAuthUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OAuthUpdateManyWithWhereWithoutUserInput | OAuthUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OAuthScalarWhereInput | OAuthScalarWhereInput[]
  }

  export interface AccessTokenUpdateManyWithoutUserInfoNestedInput {
    create?: XOR<AccessTokenCreateWithoutUserInfoInput, AccessTokenUncheckedCreateWithoutUserInfoInput> | AccessTokenCreateWithoutUserInfoInput[] | AccessTokenUncheckedCreateWithoutUserInfoInput[]
    connectOrCreate?: AccessTokenCreateOrConnectWithoutUserInfoInput | AccessTokenCreateOrConnectWithoutUserInfoInput[]
    upsert?: AccessTokenUpsertWithWhereUniqueWithoutUserInfoInput | AccessTokenUpsertWithWhereUniqueWithoutUserInfoInput[]
    createMany?: AccessTokenCreateManyUserInfoInputEnvelope
    set?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    disconnect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    delete?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    connect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    update?: AccessTokenUpdateWithWhereUniqueWithoutUserInfoInput | AccessTokenUpdateWithWhereUniqueWithoutUserInfoInput[]
    updateMany?: AccessTokenUpdateManyWithWhereWithoutUserInfoInput | AccessTokenUpdateManyWithWhereWithoutUserInfoInput[]
    deleteMany?: AccessTokenScalarWhereInput | AccessTokenScalarWhereInput[]
  }

  export interface UserConfigUpdateOneWithoutUserInfoNestedInput {
    create?: XOR<UserConfigCreateWithoutUserInfoInput, UserConfigUncheckedCreateWithoutUserInfoInput>
    connectOrCreate?: UserConfigCreateOrConnectWithoutUserInfoInput
    upsert?: UserConfigUpsertWithoutUserInfoInput
    disconnect?: UserConfigWhereInput | boolean
    delete?: UserConfigWhereInput | boolean
    connect?: UserConfigWhereUniqueInput
    update?: XOR<XOR<UserConfigUpdateToOneWithWhereWithoutUserInfoInput, UserConfigUpdateWithoutUserInfoInput>, UserConfigUncheckedUpdateWithoutUserInfoInput>
  }

  export interface BlogMemoUpdateManyWithoutUser_infoNestedInput {
    create?: XOR<BlogMemoCreateWithoutUser_infoInput, BlogMemoUncheckedCreateWithoutUser_infoInput> | BlogMemoCreateWithoutUser_infoInput[] | BlogMemoUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogMemoCreateOrConnectWithoutUser_infoInput | BlogMemoCreateOrConnectWithoutUser_infoInput[]
    upsert?: BlogMemoUpsertWithWhereUniqueWithoutUser_infoInput | BlogMemoUpsertWithWhereUniqueWithoutUser_infoInput[]
    createMany?: BlogMemoCreateManyUser_infoInputEnvelope
    set?: BlogMemoWhereUniqueInput | BlogMemoWhereUniqueInput[]
    disconnect?: BlogMemoWhereUniqueInput | BlogMemoWhereUniqueInput[]
    delete?: BlogMemoWhereUniqueInput | BlogMemoWhereUniqueInput[]
    connect?: BlogMemoWhereUniqueInput | BlogMemoWhereUniqueInput[]
    update?: BlogMemoUpdateWithWhereUniqueWithoutUser_infoInput | BlogMemoUpdateWithWhereUniqueWithoutUser_infoInput[]
    updateMany?: BlogMemoUpdateManyWithWhereWithoutUser_infoInput | BlogMemoUpdateManyWithWhereWithoutUser_infoInput[]
    deleteMany?: BlogMemoScalarWhereInput | BlogMemoScalarWhereInput[]
  }

  export interface MemoTagUpdateManyWithoutUser_infoNestedInput {
    create?: XOR<MemoTagCreateWithoutUser_infoInput, MemoTagUncheckedCreateWithoutUser_infoInput> | MemoTagCreateWithoutUser_infoInput[] | MemoTagUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: MemoTagCreateOrConnectWithoutUser_infoInput | MemoTagCreateOrConnectWithoutUser_infoInput[]
    upsert?: MemoTagUpsertWithWhereUniqueWithoutUser_infoInput | MemoTagUpsertWithWhereUniqueWithoutUser_infoInput[]
    createMany?: MemoTagCreateManyUser_infoInputEnvelope
    set?: MemoTagWhereUniqueInput | MemoTagWhereUniqueInput[]
    disconnect?: MemoTagWhereUniqueInput | MemoTagWhereUniqueInput[]
    delete?: MemoTagWhereUniqueInput | MemoTagWhereUniqueInput[]
    connect?: MemoTagWhereUniqueInput | MemoTagWhereUniqueInput[]
    update?: MemoTagUpdateWithWhereUniqueWithoutUser_infoInput | MemoTagUpdateWithWhereUniqueWithoutUser_infoInput[]
    updateMany?: MemoTagUpdateManyWithWhereWithoutUser_infoInput | MemoTagUpdateManyWithWhereWithoutUser_infoInput[]
    deleteMany?: MemoTagScalarWhereInput | MemoTagScalarWhereInput[]
  }

  export interface BlogCommentUncheckedUpdateManyWithoutUser_infoNestedInput {
    create?: XOR<BlogCommentCreateWithoutUser_infoInput, BlogCommentUncheckedCreateWithoutUser_infoInput> | BlogCommentCreateWithoutUser_infoInput[] | BlogCommentUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogCommentCreateOrConnectWithoutUser_infoInput | BlogCommentCreateOrConnectWithoutUser_infoInput[]
    upsert?: BlogCommentUpsertWithWhereUniqueWithoutUser_infoInput | BlogCommentUpsertWithWhereUniqueWithoutUser_infoInput[]
    createMany?: BlogCommentCreateManyUser_infoInputEnvelope
    set?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    disconnect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    delete?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    connect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    update?: BlogCommentUpdateWithWhereUniqueWithoutUser_infoInput | BlogCommentUpdateWithWhereUniqueWithoutUser_infoInput[]
    updateMany?: BlogCommentUpdateManyWithWhereWithoutUser_infoInput | BlogCommentUpdateManyWithWhereWithoutUser_infoInput[]
    deleteMany?: BlogCommentScalarWhereInput | BlogCommentScalarWhereInput[]
  }

  export interface BlogSubCommentUncheckedUpdateManyWithoutUser_infoNestedInput {
    create?: XOR<BlogSubCommentCreateWithoutUser_infoInput, BlogSubCommentUncheckedCreateWithoutUser_infoInput> | BlogSubCommentCreateWithoutUser_infoInput[] | BlogSubCommentUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogSubCommentCreateOrConnectWithoutUser_infoInput | BlogSubCommentCreateOrConnectWithoutUser_infoInput[]
    upsert?: BlogSubCommentUpsertWithWhereUniqueWithoutUser_infoInput | BlogSubCommentUpsertWithWhereUniqueWithoutUser_infoInput[]
    createMany?: BlogSubCommentCreateManyUser_infoInputEnvelope
    set?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    disconnect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    delete?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    connect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    update?: BlogSubCommentUpdateWithWhereUniqueWithoutUser_infoInput | BlogSubCommentUpdateWithWhereUniqueWithoutUser_infoInput[]
    updateMany?: BlogSubCommentUpdateManyWithWhereWithoutUser_infoInput | BlogSubCommentUpdateManyWithWhereWithoutUser_infoInput[]
    deleteMany?: BlogSubCommentScalarWhereInput | BlogSubCommentScalarWhereInput[]
  }

  export interface BlogLikeUncheckedUpdateManyWithoutUser_infoNestedInput {
    create?: XOR<BlogLikeCreateWithoutUser_infoInput, BlogLikeUncheckedCreateWithoutUser_infoInput> | BlogLikeCreateWithoutUser_infoInput[] | BlogLikeUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutUser_infoInput | BlogLikeCreateOrConnectWithoutUser_infoInput[]
    upsert?: BlogLikeUpsertWithWhereUniqueWithoutUser_infoInput | BlogLikeUpsertWithWhereUniqueWithoutUser_infoInput[]
    createMany?: BlogLikeCreateManyUser_infoInputEnvelope
    set?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    disconnect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    delete?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    update?: BlogLikeUpdateWithWhereUniqueWithoutUser_infoInput | BlogLikeUpdateWithWhereUniqueWithoutUser_infoInput[]
    updateMany?: BlogLikeUpdateManyWithWhereWithoutUser_infoInput | BlogLikeUpdateManyWithWhereWithoutUser_infoInput[]
    deleteMany?: BlogLikeScalarWhereInput | BlogLikeScalarWhereInput[]
  }

  export interface OAuthUncheckedUpdateManyWithoutUserNestedInput {
    create?: XOR<OAuthCreateWithoutUserInput, OAuthUncheckedCreateWithoutUserInput> | OAuthCreateWithoutUserInput[] | OAuthUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthCreateOrConnectWithoutUserInput | OAuthCreateOrConnectWithoutUserInput[]
    upsert?: OAuthUpsertWithWhereUniqueWithoutUserInput | OAuthUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OAuthCreateManyUserInputEnvelope
    set?: OAuthWhereUniqueInput | OAuthWhereUniqueInput[]
    disconnect?: OAuthWhereUniqueInput | OAuthWhereUniqueInput[]
    delete?: OAuthWhereUniqueInput | OAuthWhereUniqueInput[]
    connect?: OAuthWhereUniqueInput | OAuthWhereUniqueInput[]
    update?: OAuthUpdateWithWhereUniqueWithoutUserInput | OAuthUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OAuthUpdateManyWithWhereWithoutUserInput | OAuthUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OAuthScalarWhereInput | OAuthScalarWhereInput[]
  }

  export interface AccessTokenUncheckedUpdateManyWithoutUserInfoNestedInput {
    create?: XOR<AccessTokenCreateWithoutUserInfoInput, AccessTokenUncheckedCreateWithoutUserInfoInput> | AccessTokenCreateWithoutUserInfoInput[] | AccessTokenUncheckedCreateWithoutUserInfoInput[]
    connectOrCreate?: AccessTokenCreateOrConnectWithoutUserInfoInput | AccessTokenCreateOrConnectWithoutUserInfoInput[]
    upsert?: AccessTokenUpsertWithWhereUniqueWithoutUserInfoInput | AccessTokenUpsertWithWhereUniqueWithoutUserInfoInput[]
    createMany?: AccessTokenCreateManyUserInfoInputEnvelope
    set?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    disconnect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    delete?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    connect?: AccessTokenWhereUniqueInput | AccessTokenWhereUniqueInput[]
    update?: AccessTokenUpdateWithWhereUniqueWithoutUserInfoInput | AccessTokenUpdateWithWhereUniqueWithoutUserInfoInput[]
    updateMany?: AccessTokenUpdateManyWithWhereWithoutUserInfoInput | AccessTokenUpdateManyWithWhereWithoutUserInfoInput[]
    deleteMany?: AccessTokenScalarWhereInput | AccessTokenScalarWhereInput[]
  }

  export interface UserConfigUncheckedUpdateOneWithoutUserInfoNestedInput {
    create?: XOR<UserConfigCreateWithoutUserInfoInput, UserConfigUncheckedCreateWithoutUserInfoInput>
    connectOrCreate?: UserConfigCreateOrConnectWithoutUserInfoInput
    upsert?: UserConfigUpsertWithoutUserInfoInput
    disconnect?: UserConfigWhereInput | boolean
    delete?: UserConfigWhereInput | boolean
    connect?: UserConfigWhereUniqueInput
    update?: XOR<XOR<UserConfigUpdateToOneWithWhereWithoutUserInfoInput, UserConfigUpdateWithoutUserInfoInput>, UserConfigUncheckedUpdateWithoutUserInfoInput>
  }

  export interface BlogMemoUncheckedUpdateManyWithoutUser_infoNestedInput {
    create?: XOR<BlogMemoCreateWithoutUser_infoInput, BlogMemoUncheckedCreateWithoutUser_infoInput> | BlogMemoCreateWithoutUser_infoInput[] | BlogMemoUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: BlogMemoCreateOrConnectWithoutUser_infoInput | BlogMemoCreateOrConnectWithoutUser_infoInput[]
    upsert?: BlogMemoUpsertWithWhereUniqueWithoutUser_infoInput | BlogMemoUpsertWithWhereUniqueWithoutUser_infoInput[]
    createMany?: BlogMemoCreateManyUser_infoInputEnvelope
    set?: BlogMemoWhereUniqueInput | BlogMemoWhereUniqueInput[]
    disconnect?: BlogMemoWhereUniqueInput | BlogMemoWhereUniqueInput[]
    delete?: BlogMemoWhereUniqueInput | BlogMemoWhereUniqueInput[]
    connect?: BlogMemoWhereUniqueInput | BlogMemoWhereUniqueInput[]
    update?: BlogMemoUpdateWithWhereUniqueWithoutUser_infoInput | BlogMemoUpdateWithWhereUniqueWithoutUser_infoInput[]
    updateMany?: BlogMemoUpdateManyWithWhereWithoutUser_infoInput | BlogMemoUpdateManyWithWhereWithoutUser_infoInput[]
    deleteMany?: BlogMemoScalarWhereInput | BlogMemoScalarWhereInput[]
  }

  export interface MemoTagUncheckedUpdateManyWithoutUser_infoNestedInput {
    create?: XOR<MemoTagCreateWithoutUser_infoInput, MemoTagUncheckedCreateWithoutUser_infoInput> | MemoTagCreateWithoutUser_infoInput[] | MemoTagUncheckedCreateWithoutUser_infoInput[]
    connectOrCreate?: MemoTagCreateOrConnectWithoutUser_infoInput | MemoTagCreateOrConnectWithoutUser_infoInput[]
    upsert?: MemoTagUpsertWithWhereUniqueWithoutUser_infoInput | MemoTagUpsertWithWhereUniqueWithoutUser_infoInput[]
    createMany?: MemoTagCreateManyUser_infoInputEnvelope
    set?: MemoTagWhereUniqueInput | MemoTagWhereUniqueInput[]
    disconnect?: MemoTagWhereUniqueInput | MemoTagWhereUniqueInput[]
    delete?: MemoTagWhereUniqueInput | MemoTagWhereUniqueInput[]
    connect?: MemoTagWhereUniqueInput | MemoTagWhereUniqueInput[]
    update?: MemoTagUpdateWithWhereUniqueWithoutUser_infoInput | MemoTagUpdateWithWhereUniqueWithoutUser_infoInput[]
    updateMany?: MemoTagUpdateManyWithWhereWithoutUser_infoInput | MemoTagUpdateManyWithWhereWithoutUser_infoInput[]
    deleteMany?: MemoTagScalarWhereInput | MemoTagScalarWhereInput[]
  }

  export interface UserCreateNestedOneWithoutUser_configInput {
    create?: XOR<UserCreateWithoutUser_configInput, UserUncheckedCreateWithoutUser_configInput>
    connectOrCreate?: UserCreateOrConnectWithoutUser_configInput
    connect?: UserWhereUniqueInput
  }

  export interface NullableIntFieldUpdateOperationsInput {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export interface DateTimeFieldUpdateOperationsInput {
    set?: Date | string
  }

  export interface UserUpdateOneRequiredWithoutUser_configNestedInput {
    create?: XOR<UserCreateWithoutUser_configInput, UserUncheckedCreateWithoutUser_configInput>
    connectOrCreate?: UserCreateOrConnectWithoutUser_configInput
    upsert?: UserUpsertWithoutUser_configInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUser_configInput, UserUpdateWithoutUser_configInput>, UserUncheckedUpdateWithoutUser_configInput>
  }

  export interface UserCreateNestedOneWithoutTokensInput {
    create?: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokensInput
    connect?: UserWhereUniqueInput
  }

  export interface BoolFieldUpdateOperationsInput {
    set?: boolean
  }

  export interface UserUpdateOneRequiredWithoutTokensNestedInput {
    create?: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokensInput
    upsert?: UserUpsertWithoutTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTokensInput, UserUpdateWithoutTokensInput>, UserUncheckedUpdateWithoutTokensInput>
  }

  export interface UserCreateNestedOneWithoutOauthInput {
    create?: XOR<UserCreateWithoutOauthInput, UserUncheckedCreateWithoutOauthInput>
    connectOrCreate?: UserCreateOrConnectWithoutOauthInput
    connect?: UserWhereUniqueInput
  }

  export interface UserUpdateOneWithoutOauthNestedInput {
    create?: XOR<UserCreateWithoutOauthInput, UserUncheckedCreateWithoutOauthInput>
    connectOrCreate?: UserCreateOrConnectWithoutOauthInput
    upsert?: UserUpsertWithoutOauthInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOauthInput, UserUpdateWithoutOauthInput>, UserUncheckedUpdateWithoutOauthInput>
  }

  export interface UserCreateNestedOneWithoutCommentsInput {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    connect?: UserWhereUniqueInput
  }

  export interface BlogSubCommentCreateNestedManyWithoutComment_infoInput {
    create?: XOR<BlogSubCommentCreateWithoutComment_infoInput, BlogSubCommentUncheckedCreateWithoutComment_infoInput> | BlogSubCommentCreateWithoutComment_infoInput[] | BlogSubCommentUncheckedCreateWithoutComment_infoInput[]
    connectOrCreate?: BlogSubCommentCreateOrConnectWithoutComment_infoInput | BlogSubCommentCreateOrConnectWithoutComment_infoInput[]
    createMany?: BlogSubCommentCreateManyComment_infoInputEnvelope
    connect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
  }

  export interface BlogLikeCreateNestedManyWithoutComment_infoInput {
    create?: XOR<BlogLikeCreateWithoutComment_infoInput, BlogLikeUncheckedCreateWithoutComment_infoInput> | BlogLikeCreateWithoutComment_infoInput[] | BlogLikeUncheckedCreateWithoutComment_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutComment_infoInput | BlogLikeCreateOrConnectWithoutComment_infoInput[]
    createMany?: BlogLikeCreateManyComment_infoInputEnvelope
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
  }

  export interface BlogMemoCreateNestedOneWithoutCommentsInput {
    create?: XOR<BlogMemoCreateWithoutCommentsInput, BlogMemoUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: BlogMemoCreateOrConnectWithoutCommentsInput
    connect?: BlogMemoWhereUniqueInput
  }

  export interface BlogSubCommentUncheckedCreateNestedManyWithoutComment_infoInput {
    create?: XOR<BlogSubCommentCreateWithoutComment_infoInput, BlogSubCommentUncheckedCreateWithoutComment_infoInput> | BlogSubCommentCreateWithoutComment_infoInput[] | BlogSubCommentUncheckedCreateWithoutComment_infoInput[]
    connectOrCreate?: BlogSubCommentCreateOrConnectWithoutComment_infoInput | BlogSubCommentCreateOrConnectWithoutComment_infoInput[]
    createMany?: BlogSubCommentCreateManyComment_infoInputEnvelope
    connect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
  }

  export interface BlogLikeUncheckedCreateNestedManyWithoutComment_infoInput {
    create?: XOR<BlogLikeCreateWithoutComment_infoInput, BlogLikeUncheckedCreateWithoutComment_infoInput> | BlogLikeCreateWithoutComment_infoInput[] | BlogLikeUncheckedCreateWithoutComment_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutComment_infoInput | BlogLikeCreateOrConnectWithoutComment_infoInput[]
    createMany?: BlogLikeCreateManyComment_infoInputEnvelope
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
  }

  export interface UserUpdateOneWithoutCommentsNestedInput {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    upsert?: UserUpsertWithoutCommentsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommentsInput, UserUpdateWithoutCommentsInput>, UserUncheckedUpdateWithoutCommentsInput>
  }

  export interface BlogSubCommentUpdateManyWithoutComment_infoNestedInput {
    create?: XOR<BlogSubCommentCreateWithoutComment_infoInput, BlogSubCommentUncheckedCreateWithoutComment_infoInput> | BlogSubCommentCreateWithoutComment_infoInput[] | BlogSubCommentUncheckedCreateWithoutComment_infoInput[]
    connectOrCreate?: BlogSubCommentCreateOrConnectWithoutComment_infoInput | BlogSubCommentCreateOrConnectWithoutComment_infoInput[]
    upsert?: BlogSubCommentUpsertWithWhereUniqueWithoutComment_infoInput | BlogSubCommentUpsertWithWhereUniqueWithoutComment_infoInput[]
    createMany?: BlogSubCommentCreateManyComment_infoInputEnvelope
    set?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    disconnect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    delete?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    connect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    update?: BlogSubCommentUpdateWithWhereUniqueWithoutComment_infoInput | BlogSubCommentUpdateWithWhereUniqueWithoutComment_infoInput[]
    updateMany?: BlogSubCommentUpdateManyWithWhereWithoutComment_infoInput | BlogSubCommentUpdateManyWithWhereWithoutComment_infoInput[]
    deleteMany?: BlogSubCommentScalarWhereInput | BlogSubCommentScalarWhereInput[]
  }

  export interface BlogLikeUpdateManyWithoutComment_infoNestedInput {
    create?: XOR<BlogLikeCreateWithoutComment_infoInput, BlogLikeUncheckedCreateWithoutComment_infoInput> | BlogLikeCreateWithoutComment_infoInput[] | BlogLikeUncheckedCreateWithoutComment_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutComment_infoInput | BlogLikeCreateOrConnectWithoutComment_infoInput[]
    upsert?: BlogLikeUpsertWithWhereUniqueWithoutComment_infoInput | BlogLikeUpsertWithWhereUniqueWithoutComment_infoInput[]
    createMany?: BlogLikeCreateManyComment_infoInputEnvelope
    set?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    disconnect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    delete?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    update?: BlogLikeUpdateWithWhereUniqueWithoutComment_infoInput | BlogLikeUpdateWithWhereUniqueWithoutComment_infoInput[]
    updateMany?: BlogLikeUpdateManyWithWhereWithoutComment_infoInput | BlogLikeUpdateManyWithWhereWithoutComment_infoInput[]
    deleteMany?: BlogLikeScalarWhereInput | BlogLikeScalarWhereInput[]
  }

  export interface BlogMemoUpdateOneWithoutCommentsNestedInput {
    create?: XOR<BlogMemoCreateWithoutCommentsInput, BlogMemoUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: BlogMemoCreateOrConnectWithoutCommentsInput
    upsert?: BlogMemoUpsertWithoutCommentsInput
    disconnect?: BlogMemoWhereInput | boolean
    delete?: BlogMemoWhereInput | boolean
    connect?: BlogMemoWhereUniqueInput
    update?: XOR<XOR<BlogMemoUpdateToOneWithWhereWithoutCommentsInput, BlogMemoUpdateWithoutCommentsInput>, BlogMemoUncheckedUpdateWithoutCommentsInput>
  }

  export interface BlogSubCommentUncheckedUpdateManyWithoutComment_infoNestedInput {
    create?: XOR<BlogSubCommentCreateWithoutComment_infoInput, BlogSubCommentUncheckedCreateWithoutComment_infoInput> | BlogSubCommentCreateWithoutComment_infoInput[] | BlogSubCommentUncheckedCreateWithoutComment_infoInput[]
    connectOrCreate?: BlogSubCommentCreateOrConnectWithoutComment_infoInput | BlogSubCommentCreateOrConnectWithoutComment_infoInput[]
    upsert?: BlogSubCommentUpsertWithWhereUniqueWithoutComment_infoInput | BlogSubCommentUpsertWithWhereUniqueWithoutComment_infoInput[]
    createMany?: BlogSubCommentCreateManyComment_infoInputEnvelope
    set?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    disconnect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    delete?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    connect?: BlogSubCommentWhereUniqueInput | BlogSubCommentWhereUniqueInput[]
    update?: BlogSubCommentUpdateWithWhereUniqueWithoutComment_infoInput | BlogSubCommentUpdateWithWhereUniqueWithoutComment_infoInput[]
    updateMany?: BlogSubCommentUpdateManyWithWhereWithoutComment_infoInput | BlogSubCommentUpdateManyWithWhereWithoutComment_infoInput[]
    deleteMany?: BlogSubCommentScalarWhereInput | BlogSubCommentScalarWhereInput[]
  }

  export interface BlogLikeUncheckedUpdateManyWithoutComment_infoNestedInput {
    create?: XOR<BlogLikeCreateWithoutComment_infoInput, BlogLikeUncheckedCreateWithoutComment_infoInput> | BlogLikeCreateWithoutComment_infoInput[] | BlogLikeUncheckedCreateWithoutComment_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutComment_infoInput | BlogLikeCreateOrConnectWithoutComment_infoInput[]
    upsert?: BlogLikeUpsertWithWhereUniqueWithoutComment_infoInput | BlogLikeUpsertWithWhereUniqueWithoutComment_infoInput[]
    createMany?: BlogLikeCreateManyComment_infoInputEnvelope
    set?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    disconnect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    delete?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    update?: BlogLikeUpdateWithWhereUniqueWithoutComment_infoInput | BlogLikeUpdateWithWhereUniqueWithoutComment_infoInput[]
    updateMany?: BlogLikeUpdateManyWithWhereWithoutComment_infoInput | BlogLikeUpdateManyWithWhereWithoutComment_infoInput[]
    deleteMany?: BlogLikeScalarWhereInput | BlogLikeScalarWhereInput[]
  }

  export interface BlogCommentCreateNestedOneWithoutSub_commentsInput {
    create?: XOR<BlogCommentCreateWithoutSub_commentsInput, BlogCommentUncheckedCreateWithoutSub_commentsInput>
    connectOrCreate?: BlogCommentCreateOrConnectWithoutSub_commentsInput
    connect?: BlogCommentWhereUniqueInput
  }

  export interface UserCreateNestedOneWithoutSub_commentsInput {
    create?: XOR<UserCreateWithoutSub_commentsInput, UserUncheckedCreateWithoutSub_commentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSub_commentsInput
    connect?: UserWhereUniqueInput
  }

  export interface BlogLikeCreateNestedManyWithoutSub_comment_infoInput {
    create?: XOR<BlogLikeCreateWithoutSub_comment_infoInput, BlogLikeUncheckedCreateWithoutSub_comment_infoInput> | BlogLikeCreateWithoutSub_comment_infoInput[] | BlogLikeUncheckedCreateWithoutSub_comment_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutSub_comment_infoInput | BlogLikeCreateOrConnectWithoutSub_comment_infoInput[]
    createMany?: BlogLikeCreateManySub_comment_infoInputEnvelope
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
  }

  export interface BlogLikeUncheckedCreateNestedManyWithoutSub_comment_infoInput {
    create?: XOR<BlogLikeCreateWithoutSub_comment_infoInput, BlogLikeUncheckedCreateWithoutSub_comment_infoInput> | BlogLikeCreateWithoutSub_comment_infoInput[] | BlogLikeUncheckedCreateWithoutSub_comment_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutSub_comment_infoInput | BlogLikeCreateOrConnectWithoutSub_comment_infoInput[]
    createMany?: BlogLikeCreateManySub_comment_infoInputEnvelope
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
  }

  export interface BlogCommentUpdateOneRequiredWithoutSub_commentsNestedInput {
    create?: XOR<BlogCommentCreateWithoutSub_commentsInput, BlogCommentUncheckedCreateWithoutSub_commentsInput>
    connectOrCreate?: BlogCommentCreateOrConnectWithoutSub_commentsInput
    upsert?: BlogCommentUpsertWithoutSub_commentsInput
    connect?: BlogCommentWhereUniqueInput
    update?: XOR<XOR<BlogCommentUpdateToOneWithWhereWithoutSub_commentsInput, BlogCommentUpdateWithoutSub_commentsInput>, BlogCommentUncheckedUpdateWithoutSub_commentsInput>
  }

  export interface UserUpdateOneWithoutSub_commentsNestedInput {
    create?: XOR<UserCreateWithoutSub_commentsInput, UserUncheckedCreateWithoutSub_commentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSub_commentsInput
    upsert?: UserUpsertWithoutSub_commentsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSub_commentsInput, UserUpdateWithoutSub_commentsInput>, UserUncheckedUpdateWithoutSub_commentsInput>
  }

  export interface BlogLikeUpdateManyWithoutSub_comment_infoNestedInput {
    create?: XOR<BlogLikeCreateWithoutSub_comment_infoInput, BlogLikeUncheckedCreateWithoutSub_comment_infoInput> | BlogLikeCreateWithoutSub_comment_infoInput[] | BlogLikeUncheckedCreateWithoutSub_comment_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutSub_comment_infoInput | BlogLikeCreateOrConnectWithoutSub_comment_infoInput[]
    upsert?: BlogLikeUpsertWithWhereUniqueWithoutSub_comment_infoInput | BlogLikeUpsertWithWhereUniqueWithoutSub_comment_infoInput[]
    createMany?: BlogLikeCreateManySub_comment_infoInputEnvelope
    set?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    disconnect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    delete?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    update?: BlogLikeUpdateWithWhereUniqueWithoutSub_comment_infoInput | BlogLikeUpdateWithWhereUniqueWithoutSub_comment_infoInput[]
    updateMany?: BlogLikeUpdateManyWithWhereWithoutSub_comment_infoInput | BlogLikeUpdateManyWithWhereWithoutSub_comment_infoInput[]
    deleteMany?: BlogLikeScalarWhereInput | BlogLikeScalarWhereInput[]
  }

  export interface BlogLikeUncheckedUpdateManyWithoutSub_comment_infoNestedInput {
    create?: XOR<BlogLikeCreateWithoutSub_comment_infoInput, BlogLikeUncheckedCreateWithoutSub_comment_infoInput> | BlogLikeCreateWithoutSub_comment_infoInput[] | BlogLikeUncheckedCreateWithoutSub_comment_infoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutSub_comment_infoInput | BlogLikeCreateOrConnectWithoutSub_comment_infoInput[]
    upsert?: BlogLikeUpsertWithWhereUniqueWithoutSub_comment_infoInput | BlogLikeUpsertWithWhereUniqueWithoutSub_comment_infoInput[]
    createMany?: BlogLikeCreateManySub_comment_infoInputEnvelope
    set?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    disconnect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    delete?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    update?: BlogLikeUpdateWithWhereUniqueWithoutSub_comment_infoInput | BlogLikeUpdateWithWhereUniqueWithoutSub_comment_infoInput[]
    updateMany?: BlogLikeUpdateManyWithWhereWithoutSub_comment_infoInput | BlogLikeUpdateManyWithWhereWithoutSub_comment_infoInput[]
    deleteMany?: BlogLikeScalarWhereInput | BlogLikeScalarWhereInput[]
  }

  export interface BlogSubCommentCreateNestedOneWithoutLikesInput {
    create?: XOR<BlogSubCommentCreateWithoutLikesInput, BlogSubCommentUncheckedCreateWithoutLikesInput>
    connectOrCreate?: BlogSubCommentCreateOrConnectWithoutLikesInput
    connect?: BlogSubCommentWhereUniqueInput
  }

  export interface BlogCommentCreateNestedOneWithoutLikesInput {
    create?: XOR<BlogCommentCreateWithoutLikesInput, BlogCommentUncheckedCreateWithoutLikesInput>
    connectOrCreate?: BlogCommentCreateOrConnectWithoutLikesInput
    connect?: BlogCommentWhereUniqueInput
  }

  export interface UserCreateNestedOneWithoutLikesInput {
    create?: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLikesInput
    connect?: UserWhereUniqueInput
  }

  export interface BlogMemoCreateNestedOneWithoutLikesInput {
    create?: XOR<BlogMemoCreateWithoutLikesInput, BlogMemoUncheckedCreateWithoutLikesInput>
    connectOrCreate?: BlogMemoCreateOrConnectWithoutLikesInput
    connect?: BlogMemoWhereUniqueInput
  }

  export interface BlogSubCommentUpdateOneWithoutLikesNestedInput {
    create?: XOR<BlogSubCommentCreateWithoutLikesInput, BlogSubCommentUncheckedCreateWithoutLikesInput>
    connectOrCreate?: BlogSubCommentCreateOrConnectWithoutLikesInput
    upsert?: BlogSubCommentUpsertWithoutLikesInput
    disconnect?: BlogSubCommentWhereInput | boolean
    delete?: BlogSubCommentWhereInput | boolean
    connect?: BlogSubCommentWhereUniqueInput
    update?: XOR<XOR<BlogSubCommentUpdateToOneWithWhereWithoutLikesInput, BlogSubCommentUpdateWithoutLikesInput>, BlogSubCommentUncheckedUpdateWithoutLikesInput>
  }

  export interface BlogCommentUpdateOneWithoutLikesNestedInput {
    create?: XOR<BlogCommentCreateWithoutLikesInput, BlogCommentUncheckedCreateWithoutLikesInput>
    connectOrCreate?: BlogCommentCreateOrConnectWithoutLikesInput
    upsert?: BlogCommentUpsertWithoutLikesInput
    disconnect?: BlogCommentWhereInput | boolean
    delete?: BlogCommentWhereInput | boolean
    connect?: BlogCommentWhereUniqueInput
    update?: XOR<XOR<BlogCommentUpdateToOneWithWhereWithoutLikesInput, BlogCommentUpdateWithoutLikesInput>, BlogCommentUncheckedUpdateWithoutLikesInput>
  }

  export interface UserUpdateOneRequiredWithoutLikesNestedInput {
    create?: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLikesInput
    upsert?: UserUpsertWithoutLikesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLikesInput, UserUpdateWithoutLikesInput>, UserUncheckedUpdateWithoutLikesInput>
  }

  export interface BlogMemoUpdateOneWithoutLikesNestedInput {
    create?: XOR<BlogMemoCreateWithoutLikesInput, BlogMemoUncheckedCreateWithoutLikesInput>
    connectOrCreate?: BlogMemoCreateOrConnectWithoutLikesInput
    upsert?: BlogMemoUpsertWithoutLikesInput
    disconnect?: BlogMemoWhereInput | boolean
    delete?: BlogMemoWhereInput | boolean
    connect?: BlogMemoWhereUniqueInput
    update?: XOR<XOR<BlogMemoUpdateToOneWithWhereWithoutLikesInput, BlogMemoUpdateWithoutLikesInput>, BlogMemoUncheckedUpdateWithoutLikesInput>
  }

  export interface UserCreateNestedOneWithoutMemosInput {
    create?: XOR<UserCreateWithoutMemosInput, UserUncheckedCreateWithoutMemosInput>
    connectOrCreate?: UserCreateOrConnectWithoutMemosInput
    connect?: UserWhereUniqueInput
  }

  export interface MemoTagRelationsCreateNestedManyWithoutMemoInput {
    create?: XOR<MemoTagRelationsCreateWithoutMemoInput, MemoTagRelationsUncheckedCreateWithoutMemoInput> | MemoTagRelationsCreateWithoutMemoInput[] | MemoTagRelationsUncheckedCreateWithoutMemoInput[]
    connectOrCreate?: MemoTagRelationsCreateOrConnectWithoutMemoInput | MemoTagRelationsCreateOrConnectWithoutMemoInput[]
    createMany?: MemoTagRelationsCreateManyMemoInputEnvelope
    connect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
  }

  export interface BlogCommentCreateNestedManyWithoutMemo_infoInput {
    create?: XOR<BlogCommentCreateWithoutMemo_infoInput, BlogCommentUncheckedCreateWithoutMemo_infoInput> | BlogCommentCreateWithoutMemo_infoInput[] | BlogCommentUncheckedCreateWithoutMemo_infoInput[]
    connectOrCreate?: BlogCommentCreateOrConnectWithoutMemo_infoInput | BlogCommentCreateOrConnectWithoutMemo_infoInput[]
    createMany?: BlogCommentCreateManyMemo_infoInputEnvelope
    connect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
  }

  export interface BlogLikeCreateNestedManyWithoutBlogMemoInfoInput {
    create?: XOR<BlogLikeCreateWithoutBlogMemoInfoInput, BlogLikeUncheckedCreateWithoutBlogMemoInfoInput> | BlogLikeCreateWithoutBlogMemoInfoInput[] | BlogLikeUncheckedCreateWithoutBlogMemoInfoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutBlogMemoInfoInput | BlogLikeCreateOrConnectWithoutBlogMemoInfoInput[]
    createMany?: BlogLikeCreateManyBlogMemoInfoInputEnvelope
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
  }

  export interface MemoTagRelationsUncheckedCreateNestedManyWithoutMemoInput {
    create?: XOR<MemoTagRelationsCreateWithoutMemoInput, MemoTagRelationsUncheckedCreateWithoutMemoInput> | MemoTagRelationsCreateWithoutMemoInput[] | MemoTagRelationsUncheckedCreateWithoutMemoInput[]
    connectOrCreate?: MemoTagRelationsCreateOrConnectWithoutMemoInput | MemoTagRelationsCreateOrConnectWithoutMemoInput[]
    createMany?: MemoTagRelationsCreateManyMemoInputEnvelope
    connect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
  }

  export interface BlogCommentUncheckedCreateNestedManyWithoutMemo_infoInput {
    create?: XOR<BlogCommentCreateWithoutMemo_infoInput, BlogCommentUncheckedCreateWithoutMemo_infoInput> | BlogCommentCreateWithoutMemo_infoInput[] | BlogCommentUncheckedCreateWithoutMemo_infoInput[]
    connectOrCreate?: BlogCommentCreateOrConnectWithoutMemo_infoInput | BlogCommentCreateOrConnectWithoutMemo_infoInput[]
    createMany?: BlogCommentCreateManyMemo_infoInputEnvelope
    connect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
  }

  export interface BlogLikeUncheckedCreateNestedManyWithoutBlogMemoInfoInput {
    create?: XOR<BlogLikeCreateWithoutBlogMemoInfoInput, BlogLikeUncheckedCreateWithoutBlogMemoInfoInput> | BlogLikeCreateWithoutBlogMemoInfoInput[] | BlogLikeUncheckedCreateWithoutBlogMemoInfoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutBlogMemoInfoInput | BlogLikeCreateOrConnectWithoutBlogMemoInfoInput[]
    createMany?: BlogLikeCreateManyBlogMemoInfoInputEnvelope
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
  }

  export interface UserUpdateOneRequiredWithoutMemosNestedInput {
    create?: XOR<UserCreateWithoutMemosInput, UserUncheckedCreateWithoutMemosInput>
    connectOrCreate?: UserCreateOrConnectWithoutMemosInput
    upsert?: UserUpsertWithoutMemosInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMemosInput, UserUpdateWithoutMemosInput>, UserUncheckedUpdateWithoutMemosInput>
  }

  export interface MemoTagRelationsUpdateManyWithoutMemoNestedInput {
    create?: XOR<MemoTagRelationsCreateWithoutMemoInput, MemoTagRelationsUncheckedCreateWithoutMemoInput> | MemoTagRelationsCreateWithoutMemoInput[] | MemoTagRelationsUncheckedCreateWithoutMemoInput[]
    connectOrCreate?: MemoTagRelationsCreateOrConnectWithoutMemoInput | MemoTagRelationsCreateOrConnectWithoutMemoInput[]
    upsert?: MemoTagRelationsUpsertWithWhereUniqueWithoutMemoInput | MemoTagRelationsUpsertWithWhereUniqueWithoutMemoInput[]
    createMany?: MemoTagRelationsCreateManyMemoInputEnvelope
    set?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    disconnect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    delete?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    connect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    update?: MemoTagRelationsUpdateWithWhereUniqueWithoutMemoInput | MemoTagRelationsUpdateWithWhereUniqueWithoutMemoInput[]
    updateMany?: MemoTagRelationsUpdateManyWithWhereWithoutMemoInput | MemoTagRelationsUpdateManyWithWhereWithoutMemoInput[]
    deleteMany?: MemoTagRelationsScalarWhereInput | MemoTagRelationsScalarWhereInput[]
  }

  export interface BlogCommentUpdateManyWithoutMemo_infoNestedInput {
    create?: XOR<BlogCommentCreateWithoutMemo_infoInput, BlogCommentUncheckedCreateWithoutMemo_infoInput> | BlogCommentCreateWithoutMemo_infoInput[] | BlogCommentUncheckedCreateWithoutMemo_infoInput[]
    connectOrCreate?: BlogCommentCreateOrConnectWithoutMemo_infoInput | BlogCommentCreateOrConnectWithoutMemo_infoInput[]
    upsert?: BlogCommentUpsertWithWhereUniqueWithoutMemo_infoInput | BlogCommentUpsertWithWhereUniqueWithoutMemo_infoInput[]
    createMany?: BlogCommentCreateManyMemo_infoInputEnvelope
    set?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    disconnect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    delete?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    connect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    update?: BlogCommentUpdateWithWhereUniqueWithoutMemo_infoInput | BlogCommentUpdateWithWhereUniqueWithoutMemo_infoInput[]
    updateMany?: BlogCommentUpdateManyWithWhereWithoutMemo_infoInput | BlogCommentUpdateManyWithWhereWithoutMemo_infoInput[]
    deleteMany?: BlogCommentScalarWhereInput | BlogCommentScalarWhereInput[]
  }

  export interface BlogLikeUpdateManyWithoutBlogMemoInfoNestedInput {
    create?: XOR<BlogLikeCreateWithoutBlogMemoInfoInput, BlogLikeUncheckedCreateWithoutBlogMemoInfoInput> | BlogLikeCreateWithoutBlogMemoInfoInput[] | BlogLikeUncheckedCreateWithoutBlogMemoInfoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutBlogMemoInfoInput | BlogLikeCreateOrConnectWithoutBlogMemoInfoInput[]
    upsert?: BlogLikeUpsertWithWhereUniqueWithoutBlogMemoInfoInput | BlogLikeUpsertWithWhereUniqueWithoutBlogMemoInfoInput[]
    createMany?: BlogLikeCreateManyBlogMemoInfoInputEnvelope
    set?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    disconnect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    delete?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    update?: BlogLikeUpdateWithWhereUniqueWithoutBlogMemoInfoInput | BlogLikeUpdateWithWhereUniqueWithoutBlogMemoInfoInput[]
    updateMany?: BlogLikeUpdateManyWithWhereWithoutBlogMemoInfoInput | BlogLikeUpdateManyWithWhereWithoutBlogMemoInfoInput[]
    deleteMany?: BlogLikeScalarWhereInput | BlogLikeScalarWhereInput[]
  }

  export interface MemoTagRelationsUncheckedUpdateManyWithoutMemoNestedInput {
    create?: XOR<MemoTagRelationsCreateWithoutMemoInput, MemoTagRelationsUncheckedCreateWithoutMemoInput> | MemoTagRelationsCreateWithoutMemoInput[] | MemoTagRelationsUncheckedCreateWithoutMemoInput[]
    connectOrCreate?: MemoTagRelationsCreateOrConnectWithoutMemoInput | MemoTagRelationsCreateOrConnectWithoutMemoInput[]
    upsert?: MemoTagRelationsUpsertWithWhereUniqueWithoutMemoInput | MemoTagRelationsUpsertWithWhereUniqueWithoutMemoInput[]
    createMany?: MemoTagRelationsCreateManyMemoInputEnvelope
    set?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    disconnect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    delete?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    connect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    update?: MemoTagRelationsUpdateWithWhereUniqueWithoutMemoInput | MemoTagRelationsUpdateWithWhereUniqueWithoutMemoInput[]
    updateMany?: MemoTagRelationsUpdateManyWithWhereWithoutMemoInput | MemoTagRelationsUpdateManyWithWhereWithoutMemoInput[]
    deleteMany?: MemoTagRelationsScalarWhereInput | MemoTagRelationsScalarWhereInput[]
  }

  export interface BlogCommentUncheckedUpdateManyWithoutMemo_infoNestedInput {
    create?: XOR<BlogCommentCreateWithoutMemo_infoInput, BlogCommentUncheckedCreateWithoutMemo_infoInput> | BlogCommentCreateWithoutMemo_infoInput[] | BlogCommentUncheckedCreateWithoutMemo_infoInput[]
    connectOrCreate?: BlogCommentCreateOrConnectWithoutMemo_infoInput | BlogCommentCreateOrConnectWithoutMemo_infoInput[]
    upsert?: BlogCommentUpsertWithWhereUniqueWithoutMemo_infoInput | BlogCommentUpsertWithWhereUniqueWithoutMemo_infoInput[]
    createMany?: BlogCommentCreateManyMemo_infoInputEnvelope
    set?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    disconnect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    delete?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    connect?: BlogCommentWhereUniqueInput | BlogCommentWhereUniqueInput[]
    update?: BlogCommentUpdateWithWhereUniqueWithoutMemo_infoInput | BlogCommentUpdateWithWhereUniqueWithoutMemo_infoInput[]
    updateMany?: BlogCommentUpdateManyWithWhereWithoutMemo_infoInput | BlogCommentUpdateManyWithWhereWithoutMemo_infoInput[]
    deleteMany?: BlogCommentScalarWhereInput | BlogCommentScalarWhereInput[]
  }

  export interface BlogLikeUncheckedUpdateManyWithoutBlogMemoInfoNestedInput {
    create?: XOR<BlogLikeCreateWithoutBlogMemoInfoInput, BlogLikeUncheckedCreateWithoutBlogMemoInfoInput> | BlogLikeCreateWithoutBlogMemoInfoInput[] | BlogLikeUncheckedCreateWithoutBlogMemoInfoInput[]
    connectOrCreate?: BlogLikeCreateOrConnectWithoutBlogMemoInfoInput | BlogLikeCreateOrConnectWithoutBlogMemoInfoInput[]
    upsert?: BlogLikeUpsertWithWhereUniqueWithoutBlogMemoInfoInput | BlogLikeUpsertWithWhereUniqueWithoutBlogMemoInfoInput[]
    createMany?: BlogLikeCreateManyBlogMemoInfoInputEnvelope
    set?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    disconnect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    delete?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    connect?: BlogLikeWhereUniqueInput | BlogLikeWhereUniqueInput[]
    update?: BlogLikeUpdateWithWhereUniqueWithoutBlogMemoInfoInput | BlogLikeUpdateWithWhereUniqueWithoutBlogMemoInfoInput[]
    updateMany?: BlogLikeUpdateManyWithWhereWithoutBlogMemoInfoInput | BlogLikeUpdateManyWithWhereWithoutBlogMemoInfoInput[]
    deleteMany?: BlogLikeScalarWhereInput | BlogLikeScalarWhereInput[]
  }

  export interface UserCreateNestedOneWithoutTagsInput {
    create?: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTagsInput
    connect?: UserWhereUniqueInput
  }

  export interface MemoTagRelationsCreateNestedManyWithoutTagInput {
    create?: XOR<MemoTagRelationsCreateWithoutTagInput, MemoTagRelationsUncheckedCreateWithoutTagInput> | MemoTagRelationsCreateWithoutTagInput[] | MemoTagRelationsUncheckedCreateWithoutTagInput[]
    connectOrCreate?: MemoTagRelationsCreateOrConnectWithoutTagInput | MemoTagRelationsCreateOrConnectWithoutTagInput[]
    createMany?: MemoTagRelationsCreateManyTagInputEnvelope
    connect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
  }

  export interface MemoTagRelationsUncheckedCreateNestedManyWithoutTagInput {
    create?: XOR<MemoTagRelationsCreateWithoutTagInput, MemoTagRelationsUncheckedCreateWithoutTagInput> | MemoTagRelationsCreateWithoutTagInput[] | MemoTagRelationsUncheckedCreateWithoutTagInput[]
    connectOrCreate?: MemoTagRelationsCreateOrConnectWithoutTagInput | MemoTagRelationsCreateOrConnectWithoutTagInput[]
    createMany?: MemoTagRelationsCreateManyTagInputEnvelope
    connect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
  }

  export interface UserUpdateOneRequiredWithoutTagsNestedInput {
    create?: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTagsInput
    upsert?: UserUpsertWithoutTagsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTagsInput, UserUpdateWithoutTagsInput>, UserUncheckedUpdateWithoutTagsInput>
  }

  export interface MemoTagRelationsUpdateManyWithoutTagNestedInput {
    create?: XOR<MemoTagRelationsCreateWithoutTagInput, MemoTagRelationsUncheckedCreateWithoutTagInput> | MemoTagRelationsCreateWithoutTagInput[] | MemoTagRelationsUncheckedCreateWithoutTagInput[]
    connectOrCreate?: MemoTagRelationsCreateOrConnectWithoutTagInput | MemoTagRelationsCreateOrConnectWithoutTagInput[]
    upsert?: MemoTagRelationsUpsertWithWhereUniqueWithoutTagInput | MemoTagRelationsUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: MemoTagRelationsCreateManyTagInputEnvelope
    set?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    disconnect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    delete?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    connect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    update?: MemoTagRelationsUpdateWithWhereUniqueWithoutTagInput | MemoTagRelationsUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: MemoTagRelationsUpdateManyWithWhereWithoutTagInput | MemoTagRelationsUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: MemoTagRelationsScalarWhereInput | MemoTagRelationsScalarWhereInput[]
  }

  export interface MemoTagRelationsUncheckedUpdateManyWithoutTagNestedInput {
    create?: XOR<MemoTagRelationsCreateWithoutTagInput, MemoTagRelationsUncheckedCreateWithoutTagInput> | MemoTagRelationsCreateWithoutTagInput[] | MemoTagRelationsUncheckedCreateWithoutTagInput[]
    connectOrCreate?: MemoTagRelationsCreateOrConnectWithoutTagInput | MemoTagRelationsCreateOrConnectWithoutTagInput[]
    upsert?: MemoTagRelationsUpsertWithWhereUniqueWithoutTagInput | MemoTagRelationsUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: MemoTagRelationsCreateManyTagInputEnvelope
    set?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    disconnect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    delete?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    connect?: MemoTagRelationsWhereUniqueInput | MemoTagRelationsWhereUniqueInput[]
    update?: MemoTagRelationsUpdateWithWhereUniqueWithoutTagInput | MemoTagRelationsUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: MemoTagRelationsUpdateManyWithWhereWithoutTagInput | MemoTagRelationsUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: MemoTagRelationsScalarWhereInput | MemoTagRelationsScalarWhereInput[]
  }

  export interface MemoTagCreateNestedOneWithoutMemosInput {
    create?: XOR<MemoTagCreateWithoutMemosInput, MemoTagUncheckedCreateWithoutMemosInput>
    connectOrCreate?: MemoTagCreateOrConnectWithoutMemosInput
    connect?: MemoTagWhereUniqueInput
  }

  export interface BlogMemoCreateNestedOneWithoutTagsInput {
    create?: XOR<BlogMemoCreateWithoutTagsInput, BlogMemoUncheckedCreateWithoutTagsInput>
    connectOrCreate?: BlogMemoCreateOrConnectWithoutTagsInput
    connect?: BlogMemoWhereUniqueInput
  }

  export interface MemoTagUpdateOneRequiredWithoutMemosNestedInput {
    create?: XOR<MemoTagCreateWithoutMemosInput, MemoTagUncheckedCreateWithoutMemosInput>
    connectOrCreate?: MemoTagCreateOrConnectWithoutMemosInput
    upsert?: MemoTagUpsertWithoutMemosInput
    connect?: MemoTagWhereUniqueInput
    update?: XOR<XOR<MemoTagUpdateToOneWithWhereWithoutMemosInput, MemoTagUpdateWithoutMemosInput>, MemoTagUncheckedUpdateWithoutMemosInput>
  }

  export interface BlogMemoUpdateOneRequiredWithoutTagsNestedInput {
    create?: XOR<BlogMemoCreateWithoutTagsInput, BlogMemoUncheckedCreateWithoutTagsInput>
    connectOrCreate?: BlogMemoCreateOrConnectWithoutTagsInput
    upsert?: BlogMemoUpsertWithoutTagsInput
    connect?: BlogMemoWhereUniqueInput
    update?: XOR<XOR<BlogMemoUpdateToOneWithWhereWithoutTagsInput, BlogMemoUpdateWithoutTagsInput>, BlogMemoUncheckedUpdateWithoutTagsInput>
  }

  export interface NullableDecimalFieldUpdateOperationsInput {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export interface DecimalFieldUpdateOperationsInput {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export interface NullableBoolFieldUpdateOperationsInput {
    set?: boolean | null
  }

  export interface NestedStringFilter<$PrismaModel = never> {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export interface NestedStringNullableFilter<$PrismaModel = never> {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export interface NestedIntFilter<$PrismaModel = never> {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export interface NestedStringWithAggregatesFilter<$PrismaModel = never> {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export interface NestedStringNullableWithAggregatesFilter<$PrismaModel = never> {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export interface NestedIntNullableFilter<$PrismaModel = never> {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export interface NestedIntWithAggregatesFilter<$PrismaModel = never> {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export interface NestedFloatFilter<$PrismaModel = never> {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export interface NestedDateTimeFilter<$PrismaModel = never> {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export interface NestedIntNullableWithAggregatesFilter<$PrismaModel = never> {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export interface NestedFloatNullableFilter<$PrismaModel = never> {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export interface NestedDateTimeWithAggregatesFilter<$PrismaModel = never> {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export interface NestedBoolFilter<$PrismaModel = never> {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export interface NestedBoolWithAggregatesFilter<$PrismaModel = never> {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export interface NestedDecimalNullableFilter<$PrismaModel = never> {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export interface NestedDecimalFilter<$PrismaModel = never> {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export interface NestedBoolNullableFilter<$PrismaModel = never> {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export interface NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export interface NestedDecimalWithAggregatesFilter<$PrismaModel = never> {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export interface NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export interface BlogCommentCreateWithoutUser_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    visitorName?: string | null
    sub_comments?: BlogSubCommentCreateNestedManyWithoutComment_infoInput
    likes?: BlogLikeCreateNestedManyWithoutComment_infoInput
    memo_info?: BlogMemoCreateNestedOneWithoutCommentsInput
  }

  export interface BlogCommentUncheckedCreateWithoutUser_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    visitorName?: string | null
    memo_id?: string | null
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutComment_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutComment_infoInput
  }

  export interface BlogCommentCreateOrConnectWithoutUser_infoInput {
    where: BlogCommentWhereUniqueInput
    create: XOR<BlogCommentCreateWithoutUser_infoInput, BlogCommentUncheckedCreateWithoutUser_infoInput>
  }

  export interface BlogCommentCreateManyUser_infoInputEnvelope {
    data: BlogCommentCreateManyUser_infoInput | BlogCommentCreateManyUser_infoInput[]
    skipDuplicates?: boolean
  }

  export interface BlogSubCommentCreateWithoutUser_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    reply_sub_comment_id?: string | null
    comment_info: BlogCommentCreateNestedOneWithoutSub_commentsInput
    likes?: BlogLikeCreateNestedManyWithoutSub_comment_infoInput
  }

  export interface BlogSubCommentUncheckedCreateWithoutUser_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    comment_id: string
    reply_sub_comment_id?: string | null
    likes?: BlogLikeUncheckedCreateNestedManyWithoutSub_comment_infoInput
  }

  export interface BlogSubCommentCreateOrConnectWithoutUser_infoInput {
    where: BlogSubCommentWhereUniqueInput
    create: XOR<BlogSubCommentCreateWithoutUser_infoInput, BlogSubCommentUncheckedCreateWithoutUser_infoInput>
  }

  export interface BlogSubCommentCreateManyUser_infoInputEnvelope {
    data: BlogSubCommentCreateManyUser_infoInput | BlogSubCommentCreateManyUser_infoInput[]
    skipDuplicates?: boolean
  }

  export interface BlogLikeCreateWithoutUser_infoInput {
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_info?: BlogSubCommentCreateNestedOneWithoutLikesInput
    comment_info?: BlogCommentCreateNestedOneWithoutLikesInput
    blogMemoInfo?: BlogMemoCreateNestedOneWithoutLikesInput
  }

  export interface BlogLikeUncheckedCreateWithoutUser_infoInput {
    id?: number
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_id?: string | null
    comment_id?: string | null
    blogMemoId?: string | null
  }

  export interface BlogLikeCreateOrConnectWithoutUser_infoInput {
    where: BlogLikeWhereUniqueInput
    create: XOR<BlogLikeCreateWithoutUser_infoInput, BlogLikeUncheckedCreateWithoutUser_infoInput>
  }

  export interface BlogLikeCreateManyUser_infoInputEnvelope {
    data: BlogLikeCreateManyUser_infoInput | BlogLikeCreateManyUser_infoInput[]
    skipDuplicates?: boolean
  }

  export interface OAuthCreateWithoutUserInput {
    id?: string
    provider: string
    providerId: string
    providerUnionId?: string | null
    providerToken?: string | null
    providerRefreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface OAuthUncheckedCreateWithoutUserInput {
    id?: string
    provider: string
    providerId: string
    providerUnionId?: string | null
    providerToken?: string | null
    providerRefreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface OAuthCreateOrConnectWithoutUserInput {
    where: OAuthWhereUniqueInput
    create: XOR<OAuthCreateWithoutUserInput, OAuthUncheckedCreateWithoutUserInput>
  }

  export interface OAuthCreateManyUserInputEnvelope {
    data: OAuthCreateManyUserInput | OAuthCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export interface AccessTokenCreateWithoutUserInfoInput {
    id?: string
    token: string
    roles?: string
    status?: number
    scope?: string
    isRevoked?: boolean
    ip?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface AccessTokenUncheckedCreateWithoutUserInfoInput {
    id?: string
    token: string
    roles?: string
    status?: number
    scope?: string
    isRevoked?: boolean
    ip?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface AccessTokenCreateOrConnectWithoutUserInfoInput {
    where: AccessTokenWhereUniqueInput
    create: XOR<AccessTokenCreateWithoutUserInfoInput, AccessTokenUncheckedCreateWithoutUserInfoInput>
  }

  export interface AccessTokenCreateManyUserInfoInputEnvelope {
    data: AccessTokenCreateManyUserInfoInput | AccessTokenCreateManyUserInfoInput[]
    skipDuplicates?: boolean
  }

  export interface UserConfigCreateWithoutUserInfoInput {
    id?: string
    allowEmailNotify?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface UserConfigUncheckedCreateWithoutUserInfoInput {
    id?: string
    allowEmailNotify?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface UserConfigCreateOrConnectWithoutUserInfoInput {
    where: UserConfigWhereUniqueInput
    create: XOR<UserConfigCreateWithoutUserInfoInput, UserConfigUncheckedCreateWithoutUserInfoInput>
  }

  export interface BlogMemoCreateWithoutUser_infoInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    from?: string | null
    courier?: string | null
    tags?: MemoTagRelationsCreateNestedManyWithoutMemoInput
    comments?: BlogCommentCreateNestedManyWithoutMemo_infoInput
    likes?: BlogLikeCreateNestedManyWithoutBlogMemoInfoInput
  }

  export interface BlogMemoUncheckedCreateWithoutUser_infoInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    from?: string | null
    courier?: string | null
    tags?: MemoTagRelationsUncheckedCreateNestedManyWithoutMemoInput
    comments?: BlogCommentUncheckedCreateNestedManyWithoutMemo_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutBlogMemoInfoInput
  }

  export interface BlogMemoCreateOrConnectWithoutUser_infoInput {
    where: BlogMemoWhereUniqueInput
    create: XOR<BlogMemoCreateWithoutUser_infoInput, BlogMemoUncheckedCreateWithoutUser_infoInput>
  }

  export interface BlogMemoCreateManyUser_infoInputEnvelope {
    data: BlogMemoCreateManyUser_infoInput | BlogMemoCreateManyUser_infoInput[]
    skipDuplicates?: boolean
  }

  export interface MemoTagCreateWithoutUser_infoInput {
    id?: string
    tag_name: string
    create_ts?: Date | string
    updated_ts?: Date | string
    memos?: MemoTagRelationsCreateNestedManyWithoutTagInput
  }

  export interface MemoTagUncheckedCreateWithoutUser_infoInput {
    id?: string
    tag_name: string
    create_ts?: Date | string
    updated_ts?: Date | string
    memos?: MemoTagRelationsUncheckedCreateNestedManyWithoutTagInput
  }

  export interface MemoTagCreateOrConnectWithoutUser_infoInput {
    where: MemoTagWhereUniqueInput
    create: XOR<MemoTagCreateWithoutUser_infoInput, MemoTagUncheckedCreateWithoutUser_infoInput>
  }

  export interface MemoTagCreateManyUser_infoInputEnvelope {
    data: MemoTagCreateManyUser_infoInput | MemoTagCreateManyUser_infoInput[]
    skipDuplicates?: boolean
  }

  export interface BlogCommentUpsertWithWhereUniqueWithoutUser_infoInput {
    where: BlogCommentWhereUniqueInput
    update: XOR<BlogCommentUpdateWithoutUser_infoInput, BlogCommentUncheckedUpdateWithoutUser_infoInput>
    create: XOR<BlogCommentCreateWithoutUser_infoInput, BlogCommentUncheckedCreateWithoutUser_infoInput>
  }

  export interface BlogCommentUpdateWithWhereUniqueWithoutUser_infoInput {
    where: BlogCommentWhereUniqueInput
    data: XOR<BlogCommentUpdateWithoutUser_infoInput, BlogCommentUncheckedUpdateWithoutUser_infoInput>
  }

  export interface BlogCommentUpdateManyWithWhereWithoutUser_infoInput {
    where: BlogCommentScalarWhereInput
    data: XOR<BlogCommentUpdateManyMutationInput, BlogCommentUncheckedUpdateManyWithoutUser_infoInput>
  }

  export interface BlogCommentScalarWhereInput {
    AND?: BlogCommentScalarWhereInput | BlogCommentScalarWhereInput[]
    OR?: BlogCommentScalarWhereInput[]
    NOT?: BlogCommentScalarWhereInput | BlogCommentScalarWhereInput[]
    id?: StringFilter<'BlogComment'> | string
    content?: StringFilter<'BlogComment'> | string
    create_ts?: DateTimeFilter<'BlogComment'> | Date | string
    updated_ts?: DateTimeFilter<'BlogComment'> | Date | string
    type?: StringFilter<'BlogComment'> | string
    quoteContent?: StringNullableFilter<'BlogComment'> | string | null
    article_id?: StringNullableFilter<'BlogComment'> | string | null
    user_id?: StringNullableFilter<'BlogComment'> | string | null
    visitorName?: StringNullableFilter<'BlogComment'> | string | null
    memo_id?: StringNullableFilter<'BlogComment'> | string | null
  }

  export interface BlogSubCommentUpsertWithWhereUniqueWithoutUser_infoInput {
    where: BlogSubCommentWhereUniqueInput
    update: XOR<BlogSubCommentUpdateWithoutUser_infoInput, BlogSubCommentUncheckedUpdateWithoutUser_infoInput>
    create: XOR<BlogSubCommentCreateWithoutUser_infoInput, BlogSubCommentUncheckedCreateWithoutUser_infoInput>
  }

  export interface BlogSubCommentUpdateWithWhereUniqueWithoutUser_infoInput {
    where: BlogSubCommentWhereUniqueInput
    data: XOR<BlogSubCommentUpdateWithoutUser_infoInput, BlogSubCommentUncheckedUpdateWithoutUser_infoInput>
  }

  export interface BlogSubCommentUpdateManyWithWhereWithoutUser_infoInput {
    where: BlogSubCommentScalarWhereInput
    data: XOR<BlogSubCommentUpdateManyMutationInput, BlogSubCommentUncheckedUpdateManyWithoutUser_infoInput>
  }

  export interface BlogSubCommentScalarWhereInput {
    AND?: BlogSubCommentScalarWhereInput | BlogSubCommentScalarWhereInput[]
    OR?: BlogSubCommentScalarWhereInput[]
    NOT?: BlogSubCommentScalarWhereInput | BlogSubCommentScalarWhereInput[]
    id?: StringFilter<'BlogSubComment'> | string
    content?: StringFilter<'BlogSubComment'> | string
    create_ts?: DateTimeFilter<'BlogSubComment'> | Date | string
    updated_ts?: DateTimeFilter<'BlogSubComment'> | Date | string
    comment_id?: StringFilter<'BlogSubComment'> | string
    reply_sub_comment_id?: StringNullableFilter<'BlogSubComment'> | string | null
    user_id?: StringNullableFilter<'BlogSubComment'> | string | null
  }

  export interface BlogLikeUpsertWithWhereUniqueWithoutUser_infoInput {
    where: BlogLikeWhereUniqueInput
    update: XOR<BlogLikeUpdateWithoutUser_infoInput, BlogLikeUncheckedUpdateWithoutUser_infoInput>
    create: XOR<BlogLikeCreateWithoutUser_infoInput, BlogLikeUncheckedCreateWithoutUser_infoInput>
  }

  export interface BlogLikeUpdateWithWhereUniqueWithoutUser_infoInput {
    where: BlogLikeWhereUniqueInput
    data: XOR<BlogLikeUpdateWithoutUser_infoInput, BlogLikeUncheckedUpdateWithoutUser_infoInput>
  }

  export interface BlogLikeUpdateManyWithWhereWithoutUser_infoInput {
    where: BlogLikeScalarWhereInput
    data: XOR<BlogLikeUpdateManyMutationInput, BlogLikeUncheckedUpdateManyWithoutUser_infoInput>
  }

  export interface BlogLikeScalarWhereInput {
    AND?: BlogLikeScalarWhereInput | BlogLikeScalarWhereInput[]
    OR?: BlogLikeScalarWhereInput[]
    NOT?: BlogLikeScalarWhereInput | BlogLikeScalarWhereInput[]
    id?: IntFilter<'BlogLike'> | number
    create_ts?: DateTimeFilter<'BlogLike'> | Date | string
    updated_ts?: DateTimeFilter<'BlogLike'> | Date | string
    target?: StringFilter<'BlogLike'> | string
    article_id?: StringNullableFilter<'BlogLike'> | string | null
    sub_comment_id?: StringNullableFilter<'BlogLike'> | string | null
    comment_id?: StringNullableFilter<'BlogLike'> | string | null
    user_id?: StringFilter<'BlogLike'> | string
    blogMemoId?: StringNullableFilter<'BlogLike'> | string | null
  }

  export interface OAuthUpsertWithWhereUniqueWithoutUserInput {
    where: OAuthWhereUniqueInput
    update: XOR<OAuthUpdateWithoutUserInput, OAuthUncheckedUpdateWithoutUserInput>
    create: XOR<OAuthCreateWithoutUserInput, OAuthUncheckedCreateWithoutUserInput>
  }

  export interface OAuthUpdateWithWhereUniqueWithoutUserInput {
    where: OAuthWhereUniqueInput
    data: XOR<OAuthUpdateWithoutUserInput, OAuthUncheckedUpdateWithoutUserInput>
  }

  export interface OAuthUpdateManyWithWhereWithoutUserInput {
    where: OAuthScalarWhereInput
    data: XOR<OAuthUpdateManyMutationInput, OAuthUncheckedUpdateManyWithoutUserInput>
  }

  export interface OAuthScalarWhereInput {
    AND?: OAuthScalarWhereInput | OAuthScalarWhereInput[]
    OR?: OAuthScalarWhereInput[]
    NOT?: OAuthScalarWhereInput | OAuthScalarWhereInput[]
    id?: StringFilter<'OAuth'> | string
    userId?: StringNullableFilter<'OAuth'> | string | null
    provider?: StringFilter<'OAuth'> | string
    providerId?: StringFilter<'OAuth'> | string
    providerUnionId?: StringNullableFilter<'OAuth'> | string | null
    providerToken?: StringNullableFilter<'OAuth'> | string | null
    providerRefreshToken?: StringNullableFilter<'OAuth'> | string | null
    createdAt?: DateTimeFilter<'OAuth'> | Date | string
    updatedAt?: DateTimeFilter<'OAuth'> | Date | string
  }

  export interface AccessTokenUpsertWithWhereUniqueWithoutUserInfoInput {
    where: AccessTokenWhereUniqueInput
    update: XOR<AccessTokenUpdateWithoutUserInfoInput, AccessTokenUncheckedUpdateWithoutUserInfoInput>
    create: XOR<AccessTokenCreateWithoutUserInfoInput, AccessTokenUncheckedCreateWithoutUserInfoInput>
  }

  export interface AccessTokenUpdateWithWhereUniqueWithoutUserInfoInput {
    where: AccessTokenWhereUniqueInput
    data: XOR<AccessTokenUpdateWithoutUserInfoInput, AccessTokenUncheckedUpdateWithoutUserInfoInput>
  }

  export interface AccessTokenUpdateManyWithWhereWithoutUserInfoInput {
    where: AccessTokenScalarWhereInput
    data: XOR<AccessTokenUpdateManyMutationInput, AccessTokenUncheckedUpdateManyWithoutUserInfoInput>
  }

  export interface AccessTokenScalarWhereInput {
    AND?: AccessTokenScalarWhereInput | AccessTokenScalarWhereInput[]
    OR?: AccessTokenScalarWhereInput[]
    NOT?: AccessTokenScalarWhereInput | AccessTokenScalarWhereInput[]
    id?: StringFilter<'AccessToken'> | string
    userId?: StringFilter<'AccessToken'> | string
    token?: StringFilter<'AccessToken'> | string
    roles?: StringFilter<'AccessToken'> | string
    status?: IntFilter<'AccessToken'> | number
    scope?: StringFilter<'AccessToken'> | string
    isRevoked?: BoolFilter<'AccessToken'> | boolean
    ip?: StringNullableFilter<'AccessToken'> | string | null
    expiresAt?: DateTimeFilter<'AccessToken'> | Date | string
    createdAt?: DateTimeFilter<'AccessToken'> | Date | string
    updatedAt?: DateTimeFilter<'AccessToken'> | Date | string
  }

  export interface UserConfigUpsertWithoutUserInfoInput {
    update: XOR<UserConfigUpdateWithoutUserInfoInput, UserConfigUncheckedUpdateWithoutUserInfoInput>
    create: XOR<UserConfigCreateWithoutUserInfoInput, UserConfigUncheckedCreateWithoutUserInfoInput>
    where?: UserConfigWhereInput
  }

  export interface UserConfigUpdateToOneWithWhereWithoutUserInfoInput {
    where?: UserConfigWhereInput
    data: XOR<UserConfigUpdateWithoutUserInfoInput, UserConfigUncheckedUpdateWithoutUserInfoInput>
  }

  export interface UserConfigUpdateWithoutUserInfoInput {
    id?: StringFieldUpdateOperationsInput | string
    allowEmailNotify?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface UserConfigUncheckedUpdateWithoutUserInfoInput {
    id?: StringFieldUpdateOperationsInput | string
    allowEmailNotify?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface BlogMemoUpsertWithWhereUniqueWithoutUser_infoInput {
    where: BlogMemoWhereUniqueInput
    update: XOR<BlogMemoUpdateWithoutUser_infoInput, BlogMemoUncheckedUpdateWithoutUser_infoInput>
    create: XOR<BlogMemoCreateWithoutUser_infoInput, BlogMemoUncheckedCreateWithoutUser_infoInput>
  }

  export interface BlogMemoUpdateWithWhereUniqueWithoutUser_infoInput {
    where: BlogMemoWhereUniqueInput
    data: XOR<BlogMemoUpdateWithoutUser_infoInput, BlogMemoUncheckedUpdateWithoutUser_infoInput>
  }

  export interface BlogMemoUpdateManyWithWhereWithoutUser_infoInput {
    where: BlogMemoScalarWhereInput
    data: XOR<BlogMemoUpdateManyMutationInput, BlogMemoUncheckedUpdateManyWithoutUser_infoInput>
  }

  export interface BlogMemoScalarWhereInput {
    AND?: BlogMemoScalarWhereInput | BlogMemoScalarWhereInput[]
    OR?: BlogMemoScalarWhereInput[]
    NOT?: BlogMemoScalarWhereInput | BlogMemoScalarWhereInput[]
    id?: StringFilter<'BlogMemo'> | string
    content?: StringNullableFilter<'BlogMemo'> | string | null
    create_ts?: DateTimeFilter<'BlogMemo'> | Date | string
    updated_ts?: DateTimeFilter<'BlogMemo'> | Date | string
    visible?: StringFilter<'BlogMemo'> | string
    defalt_floded?: BoolFilter<'BlogMemo'> | boolean
    flod_tip?: StringNullableFilter<'BlogMemo'> | string | null
    user_id?: StringFilter<'BlogMemo'> | string
    from?: StringNullableFilter<'BlogMemo'> | string | null
    courier?: StringNullableFilter<'BlogMemo'> | string | null
  }

  export interface MemoTagUpsertWithWhereUniqueWithoutUser_infoInput {
    where: MemoTagWhereUniqueInput
    update: XOR<MemoTagUpdateWithoutUser_infoInput, MemoTagUncheckedUpdateWithoutUser_infoInput>
    create: XOR<MemoTagCreateWithoutUser_infoInput, MemoTagUncheckedCreateWithoutUser_infoInput>
  }

  export interface MemoTagUpdateWithWhereUniqueWithoutUser_infoInput {
    where: MemoTagWhereUniqueInput
    data: XOR<MemoTagUpdateWithoutUser_infoInput, MemoTagUncheckedUpdateWithoutUser_infoInput>
  }

  export interface MemoTagUpdateManyWithWhereWithoutUser_infoInput {
    where: MemoTagScalarWhereInput
    data: XOR<MemoTagUpdateManyMutationInput, MemoTagUncheckedUpdateManyWithoutUser_infoInput>
  }

  export interface MemoTagScalarWhereInput {
    AND?: MemoTagScalarWhereInput | MemoTagScalarWhereInput[]
    OR?: MemoTagScalarWhereInput[]
    NOT?: MemoTagScalarWhereInput | MemoTagScalarWhereInput[]
    id?: StringFilter<'MemoTag'> | string
    tag_name?: StringFilter<'MemoTag'> | string
    create_ts?: DateTimeFilter<'MemoTag'> | Date | string
    updated_ts?: DateTimeFilter<'MemoTag'> | Date | string
    user_id?: StringFilter<'MemoTag'> | string
  }

  export interface UserCreateWithoutUser_configInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthCreateNestedManyWithoutUserInput
    tokens?: AccessTokenCreateNestedManyWithoutUserInfoInput
    memos?: BlogMemoCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagCreateNestedManyWithoutUser_infoInput
  }

  export interface UserUncheckedCreateWithoutUser_configInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentUncheckedCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthUncheckedCreateNestedManyWithoutUserInput
    tokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInfoInput
    memos?: BlogMemoUncheckedCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagUncheckedCreateNestedManyWithoutUser_infoInput
  }

  export interface UserCreateOrConnectWithoutUser_configInput {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUser_configInput, UserUncheckedCreateWithoutUser_configInput>
  }

  export interface UserUpsertWithoutUser_configInput {
    update: XOR<UserUpdateWithoutUser_configInput, UserUncheckedUpdateWithoutUser_configInput>
    create: XOR<UserCreateWithoutUser_configInput, UserUncheckedCreateWithoutUser_configInput>
    where?: UserWhereInput
  }

  export interface UserUpdateToOneWithWhereWithoutUser_configInput {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUser_configInput, UserUncheckedUpdateWithoutUser_configInput>
  }

  export interface UserUpdateWithoutUser_configInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUpdateManyWithoutUserInfoNestedInput
    memos?: BlogMemoUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserUncheckedUpdateWithoutUser_configInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUncheckedUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUncheckedUpdateManyWithoutUserInfoNestedInput
    memos?: BlogMemoUncheckedUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUncheckedUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserCreateWithoutTokensInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthCreateNestedManyWithoutUserInput
    user_config?: UserConfigCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagCreateNestedManyWithoutUser_infoInput
  }

  export interface UserUncheckedCreateWithoutTokensInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentUncheckedCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthUncheckedCreateNestedManyWithoutUserInput
    user_config?: UserConfigUncheckedCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoUncheckedCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagUncheckedCreateNestedManyWithoutUser_infoInput
  }

  export interface UserCreateOrConnectWithoutTokensInput {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
  }

  export interface UserUpsertWithoutTokensInput {
    update: XOR<UserUpdateWithoutTokensInput, UserUncheckedUpdateWithoutTokensInput>
    create: XOR<UserCreateWithoutTokensInput, UserUncheckedCreateWithoutTokensInput>
    where?: UserWhereInput
  }

  export interface UserUpdateToOneWithWhereWithoutTokensInput {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTokensInput, UserUncheckedUpdateWithoutTokensInput>
  }

  export interface UserUpdateWithoutTokensInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUpdateManyWithoutUserNestedInput
    user_config?: UserConfigUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserUncheckedUpdateWithoutTokensInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUncheckedUpdateManyWithoutUserNestedInput
    user_config?: UserConfigUncheckedUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUncheckedUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUncheckedUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserCreateWithoutOauthInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeCreateNestedManyWithoutUser_infoInput
    tokens?: AccessTokenCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagCreateNestedManyWithoutUser_infoInput
  }

  export interface UserUncheckedCreateWithoutOauthInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentUncheckedCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutUser_infoInput
    tokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigUncheckedCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoUncheckedCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagUncheckedCreateNestedManyWithoutUser_infoInput
  }

  export interface UserCreateOrConnectWithoutOauthInput {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOauthInput, UserUncheckedCreateWithoutOauthInput>
  }

  export interface UserUpsertWithoutOauthInput {
    update: XOR<UserUpdateWithoutOauthInput, UserUncheckedUpdateWithoutOauthInput>
    create: XOR<UserCreateWithoutOauthInput, UserUncheckedCreateWithoutOauthInput>
    where?: UserWhereInput
  }

  export interface UserUpdateToOneWithWhereWithoutOauthInput {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOauthInput, UserUncheckedUpdateWithoutOauthInput>
  }

  export interface UserUpdateWithoutOauthInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutUser_infoNestedInput
    tokens?: AccessTokenUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserUncheckedUpdateWithoutOauthInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutUser_infoNestedInput
    tokens?: AccessTokenUncheckedUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUncheckedUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUncheckedUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUncheckedUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserCreateWithoutCommentsInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    sub_comments?: BlogSubCommentCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthCreateNestedManyWithoutUserInput
    tokens?: AccessTokenCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagCreateNestedManyWithoutUser_infoInput
  }

  export interface UserUncheckedCreateWithoutCommentsInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthUncheckedCreateNestedManyWithoutUserInput
    tokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigUncheckedCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoUncheckedCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagUncheckedCreateNestedManyWithoutUser_infoInput
  }

  export interface UserCreateOrConnectWithoutCommentsInput {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
  }

  export interface BlogSubCommentCreateWithoutComment_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    reply_sub_comment_id?: string | null
    user_info?: UserCreateNestedOneWithoutSub_commentsInput
    likes?: BlogLikeCreateNestedManyWithoutSub_comment_infoInput
  }

  export interface BlogSubCommentUncheckedCreateWithoutComment_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    reply_sub_comment_id?: string | null
    user_id?: string | null
    likes?: BlogLikeUncheckedCreateNestedManyWithoutSub_comment_infoInput
  }

  export interface BlogSubCommentCreateOrConnectWithoutComment_infoInput {
    where: BlogSubCommentWhereUniqueInput
    create: XOR<BlogSubCommentCreateWithoutComment_infoInput, BlogSubCommentUncheckedCreateWithoutComment_infoInput>
  }

  export interface BlogSubCommentCreateManyComment_infoInputEnvelope {
    data: BlogSubCommentCreateManyComment_infoInput | BlogSubCommentCreateManyComment_infoInput[]
    skipDuplicates?: boolean
  }

  export interface BlogLikeCreateWithoutComment_infoInput {
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_info?: BlogSubCommentCreateNestedOneWithoutLikesInput
    user_info: UserCreateNestedOneWithoutLikesInput
    blogMemoInfo?: BlogMemoCreateNestedOneWithoutLikesInput
  }

  export interface BlogLikeUncheckedCreateWithoutComment_infoInput {
    id?: number
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_id?: string | null
    user_id: string
    blogMemoId?: string | null
  }

  export interface BlogLikeCreateOrConnectWithoutComment_infoInput {
    where: BlogLikeWhereUniqueInput
    create: XOR<BlogLikeCreateWithoutComment_infoInput, BlogLikeUncheckedCreateWithoutComment_infoInput>
  }

  export interface BlogLikeCreateManyComment_infoInputEnvelope {
    data: BlogLikeCreateManyComment_infoInput | BlogLikeCreateManyComment_infoInput[]
    skipDuplicates?: boolean
  }

  export interface BlogMemoCreateWithoutCommentsInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    from?: string | null
    courier?: string | null
    user_info: UserCreateNestedOneWithoutMemosInput
    tags?: MemoTagRelationsCreateNestedManyWithoutMemoInput
    likes?: BlogLikeCreateNestedManyWithoutBlogMemoInfoInput
  }

  export interface BlogMemoUncheckedCreateWithoutCommentsInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    user_id: string
    from?: string | null
    courier?: string | null
    tags?: MemoTagRelationsUncheckedCreateNestedManyWithoutMemoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutBlogMemoInfoInput
  }

  export interface BlogMemoCreateOrConnectWithoutCommentsInput {
    where: BlogMemoWhereUniqueInput
    create: XOR<BlogMemoCreateWithoutCommentsInput, BlogMemoUncheckedCreateWithoutCommentsInput>
  }

  export interface UserUpsertWithoutCommentsInput {
    update: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    where?: UserWhereInput
  }

  export interface UserUpdateToOneWithWhereWithoutCommentsInput {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
  }

  export interface UserUpdateWithoutCommentsInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    sub_comments?: BlogSubCommentUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserUncheckedUpdateWithoutCommentsInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUncheckedUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUncheckedUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUncheckedUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUncheckedUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUncheckedUpdateManyWithoutUser_infoNestedInput
  }

  export interface BlogSubCommentUpsertWithWhereUniqueWithoutComment_infoInput {
    where: BlogSubCommentWhereUniqueInput
    update: XOR<BlogSubCommentUpdateWithoutComment_infoInput, BlogSubCommentUncheckedUpdateWithoutComment_infoInput>
    create: XOR<BlogSubCommentCreateWithoutComment_infoInput, BlogSubCommentUncheckedCreateWithoutComment_infoInput>
  }

  export interface BlogSubCommentUpdateWithWhereUniqueWithoutComment_infoInput {
    where: BlogSubCommentWhereUniqueInput
    data: XOR<BlogSubCommentUpdateWithoutComment_infoInput, BlogSubCommentUncheckedUpdateWithoutComment_infoInput>
  }

  export interface BlogSubCommentUpdateManyWithWhereWithoutComment_infoInput {
    where: BlogSubCommentScalarWhereInput
    data: XOR<BlogSubCommentUpdateManyMutationInput, BlogSubCommentUncheckedUpdateManyWithoutComment_infoInput>
  }

  export interface BlogLikeUpsertWithWhereUniqueWithoutComment_infoInput {
    where: BlogLikeWhereUniqueInput
    update: XOR<BlogLikeUpdateWithoutComment_infoInput, BlogLikeUncheckedUpdateWithoutComment_infoInput>
    create: XOR<BlogLikeCreateWithoutComment_infoInput, BlogLikeUncheckedCreateWithoutComment_infoInput>
  }

  export interface BlogLikeUpdateWithWhereUniqueWithoutComment_infoInput {
    where: BlogLikeWhereUniqueInput
    data: XOR<BlogLikeUpdateWithoutComment_infoInput, BlogLikeUncheckedUpdateWithoutComment_infoInput>
  }

  export interface BlogLikeUpdateManyWithWhereWithoutComment_infoInput {
    where: BlogLikeScalarWhereInput
    data: XOR<BlogLikeUpdateManyMutationInput, BlogLikeUncheckedUpdateManyWithoutComment_infoInput>
  }

  export interface BlogMemoUpsertWithoutCommentsInput {
    update: XOR<BlogMemoUpdateWithoutCommentsInput, BlogMemoUncheckedUpdateWithoutCommentsInput>
    create: XOR<BlogMemoCreateWithoutCommentsInput, BlogMemoUncheckedCreateWithoutCommentsInput>
    where?: BlogMemoWhereInput
  }

  export interface BlogMemoUpdateToOneWithWhereWithoutCommentsInput {
    where?: BlogMemoWhereInput
    data: XOR<BlogMemoUpdateWithoutCommentsInput, BlogMemoUncheckedUpdateWithoutCommentsInput>
  }

  export interface BlogMemoUpdateWithoutCommentsInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
    user_info?: UserUpdateOneRequiredWithoutMemosNestedInput
    tags?: MemoTagRelationsUpdateManyWithoutMemoNestedInput
    likes?: BlogLikeUpdateManyWithoutBlogMemoInfoNestedInput
  }

  export interface BlogMemoUncheckedUpdateWithoutCommentsInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MemoTagRelationsUncheckedUpdateManyWithoutMemoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutBlogMemoInfoNestedInput
  }

  export interface BlogCommentCreateWithoutSub_commentsInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    visitorName?: string | null
    user_info?: UserCreateNestedOneWithoutCommentsInput
    likes?: BlogLikeCreateNestedManyWithoutComment_infoInput
    memo_info?: BlogMemoCreateNestedOneWithoutCommentsInput
  }

  export interface BlogCommentUncheckedCreateWithoutSub_commentsInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    user_id?: string | null
    visitorName?: string | null
    memo_id?: string | null
    likes?: BlogLikeUncheckedCreateNestedManyWithoutComment_infoInput
  }

  export interface BlogCommentCreateOrConnectWithoutSub_commentsInput {
    where: BlogCommentWhereUniqueInput
    create: XOR<BlogCommentCreateWithoutSub_commentsInput, BlogCommentUncheckedCreateWithoutSub_commentsInput>
  }

  export interface UserCreateWithoutSub_commentsInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthCreateNestedManyWithoutUserInput
    tokens?: AccessTokenCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagCreateNestedManyWithoutUser_infoInput
  }

  export interface UserUncheckedCreateWithoutSub_commentsInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentUncheckedCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthUncheckedCreateNestedManyWithoutUserInput
    tokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigUncheckedCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoUncheckedCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagUncheckedCreateNestedManyWithoutUser_infoInput
  }

  export interface UserCreateOrConnectWithoutSub_commentsInput {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSub_commentsInput, UserUncheckedCreateWithoutSub_commentsInput>
  }

  export interface BlogLikeCreateWithoutSub_comment_infoInput {
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    comment_info?: BlogCommentCreateNestedOneWithoutLikesInput
    user_info: UserCreateNestedOneWithoutLikesInput
    blogMemoInfo?: BlogMemoCreateNestedOneWithoutLikesInput
  }

  export interface BlogLikeUncheckedCreateWithoutSub_comment_infoInput {
    id?: number
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    comment_id?: string | null
    user_id: string
    blogMemoId?: string | null
  }

  export interface BlogLikeCreateOrConnectWithoutSub_comment_infoInput {
    where: BlogLikeWhereUniqueInput
    create: XOR<BlogLikeCreateWithoutSub_comment_infoInput, BlogLikeUncheckedCreateWithoutSub_comment_infoInput>
  }

  export interface BlogLikeCreateManySub_comment_infoInputEnvelope {
    data: BlogLikeCreateManySub_comment_infoInput | BlogLikeCreateManySub_comment_infoInput[]
    skipDuplicates?: boolean
  }

  export interface BlogCommentUpsertWithoutSub_commentsInput {
    update: XOR<BlogCommentUpdateWithoutSub_commentsInput, BlogCommentUncheckedUpdateWithoutSub_commentsInput>
    create: XOR<BlogCommentCreateWithoutSub_commentsInput, BlogCommentUncheckedCreateWithoutSub_commentsInput>
    where?: BlogCommentWhereInput
  }

  export interface BlogCommentUpdateToOneWithWhereWithoutSub_commentsInput {
    where?: BlogCommentWhereInput
    data: XOR<BlogCommentUpdateWithoutSub_commentsInput, BlogCommentUncheckedUpdateWithoutSub_commentsInput>
  }

  export interface BlogCommentUpdateWithoutSub_commentsInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    user_info?: UserUpdateOneWithoutCommentsNestedInput
    likes?: BlogLikeUpdateManyWithoutComment_infoNestedInput
    memo_info?: BlogMemoUpdateOneWithoutCommentsNestedInput
  }

  export interface BlogCommentUncheckedUpdateWithoutSub_commentsInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    memo_id?: NullableStringFieldUpdateOperationsInput | string | null
    likes?: BlogLikeUncheckedUpdateManyWithoutComment_infoNestedInput
  }

  export interface UserUpsertWithoutSub_commentsInput {
    update: XOR<UserUpdateWithoutSub_commentsInput, UserUncheckedUpdateWithoutSub_commentsInput>
    create: XOR<UserCreateWithoutSub_commentsInput, UserUncheckedCreateWithoutSub_commentsInput>
    where?: UserWhereInput
  }

  export interface UserUpdateToOneWithWhereWithoutSub_commentsInput {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSub_commentsInput, UserUncheckedUpdateWithoutSub_commentsInput>
  }

  export interface UserUpdateWithoutSub_commentsInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserUncheckedUpdateWithoutSub_commentsInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUncheckedUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUncheckedUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUncheckedUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUncheckedUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUncheckedUpdateManyWithoutUser_infoNestedInput
  }

  export interface BlogLikeUpsertWithWhereUniqueWithoutSub_comment_infoInput {
    where: BlogLikeWhereUniqueInput
    update: XOR<BlogLikeUpdateWithoutSub_comment_infoInput, BlogLikeUncheckedUpdateWithoutSub_comment_infoInput>
    create: XOR<BlogLikeCreateWithoutSub_comment_infoInput, BlogLikeUncheckedCreateWithoutSub_comment_infoInput>
  }

  export interface BlogLikeUpdateWithWhereUniqueWithoutSub_comment_infoInput {
    where: BlogLikeWhereUniqueInput
    data: XOR<BlogLikeUpdateWithoutSub_comment_infoInput, BlogLikeUncheckedUpdateWithoutSub_comment_infoInput>
  }

  export interface BlogLikeUpdateManyWithWhereWithoutSub_comment_infoInput {
    where: BlogLikeScalarWhereInput
    data: XOR<BlogLikeUpdateManyMutationInput, BlogLikeUncheckedUpdateManyWithoutSub_comment_infoInput>
  }

  export interface BlogSubCommentCreateWithoutLikesInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    reply_sub_comment_id?: string | null
    comment_info: BlogCommentCreateNestedOneWithoutSub_commentsInput
    user_info?: UserCreateNestedOneWithoutSub_commentsInput
  }

  export interface BlogSubCommentUncheckedCreateWithoutLikesInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    comment_id: string
    reply_sub_comment_id?: string | null
    user_id?: string | null
  }

  export interface BlogSubCommentCreateOrConnectWithoutLikesInput {
    where: BlogSubCommentWhereUniqueInput
    create: XOR<BlogSubCommentCreateWithoutLikesInput, BlogSubCommentUncheckedCreateWithoutLikesInput>
  }

  export interface BlogCommentCreateWithoutLikesInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    visitorName?: string | null
    user_info?: UserCreateNestedOneWithoutCommentsInput
    sub_comments?: BlogSubCommentCreateNestedManyWithoutComment_infoInput
    memo_info?: BlogMemoCreateNestedOneWithoutCommentsInput
  }

  export interface BlogCommentUncheckedCreateWithoutLikesInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    user_id?: string | null
    visitorName?: string | null
    memo_id?: string | null
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutComment_infoInput
  }

  export interface BlogCommentCreateOrConnectWithoutLikesInput {
    where: BlogCommentWhereUniqueInput
    create: XOR<BlogCommentCreateWithoutLikesInput, BlogCommentUncheckedCreateWithoutLikesInput>
  }

  export interface UserCreateWithoutLikesInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthCreateNestedManyWithoutUserInput
    tokens?: AccessTokenCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagCreateNestedManyWithoutUser_infoInput
  }

  export interface UserUncheckedCreateWithoutLikesInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentUncheckedCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthUncheckedCreateNestedManyWithoutUserInput
    tokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigUncheckedCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoUncheckedCreateNestedManyWithoutUser_infoInput
    tags?: MemoTagUncheckedCreateNestedManyWithoutUser_infoInput
  }

  export interface UserCreateOrConnectWithoutLikesInput {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
  }

  export interface BlogMemoCreateWithoutLikesInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    from?: string | null
    courier?: string | null
    user_info: UserCreateNestedOneWithoutMemosInput
    tags?: MemoTagRelationsCreateNestedManyWithoutMemoInput
    comments?: BlogCommentCreateNestedManyWithoutMemo_infoInput
  }

  export interface BlogMemoUncheckedCreateWithoutLikesInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    user_id: string
    from?: string | null
    courier?: string | null
    tags?: MemoTagRelationsUncheckedCreateNestedManyWithoutMemoInput
    comments?: BlogCommentUncheckedCreateNestedManyWithoutMemo_infoInput
  }

  export interface BlogMemoCreateOrConnectWithoutLikesInput {
    where: BlogMemoWhereUniqueInput
    create: XOR<BlogMemoCreateWithoutLikesInput, BlogMemoUncheckedCreateWithoutLikesInput>
  }

  export interface BlogSubCommentUpsertWithoutLikesInput {
    update: XOR<BlogSubCommentUpdateWithoutLikesInput, BlogSubCommentUncheckedUpdateWithoutLikesInput>
    create: XOR<BlogSubCommentCreateWithoutLikesInput, BlogSubCommentUncheckedCreateWithoutLikesInput>
    where?: BlogSubCommentWhereInput
  }

  export interface BlogSubCommentUpdateToOneWithWhereWithoutLikesInput {
    where?: BlogSubCommentWhereInput
    data: XOR<BlogSubCommentUpdateWithoutLikesInput, BlogSubCommentUncheckedUpdateWithoutLikesInput>
  }

  export interface BlogSubCommentUpdateWithoutLikesInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_info?: BlogCommentUpdateOneRequiredWithoutSub_commentsNestedInput
    user_info?: UserUpdateOneWithoutSub_commentsNestedInput
  }

  export interface BlogSubCommentUncheckedUpdateWithoutLikesInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    comment_id?: StringFieldUpdateOperationsInput | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogCommentUpsertWithoutLikesInput {
    update: XOR<BlogCommentUpdateWithoutLikesInput, BlogCommentUncheckedUpdateWithoutLikesInput>
    create: XOR<BlogCommentCreateWithoutLikesInput, BlogCommentUncheckedCreateWithoutLikesInput>
    where?: BlogCommentWhereInput
  }

  export interface BlogCommentUpdateToOneWithWhereWithoutLikesInput {
    where?: BlogCommentWhereInput
    data: XOR<BlogCommentUpdateWithoutLikesInput, BlogCommentUncheckedUpdateWithoutLikesInput>
  }

  export interface BlogCommentUpdateWithoutLikesInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    user_info?: UserUpdateOneWithoutCommentsNestedInput
    sub_comments?: BlogSubCommentUpdateManyWithoutComment_infoNestedInput
    memo_info?: BlogMemoUpdateOneWithoutCommentsNestedInput
  }

  export interface BlogCommentUncheckedUpdateWithoutLikesInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    memo_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutComment_infoNestedInput
  }

  export interface UserUpsertWithoutLikesInput {
    update: XOR<UserUpdateWithoutLikesInput, UserUncheckedUpdateWithoutLikesInput>
    create: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
    where?: UserWhereInput
  }

  export interface UserUpdateToOneWithWhereWithoutLikesInput {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLikesInput, UserUncheckedUpdateWithoutLikesInput>
  }

  export interface UserUpdateWithoutLikesInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserUncheckedUpdateWithoutLikesInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUncheckedUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUncheckedUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUncheckedUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUncheckedUpdateManyWithoutUser_infoNestedInput
    tags?: MemoTagUncheckedUpdateManyWithoutUser_infoNestedInput
  }

  export interface BlogMemoUpsertWithoutLikesInput {
    update: XOR<BlogMemoUpdateWithoutLikesInput, BlogMemoUncheckedUpdateWithoutLikesInput>
    create: XOR<BlogMemoCreateWithoutLikesInput, BlogMemoUncheckedCreateWithoutLikesInput>
    where?: BlogMemoWhereInput
  }

  export interface BlogMemoUpdateToOneWithWhereWithoutLikesInput {
    where?: BlogMemoWhereInput
    data: XOR<BlogMemoUpdateWithoutLikesInput, BlogMemoUncheckedUpdateWithoutLikesInput>
  }

  export interface BlogMemoUpdateWithoutLikesInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
    user_info?: UserUpdateOneRequiredWithoutMemosNestedInput
    tags?: MemoTagRelationsUpdateManyWithoutMemoNestedInput
    comments?: BlogCommentUpdateManyWithoutMemo_infoNestedInput
  }

  export interface BlogMemoUncheckedUpdateWithoutLikesInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MemoTagRelationsUncheckedUpdateManyWithoutMemoNestedInput
    comments?: BlogCommentUncheckedUpdateManyWithoutMemo_infoNestedInput
  }

  export interface UserCreateWithoutMemosInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthCreateNestedManyWithoutUserInput
    tokens?: AccessTokenCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigCreateNestedOneWithoutUserInfoInput
    tags?: MemoTagCreateNestedManyWithoutUser_infoInput
  }

  export interface UserUncheckedCreateWithoutMemosInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentUncheckedCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthUncheckedCreateNestedManyWithoutUserInput
    tokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigUncheckedCreateNestedOneWithoutUserInfoInput
    tags?: MemoTagUncheckedCreateNestedManyWithoutUser_infoInput
  }

  export interface UserCreateOrConnectWithoutMemosInput {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMemosInput, UserUncheckedCreateWithoutMemosInput>
  }

  export interface MemoTagRelationsCreateWithoutMemoInput {
    create_ts?: Date | string
    updated_ts?: Date | string
    tag: MemoTagCreateNestedOneWithoutMemosInput
  }

  export interface MemoTagRelationsUncheckedCreateWithoutMemoInput {
    tagId: string
    create_ts?: Date | string
    updated_ts?: Date | string
  }

  export interface MemoTagRelationsCreateOrConnectWithoutMemoInput {
    where: MemoTagRelationsWhereUniqueInput
    create: XOR<MemoTagRelationsCreateWithoutMemoInput, MemoTagRelationsUncheckedCreateWithoutMemoInput>
  }

  export interface MemoTagRelationsCreateManyMemoInputEnvelope {
    data: MemoTagRelationsCreateManyMemoInput | MemoTagRelationsCreateManyMemoInput[]
    skipDuplicates?: boolean
  }

  export interface BlogCommentCreateWithoutMemo_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    visitorName?: string | null
    user_info?: UserCreateNestedOneWithoutCommentsInput
    sub_comments?: BlogSubCommentCreateNestedManyWithoutComment_infoInput
    likes?: BlogLikeCreateNestedManyWithoutComment_infoInput
  }

  export interface BlogCommentUncheckedCreateWithoutMemo_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    user_id?: string | null
    visitorName?: string | null
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutComment_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutComment_infoInput
  }

  export interface BlogCommentCreateOrConnectWithoutMemo_infoInput {
    where: BlogCommentWhereUniqueInput
    create: XOR<BlogCommentCreateWithoutMemo_infoInput, BlogCommentUncheckedCreateWithoutMemo_infoInput>
  }

  export interface BlogCommentCreateManyMemo_infoInputEnvelope {
    data: BlogCommentCreateManyMemo_infoInput | BlogCommentCreateManyMemo_infoInput[]
    skipDuplicates?: boolean
  }

  export interface BlogLikeCreateWithoutBlogMemoInfoInput {
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_info?: BlogSubCommentCreateNestedOneWithoutLikesInput
    comment_info?: BlogCommentCreateNestedOneWithoutLikesInput
    user_info: UserCreateNestedOneWithoutLikesInput
  }

  export interface BlogLikeUncheckedCreateWithoutBlogMemoInfoInput {
    id?: number
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_id?: string | null
    comment_id?: string | null
    user_id: string
  }

  export interface BlogLikeCreateOrConnectWithoutBlogMemoInfoInput {
    where: BlogLikeWhereUniqueInput
    create: XOR<BlogLikeCreateWithoutBlogMemoInfoInput, BlogLikeUncheckedCreateWithoutBlogMemoInfoInput>
  }

  export interface BlogLikeCreateManyBlogMemoInfoInputEnvelope {
    data: BlogLikeCreateManyBlogMemoInfoInput | BlogLikeCreateManyBlogMemoInfoInput[]
    skipDuplicates?: boolean
  }

  export interface UserUpsertWithoutMemosInput {
    update: XOR<UserUpdateWithoutMemosInput, UserUncheckedUpdateWithoutMemosInput>
    create: XOR<UserCreateWithoutMemosInput, UserUncheckedCreateWithoutMemosInput>
    where?: UserWhereInput
  }

  export interface UserUpdateToOneWithWhereWithoutMemosInput {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMemosInput, UserUncheckedUpdateWithoutMemosInput>
  }

  export interface UserUpdateWithoutMemosInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUpdateOneWithoutUserInfoNestedInput
    tags?: MemoTagUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserUncheckedUpdateWithoutMemosInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUncheckedUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUncheckedUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUncheckedUpdateOneWithoutUserInfoNestedInput
    tags?: MemoTagUncheckedUpdateManyWithoutUser_infoNestedInput
  }

  export interface MemoTagRelationsUpsertWithWhereUniqueWithoutMemoInput {
    where: MemoTagRelationsWhereUniqueInput
    update: XOR<MemoTagRelationsUpdateWithoutMemoInput, MemoTagRelationsUncheckedUpdateWithoutMemoInput>
    create: XOR<MemoTagRelationsCreateWithoutMemoInput, MemoTagRelationsUncheckedCreateWithoutMemoInput>
  }

  export interface MemoTagRelationsUpdateWithWhereUniqueWithoutMemoInput {
    where: MemoTagRelationsWhereUniqueInput
    data: XOR<MemoTagRelationsUpdateWithoutMemoInput, MemoTagRelationsUncheckedUpdateWithoutMemoInput>
  }

  export interface MemoTagRelationsUpdateManyWithWhereWithoutMemoInput {
    where: MemoTagRelationsScalarWhereInput
    data: XOR<MemoTagRelationsUpdateManyMutationInput, MemoTagRelationsUncheckedUpdateManyWithoutMemoInput>
  }

  export interface MemoTagRelationsScalarWhereInput {
    AND?: MemoTagRelationsScalarWhereInput | MemoTagRelationsScalarWhereInput[]
    OR?: MemoTagRelationsScalarWhereInput[]
    NOT?: MemoTagRelationsScalarWhereInput | MemoTagRelationsScalarWhereInput[]
    tagId?: StringFilter<'MemoTagRelations'> | string
    memoId?: StringFilter<'MemoTagRelations'> | string
    create_ts?: DateTimeFilter<'MemoTagRelations'> | Date | string
    updated_ts?: DateTimeFilter<'MemoTagRelations'> | Date | string
  }

  export interface BlogCommentUpsertWithWhereUniqueWithoutMemo_infoInput {
    where: BlogCommentWhereUniqueInput
    update: XOR<BlogCommentUpdateWithoutMemo_infoInput, BlogCommentUncheckedUpdateWithoutMemo_infoInput>
    create: XOR<BlogCommentCreateWithoutMemo_infoInput, BlogCommentUncheckedCreateWithoutMemo_infoInput>
  }

  export interface BlogCommentUpdateWithWhereUniqueWithoutMemo_infoInput {
    where: BlogCommentWhereUniqueInput
    data: XOR<BlogCommentUpdateWithoutMemo_infoInput, BlogCommentUncheckedUpdateWithoutMemo_infoInput>
  }

  export interface BlogCommentUpdateManyWithWhereWithoutMemo_infoInput {
    where: BlogCommentScalarWhereInput
    data: XOR<BlogCommentUpdateManyMutationInput, BlogCommentUncheckedUpdateManyWithoutMemo_infoInput>
  }

  export interface BlogLikeUpsertWithWhereUniqueWithoutBlogMemoInfoInput {
    where: BlogLikeWhereUniqueInput
    update: XOR<BlogLikeUpdateWithoutBlogMemoInfoInput, BlogLikeUncheckedUpdateWithoutBlogMemoInfoInput>
    create: XOR<BlogLikeCreateWithoutBlogMemoInfoInput, BlogLikeUncheckedCreateWithoutBlogMemoInfoInput>
  }

  export interface BlogLikeUpdateWithWhereUniqueWithoutBlogMemoInfoInput {
    where: BlogLikeWhereUniqueInput
    data: XOR<BlogLikeUpdateWithoutBlogMemoInfoInput, BlogLikeUncheckedUpdateWithoutBlogMemoInfoInput>
  }

  export interface BlogLikeUpdateManyWithWhereWithoutBlogMemoInfoInput {
    where: BlogLikeScalarWhereInput
    data: XOR<BlogLikeUpdateManyMutationInput, BlogLikeUncheckedUpdateManyWithoutBlogMemoInfoInput>
  }

  export interface UserCreateWithoutTagsInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthCreateNestedManyWithoutUserInput
    tokens?: AccessTokenCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoCreateNestedManyWithoutUser_infoInput
  }

  export interface UserUncheckedCreateWithoutTagsInput {
    id?: string
    email?: string | null
    phone?: string | null
    username: string
    nickname?: string | null
    password: string
    avatar_url?: string | null
    website?: string | null
    role?: string
    status?: number
    comments?: BlogCommentUncheckedCreateNestedManyWithoutUser_infoInput
    sub_comments?: BlogSubCommentUncheckedCreateNestedManyWithoutUser_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutUser_infoInput
    oauth?: OAuthUncheckedCreateNestedManyWithoutUserInput
    tokens?: AccessTokenUncheckedCreateNestedManyWithoutUserInfoInput
    user_config?: UserConfigUncheckedCreateNestedOneWithoutUserInfoInput
    memos?: BlogMemoUncheckedCreateNestedManyWithoutUser_infoInput
  }

  export interface UserCreateOrConnectWithoutTagsInput {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
  }

  export interface MemoTagRelationsCreateWithoutTagInput {
    create_ts?: Date | string
    updated_ts?: Date | string
    memo: BlogMemoCreateNestedOneWithoutTagsInput
  }

  export interface MemoTagRelationsUncheckedCreateWithoutTagInput {
    memoId: string
    create_ts?: Date | string
    updated_ts?: Date | string
  }

  export interface MemoTagRelationsCreateOrConnectWithoutTagInput {
    where: MemoTagRelationsWhereUniqueInput
    create: XOR<MemoTagRelationsCreateWithoutTagInput, MemoTagRelationsUncheckedCreateWithoutTagInput>
  }

  export interface MemoTagRelationsCreateManyTagInputEnvelope {
    data: MemoTagRelationsCreateManyTagInput | MemoTagRelationsCreateManyTagInput[]
    skipDuplicates?: boolean
  }

  export interface UserUpsertWithoutTagsInput {
    update: XOR<UserUpdateWithoutTagsInput, UserUncheckedUpdateWithoutTagsInput>
    create: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
    where?: UserWhereInput
  }

  export interface UserUpdateToOneWithWhereWithoutTagsInput {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTagsInput, UserUncheckedUpdateWithoutTagsInput>
  }

  export interface UserUpdateWithoutTagsInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUpdateManyWithoutUser_infoNestedInput
  }

  export interface UserUncheckedUpdateWithoutTagsInput {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    username?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    comments?: BlogCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutUser_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutUser_infoNestedInput
    oauth?: OAuthUncheckedUpdateManyWithoutUserNestedInput
    tokens?: AccessTokenUncheckedUpdateManyWithoutUserInfoNestedInput
    user_config?: UserConfigUncheckedUpdateOneWithoutUserInfoNestedInput
    memos?: BlogMemoUncheckedUpdateManyWithoutUser_infoNestedInput
  }

  export interface MemoTagRelationsUpsertWithWhereUniqueWithoutTagInput {
    where: MemoTagRelationsWhereUniqueInput
    update: XOR<MemoTagRelationsUpdateWithoutTagInput, MemoTagRelationsUncheckedUpdateWithoutTagInput>
    create: XOR<MemoTagRelationsCreateWithoutTagInput, MemoTagRelationsUncheckedCreateWithoutTagInput>
  }

  export interface MemoTagRelationsUpdateWithWhereUniqueWithoutTagInput {
    where: MemoTagRelationsWhereUniqueInput
    data: XOR<MemoTagRelationsUpdateWithoutTagInput, MemoTagRelationsUncheckedUpdateWithoutTagInput>
  }

  export interface MemoTagRelationsUpdateManyWithWhereWithoutTagInput {
    where: MemoTagRelationsScalarWhereInput
    data: XOR<MemoTagRelationsUpdateManyMutationInput, MemoTagRelationsUncheckedUpdateManyWithoutTagInput>
  }

  export interface MemoTagCreateWithoutMemosInput {
    id?: string
    tag_name: string
    create_ts?: Date | string
    updated_ts?: Date | string
    user_info: UserCreateNestedOneWithoutTagsInput
  }

  export interface MemoTagUncheckedCreateWithoutMemosInput {
    id?: string
    tag_name: string
    create_ts?: Date | string
    updated_ts?: Date | string
    user_id: string
  }

  export interface MemoTagCreateOrConnectWithoutMemosInput {
    where: MemoTagWhereUniqueInput
    create: XOR<MemoTagCreateWithoutMemosInput, MemoTagUncheckedCreateWithoutMemosInput>
  }

  export interface BlogMemoCreateWithoutTagsInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    from?: string | null
    courier?: string | null
    user_info: UserCreateNestedOneWithoutMemosInput
    comments?: BlogCommentCreateNestedManyWithoutMemo_infoInput
    likes?: BlogLikeCreateNestedManyWithoutBlogMemoInfoInput
  }

  export interface BlogMemoUncheckedCreateWithoutTagsInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    user_id: string
    from?: string | null
    courier?: string | null
    comments?: BlogCommentUncheckedCreateNestedManyWithoutMemo_infoInput
    likes?: BlogLikeUncheckedCreateNestedManyWithoutBlogMemoInfoInput
  }

  export interface BlogMemoCreateOrConnectWithoutTagsInput {
    where: BlogMemoWhereUniqueInput
    create: XOR<BlogMemoCreateWithoutTagsInput, BlogMemoUncheckedCreateWithoutTagsInput>
  }

  export interface MemoTagUpsertWithoutMemosInput {
    update: XOR<MemoTagUpdateWithoutMemosInput, MemoTagUncheckedUpdateWithoutMemosInput>
    create: XOR<MemoTagCreateWithoutMemosInput, MemoTagUncheckedCreateWithoutMemosInput>
    where?: MemoTagWhereInput
  }

  export interface MemoTagUpdateToOneWithWhereWithoutMemosInput {
    where?: MemoTagWhereInput
    data: XOR<MemoTagUpdateWithoutMemosInput, MemoTagUncheckedUpdateWithoutMemosInput>
  }

  export interface MemoTagUpdateWithoutMemosInput {
    id?: StringFieldUpdateOperationsInput | string
    tag_name?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    user_info?: UserUpdateOneRequiredWithoutTagsNestedInput
  }

  export interface MemoTagUncheckedUpdateWithoutMemosInput {
    id?: StringFieldUpdateOperationsInput | string
    tag_name?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export interface BlogMemoUpsertWithoutTagsInput {
    update: XOR<BlogMemoUpdateWithoutTagsInput, BlogMemoUncheckedUpdateWithoutTagsInput>
    create: XOR<BlogMemoCreateWithoutTagsInput, BlogMemoUncheckedCreateWithoutTagsInput>
    where?: BlogMemoWhereInput
  }

  export interface BlogMemoUpdateToOneWithWhereWithoutTagsInput {
    where?: BlogMemoWhereInput
    data: XOR<BlogMemoUpdateWithoutTagsInput, BlogMemoUncheckedUpdateWithoutTagsInput>
  }

  export interface BlogMemoUpdateWithoutTagsInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
    user_info?: UserUpdateOneRequiredWithoutMemosNestedInput
    comments?: BlogCommentUpdateManyWithoutMemo_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutBlogMemoInfoNestedInput
  }

  export interface BlogMemoUncheckedUpdateWithoutTagsInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: BlogCommentUncheckedUpdateManyWithoutMemo_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutBlogMemoInfoNestedInput
  }

  export interface BlogCommentCreateManyUser_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    visitorName?: string | null
    memo_id?: string | null
  }

  export interface BlogSubCommentCreateManyUser_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    comment_id: string
    reply_sub_comment_id?: string | null
  }

  export interface BlogLikeCreateManyUser_infoInput {
    id?: number
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_id?: string | null
    comment_id?: string | null
    blogMemoId?: string | null
  }

  export interface OAuthCreateManyUserInput {
    id?: string
    provider: string
    providerId: string
    providerUnionId?: string | null
    providerToken?: string | null
    providerRefreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface AccessTokenCreateManyUserInfoInput {
    id?: string
    token: string
    roles?: string
    status?: number
    scope?: string
    isRevoked?: boolean
    ip?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export interface BlogMemoCreateManyUser_infoInput {
    id?: string
    content?: string | null
    create_ts?: Date | string
    updated_ts?: Date | string
    visible?: string
    defalt_floded?: boolean
    flod_tip?: string | null
    from?: string | null
    courier?: string | null
  }

  export interface MemoTagCreateManyUser_infoInput {
    id?: string
    tag_name: string
    create_ts?: Date | string
    updated_ts?: Date | string
  }

  export interface BlogCommentUpdateWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comments?: BlogSubCommentUpdateManyWithoutComment_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutComment_infoNestedInput
    memo_info?: BlogMemoUpdateOneWithoutCommentsNestedInput
  }

  export interface BlogCommentUncheckedUpdateWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    memo_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutComment_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutComment_infoNestedInput
  }

  export interface BlogCommentUncheckedUpdateManyWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    memo_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogSubCommentUpdateWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_info?: BlogCommentUpdateOneRequiredWithoutSub_commentsNestedInput
    likes?: BlogLikeUpdateManyWithoutSub_comment_infoNestedInput
  }

  export interface BlogSubCommentUncheckedUpdateWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    comment_id?: StringFieldUpdateOperationsInput | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    likes?: BlogLikeUncheckedUpdateManyWithoutSub_comment_infoNestedInput
  }

  export interface BlogSubCommentUncheckedUpdateManyWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    comment_id?: StringFieldUpdateOperationsInput | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogLikeUpdateWithoutUser_infoInput {
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_info?: BlogSubCommentUpdateOneWithoutLikesNestedInput
    comment_info?: BlogCommentUpdateOneWithoutLikesNestedInput
    blogMemoInfo?: BlogMemoUpdateOneWithoutLikesNestedInput
  }

  export interface BlogLikeUncheckedUpdateWithoutUser_infoInput {
    id?: IntFieldUpdateOperationsInput | number
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    blogMemoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogLikeUncheckedUpdateManyWithoutUser_infoInput {
    id?: IntFieldUpdateOperationsInput | number
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    blogMemoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface OAuthUpdateWithoutUserInput {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    providerUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerToken?: NullableStringFieldUpdateOperationsInput | string | null
    providerRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface OAuthUncheckedUpdateWithoutUserInput {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    providerUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerToken?: NullableStringFieldUpdateOperationsInput | string | null
    providerRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface OAuthUncheckedUpdateManyWithoutUserInput {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    providerUnionId?: NullableStringFieldUpdateOperationsInput | string | null
    providerToken?: NullableStringFieldUpdateOperationsInput | string | null
    providerRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface AccessTokenUpdateWithoutUserInfoInput {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    roles?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    scope?: StringFieldUpdateOperationsInput | string
    isRevoked?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface AccessTokenUncheckedUpdateWithoutUserInfoInput {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    roles?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    scope?: StringFieldUpdateOperationsInput | string
    isRevoked?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface AccessTokenUncheckedUpdateManyWithoutUserInfoInput {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    roles?: StringFieldUpdateOperationsInput | string
    status?: IntFieldUpdateOperationsInput | number
    scope?: StringFieldUpdateOperationsInput | string
    isRevoked?: BoolFieldUpdateOperationsInput | boolean
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface BlogMemoUpdateWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MemoTagRelationsUpdateManyWithoutMemoNestedInput
    comments?: BlogCommentUpdateManyWithoutMemo_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutBlogMemoInfoNestedInput
  }

  export interface BlogMemoUncheckedUpdateWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MemoTagRelationsUncheckedUpdateManyWithoutMemoNestedInput
    comments?: BlogCommentUncheckedUpdateManyWithoutMemo_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutBlogMemoInfoNestedInput
  }

  export interface BlogMemoUncheckedUpdateManyWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    visible?: StringFieldUpdateOperationsInput | string
    defalt_floded?: BoolFieldUpdateOperationsInput | boolean
    flod_tip?: NullableStringFieldUpdateOperationsInput | string | null
    from?: NullableStringFieldUpdateOperationsInput | string | null
    courier?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface MemoTagUpdateWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    tag_name?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    memos?: MemoTagRelationsUpdateManyWithoutTagNestedInput
  }

  export interface MemoTagUncheckedUpdateWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    tag_name?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    memos?: MemoTagRelationsUncheckedUpdateManyWithoutTagNestedInput
  }

  export interface MemoTagUncheckedUpdateManyWithoutUser_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    tag_name?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface BlogSubCommentCreateManyComment_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    reply_sub_comment_id?: string | null
    user_id?: string | null
  }

  export interface BlogLikeCreateManyComment_infoInput {
    id?: number
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_id?: string | null
    user_id: string
    blogMemoId?: string | null
  }

  export interface BlogSubCommentUpdateWithoutComment_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_info?: UserUpdateOneWithoutSub_commentsNestedInput
    likes?: BlogLikeUpdateManyWithoutSub_comment_infoNestedInput
  }

  export interface BlogSubCommentUncheckedUpdateWithoutComment_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    likes?: BlogLikeUncheckedUpdateManyWithoutSub_comment_infoNestedInput
  }

  export interface BlogSubCommentUncheckedUpdateManyWithoutComment_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    reply_sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogLikeUpdateWithoutComment_infoInput {
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_info?: BlogSubCommentUpdateOneWithoutLikesNestedInput
    user_info?: UserUpdateOneRequiredWithoutLikesNestedInput
    blogMemoInfo?: BlogMemoUpdateOneWithoutLikesNestedInput
  }

  export interface BlogLikeUncheckedUpdateWithoutComment_infoInput {
    id?: IntFieldUpdateOperationsInput | number
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    blogMemoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogLikeUncheckedUpdateManyWithoutComment_infoInput {
    id?: IntFieldUpdateOperationsInput | number
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    blogMemoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogLikeCreateManySub_comment_infoInput {
    id?: number
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    comment_id?: string | null
    user_id: string
    blogMemoId?: string | null
  }

  export interface BlogLikeUpdateWithoutSub_comment_infoInput {
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_info?: BlogCommentUpdateOneWithoutLikesNestedInput
    user_info?: UserUpdateOneRequiredWithoutLikesNestedInput
    blogMemoInfo?: BlogMemoUpdateOneWithoutLikesNestedInput
  }

  export interface BlogLikeUncheckedUpdateWithoutSub_comment_infoInput {
    id?: IntFieldUpdateOperationsInput | number
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    blogMemoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogLikeUncheckedUpdateManyWithoutSub_comment_infoInput {
    id?: IntFieldUpdateOperationsInput | number
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    blogMemoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface MemoTagRelationsCreateManyMemoInput {
    tagId: string
    create_ts?: Date | string
    updated_ts?: Date | string
  }

  export interface BlogCommentCreateManyMemo_infoInput {
    id?: string
    content: string
    create_ts?: Date | string
    updated_ts?: Date | string
    type?: string
    quoteContent?: string | null
    article_id?: string | null
    user_id?: string | null
    visitorName?: string | null
  }

  export interface BlogLikeCreateManyBlogMemoInfoInput {
    id?: number
    create_ts?: Date | string
    updated_ts?: Date | string
    target?: string
    article_id?: string | null
    sub_comment_id?: string | null
    comment_id?: string | null
    user_id: string
  }

  export interface MemoTagRelationsUpdateWithoutMemoInput {
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    tag?: MemoTagUpdateOneRequiredWithoutMemosNestedInput
  }

  export interface MemoTagRelationsUncheckedUpdateWithoutMemoInput {
    tagId?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface MemoTagRelationsUncheckedUpdateManyWithoutMemoInput {
    tagId?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface BlogCommentUpdateWithoutMemo_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    user_info?: UserUpdateOneWithoutCommentsNestedInput
    sub_comments?: BlogSubCommentUpdateManyWithoutComment_infoNestedInput
    likes?: BlogLikeUpdateManyWithoutComment_infoNestedInput
  }

  export interface BlogCommentUncheckedUpdateWithoutMemo_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comments?: BlogSubCommentUncheckedUpdateManyWithoutComment_infoNestedInput
    likes?: BlogLikeUncheckedUpdateManyWithoutComment_infoNestedInput
  }

  export interface BlogCommentUncheckedUpdateManyWithoutMemo_infoInput {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    quoteContent?: NullableStringFieldUpdateOperationsInput | string | null
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    visitorName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export interface BlogLikeUpdateWithoutBlogMemoInfoInput {
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_info?: BlogSubCommentUpdateOneWithoutLikesNestedInput
    comment_info?: BlogCommentUpdateOneWithoutLikesNestedInput
    user_info?: UserUpdateOneRequiredWithoutLikesNestedInput
  }

  export interface BlogLikeUncheckedUpdateWithoutBlogMemoInfoInput {
    id?: IntFieldUpdateOperationsInput | number
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export interface BlogLikeUncheckedUpdateManyWithoutBlogMemoInfoInput {
    id?: IntFieldUpdateOperationsInput | number
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    article_id?: NullableStringFieldUpdateOperationsInput | string | null
    sub_comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    comment_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export interface MemoTagRelationsCreateManyTagInput {
    memoId: string
    create_ts?: Date | string
    updated_ts?: Date | string
  }

  export interface MemoTagRelationsUpdateWithoutTagInput {
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    memo?: BlogMemoUpdateOneRequiredWithoutTagsNestedInput
  }

  export interface MemoTagRelationsUncheckedUpdateWithoutTagInput {
    memoId?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export interface MemoTagRelationsUncheckedUpdateManyWithoutTagInput {
    memoId?: StringFieldUpdateOperationsInput | string
    create_ts?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_ts?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export interface BatchPayload {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
