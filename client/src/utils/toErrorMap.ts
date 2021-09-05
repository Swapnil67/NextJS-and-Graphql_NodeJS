import { FieldError } from "../generated/graphql"

export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {}; // error map is an object string key and string value
  errors.forEach(({field, message}) => {
    errorMap[field] = message;
  })
  return errorMap;
}