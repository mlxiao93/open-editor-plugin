import webpack from 'webpack';
import { markLocationForContents } from './helper';

export default function openEditorLoader(
  this: webpack.LoaderContext<{}>,
  contents: string
) {
  return markLocationForContents(contents, this.resourcePath);
}
