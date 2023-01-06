export const compareUrl = ({
  reqUrl,
  routUrl,
  isDynamicUrl,
}: {
  reqUrl: string;
  routUrl: string;
  isDynamicUrl: boolean;
}) => {
  if (routUrl === "*") {
    return true;
  }
  if (!isDynamicUrl) {
    return reqUrl === routUrl;
  }

  const _newUrl: string[] = reqUrl.split("/");
  const _oldUrl: string[] = routUrl.split("/");
  const _generatedUrl = _oldUrl
    .map((point, index) => (point.startsWith(":") ? _newUrl[index] : point))
    .join("/");
  return reqUrl === _generatedUrl;
};

export const parseUrl = (
  reqURL: string,
  routURL: string
): Record<string, string> => {
  const _reqURL = reqURL.split("/");
  const _routURL = routURL.split("/");
  return _routURL.reduce(
    (acc, point, index) =>
      point.startsWith(":")
        ? { ...acc, [point.substring(1)]: _reqURL[index] }
        : acc,
    {}
  );
};
