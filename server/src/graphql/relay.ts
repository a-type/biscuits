export function assignTypeName<Typename extends string>(typename: Typename) {
  return function <Obj extends {}>(obj: Obj): Obj & { __typename: Typename } {
    return Object.assign(obj, { __typename: typename });
  };
}

export function hasTypeName(name: string) {
  return function (obj: any) {
    return obj.__typename === name;
  };
}
