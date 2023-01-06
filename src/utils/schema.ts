import { BodyType } from "../types";

const _validBodyType = {
  name: "string",
  age: "number",
  hobbies: ["string"],
};

type ResultType = {
  error: boolean;
  notValidFields: string[];
  fields: BodyType | null;
};

export const validateSchema = (data: BodyType) => {
  const dataFieldKey = Object.keys(data || {});
  const _validBodyKeys = Object.keys(_validBodyType);

  if (dataFieldKey.length) {
    const _result = _validBodyKeys.reduce(
      (acc: ResultType, field: keyof BodyType): ResultType => {
        if (field === "hobbies") {
          return Array.isArray(data[field])
            ? { ...acc, fields: { ...acc.fields, hobbies: data[field] } }
            : {
                error: true,
                notValidFields: [...acc.notValidFields, field],
                fields: null,
              };
        }
        return typeof data[field] === _validBodyType[field]
          ? { ...acc, fields: { ...acc.fields, [field]: data[field] } }
          : {
              error: true,
              notValidFields: [...acc.notValidFields, field],
              fields: null,
            };
      },
      { error: false, notValidFields: [], fields: null }
    );
    return _result;
  }

  return { error: true, notValidFields: ["Add require field"], fields: null };
};
