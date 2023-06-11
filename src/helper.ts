import jscodeshift from 'jscodeshift';

export function markLocationForContents(
  contents: string,
  pathname: string
): string {
  // // 使用正则匹配的方式
  // const lines = contents.split('\n');
  // let result = '';

  // lines.forEach((line, index) => {
  //   const tagRegex = /<([a-zA-Z]+)(\s[^<>]*?)?>/g;
  //   const lineNumber = index + 1;
  //   const modifiedLine = line.replace(
  //     tagRegex,
  //     (_match, tagName, attributes) => {
  //       return `<${tagName} data-path="${pathname}:${lineNumber}"${
  //         attributes ? attributes : ''
  //       }>`;
  //     }
  //   );
  //   result += modifiedLine + '\n';
  // });

  // return result;

  const j = jscodeshift.withParser('tsx');
  const root = j(contents);

  root.find(j.JSXOpeningElement).forEach((path, index) => {
    const lineNumber = path?.value?.loc?.start.line;
    let dataPathValue;

    // if (index === 0) {
    //   dataPathValue = `${pathname}:${lineNumber}`;
    // } else {
    //   dataPathValue = `:${lineNumber}`;
    // }

    dataPathValue = `${pathname}:${lineNumber}`;

    const dataPathAttribute = j.jsxAttribute(
      j.jsxIdentifier('data-oep-path'),
      j.literal(dataPathValue)
    );
    path?.value?.attributes?.push(dataPathAttribute);
  });

  const result = root.toSource({ quote: 'single' });
  return result;
}

export const dynamicImport = new Function(
  'modulePath',
  'return import(modulePath)'
);
